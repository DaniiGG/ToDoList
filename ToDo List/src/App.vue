<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
   <header>
    <nav>
      <ul>
        <li><RouterLink to="/" class="nav-link">Home</RouterLink></li>
        <li><RouterLink to="/privada" class="nav-link">Mi ToDo List</RouterLink></li>
        <li><RouterLink to="/gestion" class="nav-link">Gestión</RouterLink></li>
      </ul>
      </nav>
    </header>
    <RouterView />
</template>

<style>
header{
  background-color: #333;
  padding: 15px;
  text-align: center;
}
ul{
  list-style: none;
}
nav ul li{
  display: inline;
  margin: 0 10px;
}
.nav-link {
  text-decoration: none;
  color: white;
  transition: transform 0.2s ease-in-out; 
}

.nav-link:hover {
  color: rgb(0, 225, 255);
  transform: scale(1.15); 
}

nav a.router-link-exact-active {
  color: rgb(255, 221, 0);
}




</style>
