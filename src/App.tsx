import { Box, ChakraProvider, Container, IconButton } from "@chakra-ui/react";
import { Suspense } from "react";
import { Link, Route, Routes, useLocation } from "react-router-dom";
import { Header } from "./organisms/header";
import { CalcPage } from "./pages/calc";
import { EventPage } from "./pages/calc/event";
import { EditEventPage } from "./pages/calc/event/:id";
import { CreateEventPage } from "./pages/calc/event/create";
import { PayPage } from "./pages/calc/pay";
import { NotFoundPage } from "./pages/notfound";
import { AuthGuard } from "./atoms/auth-guard";
import { SigninPage } from "./pages/signin";
import { UserProfilePage } from "./pages/user/profile";
import { customTheme } from "./utils/theme";
import { AuthLoading } from "./molecules/auth-loading";
import { AddIcon } from "@chakra-ui/icons";

export const App = () => {
  const { pathname } = useLocation();

  return (
    <ChakraProvider theme={customTheme}>
      <Suspense fallback={<AuthLoading />}>
        <Box h="80px" bg="white">
          <Header />
        </Box>
        <Container maxW="container.lg" minH="calc(100vh - 80px)" as="main">
          <Routes>
            <Route
              path="/"
              element={
                <AuthGuard>
                  <CalcPage />
                </AuthGuard>
              }
            />
            <Route path="/signin" element={<SigninPage />} />
            <Route
              path="/profile"
              element={
                <AuthGuard>
                  <UserProfilePage />
                </AuthGuard>
              }
            />
            <Route
              path="/event"
              element={
                <AuthGuard>
                  <EventPage />
                </AuthGuard>
              }
            />
            <Route
              path="/event/create"
              element={
                <AuthGuard>
                  <CreateEventPage />
                </AuthGuard>
              }
            />
            <Route
              path="/event/:id"
              element={
                <AuthGuard>
                  <EditEventPage />
                </AuthGuard>
              }
            />
            <Route
              path="/pay"
              element={
                <AuthGuard>
                  <PayPage />
                </AuthGuard>
              }
            />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Container>
        {pathname !== "/event/create" && (
          <IconButton
            isRound
            position="fixed"
            right={8}
            bottom={8}
            w={16}
            h={16}
            variant="solid"
            colorScheme="twitter"
            aria-label="Create Event"
            icon={<AddIcon />}
            as={Link}
            to="/event/create"
          />
        )}
      </Suspense>
    </ChakraProvider>
  );
};
