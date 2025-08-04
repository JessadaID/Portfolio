import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyDnDzWt0SOn_3Xi0z-Crb4sOTu1JpIKHVM",
  authDomain: "portfollio-f2ebe.firebaseapp.com",
  projectId: "portfollio-f2ebe",
  storageBucket: "portfollio-f2ebe.firebasestorage.app",
  messagingSenderId: "30818819009",
  appId: "1:30818819009:web:5396f56c4b8dc3515c6d40"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export { db };
