import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Route as RouteType } from "../types/types";
import CrmSidebar from "../components/CrmSidebar";
import LandingPage from "../pages/LandingPage";
import NotFoundPage from "../pages/NotFoundPage";
import LoginPage from "../pages/LoginPage";
import TicketsPage from "../pages/TicketsPage";
import ProtectedRoute from "./ProtectedRoute";

const RouteProvider = () => {
  const routes: RouteType[] = [
    {
      name: "Login Page",
      hidden: true,
      path: "/login",
      element: <LoginPage />,
    },
    {
      name: "Not Found Page",
      hidden: false,
      path: "*",
      element: <NotFoundPage />,
    },
    {
      name: "Landing Page",
      hidden: false,
      path: "/",
      element: <LandingPage />,
    },
    {
      name: "Tickets Page",
      hidden: false,
      path: "/tickets",
      element: (
        <ProtectedRoute allowedRoles={[{ name: "admin" }, { name: "user" }]} />
      ),
    },
  ];

  return (
    <Router>
      <CrmSidebar>
        <Routes>
          {routes.map((route, index) => (
            <Route key={index} element={route.element} path={route.path} />
          ))}
          {/* Protected Nested Route */}
          <Route
            element={
              <ProtectedRoute
                allowedRoles={[{ name: "admin" }, { name: "user" }]}
              />
            }
          >
            <Route path="/tickets" element={<TicketsPage />} />
          </Route>
        </Routes>
      </CrmSidebar>
    </Router>
  );
};

export default RouteProvider;
