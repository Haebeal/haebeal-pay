import { useAuth } from "@/hooks/useAuth";
import { useBank } from "@/hooks/useBank";
import { useCalcEvents } from "@/hooks/useCalcEvents";
import { useUsers } from "@/hooks/useUsers";
import { CalcEvent } from "@/types";
import { CheckIcon, CopyIcon } from "@chakra-ui/icons";
import {
  Button,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  IconButton,
  Input,
  Select,
  Skeleton,
  Stack,
  VStack,
  useClipboard,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

export const PayForm = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [isLoading, setLoading] = useState(false);
  const { users } = useUsers();
  const { banks } = useBank();
  const { currentUser } = useAuth();
  const { addCalcEvent } = useCalcEvents();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CalcEvent>({
    defaultValues: {
      event_date: new Date()
        .toLocaleDateString()
        .split("/")
        .map((e) => (e.length > 1 ? e : e.padStart(2, "0")))
        .join("-"),
    },
  });
  const onSubmit: SubmitHandler<CalcEvent> = async (formData) => {
    setLoading(true);
    try {
      await addCalcEvent({
        ...formData,
        create_user: currentUser?.uid ?? "",
        name: "支払い",
        sum_amount: formData.distributions[0].amount,
      });
      toast({
        title: "支払いを作成しました",
        status: "success",
      });
      navigate(`/`);
    } catch (e) {
      console.error(e);
      toast({
        title: "エラーが発生しました",
        status: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const selectedUser = users.find(
    (user) => user.id === watch(`distributions.0.userId`),
  );
  const bankClipboard = useClipboard("");
  const branchCodeClipboard = useClipboard("");
  const branchNameClipboard = useClipboard("");
  const accountCodeClipboard = useClipboard("");

  useEffect(() => {
    bankClipboard.setValue(selectedUser?.bankCode ?? "");
    branchCodeClipboard.setValue(selectedUser?.branchCode ?? "");
    branchNameClipboard.setValue(selectedUser?.branchName ?? "");
    accountCodeClipboard.setValue(selectedUser?.accountCode ?? "");
  }, [selectedUser]);

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
        <Heading size="md">支払い</Heading>
        <Divider />
        <FormControl isInvalid={errors.event_date ? true : false}>
          <Stack direction={{ base: "column", md: "row" }}>
            <Heading
              w={{ base: "", md: "30%" }}
              as={FormLabel}
              pt={2}
              size="sm"
              noOfLines={1}
            >
              イベント日
            </Heading>
            <Input
              placeholder="イベント日"
              {...register("event_date")}
              size="md"
              bg="gray.200"
              border="none"
              type="date"
              required
            />
          </Stack>
        </FormControl>
        <FormControl>
          <Stack direction={{ base: "column", md: "row" }}>
            <Heading
              w={{ base: "", md: "30%" }}
              as={FormLabel}
              pt={2}
              size="sm"
              noOfLines={1}
            >
              支払先
            </Heading>
            <Select
              placeholder="ユーザーを選択"
              {...register(`distributions.0.userId`)}
              required
              size="md"
              bg="gray.200"
              border="none"
            >
              {users
                .filter((user) => user.id !== currentUser?.uid)
                .map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.displayName}
                  </option>
                ))}
            </Select>
          </Stack>
        </FormControl>
        {selectedUser?.bankCode && (
          <FormControl>
            <Stack direction={{ base: "column", md: "row" }}>
              <Heading
                w={{ base: "", md: "30%" }}
                as={FormLabel}
                pt={2}
                size="sm"
                noOfLines={1}
              >
                振込先口座
              </Heading>
              <Stack w="full">
                <Flex w="full">
                  <Input
                    value={
                      banks.find((bank) => bank.code === selectedUser?.bankCode)
                        ?.name
                    }
                    mr={2}
                    border="none"
                    readOnly
                  />
                  <IconButton
                    aria-label="copy bank code"
                    onClick={bankClipboard.onCopy}
                    icon={
                      bankClipboard.hasCopied ? <CheckIcon /> : <CopyIcon />
                    }
                  />
                </Flex>
                <Flex w="full">
                  <Input
                    value={selectedUser?.branchCode}
                    mr={2}
                    border="none"
                    readOnly
                  />
                  <IconButton
                    aria-label="copy branchCode code"
                    onClick={branchCodeClipboard.onCopy}
                    icon={
                      branchCodeClipboard.hasCopied ? (
                        <CheckIcon />
                      ) : (
                        <CopyIcon />
                      )
                    }
                  />
                </Flex>
                <Flex w="full">
                  <Input
                    value={selectedUser?.branchName}
                    mr={2}
                    border="none"
                    readOnly
                  />
                  <IconButton
                    aria-label="copy branchName code"
                    onClick={branchNameClipboard.onCopy}
                    icon={
                      branchNameClipboard.hasCopied ? (
                        <CheckIcon />
                      ) : (
                        <CopyIcon />
                      )
                    }
                  />
                </Flex>
                <Flex w="full">
                  <Input
                    value={selectedUser?.accountCode}
                    mr={2}
                    border="none"
                    readOnly
                  />
                  <IconButton
                    aria-label="copy accountCode code"
                    onClick={accountCodeClipboard.onCopy}
                    icon={
                      accountCodeClipboard.hasCopied ? (
                        <CheckIcon />
                      ) : (
                        <CopyIcon />
                      )
                    }
                  />
                </Flex>
              </Stack>
            </Stack>
          </FormControl>
        )}
        <FormControl>
          <Stack direction={{ base: "column", md: "row" }}>
            <Heading
              w={{ base: "", md: "30%" }}
              as={FormLabel}
              pt={2}
              size="sm"
              noOfLines={1}
            >
              支払額
            </Heading>
            <Input
              placeholder="支払額"
              {...register(`distributions.0.amount`)}
              size="md"
              bg="gray.200"
              border="none"
              type="number"
              required
              min={0}
            />
          </Stack>
        </FormControl>
        <Button type="submit" w="80%" colorScheme="twitter">
          作成
        </Button>
      </VStack>
    </Skeleton>
  );
};
