<script setup>
import { useCollection } from 'vuefire'
import { collection, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore'
import { useFirestore } from 'vuefire'
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { signOut } from "firebase/auth";
import { useRouter } from 'vue-router'
import { formatDistanceToNow } from 'date-fns';
import esLocale from 'date-fns/locale/es';


const router =useRouter();

function cerrarSesion(){
    router.push({name: "home"})
    const auth = getAuth();
        signOut(auth).then(() => {
        // Sign-out successful.
        console.log("cerrar sesion")
        }).catch((error) => {
        // An error happened.
        });
}



let db = useFirestore();
const todos = useCollection(collection(db, 'prueba'))


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

function eliminarNota(id) {
  deleteDoc(doc(db, 'prueba', id));
}

function subirPrioridadNota(id, prioridad) {
  const actualizar = doc(db, "prueba", id);
if(prioridad=="Media"){

    updateDoc(actualizar, {

    prioridad: "Alta"

})      

}else if(prioridad=="Alta"){

    updateDoc(actualizar, {

        prioridad: "Baja"
})  
}else{

updateDoc(actualizar, {

    prioridad: "Media"
})  
}
  
}

function marcarHecho(todo) {
  const actualizar = doc(db, 'prueba', todo.id);
  updateDoc(actualizar, {
    hecho: !todo.hecho
  });
}




function eliminarTodasTareasHechas() {
  todos.value.forEach((todo) => {
    if (todo.hecho) {
      eliminarNota(todo.id);
    }
  });
}


function tiempoTranscurridoDesdePublicacion(hora) {
  const fechaActual = new Date();
  const fechaCompleta = `${fechaActual.toISOString().split('T')[0]}T${hora}`;
  const fechaPublicacion = new Date(fechaCompleta);

  if (isNaN(fechaPublicacion.getTime())) {
    return 'Fecha inválida';
  }

  return formatDistanceToNow(fechaPublicacion, { addSuffix: true, locale: esLocale });
}

</script>


   
   <template>
  <div class="tareas-container">
    <h1>Todas las tareas de la base de datos</h1>

    <div class="tarea-buttons">
    <button @click="eliminarTodasTareasHechas">Eliminar Todas las Tareas Hechas</button><br>
    </div>
    <ul class="tareas-list">
      <li v-for="todo in todos" :key="todo.id" class="tarea-item">
       
        
        <img v-if="todo.img" :src="todo.img" alt="Imagen de la tarea" class="tarea-img" /><br>
        <label class="cl-checkbox">
        <input type="checkbox" :id="'check-' + todo.id" :checked="todo.hecho" @change="marcarHecho(todo)" class="tarea-checkbox" />
        <span>Terminada</span>
        </label>
        <p :style="{ 'text-decoration': todo.hecho ? 'line-through' : 'none' }">Titulo: {{ todo.titulo }}</p>
        <p :style="{ 'text-decoration': todo.hecho ? 'line-through' : 'none' }">Prioridad: {{ todo.prioridad }}</p>
        <p :style="{ 'text-decoration': todo.hecho ? 'line-through' : 'none' }">{{ tiempoTranscurridoDesdePublicacion(todo.fecha) }}</p>

        <div class="tarea-buttons">
          <button @click="subirPrioridadNota(todo.id, todo.prioridad)">Cambiar prioridad</button> <br><br>
          <button @click="eliminarNota(todo.id)">Eliminar</button><br>
          
        </div>

      </li>
    </ul>
  </div>
  <button class="cerrarsesion" @click="cerrarSesion">Cerrar sesion</button>
</template>



<style>
html{
    background-color: rgb(229, 254, 255);
}
  .tareas-container {
    text-align: center;
    margin: 0 auto;
  }


  .tareas-list {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-auto-flow: row;
    column-gap: 20px;
  }


  .tarea-item {
    background-color: rgb(236, 253, 253);
    margin-bottom: 10px;
    padding: 15px;
    border-radius: 5px;
    border:solid 1px rgb(146, 145, 145);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3); /* Añade una sombra básica */
    transition: box-shadow 0.3s ease;
  }

  .tarea-checkbox {
    margin-right: 10px;
  }

  .tarea-img {
    width: 15vw;
    height: auto;
    margin-bottom: 10px;
    border-radius: 5px;
  }

  .tarea-text {
    display: block;
    margin-bottom: 10px;
    font-size: 18px;
  }

  .tarea-buttons {
    justify-content:center;
    margin-top: 10px;
  }

  .tarea-buttons button {
    padding: 8px 15px;
    cursor: pointer;
    background-color: #3498db;
    color: #fff;
    border: none;
    border-radius: 3px;
  }
.tarea-buttons button:first-child{
  margin-right: 10px;
}
  .tarea-buttons button:hover {
    background-color: #2980b9;
  }


  .cl-checkbox {
 position: relative;
 display: inline-block;
}

/* Input */
.cl-checkbox > input {
 appearance: none;
 -moz-appearance: none;
 -webkit-appearance: none;
 z-index: -1;
 position: absolute;
 left: -10px;
 top: -8px;
 display: block;
 margin: 0;
 border-radius: 50%;
 width: 40px;
 height: 40px;
 background-color: rgba(0, 0, 0, 0.6);
 box-shadow: none;
 outline: none;
 opacity: 0;
 transform: scale(1);
 pointer-events: none;
 transition: opacity 0.3s, transform 0.2s;
}

/* Span */
.cl-checkbox > span {
 display: inline-block;
 width: 100%;
 cursor: pointer;
}

/* Box */
.cl-checkbox > span::before {
 content: "";
 display: inline-block;
 box-sizing: border-box;
 margin: 3px 11px 3px 1px;
 border: solid 2px;
 /* Safari */
 border-color: rgba(0, 0, 0, 0.6);
 border-radius: 2px;
 width: 18px;
 height: 18px;
 vertical-align: top;
 transition: border-color 0.2s, background-color 0.2s;
}

/* Checkmark */
.cl-checkbox > span::after {
 content: "";
 display: block;
 position: absolute;
 top: 3px;
 left: 1px;
 width: 10px;
 height: 5px;
 border: solid 2px transparent;
 border-right: none;
 border-top: none;
 transform: translate(3px, 4px) rotate(-45deg);
}

/* Checked, Indeterminate */
.cl-checkbox > input:checked,
.cl-checkbox > input:indeterminate {
 background-color: #018786;
}

.cl-checkbox > input:checked + span::before,
.cl-checkbox > input:indeterminate + span::before {
 border-color: #018786;
 background-color: #018786;
}

.cl-checkbox > input:checked + span::after,
.cl-checkbox > input:indeterminate + span::after {
 border-color: #fff;
}

.cl-checkbox > input:indeterminate + span::after {
 border-left: none;
 transform: translate(4px, 3px);
}

/* Hover, Focus */
.cl-checkbox:hover > input {
 opacity: 0.04;
}

.cl-checkbox > input:focus {
 opacity: 0.12;
}

.cl-checkbox:hover > input:focus {
 opacity: 0.16;
}

/* Active */
.cl-checkbox > input:active {
 opacity: 1;
 transform: scale(0);
 transition: transform 0s, opacity 0s;
}

.cl-checkbox > input:active + span::before {
 border-color: #85b8b7;
}

.cl-checkbox > input:checked:active + span::before {
 border-color: transparent;
 background-color: rgba(0, 0, 0, 0.6);
}

/* Disabled */
.cl-checkbox > input:disabled {
 opacity: 0;
}

.cl-checkbox > input:disabled + span {
 color: rgba(0, 0, 0, 0.38);
 cursor: initial;
}

.cl-checkbox > input:disabled + span::before {
 border-color: currentColor;
}

.cl-checkbox > input:checked:disabled + span::before,
.cl-checkbox > input:indeterminate:disabled + span::before {
 border-color: transparent;
 background-color: currentColor;
}

</style>