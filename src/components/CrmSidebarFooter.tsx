import { PrimeIcons } from "primereact/api";
import { Button } from "primereact/button";
import { Namespace, URI } from "../@utils/enums/enum";
import Cookies from "js-cookie";
import useUserDataStore from "../@utils/store/userDataStore";
import apiClient from "../@utils/http-common/apiClient";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
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
            className:
              "bg-slate-900 text-slate-100 border-x border-t border-slate-700",
          },
          content: {
            className:
              "bg-slate-900 text-slate-100 border-x border-b border-slate-700",
          },
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
      <footer className="flex flex-col gap-2 mx-5">
        <ConfirmDialog
          pt={{
            header: {
              className:
                "bg-slate-900 text-slate-100 border-x border-t border-slate-700",
            },
            content: {
              className:
                "bg-slate-900 text-slate-100 border-x border-slate-700",
            },
            footer: {
              className: "bg-slate-900 border-x border-b border-slate-700",
            },
          }}
        />
        <SettingsDialog
          visible={settingsDialogVisible}
          setVisible={setSettingsDialogVisible}
        />
        <Button
          className="w-full h-12 text-sm border-none bg-inherit hover:bg-gray-800"
          severity="contrast"
          icon={`${PrimeIcons.COG} text-sm me-2`}
          onClick={() => setSettingsDialogVisible(true)}
        >
          Account Settings
        </Button>
        <Button
          onClick={handleLogoutClicked}
          className="w-full h-12 text-sm border-none bg-inherit hover:bg-gray-800"
          severity="contrast"
          icon={`${PrimeIcons.SIGN_OUT} text-sm me-2`}
        >
          Logout
        </Button>
      </footer>
    </>
  );
};

export default CrmSidebarFooter;
