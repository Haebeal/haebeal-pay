import {
  Box,
  Button,
  Center,
  Container,
  Divider,
  Heading,
  Input,
  VStack,
} from "@chakra-ui/react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

export const SigninPage = () => {
  const { signin, currentUser } = useAuth();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const signinWithPassword = () => {
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password);
  };

  if (currentUser) {
    return <Navigate to="/" />;
  }

  return (
    <Container maxW="container.lg" minH="calc(100vh - 80px)" as="main">
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
          <VStack mt={3}>
            <Divider />
            <Input
              placeholder="Email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              noOfLines={1}
              size="md"
              bg="gray.200"
              border="none"
              type="text"
              required
            />
            <Input
              placeholder="Password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              noOfLines={1}
              size="md"
              bg="gray.200"
              border="none"
              type="text"
              required
            />
            <Button colorScheme="twitter" onClick={signinWithPassword}>
              SignIn with Password
            </Button>
          </VStack>
        </Box>
      </Center>
    </Container>
  );
};
