import { createBrowserRouter } from "react-router-dom";
import AdminLayout from "./app/admin/layout";
import AdminPage from "./app/admin/page";
import SalesPage from "./app/admin/sales/page";
import InventoryPage from "./app/admin/inventory/page";
import UsersPage from "./app/admin/users/page";

export const router = createBrowserRouter([
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <AdminPage />,
      },
      {
        path: "sales",
        element: <SalesPage />,
      },
      {
        path: "inventory",
        element: <InventoryPage />,
      },
      {
        path: "users",
        element: <UsersPage />,
      },
    ],
  },
]); 