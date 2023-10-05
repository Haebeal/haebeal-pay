import { onCall } from "firebase-functions/v2/https";
import { auth } from "firebase-functions/v1";
import { initializeApp } from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

initializeApp();
const firestore = getFirestore();

exports.getUsers = onCall(async () => {
  return (await getAuth().listUsers()).users.map((user) => ({
    id: user.uid,
    name: user.displayName ?? "",
    photoURL: user.photoURL ?? "",
    tmp: false,
  }));
});

exports.onDeleteUser = auth.user().onDelete(async (user) => {
  const docs = await firestore.collection("calc_events").get();
  docs.forEach((doc) => {
    const data = doc.data();
    if (data.create_user === user.uid) {
      doc.ref.delete();
    } else if (Array.isArray(data.distributions)) {
      const distributions = data.distributions;
      const deleteIndex = distributions.findIndex(
        (distribution) => distribution.userId === user.uid
      );
      if (deleteIndex > 0) {
        distributions.splice(deleteIndex, 1);
      }
      doc.ref.update({
        distributions: distributions,
      });
    }
  });
});
