<template>
  <aside class="sidebar">
    <div class="sidebar-header">
      <div class="sidebar-logo">
        <svg viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" stroke="currentColor" stroke-width="2" fill="none"/></svg>
      </div>
      <span class="sidebar-title">AEEMCI - CE</span>
    </div>

    <nav class="sidebar-nav">
      <p class="sidebar-section-title">Menu</p>
      <a href="/" class="sidebar-link active">
        <LayoutDashboardIcon class="icon" />
        Dashboard
      </a>
      <a href="/missions" class="sidebar-link">
        <ListTodoIcon class="icon" />
        Missions
        <span class="badge">4</span>
      </a>
      <a href="materiel" class="sidebar-link"><CalendarDaysIcon class="icon" />Matériel</a>
      <a href="/comptabilite" class="sidebar-link"><BarChartIcon class="icon" />Comptabilité</a>
      <a href="/" class="sidebar-link"><UsersIcon class="icon" />Membres</a>
      <a href="/cloud" class="sidebar-link"><CloudIcon class="icon" />Cloud</a>
    </nav>

    <nav class="sidebar-nav">
      <p class="sidebar-section-title">General</p>
      <a href="#" class="sidebar-link"><SettingsIcon class="icon" />Paramètres</a>
      <a href="#" class="sidebar-link"><HelpCircleIcon class="icon" />Aide</a>
      <a href="#" class="sidebar-link"><LogOutIcon class="icon" />Déconnexion</a>
    </nav>

    <div class="sidebar-footer">
      <SmartphoneIcon class="icon-lg" />
      <p class="footer-title">Download our Mobile App</p>
      <button class="footer-btn">Download</button>
    </div>
  </aside>
</template>

<script setup>
import {
  LayoutDashboardIcon, ListTodoIcon, CalendarDaysIcon, BarChartIcon, UsersIcon, CloudIcon,
  SettingsIcon, HelpCircleIcon, LogOutIcon, SmartphoneIcon
} from 'lucide-vue-next';
</script>

<style scoped>
.sidebar {
  width: 260px;
  background: #1f2937;
  color: #d1d5db;
  padding: 24px;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.sidebar-header {
  display: flex;
  align-items: center;
  margin-bottom: 40px;
}

.sidebar-logo {
  background: rgba(16, 185, 129, 0.2);
  padding: 8px;
  border-radius: 8px;
  margin-right: 12px;
}

.sidebar-logo svg {
  width: 28px;
  height: 28px;
  color: #10b981;
}

.sidebar-title {
  font-size: 20px;
  font-weight: bold;
  color: white;
}

.sidebar-section-title {
  font-size: 10px;
  text-transform: uppercase;
  color: #9ca3af;
  margin-bottom: 8px;
  letter-spacing: 0.05em;
}

.sidebar-nav {
  margin-bottom: 32px;
}

.sidebar-link {
  display: flex;
  align-items: center;
  padding: 10px 12px;
  border-radius: 8px;
  color: #d1d5db;
  text-decoration: none;
  margin-bottom: 6px;
  transition: background 0.3s, color 0.3s;
}

.sidebar-link .icon {
  width: 18px;
  height: 18px;
  margin-right: 10px;
}

.sidebar-link:hover {
  background: #374151;
  color: white;
}

.sidebar-link.active {
  background: #1f2937;
  color: #10b981;
  font-weight: bold;
}

.badge {
  margin-left: auto;
  background: rgba(16, 185, 129, 0.2);
  color: #10b981;
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 999px;
}

.sidebar-footer {
  margin-top: auto;
  background: linear-gradient(to bottom right, #059669, #065f46);
  padding: 16px;
  border-radius: 12px;
  color: white;
  text-align: center;
}

.sidebar-footer .icon-lg {
  width: 40px;
  height: 40px;
  margin: 0 auto 12px;
}

.footer-title {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 10px;
}

.footer-btn {
  background: white;
  color: #047857;
  padding: 8px 16px;
  font-size: 13px;
  font-weight: 500;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.footer-btn:hover {
  background: #f3f4f6;
}
</style>
