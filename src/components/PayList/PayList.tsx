import { Divider, Heading, VStack } from "@chakra-ui/react";
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useCalcEvents } from "@/hooks/useCalcEvents";
import { useUsers } from "@/hooks/useUsers";
import { PayCard } from "@/components/PayCard";

export const PayList = () => {
  const { users, refreshUsers } = useUsers();
  const { calcEvents, refreshCalcEvents } = useCalcEvents();
  const { currentUser } = useAuth();

  const amounts = users
    .filter((user) => user.id !== currentUser?.uid)
    .map((user) => {
      let amount = 0;
      if (!currentUser) {
        return { user: user, amount: 0 };
      }
      calcEvents.forEach((calcEvent) => {
        if (calcEvent.create_user === currentUser.uid) {
          amount += Number(
            calcEvent.distributions.find((distri) => distri.userId === user.id)
              ?.amount ?? 0
          );
        } else if (calcEvent.create_user === user.id) {
          amount -= Number(
            calcEvent.distributions.find(
              (distri) => distri.userId === currentUser.uid
            )?.amount ?? 0
          );
        }
      });
      return { user: user, amount: amount };
    });

  useEffect(() => {
    refreshUsers();
    refreshCalcEvents();
  }, []);

  return (
    <VStack bg="white" rounded="md" px={2} py={6} gap={2}>
      <Heading size="md">支払い一覧</Heading>
      <Divider />
      {amounts.length > 0 ? (
        amounts.map(({ user, amount }, ind) => (
          <PayCard key={ind} user={user} amount={amount} />
        ))
      ) : (
        <Heading size="md">ユーザーが存在しません</Heading>
      )}
    </VStack>
  );
};
