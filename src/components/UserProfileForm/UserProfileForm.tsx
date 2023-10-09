import {
  Button,
  Divider,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  Select,
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

  const linkOtherAccount = async () => {
    await changeGoogleLink();
    toast({
      title: "更新しました",
      status: "success",
    });
  };

  const {
    register,
    reset,
    handleSubmit,
    watch,
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

  const banks: {
    code: string;
    name: string;
  }[] = [
    {
      code: "0005",
      name: "三菱UFJ銀行",
    },
  ];
  const getBranch = async () => {
    const bankCode = watch("bankCode");
    if (bankCode === "") {
      toast({
        status: "error",
        title: "金融機関を選択してください",
      });
      return;
    }
    const branchCode = watch("branchCode");
    if (branchCode === "") {
      toast({
        status: "error",
        title: "店番を入力してください",
      });
      return;
    }
    const API_TOKEN = "CNKsD8zZE1qLzPCrzyzDpGLzr2twcCS9eF3xFzM";
    const response = await fetch(
      `https://apis.bankcode-jp.com/v3/banks/${bankCode}/branches/${branchCode}`,
      {
        method: "POST",
        headers: {
          apiKey: API_TOKEN,
        },
      }
    );
    const result = await response.json();
    console.log(result);
  };

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
                placeholder="Email"
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
                onClick={linkOtherAccount}
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
            <Input
              placeholder="URLを入力"
              {...register("photoURL")}
              noOfLines={1}
              size="md"
              bg="gray.200"
              border="none"
              type="text"
              required
            />
          </Stack>
        </FormControl>
        <Divider />
        <Heading w={{ base: "" }} pt={2} size="sm" noOfLines={1}>
          振込先情報
        </Heading>
        <FormControl isInvalid={errors.photoURL ? true : false}>
          <Stack direction={{ base: "column", md: "row" }}>
            <Heading
              w={{ base: "", md: "30%" }}
              as={FormLabel}
              pt={2}
              size="sm"
              noOfLines={1}
            >
              金融機関
            </Heading>
            <Select
              placeholder="金融機関を選択"
              {...register("bankCode")}
              required
              size="md"
              bg="gray.200"
              border="none"
            >
              {banks.map((bank) => (
                <option key={bank.code} value={bank.code}>
                  {bank.name}
                </option>
              ))}
            </Select>
          </Stack>
        </FormControl>
        <FormControl isInvalid={errors.branchCode ? true : false}>
          <Stack direction={{ base: "column", md: "row" }}>
            <Heading
              w={{ base: "", md: "30%" }}
              as={FormLabel}
              pt={2}
              size="sm"
              noOfLines={1}
            >
              支店・出張所
            </Heading>
            <HStack w="full">
              <Input
                maxW={300}
                placeholder="支店・出張所名"
                value={""}
                noOfLines={1}
                size="md"
                border="none"
                type="text"
                readOnly
              />
              <Spacer />
              <Input
                maxW={200}
                placeholder="店番を入力"
                {...register("branchCode")}
                noOfLines={1}
                size="md"
                bg="gray.200"
                border="none"
                type="number"
                required
              />
              <Button colorScheme="twitter" onClick={getBranch}>
                検索
              </Button>
            </HStack>
          </Stack>
        </FormControl>
        <FormControl isInvalid={errors.accountCode ? true : false}>
          <Stack direction={{ base: "column", md: "row" }}>
            <Heading
              w={{ base: "", md: "30%" }}
              as={FormLabel}
              pt={2}
              size="sm"
              noOfLines={1}
            >
              口座番号
            </Heading>
            <Input
              placeholder="口座番号を入力"
              {...register("accountCode")}
              noOfLines={1}
              size="md"
              bg="gray.200"
              border="none"
              type="number"
              required
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
