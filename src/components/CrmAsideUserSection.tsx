import { Avatar } from "primereact/avatar";
import { PrimeIcons } from "primereact/api";
import { Button } from "primereact/button";
import { motion } from "framer-motion";
import { Namespace, URI } from "../@utils/enums/enum";
import Cookies from "js-cookie";
import useUserDataStore from "../@utils/store/userDataStore";
import apiClient from "../@utils/http-common/apiClient";
import { confirmDialog } from "primereact/confirmdialog";
import { useNavigate } from "react-router-dom";
import useLoggedInStore from "../@utils/store/loggedIn";
import { useEffect, useRef, useState } from "react";
import SettingsDialog from "./UserSettingsDialog";
import { getUserSecret } from "../@utils/services/userService";
import { Toast } from "primereact/toast";
import handleErrors from "../@utils/functions/handleErrors";
import { Dialog } from "primereact/dialog";
import useHasSecretStore from "../@utils/store/userHasSecret";
import CustomToast from "./CustomToast";

const CrmSidebarUserSection = () => {
  const navigate = useNavigate();
  const [settingsDialogVisible, setSettingsDialogVisible] =
    useState<boolean>(false);
  const [noSecretDialogVisible, setNoSecretDialogVisible] =
    useState<boolean>(false);
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);
  const [avatarLabel, setAvatarLabel] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const { user, remove } = useUserDataStore();
  const { setIsLoggedIn } = useLoggedInStore();
  const { hasSecret, setHasSecret } = useHasSecretStore();
  const toastRef = useRef<Toast>(null);

  useEffect(() => {
    if (!user) {
      console.error("Info could not be extracted");
      setLoading(false);
      return;
    }
    setAvatarLabel(
      user?.firstName.charAt(0).toUpperCase() +
        user?.lastName.charAt(0).toUpperCase()
    );
    setLoading(false);
  }, [user]);

  useEffect(() => {
    if (user) {
      getUserSecret(user?.sub)
        .then((res) => {
          if (res.data.secret === "none") {
            setNoSecretDialogVisible(true);
            setHasSecret(false);
          }
        })
        .catch((err) => handleErrors(err, toastRef));
    }
  }, [user, setHasSecret]);

  const accept = async () => {
    try {
      const refreshToken = Cookies.get(Namespace.BASE);
      const accessToken = localStorage.getItem(Namespace.BASE);

      if (refreshToken === undefined || accessToken === undefined) {
        console.error("Tokens not found.");
        return;
      }

      if (!user) {
        console.error("There was a problem in your user data.");
        return;
      }

      const response = await apiClient.patch(
        `${URI.API_URI}/api/v1/auth/logout?refreshToken=${refreshToken}`
      );

      if (response.status === 200) {
        setIsLoggedIn(false);
        remove();
        Cookies.remove(Namespace.BASE);
        localStorage.removeItem(Namespace.BASE);
        navigate("/");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogoutClicked = () => {
    confirmDialog({
      message: "Do you logout from the app?",
      header: "Logout",
      icon: PrimeIcons.QUESTION_CIRCLE,
      defaultFocus: "reject",
      accept,
    });
  };

  return (
    <>
      <CustomToast ref={toastRef} />
      <Dialog
        pt={{
          header: {
            className: "bg-[#EEE] rounded-t-3xl",
          },
          content: {
            className: "bg-[#EEE] rounded-b-3xl",
          },
          root: { className: "rounded-3xl" },
          mask: { className: "backdrop-blur" },
        }}
        visible={noSecretDialogVisible}
        onHide={() => {
          if (hasSecret === false) {
            toastRef.current?.show({
              severity: "error",
              summary: "No secret",
              detail: "Please set your secrets first",
            });
            return;
          }
          if (noSecretDialogVisible === true) setNoSecretDialogVisible(false);
        }}
        className="w-96"
        header="Recovery Method Not Set"
      >
        <p className="mb-5">
          Looks like you have not set your secret question and answer for your
          account recovery.
        </p>

        <div className="flex justify-end w-full">
          <Button
            className="h-10"
            onClick={() => {
              setNoSecretDialogVisible(false);
              setSettingsDialogVisible(true);
            }}
          >
            Set secrets
          </Button>
        </div>
      </Dialog>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mx-2 mt-auto"
      >
        <SettingsDialog
          visible={settingsDialogVisible}
          setVisible={setSettingsDialogVisible}
        />

        {/* Compact User Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="relative p-3 mb-2 overflow-hidden border shadow-lg rounded-2xl bg-gradient-to-br from-white/90 via-white/80 to-white/70 backdrop-blur-xl border-white/30"
        >
          {/* Glassmorphism overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 rounded-2xl" />

          {/* Smaller animated background elements */}
          <motion.div
            animate={{
              rotate: [0, 360],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute w-8 h-8 rounded-full -top-2 -right-2 bg-gradient-to-br from-blue-400/20 to-purple-400/20 blur-lg"
          />
          <motion.div
            animate={{
              rotate: [360, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute w-6 h-6 rounded-full -bottom-2 -left-2 bg-gradient-to-br from-pink-400/20 to-blue-400/20 blur-lg"
          />

          {/* Compact User Profile Section */}
          <div className="relative z-10 mb-3">
            <div className="flex items-center gap-3">
              <div className="relative">
                {loading ? (
                  <div className="w-8 h-8 bg-gray-300 rounded-full dark:bg-gray-600 animate-pulse" />
                ) : (
                  <motion.div
                    initial={{ scale: 0, rotate: -90 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 20,
                      delay: 0.2,
                    }}
                    whileHover={{ scale: 1.05 }}
                    className="relative"
                  >
                    <Avatar
                      label={avatarLabel}
                      className="w-8 h-8 text-xs font-bold text-white shadow-lg bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 ring-2 ring-white/50"
                      shape="circle"
                    />
                    {/* Smaller pulsing ring effect */}
                    <motion.div
                      animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 opacity-20"
                    />
                  </motion.div>
                )}

                {/* Compact Online Status */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4 }}
                  className="absolute -bottom-0.5 -right-0.5 flex items-center justify-center w-3 h-3 bg-white rounded-full shadow-md"
                >
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-1.5 h-1.5 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"
                  />
                </motion.div>
              </div>

              <div className="flex-1 min-w-0">
                {loading ? (
                  <div className="space-y-1">
                    <div className="h-3 bg-gray-300 rounded dark:bg-gray-600 animate-pulse" />
                    <div className="w-3/4 h-2 bg-gray-200 rounded dark:bg-gray-700 animate-pulse" />
                  </div>
                ) : user ? (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <h3 className="text-sm font-bold text-gray-900 truncate">
                      {user.firstName} {user.lastName}
                    </h3>
                    <p className="text-xs text-gray-600 truncate">
                      {user.deptName}
                    </p>
                  </motion.div>
                ) : (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-xs text-gray-500"
                  >
                    User not found
                  </motion.p>
                )}
              </div>
            </div>

            {/* Compact Status Indicator */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex items-center justify-center gap-1.5 pt-2 mt-2 border-t border-gray-200/50"
            >
              <div className="flex items-center gap-1">
                <motion.div
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-1.5 h-1.5 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full shadow-sm"
                />
                <span className="text-xs font-semibold text-gray-700">
                  Online
                </span>
              </div>
              <div className="w-0.5 h-0.5 bg-gray-400 rounded-full" />
              <span className="text-xs font-medium text-gray-500">Active</span>
            </motion.div>
          </div>

          {/* Compact Action Buttons */}
          <div className="relative z-10 space-y-1.5">
            {/* Settings Button */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                className={`
                  relative w-full px-3 py-2 text-xs font-medium border-none rounded-xl h-8
                  transition-all duration-300 ease-out
                  bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 
                  hover:from-blue-100 hover:to-indigo-100 hover:shadow-md
                  focus:outline-none focus:ring-2 focus:ring-blue-500/30
                  group overflow-hidden
                `}
                onClick={() => setSettingsDialogVisible(true)}
                onMouseEnter={() => setHoveredButton("settings")}
                onMouseLeave={() => setHoveredButton(null)}
              >
                <div className="flex items-center justify-center gap-2">
                  <motion.i
                    animate={{ rotate: hoveredButton === "settings" ? 90 : 0 }}
                    transition={{ duration: 0.3 }}
                    className={`${PrimeIcons.COG} text-sm`}
                  />
                  <span className="font-semibold">Settings</span>
                </div>

                {/* Shimmer effect */}
                <motion.div
                  initial={{ x: "-100%" }}
                  animate={{
                    x: hoveredButton === "settings" ? "100%" : "-100%",
                  }}
                  transition={{ duration: 0.6 }}
                  className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                />
              </Button>
            </motion.div>

            {/* Logout Button */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                onClick={handleLogoutClicked}
                className={`
                  relative w-full px-3 py-2 text-xs font-medium border-none rounded-xl h-8
                  transition-all duration-300 ease-out
                  bg-gradient-to-r from-red-50 to-rose-50 text-red-700 
                  hover:from-red-100 hover:to-rose-100 hover:shadow-md
                  focus:outline-none focus:ring-2 focus:ring-red-500/30
                  group overflow-hidden
                `}
                onMouseEnter={() => setHoveredButton("logout")}
                onMouseLeave={() => setHoveredButton(null)}
              >
                <div className="flex items-center justify-center gap-2">
                  <motion.i
                    animate={{ x: hoveredButton === "logout" ? 2 : 0 }}
                    transition={{ duration: 0.3 }}
                    className={`${PrimeIcons.SIGN_OUT} text-sm`}
                  />
                  <span className="font-semibold">Logout</span>
                </div>

                {/* Shimmer effect */}
                <motion.div
                  initial={{ x: "-100%" }}
                  animate={{ x: hoveredButton === "logout" ? "100%" : "-100%" }}
                  transition={{ duration: 0.6 }}
                  className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                />
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
};

export default CrmSidebarUserSection;
