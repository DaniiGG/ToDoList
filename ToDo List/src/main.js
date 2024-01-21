import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import { createRouter, createWebHistory } from 'vue-router'


import { VueFire, VueFireAuth } from 'vuefire'
// the file we created above with `database`, `firestore` and other exports
import { firebaseApp } from './firebase'
import inicio  from './components/inicio.vue'
import  privada  from './components/privada.vue'
import  gestion  from './components/gestion.vue'

import { onBeforeRouteUpdate } from 'vue-router';
import { getAuth, onAuthStateChanged } from "firebase/auth";


//RUTAS
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: inicio
    },
    {
      path:'/privada',
      name: 'privada',
      component: privada

    },
    {
      path:'/gestion',
      name: 'gestion',
      component: gestion

    }
  ]
})


let estasIdentidicado=false;
let esAdmin=false;

router.beforeEach((to, from) => {
  console.log('cambio de ruta');

  if (to.path === "/privada" && !estasIdentidicado) {
    return false;
  } else if (to.path === "/gestion" && !esAdmin) {
    // Redireccionar o manejar el acceso denegado para usuarios no administradores
    console.log('Acceso denegado para usuarios no administradores');
    return false;
  } else {
    return true;
  }
});

const auth = getAuth();
onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in
    const uid = user.uid;
    console.log("sesion iniciada " + user.uid);
    estasIdentidicado = true;
    console.log("Prueba " + user.email);


    // Verificar si el usuario es admin@gmail.com
    if (user.email === "admin@gmail.com") {
      esAdmin = true;
    } else {
      esAdmin = false;
    }
  } else {
    // User is signed out
    console.log("sesion cerrada");
    estasIdentidicado = false;
    esAdmin = false;
  }
});

// Función para verificar si el usuario es administrador



export default router




const app = createApp(App)

app.use(router)
app.use(VueFire, {
  // imported above but could also just be created here
  firebaseApp,
  modules: [
    // we will see other modules later on
    VueFireAuth(),
  ],
})

app.mount('#app')
