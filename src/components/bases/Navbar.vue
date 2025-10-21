<template>
  <header class="header">
    <div class="top-bar">
      <div class="container">
        <div class="top-bar-left">
          <a href="#" class="top-link">Devenir fournisseur</a>
          <a href="#" class="top-link">Centre d'aide</a>
          <a href="#" class="top-link">Obtenir l'application</a>
        </div>
        <div class="top-bar-right">
          <div class="language-selector">
            <span>Français</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-down"><path d="m6 9 6 6 6-6"/></svg>
          </div>
          <div class="currency-selector">
            <span>EUR</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-down"><path d="m6 9 6 6 6-6"/></svg>
          </div>
          <div class="ship-to">
            <span>Livrer en</span>
            <img src="/flags/fr.png" alt="France" class="flag-icon" />
            <span>France</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-down"><path d="m6 9 6 6 6-6"/></svg>
          </div>
        </div>
      </div>
    </div>
    
    <nav class="navbar">
      <div class="container">
        <div class="navbar-left">
          <div class="logo">
            <router-link to="/">
              <img src="/logo.png" alt="Logo" />
            </router-link>
          </div>
          <div class="category-selector">
            <span>Catégories</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-down"><path d="m6 9 6 6 6-6"/></svg>
            <div class="category-dropdown">
              <div v-for="category in categories" :key="category.id" class="category-item">
                <router-link :to="`/category/${category.id}`">{{ category.name }}</router-link>
              </div>
            </div>
          </div>
          <div class="search-bar">
            <input type="text" placeholder="Que recherchez-vous..." />
            <button class="search-button">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-search"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg> Rechercher
            </button>
          </div>
        </div>
        <div class="navbar-right">
          <div class="user-actions">
            <div v-if="user.isLoggedIn" class="user-profile">
              <img :src="user.avatar" alt="Avatar" class="avatar" />
              <span>{{ user.name }}</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-down"><path d="m6 9 6 6 6-6"/></svg>
            </div>
            <div v-else class="auth-buttons">
              <router-link to="/login" class="btn-signin">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                Connexion
              </router-link>
              <router-link to="/register" class="btn-join">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-upload"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
                Publier sur adjamBaba
              </router-link>
            </div>
          </div>
          <div class="order-menu">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-clipboard-list"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M12 11h4"/><path d="M12 16h4"/><path d="M8 11h.01"/><path d="M8 16h.01"/></svg>
            <span>Commandes</span>
          </div>
          <div class="cart">
            <router-link to="/cart" class="cart-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-shopping-cart"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
              <span class="cart-count">0</span>
            </router-link>
          </div>
          <div class="messages">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-message-square"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            <span>Messages</span>
          </div>
        </div>
      </div>
    </nav>
    <div class="navbar-spacer"></div>
  </header>
</template>

<script>
export default {
  name: 'NavBar',
  props: {
    categories: Array,
    user: Object
  }
}
</script>

<style scoped>
.header {
  position: relative;
  z-index: 1000;
}

.top-bar {
  background-color: #f5f5f5;
  padding: 8px 0;
  font-size: 12px;
  color: #666;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.top-bar-left, .top-bar-right {
  display: flex;
  align-items: center;
}

.top-link {
  margin-right: 15px;
  color: #666;
  text-decoration: none;
}

.top-link:hover {
  color: #FF6A00;
}

.language-selector, .currency-selector, .ship-to {
  display: flex;
  align-items: center;
  margin-left: 15px;
  cursor: pointer;
}

.flag-icon {
  width: 16px;
  height: 12px;
  margin: 0 4px;
}

.navbar {
  background-color: #fff;
  padding: 15px 0;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
}

.navbar-spacer {
  height: 70px; /* Ajustez cette valeur en fonction de la hauteur de votre navbar */
}

.navbar .container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.navbar-left {
  display: flex;
  align-items: center;
  flex: 1;
}

.logo img {
  height: 40px;
  margin-right: 20px;
}

.category-selector {
  position: relative;
  display: flex;
  align-items: center;
  margin-right: 20px;
  padding: 0 10px;
  height: 40px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
}

.category-selector:hover {
  background-color: #f5f5f5;
}

.category-selector svg {
  margin-left: 5px;
}

.category-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  width: 200px;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  padding: 10px 0;
  z-index: 100;
  display: none;
}

.category-selector:hover .category-dropdown {
  display: block;
}

.category-item {
  padding: 8px 15px;
}

.category-item a {
  color: #333;
  text-decoration: none;
  display: block;
}

.category-item:hover {
  background-color: #f5f5f5;
}

.search-bar {
  display: flex;
  flex: 1;
  max-width: 600px;
  height: 40px;
  border: 1px solid black;
  padding: 4px;
  border-radius: 20px; /* Arrondi la barre de recherche */
  overflow: hidden;
}

.search-category {
  display: flex;
  align-items: center;
  padding: 0 10px;
  background-color: #f5f5f5;
  border-right: 1px solid #ddd;
  font-size: 14px;
  white-space: nowrap;
}

.search-category svg {
  margin-left: 5px;
}

.search-bar input {
  flex: 1;
  padding: 0 15px;
  border: none;
  outline: none;
  font-size: 14px;
}

.search-button {
  width: 110px;
  border-radius: 20px;
  background-color: #FF6A00;
  border: none;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.navbar-right {
  display: flex;
  align-items: center;
}

.user-actions {
  margin-right: 20px;
}

.user-profile {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  margin-right: 5px;
}

.auth-buttons {
  display: flex;
}

.btn-signin, .btn-join {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  text-decoration: none;
  font-size: 14px;
}

.btn-signin svg, .btn-join svg {
  margin-right: 5px;
}

.btn-signin {
  color: #FF6A00;
  margin-right: 10px;
}

.btn-join {
  background-color: #FF6A00;
  color: white;
  border-radius: 4px;
}

.order-menu, .cart, .messages {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-left: 20px;
  font-size: 12px;
  cursor: pointer;
}

.cart-icon {
  position: relative;
  color: inherit;
  text-decoration: none;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.cart-count {
  position: absolute;
  top: -5px;
  right: -5px;
  background-color: #FF6A00;
  color: white;
  font-size: 10px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

@media (max-width: 992px) {
  .top-bar {
    display: none;
  }
  
  .search-category {
    display: none;
  }
  
  .navbar-right {
    display: none;
  }
  
  .logo img {
    height: 30px;
  }
}

@media (max-width: 768px) {
  .category-selector {
    display: none;
  }
  
  .search-bar {
    max-width: none;
  }
}
</style>