import { useAuth } from "@/hooks/useAuth";
import {
  Button,
  Divider,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Skeleton,
  Spacer,
  Stack,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { FaGoogle } from "react-icons/fa";

interface PasswordFormProps {
  email: string;
  password: string;
}

export const AccountForm = () => {
  const toast = useToast();
  const [isLoading, setLoading] = useState(true);
  const [id, setId] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PasswordFormProps>();
  const onSubmit: SubmitHandler<PasswordFormProps> = async (formData) => {
    setLoading(true);
    await updateEmailAndPassword(formData);
    toast({
      title: "更新しました",
      status: "success",
    });
    refreshCurrentUser();
    if (currentUser) {
      reset({
        email: currentUser.email ?? "",
        password: "",
      });
    }
    setLoading(false);
  };

  const {
    currentUser,
    refreshCurrentUser,
    changeGoogleLink,
    updateEmailAndPassword,
  } = useAuth();
  const linkOtherAccount = async () => {
    try {
      await changeGoogleLink();
      toast({
        title: "Google連携を更新しました",
        status: "success",
      });
    } catch (error) {
      toast({
        title: (error as any).message,
        status: "error",
      });
    }
  };

  useEffect(() => {
    setLoading(true);
    refreshCurrentUser();
    if (currentUser) {
      setId(currentUser.uid);
      reset({
        email: currentUser.email ?? "",
        password: "",
      });
    }
    setLoading(false);
  }, [currentUser]);

  const linkedGoogleAccount = currentUser?.providerData.find(
    (provider) => provider.providerId === "google.com"
  )?.email;

  return (
    <Skeleton isLoaded={!isLoading}>
      <VStack
        bg="white"
        rounded="md"
        px={10}
        py={8}
        gap={5}
        as="form"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Heading size="md">アカウント設定</Heading>
        <Divider />
        <Stack w="full" direction={{ base: "column", md: "row" }}>
          <Heading
            w={{ base: "", md: "30%" }}
            as={FormLabel}
            pt={2}
            size="sm"
            noOfLines={1}
          >
            ユーザーID
          </Heading>
          <Input
            placeholder="ユーザーID"
            value={id}
            noOfLines={1}
            size="md"
            border="none"
            type="text"
            readOnly
          />
        </Stack>
        <Stack w="full" direction={{ base: "column", md: "row" }}>
          <Heading
            w={{ base: "", md: "30%" }}
            as={FormLabel}
            pt={2}
            size="sm"
            noOfLines={1}
          >
            Google連携
          </Heading>
          <Stack w="full" direction={{ base: "column", md: "row" }}>
            <Input
              w={{ base: "", md: "70%" }}
              placeholder="Email"
              value={linkedGoogleAccount ?? "未連携"}
              noOfLines={1}
              size="md"
              border="none"
              type="text"
              readOnly
            />
            <Spacer />
            <Button
              leftIcon={<FaGoogle />}
              colorScheme="twitter"
              onClick={linkOtherAccount}
            >
              {linkedGoogleAccount && "別"}アカウントを連携
            </Button>
          </Stack>
        </Stack>
        <Divider />
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
        <Button mt={5} type="submit" w="80%" colorScheme="twitter">
          更新
        </Button>
      </VStack>
    </Skeleton>
  );
};
