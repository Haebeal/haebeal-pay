import { Profile } from "@/types";
import { Avatar, Box, HStack, Heading, Stack } from "@chakra-ui/react";

export const PayCard = ({
  user,
  amount,
}: {
  user: Profile;
  amount: number;
}) => {
  return (
    <HStack
      px={5}
      py={5}
      w="100%"
      borderWidth="1px"
      borderColor="gray.200"
      rounded="md"
    >
      <Box w="10%">
        <Avatar borderWidth={1} borderColor="gray.100" src={user.photoURL} />
      </Box>
      <Stack align="center" w="90%" direction={{ base: "column", md: "row" }}>
        <Heading
          w={{ base: "full", md: "50%" }}
          textAlign={{ base: "center", md: "left" }}
          noOfLines={1}
          ps={5}
          size="sm"
        >
          {user.displayName}
        </Heading>
        <Heading
          textAlign="center"
          w={{ base: "full", md: "50%" }}
          noOfLines={1}
          size="md"
          color={amount < 0 ? "red" : ""}
        >
          ￥{amount.toLocaleString()}
        </Heading>
      </Stack>
    </HStack>
  );
};
