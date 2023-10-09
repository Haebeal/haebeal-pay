import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  getFirestore,
  orderBy,
  query,
  Timestamp,
} from "firebase/firestore";
import { useCallback } from "react";
import { selector, useRecoilRefresher_UNSTABLE, useRecoilValue } from "recoil";
import { CalcEvent } from "@/types";
import { firebase } from "@/utils";

const calcEventsSelector = selector<CalcEvent[]>({
  key: "calcEventsSelector",
  get: async () => {
    const collectionRef = collection(getFirestore(firebase), "calc_events");
    const { docs } = await getDocs(
      query(collectionRef, orderBy("event_date", "desc"))
    );
    return docs.map(
      (doc): CalcEvent => ({
        id: doc.id,
        name: doc.data().name,
        create_user: doc.data().create_user,
        event_date: doc
          .data()
          .event_date.toDate()
          .toLocaleDateString()
          .split("/")
          .map((e: string) => (e.length > 2 ? e : e.padStart(2, "0")))
          .join("-"),
        sum_amount: doc.data().sum_amount,
        distributions: doc.data().distributions ?? [],
      })
    );
  },
});

export const useCalcEvents = () => {
  const calcEvents = useRecoilValue(calcEventsSelector);
  const refreshCalcEvents = useRecoilRefresher_UNSTABLE(calcEventsSelector);

  const addCalcEvent = useCallback(
    async (data: CalcEvent): Promise<string | null> => {
      const collectionRef = collection(getFirestore(firebase), "calc_events");
      const { id } = await addDoc(collectionRef, {
        ...data,
        event_date: Timestamp.fromDate(new Date(data.event_date)),
      });
      refreshCalcEvents();
      return id;
    },
    []
  );

  const deleteEvent = useCallback(async (eventId: string): Promise<void> => {
    const docRef = doc(getFirestore(firebase), "calc_events", eventId);
    await deleteDoc(docRef);
    refreshCalcEvents();
  }, []);

  return { calcEvents, addCalcEvent, deleteEvent, refreshCalcEvents };
};
