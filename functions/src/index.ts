import * as functions from "firebase-functions/v1";
import * as admin from "firebase-admin";

admin.initializeApp();
const firestore = admin.firestore();
const auth = admin.auth();

// Firebase Authでユーザー作成時に発火
exports.onCreateUser = functions.auth.user().onCreate((user) => {
  // profiles コレクションにユーザー情報の追加を行う
  firestore.collection("profiles").doc(user.uid).create({
    displayName: user.displayName,
    photoURL: user.photoURL,
    bankCode: "",
    branchCode: "",
    branchName: "",
    accountCode: "",
  });
});

// Firebase Authでユーザー削除時に発火
exports.onDeleteUser = functions.auth.user().onDelete(async (user) => {
  // profilesドキュメントの削除
  firestore.collection("profiles").doc(user.uid).delete();
  // ユーザーが関係するイベントの削除更新を行う
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

// profilesコレクション更新時に発火
exports.onUpdateProfile = functions.firestore
  .document("profiles/{uuid}")
  .onUpdate((event) => {
    // Firebase Authのユーザー情報の更新を行う
    const data = event.after.data();
    if (!data) return;
    auth.updateUser(event.after.id, data);
  });
