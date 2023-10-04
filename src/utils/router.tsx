import { createBrowserRouter } from "react-router-dom";
import { SigninPage } from "@/pages/signin";
import { Layout } from "@/pages/layout";
import { CalcPage } from "@/pages/calc";
import { EventPage } from "@/pages/calc/event";
import { CreateEventPage } from "@/pages/calc/event/create";
import { EditEventPage } from "@/pages/calc/event/:id";
import { PayPage } from "@/pages/calc/pay";
import { NotFoundPage } from "@/pages/notfound";
import { Suspense } from "react";
import { Center, VStack, Heading, CircularProgress } from "@chakra-ui/react";
import { UserProfilePage } from "@/pages/profile";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Suspense
        fallback={
          <Center h="100vh">
            <VStack gap={2}>
              <CircularProgress isIndeterminate color="twitter.500" />
              <Heading size="sm">読み込み中...</Heading>
            </VStack>
          </Center>
        }
      >
        {" "}
        <Layout />
      </Suspense>
    ),
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
        path: "profile",
        element: <UserProfilePage />,
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
