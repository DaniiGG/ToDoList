<script setup>
import { getAuth, signOut, signInWithEmailAndPassword } from "firebase/auth";
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import {ref} from 'vue'
import { useRouter } from 'vue-router';

let mostrarFormEmail = ref(false);
const router = useRouter();
const auth = getAuth();

let usuario = ref(auth.currentUser);
let email='';
let password='';
 
function iniciarSesionEmail() {
  console.log("Email:", email);
  console.log("Contraseña:", password);

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {

      const user = userCredential.user.email;
      
      usuario.value = user;

      if(usuario.value=='admin@gmail.com'){
        router.push({ path: '/gestion' });
      }else{
        router.push({ path: '/privada' });
      }

      
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error("Error al iniciar sesión:", errorCode, errorMessage);
    });
}

function mostrarFormularioEmail() {
  mostrarFormEmail.value = true;
}



function cerrarSesion()
{
    signOut(auth).then(() => {
        // Sign-out successful.
        usuario.value="";
         router.push({ path: '/' })
    }).catch((error) => {
        // An error happened.
    });

}



function iniciarSesion()
{
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
    .then((result) => {

        const user = result.user;
        usuario.value= user;
       router.push({ path: '/privada' })

    }).catch((error) => {
        
  });
 
}
</script>

<template>

<header id="segundo-header">
    <h1>¡Bienvenido a ToDo List!</h1>
    <p>Apunta lo que necesites...</p>
  </header>

  <main>
    <div class="cerrarsesion" v-if="usuario">
            <span>Bienvenido {{ usuario.displayName }}</span>&nbsp;&nbsp;&nbsp;
            <button  v-on:click="cerrarSesion()">Cerrar Sesion</button>
        </div>
        <div v-else>
      <button class="cerrarsesionGoogle" @click="iniciarSesion">Google</button>
      <button class="cerrarsesion" @click="mostrarFormularioEmail">Email/Contraseña</button>

      <!-- Formulario de inicio de sesión con email y contraseña -->
      <div class="email" v-if="mostrarFormEmail">
        <form @submit.prevent="iniciarSesionEmail">
          <label for="email">Email:</label>
          <input type="email" v-model="email" required /><br><br>

          <label for="password">Contraseña:</label>
          <input type="password" v-model="password" required /><br><br>

          <button type="submit" @enterKey="cerrarSesion()">Iniciar Sesión</button>
        </form>
      </div>
    </div>
    <section class="features">
      <div class="feature">
        <h2>Apunta tus notas</h2>
        <p>Apunta la tarea que quieras realizar para que no se te olvide!</p>
      </div>
      <div class="feature">
        <h2>Personaliza la prioridad</h2>
        <p>Configura la prioridad dependiendo de la urgencia de la tarea</p>
      </div>
      <div class="feature">
        <h2>Elimina tareas realizadas</h2>
        <p>Una vez realizada la tarea es hora de olvidarse!</p>
      </div>
    </section>
  </main>

  <footer>
    <p>© 2024 Daniel Escobar</p>
  </footer>

</template>

<style>
body{
  margin: 0;
}

#segundo-header {
  background-color: #f2f2f2;
  padding: 40px;
  text-align: center;
}
.email{
  text-align: center;
}
main {
  padding: 20px;
}


.features {
  display: flex;
  justify-content: space-around;
  align-items: flex-start;
  margin-top: 40px;
}

.feature {
  width: 30%;
  padding: 20px;
  background-color: #eaeaea;
  text-align: center;
  border-radius: 8px;
}

footer {
  text-align: center;
  background-color: #333;
  color: white;
  padding: 10px 0;
  position: fixed;
  bottom: 0;
  width: 100%;
}
</style>