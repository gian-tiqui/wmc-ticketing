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
import wmcBuilding from "../assets/bg-removed-wmc.png";

interface FormFields {
  username: string;
  password: string;
}

interface MousePosition {
  x: number;
  y: number;
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

  // Modern UI states
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [mousePosition, setMousePosition] = useState<MousePosition>({
    x: 0,
    y: 0,
  });
  const [animationTime, setAnimationTime] = useState<number>(0);
  const [focusedField, setFocusedField] = useState<string>("");

  useEffect(() => {
    if (isAuthenticated()) {
      if (user) navigateBasedOnRole(user, navigate);
      return;
    }
  }, [navigate, user]);

  useEffect(() => {
    // Initialize modern UI animations
    setIsLoaded(true);
    setAnimationTime(Date.now());

    const handleMouseMove = (e: MouseEvent): void => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const animationInterval = setInterval(() => {
      setAnimationTime(Date.now());
    }, 50);

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      clearInterval(animationInterval);
    };
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

  // Animation helper
  const getAnimationStyle = (index: number = 0): React.CSSProperties => {
    if (!isLoaded) return {};

    return {
      transform: `translate(${
        mousePosition.x * (index === 0 ? 0.02 : -0.02)
      }px, ${mousePosition.y * (index === 0 ? 0.02 : -0.02)}px) scale(${
        1 + Math.sin(animationTime / (3000 + index * 1000)) * 0.1
      })`,
      transition: "transform 0.1s ease-out",
    };
  };

  return (
    <PageTemplate>
      <CustomToast ref={toastRef} />

      {/* Main container - now properly scrollable */}
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
        {/* Background animation */}
        <div className="fixed inset-0 pointer-events-none">
          <div
            className="absolute rounded-full top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 blur-3xl"
            style={getAnimationStyle(0)}
          />
          <div
            className="absolute rounded-full bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-400/20 to-pink-400/20 blur-3xl"
            style={getAnimationStyle(1)}
          />
          <div
            className="absolute transform -translate-x-1/2 -translate-y-1/2 rounded-full top-1/2 left-1/2 w-72 h-72 bg-gradient-to-r from-green-400/10 to-blue-400/10 blur-3xl"
            style={getAnimationStyle(2)}
          />
        </div>

        {/* Main Content Container */}
        <div className="relative z-10 flex flex-col min-h-screen lg:flex-row">
          {/* Left Side - Hero Content */}
          <div className="flex items-center justify-center p-8 lg:p-12 lg:w-1/2">
            <div
              className="max-w-lg space-y-6 lg:space-y-8"
              style={{
                opacity: isLoaded ? 1 : 0,
                transform: `translateY(${isLoaded ? 0 : 50}px)`,
                transition: "all 0.8s ease-out",
              }}
            >
              <div>
                <span className="inline-block px-4 py-2 mb-4 text-sm font-semibold text-blue-700 rounded-full bg-gradient-to-r from-blue-100 to-cyan-100">
                  🎫 WMC Ticketing System
                </span>
                <h1 className="text-4xl font-bold leading-tight text-gray-900 lg:text-5xl xl:text-6xl">
                  Streamline Your{" "}
                  <span className="text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text">
                    Support Operations
                  </span>
                </h1>
              </div>

              <p className="text-lg text-gray-600 lg:text-xl">
                Built exclusively for{" "}
                <span className="font-semibold text-blue-600">
                  Westlake Medical Center
                </span>{" "}
                to revolutionize internal ticket management and enhance team
                collaboration.
              </p>

              {/* WMC Building Image - Responsive sizing */}
              <div className="relative flex justify-center">
                <Image
                  src={wmcBuilding}
                  alt="wmc building"
                  className="object-cover w-48 h-48 lg:h-64 lg:w-64 xl:h-80 xl:w-80 opacity-60 rounded-2xl"
                />
              </div>

              {/* Bottom Text */}
              <div className="pt-4 lg:pt-8">
                <h2 className="text-2xl font-bold text-gray-800 lg:text-3xl">
                  Powerful Features for{" "}
                  <span className="text-transparent bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text">
                    Modern Healthcare
                  </span>
                </h2>
                <p className="mt-4 text-gray-600">
                  Experience the next generation of ticketing with advanced
                  features designed for healthcare environments.
                </p>
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="flex items-center justify-center w-full p-8 lg:w-1/2">
            <div
              className="w-full max-w-md"
              style={{
                opacity: isLoaded ? 1 : 0,
                transform: `translateY(${isLoaded ? 0 : 30}px)`,
                transition: "all 0.8s ease-out 0.2s",
              }}
            >
              {/* Header */}
              <div className="mb-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 mb-6 shadow-lg bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl">
                  <Image
                    src={wmcLogo}
                    alt="wmc-logo"
                    className="object-cover w-10 h-10 rounded-lg"
                  />
                </div>
                <h2 className="mb-2 text-3xl font-bold text-gray-900">
                  Welcome back!
                </h2>
                <p className="text-gray-600">
                  Sign in to your WMC Ticketing System account
                </p>
              </div>

              {/* Form Container */}
              <div className="p-6 border shadow-2xl lg:p-8 bg-white/60 backdrop-blur-md border-white/20 rounded-3xl">
                <form
                  onSubmit={handleSubmit(handleLogin)}
                  className="space-y-6"
                >
                  {/* Username Field */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">
                      Username
                    </label>
                    <div className="relative">
                      <div className="absolute transform -translate-y-1/2 left-4 top-1/2">
                        <i
                          className={`${
                            PrimeIcons.USER
                          } text-lg transition-colors duration-200 ${
                            focusedField === "username"
                              ? "text-blue-600"
                              : "text-gray-400"
                          }`}
                        />
                      </div>
                      <InputText
                        {...register("username", { required: true })}
                        placeholder="APAGASA"
                        onFocus={() => setFocusedField("username")}
                        onBlur={() => setFocusedField("")}
                        className="w-full pl-12 pr-4 text-gray-900 placeholder-gray-500 transition-all duration-200 border border-gray-200 h-14 bg-white/80 backdrop-blur-sm rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white"
                      />
                    </div>
                    {errors.username && (
                      <p className="flex items-center gap-1 text-sm font-semibold text-red-500">
                        <i
                          className={`${PrimeIcons.EXCLAMATION_CIRCLE} text-sm`}
                        ></i>
                        Username is required.
                      </p>
                    )}
                  </div>

                  {/* Password Field */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">
                      Password
                    </label>
                    <div className="relative">
                      <div className="absolute transform -translate-y-1/2 left-4 top-1/2">
                        <i
                          className={`${
                            PrimeIcons.LOCK
                          } text-lg transition-colors duration-200 ${
                            focusedField === "password"
                              ? "text-blue-600"
                              : "text-gray-400"
                          }`}
                        />
                      </div>
                      <InputText
                        {...register("password", { required: true })}
                        placeholder="*********"
                        type={showPassword ? "text" : "password"}
                        onFocus={() => setFocusedField("password")}
                        onBlur={() => setFocusedField("")}
                        className="w-full pl-12 pr-12 text-gray-900 placeholder-gray-500 transition-all duration-200 border border-gray-200 h-14 bg-white/80 backdrop-blur-sm rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute text-gray-400 transition-colors duration-200 transform -translate-y-1/2 right-4 top-1/2 hover:text-blue-600"
                      >
                        <i
                          className={`${
                            showPassword ? PrimeIcons.EYE_SLASH : PrimeIcons.EYE
                          } text-lg`}
                        />
                      </button>
                    </div>
                    {errors.password && (
                      <p className="flex items-center gap-1 text-sm font-semibold text-red-500">
                        <i
                          className={`${PrimeIcons.EXCLAMATION_CIRCLE} text-sm`}
                        ></i>
                        Password is required.
                      </p>
                    )}
                  </div>

                  {/* Sign In Button */}
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="group w-full h-14 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:opacity-70 disabled:cursor-not-allowed rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <div className="w-6 h-6 border-2 rounded-full border-white/30 border-t-white animate-spin"></div>
                    ) : (
                      <>
                        Sign in
                        <i
                          className={`${PrimeIcons.ARROW_RIGHT} text-lg group-hover:translate-x-1 transition-transform duration-200`}
                        />
                      </>
                    )}
                  </Button>

                  {/* Forgot Password Link */}
                  <div className="text-center">
                    <Link
                      to="/forgot-password"
                      className="text-sm font-semibold text-blue-600 transition-colors duration-200 hover:text-blue-800 hover:underline"
                    >
                      Forgot your password?
                    </Link>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Footer - Now properly positioned */}
        <div className="relative z-10 py-8 bg-gradient-to-r from-slate-50/80 to-blue-50/80 backdrop-blur-sm">
          <div className="container px-4 mx-auto text-center">
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="flex items-center justify-center space-x-2 text-gray-600">
                <i className={`${PrimeIcons.SHIELD} text-sm`} />
                <span className="text-sm lg:text-base">
                  Powered by Westlake Medical Center ICT Department
                </span>
              </div>

              <div className="flex flex-col items-center justify-center space-y-2 lg:flex-row lg:space-y-0 lg:space-x-6">
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <i className={`${PrimeIcons.PHONE} text-sm`} />
                  <span>(+632) 8553-8185</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <i className={`${PrimeIcons.ENVELOPE} text-sm`} />
                  <span>info@westlakemedical.com</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <i className={`${PrimeIcons.MAP_MARKER} text-sm`} />
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
