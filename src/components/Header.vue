<template>
  <header class="header">
    <!-- Logo -->
    <div class="header-left">
      <router-link to="/" class="logo-link">
      </router-link>
    </div>

    <!-- Navigation Desktop -->
    <nav class="main-nav">
      <router-link
        v-for="item in navigationItems"
        :key="item.href"
        :to="item.href"
        class="nav-item"
        :class="{ active: isActiveRoute(item.href) }"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="nav-icon"
        >
          <path v-for="path in item.paths" :key="path" :d="path" />
          <polyline v-for="polyline in item.polylines" :key="polyline" :points="polyline" />
          <circle v-for="circle in item.circles" :key="circle.key" :cx="circle.cx" :cy="circle.cy" :r="circle.r" />
          <rect v-for="rect in item.rects" :key="rect.key" :width="rect.width" :height="rect.height" :x="rect.x" :y="rect.y" :rx="rect.rx" />
          <line v-for="line in item.lines" :key="line.key" :x1="line.x1" :y1="line.y1" :x2="line.x2" :y2="line.y2" />
        </svg>
        {{ item.label }}
      </router-link>
    </nav>

    <!-- Actions utilisateur -->
    <div class="header-right">
      <!-- Informations utilisateur - cachées sur petits écrans -->
      <div class="user-info">
        <span class="user-name">
          {{ userData.user_last_name }} {{ userData.user_first_name }}
        </span>
        <div class="avatar">
          <img
            :src="props.userData?.photo"
            :alt="`${userData.user_first_name} ${userData.user_last_name}`"
            class="avatar-img"
          />
        </div>
      </div>

      <!-- Avatar seul sur mobile -->
      <div class="mobile-avatar">
        <div class="avatar avatar-mobile">
          <img
            :src="props.userData?.photo"
            :alt="`${userData.user_first_name} ${userData.user_last_name}`"
            class="avatar-img"
          />
        </div>
      </div>

      <!-- Bouton de déconnexion -->
      <button class="logout-button" style="padding: 2px;" @click="handleLogout" title="Se déconnecter">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="logout-icon">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16 17 21 12 16 7" />
          <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
      </button>

      <!-- Menu hamburger mobile -->
      <button class="mobile-menu-button" @click="toggleMobileMenu" title="Menu">
        <svg v-if="!isMobileMenuOpen" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="menu-icon">
          <line x1="4" x2="20" y1="6" y2="6"/>
          <line x1="4" x2="20" y1="12" y2="12"/>
          <line x1="4" x2="20" y1="18" y2="18"/>
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="menu-icon">
          <path d="m18 6-12 12"/>
          <path d="m6 6 12 12"/>
        </svg>
      </button>
    </div>

    <!-- Overlay pour fermer le menu -->
    <div
      v-if="isMobileMenuOpen"
      class="mobile-overlay"
      @click="closeMobileMenu"
    ></div>

    <!-- Menu mobile -->
    <transition name="slide">
      <div v-if="isMobileMenuOpen" class="mobile-menu">
        <!-- En-tête du menu mobile -->
        <div class="mobile-menu-header">
          <div class="mobile-user-info">
            <div class="avatar">
              <img
                :src="props.userData?.photo"
                :alt="`${userData.user_first_name} ${userData.user_last_name}`"
                class="avatar-img"
              />
            </div>
            <div class="mobile-user-details">
              <p class="mobile-user-name">
                {{ userData.user_first_name }} {{ userData.user_last_name }}
              </p>
              <p class="mobile-user-status">Utilisateur connecté</p>
            </div>
          </div>
          <button class="mobile-close-button" @click="closeMobileMenu">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="close-icon">
              <path d="m18 6-12 12"/>
              <path d="m6 6 12 12"/>
            </svg>
          </button>
        </div>

        <!-- Navigation mobile -->
        <nav class="mobile-nav">
          <router-link
            v-for="item in navigationItems"
            :key="item.href"
            :to="item.href"
            class="mobile-nav-item"
            :class="{ active: isActiveRoute(item.href) }"
            @click="closeMobileMenu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="mobile-nav-icon"
            >
              <path v-for="path in item.paths" :key="path" :d="path" />
              <polyline v-for="polyline in item.polylines" :key="polyline" :points="polyline" />
              <circle v-for="circle in item.circles" :key="circle.key" :cx="circle.cx" :cy="circle.cy" :r="circle.r" />
              <rect v-for="rect in item.rects" :key="rect.key" :width="rect.width" :height="rect.height" :x="rect.x" :y="rect.y" :rx="rect.rx" />
              <line v-for="line in item.lines" :key="line.key" :x1="line.x1" :y1="line.y1" :x2="line.x2" :y2="line.y2" />
            </svg>
            {{ item.label }}
          </router-link>
        </nav>

        <!-- Actions du menu mobile -->
        <div class="mobile-menu-footer">
          <button class="mobile-logout-button" style="padding: 2px;" @click="handleLogout">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mobile-logout-icon">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Se déconnecter
          </button>
        </div>
      </div>
    </transition>
  </header>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

// Composables
const routeInstance = useRoute()

const props = defineProps({
  userData: {
    type: Object,
    default: () => ({
      user_first_name: 'SAKONE',
      user_last_name: 'Oumar',
      photo: null
    })
  }
})

const emit = defineEmits(['logout'])

// Emits

// State
const isMobileMenuOpen = ref(false)

// Navigation items avec icônes SVG
const navigationItems = [
  {
    href: '/',
    label: 'Liste Séminaristes',
    paths: ['m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z'],
    polylines: ['9 22 9 12 15 12 15 22'],
    circles: [],
    rects: [],
    lines: []
  },
  {
    href: '/comptabilite',
    label: 'Comptabilité',
    paths: ['M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z'],
    polylines: [],
    circles: [{ key: 'circle1', cx: '7.5', cy: '7.5', r: '1.5' }],
    rects: [],
    lines: []
  },
  {
    href: '/evaluation_management',
    label: 'Evaluation',
    paths: ['M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z', 'M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8', 'M12 17.5v-11'],
    polylines: [],
    circles: [],
    rects: [],
    lines: []
  },
  {
    href: '/sante',
    label: 'Santé',
    paths: ['M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z', 'M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8', 'M12 17.5v-11'],
    polylines: [],
    circles: [],
    rects: [],
    lines: []
  },
  {
    href: '/hebergement',
    label: 'Hebergement',
    paths: ['M22 8.35V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8.35A2 2 0 0 1 3.26 6.5l8-3.2a2 2 0 0 1 1.48 0l8 3.2A2 2 0 0 1 22 8.35Z', 'M6 18h12', 'M6 14h12'],
    polylines: [],
    circles: [],
    rects: [{ key: 'rect1', width: '12', height: '2', x: '6', y: '10', rx: '1' }],
    lines: []
  },
  {
    href: '/restauration',
    label: 'Restauration',
    paths: ['M4 6h16a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z', 'M18 12h2'],
    polylines: [],
    circles: [],
    rects: [],
    lines: []
  },
  {
    href: '/convoi',
    label: 'Convoi',
    paths: ['M20 21v-2a4 4 0 0 0-3-3.87', 'M4 21v-2a4 4 0 0 1 3-3.87', 'M16 3.13a4 4 0 0 1 0 7.75', 'M8 3.13a4 4 0 0 0 0 7.75'],
    polylines: [],
    circles: [],
    rects: [],
    lines: []
  },
  {
    href: '/users',
    label: 'Utilisateurs',
    paths: ['M3 3v18h18', 'M18 17V9', 'M13 17V5', 'M8 17v-3'],
    polylines: [],
    circles: [],
    rects: [],
    lines: []
  },
]

// Methods
const isActiveRoute = (href) => {
  return routeInstance.path === href
}

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

const handleLogout = () => {
  closeMobileMenu()
  emit('logout')
}

// Fermer le menu mobile quand on change de route
watch(() => routeInstance.path, () => {
  closeMobileMenu()
})
</script>

<style scoped>
/* Header principal */
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1rem;
  background-color: #034d36;
  color: white;
  height: 64px;
  position: relative;
}

@media (min-width: 1024px) {
  .header {
    padding: 0 1.5rem;
  }
}

/* Logo */
.header-left {
  display: flex;
  align-items: center;
}

.logo-link {
  display: flex;
  align-items: center;
}

.logo-img {
  height: 2rem;
  width: auto;
}

@media (min-width: 1024px) {
  .logo-img {
    height: 2.5rem;
  }
}

/* Navigation desktop */
.main-nav {
  display: none;
  align-items: center;
  justify-content: center; /* Centre les items horizontalement */
  gap: 0.25rem;
  flex: 1; /* Prend toute la largeur disponible */
}

@media (min-width: 1024px) {
  .main-nav {
    display: flex;
  }
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
  padding: 0.5rem 0.75rem;
  border-radius: 0.375rem;
  transition: all 0.2s;
}

.nav-item:hover,
.nav-item.active {
  color: white;
  background-color: rgba(255, 255, 255, 0.1);
}

.nav-icon {
  width: 1rem;
  height: 1rem;
}

/* Actions utilisateur */
.header-right {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

/* Informations utilisateur desktop */
.user-info {
  display: none;
  align-items: center;
  gap: 0.75rem;
}

@media (min-width: 640px) {
  .user-info {
    display: flex;
  }
}

.user-name {
  font-size: 0.875rem;
  font-weight: 500;
}

/* Avatar mobile */
.mobile-avatar {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

@media (min-width: 640px) {
  .mobile-avatar {
    display: none;
  }
}

/* Avatar */
.avatar {
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid rgba(255, 255, 255, 0.2);
}

.avatar-mobile {
  width: 2rem;
  height: 2rem;
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Bouton de déconnexion */
.logout-button {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #dc2626;
  border: none;
  color: white;
  cursor: pointer;
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 50%;
  transition: background-color 0.2s;
}

.logout-button:hover {
  background-color: #b91c1c;
}

.logout-icon {
  width: 15px;
  height: 15px;
}

/* Menu hamburger */
.mobile-menu-button {
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  color: white;
  cursor: pointer;
  width: 50px;
  height: 2.25rem;
  border-radius: 0.375rem;
  transition: background-color 0.2s;
}

@media (min-width: 1024px) {
  .mobile-menu-button {
    display: none;
  }
}

.mobile-menu-button:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.menu-icon {
  width: 1.25rem;
  height: 1.25rem;
}

/* Overlay mobile */
.mobile-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 40;
}

/* Menu mobile */
.mobile-menu {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 20rem;
  background-color: #054b1e;
  color: white;
  border-left: 1px solid rgba(255, 255, 255, 0.1);
  z-index: 50;
  display: flex;
  flex-direction: column;
}

/* En-tête du menu mobile */
.mobile-menu-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.mobile-user-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.mobile-user-details {
  display: flex;
  flex-direction: column;
}

.mobile-user-name {
  font-size: 0.875rem;
  font-weight: 500;
  margin: 0;
}

.mobile-user-status {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.6);
  margin: 0;
}

.mobile-close-button {
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  color: white;
  cursor: pointer;
  width: 60px;
  height: 2rem;
  border-radius: 0.375rem;
  transition: background-color 0.2s;
}

.mobile-close-button:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.close-icon {
  width: 1rem;
  height: 1rem;
}

/* Navigation mobile */
.mobile-nav {
  flex: 1;
  padding: 1rem 0;
}

.mobile-nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
  padding: 0.75rem 1rem;
  margin: 0.125rem 1rem;
  border-radius: 0.5rem;
  transition: all 0.2s;
}

.mobile-nav-item:hover,
.mobile-nav-item.active {
  color: white;
  background-color: rgba(255, 255, 255, 0.1);
}

.mobile-nav-icon {
  width: 1.25rem;
  height: 1.25rem;
}

/* Footer du menu mobile */
.mobile-menu-footer {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding: 1rem;
}

.mobile-logout-button {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  background-color: #dc2626;
  border: none;
  color: white;
  cursor: pointer;
  padding:10px;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  transition: background-color 0.2s;
}

.mobile-logout-button:hover {
  background-color: #b91c1c;
}

.mobile-logout-icon {
  width: 1.25rem;
  height: 1.25rem;
}

/* Animations */
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from {
  transform: translateX(100%);
}

.slide-leave-to {
  transform: translateX(100%);
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .header {
    padding: 0 0.75rem;
  }
  
  .mobile-menu {
    width: 100vw;
  }
}
</style>
