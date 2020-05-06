import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyApkERsUP9vqWdS-2-Agcwim851gCpe1jI",
  authDomain: "scan-on-d9a2c.firebaseapp.com",
  databaseURL: "https://scan-on-d9a2c.firebaseio.com",
  projectId: "scan-on-d9a2c",
  storageBucket: "scan-on-d9a2c.appspot.com",
  messagingSenderId: "15597989243",
  appId: "1:15597989243:web:06056c6d4d509d270021de",
  measurementId: "G-TH81TDTGDG",
};
firebase.initializeApp(firebaseConfig);

export const firebaseAuth = firebase.auth();
export const firestore = firebase.firestore();
export default firebase;
