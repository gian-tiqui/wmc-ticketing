import { Dialog } from "primereact/dialog";
import { TabPanel, TabView } from "primereact/tabview";
import React, { Dispatch, SetStateAction, useRef } from "react";
import { Panel } from "../types/types";
import SettingsDetail from "./YourProfile";
import ChangePassword from "./ChangePassword";
import RecoveryMethod from "./RecoveryMethod";
import useHasSecretStore from "../@utils/store/userHasSecret";
import { Toast } from "primereact/toast";
import { PrimeIcons } from "primereact/api";
import CustomToast from "./CustomToast";

interface Props {
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
}

const SettingsDialog: React.FC<Props> = ({ visible, setVisible }) => {
  const { hasSecret } = useHasSecretStore();
  const toastRef = useRef<Toast>(null);
  const settingsPanels: Panel[] = [
    {
      header: "Your Profile",
      panel: <SettingsDetail />,
      icon: `${PrimeIcons.USER} me-2`,
    },
    {
      header: "Change Password",
      panel: <ChangePassword />,
      icon: `${PrimeIcons.LOCK} me-2`,
    },
    {
      header: "Recovery Method",
      panel: <RecoveryMethod />,
      icon: `${PrimeIcons.KEY} me-2`,
    },
  ];

  return (
    <>
      <CustomToast ref={toastRef} />
      <Dialog
        className="w-80 md:w-[80%] h-[85vh]"
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
        visible={visible}
        onHide={() => {
          if (hasSecret === false) {
            toastRef.current?.show({
              severity: "error",
              summary: "No secret",
              detail: "Please set your secrets first",
            });
            return;
          }
          if (visible === true) setVisible(false);
        }}
        header={
          <div className="flex items-center gap-2">
            <i className={`${PrimeIcons.COG} text-xl`}></i>
            <p>User Settings</p>
          </div>
        }
      >
        <TabView
          pt={{
            panelContainer: { className: "h-80 w-full bg-inherit" },
            nav: { className: "w-full bg-inherit" },
            tab: { className: "w-full bg-inherit" },
          }}
        >
          {settingsPanels.map((settingsPanel, index) => (
            <TabPanel
              key={index}
              leftIcon={settingsPanel.icon}
              header={settingsPanel.header}
              className="text-slate-100"
              pt={{ headerAction: { className: "bg-inherit" } }}
            >
              {settingsPanel.panel}
            </TabPanel>
          ))}
        </TabView>
      </Dialog>
    </>
  );
};

export default SettingsDialog;
