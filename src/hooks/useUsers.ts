import { selector, useRecoilRefresher_UNSTABLE, useRecoilValue } from "recoil";
import { User } from "@/types";
import { firestore } from "@/utils";
import { collection, getDocs, query } from "firebase/firestore";

const usersSelector = selector<User[]>({
  key: "usersSelector",
  get: async () => {
    const collectionRef = collection(firestore, "profiles");
    const { docs } = await getDocs(query(collectionRef));
    return docs.map((doc) => ({
      id: doc.id,
      name: doc.data().displayName,
      photoURL: doc.data().photoURL,
    }));
  },
});

export const useUsers = () => {
  const users = useRecoilValue(usersSelector);
  const refreshUsers = useRecoilRefresher_UNSTABLE(usersSelector);

  return { users, refreshUsers };
};
