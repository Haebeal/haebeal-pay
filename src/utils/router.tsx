import { createBrowserRouter } from "react-router-dom";
import { SigninPage } from "../pages/signin";
import { Layout } from "../pages/laout";
import { CalcPage } from "../pages/calc";
import { EventPage } from "../pages/calc/event";
import { CreateEventPage } from "../pages/calc/event/create";
import { EditEventPage } from "../pages/calc/event/:id";
import { PayPage } from "../pages/calc/pay";
import { NotFoundPage } from "../pages/notfound";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <CalcPage />,
      },
      {
        path: "event",
        element: <EventPage />,
      },
      {
        path: "event/create",
        element: <CreateEventPage />,
      },
      {
        path: "event/:id",
        element: <EditEventPage />,
      },
      {
        path: "pay",
        element: <PayPage />,
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
  {
    path: "signin",
    element: <SigninPage />,
  },
]);