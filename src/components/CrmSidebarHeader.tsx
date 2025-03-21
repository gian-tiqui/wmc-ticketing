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
      user?.firstName.charAt(0).toUpperCase() +
        user?.lastName.charAt(0).toLowerCase()
    );
  }, [user]);

  return (
    <header className="flex justify-between mx-5 mb-4 cursor-default">
      <div className="flex gap-2">
        <Avatar
          label={avatarLabel}
          className="w-12 h-12 font-extrabold bg-blue-500"
        />
        <div>
          <p className="font-medium">
            {user?.firstName} {user?.lastName}
          </p>
          <p className="text-sm">{user?.deptName}</p>
        </div>
      </div>
      <CrmAsideButtonToggler />
    </header>
  );
};

export default CrmSidebarHeader;
