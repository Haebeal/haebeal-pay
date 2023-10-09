import {
  Box,
  Button,
  Center,
  Container,
  Divider,
  Heading,
  VStack,
} from "@chakra-ui/react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export const SigninPage = () => {
  const { signin, currentUser } = useAuth();

  if (currentUser) {
    return <Navigate to="/" />;
  }

  return (
    <Container maxW="container.lg" minH="calc(100vh - 80px)" as="main">
      <Center minH="calc(100vh - 80px)">
        <Box gap={4} minW="75%" bg="white" rounded="md" px={14} py={10}>
          <VStack gap={3}>
            <Heading size="lg">Haebeal Pay</Heading>
            <Divider />
            <Button minW="80%" colorScheme="twitter" onClick={signin}>
              Googleでログイン
            </Button>
          </VStack>
        </Box>
      </Center>
    </Container>
  );
};
