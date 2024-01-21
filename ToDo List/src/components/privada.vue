<script setup>
import Cabecera from './cabecera.vue';
import Cuerpo from './cuerpo.vue';

import { getAuth } from 'firebase/auth';
import { signOut } from "firebase/auth";
import { useRouter } from 'vue-router'


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

</script>

<template>
    <main>
        <div class="wrapper">
            <button class="cerrarsesion" @click="cerrarSesion">Cerrar sesion</button>
            <Cabecera/>
            <Cuerpo/>
            
        </div>
    </main>
</template>

<style>
.cerrarsesion{
    position: absolute;
    top: 0;
    right: 0;
    margin-top: 20px;
    margin-right: 20px;
}
.cerrarsesion span{
   color: white;
}
.cerrarsesionGoogle{
    position: absolute;
    top: 0;
    right: 0;
    margin-top: 20px;
    margin-right: 200px;
}
</style>