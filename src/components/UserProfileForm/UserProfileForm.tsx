import {
  Button,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
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
import { Profile } from "@/types";
import { useUsers } from "@/hooks/useUsers";
import { useBank } from "@/hooks/useBank";

export const UserProfileForm = () => {
  const toast = useToast();
  const [isLoading, setLoading] = useState(true);
  const { currentUser, updateUserProfile, refreshCurrentUser } = useAuth();
  const { users } = useUsers();
  const { banks } = useBank();

  const {
    register,
    reset,
    handleSubmit,
    watch,
    setValue,
    setError,
    formState: { errors },
  } = useForm<Profile>();
  const onSubmit: SubmitHandler<Profile> = async (formData) => {
    setLoading(true);
    try {
      if (formData.branchCode && formData.branchName) {
        const endpoint = `https://bank.teraren.com/banks/${formData.bankCode}/branches/${formData.branchCode}.json`;
        const response = await fetch(endpoint);
        const result = await response.json();
        if (result.name !== formData.branchName) {
          throw new Error("");
        }
      }
      await updateUserProfile(formData);
      toast({
        title: "更新しました",
        status: "success",
      });
    } catch (error) {
      setError("branchCode", {
        message: "正しい店番を入力して下さい",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    refreshCurrentUser();
    const currentUserProfile = users.find(
      (user) => user.id === currentUser?.uid,
    );
    if (currentUserProfile) {
      reset(currentUserProfile);
    }
    setLoading(false);
  }, []);

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
      setValue("branchName", "");
      return;
    }
    const endpoint = `https://bank.teraren.com/banks/${bankCode}/branches/${branchCode}.json`;
    try {
      const response = await fetch(endpoint);
      const result = await response.json();
      setValue("branchName", result.name);
    } catch (error) {
      setValue("branchName", "");
      toast({
        status: "error",
        title: "支店・出張所名を取得できませんでした",
      });
    }
  };
  const clearBankInfo = () => {
    setValue("bankCode", "");
    setValue("branchCode", "");
    setValue("branchName", "");
    setValue("accountCode", "");
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
        <FormControl isInvalid={errors.displayName ? true : false}>
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
              {...register("displayName")}
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
        <FormControl isInvalid={errors.bankCode ? true : false}>
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
              {...register("bankCode", {
                validate: (data) => {
                  if (!data && (watch("branchCode") || watch("accountCode")))
                    return "金融機関を選択してください";
                },
              })}
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
          <FormErrorMessage>{errors.bankCode?.message}</FormErrorMessage>
        </FormControl>
        <FormControl
          isInvalid={errors.branchCode || errors.branchName ? true : false}
        >
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
                {...register("branchName", {
                  validate: (data) => {
                    if (watch("branchCode") && !data)
                      return "正しい店番を入力して下さい";
                  },
                })}
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
                {...register("branchCode", {
                  validate: (data) => {
                    if (!data && (watch("bankCode") || watch("accountCode")))
                      return "店番を入力して下さい";
                  },
                })}
                noOfLines={1}
                size="md"
                bg="gray.200"
                border="none"
                type="number"
              />
              <Button colorScheme="twitter" onClick={getBranch}>
                検索
              </Button>
            </HStack>
          </Stack>
          <FormErrorMessage>{errors.branchCode?.message}</FormErrorMessage>
          <FormErrorMessage>{errors.branchName?.message}</FormErrorMessage>
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
              {...register("accountCode", {
                validate: (data) => {
                  if (!data && (watch("bankCode") || watch("branchCode")))
                    return "口座番号を入力して下さい";
                },
              })}
              noOfLines={1}
              size="md"
              bg="gray.200"
              border="none"
              type="number"
            />
          </Stack>
          <FormErrorMessage>{errors.accountCode?.message}</FormErrorMessage>
        </FormControl>
        <Flex w="full">
          <Spacer />
          <Button size="sm" colorScheme="red" onClick={clearBankInfo}>
            クリア
          </Button>
        </Flex>
        <Button mt={5} type="submit" w="80%" colorScheme="twitter">
          更新
        </Button>
      </VStack>
    </Skeleton>
  );
};
