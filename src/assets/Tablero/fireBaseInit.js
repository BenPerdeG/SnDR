import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDyerHDixc74S5J8N0HZ2f24Ka1zenTSlc",
  authDomain: "sndr-6f63a.firebaseapp.com",
  databaseURL: "https://sndr-6f63a-default-rtdb.firebaseio.com",
  projectId: "sndr-6f63a",
  storageBucket: "sndr-6f63a.appspot.com", 
  messagingSenderId: "216451953397",
  appId: "1:216451953397:web:82b40246d509628e8e0bbc"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db };
