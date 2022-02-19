import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA1u_vS80jzQwd_iC7cB3m2uxy30iliHks",
  authDomain: "chrome-mc.firebaseapp.com",
  projectId: "chrome-mc",
  storageBucket: "chrome-mc.appspot.com",
  messagingSenderId: "1014319941647",
  appId: "1:1014319941647:web:6bb3f1454656b8c423fb7a",
  measurementId: "G-7JMR9BLX1N"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);