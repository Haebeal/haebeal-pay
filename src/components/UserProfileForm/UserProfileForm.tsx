import {
  Button,
  Divider,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Link,
  Skeleton,
  Spacer,
  Stack,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useAuth } from "@/hooks/useAuth";
import { User } from "@/types";
import { FaGoogle } from "react-icons/fa";

export const UserProfileForm = () => {
  const toast = useToast();
  const [isLoading, setLoading] = useState(true);
  const {
    currentUser,
    updateUserProfile,
    changeGoogleLink,
    refreshCurrentUser,
  } = useAuth();

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<User>();
  const onSubmit: SubmitHandler<User> = async (formData) => {
    setLoading(true);
    await updateUserProfile({
      displayName: formData.name,
      photoURL: formData.photoURL,
    });
    toast({
      title: "更新しました",
      status: "success",
    });
    setLoading(false);
  };

  useEffect(() => {
    refreshCurrentUser();
    setLoading(true);
    reset({
      id: currentUser?.uid,
      name: currentUser?.displayName ?? "",
      photoURL: currentUser?.photoURL ?? "",
    });
    setLoading(false);
  }, []);

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
        <Heading size="md">プロフィール設定</Heading>
        <Divider />
        <FormControl isInvalid={errors.id ? true : false}>
          <Stack direction={{ base: "column", md: "row" }}>
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
              {...register("id")}
              noOfLines={1}
              size="md"
              border="none"
              type="text"
              readOnly
            />
          </Stack>
        </FormControl>
        <FormControl isInvalid={errors.name ? true : false}>
          <Stack direction={{ base: "column", md: "row" }}>
            <Heading
              w={{ base: "", md: "30%" }}
              as={FormLabel}
              pt={2}
              size="sm"
              noOfLines={1}
            >
              表示名
            </Heading>
            <Input
              placeholder="ユーザー名"
              {...register("name")}
              noOfLines={1}
              size="md"
              bg="gray.200"
              border="none"
              type="text"
              required
            />
          </Stack>
        </FormControl>
        <FormControl isInvalid={errors.photoURL ? true : false}>
          <Stack direction={{ base: "column", md: "row" }}>
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
                placeholder="ユーザーID"
                value={
                  currentUser?.providerData.find(
                    (provider) => provider.providerId === "google.com"
                  )?.email ?? ""
                }
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
                onClick={changeGoogleLink}
              >
                別アカウントを連携
              </Button>
            </Stack>
          </Stack>
        </FormControl>
        <FormControl isInvalid={errors.photoURL ? true : false}>
          <Stack direction={{ base: "column", md: "row" }}>
            <Heading
              w={{ base: "", md: "30%" }}
              as={FormLabel}
              pt={2}
              size="sm"
              noOfLines={1}
            >
              プロフィール画像
            </Heading>
            <Heading pt={2} size="sm" noOfLines={1}>
              <Link
                color="teal.500"
                href="https://support.google.com/accounts/answer/27442?hl=ja&co=GENIE.Platform%3DDesktop&oco=0"
                isExternal
              >
                本サイト
              </Link>
              を参考に変更してください
            </Heading>
          </Stack>
        </FormControl>
        <Button type="submit" w="80%" colorScheme="twitter">
          更新
        </Button>
      </VStack>
    </Skeleton>
  );
};
