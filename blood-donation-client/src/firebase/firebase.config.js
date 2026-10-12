import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDN5JmbIkjfgAotOU5-cAFM5n2KyGdg46M",
  authDomain: "blood-group-6184a.firebaseapp.com",
  projectId: "blood-group-6184a",
  storageBucket: "blood-group-6184a.firebasestorage.app",
  messagingSenderId: "1097980362339",
  appId: "1:1097980362339:web:adeb0d5a92361da89c0256",
  measurementId: "G-XX743R9YMZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// অ্যাপের যেকোনো জায়গা থেকে ফায়ারবেস অথেন্টিকেশন ব্যবহারের জন্য এটি এক্সপোর্ট করা হলো
export const auth = getAuth(app);