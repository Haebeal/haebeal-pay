import {
  browserLocalPersistence,
  GoogleAuthProvider,
  onAuthStateChanged,
  setPersistence,
  signInWithRedirect,
  signOut,
  User,
} from "firebase/auth";
import { selector, useRecoilRefresher_UNSTABLE, useRecoilValue } from "recoil";
import { useCallback } from "react";
import { auth, firestore } from "@/utils";
import { useUsers } from "@/hooks/useUsers";
import { doc, updateDoc } from "firebase/firestore";

const authSelector = selector<User | null>({
  key: "authSelector",
  get: () => {
    return new Promise((resolve) => {
      const unsub = onAuthStateChanged(auth, (user) => {
        resolve(user);
        unsub();
      });
    });
  },
  dangerouslyAllowMutability: true,
});

export const useAuth = () => {
  const currentUser = useRecoilValue(authSelector);
  const refreshCurrentUser = useRecoilRefresher_UNSTABLE(authSelector);

  const { refreshUsers } = useUsers();

  const signin = useCallback(async () => {
    const provider = new GoogleAuthProvider();
    setPersistence(auth, browserLocalPersistence)
      .then(() => {
        return signInWithRedirect(auth, provider);
      })
      .catch((error) => {
        console.error(error.message);
      });
  }, []);

  const signout = useCallback(async () => {
    await signOut(auth);
    refreshCurrentUser();
  }, []);

  const updateUserProfile = useCallback(
    async ({
      displayName,
      photoURL,
    }: {
      displayName: string;
      photoURL: string;
    }) => {
      if (currentUser) {
        const docRef = doc(firestore, "profiles", currentUser.uid);
        await updateDoc(docRef, {
          displayName: displayName,
          photoURL: photoURL,
        });
        refreshCurrentUser();
        refreshUsers();
      }
    },
    []
  );

  return {
    currentUser,
    signin,
    signout,
    updateUserProfile,
    refreshCurrentUser,
  };
};
