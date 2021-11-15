import { lazy } from "react";

// project imports
import MainLayout from "layout/MainLayout";
import Loadable from "ui-component/Loadable";
import { Navigate } from "react-router-dom";

const ShoppingHomePage = Loadable(
  lazy(() => import("views/shoppingHomePage/ShoppingHomePage"))
);

// sample page routing
const MarketPlace = Loadable(lazy(() => import("views/product/MarketPlace")));
const CreateProduct = Loadable(
  lazy(() => import("views/product/CreateProduct"))
);
const UserProfile = Loadable(lazy(() => import("views/user/UserProfile")));
const SingleProduct = Loadable(
  lazy(() => import("views/product/SingleProduct"))
);
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
      path: "/shopping",
      element: <ShoppingHomePage />,
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
      path: "/product/id",
      element: <SingleProduct />,
    },
  ],
};

export default MainRoutes;
