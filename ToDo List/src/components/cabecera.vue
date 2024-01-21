<script setup>
import { useCollection } from 'vuefire'
import { collection, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore'
import { useFirestore } from 'vuefire'
//import { ref, defineEmits } from 'vue';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getAuth, onAuthStateChanged } from "firebase/auth";

let estasIdentidicado=false;
let uid;


const auth = getAuth();
onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/auth.user
    uid = user.uid;
    console.log("sesion iniciada "+ uid)
    estasIdentidicado=true;
   
    // ...
  } else {
    console.log("sesion cerrada")
    estasIdentidicado=false;
    // User is signed out
    // ...
  }
});


let db = useFirestore();
const todos = useCollection(collection(db, 'prueba'))

let file=null;

let contenidonota = '';


function altanota() {
  if (file !== null) {
    const storage = getStorage(); 

    const storageRef = ref(storage, file.name);
    
    uploadBytes(storageRef, file)
      .then((snapshot) => {
        return getDownloadURL(snapshot.ref);
      })
      .then((downloadURL) => {
        console.log('Download URL', downloadURL);

        const fechaActual = new Date().toLocaleTimeString();
        if (contenidonota !== '') {
          addDoc(collection(db, "prueba"), {
            titulo: contenidonota,
            prioridad: "baja",
            fecha: fechaActual,
            img: downloadURL,
            uid:uid
          });
        }
        contenidonota = '';
        downloadURL = '';
      })
      .catch((error) => {
        console.error("Error al subir el archivo:", error);
      });
  }
}

function subirArchivo(e){
file=e.target.files[0];
console.log(file);


}



</script>

<template>
  <div class="cabecera">
    <h1>Agrega una tarea</h1>
    <input type="text" v-model="contenidonota" @keyup.enter="altanota"><button @click="altanota">Agregar</button><br>
    <input type="file" name="img" id="subirFichero" accept="image/png, image/jpg" @change=subirArchivo($event)>
  </div>
    
</template>

<style>
.cabecera{
  text-align: center;
}
  h1 {
    font-size: 24px;
    margin-bottom: 20px;
    color: #333;
  }

  input[type="text"] {
    padding: 8px;
    font-size: 16px;
    margin-right: 10px;
  }

  button {
    padding: 10px 15px;
    font-size: 16px;
    cursor: pointer;
    background-color: #3498db;
    color: #fff;
    border: none;
    border-radius: 3px;
  }

  button:hover {
    background-color: #2980b9;
  }

  input[type="file"] {
    margin-top: 10px;
  }
</style>


