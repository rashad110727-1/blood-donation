import { createBrowserRouter } from "react-router-dom";
import Layout from "./Layout"; 
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./routes/PrivateRoute";
import Profile from "./pages/Profile";
import DashboardHome from "./pages/DashboardHome";
import CreateDonationRequest from "./pages/CreateDonationRequest";
import AllDonationRequests from "./pages/AllDonationRequests";
import MyDonationRequests from "./pages/MyDonationRequests";
import PublicDonationRequests from "./pages/PublicDonationRequests";
import DonationRequestDetails from "./pages/DonationRequestDetails";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "donation-requests",
        element: <PublicDonationRequests />,
      },
      {
        path: "donation-request/:id",
        element: <PrivateRoute><DonationRequestDetails /></PrivateRoute>,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      }
    ]
  },
  {
    path: "/dashboard",
    element: <PrivateRoute><Dashboard /></PrivateRoute>, 
    children: [
      {
        path: "",
        element: <DashboardHome />
      },
      {
        path: "profile", 
        element: <Profile />
      },
      {
        path: "create-donation-request",
        element: <CreateDonationRequest />
      },
      {
        path: "my-donation-requests",
        element: <MyDonationRequests />
      },
      {
        path: "all-donation-requests",
        element: <AllDonationRequests />
      }
    ]
  }
]);