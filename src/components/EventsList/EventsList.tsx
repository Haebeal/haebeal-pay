import {
  Center,
  CircularProgress,
  Divider,
  Heading,
  Skeleton,
  VStack,
} from "@chakra-ui/react";
import {
  collection,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { Suspense, useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { calcEventIdsState } from "@/hooks/useCalcEvent";
import { EventCard } from "@/components/EventCard";
import { firebase } from "@/utils";

export const EventsList = () => {
  const [isLoading, setLoading] = useState(true);
  const [eventIds, setEventIds] = useRecoilState(calcEventIdsState);

  useEffect(() => {
    const q = query(
      collection(getFirestore(firebase), "calc_events"),
      orderBy("event_date", "desc"),
    );
    const unsub = onSnapshot(q, (snapshot) => {
      setLoading(true);
      setEventIds(snapshot.docs.map((doc) => doc.id));
      setLoading(false);
    });

    return unsub;
  }, []);

  return (
    <VStack bg="white" rounded="md" px={2} py={6} gap={2}>
      <Heading textAlign="center" size="md">
        イベント一覧
      </Heading>
      <Divider />
      {isLoading ? (
        <CircularProgress isIndeterminate color="twitter.500" />
      ) : (
        <>
          {eventIds.length > 0 ? (
            eventIds.map((eventId) => (
              <Suspense
                key={eventId}
                fallback={
                  <Skeleton w="full" h={{ base: 100, md: 70 }} rounded="md" />
                }
              >
                <EventCard eventId={eventId} />
              </Suspense>
            ))
          ) : (
            <Center h={300}>
              <Heading size="md">イベントが存在しません</Heading>
            </Center>
          )}
        </>
      )}
    </VStack>
  );
};
