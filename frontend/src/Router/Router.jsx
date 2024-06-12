import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Home And Main Home1
import Main from "../Main/Main";
import Home1 from "../Pages/Home1/Home1";
import MainBackoffice from "../Main/MainBackoffice";


// All InnerPage
import About from "../Pages/InnerPage/About";
import Room from "../Pages/InnerPage/Room";
import FindRoom from "../Pages/InnerPage/FindRoom";
import RoomDetails from "../Pages/InnerPage/RoomDetails";
import Services from "../Pages/InnerPage/Services";
import ServiceDetails from "../Pages/InnerPage/ServiceDetails";
import Team from "../Pages/InnerPage/Team";
import Pricing from "../Pages/InnerPage/Pricing";
import Blog from "../Pages/InnerPage/Blog";
import BlogDetails from "../Pages/InnerPage/BlogDetails";
import Contact from "../Pages/InnerPage/Contact";
import ErrorPage from "../Shared/ErrorPage/ErrorPage";
import Backoffice from "../Pages/Backoffice/Backoffice";
import LogIn from "../Shared/User/LogIn";
import Register from "../Shared/User/Register"; 
import { AuthProvider } from "./../RolesRoutes/AuthProvider";
import PrivateRoute from "./../RolesRoutes/PrivateRoute";
import Profile from "../Shared/User/Profile";
import Mailbox from "../Pages/Backoffice/Mailbox";
import BlogManagement from "../Pages/Backoffice/BlogManagement";
import UserAccounts from "../Pages/Backoffice/UserAccounts";
import Reservations from "../Pages/Backoffice/Reservations";



// Starting React Router.
const router = createBrowserRouter([
  {
    path: "/",
    // element: <Main />,
    element:<AuthProvider> <Main /></AuthProvider>,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Home1 />,
      },
      {
          path: "/about",
        element: <About />,
      },
      {
        path: "/room",
        element: <Room />,
      },
      {
        path: "/find_room",
        element: <FindRoom />,
      },
      {
        path: "/room_details",
        element: <RoomDetails />,
      },
      {
        path: "/services",
        element: <Services />,
      },
      {
        path: "/service_details/:id",
        element: <ServiceDetails />,
      },
      {
        path: "/our_team",
        element: <Team />,
      },
      {
        path: "/pricing",
        element: <Pricing />,
      },
      {
        path: "/blog",
        element: <Blog />,
      },
      {
        path: "/blog_details/:id",
        element: <BlogDetails />,
      },
      {
        path: "/contact",
        element: <Contact />,
      },
      {
        path: "/login",
        element: <LogIn />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
    ],
  },
  { 
    path: "/",
    element: (
      <PrivateRoute allowedRoles={['ADMIN', 'Admin', 'WEBMASTER', 'REDACTEUR', 'RECEPTIONIST', 'UTILISATEUR']}>
        <MainBackoffice />
      </PrivateRoute>
    ),
    children: [
      { path: "/backoffice", 
        element: <PrivateRoute allowedRoles={['ADMIN']}><Backoffice /></PrivateRoute> 
      },
      { path: "/mailbox", 
        element: <PrivateRoute allowedRoles={['ADMIN', "WEBMASTER"]}><Mailbox /></PrivateRoute> 
      },
      { path: "/blogmanagement", 
        element: <PrivateRoute allowedRoles={['ADMIN', "WEBMASTER", "REDACTEUR"]}><BlogManagement /></PrivateRoute> 
      },
      { path: "/useraccounts", 
        element: <PrivateRoute allowedRoles={['ADMIN']}><UserAccounts /></PrivateRoute> 
      },
      { path: "/reservations",
      element: <PrivateRoute allowedRoles={['ADMIN', "RECEPTIONIST", "UTILISATEUR", "WEBMASTER"]}><Reservations /></PrivateRoute>
      },
    ],
  },
]);

const RootComponent = () => {
  return <RouterProvider router={router} />;
};

export default router;
