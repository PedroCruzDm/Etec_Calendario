import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-analytics.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";


const firebaseConfig = {
  apiKey: "AIzaSyDaO2ENxmhrr1UamtoZgI3ujePMSaLT1qo",
  authDomain: "calendario-2cb0b.firebaseapp.com",
  databaseURL: "https://calendario-2cb0b-default-rtdb.firebaseio.com",
  projectId: "calendario-2cb0b",
  storageBucket: "calendario-2cb0b.firebasestorage.app",
  messagingSenderId: "660806699008",
  appId: "1:660806699008:web:bee36665775df88cde30e5",
  measurementId: "G-5PSCNRTERZ"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const db = getFirestore(app);
export const db_User = getFirestore(app);

export const auth = getAuth(app);
export const eventosRef = collection(db, "eventos");


export default firebaseConfig;