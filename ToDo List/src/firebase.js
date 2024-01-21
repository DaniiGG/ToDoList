import { initializeApp } from 'firebase/app'
import { getFirestore, collection } from 'firebase/firestore'
// ... other firebase imports



export const firebaseApp = initializeApp({
  apiKey: "AIzaSyDpBV8cyLQ-KXfVLvlbUF_I0BQZbl9zQqk",
  authDomain: "todolist-25e99.firebaseapp.com",
  projectId: "todolist-25e99",
  storageBucket: "todolist-25e99.appspot.com",
  messagingSenderId: "257891165710",
  appId: "1:257891165710:web:de1e929fcd959a110cbe5f",
  measurementId: "G-0QY93J1QP9"

})

// used for the firestore refs
const db = getFirestore(firebaseApp)

// here we can export reusable database references
export const todosRef = collection(db, 'prueba')