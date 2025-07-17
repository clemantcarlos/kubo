import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import { Suspense, lazy } from "react";
// PROTECTED ROUTES
import ProtectedRoute from "@/components/auth/components/ProtectedRoute";
// UI
import { ModeToggle } from "@/components/theme/ModeToggle";
import { Toaster } from "sonner";
//CONTEXT
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { UserProvider } from "@/context/user";
import { SpinnerProvider } from "./context/Spinner";
import { GlobalProvider } from "./context/Global";
// COMPONENTS
import Spinner from "./components/global/loaders/Spinner";
// CSS
import "@/index.css";

// LAZY IMPORTS
// AUTH
const LogInPage = lazy(() => 
  import("@/modules/auth/pages/LogIng").then(module => ({default: module.default}))
)
// LAYOUTS
const POSLayout = lazy(() => 
  import("./modules/pos/components/pos-layout").then(module => ({default: module.default}))
);
const DashboardLayout = lazy(() => 
  import("@/modules/dashboard/components/dashboard-layout").then(module => ({default: module.default}))
);
// TABLES
const Tables = lazy(() => 
  import("@/modules/restaurant/page/Tables").then(module => ({default: module.default}))
);
const Table = lazy(() => 
  import("@/modules/restaurant/page/Table").then(module => ({default: module.default}))
);
// INVENTORY
const Products = lazy(() => 
  import("@/modules/Inventory/pages/Products").then(module => ({default: module.default}))
);
const Suppliers = lazy(
  () => import("./modules/Inventory/pages/Suppliers").then(module => ({default: module.default}))
);
const Purchase = lazy(() => 
  import("./modules/Inventory/pages/Purchase").then(module => ({default: module.default}))
);
// POS
const POSHome = lazy(() => 
  import("@/modules/pos/pages/Home").then(module => ({default: module.default}))
);

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
        path: "purchase",
        children: [
          {
            index: true,
            element: <Purchase />,
            handle: {
              crumbModule: "Inventario",
              crumb: "Compras",
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
          <Suspense fallback={<Spinner />}>
            <RouterProvider router={router} />
          </Suspense>
        </GlobalProvider>
        <Toaster theme="system" />
        <ModeToggle />
        <Spinner />
      </SpinnerProvider>
    </UserProvider>
  </ThemeProvider>
);