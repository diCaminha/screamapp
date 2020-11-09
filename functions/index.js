const functions = require("firebase-functions");

const admin = require("firebase-admin");

admin.initializeApp();

exports.helloWorld = functions.https.onRequest((request, response) => {
  response.send("Hello world!");
});

exports.getScreams = functions.https.onRequest((req, res) => {
  admin
    .firestore()
    .collection("screams")
    .get()
    .then((data) => {
      let screams = [];
      data.forEach((doc) => {
        screams.push(doc.data());
      });
      return screams;
    })
    .catch((err) => {
      console.log(err);
    });
});

exports.createScream = functions.https.onRequest((req, res) => {
  const newScream = {
    body: req.body.body,
    userHandle: req.body.userHandle,
    createdAt: admin.firestore.Timestamp.fromDate(new Date()),
  };

  admin
    .firestore()
    .collection("screams")
    .add(newScream)
    .then((doc) => {
      res
        .status(201)
        .json({ message: `document ${doc.id} created sucessfully` });
    })
    .catch((err) => {
      res.status(500).json({ error: "something went wrong..." });
    });
});
