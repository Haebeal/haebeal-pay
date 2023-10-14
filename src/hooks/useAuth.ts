import {
  GoogleAuthProvider,
  linkWithPopup,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  unlink,
  updatePassword,
  User,
} from "firebase/auth";
import { selector, useRecoilRefresher_UNSTABLE, useRecoilValue } from "recoil";
import { useCallback } from "react";
import { auth, firestore } from "@/utils";
import { useUsers } from "@/hooks/useUsers";
import { doc, updateDoc } from "firebase/firestore";
import { Profile } from "@/types";

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
    provider.addScope("https://www.googleapis.com/auth/userinfo.email");
    await signInWithPopup(auth, provider);
    refreshCurrentUser();
  }, []);

  const signout = useCallback(async () => {
    await signOut(auth);
    refreshCurrentUser();
  }, []);

  const updateUserProfile = useCallback(async (data: Profile) => {
    if (currentUser) {
      const docRef = doc(firestore, "profiles", currentUser.uid);
      await updateDoc(docRef, data as any);
      refreshCurrentUser();
      refreshUsers();
    }
  }, []);

  const updateEmailAndPassword = useCallback(
    async (data: { email: string; password: string }) => {
      if (currentUser) {
        const docRef = doc(firestore, "profiles", currentUser.uid);
        await updateDoc(docRef, {
          email: data.email,
        });
        if (data.password) await updatePassword(currentUser, data.password);
      }
    },
    []
  );

  const changeGoogleLink = useCallback(async () => {
    refreshCurrentUser();
    if (currentUser) {
      const provider = new GoogleAuthProvider();
      provider.addScope("https://www.googleapis.com/auth/userinfo.email");
      if (
        !currentUser.providerData.find(
          (provider) => provider.providerId === "password"
        )
      ) {
        throw new Error("パスワードを設定してください");
      }
      const linked = currentUser.providerData.find(
        (provider) => provider.providerId === "google.com"
      );
      if (linked) {
        await unlink(currentUser, provider.providerId);
      }
      await linkWithPopup(currentUser, provider);
      refreshCurrentUser();
    }
  }, []);

  return {
    currentUser,
    signin,
    signout,
    updateUserProfile,
    updateEmailAndPassword,
    changeGoogleLink,
    refreshCurrentUser,
  };
};
