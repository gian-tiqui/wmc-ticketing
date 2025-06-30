import { Avatar } from "primereact/avatar";
import { motion } from "framer-motion";
import CrmAsideButtonToggler from "./CrmAsideButtonToggler";
import useUserDataStore from "../@utils/store/userDataStore";
import { useEffect, useState } from "react";

const CrmSidebarHeader = () => {
  const { user } = useUserDataStore();
  const [avatarLabel, setAvatarLabel] = useState<string>("");
  const [loading, setLoading] = useState(true);

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

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mx-3 mb-4"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="p-4 shadow-lg rounded-2xl border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm"
      >
        <div className="flex items-center justify-between">
          {/* User Profile Section */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center flex-1 gap-3 p-2 transition-all duration-300 cursor-pointer hover:bg-white/70 rounded-xl"
          >
            <div className="relative">
              {loading ? (
                <div className="bg-gray-300 rounded-full w-7 h-7 dark:bg-gray-600 animate-pulse" />
              ) : (
                <motion.div
                  initial={{ scale: 0, rotate: -90 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 30,
                    delay: 0.2,
                  }}
                >
                  <Avatar
                    label={avatarLabel}
                    className="text-xs font-extrabold text-white shadow-lg bg-gradient-to-r from-blue-500 to-purple-500 w-7 h-7 ring-2 ring-white/20"
                    shape="circle"
                  />
                </motion.div>
              )}
              {/* Online Status Indicator */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4 }}
                className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-[#EEE] shadow-sm"
              />
            </div>

            <div className="flex-1 min-w-0">
              {loading ? (
                <div className="space-y-1.5">
                  <div className="h-3 bg-gray-300 rounded dark:bg-gray-600 animate-pulse" />
                  <div className="w-3/4 h-2 bg-gray-200 rounded dark:bg-gray-700 animate-pulse" />
                </div>
              ) : user ? (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <p className="text-sm font-semibold text-gray-900 truncate ">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-xs text-gray-600 truncate dark:text-gray-400">
                    {user.deptName}
                  </p>
                </motion.div>
              ) : (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm text-gray-500 dark:text-gray-400"
                >
                  User not found
                </motion.p>
              )}
            </div>
          </motion.div>

          {/* Toggle Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="ml-2"
          >
            <CrmAsideButtonToggler />
          </motion.div>
        </div>

        {/* Status Bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="pt-3 mt-3 border-t border-gray-200/30 dark:border-gray-700/30"
        >
          <div className="flex items-center justify-center gap-2">
            <div className="flex items-center gap-1">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-1.5 h-1.5 bg-green-500 rounded-full"
              />
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                Online
              </span>
            </div>
            <div className="w-1 h-1 bg-gray-300 rounded-full dark:bg-gray-600" />
            <span className="text-xs text-gray-500 dark:text-gray-500">
              Active now
            </span>
          </div>
        </motion.div>
      </motion.div>
    </motion.header>
  );
};

export default CrmSidebarHeader;
