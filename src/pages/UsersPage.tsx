import { useQuery } from "@tanstack/react-query";
import PageTemplate from "../templates/PageTemplate";
import { useState } from "react";
import { Query } from "../types/types";
import { getUsers } from "../@utils/services/userService";
import UsersTable from "../components/UsersTable";
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
      <AddUserDialog
        visible={visible}
        setVisible={setVisible}
        refetch={refetch}
      />

      <div className="min-h-screen bg-[#EEE]">
        {/* Modern Header Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
          {/* Animated Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-40 h-40 -translate-x-20 -translate-y-20 bg-white rounded-full animate-pulse"></div>
            <div className="absolute bottom-0 right-0 delay-700 translate-x-20 translate-y-20 bg-white rounded-full w-60 h-60 animate-pulse"></div>
          </div>

          {/* Glass Overlay */}
          <div className="absolute inset-0 bg-black/5 backdrop-blur-[1px]"></div>

          {/* Content */}
          <div className="relative z-10 px-6 py-8 mx-auto max-w-7xl">
            <div className="flex items-center justify-between">
              {/* Left Side - Enhanced Title & Stats */}
              <div className="flex items-center gap-8">
                <div className="flex items-center gap-4">
                  {/* Enhanced Icon with Glow */}
                  <div className="relative group">
                    <div className="absolute inset-0 transition-all duration-300 bg-white/30 rounded-2xl blur-xl group-hover:blur-2xl"></div>
                    <div className="relative flex items-center justify-center w-12 h-12 border shadow-lg bg-white/20 backdrop-blur-sm rounded-2xl border-white/30">
                      <svg
                        className="text-white w-7 h-7 drop-shadow-sm"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                        />
                      </svg>
                    </div>
                    {/* Live Status Indicator */}
                    <div className="absolute w-4 h-4 border-2 border-white rounded-full shadow-lg -top-1 -right-1 bg-emerald-400 animate-pulse"></div>
                  </div>

                  {/* Enhanced Title */}
                  <div className="space-y-1">
                    <h1 className="text-2xl font-bold text-white drop-shadow-sm">
                      User Management
                    </h1>
                    <p className="text-sm font-light text-white">
                      Manage your team members with ease
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Side - Enhanced Actions */}
              <div className="flex items-center gap-4">
                {/* Enhanced Action Buttons */}
                <div className="flex items-center gap-3">
                  {/* Primary Add User Button */}
                  <button
                    onClick={() => setVisible(true)}
                    className="relative h-10 px-5 transition-all duration-200 border shadow-xl group bg-white/25 backdrop-blur-sm border-white/30 rounded-2xl hover:bg-white/30 focus:bg-white/35 focus:ring-4 focus:ring-white/20"
                  >
                    <div className="absolute inset-0 transition-all duration-300 bg-white/10 rounded-2xl blur-sm group-hover:blur-md"></div>
                    <div className="relative flex items-center font-semibold text-white">
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                      Add User
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Main Content */}
        <div className="px-6 py-6 mx-auto max-w-7xl h-[82vh] overflow-auto">
          <div className="overflow-hidden border shadow-xl backdrop-blur-xl rounded-3xl shadow-slate-900/5 border-white/20">
            <UsersTable users={userResponse?.data.users} refetch={refetch} />
          </div>
        </div>
      </div>
    </PageTemplate>
  );
};

export default UsersPage;
