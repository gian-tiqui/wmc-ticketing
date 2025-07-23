import { PrimeIcons } from "primereact/api";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Link, useNavigate } from "react-router-dom";
import PageTemplate from "../templates/PageTemplate";
import { useEffect, useRef, useState } from "react";
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

  // UI states
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [focusedField, setFocusedField] = useState<string>("");

  useEffect(() => {
    if (isAuthenticated()) {
      if (user) navigateBasedOnRole(user, navigate);
      return;
    }
  }, [navigate, user]);

  useEffect(() => {
    // Smooth entrance animation
    setIsLoaded(true);
  }, []);

  const handleLogin = async ({ username, password }: FormFields) => {
    try {
      setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageTemplate>
      <CustomToast ref={toastRef} />

      {/* Main Container - Centered Design */}
      <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-100 via-blue-50 to-cyan-100">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Floating Geometric Shapes */}
          <div className="absolute w-32 h-32 rounded-full top-20 left-10 bg-gradient-to-r from-blue-400/10 to-cyan-400/10 blur-xl animate-pulse"></div>
          <div
            className="absolute w-24 h-24 rounded-lg top-40 right-20 bg-gradient-to-r from-purple-400/10 to-pink-400/10 blur-lg animate-bounce"
            style={{ animationDuration: "3s" }}
          ></div>
          <div
            className="absolute w-20 h-20 rounded-full bottom-32 left-20 bg-gradient-to-r from-green-400/10 to-blue-400/10 blur-lg animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="absolute rounded-lg bottom-20 right-10 w-28 h-28 bg-gradient-to-r from-yellow-400/10 to-orange-400/10 blur-xl animate-bounce"
            style={{ animationDuration: "4s", animationDelay: "2s" }}
          ></div>

          {/* Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
        </div>

        {/* Centered Content */}
        <div className="flex items-center justify-center min-h-screen p-4">
          <div
            className="w-full max-w-md"
            style={{
              opacity: isLoaded ? 1 : 0,
              transform: `translateY(${isLoaded ? 0 : 20}px)`,
              transition: "all 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            {/* Login Card */}
            <div className="relative p-8 border shadow-2xl bg-white/70 backdrop-blur-xl rounded-3xl border-white/20 lg:p-10">
              {/* Floating Header */}
              <div className="mb-8 text-center">
                {/* Logo Container */}
                <div className="inline-flex items-center justify-center w-20 h-20 mb-6 transition-transform duration-300 transform shadow-xl bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl hover:scale-105">
                  <Image
                    src={wmcLogo}
                    alt="WMC Logo"
                    className="object-cover w-12 h-12 rounded-lg"
                  />
                </div>

                {/* Welcome Text */}
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold text-transparent lg:text-4xl bg-gradient-to-r from-gray-900 via-blue-800 to-cyan-700 bg-clip-text">
                    Welcome Back
                  </h1>
                  <p className="font-medium text-gray-600">
                    WMC Ticketing System
                  </p>
                  <div className="w-16 h-1 mx-auto rounded-full bg-gradient-to-r from-blue-500 to-cyan-500"></div>
                </div>
              </div>

              {/* Login Form */}
              <form onSubmit={handleSubmit(handleLogin)} className="space-y-6">
                {/* Username Field */}
                <div className="space-y-2">
                  <label className="block mb-2 text-sm font-semibold text-gray-700">
                    Username
                  </label>
                  <div className="relative group">
                    <div className="absolute transition-all duration-300 transform -translate-y-1/2 left-4 top-1/2">
                      <i
                        className={`${PrimeIcons.USER} text-lg ${
                          focusedField === "username"
                            ? "text-blue-600 scale-110"
                            : "text-gray-400"
                        }`}
                      />
                    </div>
                    <InputText
                      {...register("username", { required: true })}
                      placeholder="Enter your username"
                      onFocus={() => setFocusedField("username")}
                      onBlur={() => setFocusedField("")}
                      className={`w-full pl-12 pr-4 h-14 bg-white/60 backdrop-blur-sm border-2 rounded-xl 
                        placeholder-gray-500 text-gray-900 font-medium transition-all duration-300
                        focus:outline-none focus:bg-white focus:border-blue-500 focus:shadow-lg focus:shadow-blue-500/20
                        hover:bg-white/80 hover:border-gray-300
                        ${
                          errors.username ? "border-red-300" : "border-gray-200"
                        }
                      `}
                    />
                  </div>
                  {errors.username && (
                    <div className="flex items-center gap-2 text-sm font-medium text-red-500 animate-pulse">
                      <i
                        className={`${PrimeIcons.EXCLAMATION_CIRCLE} text-sm`}
                      />
                      Username is required
                    </div>
                  )}
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <label className="block mb-2 text-sm font-semibold text-gray-700">
                    Password
                  </label>
                  <div className="relative group">
                    <div className="absolute transition-all duration-300 transform -translate-y-1/2 left-4 top-1/2">
                      <i
                        className={`${PrimeIcons.LOCK} text-lg ${
                          focusedField === "password"
                            ? "text-blue-600 scale-110"
                            : "text-gray-400"
                        }`}
                      />
                    </div>
                    <InputText
                      {...register("password", { required: true })}
                      placeholder="Enter your password"
                      type={showPassword ? "text" : "password"}
                      onFocus={() => setFocusedField("password")}
                      onBlur={() => setFocusedField("")}
                      className={`w-full pl-12 pr-12 h-14 bg-white/60 backdrop-blur-sm border-2 rounded-xl 
                        placeholder-gray-500 text-gray-900 font-medium transition-all duration-300
                        focus:outline-none focus:bg-white focus:border-blue-500 focus:shadow-lg focus:shadow-blue-500/20
                        hover:bg-white/80 hover:border-gray-300
                        ${
                          errors.password ? "border-red-300" : "border-gray-200"
                        }
                      `}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute text-gray-400 transition-all duration-300 transform -translate-y-1/2 right-4 top-1/2 hover:text-blue-600 hover:scale-110"
                    >
                      <i
                        className={`${
                          showPassword ? PrimeIcons.EYE_SLASH : PrimeIcons.EYE
                        } text-lg`}
                      />
                    </button>
                  </div>
                  {errors.password && (
                    <div className="flex items-center gap-2 text-sm font-medium text-red-500 animate-pulse">
                      <i
                        className={`${PrimeIcons.EXCLAMATION_CIRCLE} text-sm`}
                      />
                      Password is required
                    </div>
                  )}
                </div>

                {/* Sign In Button */}
                <div className="pt-4">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-14 bg-gradient-to-r from-blue-600 via-blue-700 to-cyan-600 
                      hover:from-blue-700 hover:via-blue-800 hover:to-cyan-700
                      disabled:opacity-60 disabled:cursor-not-allowed
                      rounded-xl font-bold text-white text-lg shadow-xl
                      transform hover:scale-[1.02] active:scale-[0.98] 
                      transition-all duration-300 ease-out
                      hover:shadow-2xl hover:shadow-blue-500/30
                      flex items-center justify-center gap-3 group"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 border-2 rounded-full border-white/30 border-t-white animate-spin"></div>
                        <span>Signing in...</span>
                      </div>
                    ) : (
                      <>
                        <span>Sign In</span>
                        <i
                          className={`${PrimeIcons.ARROW_RIGHT} text-lg group-hover:translate-x-1 transition-transform duration-300`}
                        />
                      </>
                    )}
                  </Button>
                </div>

                {/* Forgot Password */}
                <div className="pt-4 text-center">
                  <Link
                    to="/forgot-password"
                    className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 transition-all duration-300 hover:text-blue-800 hover:underline group"
                  >
                    <i
                      className={`${PrimeIcons.QUESTION_CIRCLE} text-sm group-hover:scale-110 transition-transform duration-300`}
                    />
                    Forgot your password?
                  </Link>
                </div>
              </form>
            </div>

            {/* Footer Info */}
            <div className="mt-8 space-y-3 text-center">
              <div className="flex items-center justify-center gap-2 text-gray-600">
                <i className={`${PrimeIcons.SHIELD} text-sm`} />
                <span className="text-sm font-medium">
                  Westlake Medical Center ICT Department
                </span>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <i className={`${PrimeIcons.PHONE} text-xs`} />
                  <span>(+632) 8553-8185</span>
                </div>
                <div className="flex items-center gap-1">
                  <i className={`${PrimeIcons.MAP_MARKER} text-xs`} />
                  <span>San Pedro, Laguna</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTemplate>
  );
};

export default LoginPage;
