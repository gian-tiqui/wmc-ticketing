import { PrimeIcons } from "primereact/api";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Link, useNavigate } from "react-router-dom";
import PageTemplate from "../templates/PageTemplate";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { Namespace, URI } from "../@utils/enums/enum";
import { Toast } from "primereact/toast";
import handleLoginError from "../@utils/functions/handleErrors";
import Cookies from "js-cookie";
import useLoggedInStore from "../@utils/store/loggedIn";
import isAuthenticated from "../@utils/functions/isAuthenticated";
import { jwtDecode } from "jwt-decode";
import useUserDataStore from "../@utils/store/userDataStore";
import extractUserData from "../@utils/functions/extractUserData";
import axios from "axios";
import wmcLogo from "../assets/wmcLogo.png";
import CustomToast from "../components/CustomToast";
import navigateBasedOnRole from "../@utils/functions/navigateBasedOnRole";
import { Image } from "primereact/image";

interface FormFields {
  username: string;
  password: string;
}

const LoginPage = () => {
  const { setIsLoggedIn } = useLoggedInStore();
  const { user, setUser } = useUserDataStore();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormFields>();
  const toastRef = useRef<Toast>(null);

  useEffect(() => {
    if (isAuthenticated()) {
      if (user) navigateBasedOnRole(user, navigate);
      return;
    }
  }, [navigate, user]);

  const handleLogin = async ({ username, password }: FormFields) => {
    try {
      const response = await axios.post(`${URI.API_URI}/api/v1/auth/login`, {
        username,
        password,
      });

      if (response.status === 201) {
        const { accessToken, refreshToken } = response.data.tokens;

        if (accessToken && refreshToken) {
          localStorage.setItem(Namespace.BASE, accessToken);

          const { exp } = jwtDecode(refreshToken);
          const currentTimestamp = Math.floor(Date.now() / 1000);

          if (!exp) return;

          const expires = Math.floor((exp - currentTimestamp) / (60 * 60 * 24));
          Cookies.set(Namespace.BASE, refreshToken, { expires });

          const userData = extractUserData();

          if (!userData) {
            toastRef.current?.show({
              severity: "error",
              summary: "Failed to extract user data",
            });
            return;
          }

          setUser(userData);
          setIsLoggedIn(true);

          toastRef.current?.show({
            severity: "info",
            summary: "Login Successful",
          });

          navigateBasedOnRole(userData, navigate);
        }
      }
    } catch (error) {
      handleLoginError(error, toastRef);
    }
  };

  return (
    <PageTemplate>
      <CustomToast ref={toastRef} />
      <main className="w-screen">
        <form
          onSubmit={handleSubmit(handleLogin)}
          className="flex flex-col relative pt-28 items-center h-screen gap-3 border rounded shadow-md p-9 bg-[#EEEEEE] w-[425px]"
        >
          <div
            onClick={() => navigate("/")}
            className="absolute top-0 right-0 flex items-center w-full h-20 gap-3 px-6 cursor-pointer"
          >
            <Image src={wmcLogo} alt="wmc-logo" className="w-10 h-10" />
            <h4 className="text-2xl font-semibold text-blue-600">
              Westlake Medical Center
            </h4>
          </div>
          <div className="w-80">
            <p className="mb-1 text-3xl font-medium text-blue-600">
              Welcome back!
            </p>
            <p className="text-sm">Sign in to your account</p>
          </div>
          <div className="flex flex-col items-center w-full gap-1">
            <div className="h-24 w-80">
              <label htmlFor="emailInput" className="text-xs font-semibold">
                Username
              </label>

              <InputText
                {...register("username", { required: true })}
                id="emailInput"
                placeholder="APAGASA"
                className="h-12 px-5 text-xs bg-white w-80 bg-inherit border-slate-600 hover:border-blue-400"
              />
              {errors.username && (
                <small className="flex items-center gap-1 mt-1">
                  <i
                    className={`${PrimeIcons.EXCLAMATION_CIRCLE} text-sm text-red-400`}
                  ></i>
                  <p className="font-medium text-red-400">
                    Username is required.
                  </p>
                </small>
              )}
            </div>

            <div className="h-24 mx-auto w-80">
              <label htmlFor="passwordInput" className="text-xs font-semibold">
                Password
              </label>

              <InputText
                {...register("password", { required: true })}
                placeholder="*********"
                className="h-12 px-5 text-xs bg-white w-80 bg-inherit border-slate-600 hover:border-blue-400"
                type="password"
              />
              {errors.password && (
                <small className="flex items-center gap-1 mt-1">
                  <i
                    className={`${PrimeIcons.EXCLAMATION_CIRCLE} text-sm text-red-400`}
                  ></i>
                  <p className="font-medium text-red-400">
                    Password is required
                  </p>
                </small>
              )}
            </div>
          </div>

          <Button
            className="flex justify-center gap-3 mx-auto font-bold bg-blue-600 w-80"
            type="submit"
          >
            Sign in
          </Button>
          <div className="flex justify-center w-80">
            <p className="text-sm">
              Forgot your password?{" "}
              <Link
                to={"/forgot-password"}
                className="text-sm text-blue-600 text-end hover:text-blue-600 hover:underline"
              >
                Click me
              </Link>{" "}
            </p>
          </div>
          <footer className="absolute bottom-0 h-20 px-5 -translate-x-1/2 w-[83%] left-1/2">
            <hr className="w-full mb-2 border-black border-b/1" />
            <p className="mb-1 text-xs font-medium">
              Copyrights 2025 All Rights Reserved
            </p>
            <p className="text-xs font-medium text-blue-600">
              Westlake Medical Center
            </p>
          </footer>
        </form>
      </main>
    </PageTemplate>
  );
};

export default LoginPage;
