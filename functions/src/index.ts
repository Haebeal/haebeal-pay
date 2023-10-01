import * as admin from "firebase-admin";
import * as functions from "firebase-functions";

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

admin.initializeApp();
const db = admin.firestore();
const auth = admin.auth();

exports.getUsers = functions.https.onCall(async () => {
  return (await auth.listUsers()).users.map((user) => ({
    id: user.uid,
    name: user.displayName ?? "",
    photoURL: user.photoURL ?? "",
    tmp: false,
  }));
});

exports.convertId = functions.https.onCall(async (data) => {
  const preId = data.preId;
  const newId = data.afterId;
  const docs = await db.collection("calc_events").get();

  docs.forEach((doc) => {
    const data = doc.data();
    if (data.create_user === preId) {
      doc.ref.update({
        create_user: newId,
      });
    } else if (Array.isArray(data.distributions)) {
      if (data.distributions.find((distri) => distri.userId === preId)) {
        doc.ref.update({
          distributions: data.distributions.map((distri) => {
            if (distri.userId === preId) {
              distri.userId = newId;
            }
            return distri;
          }),
        });
      }
    }
  });
});

exports.deleteUser = functions.auth.user().onDelete(async (user) => {
  const docs = await db.collection("calc_events").get();
  docs.forEach((doc) => {
    const data = doc.data();
    if (data.create_user === user.uid) {
      doc.ref.delete();
    } else if (Array.isArray(data.distributions)) {
      const distributions = data.distributions;
      const deleteInd = distributions
          .findIndex((distri) => distri.userId === user.uid);
      if (deleteInd > 0) {
        distributions.splice(deleteInd, 1);
      }
      doc.ref.update({
        distributions: distributions,
      });
    }
  });
});
