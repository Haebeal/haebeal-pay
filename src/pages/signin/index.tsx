import {
  Box,
  Button,
  Center,
  Container,
  Divider,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { FaGoogle } from "react-icons/fa";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useForm, SubmitHandler } from "react-hook-form";
import { AuthError } from "firebase/auth";

interface PasswordFormProps {
  email: string;
  password: string;
}

export const SigninPage = () => {
  const toast = useToast();
  const { signinWithPassword, signinWithGoogle, currentUser } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PasswordFormProps>();
  const onSubmit: SubmitHandler<PasswordFormProps> = async (formData) => {
    try {
      await signinWithPassword(formData);
      toast({
        title: "ログインしました",
        status: "success",
      });
    } catch (error: any) {
      const authError = error as AuthError;
      if (authError.code === "auth/user-not-found") {
        toast({
          status: "error",
          title: "ユーザーが存在しません",
        });
      } else {
        toast({
          status: "error",
          title: authError.message,
        });
      }
    }
  };

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
            <VStack
              bg="white"
              rounded="md"
              w="full"
              py={8}
              gap={5}
              as="form"
              onSubmit={handleSubmit(onSubmit)}
            >
              <FormControl isInvalid={errors.email ? true : false}>
                <Stack direction={{ base: "column", md: "row" }}>
                  <Heading
                    w={{ base: "", md: "30%" }}
                    as={FormLabel}
                    pt={2}
                    size="sm"
                    noOfLines={1}
                  >
                    Email
                  </Heading>
                  <Input
                    placeholder="Email"
                    {...register("email")}
                    noOfLines={1}
                    size="md"
                    bg="gray.200"
                    border="none"
                    type="email"
                    required
                  />
                </Stack>
              </FormControl>
              <FormControl isInvalid={errors.password ? true : false}>
                <Stack direction={{ base: "column", md: "row" }}>
                  <Heading
                    w={{ base: "", md: "30%" }}
                    as={FormLabel}
                    pt={2}
                    size="sm"
                    noOfLines={1}
                  >
                    パスワード
                  </Heading>
                  <Input
                    placeholder="パスワード"
                    {...register("password")}
                    noOfLines={1}
                    size="md"
                    bg="gray.200"
                    border="none"
                    type="password"
                  />
                </Stack>
              </FormControl>
              <Button minW="80%" colorScheme="twitter" type="submit">
                ログイン
              </Button>
            </VStack>
            <Divider />
            <Button
              minW="80%"
              colorScheme="red"
              onClick={signinWithGoogle}
              leftIcon={<FaGoogle />}
            >
              Googleでログイン
            </Button>
          </VStack>
        </Box>
      </Center>
    </Container>
  );
};
