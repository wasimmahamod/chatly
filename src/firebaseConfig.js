// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAzj32p7NKd8Uj0B0kY7hFyC1YmGH-1QbI",
  authDomain: "chatly-app-db165.firebaseapp.com",
  projectId: "chatly-app-db165",
  storageBucket: "chatly-app-db165.appspot.com",
  messagingSenderId: "595169725311",
  appId: "1:595169725311:web:34894a599ea4639fca284a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export default firebaseConfig