import {
  doc,
  getDoc,
  getFirestore,
  setDoc,
  Timestamp,
} from "firebase/firestore";
import { useCallback } from "react";
import {
  atom,
  selectorFamily,
  useRecoilRefresher_UNSTABLE,
  useRecoilValue,
} from "recoil";
import { CalcEvent } from "../types/calc-event";
import { firebase } from "../utils/firebase";
import { useCalcEvents } from "./useCalcEvents";

export const calcEventIdsState = atom<string[]>({
  key: "eventIdsState",
  default: [],
});

export const calcEventSelector = selectorFamily<
  CalcEvent | null,
  string | undefined
>({
  key: "calcEventsSelector",
  get: (eventId) => async () => {
    if (eventId) {
      const docRef = doc(getFirestore(firebase), "calc_events", eventId);
      const docData = await getDoc(docRef);
      if (docData.exists()) {
        return {
          id: docData.id,
          name: docData.data().name,
          create_user: docData.data().create_user,
          event_date: docData
            .data()
            .event_date.toDate()
            .toLocaleDateString()
            .split("/")
            .map((e: string) => (e.length > 2 ? e : e.padStart(2, "0")))
            .join("-"),
          sum_amount: docData.data().sum_amount,
          distributions: docData.data().distributions ?? [],
        };
      }
    }
    return null;
  },
});

export const useCalcEvent = (eventId: string | undefined) => {
  const calcEvent = useRecoilValue(calcEventSelector(eventId));
  const refreshCalcEvent = useRecoilRefresher_UNSTABLE(
    calcEventSelector(eventId)
  );

  const { refreshCalcEvents } = useCalcEvents();

  const updateCalcEvent = useCallback(
    async (data: CalcEvent): Promise<void> => {
      if (eventId) {
        const docRef = doc(getFirestore(firebase), "calc_events", eventId);
        try {
          await setDoc(docRef, {
            ...data,
            event_date: Timestamp.fromDate(new Date(data.event_date)),
          });
          refreshCalcEvent();
          refreshCalcEvents();
        } catch (e) {
          throw e;
        }
      }
    },
    []
  );

  return { calcEvent, updateCalcEvent, refreshCalcEvent };
};
