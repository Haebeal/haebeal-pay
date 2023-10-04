import {
  Skeleton,
  VStack,
  Heading,
  Divider,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Icon,
  Center,
  HStack,
  Button,
} from "@chakra-ui/react";
import { useUsers } from "../hooks/useUsers";
import { AiOutlineRight } from "react-icons/ai";
import { useFieldArray, useForm } from "react-hook-form";
import { useEffect } from "react";

interface FormProp {
  fields: {
    name: string;
    preId: string;
    newId: string;
  }[];
}

export const UserProvisioningForm = () => {
  const { users, refreshUsers, convert } = useUsers();

  const { register, control, watch } = useForm<FormProp>({
    defaultValues: {
      fields: users
        .filter((user) => user.tmp === true)
        .map((user) => ({
          name: user.name,
          preId: user.id,
        })),
    },
  });
  const { fields } = useFieldArray({
    control,
    name: "fields",
  });

  useEffect(() => {
    refreshUsers();
  }, []);

  return (
    <Skeleton isLoaded={true}>
      <VStack bg="white" rounded="md" px={5} py={6} gap={2}>
        <Heading size="md">ユーザープロビジョニング</Heading>
        <Divider />
        {fields.map((field, ind) => (
          <FormControl key={field.id}>
            <Stack direction={{ base: "column", md: "row" }}>
              <Heading
                w={{ base: "full", md: "20%" }}
                as={FormLabel}
                textAlign="center"
                pt={3}
                size="sm"
                noOfLines={1}
              >
                {field.name}
              </Heading>
              <HStack px={{ base: 0, md: 10 }} w={{ base: "full", md: "70%" }}>
                <Input
                  w={{ base: "48%", md: "40%" }}
                  textAlign="right"
                  placeholder=""
                  noOfLines={1}
                  size="md"
                  value={field.preId}
                  border="none"
                  type="text"
                  readOnly
                />
                <Center w={{ base: "4%", md: "20%" }}>
                  <Icon as={AiOutlineRight} />
                </Center>
                <Input
                  w={{ base: "45%", md: "40%" }}
                  {...register(`fields.${ind}.newId`)}
                  placeholder=""
                  noOfLines={1}
                  size="md"
                  bg="gray.200"
                  border="none"
                  type="text"
                  required
                />
              </HStack>
              <Center w={{ base: "full", md: "10%" }} pt={{ base: 4, md: 0 }}>
                <Button
                  w={{ base: "80%", md: "full" }}
                  size={{ base: "sm", md: "md" }}
                  colorScheme="twitter"
                  onClick={() => {
                    convert(
                      watch(`fields.${ind}.preId`),
                      watch(`fields.${ind}.newId`)
                    );
                  }}
                >
                  更新
                </Button>
              </Center>
            </Stack>
          </FormControl>
        ))}
      </VStack>
    </Skeleton>
  );
};
