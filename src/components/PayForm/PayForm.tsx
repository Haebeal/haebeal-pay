import {
  Button,
  Divider,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Select,
  Skeleton,
  Stack,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useCalcEvents } from "@/hooks/useCalcEvents";
import { useUsers } from "@/hooks/useUsers";
import { CalcEvent } from "@/types";

export const PayForm = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [isLoading, setLoading] = useState(false);
  const { users } = useUsers();
  const { currentUser } = useAuth();
  const { addCalcEvent } = useCalcEvents();

  const {
    register,
    handleSubmit,
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
                    {user.name}
                  </option>
                ))}
            </Select>
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
