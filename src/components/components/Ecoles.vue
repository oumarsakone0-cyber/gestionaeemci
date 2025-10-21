<template>
  <div class="membres-page">
    <div class="page-header">
      <div class="header-content">
        <!-- Changed title and subtitle for schools -->
        <h1 class="page-title">🏫 Gestion des Écoles</h1><br/>
        <p class="page-subtitle">Administration des établissements scolaires 2025</p>
      </div>
      <div class="header-stats">
        <div class="stat-card">
          <div class="stat-number">{{ pagination.total || 0 }}</div>
          <div class="stat-label">Écoles</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">{{ ecolesActives }}</div>
          <div class="stat-label">Actives</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">{{ villesRepresentees }}</div>
          <div class="stat-label">Villes</div>
        </div>
      </div>
    </div>

    <div class="content-container">
      <div class="content-header">
        <!-- Changed content title -->
        <h2 class="content-title">Liste des Écoles</h2>
        <div class="header-actions">
          <div class="search-container">
            <div class="search-input-wrapper">
              <span class="search-icon">🔍</span>
              <input 
                type="text" 
                v-model="searchTerm" 
                @input="debouncedSearch"
                placeholder="Rechercher par nom d'établissement..."
                class="search-input"
              />
              <button 
                v-if="filters.search" 
                @click="clearSearch" 
                class="clear-search"
                title="Effacer la recherche"
              >
                ×
              </button>
            </div>
          </div>
          
          <div class="filters-container">
            <!-- Changed dropdown for type_e instead of secretariat -->
            <div class="filter-dropdown-container">
              <div 
                @click="toggleTypeDropdown"
                class="filter-dropdown-trigger"
                :class="{ 'active': showTypeDropdown }"
              >
                <span v-if="selectedTypeText" class="selected-text">{{ selectedTypeText }}</span>
                <span v-else class="placeholder-text">Tous les types</span>
                <div class="dropdown-actions">
                  <button 
                    v-if="filters.type_e" 
                    @click.stop="clearTypeSelection"
                    class="clear-button"
                    type="button"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                  <svg 
                    class="dropdown-arrow"
                    :class="{ 'rotate-180': showTypeDropdown }"
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </div>
              
              <div 
                v-if="showTypeDropdown" 
                class="filter-dropdown-menu"
              >
                <div class="dropdown-search">
                  <input
                    ref="typeSearchInput"
                    v-model="typeSearchTerm"
                    type="text"
                    placeholder="Rechercher un type..."
                    class="dropdown-search-input"
                    @click.stop
                  >
                </div>
                
                <div class="dropdown-options">
                  <div class="dropdown-option all-option" @click="selectType('', 'Tous les types')">
                    Tous les types
                  </div>
                  
                  <div 
                    v-for="type in filteredTypesForDropdown" 
                    :key="type"
                    @click="selectType(type, type)"
                    class="dropdown-option"
                    :class="{ 'selected': filters.type_e === type }"
                  >
                    <span class="option-text">{{ type }}</span>
                    <svg 
                      v-if="filters.type_e === type"
                      class="check-icon" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  
                  <div v-if="filteredTypesForDropdown.length === 0" class="no-results">
                    Aucun type trouvé
                  </div>
                </div>
              </div>
            </div>

            <!-- Added ville filter -->
            <select 
              v-model="filters.ville"
              @change="loadEcoles"
              class="filter-select"
            >
              <option value="">Toutes les villes</option>
              <option v-for="ville in villes" :key="ville" :value="ville">{{ ville }}</option>
            </select>
            
            <select 
              v-model="filters.statut"
              @change="loadEcoles"
              class="filter-select"
            >
              <option value="">Tous les statuts</option>
              <option value="actif">Actif</option>
              <option value="">Pas de section</option>
            </select>
          </div>
          
          <!-- Changed button text -->
          <button class="add-btn" @click="showAddEcole = true">
            <span class="add-icon">+</span>
            <span>Nouvelle École</span>
          </button>
        </div>
      </div>

      <div v-if="filters.search" class="search-results-info">
        <span class="results-count">{{ ecoles.length }} résultat(s) trouvé(s) pour "{{ filters.search }}"</span>
      </div>

      <div v-if="loading" class="loading-container">
        <div class="loading-spinner"></div>
        <!-- Changed loading text -->
        <p class="loading-text">Chargement des écoles...</p>
      </div>

      <div v-else class="table-container">
        <!-- Updated table headers for schools -->
        <table class="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Établissement</th>
              <th>Type</th>
              <th>Ville</th>
              <th>Commune</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <!-- Updated table rows for schools data -->
            <tr v-for="ecole in ecoles" :key="ecole.id_section" class="table-row">
              <td class="matricule-cell">
                <span class="matricule-badge">{{ ecole.id_section }}</span>
              </td>
              <td class="name-cell">
                <div class="membre-info">
                  <span class="membre-nom">{{ ecole.etablissement }}</span>
                </div>
              </td>
              <td>{{ ecole.type_e }}</td>
              <td>{{ ecole.ville }}</td>
              <td>{{ ecole.commune }}</td>
              <td>
                <span class="status-badge" :class="ecole.statut ? 'actif' : 'inactif'">
                  {{ ecole.statut || 'Pas de section' }}
                </span>
              </td>
              <td>
                <div class="action-buttons">
                  <button class="action-btn view" @click="viewEcole(ecole)" title="Voir">
                    👁️
                  </button>
                  <button class="action-btn edit" @click="editEcole(ecole)" title="Modifier">
                    ✏️
                  </button>
                  <button 
                    class="action-btn" 
                    :class="ecole.statut ? 'delete' : 'edit'"
                    @click="toggleEcoleStatus(ecole)" 
                    :title="ecole.statut ? 'Désactiver' : 'Activer'"
                  >
                    {{ ecole.statut ? '❌' : '✅' }}
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        
        <!-- Updated no results message -->
        <div v-if="ecoles.length === 0 && filters.search" class="no-results">
          <div class="no-results-content">
            <span class="no-results-icon">🔍</span>
            <h3>Aucune école trouvée</h3>
            <p>Aucune école ne correspond à votre recherche "{{ filters.search }}"</p>
            <button @click="clearSearch" class="clear-search-btn">Effacer la recherche</button>
          </div>
        </div>
      </div>

      <div v-if="pagination.total > pagination.per_page" class="pagination-container">
        <div class="pagination-info">
          <span class="pagination-text">
            Affichage de {{ (pagination.current_page - 1) * pagination.per_page + 1 }} à 
            {{ Math.min(pagination.current_page * pagination.per_page, pagination.total) }} sur 
            {{ pagination.total }} résultats
          </span>
          <div class="per-page-selector">
            <label for="perPage" class="per-page-label">Éléments par page:</label>
            <select 
              id="perPage"
              v-model="pagination.per_page" 
              @change="changePerPage"
              class="per-page-select"
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </div>
        </div>
        <div class="pagination-controls">
          <button
            @click="changePage(pagination.current_page - 1)"
            :disabled="pagination.current_page <= 1"
            class="pagination-btn"
            :class="{ disabled: pagination.current_page <= 1 }"
          >
            Précédent
          </button>
          
          <template v-for="page in getVisiblePages()" :key="page">
            <button
              v-if="page !== '...' && page <= pagination.last_page"
              @click="changePage(page)"
              class="pagination-btn"
              :class="{ active: page === pagination.current_page }"
            >
              {{ page }}
            </button>
            <span v-else-if="page === '...'" class="pagination-ellipsis">...</span>
          </template>
          
          <button
            @click="changePage(pagination.current_page + 1)"
            :disabled="pagination.current_page >= pagination.last_page"
            class="pagination-btn"
            :class="{ disabled: pagination.current_page >= pagination.last_page }"
          >
            Suivant
          </button>
        </div>
      </div>
    </div>

    <div v-if="showAddMembre" class="modal-overlay" @click="showAddMembre = false">
      <div class="modal-container add-modal" @click.stop>
        <div class="modal-header">
          <h3 class="modal-title">Nouveau Membre</h3>
          <button class="modal-close" @click="showAddMembre = false">×</button>
        </div>
        <form class="add-form" @submit.prevent="addMembre">
          <div class="form-group">
            <label>Photo</label>
            <input type="file" accept="image/*" @change="handlePhotoUpload" />
          </div>
          <div class="form-group">
            <label>Matricule *</label>
            <input type="text" v-model="newMembre.matricule" required placeholder="Ex: AE2024001" />
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Nom *</label>
              <input type="text" v-model="newMembre.nom" required placeholder="Nom de famille" />
            </div>
            <div class="form-group">
              <label>Prénom *</label>
              <input type="text" v-model="newMembre.prenom" required placeholder="Prénom" />
            </div>
          </div>
          <div class="form-group">
            <label>Email *</label>
            <input type="email" v-model="newMembre.email" required placeholder="email@exemple.com" />
          </div>
          <div class="form-group">
            <label>Téléphone *</label>
            <input type="tel" v-model="newMembre.telephone" required placeholder="+223 XX XX XX XX" />
          </div>
          <div class="form-group">
            <label>Secrétariat Régional *</label>
            <select v-model="newMembre.secretariatRegional" required>
              <option value="">Sélectionner un secrétariat</option>
              <option value="Nord">Secrétariat Nord</option>
              <option value="Sud">Secrétariat Sud</option>
              <option value="Centre">Secrétariat Centre</option>
              <option value="Est">Secrétariat Est</option>
              <option value="Ouest">Secrétariat Ouest</option>
            </select>
          </div>
          <div class="form-group">
            <label>Sous-comité</label>
            <select v-model="newMembre.sousComite">
              <option value="">Sélectionner un sous-comité</option>
              <option value="Formation">Formation</option>
              <option value="Communication">Communication</option>
              <option value="Événements">Événements</option>
              <option value="Partenariats">Partenariats</option>
            </select>
          </div>
          <div class="form-group">
            <label>Section</label>
            <select v-model="newMembre.section">
              <option value="">Sélectionner une section</option>
              <option value="Étudiants">Section Étudiants</option>
              <option value="Professionnels">Section Professionnels</option>
              <option value="Recherche">Section Recherche</option>
            </select>
          </div>
          <div class="form-actions">
            <button type="button" class="cancel-btn" @click="showAddMembre = false">Annuler</button>
            <button type="submit" class="submit-btn">Ajouter le membre</button>
          </div>
        </form>
      </div>
    </div>

    <div v-if="showViewModal" class="modal-overlay" @click="showViewModal = false">
      <div class="modal-container compact-modal" @click.stop>
        <div class="modal-header">
          <h3 class="modal-title">
            <i class="fas fa-user-circle"></i>
            Profil du Membre
          </h3>
          <button class="modal-close" @click="showViewModal = false">×</button>
        </div>
        <div class="modal-content">
          <div class="membre-profile-compact">
             <!-- CHANGE: Header compact avec photo et infos principales -->
            <div class="profile-header-compact">
              <div class="profile-photo-mini">
                <img v-if="currentMembre.photo" :src="currentMembre.photo" :alt="currentMembre.nom + ' ' + currentMembre.prenom">
                <div v-else class="profile-avatar-mini">
                  <i class="fas fa-user"></i>
                </div>
              </div>
              <div class="profile-info-compact">
                <h3 class="profile-name-compact">{{ currentMembre.nom }} {{ currentMembre.prenom }}</h3>
                <p class="profile-matricule-compact">{{ currentMembre.matricule }}</p>
                <div class="profile-badges-compact">
                  <span class="badge-mini badge-primary">{{ currentMembre.statut }}</span>
                  <span class="badge-mini" :class="currentMembre.type_membre === 'ACTUEL' ? 'badge-success' : 'badge-warning'">
                    {{ currentMembre.type_membre === 'ACTUEL' ? 'Actuel' : 'Ancien' }}
                  </span>
                  <span class="badge-mini" :class="currentMembre.statut_paiement === 'PAYE' ? 'badge-success' : 'badge-danger'">
                    {{ currentMembre.statut_paiement }}
                  </span>
                  <span class="badge-mini" :class="currentMembre.card_status">
                    {{ currentMembre.card_status === 'pending' ? 'En attente' : currentMembre.card_status }}
                  </span>
                </div>
              </div>
            </div>

             <!-- CHANGE: Grid 2x2 pour les 4 sections d'informations -->
            <div class="info-grid-2x2">
               <!-- Section 1: Informations Personnelles -->
              <div class="info-section-compact">
                <h4 class="section-title-compact">
                  <i class="fas fa-user"></i>
                  Personnel
                </h4>
                <div class="info-items-compact">
                  <div class="info-item-mini">
                    <i class="fas fa-birthday-cake"></i>
                    Date de Naiss :<span>{{ formatDate(currentMembre.date_naissance) }}</span>
                  </div>
                  <div class="info-item-mini">
                    <i class="fas fa-map-marker-alt"></i>
                    Lieu de Naiss :<span>{{ currentMembre.lieu_naissance || 'N/A' }}</span>
                  </div>
                  <div class="info-item-mini">
                    <i class="fas fa-venus-mars"></i>
                    Sexe :<span>{{ currentMembre.sexe === 'M' ? 'M' : 'F' }}</span>
                  </div>
                  <div class="info-item-mini">
                    <i class="fas fa-phone"></i>
                   Contact : <span>{{ currentMembre.telephone }}</span>
                  </div>
                  <div class="info-item-mini" v-if="currentMembre.numero_wave">
                    <i class="fas fa-mobile-alt"></i>
                     <!--  <span>{{ currentMembre.numero_wave }}</span> -->
                  </div>
                </div>
              </div>

               <!-- Section 2: Informations Académiques -->
              <div class="info-section-compact">
                <h4 class="section-title-compact">
                  <i class="fas fa-graduation-cap"></i>
                  Militantisme
                </h4>
                <div class="info-items-compact">
                  <div class="info-item-mini">
                    <i class="fas fa-calendar-alt"></i>
                    <span>Début : {{ currentMembre.annee_debut }}</span>
                  </div>
                  <div class="info-item-mini">
                    <i class="fas fa-star"></i>
                    SR de début :<span>{{ currentMembre.sr_debut }}</span>
                  </div>
                  <div class="info-item-mini">
                    <i class="fas fa-star"></i>
                    SR Actuel :<span>{{ currentMembre.secretariat_poste }}</span>
                  </div>
                  <div class="info-item-mini">
                    <i class="fas fa-star"></i>
                    Qualité :<span>{{ currentMembre.qualite_membre }}</span>
                  </div>
                </div>
              </div>

               <!-- Section 3: Structure Organisationnelle -->
              <div class="info-section-compact">
                <h4 class="section-title-compact">
                  <i class="fas fa-sitemap"></i>
                  Base
                </h4>
                <div class="info-items-compact">
                  <div class="info-item-mini" v-if="currentMembre.sousComite.length > 1">
                    <i class="fas fa-map"></i>
                    Sous-comité :<span>{{ currentMembre.sousComite }}</span>
                  </div>
                  <div class="info-item-mini" v-if="currentMembre.section.length > 1">
                    <i class="fas fa-building"></i>
                    Section :<span>{{ currentMembre.section }}</span>
                  </div>
                  <div class="info-item-mini" v-if="currentMembre.sous_comite">
                    <i class="fas fa-users"></i>
                    <span>{{ currentMembre.sous_comite }}</span>
                  </div>
                  <div class="info-item-mini" v-if="currentMembre.section">
                    <i class="fas fa-layer-group"></i>
                    <span>{{ currentMembre.section }}</span>
                  </div>
                  <div class="info-item-mini" v-if="currentMembre.poste">
                    <i class="fas fa-briefcase"></i>
                    <span>{{ currentMembre.poste }}</span>
                  </div>
                </div>
              </div>

               <!-- Section 4: Paiement & Système -->
              <div class="info-section-compact">
                <h4 class="section-title-compact">
                  <i class="fas fa-cog"></i>
                  Système
                </h4>
                <div class="info-items-compact">
                  <div class="info-item-mini" v-if="currentMembre.ref_paiement">
                    <i class="fas fa-receipt"></i>
                    <span>{{ currentMembre.ref_paiement }}</span>
                  </div>
                  <div class="info-item-mini" v-if="currentMembre.transaction_id">
                    <i class="fas fa-hashtag"></i>
                    <span>{{ currentMembre.transaction_id }}</span>
                  </div>
                  <div class="info-item-mini">
                    <i class="fas fa-calendar-plus"></i>
                    <span>{{ formatDate(currentMembre.created_at) }}</span>
                  </div>
                  <div class="info-item-mini" v-if="currentMembre.printed_at">
                    <i class="fas fa-print"></i>
                    <span>{{ formatDate(currentMembre.printed_at) }}</span>
                  </div>
                  <div class="info-item-mini" v-if="currentMembre.retrieved_at">
                    <i class="fas fa-hand-holding"></i>
                    <span>{{ formatDate(currentMembre.retrieved_at) }}</span>
                  </div>
                  <div class="info-item-mini" v-if="currentMembre.retrieved_by">
                    <i class="fas fa-user-check"></i>
                    <span>{{ currentMembre.retrieved_by }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showPhotoModal" class="modal-overlay" @click="closePhotoModal">
      <div class="photo-modal" @click.stop>
        <div class="photo-modal-header">
          <h3>{{ currentPhotoAlt }}</h3>
          <button class="modal-close" @click="closePhotoModal">×</button>
        </div>
        <div class="photo-modal-content">
          <img :src="currentPhoto" :alt="currentPhotoAlt" class="enlarged-photo">
        </div>
      </div>
    </div>
    <!-- Updated modal for adding schools -->
    <div v-if="showAddEcole" class="modal-overlay" @click="showAddEcole = false">
      <div class="modal-container add-modal" @click.stop>
        <div class="modal-header">
          <h3 class="modal-title">Nouvelle École</h3>
          <button class="modal-close" @click="showAddEcole = false">×</button>
        </div>
        <form class="add-form" @submit.prevent="addEcole">
          <div class="form-group">
            <label>Établissement *</label>
            <input type="text" v-model="newEcole.etablissement" required placeholder="Nom de l'établissement" />
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Type *</label>
              <select v-model="newEcole.type_e" required>
                <option value="">Sélectionner un type</option>
                <option value="Etablissement secondaire">Établissement secondaire</option>
                <option value="Grande école">Grande école</option>
                <option value="Université Public">Université Public</option>
                <option value="Université Privé">Université Privé</option>
                <option value="Grande école Public">Grande école Public</option>
              </select>
            </div>
            <div class="form-group">
              <label>Ville *</label>
              <input type="text" v-model="newEcole.ville" required placeholder="Ville" />
            </div>
          </div>
          <div class="form-group">
            <label>Commune *</label>
            <input type="text" v-model="newEcole.commune" required placeholder="Commune" />
          </div>
          <div class="form-actions">
            <button type="button" class="cancel-btn" @click="showAddEcole = false">Annuler</button>
            <button type="submit" class="submit-btn">Ajouter</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, onUnmounted } from 'vue'

const API_BASE_URL = 'https://sogetrag.com/api/ecoles.php'

const ecoles = ref([])
const loading = ref(false)
const error = ref(null)
const searchTerm = ref('')
const searchTimeout = ref(null)

const showTypeDropdown = ref(false)
const typeSearchTerm = ref('')
const types = ref([
  'Etablissement secondaire', 'Grande école', 'Université Public', 
  'Université Privé', 'Grande école Public'
])

const villes = ref([
  'Abidjan', 'Yamoussoukro', 'Bouaké', 'Daloa', 'San-Pedro', 'Korhogo',
  'Man', 'Divo', 'Gagnoa', 'Abengourou', 'Bondoukou', 'Grand-Bassam'
])

const filters = ref({
  search: '',
  type_e: '',
  ville: '',
  statut: ''
})

const pagination = ref({
  current_page: 1,
  per_page: 10,
  total: 0,
  last_page: 1
})

const showAddEcole = ref(false)
const showViewModal = ref(false)
const currentEcole = ref(null)

const newEcole = ref({
  etablissement: '',
  type_e: '',
  ville: '',
  commune: '',
  statut: 'actif'
})

const showAddMembre = ref(false)
const newMembre = ref({
      matricule: '',
      nom: '',
      prenom: '',
      email: '',
      telephone: '',
      secretariatRegional: '',
      sousComite: '',
      section: '',
      photo: null
    })
const currentMembre = ref(null)
const secretariatSearchTerm = ref('')
const secretariats = ref([])
const showSecretariatDropdown = ref(false)
const currentPhoto = ref(null)
const currentPhotoAlt = ref('')
const showPhotoModal = ref(false)

const loadEcoles = async () => {
  try {
    loading.value = true
    error.value = null
    
    let url = `${API_BASE_URL}?action=ecoles&page=${pagination.value.current_page}&per_page=${pagination.value.per_page}&rand=${Math.random()}`

    if (filters.value.search) {
      url += `&search=${encodeURIComponent(filters.value.search)}` 
    }
    if (filters.value.type_e) {
      url += `&type_e=${encodeURIComponent(filters.value.type_e)}` 
    }
    if (filters.value.ville) {
      url += `&ville=${encodeURIComponent(filters.value.ville)}` 
    }
    if (filters.value.statut) {
      url += `&statut=${encodeURIComponent(filters.value.statut)}` 
    }
    
    const response = await fetch(url)
    const data = await response.json()
    
    if (data.success) {
      ecoles.value = data.data || []
      
      if (data.pagination) {
        pagination.value = {
          ...pagination.value,
          ...data.pagination
        }
      }
    } else {
      throw new Error(data.error || 'Erreur lors du chargement des écoles')
    }
  } catch (err) {
    console.error('Erreur loadEcoles:', err)
    error.value = err.message
    ecoles.value = []
  } finally {
    loading.value = false
  }
}

const debouncedSearch = () => {
  clearTimeout(searchTimeout.value)
  searchTimeout.value = setTimeout(() => {
    filters.value.search = searchTerm.value
    pagination.value.current_page = 1
    loadEcoles()
  }, 500)
}

const ecolesActives = computed(() => {
  return ecoles.value.filter(e => e.statut === 'actif').length
})

const villesRepresentees = computed(() => {
  const villesSet = new Set(ecoles.value.map(e => e.ville).filter(Boolean))
  return villesSet.size
})

const selectedTypeText = computed(() => {
  return filters.value.type_e || ''
})

const filteredTypesForDropdown = computed(() => {
  if (!typeSearchTerm.value) return types.value
  return types.value.filter(type => 
    type.toLowerCase().includes(typeSearchTerm.value.toLowerCase())
  )
})

const toggleTypeDropdown = () => {
  showTypeDropdown.value = !showTypeDropdown.value
  if (showTypeDropdown.value) {
    nextTick(() => {
      if (this.$refs.typeSearchInput) {
        this.$refs.typeSearchInput.focus()
      }
    })
  }
}

const selectType = (type, text) => {
  filters.value.type_e = type
  showTypeDropdown.value = false
  typeSearchTerm.value = ''
  pagination.value.current_page = 1
  loadEcoles()
}

const clearTypeSelection = () => {
  filters.value.type_e = ''
  pagination.value.current_page = 1
  loadEcoles()
}

const addEcole = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}?action=add_ecole`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newEcole.value)
    })
    
    const data = await response.json()
    
    if (data.success) {
      showAddEcole.value = false
      newEcole.value = {
        etablissement: '',
        type_e: '',
        ville: '',
        commune: '',
        statut: 'actif'
      }
      loadEcoles()
    } else {
      throw new Error(data.error || 'Erreur lors de l\'ajout')
    }
  } catch (err) {
    console.error('Erreur addEcole:', err)
    alert('Erreur lors de l\'ajout de l\'école')
  }
}

const toggleEcoleStatus = async (ecole) => {
  try {
    const newStatus = ecole.statut ? null : 'actif'
    const action = newStatus ? 'mark_active' : 'mark_inactive'
    
    const response = await fetch(`${API_BASE_URL}?action=${action}&id=${ecole.id_section}`, {
      method: 'POST'
    })
    
    const data = await response.json()
    
    if (data.success) {
      loadEcoles()
    } else {
      throw new Error(data.error || 'Erreur lors de la modification du statut')
    }
  } catch (err) {
    console.error('Erreur toggleEcoleStatus:', err)
    alert('Erreur lors de la modification du statut')
  }
}

const viewEcole = (ecole) => {
  currentEcole.value = ecole
  showViewModal.value = true
}

const editEcole = (ecole) => {
  // Implementation for editing
  console.log('Edit ecole:', ecole)
}

const changePage = (page) => {
  if (page >= 1 && page <= pagination.value.last_page) {
    pagination.value.current_page = page
    loadEcoles()
  }
}

const changePerPage = () => {
  pagination.value.current_page = 1 // Reset to first page when changing per_page
  loadEcoles()
}

const getVisiblePages = () => {
  const current = pagination.value.current_page
  const last = pagination.value.last_page
  const pages = []
  
  if (last <= 7) {
    for (let i = 1; i <= last; i++) {
      pages.push(i)
    }
  } else {
    if (current <= 4) {
      for (let i = 1; i <= 5; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(last)
    } else if (current >= last - 3) {
      pages.push(1)
      pages.push('...')
      for (let i = last - 4; i <= last; i++) {
        pages.push(i)
      }
    } else {
      pages.push(1)
      pages.push('...')
      for (let i = current - 1; i <= current + 1; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(last)
    }
  }
  
  return pages
}

const handlePhotoUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      newMembre.value.photo = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

const addMembre = async () => {
  try {
    const nouveauMembre = {
      id: Date.now(),
      ...newMembre.value,
      statut: 'Actif'
    }
    
    await loadEcoles()
    
    newMembre.value = {
      matricule: '',
      nom: '',
      prenom: '',
      email: '',
      telephone: '',
      secretariatRegional: '',
      sousComite: '',
      section: '',
      photo: null
    }
    
    showAddMembre.value = false
  } catch (err) {
    console.error('Erreur lors de l\'ajout:', err)
  }
}

const viewMembre = (membre) => {
  currentMembre.value = membre
  showViewModal.value = true
}

const editMembre = (membre) => {
  console.log('Éditer membre:', membre)
}

const deleteMembre = async (membre) => {
  if (confirm(`Êtes-vous sûr de vouloir supprimer ${membre.nom} ${membre.prenom} ?`)) {
    try {
      await loadEcoles()
    } catch (err) {
      console.error('Erreur lors de la suppression:', err)
    }
  }
}

const clearSearch = () => {
  searchTerm.value = ''
  filters.value.search = ''
  pagination.value.current_page = 1
  loadEcoles()
}

const selectedSecretariatText = computed(() => {
  return filters.value.secretariat || ''
})

const filteredSecretariatsForDropdown = computed(() => {
  if (!secretariatSearchTerm.value) {
    return secretariats.value
  }
  return secretariats.value.filter(secretariat => 
    secretariat.toLowerCase().includes(secretariatSearchTerm.value.toLowerCase())
  )
})

const handleClickOutside = (event) => {
  if (!event.target.closest('.filter-dropdown-container')) {
    showSecretariatDropdown.value = false
  }
}

const toggleSecretariatDropdown = () => {
  showSecretariatDropdown.value = !showSecretariatDropdown.value
  if (showSecretariatDropdown.value) {
    secretariatSearchTerm.value = ''
    nextTick(() => {
      if (document.querySelector('.dropdown-search-input')) {
        document.querySelector('.dropdown-search-input').focus()
      }
    })
  }
}

const selectSecretariat = (value, text) => {
  filters.value.secretariat = value
  showSecretariatDropdown.value = false
  secretariatSearchTerm.value = ''
  loadEcoles()
}

const clearSecretariatSelection = () => {
  filters.value.secretariat = ''
  secretariatSearchTerm.value = ''
  loadEcoles()
}

const openPhotoModal = (photo, alt) => {
  if (photo) {
    currentPhoto.value = photo
    currentPhotoAlt.value = alt
    showPhotoModal.value = true
  }
}

const closePhotoModal = () => {
  showPhotoModal.value = false
  currentPhoto.value = null
  currentPhotoAlt.value = ''
}

onMounted(() => {
  loadEcoles()
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

const formatDate = (dateString) => {
  if (!dateString) return 'Non renseigné'
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const formatDateTime = (dateString) => {
  if (!dateString) return 'Non renseigné'
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<style scoped>
.membres-page {
  background: #f9fafb;
  min-height: 100vh;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.page-header {
  background: white;
  border-bottom: 1px solid #e5e7eb;
  padding: 24px 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-content h1 {
  font-size: 24px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 4px 0;
}

.header-content {
  display: grid;
}

.page-subtitle {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
}

.header-stats {
  display: flex;
  gap: 16px;
}

.stat-card {
  background: #21834514;
  padding: 16px 20px;
  border-radius: 8px;
  text-align: center;
  min-width: 80px;
  border-bottom: 3px solid #a6a9a4;
}

.stat-number {
  font-size: 24px;
  font-weight: 600;
  color: #16a34a;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 12px;
  color: #6b7280;
  font-weight: 500;
}

.content-container {
  padding: 32px;
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
}

.content-title {
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.search-container {
  position: relative;
}

.search-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.search-input {
  width: 320px;
  padding: 10px 12px 10px 40px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  background: white;
  color: #374151;
  transition: all 0.2s;
}

.search-input:focus {
  outline: none;
  border-color: #16a34a;
  box-shadow: 0 0 0 3px rgba(22, 163, 74, 0.1);
}

.search-input::placeholder {
  color: #9ca3af;
}

.search-icon {
  position: absolute;
  left: 12px;
  color: #6b7280;
  font-size: 14px;
  pointer-events: none;
}

.clear-search {
  position: absolute;
  right: 8px;
  width: 20px;
  height: 20px;
  border: none;
  background: #f3f4f6;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: #6b7280;
  transition: all 0.2s;
}

.clear-search:hover {
  background: #e5e7eb;
  color: #374151;
}

.filters-container {
  display: flex;
  gap: 8px;
}

.filter-select {
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  background: white;
  color: #374151;
  transition: all 0.2s;
}

.filter-select:focus {
  outline: none;
  border-color: #16a34a;
  box-shadow: 0 0 0 3px rgba(22, 163, 74, 0.1);
}

.search-results-info {
  margin-bottom: 16px;
  padding: 12px 16px;
  background: #f0f9ff;
  border: 1px solid #bae6fd;
  border-radius: 6px;
}

.results-count {
  font-size: 14px;
  color: #0369a1;
  font-weight: 500;
}

.loading-container {
  padding: 48px 24px;
  text-align: center;
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #f3f4f6;
  border-top: 3px solid #16a34a;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-text {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
}

.add-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: #16a34a;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.add-btn:hover {
  background: #15803d;
}

.add-icon {
  font-size: 16px;
  font-weight: bold;
}

.table-container {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th {
  background: #f9fafb;
  padding: 16px;
  text-align: left;
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 1px solid #e5e7eb;
}

.table-row {
  border-bottom: 1px solid #f3f4f6;
  transition: all 0.2s;
}

.table-row:hover {
  background: #f9fafb;
}

.data-table td {
  padding: 16px;
  font-size: 14px;
  color: #374151;
}

.photo-cell {
  display: flex;
  justify-content: center;
}

.membre-photo {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.membre-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #16a34a;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
}

.matricule-cell {
  text-align: center;
}

.matricule-badge {
  background: #eff6ff;
  color: #16a34a;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.name-cell {
  min-width: 200px;
}

.membre-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.membre-nom {
  font-weight: 500;
  color: #1f2937;
}

.membre-email {
  font-size: 12px;
  color: #6b7280;
}

.contact-cell {
  min-width: 180px;
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.contact-phone, .contact-email {
  font-size: 12px;
  color: #6b7280;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.status-badge.actif {
  background: #dcfce7;
  color: #166534;
}

.status-badge.inactif {
  background: #fef2f2;
  color: #991b1b;
}

.action-buttons {
  display: flex;
  gap: 4px;
}

.action-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  transition: all 0.2s;
}

.action-btn:hover {
  background: #f3f4f6;
}

.action-btn.view:hover {
  background: #eff6ff;
  color: #16a34a;
}

.action-btn.edit:hover {
  background: #fef3c7;
  color: #d97706;
}

.action-btn.delete:hover {
  background: #fef2f2;
  color: #dc2626;
}

.no-results {
  padding: 48px 24px;
  text-align: center;
  background: white;
}

.no-results-content {
  max-width: 300px;
  margin: 0 auto;
}

.no-results-icon {
  font-size: 48px;
  margin-bottom: 16px;
  display: block;
}

.no-results h3 {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 8px 0;
}

.no-results p {
  font-size: 14px;
  color: #6b7280;
  margin: 0 0 20px 0;
}

.clear-search-btn {
  padding: 8px 16px;
  background: #16a34a;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.clear-search-btn:hover {
  background: #15803d;
}

.pagination-container {
  margin-top: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  padding: 16px 24px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.pagination-info {
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}

.per-page-selector {
  display: flex;
  align-items: center;
  gap: 8px;
}

.per-page-label {
  font-size: 14px;
  color: #666;
  white-space: nowrap;
}

.per-page-select {
  padding: 4px 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  background: white;
  cursor: pointer;
}

.per-page-select:focus {
  outline: none;
  border-color: #4CAF50;
}

.pagination-controls {
  display: flex;
  gap: 4px;
  align-items: center;
}

.pagination-btn {
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  background: white;
  color: #374151;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.pagination-btn:hover:not(.disabled) {
  background: #f9fafb;
}

.pagination-btn.active {
  background: #16a34a;
  color: white;
  border-color: #16a34a;
}

.pagination-btn.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-ellipsis {
  padding: 8px 4px;
  color: #6b7280;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-container {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.add-modal {
  max-width: 600px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #e5e7eb;
}

.modal-title {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.modal-close {
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: #6b7280;
}

.modal-close:hover {
  background: #f3f4f6;
}

.modal-content {
  padding: 24px;
  overflow-y: auto;
  width: 100%;
    max-width: 100%;
}

.add-form {
  padding: 24px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 6px;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  background: white;
  color: #374151;
  transition: all 0.2s;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #16a34a;
  box-shadow: 0 0 0 3px rgba(22, 163, 74, 0.1);
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding-top: 20px;
  border-top: 1px solid #e5e7eb;
}

.cancel-btn {
  padding: 8px 16px;
  background: transparent;
  color: #6b7280;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.cancel-btn:hover {
  background: #f9fafb;
  color: #374151;
}

.submit-btn {
  padding: 8px 16px;
  background: #16a34a;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.submit-btn:hover {
  background: #15803d;
}

.membre-details {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.membre-header {
  display: flex;
  gap: 20px;
  align-items: center;
}

.membre-photo-large {
  flex-shrink: 0;
}

.membre-photo-large img {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
}

.membre-avatar-large {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #16a34a;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 24px;
}

.membre-info-large h4 {
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 8px 0;
}

.matricule-large {
  font-size: 14px;
  color: #6b7280;
  margin: 0 0 4px 0;
}

.email-large {
  font-size: 14px;
  color: #6b7280;
  margin: 0 0 12px 0;
}

.status-badge-large {
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 500;
}

.status-badge-large.actif {
  background: #dcfce7;
  color: #166534;
}

.status-badge-large.inactif {
  background: #fef2f2;
  color: #991b1b;
}

.membre-details-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 16px;
  background: #f9fafb;
  border-radius: 8px;
}

.detail-item strong {
  font-size: 12px;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.detail-item span {
  font-size: 14px;
  color: #1f2937;
  font-weight: 500;
}

.filter-dropdown-container {
  position: relative;
  min-width: 200px;
}

.filter-dropdown-trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 14px;
}

.filter-dropdown-trigger:hover {
  border-color: #22c55e;
}

.filter-dropdown-trigger.active {
  border-color: #22c55e;
  box-shadow: 0 0 0 2px rgba(34, 197, 94, 0.1);
}

.selected-text {
  color: #111827;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.placeholder-text {
  color: #6b7280;
}

.dropdown-actions {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
}

.clear-button {
  padding: 2px;
  color: #6b7280;
  transition: color 0.2s;
}

.dropdown-arrow {
  width: 16px;
  height: 16px;
  color: #6b7280;
  transition: transform 0.2s;
}

.filter-dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 50;
  margin-top: 4px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  max-height: 300px;
  overflow: hidden;
}

.dropdown-search {
  padding: 8px;
  border-bottom: 1px solid #e5e7eb;
}

.dropdown-search-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 14px;
  outline: none;
}

.dropdown-search-input:focus {
  border-color: #22c55e;
  box-shadow: 0 0 0 2px rgba(34, 197, 94, 0.1);
}

.dropdown-options {
  max-height: 240px;
  overflow-y: auto;
}

.dropdown-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  cursor: pointer;
  transition: background-color 0.2s;
  font-size: 14px;
}

.dropdown-option:hover {
  background-color: #f9fafb;
}

.dropdown-option.all-option {
  color: #6b7280;
  font-style: italic;
}

.dropdown-option.selected {
  background-color: #ecfdf5;
  color: #059669;
  font-weight: 500;
}

.option-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.check-icon {
  width: 16px;
  height: 16px;
  color: #059669;
  flex-shrink: 0;
}

.no-results {
  padding: 12px 16px;
  text-align: center;
  color: #6b7280;
  font-size: 14px;
}

.membre-profile-compact {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
}

.profile-header-compact {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}

.profile-photo-mini {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
}

.profile-photo-mini img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-avatar-mini {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #9ca3af;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}

.profile-info-compact {
  display: flex;
  flex-direction: column;
}

.profile-name-compact {
  font-size: 16px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 4px;
}

.profile-matricule-compact {
  font-size: 12px;
  color: #6b7280;
  margin-bottom: 8px;
}

.profile-badges-compact {
  display: flex;
  gap: 4px;
}

.badge-mini {
  font-size: 10px;
  font-weight: 500;
  padding: 4px 6px;
  border-radius: 4px;
  color: #fff;
}

.badge-primary {
  background-color: #3b82f6;
}

.badge-success {
  background-color: #16a34a;
}

.badge-warning {
  background-color: #f59e0b;
}

.badge-danger {
  background-color: #dc2626;
}

.badge.pending {
  background: #f3f4f6;
  color: #6b7280;
}

.badge.approved {
  background: #dcfce7;
  color: #166534;
}

.badge.rejected {
  background: #fef2f2;
  color: #991b1b;
}

.info-grid-2x2 {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.info-section-compact {
  background-color: #f9fafb;
  border-radius: 8px;
  padding: 16px;
}

.section-title-compact {
  font-size: 14px;
  font-weight: 500;
  color: #4b5563;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.info-items-compact {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.info-item-mini {
  font-size: 12px;
  color: #374151;
  display: flex;
  align-items: center;
  gap: 4px;
}

.info-item-mini i {
  color: #6b7280;
}

.compact-modal {
  max-width: 700px;
}

.clickable-photo {
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.clickable-photo:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.photo-modal {
  background: white;
  border-radius: 12px;
  max-width: 90vw;
  max-height: 90vh;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  position: relative;
}

.photo-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #e5e7eb;
  background: #f9fafb;
}

.photo-modal-header h3 {
  margin: 0;
  color: #1f2937;
  font-size: 18px;
  font-weight: 600;
}

.photo-modal-content {
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f9fafb;
}

.enlarged-photo {
  max-width: 100%;
  max-height: 70vh;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
</style>
