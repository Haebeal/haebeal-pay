import { collection, getFirestore, getDocs } from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import { useCallback } from "react";
import { selector, useRecoilRefresher_UNSTABLE, useRecoilValue } from "recoil";
import { User } from "@/types";
import { firebase, functions } from "@/utils";
import { useCalcEvents } from "@/hooks/useCalcEvents";

const usersSelector = selector<User[]>({
  key: "usersSelector",
  get: async () => {
    const getUsers = httpsCallable(functions, "getUsers");
    const collectionRef = collection(getFirestore(firebase), "tmp_users");
    const { docs } = await getDocs(collectionRef);
    return docs
      .map(
        (doc): User => ({
          id: doc.id,
          name: doc.data().name ?? "",
          photoURL: doc.data().photoURL ?? "",
          tmp: true,
        })
      )
      .concat((await getUsers()).data as User[]);
  },
});

export const useUsers = () => {
  const users = useRecoilValue(usersSelector);
  const refreshUsers = useRecoilRefresher_UNSTABLE(usersSelector);
  const { refreshCalcEvents } = useCalcEvents();

  const convertId = httpsCallable(functions, "convertId");

  const convert = useCallback(
    async (preId: string, newId: string): Promise<void> => {
      try {
        convertId({
          preId: preId,
          afterId: newId,
        });
        refreshCalcEvents();
      } catch (e) {
        throw e;
      }
    },
    []
  );

  return { users, convert, refreshUsers };
};
