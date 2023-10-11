import { selector, useRecoilRefresher_UNSTABLE, useRecoilValue } from "recoil";
import { Profile } from "@/types";
import { firestore } from "@/utils";
import { collection, getDocs, query } from "firebase/firestore";

const usersSelector = selector<Profile[]>({
  key: "usersSelector",
  get: async () => {
    const collectionRef = collection(firestore, "profiles");
    const { docs } = await getDocs(query(collectionRef));
    return docs.map((doc) => ({
      id: doc.id,
      displayName: doc.data().displayName,
      photoURL: doc.data().photoURL,
      bankCode: doc.data().bankCode,
      branchCode: doc.data().branchCode,
      branchName: doc.data().branchName,
      accountCode: doc.data().accountCode,
    }));
  },
});

export const useUsers = () => {
  const users = useRecoilValue(usersSelector);
  const refreshUsers = useRecoilRefresher_UNSTABLE(usersSelector);

  return { users, refreshUsers };
};
