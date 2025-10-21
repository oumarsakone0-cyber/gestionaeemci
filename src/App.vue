<template>
  <div class="bg-cream">
    <!-- Navbar fixe en haut -->
    <Navbar v-if="!isAuthPage" class="fixed-navbar" />

    <div class="layout">
      <!-- Sidebar fixe à gauche -->
      <Sidebar v-if="!isAuthPage" class="fixed-sidebar" />

      <!-- Contenu principal à droite -->
      <div class="main-content">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import Sidebar from './components/components/Sidebar.vue'
import Navbar from './components/components/Navbar.vue'

const route = useRoute()
const sidebarOpen = ref(false)

const isAuthPage = computed(() => {
  return route.name === 'login' || route.name === 'register'
})
</script>

<style scoped>
.bg-cream {
  background-color: #EFEDE7;
  min-height: 100vh;
}

/* Navbar fixe */
.fixed-navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
}

/* Sidebar fixe */
.fixed-sidebar {
  position: fixed;
  top: 60px; /* Décalée sous la navbar (hauteur navbar) */
  left: 0;
  width: 250px; /* largeur sidebar */
  height: calc(100vh - 60px); /* prend toute la hauteur sous la navbar */
  overflow-y: auto; /* si sidebar trop longue */
  background: #fff; /* ou ta couleur */
  border-right: 1px solid #ddd;
  z-index: 999;
}

/* Layout */
.layout {
  display: flex;
  flex-direction: row;
  min-height: 100vh;
  padding-top: 60px; /* espace pour navbar */
}

/* Contenu principal avec décalage pour la sidebar */
.main-content {
  flex: 1;
  margin-left: 250px; /* largeur sidebar */
  padding: 20px;
  overflow-x: hidden;
}
</style>
