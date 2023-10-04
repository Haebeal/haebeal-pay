import { Link, Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { Box, Container, IconButton } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { Header } from "../../components/header";

export const Layout = () => {
  const { currentUser } = useAuth();
  const { pathname } = useLocation();

  if (!currentUser) {
    return <Navigate to="/signin" />;
  }

  return (
    <>
      <Box h="80px" bg="white">
        <Header />
      </Box>
      <Container maxW="container.lg" minH="calc(100vh - 80px)" as="main">
        <Outlet />
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
    </>
  );
};
