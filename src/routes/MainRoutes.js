import { lazy } from "react";

// project imports
import MainLayout from "layout/MainLayout";
import Loadable from "ui-component/Loadable";
import { Navigate } from "react-router-dom";

// sample page routing
const MarketPlace = Loadable(lazy(() => import("views/product/Marketplace")));
const CreateProduct = Loadable(
  lazy(() => import("views/product/CreateProduct"))
);
const UserProfile = Loadable(lazy(() => import("views/user/UserProfile")));
const ProductPage = Loadable(
  lazy(() => import("views/product/ProductPage/ProductPage"))
);
const TestForm = Loadable(lazy(() => import("views/TestForm")));
// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: "/",
  element: <MainLayout />,
  children: [
    {
      path: "",
      element: <MarketPlace />,
    },
    {
      path: "/my-product/create",
      element: <CreateProduct />,
    },
    {
      path: "/user/account-profile",
      element: <UserProfile />,
    },
    {
      path: "*",
      element: <Navigate to="/" />,
    },
    {
      path: "/product/:id",
      element: <ProductPage />,
    },
    {
      path: "/form",
      element: <TestForm />,
    },
  ],
};

export default MainRoutes;
