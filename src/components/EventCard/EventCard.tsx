import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Center,
  Heading,
  HStack,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useCalcEvent } from "@/hooks/useCalcEvent";
import { useCalcEvents } from "@/hooks/useCalcEvents";
import { useUsers } from "@/hooks/useUsers";

export const EventCard = ({ eventId }: { eventId: string }) => {
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef(null);
  const { users } = useUsers();
  const { currentUser } = useAuth();
  const { calcEvent } = useCalcEvent(eventId);
  const { deleteEvent } = useCalcEvents();

  const amount =
    calcEvent?.create_user === currentUser?.uid
      ? calcEvent?.distributions.reduce(
          (pre, distri) => Number(pre) + Number(distri.amount),
          0,
        )
      : 0 -
        Number(
          calcEvent?.distributions.find(
            (distri) => distri.userId === currentUser?.uid,
          )?.amount ?? 0,
        );

  return (
    <HStack
      h={{ base: 100, md: 70 }}
      px={2}
      w="full"
      borderWidth="1px"
      borderColor="gray.200"
      rounded="md"
      _hover={{
        bg: "gray.50",
        cursor: "pointer",
      }}
      onClick={() => navigate(`/event/${calcEvent?.id}`)}
    >
      <Stack align="center" w="80%" direction={{ base: "column", md: "row" }}>
        <Text
          w={{ base: "full", md: "20%" }}
          textAlign={{ base: "center", md: "left" }}
          ms={{ base: 0, md: 3 }}
          noOfLines={1}
        >
          {calcEvent?.event_date}
        </Text>
        <Heading
          w={{ base: "full", md: "40%" }}
          textAlign="center"
          noOfLines={1}
          ps={5}
          size="sm"
        >
          {calcEvent?.name}{" "}
          {calcEvent?.name !== "支払い"
            ? `（${
                users.find((user) => user.id === calcEvent?.create_user)
                  ?.displayName
              }）`
            : ""}
        </Heading>
        <Heading
          textAlign="center"
          w={{ base: "full", md: "40%" }}
          noOfLines={1}
          size="md"
          color={(amount ?? 0) < 0 ? "red" : ""}
        >
          ￥{(amount ?? 0).toLocaleString()}
        </Heading>
      </Stack>
      <Center w="20%">
        <Button
          aria-label="delete event"
          colorScheme="red"
          onClick={(event) => {
            event.stopPropagation();
            onOpen();
          }}
        >
          削除
        </Button>
        <AlertDialog
          isOpen={isOpen}
          leastDestructiveRef={cancelRef}
          onClose={onClose}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                イベント「{calcEvent?.name}」を削除しますか?
              </AlertDialogHeader>
              <AlertDialogBody>
                削除したらもとに戻すことはできません。
                <br />
                よろしいですか?
              </AlertDialogBody>
              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={onClose}>
                  キャンセル
                </Button>
                <Button
                  colorScheme="red"
                  ml={3}
                  onClick={() => {
                    deleteEvent(eventId);
                    onClose();
                  }}
                >
                  削除
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      </Center>
    </HStack>
  );
};
