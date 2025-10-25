<template>
  <div class="actualites-container">
    <!-- Header Section -->
    <div class="header-section">
      <div class="header-content">
        <div class="title-section">
          <div class="title-icon">📰</div>
          <div class="title-text">
            <h1>Gestion des Actualités</h1>
            <p>Administration des actualités de l'AEEMCI</p>
          </div>
        </div>
        
        <!-- Summary Cards -->
        <div class="summary-cards">
          <div class="summary-card">
            <div class="card-number">{{ actualites.length }}</div>
            <div class="card-label">ACTUALITÉS</div>
          </div>
          <div class="summary-card">
            <div class="card-number">{{ actualitesPubliees }}</div>
            <div class="card-label">PUBLIÉES</div>
          </div>
          <div class="summary-card">
            <div class="card-number">{{ actualitesBrouillon }}</div>
            <div class="card-label">BROUILLONS</div>
          </div>
          <div class="summary-card">
            <div class="card-number">{{ totalPhotos }}</div>
            <div class="card-label">PHOTOS</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Action Bar -->
    <div class="action-bar">
      <div class="action-title">
        <h2>Liste des Actualités</h2>
      </div>
      <div class="action-buttons">
        <button class="action-btn secondary" @click="showRapport = true">
          <span class="btn-icon">📈</span>
          Rapport par période
        </button>
        <button class="action-btn primary" @click="openCreateForm">
          <span class="btn-icon">+</span>
          Nouvelle actualité
        </button>
      </div>
    </div>

    <!-- Filters and Search -->
    <div class="filters-section">
      <div class="search-container">
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="Rechercher une actualité..." 
          class="search-input"
        />
      </div>
      <div class="filter-controls">
        <div class="filter-group">
          <label>Type :</label>
          <select v-model="selectedType" class="filter-select">
            <option value="all">Tous les types</option>
            <option value="ÉVÉNEMENT">Événement</option>
            <option value="FORMATION">Formation</option>
            <option value="SÉMINAIRE">Séminaire</option>
            <option value="CONFÉRENCE">Conférence</option>
            <option value="RÉUNION">Réunion</option>
          </select>
        </div>
        
        <div class="filter-group">
          <label>Statut :</label>
          <select v-model="selectedStatus" class="filter-select">
            <option value="all">Tous les états</option>
            <option value="PUBLIÉE">Publiée</option>
            <option value="BROUILLON">Brouillon</option>
            <option value="ARCHIVÉE">Archivée</option>
          </select>
        </div>
        
        <div class="filter-actions">
          <button class="filter-btn reset" @click="resetFilters">
            <span class="btn-icon">🔄</span>
            Réinitialiser
          </button>
        </div>
      </div>
    </div>

    <!-- Actualités Table -->
    <div class="table-container">
      <h3>Table des actualités</h3>
      <div class="table-wrapper">
        <table class="actualites-table">
          <thead>
            <tr>
              <th>ACTUALITÉ</th>
              <th>TYPE</th>
              <th>DATE</th>
              <th>LIEU</th>
              <th>ÉTAT</th>
              <th>PHOTOS</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="isLoading" class="loading-row">
              <td colspan="7" class="loading-cell">
                <div class="loading-container">
                  <span class="loading-spinner"></span>
                  <span>Chargement des actualités...</span>
                </div>
              </td>
            </tr>
            <tr v-else-if="filteredActualites.length === 0" class="empty-row">
              <td colspan="7" class="empty-cell">
                <div class="empty-container">
                  <span>📰</span>
                  <span>Aucune actualité trouvée</span>
                </div>
              </td>
            </tr>
            <tr v-else v-for="actualite in filteredActualites" :key="actualite.id">
              <td class="actualite-cell">
                <div class="actualite-title">{{ actualite.titre }}</div>
              </td>
              <td>
                <span class="type-tag" :class="actualite.type.toLowerCase()">
                  {{ actualite.type }}
                </span>
              </td>
              <td>
                <div class="date-info">
                  <div class="date-range">{{ actualite.dateDebut }} - {{ actualite.dateFin }}</div>
                  <div class="date-specific">{{ actualite.dateSpecifique }}</div>
                </div>
              </td>
              <td class="lieu-cell">{{ actualite.lieu }}</td>
              <td>
                <span class="status-tag" :class="actualite.statut.toLowerCase()">
                  {{ actualite.statut }}
                </span>
              </td>
              <td>
                <div class="photos-count">{{ actualite.photos.length }}/3</div>
              </td>
              <td>
                <div class="actions-grid">
                  <button class="action-icon view" @click="viewActualite(actualite)" title="Voir plus">
                    📖
                  </button>
                  <button class="action-icon copy" @click="copyActualite(actualite)" title="Copier">
                    📋
                  </button>
                  <button class="action-icon download" @click="downloadActualite(actualite)" title="Télécharger">
                    ⬇️
                  </button>
                  <button class="action-icon upload" @click="uploadPhotos(actualite)" title="Photos">
                    📤
                  </button>
                  <button class="action-icon edit" @click="editActualite(actualite)" title="Modifier">
                    ✏️
                  </button>
                  <button class="action-icon delete" @click="deleteActualite(actualite)" title="Supprimer">
                    🗑️
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal de création/modification d'actualité -->
    <div v-if="showCreateForm || showEditForm" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>{{ showCreateForm ? 'Nouvelle Actualité' : 'Modifier Actualité' }}</h2>
          <button class="close-btn" @click="closeModal">×</button>
        </div>
        
        <form @submit.prevent="saveActualite" class="actualite-form">
          <!-- Informations de base -->
          <div class="form-section">
            <h3>Informations de base</h3>
            <div class="form-row">
              <div class="form-group">
                <label for="titre">Titre de l'actualité *</label>
                <input 
                  type="text" 
                  id="titre" 
                  v-model="formData.titre" 
                  required 
                  placeholder="Ex: AEEMCI partenaire au FACFI"
                />
              </div>
              <div class="form-group">
                <label for="type">Type d'actualité *</label>
                <select id="type" v-model="formData.type" required>
                  <option value="">Sélectionner un type</option>
                  <option value="ÉVÉNEMENT">Événement</option>
                  <option value="FORMATION">Formation</option>
                  <option value="SÉMINAIRE">Séminaire</option>
                  <option value="PARTENARIAT">Partenariat</option>
                  <option value="AUTRE">Autre</option>
                </select>
              </div>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label for="dateDebut">Date de début *</label>
                <input 
                  type="date" 
                  id="dateDebut" 
                  v-model="formData.dateDebut" 
                  required
                />
              </div>
              <div class="form-group">
                <label for="dateFin">Date de fin</label>
                <input 
                  type="date" 
                  id="dateFin" 
                  v-model="formData.dateFin"
                />
              </div>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label for="dateSpecifique">Date spécifique (affichage)</label>
                <input 
                  type="text" 
                  id="dateSpecifique" 
                  v-model="formData.dateSpecifique" 
                  placeholder="Ex: 11 - 14 Septembre 2025"
                />
              </div>
              <div class="form-group">
                <label for="lieu">Lieu *</label>
                <input 
                  type="text" 
                  id="lieu" 
                  v-model="formData.lieu" 
                  required
                  placeholder="Ex: Dakar, Sénégal"
                />
              </div>
            </div>
          </div>

          <!-- Contenu -->
          <div class="form-section">
            <h3>Contenu</h3>
            <div class="form-group">
              <label for="texteAffichage">Texte d'affichage (résumé) *</label>
              <textarea 
                id="texteAffichage" 
                v-model="formData.texteAffichage" 
                required
                rows="4"
                placeholder="Texte d'affichage (court résumé) - sera utilisé sur la page de publication"
              ></textarea>
            </div>
            
            <div class="form-group">
              <label for="texteDetaille">Texte détaillé *</label>
              <div class="wysiwyg-container">
                <div class="wysiwyg-toolbar">
                  <button type="button" class="toolbar-btn" @click="execCommand('bold')" title="Gras">
                    <strong>B</strong>
                  </button>
                  <button type="button" class="toolbar-btn" @click="execCommand('italic')" title="Italique">
                    <em>I</em>
                  </button>
                  <button type="button" class="toolbar-btn" @click="execCommand('underline')" title="Souligné">
                    <u>U</u>
                  </button>
                  <div class="toolbar-separator"></div>
                  <button type="button" class="toolbar-btn" @click="execCommand('insertUnorderedList')" title="Liste à puces">
                    • Liste
                  </button>
                  <button type="button" class="toolbar-btn" @click="execCommand('insertOrderedList')" title="Liste numérotée">
                    1. Liste
                  </button>
                  <div class="toolbar-separator"></div>
                  <button type="button" class="toolbar-btn" @click="setAlignment('left')" title="Aligner à gauche">
                    ⬅
                  </button>
                  <button type="button" class="toolbar-btn" @click="setAlignment('center')" title="Centrer">
                    ⬆
                  </button>
                  <button type="button" class="toolbar-btn" @click="setAlignment('right')" title="Aligner à droite">
                    ➡
                  </button>
                  <div class="toolbar-separator"></div>
                  <button type="button" class="toolbar-btn" @click="insertLink" title="Insérer un lien">
                    🔗
                  </button>
                  <button type="button" class="toolbar-btn" @click="insertImage" title="Insérer une image">
                    🖼️
                  </button>
                </div>
                <iframe 
                  ref="wysiwygEditor"
                  class="wysiwyg-editor-iframe"
                  @load="initIframeEditor"
                ></iframe>
              </div>
            </div>
          </div>

          <!-- Photos -->
          <div class="form-section">
            <h3>Photos (maximum 3)</h3>
            <div class="photos-upload">
              <div class="upload-area" @click="triggerFileUpload" :class="{ 'has-files': formData.photos.length > 0 }">
                <div v-if="formData.photos.length === 0" class="upload-placeholder">
                  <span class="upload-icon">📷</span>
                  <p>Cliquez pour ajouter des photos</p>
                  <small>Maximum 3 photos</small>
                </div>
                <div v-else class="photos-preview">
                  <div v-for="(photo, index) in formData.photos" :key="index" class="photo-item">
                    <img :src="photo.preview" :alt="`Photo ${index + 1}`" />
                    <button type="button" class="remove-photo" @click="removePhoto(index)">×</button>
                  </div>
                  <div v-if="formData.photos.length < 3" class="add-more-photos" @click="triggerFileUpload">
                    <span>+</span>
                  </div>
                </div>
              </div>
              <input 
                ref="fileInput" 
                type="file" 
                multiple 
                accept="image/*" 
                @change="handleFileUpload" 
                style="display: none"
              />
            </div>
          </div>

          <!-- Statut -->
          <div class="form-section">
            <h3>Publication</h3>
            <div class="form-group">
              <label for="statut">Statut</label>
              <select id="statut" v-model="formData.statut">
                <option value="BROUILLON">Brouillon</option>
                <option value="PUBLIÉ">Publié</option>
                <option value="ARCHIVÉ">Archivé</option>
              </select>
            </div>
          </div>

          <!-- Actions -->
          <div class="form-actions">
            <button type="button" class="btn-secondary" @click="closeModal">Annuler</button>
            <button type="submit" class="btn-primary" :disabled="isPublishing">
              <span v-if="isPublishing" class="loading-spinner"></span>
              {{ isPublishing ? 'Publication...' : (showCreateForm ? 'Créer l\'actualité' : 'Modifier l\'actualité') }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal de visualisation -->
    <div v-if="showViewModal" class="modal-overlay" @click="showViewModal = false">
      <div class="modal-content view-modal" @click.stop>
        <div class="modal-header">
          <h2>{{ selectedActualite?.titre }}</h2>
          <button class="close-btn" @click="showViewModal = false">×</button>
        </div>
        <div class="view-content">
          <div class="view-info">
            <div class="info-item">
              <strong>Type:</strong> {{ selectedActualite?.type }}
            </div>
            <div class="info-item">
              <strong>Date:</strong> {{ selectedActualite?.dateSpecifique || `${selectedActualite?.dateDebut} - ${selectedActualite?.dateFin}` }}
            </div>
            <div class="info-item">
              <strong>Lieu:</strong> {{ selectedActualite?.lieu }}
            </div>
            <div class="info-item">
              <strong>Statut:</strong> {{ selectedActualite?.statut }}
            </div>
          </div>
          <div class="view-text">
            <h4>Texte d'affichage:</h4>
            <p>{{ selectedActualite?.texteAffichage }}</p>
            <h4>Texte détaillé:</h4>
            <div class="texte-detaille-content" dir="ltr" v-html="selectedActualite?.texteDetaille"></div>
          </div>
          <div v-if="selectedActualite?.photos?.length > 0" class="view-photos">
            <h4>Photos:</h4>
            <div class="photos-grid">
              <img v-for="(photo, index) in selectedActualite.photos" :key="index" :src="photo.preview" :alt="`Photo ${index + 1}`" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal de Suppression -->
  <div v-if="showDeleteModal" class="modal-overlay" @click="showDeleteModal = false">
    <div class="modal-content delete-modal" @click.stop>
      <div class="modal-header">
        <h2>Confirmer la suppression</h2>
        <button class="close-btn" @click="showDeleteModal = false">×</button>
      </div>
      <div class="delete-content">
        <div class="warning-icon">⚠️</div>
        <p>Êtes-vous sûr de vouloir supprimer cette actualité ?</p>
        <div class="actualite-preview">
          <strong>{{ selectedActualite?.titre }}</strong>
        </div>
        <p class="warning-text">Cette action est irréversible.</p>
      </div>
      <div class="modal-actions">
        <button class="btn btn-secondary" @click="showDeleteModal = false" :disabled="isDeleting">
          Annuler
        </button>
        <button class="btn btn-danger" @click="confirmDelete" :disabled="isDeleting">
          <span v-if="isDeleting" class="loading-spinner"></span>
          {{ isDeleting ? 'Suppression...' : 'Supprimer' }}
        </button>
      </div>
    </div>
  </div>


  <!-- Modal Rapport par Période -->
  <div v-if="showRapport" class="modal-overlay" @click="showRapport = false">
    <div class="modal-content rapport-modal" @click.stop>
      <div class="modal-header">
        <h2>Rapport par période</h2>
        <button class="close-btn" @click="showRapport = false">×</button>
      </div>
      <div class="rapport-content">
        <div class="date-selection">
          <div class="date-field">
            <label>DATE DE DÉBUT</label>
            <div class="date-input-container">
              <input 
                type="date" 
                v-model="rapportDateDebut" 
                class="date-input"
              />
              <span class="calendar-icon">📅</span>
            </div>
          </div>
          <div class="date-field">
            <label>DATE DE FIN</label>
            <div class="date-input-container">
              <input 
                type="date" 
                v-model="rapportDateFin" 
                class="date-input"
              />
              <span class="calendar-icon">📅</span>
            </div>
          </div>
        </div>
        <div class="rapport-actions">
          <button 
            class="btn-generate" 
            @click="genererRapport"
            :disabled="isGeneratingRapport"
          >
            <span v-if="isGeneratingRapport" class="loading-spinner"></span>
            {{ isGeneratingRapport ? 'Génération...' : 'Générer' }}
          </button>
        </div>
        
        <!-- Résultats du rapport -->
        <div v-if="rapportData" class="rapport-results">
          <div class="rapport-summary">
            <h3>Résumé de la période</h3>
            <div class="summary-cards">
              <div class="summary-card">
                <div class="card-number">{{ rapportData.total }}</div>
                <div class="card-label">Total actualités</div>
              </div>
              <div class="summary-card">
                <div class="card-number">{{ rapportData.publiees }}</div>
                <div class="card-label">Publiées</div>
              </div>
              <div class="summary-card">
                <div class="card-number">{{ rapportData.brouillons }}</div>
                <div class="card-label">Brouillons</div>
              </div>
            </div>
          </div>
          
          
          <!-- Liste des activités de la période -->
          <div class="rapport-activities">
            <h3>Activités de la période</h3>
            <div class="activities-list">
              <div v-if="rapportData.activities && rapportData.activities.length === 0" class="no-activities">
                <span>📰</span>
                <span>Aucune activité dans cette période</span>
              </div>
              <div v-else v-for="activity in rapportData.activities" :key="activity.id" class="activity-item">
                <div class="activity-header">
                  <div class="activity-title">{{ activity.titre }}</div>
                  <div class="activity-date">{{ formatDate(activity.dateDebut) }}</div>
                </div>
                <div class="activity-details">
                  <span class="activity-type">{{ activity.type }}</span>
                  <span class="activity-status" :class="activity.statut.toLowerCase()">{{ activity.statut }}</span>
                  <span class="activity-location">📍 {{ activity.lieu }}</span>
                </div>
                <div class="activity-description">{{ activity.texteAffichage }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Notifications -->
  <div class="notifications-container">
    <div 
      v-for="notification in notifications" 
      :key="notification.id"
      class="notification"
      :class="notification.type"
    >
      <span class="notification-icon">
        {{ notification.type === 'success' ? '✅' : '❌' }}
      </span>
      <span class="notification-message">{{ notification.message }}</span>
      <button class="notification-close" @click="removeNotification(notification.id)">×</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// Données réactives
const actualites = ref([])
const showCreateForm = ref(false)
const showEditForm = ref(false)
const showViewModal = ref(false)
const showRapport = ref(false)
const showDeleteModal = ref(false)
const searchQuery = ref('')
const selectedType = ref('all')
const selectedStatus = ref('all')
const selectedActualite = ref(null)
const fileInput = ref(null)
const wysiwygEditor = ref(null)

// États de chargement
const isLoading = ref(false)
const isDeleting = ref(false)
const isPublishing = ref(false)
const deletingId = ref(null)
const isGeneratingRapport = ref(false)

// Notifications
const notifications = ref([])


// Données pour le rapport
const rapportDateDebut = ref('')
const rapportDateFin = ref('')
const rapportData = ref(null)

// Formulaire
const formData = ref({
  titre: '',
  type: '',
  dateDebut: new Date().toISOString().split('T')[0], // Date actuelle par défaut
  dateFin: '',
  dateSpecifique: '',
  lieu: '',
  texteAffichage: '',
  texteDetaille: '',
  photos: [],
  statut: 'BROUILLON'
})

// Computed
const actualitesPubliees = computed(() => 
  actualites.value.filter(a => a.statut === 'PUBLIÉ').length
)

const actualitesBrouillon = computed(() => 
  actualites.value.filter(a => a.statut === 'BROUILLON').length
)

const totalPhotos = computed(() => 
  actualites.value.reduce((total, a) => total + a.photos.length, 0)
)

const filteredActualites = computed(() => {
  let filtered = actualites.value

  if (searchQuery.value) {
    filtered = filtered.filter(a => 
      a.titre.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      a.texteAffichage.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  if (selectedType.value !== 'all') {
    filtered = filtered.filter(a => a.type === selectedType.value)
  }

  if (selectedStatus.value !== 'all') {
    filtered = filtered.filter(a => a.statut === selectedStatus.value)
  }

  return filtered
})


// Méthodes
const closeModal = () => {
  showCreateForm.value = false
  showEditForm.value = false
  resetForm()
}

const resetFilters = () => {
  searchQuery.value = ''
  selectedType.value = 'all'
  selectedStatus.value = 'all'
}


const openCreateForm = () => {
  showCreateForm.value = true
  // Initialiser l'iframe après ouverture du modal
  setTimeout(() => {
    initIframeEditor()
  }, 100)
}

const resetForm = () => {
  formData.value = {
    titre: '',
    type: '',
    dateDebut: '',
    dateFin: '',
    dateSpecifique: '',
    lieu: '',
    texteAffichage: '',
    texteDetaille: '',
    photos: [],
    statut: 'BROUILLON'
  }
}

const triggerFileUpload = () => {
  fileInput.value.click()
}

const handleFileUpload = (event) => {
  const files = Array.from(event.target.files)
  const remainingSlots = 3 - formData.value.photos.length
  const filesToAdd = files.slice(0, remainingSlots)

  filesToAdd.forEach(file => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        formData.value.photos.push({
          file: file,
          preview: e.target.result
        })
      }
      reader.readAsDataURL(file)
    }
  })
}

const removePhoto = (index) => {
  formData.value.photos.splice(index, 1)
}

const saveActualite = async () => {
  isPublishing.value = true
  
  try {
    // Debug: afficher les données du formulaire
    console.log('Données du formulaire:', formData.value)
    
    // Valider les données
    const validation = actualiteUtils.validateActualiteData(formData.value)
    if (!validation.isValid) {
      console.log('Erreurs de validation:', validation.errors)
      showNotification('Erreurs de validation: ' + validation.errors.join(', '), 'error')
      return
    }

    // Formater les données
    const actualiteData = actualiteUtils.formatActualiteData(formData.value)
    console.log('Données formatées pour l\'API:', actualiteData)
    
    let result
    if (showEditForm.value) {
      result = await actualitesApi.updateActualite(formData.value.id, actualiteData)
    } else {
      result = await actualitesApi.createActualite(actualiteData)
    }
    
    if (result.success) {
      // Recharger la liste des actualités
      await loadActualites()
      closeModal()
      showNotification(showEditForm.value ? 'Actualité mise à jour avec succès' : 'Actualité créée avec succès', 'success')
    } else {
      showNotification('Erreur: ' + result.message, 'error')
    }
  } catch (error) {
    console.error('Erreur lors de la sauvegarde:', error)
    showNotification('Erreur lors de la sauvegarde: ' + error.message, 'error')
  } finally {
    isPublishing.value = false
  }
}

const viewActualite = (actualite) => {
  selectedActualite.value = actualite
  showViewModal.value = true
}

const editActualite = (actualite) => {
  // Mapper les données pour le formulaire
  formData.value = {
    id: actualite.id,
    titre: actualite.titre,
    type: actualite.type,
    dateDebut: actualite.dateDebut || actualite.date_debut,
    dateFin: actualite.dateFin || actualite.date_fin,
    dateSpecifique: actualite.dateSpecifique || actualite.date_specifique,
    lieu: actualite.lieu,
    texteAffichage: actualite.texteAffichage || actualite.texte_affichage,
    texteDetaille: actualite.texteDetaille || actualite.texte_detaille,
    statut: actualite.statut,
    photos: actualite.photos || []
  }
  showEditForm.value = true
  // Initialiser l'iframe après ouverture du modal
  setTimeout(() => {
    initIframeEditor()
  }, 100)
}

const copyActualite = async (actualite) => {
  try {
    const actualiteData = {
      titre: actualite.titre + ' (Copie)',
      type: actualite.type,
      date_debut: actualite.date_debut,
      date_fin: actualite.date_fin,
      date_specifique: actualite.date_specifique,
      lieu: actualite.lieu,
      texte_affichage: actualite.texte_affichage,
      texte_detaille: actualite.texte_detaille,
      statut: 'BROUILLON',
      photos: actualite.photos
    }
    
    const result = await actualitesApi.createActualite(actualiteData)
    
    if (result.success) {
      await loadActualites()
    } else {
      alert('Erreur lors de la copie: ' + result.message)
    }
  } catch (error) {
    console.error('Erreur lors de la copie:', error)
    alert('Erreur lors de la copie: ' + error.message)
  }
}

const deleteActualite = (actualite) => {
  selectedActualite.value = actualite
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  if (!selectedActualite.value) return
  
  isDeleting.value = true
  deletingId.value = selectedActualite.value.id
  
  try {
    console.log('Suppression de l\'actualité ID:', selectedActualite.value.id)
    const result = await actualitesApi.deleteActualite(selectedActualite.value.id)
    console.log('Résultat de suppression:', result)
    
    if (result.success) {
      // Supprimer immédiatement de la liste locale pour un feedback instantané
      const index = actualites.value.findIndex(a => a.id === selectedActualite.value.id)
      if (index > -1) {
        actualites.value.splice(index, 1)
        console.log('Supprimé de la liste locale, nouvelle taille:', actualites.value.length)
      }
      
      // Recharger depuis le serveur pour s'assurer de la cohérence
      await loadActualites()
      
      showNotification('Actualité supprimée avec succès', 'success')
      showDeleteModal.value = false
    } else {
      showNotification('Erreur lors de la suppression: ' + result.message, 'error')
    }
  } catch (error) {
    console.error('Erreur lors de la suppression:', error)
    showNotification('Erreur lors de la suppression: ' + error.message, 'error')
  } finally {
    isDeleting.value = false
    deletingId.value = null
  }
}

const downloadActualite = (actualite) => {
  // Implémentation du téléchargement
  console.log('Télécharger actualité:', actualite)
}

const uploadPhotos = (actualite) => {
  // Implémentation de l'upload de photos
  console.log('Upload photos pour:', actualite)
}

// Méthodes pour l'éditeur WYSIWYG avec iframe
let iframeDoc = null

const initIframeEditor = () => {
  if (wysiwygEditor.value) {
    iframeDoc = wysiwygEditor.value.contentDocument || wysiwygEditor.value.contentWindow.document
    
    // Créer le contenu HTML de base avec direction LTR forcée
    iframeDoc.open()
    iframeDoc.write(`
      <!DOCTYPE html>
      <html dir="ltr">
      <head>
        <meta charset="UTF-8">
        <style>
          body {
            margin: 0;
            padding: 12px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            font-size: 14px;
            line-height: 1.6;
            color: #374151;
            direction: ltr !important;
            text-align: left !important;
            min-height: 200px;
            outline: none;
          }
          body * {
            direction: ltr !important;
          }
          p { 
            margin: 0 0 8px 0; 
            text-align: left;
          }
          p[style*="text-align: center"] { text-align: center !important; }
          p[style*="text-align: right"] { text-align: right !important; }
          p[style*="text-align: left"] { text-align: left !important; }
          div { text-align: left; }
          div[style*="text-align: center"] { text-align: center !important; }
          div[style*="text-align: right"] { text-align: right !important; }
          div[style*="text-align: left"] { text-align: left !important; }
          ul, ol { margin: 8px 0; padding-left: 20px; }
          li { margin: 4px 0; }
          a { color: #2563eb; text-decoration: underline; }
          img { max-width: 100%; height: auto; border-radius: 4px; margin: 8px 0; }
          strong { font-weight: 600; }
          em { font-style: italic; }
          u { text-decoration: underline; }
        </style>
      </head>
      <body contenteditable="true" dir="ltr">
        ${formData.value.texteDetaille || ''}
      </body>
      </html>
    `)
    iframeDoc.close()
    
    // Ajouter les événements
    iframeDoc.body.addEventListener('input', updateTexteDetaille)
    iframeDoc.body.addEventListener('paste', handlePaste)
  }
}

const execCommand = (command, value = null) => {
  if (iframeDoc) {
    iframeDoc.execCommand(command, false, value)
    iframeDoc.body.focus()
  }
}

const updateTexteDetaille = () => {
  if (iframeDoc && iframeDoc.body) {
    formData.value.texteDetaille = iframeDoc.body.innerHTML
  }
}

const handlePaste = (event) => {
  event.preventDefault()
  const text = (event.clipboardData || window.clipboardData).getData('text/plain')
  if (iframeDoc) {
    iframeDoc.execCommand('insertText', false, text)
  }
}

const insertLink = () => {
  const url = prompt('Entrez l\'URL du lien:')
  if (url) {
    execCommand('createLink', url)
  }
}

const insertImage = () => {
  const url = prompt('Entrez l\'URL de l\'image:')
  if (url) {
    execCommand('insertImage', url)
  }
}

const setAlignment = (alignment) => {
  if (iframeDoc) {
    const selection = iframeDoc.getSelection()
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0)
      const container = range.commonAncestorContainer
      
      // Trouver l'élément de bloc le plus proche
      let element = container.nodeType === Node.TEXT_NODE ? container.parentElement : container
      while (element && !['P', 'DIV', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6'].includes(element.tagName)) {
        element = element.parentElement
      }
      
      if (element) {
        // Nettoyer les anciens styles d'alignement
        const currentStyle = element.getAttribute('style') || ''
        const cleanedStyle = currentStyle
          .replace(/text-align:\s*[^;]+;?/g, '')
          .replace(/;\s*$/, '')
        
        // Appliquer le nouvel alignement
        const newStyle = cleanedStyle + (cleanedStyle ? '; ' : '') + `text-align: ${alignment} !important;`
        element.setAttribute('style', newStyle)
        
        // Forcer la mise à jour visuelle
        element.style.textAlign = alignment
      } else {
        // Si pas d'élément de bloc, créer un paragraphe
        const p = iframeDoc.createElement('p')
        p.setAttribute('style', `text-align: ${alignment} !important;`)
        p.innerHTML = '<br>'
        range.insertNode(p)
        range.setStartAfter(p)
        range.setEndAfter(p)
        selection.removeAllRanges()
        selection.addRange(range)
      }
      
      // Mettre à jour le contenu
      updateTexteDetaille()
    }
  }
}

// Import du service API
import { actualitesApi, actualiteUtils } from '../../services/actualitesApi.js'

// Fonctions de notification
const showNotification = (message, type = 'success') => {
  const id = Date.now()
  notifications.value.push({ id, message, type })
  
  setTimeout(() => {
    removeNotification(id)
  }, 5000)
}

const removeNotification = (id) => {
  const index = notifications.value.findIndex(n => n.id === id)
  if (index > -1) {
    notifications.value.splice(index, 1)
  }
}

// Configuration API pour sogetrag.com
const API_BASE_URL = 'http://sogetrag.com'

// Fonctions API - Utiliser le service API
// Fonction pour mapper les données de l'API vers le format frontend
const mapApiDataToFrontend = (apiData) => {
  return apiData.map(actualite => ({
    ...actualite,
    // Mapping des champs snake_case vers camelCase pour l'affichage
    dateDebut: actualite.date_debut,
    dateFin: actualite.date_fin,
    dateSpecifique: actualite.date_specifique,
    texteAffichage: actualite.texte_affichage,
    texteDetaille: actualite.texte_detaille,
  }))
}

const loadActualites = async () => {
  isLoading.value = true
  try {
    const result = await actualitesApi.getActualites()
    if (result.success) {
      actualites.value = mapApiDataToFrontend(result.data)
      console.log('Actualités chargées:', actualites.value.map(a => ({ id: a.id, titre: a.titre })))
    } else {
      console.error('Erreur lors du chargement:', result.message)
      showNotification('Erreur lors du chargement: ' + result.message, 'error')
    }
  } catch (error) {
    console.error('Erreur réseau:', error)
    showNotification('Erreur réseau: ' + error.message, 'error')
  } finally {
    isLoading.value = false
  }
}

const loadStats = async () => {
  try {
    const result = await actualitesApi.getStats()
    if (result.success) {
      // Mettre à jour les statistiques si nécessaire
      console.log('Stats:', result.data)
    }
  } catch (error) {
    console.error('Erreur lors du chargement des stats:', error)
  }
}


// Fonctions pour le rapport
const genererRapport = async () => {
  if (!rapportDateDebut.value || !rapportDateFin.value) {
    showNotification('Veuillez sélectionner les dates de début et de fin', 'error')
    return
  }

  isGeneratingRapport.value = true
  try {
    // Charger toutes les actualités depuis la base de données
    const result = await actualitesApi.getActualites()
    if (result.success) {
      const allActualites = mapApiDataToFrontend(result.data)
      
      // Filtrer les actualités par période
      const actualitesPeriode = allActualites.filter(actualite => {
        const dateActualite = new Date(actualite.dateDebut)
        const dateDebut = new Date(rapportDateDebut.value)
        const dateFin = new Date(rapportDateFin.value)
        
        return dateActualite >= dateDebut && dateActualite <= dateFin
      })

      // Calculer les statistiques
      const total = actualitesPeriode.length
      const publiees = actualitesPeriode.filter(a => a.statut === 'PUBLIÉE').length
      const brouillons = actualitesPeriode.filter(a => a.statut === 'BROUILLON').length

      rapportData.value = {
        total,
        publiees,
        brouillons,
        activities: actualitesPeriode.sort((a, b) => new Date(b.dateDebut) - new Date(a.dateDebut))
      }

      console.log('Rapport généré:', rapportData.value)
      showNotification('Rapport généré avec succès', 'success')
    } else {
      showNotification('Erreur lors du chargement des données: ' + result.message, 'error')
    }
  } catch (error) {
    console.error('Erreur lors de la génération du rapport:', error)
    showNotification('Erreur lors de la génération du rapport', 'error')
  } finally {
    isGeneratingRapport.value = false
  }
}

const openRapport = () => {
  showRapport.value = true
  // Initialiser les dates par défaut (30 derniers jours)
  const today = new Date()
  const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)
  
  rapportDateDebut.value = thirtyDaysAgo.toISOString().split('T')[0]
  rapportDateFin.value = today.toISOString().split('T')[0]
  rapportData.value = null
}

// Fonction utilitaire pour formater les dates
const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

// Charger les données au montage
onMounted(() => {
  loadActualites()
  loadStats()
})
</script>

<style scoped>
.actualites-container {
  padding: 24px;
  background: #f8fafc;
  min-height: 100vh;
  position: relative;
}

/* Header Section */
.header-section {
  background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%);
  border-radius: 12px;
  padding: 32px;
  margin-bottom: 24px;
  box-shadow: 0 8px 32px rgba(25, 118, 210, 0.3);
  position: relative;
  z-index: 1;
  overflow: hidden;
}

.header-section::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -20%;
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
  border-radius: 50%;
}

.header-section::after {
  content: '';
  position: absolute;
  bottom: -30%;
  left: -10%;
  width: 150px;
  height: 150px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.08) 0%, transparent 70%);
  border-radius: 50%;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  position: relative;
  z-index: 2;
}

.title-section {
  display: flex;
  align-items: center;
  gap: 20px;
}

.title-icon {
  font-size: 28px;
  width: 56px;
  height: 56px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.title-text h1 {
  font-size: 32px;
  font-weight: 800;
  color: white;
  margin: 0 0 8px 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.title-text p {
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
  font-size: 16px;
  font-weight: 500;
}

.summary-cards {
  display: flex;
  gap: 20px;
  position: relative;
  z-index: 2;
}

.summary-card {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 24px;
  text-align: center;
  min-width: 160px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.summary-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
  border-radius: 16px;
}

.summary-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  background: rgba(255, 255, 255, 0.2);
}

.card-number {
  font-size: 36px;
  font-weight: 900;
  color: white;
  margin-bottom: 8px;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  position: relative;
  z-index: 1;
}

.card-label {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.9);
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 700;
  position: relative;
  z-index: 1;
}

/* Action Bar */
.action-bar {
  background: white;
  border-radius: 12px;
  padding: 20px 24px;
  margin-bottom: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  z-index: 1;
}

.action-title h2 {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.action-buttons {
  display: flex;
  gap: 16px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border-radius: 10px;
  border: none;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.action-btn.primary {
  background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%);
  color: white;
}

.action-btn.primary:hover {
  background: linear-gradient(135deg, #1565c0 0%, #0d47a1 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(25, 118, 210, 0.3);
}

.action-btn.secondary {
  background: white;
  color: #374151;
  border: 1px solid #e5e7eb;
}

.action-btn.secondary:hover {
  background: #f8fafc;
  border-color: #d1d5db;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.btn-icon {
  font-size: 16px;
}

/* Filters Section */
.filters-section {
  background: white;
  border-radius: 12px;
  padding: 20px 24px;
  margin-bottom: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  z-index: 1;
}

.search-container {
  flex: 1;
  max-width: 400px;
}

.search-input {
  width: 100%;
  padding: 10px 16px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
}

.search-input:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.filter-controls {
  display: flex;
  gap: 16px;
  align-items: end;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 120px;
}

.filter-group label {
  font-size: 11px;
  font-weight: 600;
  color: #374151;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.filter-select {
  padding: 8px 10px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 13px;
  background: white;
  cursor: pointer;
  transition: border-color 0.2s;
  min-width: 120px;
}

.filter-select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.filter-actions {
  display: flex;
  align-items: center;
}

.filter-btn {
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 4px;
}

.filter-btn:hover {
  background: #f9fafb;
  border-color: #9ca3af;
}

.filter-btn.reset {
  background: #f3f4f6;
  border-color: #d1d5db;
  color: #6b7280;
}

.filter-btn.reset:hover {
  background: #e5e7eb;
  border-color: #9ca3af;
}

.btn-icon {
  font-size: 11px;
}



/* Table */
.table-container {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 1;
}

.table-container h3 {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 16px 0;
}

.table-wrapper {
  overflow-x: auto;
}

.actualites-table {
  width: 100%;
  border-collapse: collapse;
}

.actualites-table th {
  background: #f8fafc;
  padding: 12px 16px;
  text-align: left;
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 1px solid #e5e7eb;
}

.actualites-table td {
  padding: 16px;
  border-bottom: 1px solid #f3f4f6;
  vertical-align: top;
}

.actualite-cell {
  max-width: 300px;
}

.actualite-title {
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 4px;
}

.actualite-description {
  font-size: 14px;
  color: #6b7280;
  line-height: 1.4;
}

.type-tag, .status-tag {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.type-tag {
  background: #eff6ff;
  color: #2563eb;
}

.status-tag.publié {
  background: #dcfce7;
  color: #16a34a;
}

.status-tag.brouillon {
  background: #fef3c7;
  color: #d97706;
}

.status-tag.archivé {
  background: #f3f4f6;
  color: #6b7280;
}

.date-info {
  font-size: 14px;
}

.date-range {
  font-weight: 500;
  color: #1f2937;
}

.date-specific {
  font-size: 12px;
  color: #6b7280;
}

.lieu-cell {
  font-size: 14px;
  color: #374151;
}

.photos-count {
  font-size: 14px;
  color: #6b7280;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 4px;
  width: 120px;
}

.action-icon {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 4px;
  background: #f3f4f6;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  transition: all 0.2s;
}

.action-icon:hover {
  background: #e5e7eb;
}

.action-icon.delete:hover {
  background: #fef2f2;
  color: #dc2626;
}

/* Modal */
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

.modal-content {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h2 {
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.close-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: #f3f4f6;
  border-radius: 6px;
  cursor: pointer;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  background: #e5e7eb;
}

/* Form */
.actualite-form {
  padding: 24px;
}

.form-section {
  margin-bottom: 32px;
}

.form-section h3 {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 16px 0;
  padding-bottom: 8px;
  border-bottom: 1px solid #e5e7eb;
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

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  transition: all 0.2s;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

/* Photos Upload */
.photos-upload {
  margin-top: 16px;
}

.upload-area {
  border: 2px dashed #d1d5db;
  border-radius: 8px;
  padding: 24px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
}

.upload-area:hover {
  border-color: #2563eb;
  background: #f8fafc;
}

.upload-area.has-files {
  border-style: solid;
  border-color: #10b981;
}

.upload-placeholder {
  color: #6b7280;
}

.upload-icon {
  font-size: 32px;
  display: block;
  margin-bottom: 8px;
}

.photos-preview {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.photo-item {
  position: relative;
  width: 100px;
  height: 100px;
  border-radius: 8px;
  overflow: hidden;
}

.photo-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.remove-photo {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 20px;
  height: 20px;
  border: none;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border-radius: 50%;
  cursor: pointer;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.add-more-photos {
  width: 100px;
  height: 100px;
  border: 2px dashed #d1d5db;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 24px;
  color: #6b7280;
}

.add-more-photos:hover {
  border-color: #2563eb;
  color: #2563eb;
}

/* Form Actions */
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 24px;
  border-top: 1px solid #e5e7eb;
}

.btn-primary, .btn-secondary {
  padding: 10px 20px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background: #2563eb;
  color: white;
  border: none;
}

.btn-primary:hover {
  background: #1d4ed8;
}

.btn-secondary {
  background: white;
  color: #374151;
  border: 1px solid #d1d5db;
}

.btn-secondary:hover {
  background: #f3f4f6;
}

/* WYSIWYG Editor */
.wysiwyg-container {
  border: 1px solid #d1d5db;
  border-radius: 6px;
  overflow: hidden;
}

.wysiwyg-toolbar {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 12px;
  background: #f8fafc;
  border-bottom: 1px solid #e5e7eb;
  flex-wrap: wrap;
}

.toolbar-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: 1px solid #d1d5db;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  transition: all 0.2s;
}

.toolbar-btn:hover {
  background: #f3f4f6;
  border-color: #9ca3af;
}

.toolbar-btn:active {
  background: #e5e7eb;
}

.toolbar-separator {
  width: 1px;
  height: 20px;
  background: #d1d5db;
  margin: 0 4px;
}

.wysiwyg-editor-iframe {
  width: 100%;
  min-height: 200px;
  border: none;
  background: white;
  border-radius: 0 0 6px 6px;
}


/* View Modal */
.view-modal {
  max-width: 600px;
}

.view-content {
  padding: 24px;
}

.view-info {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 24px;
  padding: 16px;
  background: #f8fafc;
  border-radius: 8px;
}

.info-item {
  font-size: 14px;
}

.info-item strong {
  color: #374151;
}

.view-text h4 {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin: 16px 0 8px 0;
}

.view-text p {
  font-size: 14px;
  color: #6b7280;
  line-height: 1.6;
  margin: 0 0 16px 0;
}

.texte-detaille-content {
  font-size: 14px;
  color: #6b7280;
  line-height: 1.6;
  margin: 0 0 16px 0;
  padding: 16px;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  direction: ltr !important;
  text-align: left !important;
  unicode-bidi: embed;
}

.texte-detaille-content p {
  margin: 0 0 8px 0;
  direction: ltr;
  text-align: left;
}

.texte-detaille-content ul, .texte-detaille-content ol {
  margin: 8px 0;
  padding-left: 20px;
  direction: ltr;
  text-align: left;
}

.texte-detaille-content li {
  margin: 4px 0;
  direction: ltr;
  text-align: left;
}

.texte-detaille-content a {
  color: #2563eb;
  text-decoration: underline;
}

.texte-detaille-content a:hover {
  color: #1d4ed8;
}

.texte-detaille-content img {
  max-width: 100%;
  height: auto;
  border-radius: 4px;
  margin: 8px 0;
}

.texte-detaille-content strong {
  font-weight: 600;
}

.texte-detaille-content em {
  font-style: italic;
}

.texte-detaille-content u {
  text-decoration: underline;
}

/* Forcer LTR sur tous les éléments du contenu détaillé */
.texte-detaille-content * {
  direction: ltr !important;
  text-align: left !important;
  unicode-bidi: embed !important;
}

.view-photos {
  margin-top: 24px;
}

.photos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 12px;
  margin-top: 12px;
}

.photos-grid img {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 8px;
}

/* Modal de Suppression */
.delete-modal {
  max-width: 500px;
}

.delete-content {
  text-align: center;
  padding: 20px 0;
}

.warning-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.actualite-preview {
  background: #f8f9fa;
  padding: 12px;
  border-radius: 8px;
  margin: 16px 0;
  border-left: 4px solid #dc3545;
}

.warning-text {
  color: #dc3545;
  font-weight: 500;
  margin-top: 16px;
}

.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
}

.btn-danger {
  background: #dc3545;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-danger:hover:not(:disabled) {
  background: #c82333;
}

.btn-danger:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  background: #6c757d;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
}

.btn-secondary:hover:not(:disabled) {
  background: #5a6268;
}

/* Notifications */
.notifications-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 10000;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.notification {
  background: white;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 300px;
  animation: slideIn 0.3s ease-out;
  border-left: 4px solid #28a745;
}

.notification.error {
  border-left-color: #dc3545;
}

.notification-icon {
  font-size: 20px;
}

.notification-message {
  flex: 1;
  font-weight: 500;
}

.notification-close {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: #6c757d;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.notification-close:hover {
  color: #dc3545;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* Icônes de chargement */
.loading-spinner {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid #f3f3f3;
  border-top: 2px solid #007bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 40px;
  color: #6c757d;
}

.loading-cell {
  text-align: center;
}

.empty-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 40px;
  color: #6c757d;
}

.empty-cell {
  text-align: center;
}


/* Modal Rapport */
.rapport-modal {
  max-width: 600px;
}

.rapport-content {
  padding: 20px 0;
}

.date-selection {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 30px;
}

.date-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.date-field label {
  font-weight: 600;
  color: #374151;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.date-input-container {
  position: relative;
  display: flex;
  align-items: center;
}

.date-input {
  width: 100%;
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  background: #f9fafb;
}

.calendar-icon {
  position: absolute;
  right: 12px;
  font-size: 16px;
  color: #6b7280;
  pointer-events: none;
}

.rapport-actions {
  margin-bottom: 30px;
}

.btn-generate {
  background: #1f2937;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background 0.2s;
}

.btn-generate:hover:not(:disabled) {
  background: #111827;
}

.btn-generate:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.rapport-results {
  border-top: 1px solid #e5e7eb;
  padding-top: 20px;
}

.rapport-summary h3,
.rapport-details h3 {
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 600;
  color: #374151;
}

.rapport-summary .summary-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 24px;
}

.rapport-summary .summary-card {
  background: linear-gradient(135deg, #e0f2fe 0%, #b3e5fc 100%);
  border: 1px solid #81d4fa;
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.rapport-summary .summary-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #2196f3, #21cbf3);
}

.rapport-summary .summary-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
}

.rapport-summary .card-number {
  font-size: 28px;
  font-weight: 800;
  color: #1976d2;
  margin-bottom: 8px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.rapport-summary .card-label {
  font-size: 12px;
  color: #1565c0;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  font-weight: 600;
}


/* Liste des activités dans le rapport */
.rapport-activities {
  margin-top: 24px;
  border-top: 1px solid #e5e7eb;
  padding-top: 20px;
}

.rapport-activities h3 {
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 600;
  color: #374151;
}

.activities-list {
  max-height: 400px;
  overflow-y: auto;
}

.no-activities {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 40px;
  color: #6b7280;
  font-style: italic;
}

.activity-item {
  background: #f8fafc;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
  transition: all 0.2s;
}

.activity-item:hover {
  background: #f1f5f9;
  border-color: #cbd5e1;
}

.activity-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
}

.activity-title {
  font-weight: 600;
  color: #1f2937;
  font-size: 14px;
  flex: 1;
}

.activity-date {
  font-size: 12px;
  color: #6b7280;
  background: #e5e7eb;
  padding: 4px 8px;
  border-radius: 4px;
}

.activity-details {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
  flex-wrap: wrap;
}

.activity-type {
  background: #dbeafe;
  color: #1e40af;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 500;
}

.activity-status {
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 500;
}

.activity-status.publiée {
  background: #dcfce7;
  color: #166534;
}

.activity-status.brouillon {
  background: #fef3c7;
  color: #92400e;
}

.activity-location {
  font-size: 11px;
  color: #6b7280;
  display: flex;
  align-items: center;
  gap: 4px;
}

.activity-description {
  font-size: 12px;
  color: #4b5563;
  line-height: 1.4;
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid #e5e7eb;
}

/* Responsive */
@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 16px;
  }
  
  .summary-cards {
    flex-wrap: wrap;
  }
  
  .action-bar {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }
  
  .action-buttons {
    justify-content: center;
  }
  
  .filters-section {
    flex-direction: column;
    gap: 16px;
  }
  
  .filter-controls {
    flex-wrap: wrap;
    gap: 12px;
  }
  
  .filter-group {
    min-width: 100px;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .view-info {
    grid-template-columns: 1fr;
  }
  
  .notifications-container {
    right: 10px;
    left: 10px;
  }
  
  .notification {
    min-width: auto;
  }
  
  
  .date-selection {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .rapport-summary .summary-cards {
    grid-template-columns: 1fr;
  }
}
</style>
