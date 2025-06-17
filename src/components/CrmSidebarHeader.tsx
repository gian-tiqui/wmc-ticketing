import { Avatar } from "primereact/avatar";
import CrmAsideButtonToggler from "./CrmAsideButtonToggler";
import useUserDataStore from "../@utils/store/userDataStore";
import { useEffect, useState } from "react";

const CrmSidebarHeader = () => {
  const { user } = useUserDataStore();
  const [avatarLabel, setAvatarLabel] = useState<string>("");

  useEffect(() => {
    if (!user) {
      console.error("Info could not be extracted");
      return;
    }
    setAvatarLabel(
      user?.firstName.charAt(0).toUpperCase().toUpperCase() +
        user?.lastName.charAt(0).toLowerCase().toUpperCase()
    );
  }, [user]);

  return (
    <header className="flex justify-between mx-3 mb-4 cursor-default">
      <div className="flex gap-2">
        <Avatar
          label={avatarLabel}
          className="text-xs font-extrabold text-white bg-blue-600 w-7 h-7"
          shape="circle"
        />
        <div>
          <p className="text-sm font-medium">
            {user?.firstName} {user?.lastName}
          </p>
          <p className="text-xs">{user?.deptName}</p>
        </div>
      </div>
      <CrmAsideButtonToggler />
    </header>
  );
};

export default CrmSidebarHeader;
