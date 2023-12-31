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
  Stack,
  Switch,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useCalcEvent } from "@/hooks/useCalcEvent";
import { useCalcEvents } from "@/hooks/useCalcEvents";
import { useUsers } from "@/hooks/useUsers";
import { CalcEvent } from "@/types";

export const EventForm = ({ eventId }: { eventId?: string }) => {
  const navigate = useNavigate();
  const toast = useToast();
  const [isLoading, setLoading] = useState(true);
  const { users } = useUsers();
  const { calcEvent, updateCalcEvent, refreshCalcEvent } =
    useCalcEvent(eventId);
  const { addCalcEvent } = useCalcEvents();

  const {
    register,
    control,
    watch,
    reset,
    getValues,
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
  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "distributions",
  });
  const [disableFields, setDisableFields] = useState<string[]>([]);
  const onSubmit: SubmitHandler<CalcEvent> = async (formData) => {
    setLoading(true);
    if (eventId) {
      try {
        updateCalcEvent(formData);
        toast({
          title: "イベントを更新しました",
          status: "success",
        });
      } catch (e) {
        console.error(e);
        toast({
          title: "エラーが発生しました",
          status: "error",
        });
      } finally {
        setLoading(false);
      }
    } else {
      try {
        await addCalcEvent(formData);
        toast({
          title: "イベントを作成しました",
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
    }
  };

  const splitEvenly = () => {
    if (watch("create_user") === "") {
      toast({
        title: "支払った人を選択してください",
        status: "error",
      });
      return;
    }
    if (watch("sum_amount").toString() === "") {
      toast({
        title: "支払い総額を入力してください",
        status: "error",
      });
      return;
    }
    const amount = Math.floor(
      watch("sum_amount") / (users.length - disableFields.length),
    );
    fields.forEach((field, index) => {
      if (disableFields.includes(field.userId)) {
        update(index, {
          userId: field.userId,
          amount: 0,
        });
      } else {
        update(index, {
          userId: field.userId,
          amount: amount,
        });
      }
    });
  };

  useEffect(() => {
    refreshCalcEvent();
    if (calcEvent) {
      setLoading(true);
      reset(calcEvent);
      setLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    setLoading(true);
    fields.forEach(() => remove(0));
    const create_user = getValues("create_user");
    if (create_user) {
      users
        .filter((user) => user.id !== create_user)
        .forEach((user) => {
          append(
            {
              userId: user.id,
              amount:
                calcEvent?.distributions.find(
                  (distribution) => distribution.userId === user.id,
                )?.amount ?? 0,
            },
            {
              shouldFocus: false,
            },
          );
        });
    }
    setLoading(false);
  }, [watch("create_user")]);

  const payAmount = isNaN(watch("sum_amount"))
    ? 0
    : watch("sum_amount") -
      watch("distributions").reduce(
        (pre, field) => pre + Number(field.amount),
        0,
      );

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
        <Heading size="md">
          {eventId ? "イベント編集" : "新規イベント作成"}
        </Heading>
        <Divider />
        <FormControl isInvalid={errors.name ? true : false}>
          <Stack direction={{ base: "column", md: "row" }}>
            <Heading
              w={{ base: "", md: "30%" }}
              as={FormLabel}
              pt={2}
              size="sm"
              noOfLines={1}
            >
              イベント名
            </Heading>
            <Input
              placeholder="タイトル"
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
              defaultValue={new Date().toLocaleDateString()}
              size="md"
              bg="gray.200"
              border="none"
              type="date"
              required
            />
          </Stack>
        </FormControl>
        <FormControl isInvalid={errors.sum_amount ? true : false}>
          <Stack direction={{ base: "column", md: "row" }}>
            <Heading
              w={{ base: "", md: "30%" }}
              as={FormLabel}
              pt={2}
              size="sm"
              noOfLines={1}
            >
              支払総額
            </Heading>
            <Input
              placeholder="支払総額"
              {...register("sum_amount")}
              size="md"
              bg="gray.200"
              border="none"
              type="number"
              required
              min={0}
            />
          </Stack>
        </FormControl>
        <FormControl isInvalid={errors.create_user ? true : false}>
          <Stack direction={{ base: "column", md: "row" }}>
            <Heading
              w={{ base: "", md: "30%" }}
              as={FormLabel}
              pt={2}
              size="sm"
              noOfLines={1}
            >
              支払った人
            </Heading>
            <Select
              placeholder="ユーザーを選択"
              {...register("create_user")}
              required
              size="md"
              bg="gray.200"
              border="none"
            >
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.displayName}
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
              支払い料金
            </Heading>
            <Stack direction="row" w="full">
              <Input
                placeholder="支払い料金"
                value={payAmount}
                readOnly
                size="md"
                bg="gray.100"
                color="gray"
                border="none"
                type="number"
              />
              <Button colorScheme="twitter" onClick={splitEvenly}>
                割り勘
              </Button>
            </Stack>
          </Stack>
        </FormControl>
        {fields.map((field, index) => (
          <FormControl key={field.id}>
            <Stack direction={{ base: "column", md: "row" }}>
              <Heading
                w={{ base: "", md: "30%" }}
                as={FormLabel}
                pt={2}
                size="sm"
                noOfLines={1}
              >
                {users.find((user) => user.id === field.userId)?.displayName}
              </Heading>
              <HStack direction="row" w="full">
                <Input
                  placeholder="支払額"
                  {...register(`distributions.${index}.amount`)}
                  size="md"
                  bg={
                    disableFields.includes(field.userId)
                      ? "gray.100"
                      : "gray.200"
                  }
                  border="none"
                  color={disableFields.includes(field.userId) ? "gray" : ""}
                  type="number"
                  min={0}
                  readOnly={disableFields.includes(field.userId)}
                />
                <Switch
                  size="lg"
                  isChecked={!disableFields.includes(field.userId)}
                  onChange={(event) => {
                    if (event.currentTarget.checked) {
                      setDisableFields(
                        disableFields.filter(
                          (element) => element !== field.userId,
                        ),
                      );
                    } else {
                      setDisableFields(disableFields.concat(field.userId));
                      update(index, {
                        userId: field.userId,
                        amount: 0,
                      });
                    }
                  }}
                />
              </HStack>
            </Stack>
          </FormControl>
        ))}
        <Button type="submit" w="80%" colorScheme="twitter">
          {eventId ? "更新" : "作成"}
        </Button>
      </VStack>
    </Skeleton>
  );
};
