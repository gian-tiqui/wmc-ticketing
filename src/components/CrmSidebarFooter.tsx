import { PrimeIcons } from "primereact/api";
import { Button } from "primereact/button";
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
      <footer className="flex flex-col gap-1 mx-2">
        <SettingsDialog
          visible={settingsDialogVisible}
          setVisible={setSettingsDialogVisible}
        />
        <Button
          className={`items-center w-full px-1 bg-inherit text-xs border-none text-slate-900 h-8 font-medium  focus:outline-none focus:ring-0 hover:bg-blue-600/10`}
          icon={`${PrimeIcons.COG} me-4 text-lg`}
          onClick={() => setSettingsDialogVisible(true)}
        >
          Account Settings
        </Button>
        <Button
          onClick={handleLogoutClicked}
          className={`items-center w-full px-1 bg-inherit text-xs border-none text-slate-900 h-8 font-medium  focus:outline-none focus:ring-0 hover:bg-blue-600/10`}
          icon={`${PrimeIcons.SIGN_OUT} me-4 text-lg`}
        >
          Logout
        </Button>
      </footer>
    </>
  );
};

export default CrmSidebarFooter;
