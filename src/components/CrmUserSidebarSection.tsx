import { PrimeIcons } from "primereact/api";
import { Button } from "primereact/button";
import { motion, AnimatePresence } from "framer-motion";
import { ButtonType } from "../types/types";
import { useLocation, useNavigate } from "react-router-dom";
import useSelectedButtonStore from "../@utils/store/selectedButton";
import useUserDataStore from "../@utils/store/userDataStore";
import isAuthorized from "../@utils/functions/isAuthorized";
import { useEffect, useMemo } from "react";

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

  // Modern approach: Memoized filtered buttons
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
      className="flex-1 overflow-hidden"
    >
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="mx-3 mb-3"
      >
        <small className="text-xs font-semibold tracking-wide text-gray-700 uppercase">
          Pages
        </small>
      </motion.div>

      {/* Navigation Buttons */}
      <div className="flex flex-col gap-1 mx-2">
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
                    ${
                      isActive
                        ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg transform scale-[1.02]"
                        : "bg-transparent text-gray-800 hover:bg-blue-50 hover:text-blue-700"
                    }
                    focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:ring-offset-1
                    group overflow-hidden
                  `}
                  onClick={() => handleNavigation(button)}
                >
                  {/* Icon with consistent styling */}
                  <i
                    className={`
                      ${button.icon} me-3 text-lg transition-all duration-300
                      ${
                        isActive
                          ? "text-white"
                          : "text-gray-700 group-hover:scale-110 group-hover:text-blue-700"
                      }
                    `}
                  />

                  <span className="relative z-10 text-left">{button.name}</span>

                  {/* Hover effect background */}
                  <motion.div
                    className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-r from-blue-50 to-blue-100 group-hover:opacity-100"
                    layoutId={isActive ? "activeBackground" : undefined}
                  />

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

      {/* Bottom Decorative Element */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
        className="h-px mx-3 mt-6 bg-gradient-to-r from-transparent via-gray-300 to-transparent"
      />
    </motion.section>
  );
};

export default CrmUserSidebarSection;
