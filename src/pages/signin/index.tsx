import {
  Box,
  Button,
  Center,
  Divider,
  Heading,
  VStack,
} from "@chakra-ui/react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export const SigninPage = () => {
  const { signin, currentUser } = useAuth();

  if (currentUser) {
    return <Navigate to="/" />;
  }

  return (
    <Center minH="calc(100vh - 80px)">
      <Box gap={4} minW="75%" bg="white" rounded="md" px={14} py={10}>
        <VStack gap={3}>
          <Heading size="lg">Hebel Site</Heading>
          <Heading size="xs" color="gray">
            @hebel.pwでログインしてください
          </Heading>
          <Divider />
          <Button minW="80%" colorScheme="twitter" onClick={signin}>
            Googleでログイン
          </Button>
        </VStack>
      </Box>
    </Center>
  );
};
