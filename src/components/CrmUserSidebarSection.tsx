import { PrimeIcons } from "primereact/api";
import { Button } from "primereact/button";
import { motion, AnimatePresence } from "framer-motion";
import { ButtonType } from "../types/types";
import { useLocation, useNavigate } from "react-router-dom";
import useSelectedButtonStore from "../@utils/store/selectedButton";
import useUserDataStore from "../@utils/store/userDataStore";
import isAuthorized from "../@utils/functions/isAuthorized";
import { useEffect, useMemo } from "react";
import CrmAsideButtonToggler from "./CrmAsideButtonToggler";

const CrmUserSidebarSection = () => {
  const navigate = useNavigate();
  const { user } = useUserDataStore();
  const { id, setId } = useSelectedButtonStore();
  const { pathname } = useLocation();

  // Modern approach: Extract current location and update state
  useEffect(() => {
    const currentLocation = pathname.split("/")[1];
    if (currentLocation) setId(currentLocation);
  }, [pathname, setId]);

  // Modern approach: Define navigation items with better structure
  const navigationItems = useMemo(
    (): (ButtonType & { allowedRoles: string[] })[] => [
      {
        id: "dashboard",
        name: "Dashboard",
        icon: "pi pi-wave-pulse",
        path: "/dashboard",
        allowedRoles: ["admin"],
      },
      {
        id: "ticket",
        name: "Tickets",
        icon: PrimeIcons.TICKET,
        path: "/ticket",
        allowedRoles: ["user", "admin"],
      },
      {
        id: "users",
        name: "Users",
        icon: PrimeIcons.USERS,
        path: "/users",
        allowedRoles: ["admin"],
      },
      {
        id: "departments",
        name: "Departments",
        icon: PrimeIcons.BUILDING,
        path: "/departments",
        allowedRoles: ["admin"],
      },
      {
        id: "categories",
        name: "Categories",
        icon: PrimeIcons.ALIGN_CENTER,
        path: "/categories",
        allowedRoles: ["admin"],
      },
      {
        id: "reports",
        name: "Reports",
        icon: "pi pi-wave-pulse",
        path: "/reports",
        allowedRoles: ["admin"],
      },
      {
        id: "knowledgebase",
        name: "Knowledgebase",
        icon: PrimeIcons.CHEVRON_CIRCLE_LEFT,
        path: "/knowledgebase",
        allowedRoles: ["admin", "user"],
      },
    ],
    []
  );

  const authorizedButtons = useMemo(
    (): ButtonType[] =>
      navigationItems.filter((item) => isAuthorized(user, item.allowedRoles)),
    [navigationItems, user]
  );

  // Modern approach: Consolidated navigation handler
  const handleNavigation = (button: ButtonType) => {
    setId(button.id);
    navigate(button.path);
  };

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col h-full overflow-hidden"
    >
      {/* Sidebar Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="px-4 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50"
      >
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg">
            <i className="text-lg text-white pi pi-sitemap" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-800">
              Westlake Medical Center
            </h3>
            <p className="text-sm text-gray-600">Ticketing System</p>
          </div>
        </div>
      </motion.div>

      {/* Navigation Section */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="flex justify-between px-4 py-3 border-b border-gray-100"
        >
          <small className="text-xs font-semibold tracking-wide text-gray-700 uppercase">
            Navigation
          </small>
          <CrmAsideButtonToggler />
        </motion.div>

        {/* Scrollable Navigation Buttons */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          <div className="flex flex-col gap-1 p-2">
            <AnimatePresence>
              {authorizedButtons.map((button, index) => {
                const isActive = id === button.id;

                return (
                  <motion.div
                    key={button.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{
                      delay: index * 0.05,
                      duration: 0.3,
                      ease: "easeOut",
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      className={`
                        relative items-center w-full px-3 py-2 text-xs border-none h-9 font-medium 
                        transition-all duration-300 ease-in-out rounded-lg
                        focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:ring-offset-1
                        group overflow-hidden
                        ${
                          isActive
                            ? "!bg-gradient-to-r !from-blue-500 !to-blue-600 !text-white shadow-lg transform scale-[1.02]"
                            : "bg-transparent text-gray-800 hover:bg-blue-50 hover:text-blue-700"
                        }
                      `}
                      onClick={() => handleNavigation(button)}
                    >
                      {/* Icon with consistent styling */}
                      <i
                        className={`
                          ${
                            button.icon
                          } me-3 text-lg transition-all duration-300
                          ${
                            isActive
                              ? "!text-white"
                              : "text-gray-700 group-hover:scale-110 group-hover:text-blue-700"
                          }
                        `}
                      />

                      <span
                        className={`relative z-10 text-left ${
                          isActive ? "!text-white" : ""
                        }`}
                      >
                        {button.name}
                      </span>

                      {/* Hover effect background - only for inactive buttons */}
                      {!isActive && (
                        <motion.div className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-r from-blue-50 to-blue-100 group-hover:opacity-100" />
                      )}

                      {/* Active indicator */}
                      {isActive && (
                        <motion.div
                          layoutId="activeIndicator"
                          className="absolute top-0 bottom-0 left-0 w-1 bg-white rounded-r-full"
                          transition={{
                            type: "spring",
                            stiffness: 500,
                            damping: 30,
                          }}
                        />
                      )}
                    </Button>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>

        {/* Bottom Decorative Element */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="h-px mx-4 mt-2 mb-4 bg-gradient-to-r from-transparent via-gray-300 to-transparent"
        />
      </div>
    </motion.section>
  );
};

export default CrmUserSidebarSection;
