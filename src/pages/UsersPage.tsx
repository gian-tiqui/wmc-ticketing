import { useQuery } from "@tanstack/react-query";
import PageTemplate from "../templates/PageTemplate";
import { useState } from "react";
import { Query } from "../types/types";
import { getUsers } from "../@utils/services/userService";
import UsersTable from "../components/UsersTable";

const UsersPage = () => {
  const [query] = useState<Query>({
    limit: 1000,
    offset: 0,
    search: "",
  });

  const {
    data: userResponse,
    isLoading,
    isError,
    error,
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
      <div className="grid w-full h-screen p-5 overflow-auto">
        <h3>Users</h3>
        <UsersTable users={userResponse?.data.users} />
      </div>
    </PageTemplate>
  );
};

export default UsersPage;
