<template>
  <div class="organes-page">
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">🏛️ Gestion des Organes</h1><br/>
        <p class="page-subtitle">Administration des Secrétariats régionaux, Sous-comités et Sections</p>
      </div>
      <div class="header-stats">
        <div class="stat-card">
          <div class="stat-number">{{ secretariats.length }}</div>
          <div class="stat-label">Secrétariats</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">{{ sousComites.length }}</div>
          <div class="stat-label">Sous-comités</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">{{ sections.length }}</div>
          <div class="stat-label">Sections</div>
        </div>
      </div>
    </div>

    <div class="tabs-container">
      <div class="tabs">
        <button 
          class="tab-btn" 
          :class="{ active: activeTab === 'secretariats' }"
          @click="activeTab = 'secretariats'"
        >
          <span class="tab-icon">🏛️</span>
          <span>Secrétariats régionaux</span>
        </button>
        <button 
          class="tab-btn" 
          :class="{ active: activeTab === 'sous-comites' }"
          @click="activeTab = 'sous-comites'"
        >
          <span class="tab-icon">👥</span>
          <span>Sous-comités</span>
        </button>
        <button 
          class="tab-btn" 
          :class="{ active: activeTab === 'sections' }"
          @click="activeTab = 'sections'"
        >
          <span class="tab-icon">📋</span>
          <span>Sections</span>
        </button>
      </div>
    </div>

    <div class="content-container">

      <div v-if="activeTab === 'secretariats'" class="tab-content">
        <div class="content-header">
          <h2 class="content-title">Secrétariats régionaux</h2>
          <button class="add-btn" @click="showAddSecretariat = true">
            <span class="add-icon">+</span>
            <span>Nouveau Secrétariat</span>
          </button>
        </div>

        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Région</th>
                <th>Secrétaire Régional</th>
                <th>Email</th>
                <th>Contact</th>
                <th>Sous-comités</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="secretariat in secretariats" :key="secretariat.id" class="table-row">
                <td class="name-cell">
                  <div class="entity-info">
                    <div class="entity-avatar">{{ secretariat.nom_secretariat }}</div>
                    <span class="entity-name">{{ secretariat.nom_secretariat }}</span>
                  </div>
                </td>
                <td>{{ secretariat.region_secretariat }}</td>
                <td>👤 {{ secretariat.sr }}</td>
                <td class="email-cell"><span class="email-zone">{{ secretariat.email }}</span></td>
                <td>{{ secretariat.contact_sr }}</td>
                <td>
                  <span class="count-badge">{{ secretariat.id }}</span>
                </td>
                <td>
                  <span class="status-badge">
                    {{ secretariat.statut || 'Actif' }}
                  </span>
                </td>
                <td>
                  <div class="action-buttons">
                    <button class="action-btn view" @click="viewEntity(secretariat, 'secretariat')">
                      👁️
                    </button>
                    <button class="action-btn edit" @click="editorg(secretariat)">✏️</button>
                    <button class="action-btn delete" @click="deleteorg(secretariat)">🗑️</button>

                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div v-if="activeTab === 'sous-comites'" class="tab-content">
        <div class="content-header">
          <h2 class="content-title">Sous-comités</h2>
          <div class="header-actions">
            <select v-model="selectedSecretariat" class="filter-select">
              <option value="">Tous les secrétariats</option>
              <option v-for="sec in secretariats" :key="sec.id" :value="sec.id">
                {{ sec.nom }}
              </option>
            </select>
            <button class="add-btn" @click="showAddSousComite = true">
              <span class="add-icon">+</span>
              <span>Nouveau Sous-comité</span>
            </button>
          </div>
        </div>

        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Région</th>
                <th>Président</th>
                <th>Email</th>
                <th>Contact</th>
                <th>Sections</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="sousComite in filteredSousComites" :key="sousComite.id" class="table-row">
                <td class="name-cell">
                  <div class="entity-info">
                    <div class="entity-avatar">{{ sousComite.nom.charAt(0) }}</div>
                    <span class="entity-name">{{ sousComite.nom }}</span>
                  </div>
                </td>
                <td>{{ sousComite.region }}</td>
                <td>👤 {{ sousComite.president }}</td>
                <td class="email-cell">{{ sousComite.email }}</td>
                <td>{{ sousComite.contact }}</td>
                <td>
                  <span class="count-badge">{{ sousComite.sections }}</span>
                </td>
                <td>
                  <span class="status-badge" :class="sousComite.statut.toLowerCase()">
                    {{ sousComite.statut }}
                  </span>
                </td>
                <td>
                  <div class="action-buttons">
                    <button class="action-btn view" @click="viewEntity(sousComite, 'sous-comite')">
                      👁️
                    </button>
                    <button class="action-btn edit">✏️</button>
                    <button class="action-btn delete">🗑️</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div v-if="activeTab === 'sections'" class="tab-content">
        <div class="content-header">
          <h2 class="content-title">Sections</h2>
          <div class="header-actions">
            <select v-model="selectedSecretariatForSections" class="filter-select" @change="onSecretariatChange">
              <option value="">Tous les secrétariats</option>
              <option v-for="sec in secretariats" :key="sec.id" :value="sec.id">
                {{ sec.nom }}
              </option>
            </select>
            <select v-model="selectedSousComiteForSections" class="filter-select">
              <option value="">Tous les sous-comités</option>
              <option v-for="sc in availableSousComites" :key="sc.id" :value="sc.id">
                {{ sc.nom }}
              </option>
            </select>
            <button class="add-btn" @click="showAddSection = true">
              <span class="add-icon">+</span>
              <span>Nouvelle Section</span>
            </button>
          </div>
        </div>

        <div class="table-container">
          
          <table class="data-table">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Région</th>
                <th>Sous-comité</th>
                <th>Président</th>
                <th>Email</th>
                <th>Contact</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="section in filteredSections" :key="section.id" class="table-row">
                <td class="name-cell">
                  <div class="entity-info">
                    <div class="entity-avatar">{{ section.nom.charAt(0) }}</div>
                    <span class="entity-name">{{ section.nom }}</span>
                  </div>
                </td>
                <td>{{ section.region }}</td>
                <td>{{ section.sousComite }}</td>
                <td>👤 {{ section.president }}</td>
                <td class="email-cell">{{ section.email }}</td>
                <td>{{ section.contact }}</td>
                <td>
                  <span class="status-badge" :class="section.statut.toLowerCase()">
                    {{ section.statut }}
                  </span>
                </td>
                <td>
                  <div class="action-buttons">
                    <button class="action-btn view" @click="viewEntity(section, 'section')">
                      👁️
                    </button>
                    <button class="action-btn edit">✏️</button>
                    <button class="action-btn delete">🗑️</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          
        </div>
      </div>
    </div>
 
    <div v-if="showViewModal" class="modal-overlay" @click="closeModal">
      <div class="modal-container" @click.stop>
        <div class="modal-header">
          <h3 class="modal-title">{{ currentEntity.nom }}</h3>
          <button class="modal-close" @click="closeModal">×</button>
        </div>
        
        <div class="modal-content">
          <div class="modal-tabs">
            <button 
              class="modal-tab" 
              :class="{ active: activeModalTab === 'bureau' }"
              @click="activeModalTab = 'bureau'"
            >
              👥 Bureau
            </button>
            <button 
              class="modal-tab" 
              :class="{ active: activeModalTab === 'rapports' }"
              @click="activeModalTab = 'rapports'"
            >
              📊 Rapports
            </button>
            <button 
              class="modal-tab" 
              :class="{ active: activeModalTab === 'activites' }"
              @click="activeModalTab = 'activites'"
            >
              🎯 Activités
            </button>
          </div>

          <div class="modal-tab-content">
             
            <div v-if="activeModalTab === 'bureau'" class="bureau-content">
              <div class="mandat-selector">
                <label>Mandat :</label>
                <select v-model="selectedMandat">
                  <option v-for="mandat in currentEntity.mandats" :key="mandat.id" :value="mandat.id">
                    {{ mandat.periode }} ({{ mandat.duree }})
                  </option>
                </select>
              </div>
              
              <div class="membres-list">
                <div v-for="membre in getCurrentBureau()" :key="membre.id" class="membre-card">
                  <div class="membre-avatar">{{ membre.nom.charAt(0) }}</div>
                  <div class="membre-info">
                    <div class="membre-nom">{{ membre.nom }}</div>
                    <div class="membre-poste">{{ membre.poste }}</div>
                    <div class="membre-contact">{{ membre.email }}</div>
                  </div>
                </div>
              </div>
            </div>

            
            <div v-if="activeModalTab === 'rapports'" class="rapports-content">
              <div class="rapports-list">
                <div v-for="rapport in currentEntity.rapports" :key="rapport.id" class="rapport-card">
                  <div class="rapport-header">
                    <h4>{{ rapport.titre }}</h4>
                    <span class="rapport-date">{{ rapport.date }}</span>
                  </div>
                  <p class="rapport-description">{{ rapport.description }}</p>
                  <button class="rapport-download">📥 Télécharger</button>
                </div>
              </div>
            </div>

             
            <div v-if="activeModalTab === 'activites'" class="activites-content">
              <div class="activites-list">
                <div v-for="activite in currentEntity.activites" :key="activite.id" class="activite-card">
                  <div class="activite-header">
                    <h4>{{ activite.titre }}</h4>
                    <div class="activite-actions">
                      <span class="activite-date">{{ activite.date }}</span>
                      <button class="detail-btn" @click="viewActivityDetail(activite)">
                        👁️ Voir détail
                      </button>
                    </div>
                  </div>
                  <p class="activite-description">{{ activite.description }}</p>
                  <div class="activite-meta">
                    <span class="activite-participants">{{ activite.participants }} participants</span>
                    <span class="activite-statut" :class="activite.statut.toLowerCase()">
                      {{ activite.statut }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showAddSecretariat" class="modal-overlay" @click="showAddSecretariat = false">
      <div class="modal-container add-modal" @click.stop>
        <div class="modal-header">
          <h3 class="modal-title">Nouveau Secrétariat régional</h3>
          <button class="modal-close" @click="showAddSecretariat = false">×</button>
        </div>
        <div class="modal-content">
          <form class="add-form" @submit.prevent="addSecretariat">
            <div class="form-group">
              <label>Nom du secrétariat</label>
              <input type="text" v-model="newSecretariat.nom" required>
            </div>
            <div class="form-group">
              <label>Région</label>
              <input type="text" v-model="newSecretariat.region" required>
            </div>
            <div class="form-group">
              <label>Secrétaire régional</label>
              <input type="text" v-model="newSecretariat.secretaire" required>
            </div>
            <div class="form-group">
              <label>Email</label>
              <input type="email" v-model="newSecretariat.email" required>
            </div>
            <div class="form-group">
              <label>Contact</label>
              <input type="text" v-model="newSecretariat.contact" required>
            </div>
            <div class="form-actions">
              <button type="button" class="cancel-btn" @click="showAddSecretariat = false">
                Annuler
              </button>
              <button type="submit" class="submit-btn">
                Créer le secrétariat
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <div v-if="showAddSousComite" class="modal-overlay" @click="showAddSousComite = false">
      <div class="modal-container add-modal" @click.stop>
        <div class="modal-header">
          <h3 class="modal-title">Nouveau Sous-comité</h3>
          <button class="modal-close" @click="showAddSousComite = false">×</button>
        </div>
        <div class="modal-content">
          <form class="add-form" @submit.prevent="addSousComite">
            <div class="form-group">
              <label>Nom du sous-comité</label>
              <input type="text" v-model="newSousComite.nom" required>
            </div>
            <div class="form-group">
              <label>Secrétariat parent</label>
              <select v-model="newSousComite.secretariatId" required>
                <option value="">Sélectionner un secrétariat</option>
                <option v-for="sec in secretariats" :key="sec.id" :value="sec.id">
                  {{ sec.nom }}
                </option>
              </select>
            </div>
            <div class="form-group">
              <label>Président</label>
              <input type="text" v-model="newSousComite.president" required>
            </div>
            <div class="form-group">
              <label>Email</label>
              <input type="email" v-model="newSousComite.email" required>
            </div>
            <div class="form-group">
              <label>Contact</label>
              <input type="text" v-model="newSousComite.contact" required>
            </div>
            <div class="form-actions">
              <button type="button" class="cancel-btn" @click="showAddSousComite = false">
                Annuler
              </button>
              <button type="submit" class="submit-btn">
                Créer le sous-comité
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <div v-if="showAddSection" class="modal-overlay" @click="showAddSection = false">
      <div class="modal-container add-modal" @click.stop>
        <div class="modal-header">
          <h3 class="modal-title">Nouvelle Section</h3>
          <button class="modal-close" @click="showAddSection = false">×</button>
        </div>
        <div class="modal-content">
          <form class="add-form" @submit.prevent="addSection">
            <div class="form-group">
              <label>Nom de la section</label>
              <input type="text" v-model="newSection.nom" required>
            </div>
            <div class="form-group">
              <label>Sous-comité parent</label>
              <select v-model="newSection.sousComiteId" required>
                <option value="">Sélectionner un sous-comité</option>
                <option v-for="sc in sousComites" :key="sc.id" :value="sc.id">
                  {{ sc.nom }}
                </option>
              </select>
            </div>
            <div class="form-group">
              <label>Président</label>
              <input type="text" v-model="newSection.president" required>
            </div>
            <div class="form-group">
              <label>Email</label>
              <input type="email" v-model="newSection.email" required>
            </div>
            <div class="form-group">
              <label>Contact</label>
              <input type="text" v-model="newSection.contact" required>
            </div>
            <div class="form-actions">
              <button type="button" class="cancel-btn" @click="showAddSection = false">
                Annuler
              </button>
              <button type="submit" class="submit-btn">
                Créer la section
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    <!-- MODALE DE MODIFICATION -->
    <div v-if="showEditSecretariat" class="modal-overlay" @click="closeEditModal">
      <div class="modal-container add-modal" @click.stop>
        <div class="modal-header">
          <h3 class="modal-title">Modifier le Secrétariat</h3>
          <button class="modal-close" @click="closeEditModal">×</button>
        </div>
        <div class="modal-content">
          <form class="add-form" @submit.prevent="updateSecretariat">
            <div class="form-group">
              <label>Nom du secrétariat</label>
              <input type="text" v-model="editSecretariat.nom_secretariat" required>
            </div>
            <div class="form-group">
              <label>Région</label>
              <input type="text" v-model="editSecretariat.region_secretariat" required>
            </div>
            <div class="form-group">
              <label>Secrétaire régional</label>
              <input type="text" v-model="editSecretariat.sr" required>
            </div>
            <div class="form-group">
              <label>Email</label>
              <input type="email" v-model="editSecretariat.email" >
            </div>
            <div class="form-group">
              <label>Contact</label>
              <input type="text" v-model="editSecretariat.contact_sr" required>
            </div>
            <div class="form-actions">
              <button type="button" class="cancel-btn" @click="closeEditModal">
                Annuler
              </button>
              <button type="submit" class="submit-btn">
                Enregistrer les modifications
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    <!-- MODALE DE SUPPRESSION -->
    <div v-if="showDeleteConfirm" class="modal-overlay" @click="showDeleteConfirm = false">
      <div class="modal-container confirm-modal" @click.stop>
        <div class="modal-header">
          <h3 class="modal-title">Confirmation de suppression</h3>
          <button class="modal-close" @click="showDeleteConfirm = false">×</button>
        </div>
        <div class="modal-content">
          <p>Voulez-vous vraiment supprimer le secrétariat <strong>{{ secretariatToDelete.nom_secretariat }}</strong> ?</p>
          <div class="form-actions">
            <button class="cancel-btn" @click="showDeleteConfirm = false">Annuler</button>
            <button class="delete-btn" @click="confirmDelete">Supprimer</button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

// État réactif

const API_BASE_URL = 'https://sogetrag.com/apistage/mes_secretariats_api.php'
const ORGANES_API_URL = 'https://sogetrag.com/api/organes-api.php'
const activeTab = ref('secretariats')
const activeModalTab = ref('bureau')
const secretariats = ref([])
const showViewModal = ref(false)
const isLoading = ref(false)
const showAddSecretariat = ref(false)
const showAddSousComite = ref(false)
const showAddSection = ref(false)
const selectedSecretariat = ref('')
const selectedSousComite = ref('')
const selectedMandat = ref('')
const currentEntity = ref({})
const selectedSecretariatForSections = ref('')
const selectedSousComiteForSections = ref('')
const showEditSecretariat = ref(false);
const showDeleteConfirm = ref(false);
const editSecretariat = ref({});
const secretariatToDelete = ref(null);

// Formulaires
const newSecretariat = ref({
  nom: '',
  region: '',
  secretaire: '',
  email: '',
  contact: ''
})

const newSousComite = ref({
  nom: '',
  secretariatId: '',
  president: '',
  email: '',
  contact: ''
})

const newSection = ref({
  nom: '',
  sousComiteId: '',
  president: '',
  email: '',
  contact: ''
})

// Données mockées

const sousComites = ref([
  {
    id: 1,
    nom: 'Sous-comité Éducation Nord',
    region: 'Nord',
    secretariatId: 1,
    president: 'Ibrahim Sangaré',
    email: 'ibrahim.sangare@aeemci.org',
    contact: '+223 77 11 22 33',
    sections: 8,
    statut: 'Actif',
    mandats: [],
    rapports: [],
    activites: []
  },
  {
    id: 2,
    nom: 'Sous-comité Santé Sud',
    region: 'Sud',
    secretariatId: 2,
    president: 'Aïssata Coulibaly',
    email: 'aissata.coulibaly@aeemci.org',
    contact: '+223 66 44 55 77',
    sections: 4,
    statut: 'Actif',
    mandats: [],
    rapports: [],
    activites: []
  }
])

const sections = ref([
  {
    id: 1,
    nom: 'Section Bamako Centre',
    region: 'Nord',
    sousComite: 'Sous-comité Éducation Nord',
    sousComiteId: 1,
    president: 'Ousmane Dembélé',
    email: 'ousmane.dembele@aeemci.org',
    contact: '+223 78 99 00 11',
    statut: 'Actif',
    mandats: [],
    rapports: [],
    activites: []
  },
  {
    id: 2,
    nom: 'Section Sikasso',
    region: 'Sud',
    sousComite: 'Sous-comité Santé Sud',
    sousComiteId: 2,
    president: 'Salimata Keïta',
    email: 'salimata.keita@aeemci.org',
    contact: '+223 69 88 77 66',
    statut: 'Actif',
    mandats: [],
    rapports: [],
    activites: []
  }
])


const loadSecretariats = async () => {
  console.log('test loadSecretariats function called');
isLoading.value = true
try {
  console.log('🔍 Tentative de chargement des secrétariats...')

  const url = `${API_BASE_URL}?action=list&t=${Date.now()}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Accept': 'application/json'
    }
  })

  console.log('📊 Status de la réponse:', response.status)

  if (!response.ok) {
    throw new Error(`Erreur HTTP: ${response.status}`);

  }
  
  const data = await response.json()
  console.log('📦 Données brutes reçues:', data)

  if (Array.isArray(data)) {
    // Vider puis remplir
    secretariats.value = data.map(sec => ({
      id: sec.id,
      nom_secretariat: sec.nom_secretariat,
      sr: sec.sr || 'Non défini',
      contact_sr: sec.contact_sr || 'Non défini',
      region_secretariat: sec.region_secretariat || 'Non défini',
      created_at: sec.created_at || new Date().toISOString()
    }))

    console.log('✅ Secrétariats chargésd:', secretariats.value)
    secretariats.value.forEach((sec, index) => {
    })

    //addNotification(`${secretariats.value.length} secrétariat(s) chargé(s)`, 'success')
  } else {
    console.error('❌ Les données ne sont pas dans le format attendu:', data)
    //addNotification('Erreur: Format de données invalide', 'error')
  }
} catch (error) {
  console.error('❌ Erreur lors du chargement des secrétariats:', error)
  //addNotification('Erreur lors du chargement des secrétariats', 'error')
} finally {
  isLoading.value = false
  console.log('🏁 Chargement terminé, isLoading:', isLoading.value)
}
}

// Computed
const filteredSousComites = computed(() => {
  if (!selectedSecretariat.value) return sousComites.value
  return sousComites.value.filter(sc => sc.secretariatId == selectedSecretariat.value)
})

const availableSousComites = computed(() => {
  if (!selectedSecretariatForSections.value) return sousComites.value
  return sousComites.value.filter(sc => sc.secretariatId == selectedSecretariatForSections.value)
})

const filteredSections = computed(() => {
  let filtered = sections.value
  
  if (selectedSousComiteForSections.value) {
    filtered = filtered.filter(s => s.sousComiteId == selectedSousComiteForSections.value)
  } else if (selectedSecretariatForSections.value) {
    const secretariatSousComites = sousComites.value
      .filter(sc => sc.secretariatId == selectedSecretariatForSections.value)
      .map(sc => sc.id)
    filtered = filtered.filter(s => secretariatSousComites.includes(s.sousComiteId))
  }
  
  return filtered
})

// Méthodes
const viewEntity = (entity, type) => {
  currentEntity.value = entity
  selectedMandat.value = entity.mandats?.[0]?.id || ''
  showViewModal.value = true
  activeModalTab.value = 'bureau'
}

const closeModal = () => {
  showViewModal.value = false
  currentEntity.value = {}
}

const getCurrentBureau = () => {
  const mandat = currentEntity.value.mandats?.find(m => m.id == selectedMandat.value)
  return mandat?.bureau || []
}

const viewActivityDetail = (activite) => {
  alert(`Détails de l'activité: ${activite.titre}\n\nDate: ${activite.date}\nParticipants: ${activite.participants}\nStatut: ${activite.statut}\n\nDescription: ${activite.description}`)
}

const addSecretariat = () => {
  const newId = Math.max(...secretariats.value.map(s => s.id)) + 1
  secretariats.value.push({
    id: newId,
    ...newSecretariat.value,
    sousComites: 0,
    statut: 'Actif',
    mandats: [],
    rapports: [],
    activites: []
  })
  newSecretariat.value = { nom: '', region: '', secretaire: '', email: '', contact: '' }
  showAddSecretariat.value = false
}

const addSousComite = () => {
  const secretariat = secretariats.value.find(s => s.id == newSousComite.value.secretariatId)
  const newId = Math.max(...sousComites.value.map(s => s.id)) + 1
  sousComites.value.push({
    id: newId,
    ...newSousComite.value,
    region: secretariat.region,
    sections: 0,
    statut: 'Actif',
    mandats: [],
    rapports: [],
    activites: []
  })
  newSousComite.value = { nom: '', secretariatId: '', president: '', email: '', contact: '' }
  showAddSousComite.value = false
}

const addSection = () => {
  const sousComite = sousComites.value.find(sc => sc.id == newSection.value.sousComiteId)
  const newId = Math.max(...sections.value.map(s => s.id)) + 1
  sections.value.push({
    id: newId,
    ...newSection.value,
    region: sousComite.region,
    sousComite: sousComite.nom,
    statut: 'Actif',
    mandats: [],
    rapports: [],
    activites: []
  })
  newSection.value = { nom: '', sousComiteId: '', president: '', email: '', contact: '' }
  showAddSection.value = false
}

const onSecretariatChange = () => {
  selectedSousComiteForSections.value = ''
}

// 👉 Quand on clique sur ✏️
const editorg = (secretariat) => {
  editSecretariat.value = { ...secretariat }; // Copie des données
  showEditSecretariat.value = true;
};

// 👉 Quand on clique sur 🗑️
const deleteorg = (secretariat) => {
  secretariatToDelete.value = secretariat;
  showDeleteConfirm.value = true;
};

// 👉 Fermer la modale d’édition
const closeEditModal = () => {
  showEditSecretariat.value = false;
  editSecretariat.value = {};
};

// 👉 Confirmer la suppression
const confirmDelete = async () => {
  try {
    const response = await fetch(`${ORGANES_API_URL}?=delete_secretariat&id=${secretariatToDelete.value.id_secretariat}`);
    const data = await response.json();

    if (data.success) {
      secretariats.value = secretariats.value.filter(
        s => s.id_secretariat !== secretariatToDelete.value.id_secretariat
      );
      alert("Secrétariat supprimé !");
    } else {
      alert("Erreur : " + data.error);
    }
  } catch (e) {
    console.error(e);
    alert("Erreur lors de la suppression.");
  } finally {
    showDeleteConfirm.value = false;
  }
};

// 👉 Mettre à jour un secrétariat
const updateSecretariat = async () => {
  try {
    
    // CORRECT — action propre + param t séparé
    const url = `${ORGANES_API_URL}?action=update_secretariat&t=${Date.now()}`;
    const response = await fetch(url, {
      method: "PUT",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: editSecretariat.value.id_secretariat,
        nom_secretariat: editSecretariat.value.nom_secretariat,
        region: editSecretariat.value.region,
        sr: editSecretariat.value.responsable_nom,
        email: editSecretariat.value.email,
        contact: editSecretariat.value.responsable_contact
      }),
    });


    const data = await response.json();

    if (data.success) {
      // Met à jour localement
      const index = secretariats.value.findIndex(
        s => s.id_secretariat === editSecretariat.value.id_secretariat
      );
      if (index !== -1) {
        secretariats.value[index] = { ...editSecretariat.value };
      }
      alert("Mise à jour réussie !");
      closeEditModal();
    } else {
      alert("Erreur : " + data.error);
    }
  } catch (e) {
    console.error(e);
    alert("Erreur lors de la mise à jour.");
  }
};


onMounted(async () => {
await loadSecretariats()
})
</script>

<style scoped>
.organes-page {
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

.tabs-container {
  background: white;
  border-bottom: 1px solid #e5e7eb;
  padding: 0 32px;
}

.tabs {
  display: flex;
  gap: 0;
}

.tab-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px 20px;
  border: none;
  background: transparent;
  color: #6b7280;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all 0.2s;
}

.tab-btn:hover {
  color: #374151;
  background: #f9fafb;
}

.tab-btn.active {
  color: #16a34a;
  border-bottom-color: #16a34a;
  background: #eff6ff;
}

.tab-icon {
  font-size: 16px;
}

.content-container {
  padding: 32px;
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.content-title {
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.filter-select {
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  background: white;
  color: #374151;
  min-width: 200px;
}

.add-btn {
  display: flex;
  align-items: center;
  gap: 8px;
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

.add-btn:hover {
  background: #1d4ed8;
}

.add-icon {
  font-size: 16px;
}

.table-container {
  background: white;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  overflow: hidden;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th {
  background: #f9fafb;
  padding: 12px 16px;
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

.name-cell {
  min-width: 200px;
}

.entity-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.entity-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: #16a34a;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
}

.entity-name {
  font-weight: 500;
  color: #1f2937;
}

.email-cell {
  color: #6b7280;
  font-size: 13px;
}

.email-zone {
  padding: 8px;
  background-color: #cddfb1;
  border-radius: 10px;
}

.count-badge {
  background: #eff6ff;
  color: #16a34a;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
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

/* Modales */
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
  max-width: 500px;
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
  transition: all 0.2s;
}

.modal-close:hover {
  background: #f3f4f6;
  color: #374151;
}

.modal-content {
  flex: 1;
  overflow-y: auto;
  max-width: 100%;
  display: contents;
}

.modal-tabs {
  display: flex;
  border-bottom: 1px solid #e5e7eb;
  padding: 0 24px;
}

.modal-tab {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border: none;
  background: transparent;
  color: #6b7280;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all 0.2s;
}

.modal-tab:hover {
  color: #374151;
}

.modal-tab.active {
  color: #16a34a;
  border-bottom-color: #16a34a;
}

.modal-tab-content {
  padding: 24px;
}

.mandat-selector {
  margin-bottom: 20px;
}

.mandat-selector label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 8px;
}

.mandat-selector select {
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  background: white;
  color: #374151;
  min-width: 200px;
}

.membres-list {
  display: grid;
  gap: 16px;
}

.membre-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: #f9fafb;
  border-radius: 8px;
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
  font-size: 16px;
}

.membre-nom {
  font-weight: 500;
  color: #1f2937;
  margin-bottom: 2px;
}

.membre-poste {
  font-size: 13px;
  color: #6b7280;
  margin-bottom: 2px;
}

.membre-contact {
  font-size: 12px;
  color: #9ca3af;
}

.rapports-list, .activites-list {
  display: grid;
  gap: 16px;
}

.rapport-card, .activite-card {
  padding: 16px;
  background: #f9fafb;
  border-radius: 8px;
}

.rapport-header, .activite-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
}

.rapport-header h4, .activite-header h4 {
  font-size: 16px;
  font-weight: 500;
  color: #1f2937;
  margin: 0;
}

.rapport-date, .activite-date {
  font-size: 12px;
  color: #6b7280;
}

.activite-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.detail-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  background: #16a34a;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.detail-btn:hover {
  background: #1d4ed8;
}

.rapport-description, .activite-description {
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 12px;
}

.rapport-download {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: #f3f4f6;
  color: #374151;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.rapport-download:hover {
  background: #e5e7eb;
}

.activite-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.activite-participants {
  font-size: 12px;
  color: #6b7280;
}

.activite-statut {
  padding: 2px 6px;
  border-radius: 8px;
  font-size: 11px;
  font-weight: 500;
}

.activite-statut.terminé {
  background: #dcfce7;
  color: #166534;
}

.activite-statut.en-cours {
  background: #fef3c7;
  color: #d97706;
}

/* Formulaires */
.add-form {
  padding: 24px;
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
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
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
  background: #1d4ed8;
}
</style>
