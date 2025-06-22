import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Route as RouteType } from "../types/types";
import CrmSidebar from "../components/CrmSidebar";
import LandingPage from "../pages/LandingPage";
import NotFoundPage from "../pages/NotFoundPage";
import LoginPage from "../pages/LoginPage";
import TicketsPage from "../pages/TicketsPage";
import ProtectedRoute from "./ProtectedRoute";
import TicketPage from "../pages/TicketPage";
import DashboardPage from "../pages/DashboardPage";
import UsersPage from "../pages/UsersPage";
import CategoriesPage from "../pages/CategoriesPage";
import ReportsPage from "../pages/ReportsPage";
import UnauthorizedPage from "../pages/UnauthorizedPage";
import DepartmentsPage from "../pages/DepartmentsPage";

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
      path: "/ticket",
      element: (
        <ProtectedRoute allowedRoles={["user", "admin"]}>
          <TicketsPage />
        </ProtectedRoute>
      ),
    },
    {
      name: "Ticket Page",
      hidden: false,
      path: "ticket/:ticketId",
      element: (
        <ProtectedRoute allowedRoles={["user", "admin"]}>
          <TicketPage />
        </ProtectedRoute>
      ),
    },
    {
      name: "Dashboard Page",
      hidden: true,
      path: "dashboard",
      element: (
        <ProtectedRoute allowedRoles={["admin"]}>
          <DashboardPage />
        </ProtectedRoute>
      ),
    },
    {
      name: "Users Page",
      hidden: true,
      path: "users",
      element: (
        <ProtectedRoute allowedRoles={["admin"]}>
          <UsersPage />
        </ProtectedRoute>
      ),
    },
    {
      name: "Departments Page",
      hidden: true,
      path: "departments",
      element: (
        <ProtectedRoute allowedRoles={["admin"]}>
          <DepartmentsPage />
        </ProtectedRoute>
      ),
    },
    {
      name: "Categories Page",
      hidden: true,
      path: "categories",
      element: (
        <ProtectedRoute allowedRoles={["admin", "user"]}>
          <CategoriesPage />
        </ProtectedRoute>
      ),
    },
    {
      name: "Reports Page",
      hidden: true,
      path: "reports",
      element: (
        <ProtectedRoute allowedRoles={["admin", "user"]}>
          <ReportsPage />
        </ProtectedRoute>
      ),
    },
    {
      name: "Knowledgebase Page",
      hidden: true,
      path: "knowledgebase",
      element: (
        <ProtectedRoute allowedRoles={["admin", "user"]}>
          <ReportsPage />
        </ProtectedRoute>
      ),
    },
    {
      name: "Unauthorized Page",
      hidden: true,
      path: "unauthorized",
      element: <UnauthorizedPage />,
    },
  ];

  return (
    <Router>
      <CrmSidebar>
        <Routes>
          {routes.map((route, index) => (
            <Route key={index} path={route.path} element={route.element} />
          ))}
        </Routes>
      </CrmSidebar>
    </Router>
  );
};
export default RouteProvider;
