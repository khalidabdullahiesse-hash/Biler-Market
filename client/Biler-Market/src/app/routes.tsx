import { createBrowserRouter } from "react-router";
import { LoginPage } from "./pages/LoginPage";
import { DashboardLayout } from "./components/DashboardLayout";
import { DashboardPage } from "./pages/DashboardPage";
import { ProductsPage } from "./pages/ProductsPage";
import { UsersPage } from "./pages/UsersPage";
import { LoansPage } from "./pages/LoansPage";
import { SettingsPage } from "./pages/SettingsPage";

export const router = createBrowserRouter([
  {
    path: "/login",
    Component: LoginPage,
  },
  {
    path: "/",
    Component: DashboardLayout,
    children: [
      { index: true, Component: DashboardPage },
      { path: "products", Component: ProductsPage },
      { path: "users", Component: UsersPage },
      { path: "loans", Component: LoansPage },
      { path: "settings", Component: SettingsPage },
    ],
  },
]);
