import { useQuery } from "@tanstack/react-query";
import PageTemplate from "../templates/PageTemplate";
import { useState } from "react";
import { Query } from "../types/types";
import { getUsers } from "../@utils/services/userService";
import UsersTable from "../components/UsersTable";
import { Button } from "primereact/button";
import { PrimeIcons } from "primereact/api";
import AddUserDialog from "../components/AddUserDialog";

const UsersPage = () => {
  const [query] = useState<Query>({
    limit: 1000,
    offset: 0,
    search: "",
  });

  const [visible, setVisible] = useState<boolean>(false);

  const {
    data: userResponse,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: [`users-${query}`],
    queryFn: () => getUsers(query),
  });

  if (isError) {
    console.error("There was an error in loading the users", error);

    return (
      <div className="w-full h-screen">
        There was an error in loading the users. Try again later.
      </div>
    );
  }

  if (isLoading) return <div className="w-full h-screen">Loading users</div>;

  return (
    <PageTemplate>
      <AddUserDialog visible={visible} setVisible={setVisible} />
      <div className="grid w-full h-screen p-5 overflow-auto">
        <div className="flex justify-between w-full">
          <h3>Users</h3>
          <Button
            onClick={() => setVisible(true)}
            icon={`${PrimeIcons.PLUS}`}
            className="w-7 h-7"
          />
        </div>
        <UsersTable users={userResponse?.data.users} refetch={refetch} />
      </div>
    </PageTemplate>
  );
};

export default UsersPage;
