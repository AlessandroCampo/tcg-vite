
import { initializeApp } from "firebase/app";
import { getFirestore, collection } from 'firebase/firestore'
import { getAuth } from "firebase/auth";

export const firebaseApp = initializeApp({
    apiKey: "AIzaSyBOTfSJmAGIQ33-FfyKHXMzDH3X9jPBBW0",
    authDomain: "my-tcg-eed69.firebaseapp.com",
    databaseURL: "https://my-tcg-eed69-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "my-tcg-eed69",
    storageBucket: "my-tcg-eed69.appspot.com",
    messagingSenderId: "635098851873",
    appId: "1:635098851873:web:8d7a4906795acd1bf31160"
})

// Initialize Firebase
const db = getFirestore(firebaseApp)
export const auth = getAuth(firebaseApp)

