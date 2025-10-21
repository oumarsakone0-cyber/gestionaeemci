<template>
  <div class="activites-page">
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">📅 Gestion des Activités</h1><br/>
        <p class="page-subtitle">Administration des activités de l'AEEMCI</p>
      </div>
      <div class="header-stats">
        <div class="stat-card">
          <div class="stat-number">{{ pagination.total || 0 }}</div>
          <div class="stat-label">Activités</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">{{ activitesEnCours }}</div>
          <div class="stat-label">En cours</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">{{ activitesTerminees }}</div>
          <div class="stat-label">Terminées</div>
        </div>
      </div>
    </div>

    <div class="content-container">
      <div class="content-header">
        <h2 class="content-title">Liste des Activités</h2>
        <div class="header-actions">
          <div class="search-container">
            <div class="search-input-wrapper">
              <span class="search-icon">🔍</span>
              <input 
                type="text" 
                v-model="searchTerm" 
                @input="debouncedSearch"
                placeholder="Rechercher par nom d'activité, lieu ou PCO..."
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
            <div class="filter-dropdown-container">
              <button 
                @click="showOrganeDropdown = !showOrganeDropdown" 
                class="filter-btn"
                :class="{ active: filters.organe }"
              >
                {{ filters.organe || 'Tous les organes' }} ▼
              </button>
              <div v-if="showOrganeDropdown" class="filter-dropdown">
                <div class="filter-option" @click="selectOrgane('')">Tous les organes</div>
                <div class="filter-option" @click="selectOrgane('Section')">Section</div>
                <div class="filter-option" @click="selectOrgane('Sous-comité')">Sous-comité</div>
                <div class="filter-option" @click="selectOrgane('Secrétariat régional')">Secrétariat régional</div>
              </div>
            </div>

            <div class="filter-dropdown-container">
              <button 
                @click="showStatutDropdown = !showStatutDropdown" 
                class="filter-btn"
                :class="{ active: filters.statut }"
              >
                {{ filters.statut || 'Tous les statuts' }} ▼
              </button>
              <div v-if="showStatutDropdown" class="filter-dropdown">
                <div class="filter-option" @click="selectStatut('')">Tous les statuts</div>
                <div class="filter-option" @click="selectStatut('En cours')">En cours</div>
                <div class="filter-option" @click="selectStatut('Terminée')">Terminée</div>
              </div>
            </div>
          </div>

          <button @click="showAddActivite = true" class="add-btn">
            ➕ Nouvelle Activité
          </button>
        </div>
      </div>

      <div v-if="loading" class="loading-container">
        <div class="loading-spinner"></div>
        <p class="loading-text">Chargement des activités...</p>
      </div>

      <div v-else class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>Nom de l'Activité</th>
              <th>Date</th>
              <th>Statut</th>
              <th>Organe</th>
              <th>Type</th>
              <th>Lieu</th>
              <th>PCO</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="activite in activites" :key="activite.id" class="table-row">
              <td class="name-cell">
                <div class="activite-info">
                  <span class="activite-nom">{{ activite.nom }}</span>
                  <span class="activite-description">{{ activite.description }}</span>
                </div>
              </td>
              <td class="date-cell">
                <div class="date-info">
                  <span class="date-debut">{{ formatDate(activite.date_debut) }}</span>
                  <span v-if="activite.date_fin" class="date-fin">au {{ formatDate(activite.date_fin) }}</span>
                </div>
              </td>
              <td>
                <span class="status-badge" :class="getStatutClass(activite)">
                  {{ getStatutActivite(activite) }}
                </span>
              </td>
              <td>
                <span class="organe-badge" :class="getOrganeClass(activite.organe)">
                  {{ activite.organe }}
                </span>
              </td>
              <td>{{ activite.type_activite }}</td>
              <td>{{ activite.lieu }}</td>
              <td class="pco-cell">
                <div class="pco-info">
                  <span class="pco-nom">{{ activite.pco_nom }}</span>
                  <span class="pco-contact">{{ activite.pco_telephone }}</span>
                </div>
              </td>
              <td>
                <div class="action-buttons">
                  <button class="action-btn view" @click="viewActivite(activite)" title="Voir détails">
                    👁️
                  </button>
                  <button 
                    v-if="activite.programme_pdf" 
                    class="action-btn program" 
                    @click="viewProgramme(activite)" 
                    title="Voir programme"
                  >
                    📄
                  </button>
                  <button 
                    v-if="getStatutActivite(activite) === 'Terminée' && activite.rapport_pdf" 
                    class="action-btn report" 
                    @click="viewRapport(activite)" 
                    title="Voir rapport"
                  >
                    📊
                  </button>
                  <button class="action-btn edit" @click="editActivite(activite)" title="Modifier">
                    ✏️
                  </button>
                  <button class="action-btn delete" @click="deleteActivite(activite)" title="Supprimer">
                    🗑️
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        
        <div v-if="activites.length === 0 && filters.search" class="no-results">
          <div class="no-results-icon">🔍</div>
          <h3>Aucune activité trouvée</h3>
          <p>Essayez de modifier vos critères de recherche</p>
        </div>

        <div v-if="activites.length === 0 && !filters.search && !loading" class="empty-state">
          <div class="empty-icon">📅</div>
          <h3>Aucune activité enregistrée</h3>
          <p>Commencez par ajouter votre première activité</p>
          <button @click="showAddActivite = true" class="add-btn">➕ Nouvelle Activité</button>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="pagination.last_page > 1" class="pagination">
        <button 
          @click="changePage(pagination.current_page - 1)" 
          :disabled="pagination.current_page === 1"
          class="pagination-btn"
        >
          ← Précédent
        </button>
        
        <div class="pagination-info">
          Page {{ pagination.current_page }} sur {{ pagination.last_page }}
        </div>
        
        <button 
          @click="changePage(pagination.current_page + 1)" 
          :disabled="pagination.current_page === pagination.last_page"
          class="pagination-btn"
        >
          Suivant →
        </button>
      </div>
    </div>

    <!-- Modal Ajout/Modification Activité -->
    <div v-if="showAddActivite || showEditActivite" class="modal-overlay" @click="closeModals">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>{{ showEditActivite ? 'Modifier l\'Activité' : 'Nouvelle Activité' }}</h3>
          <button @click="closeModals" class="close-btn">×</button>
        </div>
        
        <form @submit.prevent="saveActivite" class="modal-form">
          <div class="form-row">
            <div class="form-group">
              <label>Nom de l'activité *</label>
              <input type="text" v-model="newActivite.nom" required class="form-input">
            </div>
            <div class="form-group">
              <label>Type d'activité *</label>
              <input type="text" v-model="newActivite.type_activite" required class="form-input" 
                     placeholder="ex: Conférence, Journée culturelle, Demi-journée...">
            </div>
          </div>

          <div class="form-group">
            <label>Description</label>
            <textarea v-model="newActivite.description" class="form-textarea" rows="3"></textarea>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Date de début *</label>
              <input type="datetime-local" v-model="newActivite.date_debut" required class="form-input">
            </div>
            <div class="form-group">
              <label>Date de fin</label>
              <input type="datetime-local" v-model="newActivite.date_fin" class="form-input">
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Organe responsable *</label>
              <select v-model="newActivite.organe" required class="form-select">
                <option value="">Sélectionner un organe</option>
                <option value="Section">Section</option>
                <option value="Sous-comité">Sous-comité</option>
                <option value="Secrétariat régional">Secrétariat régional</option>
              </select>
            </div>
            <div class="form-group">
              <label>Nom de l'organe *</label>
              <input type="text" v-model="newActivite.nom_organe" required class="form-input" 
                     :placeholder="getOrganePlaceholder(newActivite.organe)">
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Lieu *</label>
              <input type="text" v-model="newActivite.lieu" required class="form-input">
            </div>
            <div class="form-group">
              <label>PCO - Nom *</label>
              <input type="text" v-model="newActivite.pco_nom" required class="form-input">
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>PCO - Téléphone *</label>
              <input type="tel" v-model="newActivite.pco_telephone" required class="form-input">
            </div>
            <div class="form-group">
              <!-- Empty div to maintain grid layout -->
            </div>
          </div>

          <div class="form-group">
            <label>Points importants</label>
            <textarea v-model="newActivite.points_importants" class="form-textarea" rows="4" 
                      placeholder="Décrivez les points importants de cette activité..."></textarea>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Programme (PDF)</label>
              <input type="file" @change="handleProgrammeUpload" accept=".pdf" class="form-file">
            </div>
            <div class="form-group">
              <label>Rapport (PDF) - Si activité terminée</label>
              <input type="file" @change="handleRapportUpload" accept=".pdf" class="form-file">
            </div>
          </div>

          <div class="modal-actions">
            <button type="button" @click="closeModals" class="cancel-btn">Annuler</button>
            <button type="submit" class="save-btn">{{ showEditActivite ? 'Modifier' : 'Ajouter' }}</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal Détails Activité -->
    <div v-if="showViewModal" class="modal-overlay" @click="closeModals">
      <div class="modal-content large" @click.stop>
        <div class="modal-header">
          <h3>{{ currentActivite?.nom }}</h3>
          <button @click="closeModals" class="close-btn">×</button>
        </div>
        
        <div class="activite-details">
          <div class="detail-section">
            <h4>Informations générales</h4>
            <div class="detail-grid">
              <div class="detail-item">
                <label>Type d'activité:</label>
                <span>{{ currentActivite?.type_activite }}</span>
              </div>
              <div class="detail-item">
                <label>Organe responsable:</label>
                <span class="organe-badge" :class="getOrganeClass(currentActivite?.organe)">
                  {{ currentActivite?.organe }}
                </span>
              </div>
              <div class="detail-item">
                <label>Nom de l'organe:</label>
                <span>{{ currentActivite?.nom_organe }}</span>
              </div>
              <div class="detail-item">
                <label>Statut:</label>
                <span class="status-badge" :class="getStatutClass(currentActivite)">
                  {{ getStatutActivite(currentActivite) }}
                </span>
              </div>
              <div class="detail-item">
                <label>Lieu:</label>
                <span>{{ currentActivite?.lieu }}</span>
              </div>
            </div>
          </div>

          <div class="detail-section">
            <h4>Dates</h4>
            <div class="detail-grid">
              <div class="detail-item">
                <label>Date de début:</label>
                <span>{{ formatDate(currentActivite?.date_debut) }}</span>
              </div>
              <div class="detail-item" v-if="currentActivite?.date_fin">
                <label>Date de fin:</label>
                <span>{{ formatDate(currentActivite?.date_fin) }}</span>
              </div>
            </div>
          </div>

          <div class="detail-section">
            <h4>PCO (Point de Contact Organisateur)</h4>
            <div class="detail-grid">
              <div class="detail-item">
                <label>Nom:</label>
                <span>{{ currentActivite?.pco_nom }}</span>
              </div>
              <div class="detail-item">
                <label>Téléphone:</label>
                <span>{{ currentActivite?.pco_telephone }}</span>
              </div>
            </div>
          </div>

          <div class="detail-section" v-if="currentActivite?.description">
            <h4>Description</h4>
            <p class="description-text">{{ currentActivite?.description }}</p>
          </div>

          <div class="detail-section" v-if="currentActivite?.points_importants">
            <h4>Points importants</h4>
            <p class="points-text">{{ currentActivite?.points_importants }}</p>
          </div>

          <div class="detail-section">
            <h4>Documents</h4>
            <div class="documents-grid">
              <div v-if="currentActivite?.programme_pdf" class="document-item">
                <button @click="viewProgramme(currentActivite)" class="document-btn programme">
                  📄 Voir le programme
                </button>
              </div>
              <div v-if="getStatutActivite(currentActivite) === 'Terminée' && currentActivite?.rapport_pdf" class="document-item">
                <button @click="viewRapport(currentActivite)" class="document-btn rapport">
                  📊 Voir le rapport
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, onUnmounted } from 'vue'

const API_BASE_URL = 'https://sogetrag.com/api/activites.php'

const activites = ref([
  {
    id: 1,
    nom: 'Conférence sur l\'Intelligence Artificielle',
    description: 'Une conférence sur les dernières avancées en IA',
    type_activite: 'Conférence',
    date_debut: '2024-03-15T09:00',
    date_fin: '2024-03-15T17:00',
    organe: 'Section',
    nom_organe: 'Section Informatique',
    lieu: 'Amphithéâtre A - ENSETP',
    pco_nom: 'Dr. Amadou Diallo',
    pco_telephone: '+221 77 123 45 67',
    points_importants: 'Présentation des nouvelles technologies, networking avec les professionnels',
    programme_pdf: 'programme_ia_2024.pdf',
    rapport_pdf: 'rapport_conference_ia.pdf'
  },
  {
    id: 2,
    nom: 'Journée culturelle AEEMCI',
    description: 'Célébration de la diversité culturelle des étudiants',
    type_activite: 'Journée culturelle',
    date_debut: '2024-04-20T08:00',
    date_fin: '2024-04-20T20:00',
    organe: 'Sous-comité',
    nom_organe: 'Sous-comité Culture et Sport',
    lieu: 'Campus ENSETP',
    pco_nom: 'Fatou Sall',
    pco_telephone: '+221 76 987 65 43',
    points_importants: 'Spectacles traditionnels, exposition artisanale, concours de danse',
    programme_pdf: 'programme_culture_2024.pdf',
    rapport_pdf: null
  },
  {
    id: 3,
    nom: 'Formation en Leadership',
    description: 'Atelier de formation pour les responsables étudiants',
    type_activite: 'Demi-journée',
    date_debut: '2024-05-10T14:00',
    date_fin: '2024-05-10T18:00',
    organe: 'Secrétariat régional',
    nom_organe: 'Secrétariat Régional Dakar',
    lieu: 'Salle de conférence - Hôtel Terrou-Bi',
    pco_nom: 'Moussa Ba',
    pco_telephone: '+221 78 456 78 90',
    points_importants: 'Techniques de leadership, gestion d\'équipe, communication efficace',
    programme_pdf: 'programme_leadership.pdf',
    rapport_pdf: null
  },
  {
    id: 4,
    nom: 'Séminaire Entrepreneuriat',
    description: 'Séminaire sur l\'entrepreneuriat étudiant',
    type_activite: 'S��minaire',
    date_debut: '2024-02-28T09:00',
    date_fin: '2024-02-28T16:00',
    organe: 'Section',
    nom_organe: 'Section Génie Civil',
    lieu: 'Salle polyvalente ENSETP',
    pco_nom: 'Awa Ndiaye',
    pco_telephone: '+221 77 234 56 78',
    points_importants: 'Business plan, financement, success stories',
    programme_pdf: 'programme_entrepreneuriat.pdf',
    rapport_pdf: 'rapport_entrepreneuriat_2024.pdf'
  }
])

const loading = ref(false)
const error = ref(null)
const searchTerm = ref('')
const searchTimeout = ref(null)

const showOrganeDropdown = ref(false)
const showStatutDropdown = ref(false)

const filters = ref({
  search: '',
  organe: '',
  statut: ''
})

const pagination = ref({
  current_page: 1,
  per_page: 10,
  total: 0,
  last_page: 1
})

const showAddActivite = ref(false)
const showEditActivite = ref(false)
const showViewModal = ref(false)
const currentActivite = ref(null)

const newActivite = ref({
  nom: '',
  description: '',
  type_activite: '',
  date_debut: '',
  date_fin: '',
  organe: '',
  nom_organe: '',
  lieu: '',
  pco_nom: '',
  pco_telephone: '',
  points_importants: '',
  programme_pdf: null,
  rapport_pdf: null
})

// Computed properties
const activitesEnCours = computed(() => {
  return activites.value.filter(activite => getStatutActivite(activite) === 'En cours').length
})

const activitesTerminees = computed(() => {
  return activites.value.filter(activite => getStatutActivite(activite) === 'Terminée').length
})

// Fonctions utilitaires
const getStatutActivite = (activite) => {
  if (!activite || !activite.date_debut) return 'En cours'
  
  const now = new Date()
  const dateDebut = new Date(activite.date_debut)
  const dateFin = activite.date_fin ? new Date(activite.date_fin) : dateDebut
  
  if (now > dateFin) {
    return 'Terminée'
  } else {
    return 'En cours'
  }
}

const getStatutClass = (activite) => {
  const statut = getStatutActivite(activite)
  return statut === 'Terminée' ? 'terminee' : 'en-cours'
}

const getOrganeClass = (organe) => {
  switch(organe) {
    case 'Section': return 'section'
    case 'Sous-comité': return 'sous-comite'
    case 'Secrétariat régional': return 'secretariat'
    default: return ''
  }
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Fonctions de recherche et filtrage
const debouncedSearch = () => {
  clearTimeout(searchTimeout.value)
  searchTimeout.value = setTimeout(() => {
    filters.value.search = searchTerm.value
    pagination.value.current_page = 1
    loadActivites()
  }, 300)
}

const clearSearch = () => {
  searchTerm.value = ''
  filters.value.search = ''
  loadActivites()
}

const selectOrgane = (organe) => {
  filters.value.organe = organe
  showOrganeDropdown.value = false
  pagination.value.current_page = 1
  loadActivites()
}

const selectStatut = (statut) => {
  filters.value.statut = statut
  showStatutDropdown.value = false
  pagination.value.current_page = 1
  loadActivites()
}

// Fonctions de chargement des données
const loadActivites = async () => {
  try {
    loading.value = true
    error.value = null
    
    let url = `${API_BASE_URL}?action=activites&page=${pagination.value.current_page}&per_page=${pagination.value.per_page}&rand=${Math.random()}`

    if (filters.value.search) {
      url += `&search=${encodeURIComponent(filters.value.search)}` 
    }
    if (filters.value.organe) {
      url += `&organe=${encodeURIComponent(filters.value.organe)}` 
    }
    if (filters.value.statut) {
      url += `&statut=${encodeURIComponent(filters.value.statut)}` 
    }
    
    const response = await fetch(url)
    const data = await response.json()
    
    if (data.success) {
      activites.value = data.data || []
      
      if (data.pagination) {
        pagination.value = {
          current_page: data.pagination.current_page,
          per_page: data.pagination.per_page,
          total: data.pagination.total,
          last_page: data.pagination.last_page
        }
      }
    } else {
      error.value = data.message || 'Erreur lors du chargement des activités'
    }
  } catch (err) {
    error.value = 'Erreur de connexion au serveur'
    console.error('Erreur:', err)
  } finally {
    loading.value = false
  }
}

// Fonctions de gestion des activités
const viewActivite = (activite) => {
  currentActivite.value = activite
  showViewModal.value = true
}

const editActivite = (activite) => {
  currentActivite.value = activite
  newActivite.value = { ...activite }
  showEditActivite.value = true
}

const deleteActivite = async (activite) => {
  if (!confirm(`Êtes-vous sûr de vouloir supprimer l'activité "${activite.nom}" ?`)) {
    return
  }

  try {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'delete',
        id: activite.id
      })
    })

    const data = await response.json()
    
    if (data.success) {
      await loadActivites()
    } else {
      alert('Erreur lors de la suppression: ' + (data.message || 'Erreur inconnue'))
    }
  } catch (err) {
    alert('Erreur de connexion lors de la suppression')
    console.error('Erreur:', err)
  }
}

const saveActivite = async () => {
  try {
    const formData = new FormData()
    formData.append('action', showEditActivite.value ? 'update' : 'create')
    
    if (showEditActivite.value) {
      formData.append('id', currentActivite.value.id)
    }

    // Ajouter tous les champs
    Object.keys(newActivite.value).forEach(key => {
      if (newActivite.value[key] !== null && newActivite.value[key] !== '') {
        formData.append(key, newActivite.value[key])
      }
    })

    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      body: formData
    })

    const data = await response.json()
    
    if (data.success) {
      closeModals()
      await loadActivites()
    } else {
      alert('Erreur lors de la sauvegarde: ' + (data.message || 'Erreur inconnue'))
    }
  } catch (err) {
    alert('Erreur de connexion lors de la sauvegarde')
    console.error('Erreur:', err)
  }
}

// Fonctions de gestion des fichiers PDF
const handleProgrammeUpload = (event) => {
  const file = event.target.files[0]
  if (file && file.type === 'application/pdf') {
    newActivite.value.programme_pdf = file
  } else {
    alert('Veuillez sélectionner un fichier PDF valide')
    event.target.value = ''
  }
}

const handleRapportUpload = (event) => {
  const file = event.target.files[0]
  if (file && file.type === 'application/pdf') {
    newActivite.value.rapport_pdf = file
  } else {
    alert('Veuillez sélectionner un fichier PDF valide')
    event.target.value = ''
  }
}

const viewProgramme = (activite) => {
  if (activite.programme_pdf) {
    window.open(activite.programme_pdf, '_blank')
  }
}

const viewRapport = (activite) => {
  if (activite.rapport_pdf) {
    window.open(activite.rapport_pdf, '_blank')
  }
}

// Fonctions utilitaires
const closeModals = () => {
  showAddActivite.value = false
  showEditActivite.value = false
  showViewModal.value = false
  currentActivite.value = null
  newActivite.value = {
    nom: '',
    description: '',
    type_activite: '',
    date_debut: '',
    date_fin: '',
    organe: '',
    nom_organe: '',
    lieu: '',
    pco_nom: '',
    pco_telephone: '',
    points_importants: '',
    programme_pdf: null,
    rapport_pdf: null
  }
}

const changePage = (page) => {
  if (page >= 1 && page <= pagination.value.last_page) {
    pagination.value.current_page = page
    loadActivites()
  }
}

// Gestion des clics extérieurs pour fermer les dropdowns
const handleClickOutside = (event) => {
  if (!event.target.closest('.filter-dropdown-container')) {
    showOrganeDropdown.value = false
    showStatutDropdown.value = false
  }
}

// Fonctions pour les placeholders
const getOrganePlaceholder = (organe) => {
  switch(organe) {
    case 'Section':
      return 'ex: Section Informatique, Section Génie Civil...'
    case 'Sous-comité':
      return 'ex: Sous-comité Culture et Sport, Sous-comité Académique...'
    case 'Secrétariat régional':
      return 'ex: Secrétariat Régional Dakar, Secrétariat Régional Thiès...'
    default:
      return 'Nom de l\'organe'
  }
}

// Lifecycle hooks
onMounted(() => {
  loadActivites()
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.activites-page {
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

.search-icon {
  position: absolute;
  left: 12px;
  color: #9ca3af;
  font-size: 16px;
  z-index: 1;
}

.clear-search {
  position: absolute;
  right: 8px;
  background: none;
  border: none;
  font-size: 18px;
  color: #9ca3af;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
}

.clear-search:hover {
  background: #f3f4f6;
  color: #374151;
}

.filters-container {
  display: flex;
  gap: 12px;
}

.filter-dropdown-container {
  position: relative;
}

.filter-btn {
  padding: 10px 16px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: white;
  color: #374151;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  min-width: 140px;
  text-align: left;
}

.filter-btn:hover {
  border-color: #16a34a;
}

.filter-btn.active {
  border-color: #16a34a;
  background: #f0fdf4;
  color: #16a34a;
}

.filter-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  z-index: 10;
  margin-top: 4px;
}

.filter-option {
  padding: 10px 16px;
  cursor: pointer;
  font-size: 14px;
  color: #374151;
  transition: background-color 0.2s;
}

.filter-option:hover {
  background: #f9fafb;
}

.filter-option:first-child {
  border-radius: 6px 6px 0 0;
}

.filter-option:last-child {
  border-radius: 0 0 6px 6px;
}

.add-btn {
  background: #16a34a;
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.add-btn:hover {
  background: #15803d;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: #6b7280;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #e5e7eb;
  border-top: 3px solid #16a34a;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-text {
  font-size: 16px;
  margin: 0;
}

.table-container {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th {
  background: #f9fafb;
  padding: 16px;
  text-align: left;
  font-weight: 600;
  color: #374151;
  font-size: 14px;
  border-bottom: 1px solid #e5e7eb;
}

.data-table td {
  padding: 16px;
  border-bottom: 1px solid #f3f4f6;
  font-size: 14px;
  color: #374151;
}

.table-row:hover {
  background: #f9fafb;
}

.name-cell {
  min-width: 200px;
}

.activite-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.activite-nom {
  font-weight: 600;
  color: #1f2937;
}

.activite-description {
  font-size: 12px;
  color: #6b7280;
  line-height: 1.4;
}

.date-cell {
  min-width: 150px;
}

.date-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.date-debut {
  font-weight: 500;
  color: #1f2937;
}

.date-fin {
  font-size: 12px;
  color: #6b7280;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
}

.status-badge.en-cours {
  background: #dbeafe;
  color: #1d4ed8;
}

.status-badge.terminee {
  background: #dcfce7;
  color: #16a34a;
}

.organe-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.organe-badge.section {
  background: #fef3c7;
  color: #d97706;
}

.organe-badge.sous-comite {
  background: #e0e7ff;
  color: #4338ca;
}

.organe-badge.secretariat {
  background: #fce7f3;
  color: #be185d;
}

.pco-cell {
  min-width: 150px;
}

.pco-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.pco-nom {
  font-weight: 500;
  color: #1f2937;
}

.pco-contact {
  font-size: 12px;
  color: #6b7280;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.action-btn {
  padding: 6px 8px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.action-btn.view {
  background: #dbeafe;
  color: #1d4ed8;
}

.action-btn.view:hover {
  background: #bfdbfe;
}

.action-btn.program {
  background: #fef3c7;
  color: #d97706;
}

.action-btn.program:hover {
  background: #fde68a;
}

.action-btn.report {
  background: #dcfce7;
  color: #16a34a;
}

.action-btn.report:hover {
  background: #bbf7d0;
}

.action-btn.edit {
  background: #fef3c7;
  color: #d97706;
}

.action-btn.edit:hover {
  background: #fde68a;
}

.action-btn.delete {
  background: #fee2e2;
  color: #dc2626;
}

.action-btn.delete:hover {
  background: #fecaca;
}

.no-results, .empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #6b7280;
}

.no-results-icon, .empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.no-results h3, .empty-state h3 {
  font-size: 18px;
  font-weight: 600;
  color: #374151;
  margin: 0 0 8px 0;
}

.no-results p, .empty-state p {
  font-size: 14px;
  margin: 0 0 20px 0;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  margin-top: 24px;
}

.pagination-btn {
  padding: 8px 16px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: white;
  color: #374151;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.pagination-btn:hover:not(:disabled) {
  border-color: #16a34a;
  color: #16a34a;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-info {
  font-size: 14px;
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
  padding: 20px;
}

.modal-content {
  background: white;
  border-radius: 8px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-content.large {
  max-width: 800px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  color: #6b7280;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
}

.close-btn:hover {
  background: #f3f4f6;
  color: #374151;
}

.modal-form {
  padding: 24px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 16px;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 6px;
}

.form-input, .form-select, .form-textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  color: #374151;
  transition: border-color 0.2s;
}

.form-input:focus, .form-select:focus, .form-textarea:focus {
  outline: none;
  border-color: #16a34a;
  box-shadow: 0 0 0 3px rgba(22, 163, 74, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

.form-file {
  width: 100%;
  padding: 8px 0;
  font-size: 14px;
  color: #374151;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid #e5e7eb;
}

.cancel-btn {
  padding: 10px 20px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: white;
  color: #374151;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.cancel-btn:hover {
  background: #f9fafb;
}

.save-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  background: #16a34a;
  color: white;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.save-btn:hover {
  background: #15803d;
}

.activite-details {
  padding: 24px;
}

.detail-section {
  margin-bottom: 24px;
}

.detail-section h4 {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 12px 0;
  padding-bottom: 8px;
  border-bottom: 1px solid #e5e7eb;
}

.detail-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.detail-item label {
  font-size: 12px;
  font-weight: 500;
  color: #6b7280;
  text-transform: uppercase;
}

.detail-item span {
  font-size: 14px;
  color: #374151;
}

.description-text, .points-text {
  font-size: 14px;
  color: #374151;
  line-height: 1.6;
  margin: 0;
  white-space: pre-wrap;
}

.documents-grid {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.document-btn {
  padding: 12px 16px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.document-btn.programme {
  background: #fef3c7;
  color: #d97706;
}

.document-btn.programme:hover {
  background: #fde68a;
}

.document-btn.rapport {
  background: #dcfce7;
  color: #16a34a;
}

.document-btn.rapport:hover {
  background: #bbf7d0;
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }

  .header-stats {
    width: 100%;
    justify-content: space-between;
  }

  .content-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .header-actions {
    width: 100%;
    flex-direction: column;
  }

  .search-input {
    width: 100%;
  }

  .filters-container {
    width: 100%;
  }

  .filter-btn {
    flex: 1;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .detail-grid {
    grid-template-columns: 1fr;
  }

  .data-table {
    font-size: 12px;
  }

  .data-table th,
  .data-table td {
    padding: 8px;
  }
}
</style>
