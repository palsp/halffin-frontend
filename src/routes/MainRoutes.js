import { lazy } from "react";

// project imports
import MainLayout from "layout/MainLayout";
import Loadable from "ui-component/Loadable";
import { Navigate } from "react-router-dom";

// dashboard routing
const DashboardDefault = Loadable(
  lazy(() => import("views/dashboard/Default"))
);
const ShoppingHomePage = Loadable(
  lazy(() => import("views/shoppingHomePage/ShoppingHomePage"))
);

// utilities routing
const UtilsTypography = Loadable(
  lazy(() => import("views/utilities/Typography"))
);
const UtilsColor = Loadable(lazy(() => import("views/utilities/Color")));
const UtilsShadow = Loadable(lazy(() => import("views/utilities/Shadow")));
const UtilsMaterialIcons = Loadable(
  lazy(() => import("views/utilities/MaterialIcons"))
);
const UtilsTablerIcons = Loadable(
  lazy(() => import("views/utilities/TablerIcons"))
);

// sample page routing
const SamplePage = Loadable(lazy(() => import("views/sample-page")));
const MarketPlace = Loadable(lazy(() => import("views/product/MarketPlace")));
const CreateProduct = Loadable(
  lazy(() => import("views/product/CreateProduct"))
);
const UserProfile = Loadable(lazy(() => import("views/user/UserProfile")));
const SingleProduct = Loadable(lazy(() => import('views/product/SingleProduct') ));
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
      path: "/dashboard/default",
      element: <DashboardDefault />,
    },
    {
      path: "/utils/util-typography",
      element: <UtilsTypography />,
    },
    {
      path: "/utils/util-color",
      element: <UtilsColor />,
    },
    {
      path: "/utils/util-shadow",
      element: <UtilsShadow />,
    },
    {
      path: "/icons/tabler-icons",
      element: <UtilsTablerIcons />,
    },
    {
      path: "/icons/material-icons",
      element: <UtilsMaterialIcons />,
    },
    {
      path: "/sample-page",
      element: <SamplePage />,
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
      path: '/product/id',
      element: <SingleProduct />,
    },
  ],
};

export default MainRoutes;
