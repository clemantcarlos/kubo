import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
// PROTECTED ROUTES
import ProtectedRoute from "@/components/auth/components/ProtectedRoute";
// UI
import { ModeToggle } from "@/components/theme/ModeToggle";
import { Toaster } from "sonner";
// ROUTER COMPONENTS
// AUTH
import LogInPage from "@/modules/auth/pages/LogIng";
// DASHBOARD
import DashboardLayout from "@/modules/dashboard/components/dashboard-layout";
// RESTAURANT
import Tables from "@/modules/restaurant/page/Tables";
import Table from "@/modules/restaurant/page/Table";
// INVENTORY
import Products from "@/modules/Inventory/pages/Products";
import PurchaseOrders from "./modules/Inventory/pages/PurchaseOrders";
import Suppliers from "./modules/Inventory/pages/Suppliers";
//CONTEXT
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { UserProvider } from "@/context/user";
import { SpinnerProvider } from "./context/Spinner";
// CSS
import "@/index.css";
import Spinner from "./components/global/loaders/Spinner";
import { GlobalProvider } from "./context/Global";
// POS
import POSHome from "@/modules/pos/pages/Home";
import POSLayout from "./modules/pos/components/pos-layout";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <POSLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <POSHome />,
        handle: {
          crumbModule: "POS",
          crumb: "Home",
        },
      },
    ],
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
        children: [
          {
            index: true,
            element: <Tables />,
            handle: {
              crumbModule: "Restaurante",
              crumb: "Mesas",
            },
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
        element: <POSHome />,
        handle: {
          crumbModule: "restaurante",
          crumb: "Mesoneros",
        },
      },
      {
        path: "products",
        children: [
          {
            index: true,
            element: <Products />,
            handle: {
              crumbModule: "Inventario",
              crumb: "Productos",
            },
          },
        ],
      },
      {
        path: "purchase-orders",
        children: [
          {
            index: true,
            element: <PurchaseOrders />,
            handle: {
              crumbModule: "Inventario",
              crumb: "Ordenes de Compra",
            },
          },
        ],
      },
      {
        path: "suppliers",
        children: [
          {
            index: true,
            element: <Suppliers />,
            handle: {
              crumbModule: "Inventario",
              crumb: "Proveedores",
            },
          },
        ],
      },
    ],
  },
  {
    path: "/signin",
    element: <LogInPage />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
    <UserProvider>
      <SpinnerProvider>
        <GlobalProvider>
          <RouterProvider router={router} />
        </GlobalProvider>
        <Toaster theme="system" />
        <ModeToggle />
        <Spinner />
      </SpinnerProvider>
    </UserProvider>
  </ThemeProvider>
);
