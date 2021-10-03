import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyA159r8nudhf9oYrdkahlxhud4Ma3bPvPc",
  authDomain: "facebook-clone-59f09.firebaseapp.com",
  projectId: "facebook-clone-59f09",
  storageBucket: "facebook-clone-59f09.appspot.com",
  messagingSenderId: "202758136216",
  appId: "1:202758136216:web:7c84578e2fa69bad7f8bed",
  measurementId: "G-98TRNKL2VR",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

const auth = firebaseApp.auth();

const emailAuth = firebase.auth.EmailAuthProvider;

const storage = firebaseApp.storage();

export { auth, storage, emailAuth };
