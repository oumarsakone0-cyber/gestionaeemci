<template>
  <aside class="sidebar">
    <div class="sidebar-content">
      <!-- Navigation principale -->
      <nav class="main-nav">
        <div class="nav-item active">
          <span class="nav-icon">📊</span>
          <span class="nav-text">Dashboard</span>
        </div>
        <div class="nav-item">
          <span class="nav-icon">📥</span>
          <span class="nav-text">Inbox</span>
        </div>
        <div class="nav-item">
          <span class="nav-icon">👥</span>
          <span class="nav-text">Teams</span>
        </div>
        <div class="nav-item">
          <span class="nav-icon">👤</span>
          <span class="nav-text">Mes Initiatives</span>
        </div>
        <div class="nav-item">
          <span class="nav-icon">✏️</span>
          <span class="nav-text">Mes Taches</span>
        </div>
      </nav>


      <!-- Section Projets -->
      <div class="section">
        <div class="project-list">
          <router-link to="/" class="project-item" active-class="active">
            <span class="project-icon">📊</span>
            <span class="project-name">Dashboard</span>
          </router-link>

          <router-link to="/aeemci_organes" class="project-item" active-class="active">
            <span class="project-icon">🏛️</span>
            <span class="project-name">Organes</span>
          </router-link>

          <router-link to="/aeemci_membres" class="project-item" active-class="active">
            <span class="project-icon">👥</span>
            <span class="project-name">Membres</span>
          </router-link>

          <router-link to="/aeemci_activites_base" class="project-item" active-class="active">
            <span class="project-icon">🎯</span>
            <span class="project-name">Activités de la base</span>
          </router-link>

          <router-link to="/aeemci_activites_ce" class="project-item" active-class="active">
            <span class="project-icon">🗓️</span>
            <span class="project-name">Activités du CE</span>
          </router-link>

          <router-link to="/aeemci_comptabilite" class="project-item" active-class="active">
            <span class="project-icon">💰</span>
            <span class="project-name">Comptabilité</span>
          </router-link>

          <router-link to="/aeemci_materiel" class="project-item" active-class="active">
            <span class="project-icon">📦</span>
            <span class="project-name">Matériel</span>
          </router-link>

          <router-link to="/documentation" class="project-item" active-class="active">
            <span class="project-icon">📚</span>
            <span class="project-name">Documentation</span>
          </router-link>

          <router-link to="/projets" class="project-item" active-class="active">
            <span class="project-icon">🚀</span>
            <span class="project-name">Projets</span>
          </router-link>

          <router-link to="/taches" class="project-item" active-class="active">
            <span class="project-icon">✅</span>
            <span class="project-name">Tâches</span>
          </router-link>

          <router-link to="/aeemci_ecoles" class="project-item" active-class="active">
            <span class="project-icon">🏛️</span>
            <span class="project-name">Ecole de Côte d'Ivoire</span>
          </router-link>
        </div>
      </div>


      <button class="new-btn">
        <span class="new-icon">+</span>
        <span class="new-text">New</span>
      </button>
    </div>

    <!-- Profil utilisateur en bas -->
    <div class="user-profile">
      <div class="settings-item">
        <span class="settings-icon">⚙️</span>
        <span class="settings-text">Gestion du Site Web</span>
      </div>
      <div class="settings-item">
        <span class="settings-icon">⚙️</span>
        <span class="settings-text">Utilisateurs</span>
      </div>
      <div class="settings-item">
        <span class="settings-icon">❓</span>
        <span class="settings-text">Help Center</span>
      </div>
      
      <div class="user-info">
        <div class="user-avatar">
          <img src="https://upload.wikimedia.org/wikipedia/fr/4/42/Logo_AEEMCI.jpeg" alt="User" class="avatar-img">
        </div>
        <div class="user-details">
          <div class="user-name">Dariana Robertson</div>
          <div class="user-email">dariana@gmail.com</div>
        </div>
        <button class="user-menu-btn">⋯</button>
      </div>
    </div>
  </aside>
</template>

<script setup>
</script>

<style scoped>
.sidebar {
  width: 280px;
  background: white;
  border-right: 1px solid #e1e5e9;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.sidebar-content {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
}

.main-nav {
  margin-bottom: 24px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: 2px;
}

.nav-item:hover {
  background: #f3f4f6;
}

.nav-item.active {
  background: #eff6ff;
  color: #2563eb;
}

.nav-icon {
  font-size: 16px;
  width: 20px;
  text-align: center;
}

.nav-text {
  font-size: 14px;
  font-weight: 500;
}

.section {
  margin-bottom: 24px;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.section-title {
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.section-actions {
  display: flex;
  gap: 4px;
}

.action-btn {
  width: 20px;
  height: 20px;
  border: none;
  background: transparent;
  border-radius: 4px;
  color: #9ca3af;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  transition: all 0.2s;
}

.action-btn:hover {
  background: #f3f4f6;
  color: #6b7280;
}

.project-list {
  margin-left: 8px;
}

.project-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 8px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: 2px;
}

.project-item:hover {
  background: #f3f4f6;
}

.project-item.active {
  background: #eff6ff;
  color: #2563eb;
}

.project-icon {
  font-size: 14px;
  width: 16px;
  text-align: center;
}

.project-name {
  font-size: 13px;
  font-weight: 500;
}

.new-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border: none;
  background: transparent;
  border-radius: 6px;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s;
  width: 100%;
  justify-content: flex-start;
}

.new-btn:hover {
  background: #f3f4f6;
}

.new-icon {
  font-size: 16px;
}

.new-text {
  font-size: 14px;
  font-weight: 500;
}

.user-profile {
  border-top: 1px solid #e5e7eb;
  padding: 16px;
}

.settings-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: 2px;
}

.settings-item:hover {
  background: #f3f4f6;
}

.settings-icon {
  font-size: 16px;
  width: 20px;
  text-align: center;
}

.settings-text {
  font-size: 14px;
  color: #374151;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 8px;
  background: #f9fafb;
  margin-top: 12px;
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  overflow: hidden;
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-details {
  flex: 1;
}

.user-name {
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 2px;
}

.user-email {
  font-size: 12px;
  color: #6b7280;
}

.user-menu-btn {
  width: 24px;
  height: 24px;
  border: none;
  background: transparent;
  border-radius: 4px;
  color: #9ca3af;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  transition: all 0.2s;
}

.user-menu-btn:hover {
  background: #e5e7eb;
  color: #6b7280;
}
</style>