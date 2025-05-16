import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
// PROTECTED ROUTES
import ProtectedRoute from "@/components/auth/components/ProtectedRoute";
// THEME
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { ModeToggle } from "@/components/theme/ModeToggle";
// ROUTER COMPONENTS
// AUTH
import LogInPage from "@/modules/auth/pages/LogIng";
// DASHBOARD
import DashboardLayout from "@/modules/dashboard/components/dashboard-layout";
import Home from "@/modules/dashboard/pages/Home";
// RESTAURANT
import Tables from "@/modules/restaurant/page/Tables";
import Table from "@/modules/restaurant/page/Table";
// INVENTORY
import Products from "@/modules/Inventory/pages/Products";
//CONTEXT
import { UserProvider } from "@/context/user";
// CSS
import "@/index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Home />
      </ProtectedRoute>
    ),
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        handle: {
          crumbModule: "dashboard",
          crumb: "Home",
        },
      },
      {
        path: "tables",
        handle: {
          crumbModule: "Restaurante",
          crumb: "Mesas",
        },
        children: [
          {
            index: true,
            element: <Tables />,
          },
          {
            path: ":id",
            element: <Table />,
            handle: {
              crumbModule: "Restaurante",
              crumb: "Mesas",
            },
          },
        ],
      },
      {
        path: "waiters",
        element: <Home />,
        handle: {
          crumbModule: "restaurante",
          crumb: "Mesoneros",
        },
      },
      {
        path: 'products',
        element: <Products />,
        handle: {
          crumbModule: "Inventario",
          crumb: "Productos",
        },
      }
    ],
  },
  {
    path: "/signin",
    element: <LogInPage />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <UserProvider>
        <RouterProvider router={router} />
      </UserProvider>
      <ModeToggle />
    </ThemeProvider>
  </StrictMode>
);
