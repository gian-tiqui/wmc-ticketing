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

const CrmSidebarFooter = () => {
  const navigate = useNavigate();
  const [settingsDialogVisible, setSettingsDialogVisible] =
    useState<boolean>(false);
  const [noSecretDialogVisible, setNoSecretDialogVisible] =
    useState<boolean>(false);
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);
  const { user, remove } = useUserDataStore();
  const { setIsLoggedIn } = useLoggedInStore();
  const { hasSecret, setHasSecret } = useHasSecretStore();
  const toastRef = useRef<Toast>(null);

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
        `${URI.API_URI}/api/v1/auth/logout?userId=${user.sub}`
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

      <motion.footer
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col gap-1 mx-2"
      >
        <SettingsDialog
          visible={settingsDialogVisible}
          setVisible={setSettingsDialogVisible}
        />

        {/* Top Decorative Element */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="h-px mx-1 mb-3 bg-gradient-to-r from-transparent via-gray-300 to-transparent"
        />

        {/* Account Settings Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            className={`
              relative items-center w-full px-3 py-2 text-xs border-none h-9 font-medium 
              transition-all duration-300 ease-in-out rounded-lg
              bg-transparent text-gray-800 hover:bg-blue-50 hover:text-blue-700
              focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:ring-offset-1
              group overflow-hidden
            `}
            onClick={() => setSettingsDialogVisible(true)}
            onMouseEnter={() => setHoveredButton("settings")}
            onMouseLeave={() => setHoveredButton(null)}
          >
            {/* Icon with consistent styling */}
            <i
              className={`
                ${PrimeIcons.COG} me-3 text-lg transition-all duration-300
                ${
                  hoveredButton === "settings"
                    ? "text-blue-700 scale-110"
                    : "text-gray-700"
                }
              `}
            />

            <span className="relative z-10 text-left">Account Settings</span>

            {/* Hover effect background */}
            <motion.div className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-r from-blue-50 to-blue-100 group-hover:opacity-100" />
          </Button>
        </motion.div>

        {/* Logout Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            onClick={handleLogoutClicked}
            className={`
              relative items-center w-full px-3 py-2 text-xs border-none h-9 font-medium 
              transition-all duration-300 ease-in-out rounded-lg
              bg-transparent text-gray-800 hover:bg-red-50 hover:text-red-700
              focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:ring-offset-1
              group overflow-hidden
            `}
            onMouseEnter={() => setHoveredButton("logout")}
            onMouseLeave={() => setHoveredButton(null)}
          >
            {/* Icon with consistent styling */}
            <i
              className={`
                ${PrimeIcons.SIGN_OUT} me-3 text-lg transition-all duration-300
                ${
                  hoveredButton === "logout"
                    ? "text-red-700 scale-110"
                    : "text-gray-700"
                }
              `}
            />

            <span className="relative z-10 text-left">Logout</span>

            {/* Hover effect background - red theme for logout */}
            <motion.div className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-r from-red-50 to-red-100 group-hover:opacity-100" />
          </Button>
        </motion.div>
      </motion.footer>
    </>
  );
};

export default CrmSidebarFooter;
