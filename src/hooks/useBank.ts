import { Bank } from "@/types";
import { firestore } from "@/utils";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { selector, useRecoilRefresher_UNSTABLE, useRecoilValue } from "recoil";

export const bankSelector = selector<Bank[]>({
  key: "bankSelector",
  get: async () => {
    const banksRef = collection(firestore, "banks");
    const { docs } = await getDocs(query(banksRef, orderBy("code", "asc")));
    return docs.map((doc): Bank => {
      const data = doc.data();
      return {
        code: data.code,
        name: data.name,
      };
    });
  },
});

export const useBank = () => {
  const banks = useRecoilValue(bankSelector);
  const refreshBanks = useRecoilRefresher_UNSTABLE(bankSelector);

  return { banks, refreshBanks };
};
