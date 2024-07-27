const firebase = require("firebase");
const firebaseMock = require("firebase-mock");

const mockauth = new firebaseMock.MockAuthentication();
const mockfirestore = new firebaseMock.MockFirestore();
const mocksdk = new firebaseMock.MockFirebaseSdk(
  (path) => (path ? mockdatabase.child(path) : mockdatabase),
  () => mockauth,
  () => mockfirestore
);

module.exports = mocksdk;
