<script setup>
import { useCollection } from 'vuefire'
import { collection, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore'
import { useFirestore } from 'vuefire'
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {  query, where } from "firebase/firestore";
import { formatDistanceToNow } from 'date-fns';
import esLocale from 'date-fns/locale/es';


let usuario = getAuth().currentUser


let db = useFirestore();
const coleccion = (collection(db, 'prueba'));
const list = query(coleccion, where("uid", "==", usuario.uid));

const todos = useCollection(list);






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

function contarTareasPendientes() {
  if (!todos.value) return 0; // que todos.value exista
  const tareasPendientes = todos.value.filter(todo => !todo.hecho).length;
  return tareasPendientes;
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
    <p class="tareas-info">Tienes {{ contarTareasPendientes() }} tareas pendientes de {{ todos.length }}</p>

    <div class="tarea-buttons">
    <button @click="eliminarTodasTareasHechas">Eliminar Todas las Tareas Hechas</button><br>
    </div>
    <ul class="tareas-list">
      <li v-for="todo in todos" :key="todo.id" class="tarea-item">
       

        <img v-if="todo.img" :src="todo.img" alt="Imagen de la tarea" class="tarea-img" /><br>

        <label class="cl-checkbox">
        <input type="checkbox"  :id="'check-' + todo.id" :checked="todo.hecho" @change="marcarHecho(todo)" class="tarea-checkbox" />
        <span>Terminada</span>
        </label>
        <p :style="{ 'text-decoration': todo.hecho ? 'line-through' : 'none' }">Titulo: {{ todo.titulo }}</p>
        <p :style="{ 'text-decoration': todo.hecho ? 'line-through' : 'none' }">Prioridad: {{ todo.prioridad }}</p>
        <p class="mayus" :style="{ 'text-decoration': todo.hecho ? 'line-through' : 'none' }">{{ tiempoTranscurridoDesdePublicacion(todo.fecha) }}</p>


        <div class="tarea-buttons">
          <button @click="subirPrioridadNota(todo.id, todo.prioridad)">Cambiar prioridad</button> <br><br>
          <button @click="eliminarNota(todo.id)">Eliminar</button><br>
          
        </div>

      </li>
    </ul>
  </div>
</template>


<style>
 

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
    height: 500px;
  }
  .tarea-checkbox {
    margin-right: 10px;
  }

  .tarea-img {
    width: 20vw;
    height: auto;
    max-height: 15vw;
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

  .mayus::first-letter{
    text-transform: uppercase;
  }
</style>
