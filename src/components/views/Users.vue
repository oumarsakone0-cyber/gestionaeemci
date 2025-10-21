<template>
    <div class="dashboard">
      <main class="main-content">
        <div class="overview-section">
          <!-- Header -->
          <div class="overview-header">
            <div class="header-left">
              <button @click="$router.go(-1)" class="action-button-outlined">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                </svg>
              </button>
              <div>
                <h1 class="overview-title flex items-center">
                  <svg class="w-6 h-6 lg:w-8 lg:h-8 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                  Gestion des Utilisateurs SENAFOI 25
                </h1>
                <p class="overview-date">Administration des accès - {{ currentDateFormatted }}</p>
              </div>
            </div>
            <div class="header-actions-right">
              <button @click="showCreateUserModal = true" class="export-button blue-button">
                <svg class="w-4 h-4 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>Nouvel Utilisateur</span>
              </button>
              <button @click="exportUsersReport()" class="export-button green-button">
                <svg class="w-4 h-4 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Rapport Excel</span>
              </button>
              <button @click="exportUsersPDF()" class="export-button red-button">
                <svg class="w-4 h-4 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <span>Liste PDF</span>
              </button>
            </div>
          </div>
          
          <!-- Statistiques -->
          <div class="product-stats">
            <div class="stat-card">
              <div class="stat-icon stat-icon-blue">
                <svg class="w-5 h-5 lg:w-6 lg:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <div class="stat-info">
                <div class="stat-value">{{ totalUsers }}</div>
                <div class="stat-label">Total Utilisateurs</div>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon stat-icon-green">
                <svg class="w-5 h-5 lg:w-6 lg:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div class="stat-info">
                <div class="stat-value">{{ activeUsers }}</div>
                <div class="stat-label">Utilisateurs Actifs</div>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon stat-icon-orange">
                <svg class="w-5 h-5 lg:w-6 lg:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div class="stat-info">
                <div class="stat-value">{{ adminUsers }}</div>
                <div class="stat-label">Administrateurs</div>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon stat-icon-purple">
                <svg class="w-5 h-5 lg:w-6 lg:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h4a1 1 0 011 1v5m-6 0V9a1 1 0 011-1h4a1 1 0 011 1v11" />
                </svg>
              </div>
              <div class="stat-info">
                <div class="stat-value">{{ availablePages.length }}</div>
                <div class="stat-label">Pages Disponibles</div>
              </div>
            </div>
          </div>
          
          <!-- Filtres et recherche -->
          <div class="search-filters">
            <div class="search-bar">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-search">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <input v-model="filters.search" @input="applyFilters" type="text" placeholder="Rechercher par nom, email, rôle...">
            </div>
            <div class="filter-options">
              <select v-model="filters.role_filter" @change="applyFilters">
                <option value="">Tous les rôles</option>
                <option value="admin">Administrateur</option>
                <option value="manager">Gestionnaire</option>
                <option value="viewer">Lecteur</option>
              </select>
              <select v-model="filters.status_filter" @change="applyFilters">
                <option value="">Tous les statuts</option>
                <option value="active">Actif</option>
                <option value="inactive">Inactif</option>
              </select>
            </div>
          </div>
          
          <div class="pagination">
            <div class="pagination-size">
              <label class="text-sm font-medium text-gray-700">Éléments par page:</label>
              <select v-model="pagination.per_page" @change="changePerPage">
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
              </select>
            </div>
            <button @click="resetFilters" class="action-button-outlined">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Réinitialiser</span>
            </button>
          </div>
          
          <!-- Section des utilisateurs -->
          <div class="users-section">
            <div class="section-header">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
              <h2 class="section-title">Liste des Utilisateurs</h2>
            </div>
            
            <div v-if="loadingUsers" class="loading-indicator">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-loader-2">
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
              Chargement des utilisateurs...
            </div>
            
            <div v-else-if="filteredUsers.length === 0" class="no-data">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-users">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              <p>Aucun utilisateur trouvé</p>
            </div>
            
            <div v-else class="users-grid">
              <div
                v-for="user in paginatedUsers"
                :key="user.id"
                class="user-card"
                :class="{ 'inactive': !user.isActive }"
              >
                <div class="user-header">
                  <div class="user-avatar" :class="getRoleClass(user.role)">
                    <span>{{ getUserInitials(user.name) }}</span>
                  </div>
                  <div class="user-info">
                    <h4 class="user-name">{{ user.name }}</h4>
                    <p class="user-email">{{ user.email }}</p>
                    <p class="user-role">{{ getRoleName(user.role) }}</p>
                  </div>
                  <div class="user-status">
                    <span class="status-badge" :class="user.isActive ? 'active' : 'inactive'">
                      {{ user.isActive ? 'Actif' : 'Inactif' }}
                    </span>
                  </div>
                </div>
                
                <div class="user-permissions">
                  <h5>Permissions d'accès</h5>
                  <div class="permissions-grid">
                    <div v-for="page in availablePages" :key="page.id" class="permission-item">
                      <span class="page-name">{{ page.name }}</span>
                      <div class="permission-badges">
                        <span 
                          v-if="hasPermission(user, page.id, 'read')" 
                          class="permission-badge read"
                          title="Lecture"
                        >
                          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </span>
                        <span 
                          v-if="hasPermission(user, page.id, 'write')" 
                          class="permission-badge write"
                          title="Écriture"
                        >
                          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </span>
                        <span v-if="!hasPermission(user, page.id, 'read')" class="permission-badge none">
                          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div class="user-actions">
                  <button @click="editUser(user)" class="action-btn edit-btn">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Modifier
                  </button>
                  <button @click="toggleUserStatus(user)" class="action-btn" :class="user.isActive ? 'deactivate-btn' : 'activate-btn'">
                    <svg v-if="user.isActive" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
                    </svg>
                    <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {{ user.isActive ? 'Désactiver' : 'Activer' }}
                  </button>
                  <button @click="deleteUser(user)" class="action-btn delete-btn">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Pagination -->
          <div class="pagination">
            <div class="pagination-info">
              Affichage de {{ pagination.from || 0 }} à {{ pagination.to || 0 }} sur {{ pagination.total || 0 }} utilisateurs
            </div>
            <div class="pagination-controls">
              <button @click="changePage(pagination.current_page - 1)" :disabled="pagination.current_page === 1" class="pagination-button">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-left">
                  <path d="m15 18-6-6 6-6" />
                </svg>
              </button>
              <span class="pagination-pages">Page {{ pagination.current_page }} sur {{ pagination.last_page }}</span>
              <button @click="changePage(pagination.current_page + 1)" :disabled="pagination.current_page === pagination.last_page" class="pagination-button">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-right">
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </main>
      
      <!-- Modal de création/modification d'utilisateur -->
      <div v-if="showCreateUserModal || showEditUserModal" class="modal" @click.self="closeUserModal">
        <div class="modal-content user-modal">
          <div class="modal-header">
            <h2>{{ showCreateUserModal ? 'Créer un nouvel utilisateur' : 'Modifier l\'utilisateur' }}</h2>
            <button @click="closeUserModal" class="close-button">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveUser" class="user-form">
              <div class="form-section">
                <h3>Informations personnelles</h3>
                <div class="form-grid">
                  <div class="form-group">
                    <label for="userName">Nom complet *</label>
                    <input 
                      id="userName"
                      v-model="userForm.name" 
                      type="text" 
                      required 
                      class="form-input"
                      placeholder="Ex: SAKONE Oumar"
                    />
                  </div>
                  <div class="form-group">
                    <label for="userEmail">Email *</label>
                    <input 
                      id="userEmail"
                      v-model="userForm.email" 
                      type="email" 
                      required 
                      class="form-input"
                      placeholder="Ex: jean.dupont@senafoi.org"
                    />
                  </div>
                  <div class="form-group">
                    <label for="userPassword">{{ showCreateUserModal ? 'Mot de passe *' : 'Nouveau mot de passe' }}</label>
                    <input 
                      id="userPassword"
                      v-model="userForm.password" 
                      type="password" 
                      :required="showCreateUserModal"
                      class="form-input"
                      placeholder="Minimum 8 caractères"
                    />
                  </div>
                  <div class="form-group">
                    <label for="userRole">Rôle *</label>
                    <select id="userRole" v-model="userForm.role" required class="form-select">
                      <option value="">Sélectionner un rôle</option>
                      <option value="admin">Administrateur</option>
                      <option value="manager">Gestionnaire</option>
                      <option value="viewer">Lecteur</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div class="form-section">
                <h3>Permissions d'accès</h3>
                <div class="permissions-form">
                  <div v-for="page in availablePages" :key="page.id" class="permission-row">
                    <div class="page-info">
                      <span class="page-name">{{ page.name }}</span>
                      <span class="page-description">{{ page.description }}</span>
                    </div>
                    <div class="permission-controls">
                      <label class="permission-checkbox">
                        <input 
                          type="checkbox" 
                          :checked="userForm.permissions[page.id]?.read || false"
                          @change="updatePermission(page.id, 'read', $event.target.checked)"
                        />
                        <span class="checkmark read"></span>
                        <span class="label">Lecture</span>
                      </label>
                      <label class="permission-checkbox">
                        <input 
                          type="checkbox" 
                          :checked="userForm.permissions[page.id]?.write || false"
                          @change="updatePermission(page.id, 'write', $event.target.checked)"
                        />
                        <span class="checkmark write"></span>
                        <span class="label">Écriture</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="form-section">
                <h3>Statut</h3>
                <label class="status-checkbox">
                  <input 
                    type="checkbox" 
                    v-model="userForm.isActive"
                  />
                  <span class="checkmark active"></span>
                  <span class="label">Utilisateur actif</span>
                </label>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button @click="saveUser" class="save-button">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>{{ showCreateUserModal ? 'Créer l\'utilisateur' : 'Sauvegarder' }}</span>
            </button>
            <button @click="closeUserModal" class="cancel-button">Annuler</button>
          </div>
        </div>
      </div>
      
      <!-- Alert Messages -->
      <div class="toast-container" v-if="alert.show">
        <div class="toast" :class="alert.type">
          <div class="toast-icon">
            <svg v-if="alert.type === 'success'" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check-circle">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            <svg v-else-if="alert.type === 'error'" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-alert-circle">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" x2="12" y1="8" y2="12" />
              <line x1="12" x2="12.01" y1="16" y2="16" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-info">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" x2="12" y1="16" y2="12" />
              <line x1="12" x2="12.01" y1="8" y2="8" />
            </svg>
          </div>
          <div class="toast-content">{{ alert.message }}</div>
          <button class="toast-close" @click="alert.show = false">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x">
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted, watch } from 'vue';
  
  // Reactive states
  const users = ref([]);
  const loadingUsers = ref(false);
  const showCreateUserModal = ref(false);
  const showEditUserModal = ref(false);
  const editingUser = ref(null);
  
  // Form data
  const userForm = ref({
    name: '',
    email: '',
    password: '',
    role: '',
    isActive: true,
    permissions: {}
  });
  
  // Filters and pagination
  const filters = ref({
    search: '',
    role_filter: '',
    status_filter: ''
  });
  
  const pagination = ref({
    current_page: 1,
    last_page: 1,
    per_page: 25,
    total: 0,
    from: 0,
    to: 0
  });
  
  // Available pages with permissions
  const availablePages = ref([
    { id: 'dashboard', name: 'Dashboard', description: 'Vue d\'ensemble et statistiques générales' },
    { id: 'seminarists', name: 'Liste des Séminaristes', description: 'Gestion des séminaristes et leurs informations' },
    { id: 'health', name: 'Page Santé', description: 'Suivi médical et consultations' },
    { id: 'restaurant', name: 'Page Restauration', description: 'Gestion des repas et distribution' },
    { id: 'convoy', name: 'Page Convoi', description: 'Organisation du transport' },
    { id: 'accounting', name: 'Page Comptabilité', description: 'Gestion financière et comptable' },
    { id: 'evaluation', name: 'Page Évaluation', description: 'Évaluations et notes des séminaristes' },
    { id: 'accommodation', name: 'Page Hébergement', description: 'Gestion des dortoirs et hébergement' }
  ]);
  
  // Toast notifications
  const alert = ref({
    show: false,
    type: 'success',
    message: ''
  });
  
  // Load data on mount
  onMounted(() => {
    loadUsers();
  });
  
  // Computed properties
  const currentDateFormatted = computed(() => {
    const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    return new Date().toLocaleDateString('fr-FR', options);
  });
  
  const totalUsers = computed(() => users.value.length);
  
  const activeUsers = computed(() => users.value.filter(u => u.isActive).length);
  
  const adminUsers = computed(() => users.value.filter(u => u.role === 'admin').length);
  
  const filteredUsers = computed(() => {
    let filtered = [...users.value];
    
    if (filters.value.search) {
      const search = filters.value.search.toLowerCase();
      filtered = filtered.filter(u => 
        u.name.toLowerCase().includes(search) ||
        u.email.toLowerCase().includes(search) ||
        getRoleName(u.role).toLowerCase().includes(search)
      );
    }
    
    if (filters.value.role_filter) {
      filtered = filtered.filter(u => u.role === filters.value.role_filter);
    }
    
    if (filters.value.status_filter) {
      const isActive = filters.value.status_filter === 'active';
      filtered = filtered.filter(u => u.isActive === isActive);
    }
    
    return filtered;
  });
  
  const paginatedUsers = computed(() => {
    const start = (pagination.value.current_page - 1) * pagination.value.per_page;
    const end = start + pagination.value.per_page;
    const paginated = filteredUsers.value.slice(start, end);
    
    // Update pagination info
    pagination.value.total = filteredUsers.value.length;
    pagination.value.from = start + 1;
    pagination.value.to = Math.min(end, filteredUsers.value.length);
    pagination.value.last_page = Math.ceil(filteredUsers.value.length / pagination.value.per_page);
    
    return paginated;
  });
  
  // Methods
  const loadUsers = () => {
    loadingUsers.value = true;
    
    // Simulate API call - replace with actual API
    setTimeout(() => {
      users.value = [
        {
          id: 1,
          name: 'SAKONE Oumar',
          email: 'oumarsakone75@gmail.com',
          role: 'admin',
          isActive: true,
          permissions: {
            dashboard: { read: true, write: true },
            seminarists: { read: true, write: true },
            health: { read: true, write: true },
            restaurant: { read: true, write: true },
            convoy: { read: true, write: true },
            accounting: { read: true, write: true },
            evaluation: { read: true, write: true },
            accommodation: { read: true, write: true }
          },
          createdAt: '2024-01-15'
        },
        {
          id: 2,
          name: 'MIKAHILO DJIM',
          email: 'mikahilo@senafoi.com',
          role: 'manager',
          isActive: true,
          permissions: {
            dashboard: { read: true, write: false },
            seminarists: { read: true, write: true },
            health: { read: true, write: true },
            restaurant: { read: true, write: true },
            convoy: { read: true, write: false },
            accounting: { read: true, write: false },
            evaluation: { read: true, write: true },
            accommodation: { read: true, write: true }
          },
          createdAt: '2024-02-01'
        },
        {
          id: 3,
          name: 'OUATTARA Ahmed',
          email: 'ouattara.ahmed@senafoi.com',
          role: 'viewer',
          isActive: true,
          permissions: {
            dashboard: { read: true, write: false },
            seminarists: { read: true, write: false },
            health: { read: true, write: false },
            restaurant: { read: true, write: false },
            convoy: { read: true, write: false },
            accounting: { read: false, write: false },
            evaluation: { read: true, write: false },
            accommodation: { read: true, write: false }
          },
          createdAt: '2024-02-15'
        },
        {
          id: 4,
          name: 'Sawadogo Issouf',
          email: 'sawadogo.issouf@senafoi.com',
          role: 'manager',
          isActive: false,
          permissions: {
            dashboard: { read: true, write: false },
            seminarists: { read: true, write: true },
            health: { read: true, write: true },
            restaurant: { read: false, write: false },
            convoy: { read: false, write: false },
            accounting: { read: false, write: false },
            evaluation: { read: true, write: true },
            accommodation: { read: false, write: false }
          },
          createdAt: '2024-01-30'
        }
      ];
      loadingUsers.value = false;
      showAlert('success', `${users.value.length} utilisateurs chargés.`);
    }, 1000);
  };
  
  const getRoleName = (role) => {
    const roles = {
      admin: 'Administrateur',
      manager: 'Gestionnaire',
      viewer: 'Lecteur'
    };
    return roles[role] || role;
  };
  
  const getRoleClass = (role) => {
    const classes = {
      admin: 'avatar-admin',
      manager: 'avatar-manager',
      viewer: 'avatar-viewer'
    };
    return classes[role] || 'avatar-default';
  };
  
  const getUserInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };
  
  const hasPermission = (user, pageId, permission) => {
    return user.permissions[pageId]?.[permission] || false;
  };
  
  const openCreateUserModal = () => {
    resetUserForm();
    showCreateUserModal.value = true;
  };
  
  const editUser = (user) => {
    editingUser.value = user;
    userForm.value = {
      name: user.name,
      email: user.email,
      password: '',
      role: user.role,
      isActive: user.isActive,
      permissions: JSON.parse(JSON.stringify(user.permissions))
    };
    showEditUserModal.value = true;
  };
  
  const closeUserModal = () => {
    showCreateUserModal.value = false;
    showEditUserModal.value = false;
    editingUser.value = null;
    resetUserForm();
  };
  
  const resetUserForm = () => {
    userForm.value = {
      name: '',
      email: '',
      password: '',
      role: '',
      isActive: true,
      permissions: {}
    };
    
    // Initialize permissions
    availablePages.value.forEach(page => {
      userForm.value.permissions[page.id] = { read: false, write: false };
    });
  };
  
  const updatePermission = (pageId, permission, value) => {
    if (!userForm.value.permissions[pageId]) {
      userForm.value.permissions[pageId] = { read: false, write: false };
    }
    userForm.value.permissions[pageId][permission] = value;
    
    // If write is checked, automatically check read
    if (permission === 'write' && value) {
      userForm.value.permissions[pageId].read = true;
    }
    
    // If read is unchecked, automatically uncheck write
    if (permission === 'read' && !value) {
      userForm.value.permissions[pageId].write = false;
    }
  };
  
  const saveUser = () => {
    if (!userForm.value.name || !userForm.value.email || !userForm.value.role) {
      showAlert('error', 'Veuillez remplir tous les champs obligatoires.');
      return;
    }
    
    if (showCreateUserModal.value && !userForm.value.password) {
      showAlert('error', 'Le mot de passe est obligatoire pour créer un utilisateur.');
      return;
    }
    
    if (showCreateUserModal.value) {
      // Create new user
      const newUser = {
        id: Date.now(),
        name: userForm.value.name,
        email: userForm.value.email,
        role: userForm.value.role,
        isActive: userForm.value.isActive,
        permissions: userForm.value.permissions,
        createdAt: new Date().toISOString().split('T')[0]
      };
      users.value.push(newUser);
      showAlert('success', `Utilisateur ${newUser.name} créé avec succès.`);
    } else {
      // Update existing user
      const index = users.value.findIndex(u => u.id === editingUser.value.id);
      if (index !== -1) {
        users.value[index] = {
          ...users.value[index],
          name: userForm.value.name,
          email: userForm.value.email,
          role: userForm.value.role,
          isActive: userForm.value.isActive,
          permissions: userForm.value.permissions
        };
        showAlert('success', `Utilisateur ${userForm.value.name} modifié avec succès.`);
      }
    }
    
    closeUserModal();
  };
  
  const toggleUserStatus = (user) => {
    user.isActive = !user.isActive;
    showAlert('success', `Utilisateur ${user.name} ${user.isActive ? 'activé' : 'désactivé'}.`);
  };
  
  const deleteUser = (user) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer l'utilisateur ${user.name} ?`)) {
      const index = users.value.findIndex(u => u.id === user.id);
      if (index !== -1) {
        users.value.splice(index, 1);
        showAlert('success', `Utilisateur ${user.name} supprimé.`);
      }
    }
  };
  
  const exportUsersReport = async () => {
    try {
      showAlert('info', 'Génération du rapport Excel en cours...');
      
      const data = users.value.map(user => {
        const permissions = availablePages.value.map(page => {
          const userPerm = user.permissions[page.id];
          if (userPerm?.write) return `${page.name}: Écriture`;
          if (userPerm?.read) return `${page.name}: Lecture`;
          return `${page.name}: Aucun`;
        }).join('; ');
        
        return {
          'Nom': user.name,
          'Email': user.email,
          'Rôle': getRoleName(user.role),
          'Statut': user.isActive ? 'Actif' : 'Inactif',
          'Date de création': user.createdAt,
          'Permissions': permissions
        };
      });
  
      const XLSX = await import('xlsx');
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(data);
      
      const colWidths = [
        { wch: 25 }, { wch: 30 }, { wch: 15 }, { wch: 10 }, { wch: 12 }, { wch: 80 }
      ];
      worksheet['!cols'] = colWidths;
      
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Utilisateurs');
      
      const today = new Date().toISOString().split('T')[0];
      const filename = `utilisateurs_senafoi25_${today}.xlsx`;
      XLSX.writeFile(workbook, filename);
      
      showAlert('success', `Export Excel réussi ! ${data.length} utilisateurs exportés.`);
    } catch (error) {
      console.error('Erreur lors de l\'export Excel:', error);
      showAlert('error', 'Erreur lors de l\'export Excel.');
    }
  };
  
  const exportUsersPDF = async () => {
    try {
      showAlert('info', 'Génération du rapport PDF en cours...');
      
      const { jsPDF } = await import('jspdf');
      const autoTable = (await import('jspdf-autotable')).default;
      const doc = new jsPDF('landscape');
  
      doc.setFontSize(20);
      doc.setTextColor(40, 40, 40);
      doc.text('RAPPORT UTILISATEURS SENAFOI 25', 148, 20, { align: 'center' });
  
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      const today = new Date().toLocaleDateString('fr-FR');
      doc.text(`Généré le ${today}`, 148, 30, { align: 'center' });
  
      const tableData = users.value.map(user => [
        user.name,
        user.email,
        getRoleName(user.role),
        user.isActive ? 'Actif' : 'Inactif',
        user.createdAt
      ]);
  
      autoTable(doc, {
        head: [['Nom', 'Email', 'Rôle', 'Statut', 'Date de création']],
        body: tableData,
        startY: 40,
        styles: {
          fontSize: 8,
          cellPadding: 2
        },
        headStyles: {
          fillColor: [59, 130, 246],
          textColor: 255,
          fontStyle: 'bold'
        },
        alternateRowStyles: {
          fillColor: [248, 249, 250]
        }
      });
  
      const filename = `rapport_utilisateurs_senafoi25_${today.replace(/\//g, '-')}.pdf`;
      doc.save(filename);
      showAlert('success', `Export PDF réussi ! ${users.value.length} utilisateurs exportés.`);
    } catch (error) {
      console.error('Erreur lors de l\'export PDF:', error);
      showAlert('error', 'Erreur lors de l\'export PDF.');
    }
  };
  
  const applyFilters = () => {
    pagination.value.current_page = 1;
  };
  
  const resetFilters = () => {
    filters.value = {
      search: '',
      role_filter: '',
      status_filter: ''
    };
    pagination.value.current_page = 1;
  };
  
  const changePage = (page) => {
    if (page < 1 || page > pagination.value.last_page) return;
    pagination.value.current_page = page;
  };
  
  const changePerPage = () => {
    pagination.value.current_page = 1;
  };
  
  const showAlert = (type, message) => {
    alert.value = {
      show: true,
      type,
      message
    };
    setTimeout(() => {
      alert.value.show = false;
    }, 5000);
  };
  
  // Watch for role changes to auto-assign permissions
  watch(() => userForm.value.role, (newRole) => {
    if (newRole === 'admin') {
      // Admin gets all permissions
      availablePages.value.forEach(page => {
        userForm.value.permissions[page.id] = { read: true, write: true };
      });
    } else if (newRole === 'manager') {
      // Manager gets read on all, write on most
      availablePages.value.forEach(page => {
        userForm.value.permissions[page.id] = { 
          read: true, 
          write: page.id !== 'accounting' && page.id !== 'convoy'
        };
      });
    } else if (newRole === 'viewer') {
      // Viewer gets read only on most pages
      availablePages.value.forEach(page => {
        userForm.value.permissions[page.id] = { 
          read: page.id !== 'accounting', 
          write: false 
        };
      });
    }
  });
  </script>
  
  <style scoped>
  .dashboard {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background-color: #f8f9fa;
  }
  
  /* Main Content Styles */
  .main-content {
    flex: 1;
    padding: 1.5rem;
    display: flex;
    justify-content: center;
  }
  
  .overview-section {
    background-color: white;
    border-radius: 0.5rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    width: 90%;
    max-width: 1400px;
  }
  
  .overview-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem 2rem;
    border-bottom: 1px solid #f1f1f4;
  }
  
  .header-left {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  
  .overview-title {
    font-size: 1.75rem;
    font-weight: 700;
    margin: 0;
    color: #111827;
  }
  
  .overview-date {
    font-size: 0.875rem;
    color: #6b7280;
    margin: 0.25rem 0 0;
  }
  
  .header-actions-right {
    display: flex;
    gap: 0.75rem;
  }
  
  .action-button-outlined {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background-color: white;
    color: #6b7280;
    border: 1px solid #e5e7eb;
    border-radius: 9999px;
    padding: 0.5rem 1.25rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .action-button-outlined:hover {
    background-color: #f9fafb;
    border-color: #d1d5db;
  }
  
  .export-button {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    border: none;
    border-radius: 9999px;
    padding: 0.5rem 1.25rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .blue-button {
    background-color: #3b82f6;
    color: white;
    border: 1px solid #3b82f6;
  }
  
  .blue-button:hover {
    background-color: #2563eb;
    border-color: #2563eb;
  }
  
  .green-button {
    background-color: #10b981;
    color: white;
    border: 1px solid #10b981;
  }
  
  .green-button:hover {
    background-color: #059669;
    border-color: #059669;
  }
  
  .red-button {
    background-color: #ef4444;
    color: white;
    border: 1px solid #ef4444;
  }
  
  .red-button:hover {
    background-color: #dc2626;
    border-color: #dc2626;
  }
  
  /* Product Stats */
  .product-stats {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1rem;
    padding: 1.5rem 2rem;
    border-bottom: 1px solid #f1f1f4;
  }
  
  .stat-card {
    background-color: #f9fafb;
    border-radius: 0.5rem;
    padding: 1rem;
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  
  .stat-icon {
    width: 48px;
    height: 48px;
    border-radius: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  
  .stat-icon-blue {
    background-color: #dbeafe;
    color: #3b82f6;
  }
  
  .stat-icon-green {
    background-color: #d1fae5;
    color: #10b981;
  }
  
  .stat-icon-orange {
    background-color: #fff7ed;
    color: #f97316;
  }
  
  .stat-icon-purple {
    background-color: #ede9fe;
    color: #7c3aed;
  }
  
  .stat-info {
    display: flex;
    flex-direction: column;
  }
  
  .stat-value {
    font-size: 1.5rem;
    font-weight: 600;
    color: #111827;
  }
  
  .stat-label {
    font-size: 0.875rem;
    color: #6b7280;
  }
  
  /* Search and Filters */
  .search-filters {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    padding: 1rem 2rem;
    border-bottom: 1px solid #f1f1f4;
  }
  
  .search-bar {
    flex: 1;
    min-width: 300px;
    position: relative;
  }
  
  .search-bar svg {
    position: absolute;
    left: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    color: #6b7280;
  }
  
  .search-bar input {
    width: 100%;
    padding: 0.625rem 0.75rem 0.625rem 2.5rem;
    border: 1px solid #e5e7eb;
    border-radius: 0.375rem;
    font-size: 0.875rem;
  }
  
  .filter-options {
    display: flex;
    gap: 0.75rem;
    flex-wrap: wrap;
  }
  
  .filter-options select {
    padding: 0.625rem 2rem 0.625rem 0.75rem;
    border: 1px solid #e5e7eb;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    background-color: white;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 0.5rem center;
    appearance: none;
  }
  
  /* Users Section */
  .users-section {
    padding: 1.5rem 2rem;
    border-bottom: 1px solid #f1f1f4;
  }
  
  .section-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 1.5rem;
  }
  
  .section-title {
    font-size: 1.5rem;
    font-weight: 600;
    color: #1e293b;
    margin: 0;
  }
  
  .users-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
    gap: 1.5rem;
  }
  
  .user-card {
    background-color: white;
    border: 1px solid #e2e8f0;
    border-radius: 0.75rem;
    padding: 1.5rem;
    transition: all 0.2s;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  }
  
  .user-card:hover {
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    border-color: #3b82f6;
    transform: translateY(-2px);
  }
  
  .user-card.inactive {
    opacity: 0.6;
    background-color: #f8fafc;
  }
  
  .user-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }
  
  .user-avatar {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    color: white;
    flex-shrink: 0;
  }
  
  .avatar-admin {
    background-color: #ef4444;
  }
  
  .avatar-manager {
    background-color: #3b82f6;
  }
  
  .avatar-viewer {
    background-color: #10b981;
  }
  
  .avatar-default {
    background-color: #6b7280;
  }
  
  .user-info {
    flex: 1;
  }
  
  .user-name {
    font-size: 1.125rem;
    font-weight: 600;
    color: #1e293b;
    margin: 0 0 0.25rem;
  }
  
  .user-email {
    font-size: 0.875rem;
    color: #64748b;
    margin: 0 0 0.25rem;
  }
  
  .user-role {
    font-size: 0.75rem;
    color: #64748b;
    margin: 0;
  }
  
  .user-status {
    flex-shrink: 0;
  }
  
  .status-badge {
    padding: 0.25rem 0.75rem;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 500;
  }
  
  .status-badge.active {
    background-color: #d1fae5;
    color: #065f46;
  }
  
  .status-badge.inactive {
    background-color: #fee2e2;
    color: #991b1b;
  }
  
  .user-permissions {
    margin-bottom: 1.5rem;
  }
  
  .user-permissions h5 {
    font-size: 0.875rem;
    font-weight: 600;
    color: #1e293b;
    margin: 0 0 0.75rem;
  }
  
  .permissions-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 0.5rem;
  }
  
  .permission-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem;
    background-color: #f8fafc;
    border-radius: 0.375rem;
    border: 1px solid #e2e8f0;
  }
  
  .page-name {
    font-size: 0.75rem;
    color: #64748b;
    font-weight: 500;
  }
  
  .permission-badges {
    display: flex;
    gap: 0.25rem;
  }
  
  .permission-badge {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.75rem;
  }
  
  .permission-badge.read {
    background-color: #dbeafe;
    color: #1d4ed8;
  }
  
  .permission-badge.write {
    background-color: #d1fae5;
    color: #065f46;
  }
  
  .permission-badge.none {
    background-color: #f3f4f6;
    color: #6b7280;
  }
  
  .user-actions {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }
  
  .action-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0.75rem;
    border-radius: 0.375rem;
    font-size: 0.75rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    border: 1px solid;
    flex: 1;
    justify-content: center;
    min-width: 100px;
  }
  
  .edit-btn {
    background-color: #3b82f6;
    color: white;
    border-color: #3b82f6;
  }
  
  .edit-btn:hover {
    background-color: #2563eb;
    border-color: #2563eb;
  }
  
  .activate-btn {
    background-color: #10b981;
    color: white;
    border-color: #10b981;
  }
  
  .activate-btn:hover {
    background-color: #059669;
    border-color: #059669;
  }
  
  .deactivate-btn {
    background-color: #f59e0b;
    color: white;
    border-color: #f59e0b;
  }
  
  .deactivate-btn:hover {
    background-color: #d97706;
    border-color: #d97706;
  }
  
  .delete-btn {
    background-color: #ef4444;
    color: white;
    border-color: #ef4444;
  }
  
  .delete-btn:hover {
    background-color: #dc2626;
    border-color: #dc2626;
  }
  
  /* Loading and Empty States */
  .loading-indicator {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 3rem 0;
    color: #6b7280;
    gap: 1rem;
  }
  
  .loading-indicator svg {
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
  
  .no-data {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 3rem 0;
    color: #6b7280;
    gap: 1rem;
  }
  
  /* Pagination */
  .pagination {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
    font-size: 0.875rem;
    color: #6b7280;
  }
  
  .pagination-controls {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }
  
  .pagination-button {
    display: flex;
    align-items: center;
    justify-content: center;
    background: none;
    border: 1px solid #e5e7eb;
    border-radius: 0.375rem;
    width: 32px;
    height: 32px;
    cursor: pointer;
    color: #6b7280;
    transition: all 0.2s;
  }
  
  .pagination-button:hover:not(:disabled) {
    background-color: #f3f4f6;
    border-color: #d1d5db;
    color: #111827;
  }
  
  .pagination-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  .pagination-size select {
    padding: 0.375rem 2rem 0.375rem 0.75rem;
    border: 1px solid #e5e7eb;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    background-color: white;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 0.5rem center;
    appearance: none;
  }
  
  /* Modal */
  .modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 50;
    padding: 1rem;
  }
  
  .modal-content {
    background-color: white;
    border-radius: 0.5rem;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    width: 100%;
    max-width: 800px;
    max-height: 90vh;
    overflow-y: auto;
  }
  
  .user-modal {
    max-width: 900px;
  }
  
  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.25rem 1.5rem;
    border-bottom: 1px solid #f1f1f4;
  }
  
  .modal-header h2 {
    font-size: 1.25rem;
    font-weight: 600;
    color: #111827;
    margin: 0;
  }
  
  .close-button {
    background: none;
    border: none;
    color: #6b7280;
    cursor: pointer;
    padding: 0.25rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 0.375rem;
    transition: all 0.2s;
  }
  
  .close-button:hover {
    background-color: #f3f4f6;
    color: #111827;
  }
  
  .modal-body {
    padding: 1.5rem;
  }
  
  .modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 0.75rem;
    padding: 1.25rem 1.5rem;
    border-top: 1px solid #f1f1f4;
  }
  
  /* User Form */
  .user-form {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }
  
  .form-section {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  .form-section h3 {
    font-size: 1.125rem;
    font-weight: 600;
    color: #1e293b;
    margin: 0;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid #e2e8f0;
  }
  
  .form-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem;
  }
  
  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .form-group label {
    font-size: 0.875rem;
    font-weight: 500;
    color: #374151;
  }
  
  .form-input,
  .form-select {
    padding: 0.75rem;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    color: #111827;
    background-color: white;
    transition: border-color 0.2s;
  }
  
  .form-input:focus,
  .form-select:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
  
  .form-select {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 0.75rem center;
    padding-right: 2.5rem;
    appearance: none;
  }
  
  .permissions-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  .permission-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    background-color: #f8fafc;
    border-radius: 0.5rem;
    border: 1px solid #e2e8f0;
  }
  
  .page-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }
  
  .page-info .page-name {
    font-size: 0.875rem;
    font-weight: 600;
    color: #1e293b;
  }
  
  .page-info .page-description {
    font-size: 0.75rem;
    color: #64748b;
  }
  
  .permission-controls {
    display: flex;
    gap: 1rem;
  }
  
  .permission-checkbox,
  .status-checkbox {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    user-select: none;
  }
  
  .permission-checkbox input,
  .status-checkbox input {
    display: none;
  }
  
  .checkmark {
    width: 20px;
    height: 20px;
    border-radius: 0.25rem;
    border: 2px solid #d1d5db;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
    position: relative;
  }
  
  .checkmark.read {
    border-color: #3b82f6;
  }
  
  .checkmark.write {
    border-color: #10b981;
  }
  
  .checkmark.active {
    border-color: #10b981;
  }
  
  .permission-checkbox input:checked + .checkmark.read {
    background-color: #3b82f6;
    border-color: #3b82f6;
  }
  
  .permission-checkbox input:checked + .checkmark.write {
    background-color: #10b981;
    border-color: #10b981;
  }
  
  .status-checkbox input:checked + .checkmark.active {
    background-color: #10b981;
    border-color: #10b981;
  }
  
  .permission-checkbox input:checked + .checkmark::after,
  .status-checkbox input:checked + .checkmark::after {
    content: '✓';
    color: white;
    font-size: 0.75rem;
    font-weight: bold;
  }
  
  .permission-checkbox .label,
  .status-checkbox .label {
    font-size: 0.875rem;
    color: #374151;
    font-weight: 500;
  }
  
  .save-button {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: white;
    background-color: #3b82f6;
    border: none;
    border-radius: 0.375rem;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .save-button:hover {
    background-color: #2563eb;
  }
  
  .cancel-button {
    padding: 0.75rem 1.5rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: #4b5563;
    background-color: white;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .cancel-button:hover {
    background-color: #f3f4f6;
    border-color: #9ca3af;
  }
  
  /* Toast */
  .toast-container {
    position: fixed;
    bottom: 1.5rem;
    right: 1.5rem;
    z-index: 100;
  }
  
  .toast {
    display: flex;
    align-items: center;
    padding: 1rem;
    border-radius: 0.5rem;
    background-color: white;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    min-width: 300px;
    max-width: 450px;
  }
  
  .toast.success {
    border-left: 4px solid #10b981;
  }
  
  .toast.error {
    border-left: 4px solid #ef4444;
  }
  
  .toast.info {
    border-left: 4px solid #3b82f6;
  }
  
  .toast-icon {
    margin-right: 0.75rem;
  }
  
  .toast.success .toast-icon {
    color: #10b981;
  }
  
  .toast.error .toast-icon {
    color: #ef4444;
  }
  
  .toast.info .toast-icon {
    color: #3b82f6;
  }
  
  .toast-content {
    flex: 1;
    font-size: 0.875rem;
    color: #111827;
  }
  
  .toast-close {
    background: none;
    border: none;
    color: #6b7280;
    cursor: pointer;
    padding: 0.25rem;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: 0.75rem;
  }
  
  /* Mobile Responsive */
  @media (max-width: 768px) {
    .main-content {
      padding: 1rem;
    }
    
    .overview-section {
      width: 100%;
    }
    
    .overview-header {
      flex-direction: column;
      gap: 1rem;
      align-items: stretch;
      padding: 1rem;
    }
    
    .header-actions-right {
      flex-direction: column;
      width: 100%;
      gap: 0.5rem;
    }
    
    .header-actions-right button {
      width: 100%;
      justify-content: center;
    }
    
    .search-filters {
      flex-direction: column;
      padding: 1rem;
    }
    
    .filter-options {
      width: 100%;
      flex-direction: column;
      gap: 0.5rem;
    }
    
    .filter-options select {
      width: 100%;
    }
    
    .product-stats {
      grid-template-columns: 1fr;
      padding: 1rem;
    }
    
    .pagination {
      flex-direction: column;
      gap: 1rem;
      align-items: flex-start;
      padding: 1rem;
    }
    
    .pagination-controls {
      width: 100%;
      justify-content: space-between;
    }
    
    .pagination-size {
      width: 100%;
    }
    
    .pagination-size select {
      width: 100%;
    }
    
    .users-section {
      padding: 1rem;
    }
    
    .users-grid {
      grid-template-columns: 1fr;
    }
    
    .user-actions {
      flex-direction: column;
    }
    
    .action-btn {
      min-width: auto;
    }
    
    .modal-content {
      margin: 0.5rem;
      max-width: calc(100vw - 1rem);
    }
    
    .form-grid {
      grid-template-columns: 1fr;
    }
    
    .permission-row {
      flex-direction: column;
      gap: 1rem;
      align-items: stretch;
    }
    
    .permission-controls {
      justify-content: center;
    }
    
    .permissions-grid {
      grid-template-columns: 1fr;
    }
  }
  </style>
  