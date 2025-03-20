import { PrimeIcons } from "primereact/api";
import { Button } from "primereact/button";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
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
import CustomToast from "../components/CustomToast";

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
      navigate("/tickets");
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
              summary: "There was a problem in ",
            });

            return;
          }

          setUser(userData);
          setIsLoggedIn(true);

          toastRef.current?.show({
            severity: "info",
            summary: "Login Successful",
          });

          navigate("/tickets");
        }
      }
    } catch (error) {
      const {
        status,
        response: {
          data: { message },
        },
      } = error as {
        response: { data: { message: string; error: string } };
        status: number;
      };

      if (status === 429) {
        toastRef.current?.show({
          severity: "error",
          summary: "Please wait",
          detail: message,
        });

        return;
      }

      handleLoginError(error, toastRef);
    }
  };

  return (
    <PageTemplate>
      <CustomToast ref={toastRef} />
      <main className="grid h-full place-content-center">
        <form
          onSubmit={handleSubmit(handleLogin)}
          className="flex flex-col items-center gap-3 border rounded shadow-md p-9 border-slate-600 bg-slate-900/40 w-96 shadow-blue-500/30"
        >
          <div className="grid border-2 shadow-xl w-14 h-14 border-slate-600 place-content-center rounded-2xl">
            <i className={`${PrimeIcons.SIGN_IN} text-2xl text-slate-100`} />
          </div>
          <h3 className="text-xl font-bold text-slate-100">Welcome back</h3>

          <h4 className="text-center text-slate-400">
            Manage the room content and details by logging in
          </h4>
          <div className="flex flex-col w-full gap-1">
            <div className="h-24">
              <label
                htmlFor="emailInput"
                className="text-sm font-semibold text-blue-400"
              >
                Username
              </label>
              <IconField id="emailInput" iconPosition="left">
                <InputIcon className={`${PrimeIcons.ID_CARD}`}></InputIcon>
                <InputText
                  {...register("username", { required: true })}
                  id="emailInput"
                  placeholder="JFLORES"
                  className="w-full bg-inherit border-slate-600 text-slate-100 hover:border-blue-400"
                />
              </IconField>
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

            <div className="h-24">
              <label
                htmlFor="passwordInput"
                className="text-sm font-semibold text-blue-400"
              >
                Password
              </label>
              <IconField id="passwordInput" iconPosition="left">
                <InputIcon
                  id="passwordInput"
                  className="pi pi-lock"
                ></InputIcon>
                <InputText
                  {...register("password", { required: true })}
                  placeholder="*********"
                  className="w-full text-slate-100 bg-inherit border-slate-600 hover:border-blue-400"
                  type="password"
                />
              </IconField>
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
          <div className="flex justify-end w-full">
            <Link
              to={"/forgot-password"}
              className="text-sm text-blue-400 text-end hover:text-blue-600 hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <Button
            className="flex justify-center w-full gap-3 font-bold"
            type="submit"
          >
            Sign in
          </Button>
        </form>
      </main>
    </PageTemplate>
  );
};

export default LoginPage;
