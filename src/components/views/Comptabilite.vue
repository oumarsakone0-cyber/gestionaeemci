<template>
  <div class="compta-wrapper">
    <div class="compta-container">
      <div class="compta-header animate-slide">
        <h1>Comptabilité AEEMCI</h1>
        <p>Suivi des finances de l'Association des Étudiants et Élèves Maliens de Côte d'Ivoire</p>
      </div>

      <!-- Statistiques -->
      <div class="stat-cards">
        <div class="card card-gradient animate-pop">
          <p class="label">Total des Recettes</p>
          <h2>{{ formatCurrency(totalRecettes) }}</h2>
          <div class="stat-trend positive">
            <TrendingUpIcon class="trend-icon" />
            +12.5% ce mois
          </div>
        </div>
        <div class="card card-glass animate-pop-delay-1">
          <p class="label">Total des Dépenses</p>
          <h2>{{ formatCurrency(totalDepenses) }}</h2>
          <div class="stat-trend negative">
            <TrendingDownIcon class="trend-icon" />
            +8.3% ce mois
          </div>
        </div>
        <div class="card card-glass animate-pop-delay-2">
          <p class="label">Solde en Caisse</p>
          <h2>{{ formatCurrency(soldeCaisse) }}</h2>
          <div class="stat-progress">
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: '75%' }"></div>
            </div>
          </div>
        </div>
        <div class="card card-glass animate-pop-delay-3">
          <p class="label">Solde en Banque</p>
          <h2>{{ formatCurrency(soldeBanque) }}</h2>
          <div class="stat-progress">
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: '60%' }"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Graphiques de synthèse -->
      <div class="charts-section">
        <div class="chart-card">
          <h3>Évolution mensuelle</h3>
          <div class="chart-container">
            <canvas ref="monthlyChart" class="chart-canvas"></canvas>
          </div>
        </div>
        <div class="chart-card">
          <h3>Répartition par source</h3>
          <div class="chart-container">
            <canvas ref="sourceChart" class="chart-canvas"></canvas>
          </div>
        </div>
      </div>

      <!-- Actions Globales -->
      <div class="global-actions">
        <button class="action-button primary" @click="openTransferDialog">
          <ArrowRightLeftIcon class="button-icon" />
          Transférer des fonds
        </button>
        <button class="action-button secondary" @click="generateReport">
          <FileTextIcon class="button-icon" />
          Générer rapport
        </button>
        <button class="action-button secondary" @click="exportData">
          <DownloadIcon class="button-icon" />
          Exporter données
        </button>
      </div>

      <!-- Filtres et actions -->
      <div class="table-actions">
        <div class="search-container">
          <SearchIcon class="search-icon" />
          <input 
            type="text" 
            placeholder="Rechercher un mouvement..." 
            class="search-input"
            v-model="searchTerm"
            @input="filterTransactions"
          />
        </div>
        <select class="filter-select" v-model="selectedType" @change="filterTransactions">
          <option value="">Tous les types</option>
          <option value="recette">Recettes</option>
          <option value="depense">Dépenses</option>
        </select>
        <select class="filter-select" v-model="selectedSource" @change="filterTransactions">
          <option value="">Toutes les sources</option>
          <option value="Caisse Centrale">Caisse Centrale</option>
          <option value="Caisse Régionale">Caisse Régionale</option>
          <option value="Banque BICICI">Banque BICICI</option>
          <option value="Banque NSIA">Banque NSIA</option>
        </select>
        <button class="add-button" @click="openDialog">
          <PlusIcon class="button-icon" />
          Nouveau Mouvement
        </button>
      </div>

      <!-- Tableau des transactions -->
      <div class="table-wrapper">
        <div class="table-header">
          <h2 class="table-title animate-slide">Historique des Mouvements</h2>
          <div class="table-summary">
            {{ filteredTransactions.length }} mouvement(s) • 
            Recettes: {{ formatCurrency(getFilteredTotal('recette')) }} • 
            Dépenses: {{ formatCurrency(getFilteredTotal('depense')) }}
          </div>
        </div>
        
        <div class="table-container">
          <table class="compta-table animate-fade">
            <thead>
              <tr>
                <th @click="sortBy('date')" class="sortable">
                  Date
                  <ChevronUpIcon v-if="sortField === 'date' && sortOrder === 'asc'" class="sort-icon" />
                  <ChevronDownIcon v-if="sortField === 'date' && sortOrder === 'desc'" class="sort-icon" />
                </th>
                <th @click="sortBy('libelle')" class="sortable">
                  Libellé
                  <ChevronUpIcon v-if="sortField === 'libelle' && sortOrder === 'asc'" class="sort-icon" />
                  <ChevronDownIcon v-if="sortField === 'libelle' && sortOrder === 'desc'" class="sort-icon" />
                </th>
                <th>Type</th>
                <th @click="sortBy('montant')" class="sortable">
                  Montant
                  <ChevronUpIcon v-if="sortField === 'montant' && sortOrder === 'asc'" class="sort-icon" />
                  <ChevronDownIcon v-if="sortField === 'montant' && sortOrder === 'desc'" class="sort-icon" />
                </th>
                <th>Responsable</th>
                <th>Source</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr 
                v-for="transaction in paginatedTransactions" 
                :key="transaction.id" 
                class="row-hover"
              >
                <td>{{ formatDate(transaction.date) }}</td>
                <td>
                  <div class="libelle-cell">
                    <strong>{{ transaction.libelle }}</strong>
                    <small v-if="transaction.motif">{{ transaction.motif }}</small>
                  </div>
                </td>
                <td>
                  <span :class="['type-badge', transaction.type]">
                    {{ transaction.type === 'recette' ? 'Recette' : 'Dépense' }}
                  </span>
                </td>
                <td>
                  <span :class="['montant', transaction.type]">
                    {{ transaction.type === 'recette' ? '+' : '-' }}{{ formatCurrency(transaction.montant) }}
                  </span>
                </td>
                <td>{{ transaction.responsable }}</td>
                <td>
                  <span class="source-badge">{{ transaction.source }}</span>
                </td>
                <td>
                  <div class="action-buttons">
                    <button class="action-btn edit" @click="editTransaction(transaction)" title="Modifier">
                      <EditIcon class="action-icon" />
                    </button>
                    <button class="action-btn delete" @click="confirmDelete(transaction)" title="Supprimer">
                      <TrashIcon class="action-icon" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="pagination" v-if="totalPages > 1">
          <button 
            @click="currentPage = Math.max(1, currentPage - 1)"
            :disabled="currentPage === 1"
            class="pagination-btn"
          >
            <ChevronLeftIcon class="pagination-icon" />
          </button>
          <span class="pagination-info">
            Page {{ currentPage }} sur {{ totalPages }}
          </span>
          <button 
            @click="currentPage = Math.min(totalPages, currentPage + 1)"
            :disabled="currentPage === totalPages"
            class="pagination-btn"
          >
            <ChevronRightIcon class="pagination-icon" />
          </button>
        </div>
      </div>
    </div>

    <!-- Dialog pour ajout/mise à jour -->
    <div v-if="dialogOpen" class="dialog-overlay" @click="closeDialog">
      <div class="dialog-box large" @click.stop>
        <div class="dialog-header">
          <h3>{{ editingTransaction ? 'Modifier le Mouvement' : 'Nouveau Mouvement' }}</h3>
          <button class="close-btn" @click="closeDialog">
            <XIcon class="close-icon" />
          </button>
        </div>
        <div class="dialog-content">
          <form @submit.prevent="saveTransaction">
            <div class="form-group">
              <label>Libellé du mouvement *</label>
              <input 
                type="text" 
                v-model="formData.libelle"
                placeholder="Ex: Cotisation mensuelle, Achat matériel..."
                required 
              />
            </div>
            <div class="form-group">
              <label>Motif détaillé</label>
              <textarea 
                v-model="formData.motif"
                placeholder="Description détaillée du mouvement..."
                rows="3"
              ></textarea>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Type *</label>
                <select v-model="formData.type" required>
                  <option value="">Choisir le type</option>
                  <option value="recette">Recette</option>
                  <option value="depense">Dépense</option>
                </select>
              </div>
              <div class="form-group">
                <label>Montant (FCFA) *</label>
                <input 
                  type="number" 
                  v-model="formData.montant"
                  placeholder="0"
                  min="0"
                  required 
                />
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Source *</label>
                <select v-model="formData.source" required>
                  <option value="">Choisir la source</option>
                  <option>Caisse Centrale</option>
                  <option>Caisse Régionale</option>
                  <option>Banque BICICI</option>
                  <option>Banque NSIA</option>
                </select>
              </div>
              <div class="form-group">
                <label>Responsable *</label>
                <input 
                  type="text" 
                  v-model="formData.responsable"
                  placeholder="Nom du responsable"
                  required 
                />
              </div>
            </div>
            <div class="dialog-actions">
              <button type="submit" class="dialog-btn save">
                <SaveIcon class="button-icon" />
                {{ editingTransaction ? 'Mettre à jour' : 'Enregistrer' }}
              </button>
              <button type="button" class="dialog-btn cancel" @click="closeDialog">
                Annuler
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Dialog Transfert -->
    <div v-if="transferDialog" class="dialog-overlay" @click="closeTransferDialog">
      <div class="dialog-box large" @click.stop>
        <div class="dialog-header">
          <h3>Transfert de Fonds</h3>
          <button class="close-btn" @click="closeTransferDialog">
            <XIcon class="close-icon" />
          </button>
        </div>
        <div class="dialog-content">
          <form @submit.prevent="executeTransfer">
            <div class="form-row">
              <div class="form-group">
                <label>Depuis *</label>
                <select v-model="transferData.from" required>
                  <option value="">Choisir la source</option>
                  <option>Caisse Centrale</option>
                  <option>Banque BICICI</option>
                  <option>Banque NSIA</option>
                </select>
              </div>
              <div class="form-group">
                <label>Vers *</label>
                <select v-model="transferData.to" required>
                  <option value="">Choisir la destination</option>
                  <option>Caisse Régionale</option>
                  <option>Banque BICICI</option>
                  <option>Banque NSIA</option>
                </select>
              </div>
            </div>
            <div class="form-group">
              <label>Montant à transférer (FCFA) *</label>
              <input 
                type="number" 
                v-model="transferData.amount"
                placeholder="0"
                min="0"
                required 
              />
            </div>
            <div class="form-group">
              <label>Motif du transfert</label>
              <textarea 
                v-model="transferData.motif"
                placeholder="Raison du transfert..."
                rows="2"
              ></textarea>
            </div>
            <div class="dialog-actions">
              <button type="submit" class="dialog-btn save">
                <ArrowRightLeftIcon class="button-icon" />
                Valider le transfert
              </button>
              <button type="button" class="dialog-btn cancel" @click="closeTransferDialog">
                Annuler
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Dialog Confirmation de suppression -->
    <div v-if="confirmDeleteDialog" class="dialog-overlay" @click="closeConfirmDelete">
      <div class="dialog-box" @click.stop>
        <div class="dialog-header">
          <h3>Confirmation de suppression</h3>
        </div>
        <div class="dialog-content">
          <div class="confirmation-content">
            <AlertTriangleIcon class="warning-icon" />
            <p>Êtes-vous sûr de vouloir supprimer ce mouvement ?</p>
            <div class="transaction-preview" v-if="transactionToDelete">
              <strong>{{ transactionToDelete.libelle }}</strong><br>
              <span>{{ formatCurrency(transactionToDelete.montant) }} - {{ transactionToDelete.date }}</span>
            </div>
          </div>
          <div class="dialog-actions">
            <button class="dialog-btn delete" @click="deleteItem">
              <TrashIcon class="button-icon" />
              Oui, Supprimer
            </button>
            <button class="dialog-btn cancel" @click="closeConfirmDelete">
              Annuler
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import {
  TrendingUpIcon,
  TrendingDownIcon,
  ArrowRightLeftIcon,
  FileTextIcon,
  DownloadIcon,
  SearchIcon,
  PlusIcon,
  EditIcon,
  TrashIcon,
  XIcon,
  SaveIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  AlertTriangleIcon
} from 'lucide-vue-next'

// Données réactives
const dialogOpen = ref(false)
const transferDialog = ref(false)
const confirmDeleteDialog = ref(false)
const editingTransaction = ref(null)
const transactionToDelete = ref(null)

// Filtres et recherche
const searchTerm = ref('')
const selectedType = ref('')
const selectedSource = ref('')
const sortField = ref('date')
const sortOrder = ref('desc')
const currentPage = ref(1)
const itemsPerPage = 10

// Données du formulaire
const formData = ref({
  libelle: '',
  motif: '',
  type: '',
  montant: '',
  source: '',
  responsable: ''
})

const transferData = ref({
  from: '',
  to: '',
  amount: '',
  motif: ''
})

// Données des transactions
const transactions = ref([
  {
    id: 1,
    date: '2025-01-21',
    libelle: 'Cotisation mensuelle janvier',
    motif: 'Cotisation des membres pour le mois de janvier',
    type: 'recette',
    montant: 250000,
    responsable: 'Fatoumata Maiga',
    source: 'Caisse Centrale'
  },
  {
    id: 2,
    date: '2025-01-19',
    libelle: 'Achat fournitures bureau',
    motif: 'Achat de matériel de bureau pour le secrétariat',
    type: 'depense',
    montant: 75000,
    responsable: 'Karim Mory',
    source: 'Banque BICICI'
  },
  {
    id: 3,
    date: '2025-01-18',
    libelle: 'Subvention gouvernementale',
    motif: 'Aide financière du gouvernement malien',
    type: 'recette',
    montant: 500000,
    responsable: 'Aminata Traoré',
    source: 'Banque NSIA'
  },
  {
    id: 4,
    date: '2025-01-15',
    libelle: 'Organisation événement culturel',
    motif: 'Frais pour la soirée culturelle malienne',
    type: 'depense',
    montant: 180000,
    responsable: 'Moussa Diarra',
    source: 'Caisse Centrale'
  },
  {
    id: 5,
    date: '2025-01-12',
    libelle: 'Dons des anciens',
    motif: 'Contributions des anciens membres de l\'association',
    type: 'recette',
    montant: 320000,
    responsable: 'Salimata Keita',
    source: 'Caisse Régionale'
  }
])

// Références pour les graphiques
const monthlyChart = ref(null)
const sourceChart = ref(null)

// Données calculées
const totalRecettes = computed(() => 
  transactions.value
    .filter(t => t.type === 'recette')
    .reduce((sum, t) => sum + t.montant, 0)
)

const totalDepenses = computed(() => 
  transactions.value
    .filter(t => t.type === 'depense')
    .reduce((sum, t) => sum + t.montant, 0)
)

const soldeCaisse = computed(() => {
  const recettesCaisse = transactions.value
    .filter(t => t.type === 'recette' && t.source.includes('Caisse'))
    .reduce((sum, t) => sum + t.montant, 0)
  const depensesCaisse = transactions.value
    .filter(t => t.type === 'depense' && t.source.includes('Caisse'))
    .reduce((sum, t) => sum + t.montant, 0)
  return recettesCaisse - depensesCaisse
})

const soldeBanque = computed(() => {
  const recettesBanque = transactions.value
    .filter(t => t.type === 'recette' && t.source.includes('Banque'))
    .reduce((sum, t) => sum + t.montant, 0)
  const depensesBanque = transactions.value
    .filter(t => t.type === 'depense' && t.source.includes('Banque'))
    .reduce((sum, t) => sum + t.montant, 0)
  return recettesBanque - depensesBanque
})

const filteredTransactions = ref([...transactions.value])

const paginatedTransactions = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredTransactions.value.slice(start, end)
})

const totalPages = computed(() => 
  Math.ceil(filteredTransactions.value.length / itemsPerPage)
)

// Fonctions utilitaires
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('fr-FR').format(amount) + ' FCFA'
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('fr-FR')
}

// Fonctions de filtrage et tri
const filterTransactions = () => {
  let filtered = [...transactions.value]
  
  if (searchTerm.value) {
    const search = searchTerm.value.toLowerCase()
    filtered = filtered.filter(t => 
      t.libelle.toLowerCase().includes(search) ||
      t.responsable.toLowerCase().includes(search) ||
      t.motif.toLowerCase().includes(search)
    )
  }
  
  if (selectedType.value) {
    filtered = filtered.filter(t => t.type === selectedType.value)
  }
  
  if (selectedSource.value) {
    filtered = filtered.filter(t => t.source === selectedSource.value)
  }
  
  filteredTransactions.value = filtered
  currentPage.value = 1
}

const sortBy = (field) => {
  if (sortField.value === field) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortField.value = field
    sortOrder.value = 'asc'
  }
  
  filteredTransactions.value.sort((a, b) => {
    let aVal = a[field]
    let bVal = b[field]
    
    if (field === 'date') {
      aVal = new Date(aVal)
      bVal = new Date(bVal)
    }
    
    if (sortOrder.value === 'asc') {
      return aVal > bVal ? 1 : -1
    } else {
      return aVal < bVal ? 1 : -1
    }
  })
}

const getFilteredTotal = (type) => {
  return filteredTransactions.value
    .filter(t => t.type === type)
    .reduce((sum, t) => sum + t.montant, 0)
}

// Fonctions de dialog
const openDialog = () => {
  editingTransaction.value = null
  formData.value = {
    libelle: '',
    motif: '',
    type: '',
    montant: '',
    source: '',
    responsable: ''
  }
  dialogOpen.value = true
}

const closeDialog = () => {
  dialogOpen.value = false
  editingTransaction.value = null
}

const editTransaction = (transaction) => {
  editingTransaction.value = transaction
  formData.value = { ...transaction }
  dialogOpen.value = true
}

const saveTransaction = () => {
  if (editingTransaction.value) {
    // Mise à jour
    const index = transactions.value.findIndex(t => t.id === editingTransaction.value.id)
    transactions.value[index] = { ...formData.value, id: editingTransaction.value.id }
  } else {
    // Nouveau
    const newTransaction = {
      ...formData.value,
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      montant: parseInt(formData.value.montant)
    }
    transactions.value.unshift(newTransaction)
  }
  
  filterTransactions()
  closeDialog()
}

const openTransferDialog = () => {
  transferData.value = {
    from: '',
    to: '',
    amount: '',
    motif: ''
  }
  transferDialog.value = true
}

const closeTransferDialog = () => {
  transferDialog.value = false
}

const executeTransfer = () => {
  // Créer deux transactions : une sortie et une entrée
  const transferAmount = parseInt(transferData.value.amount)
  const today = new Date().toISOString().split('T')[0]
  
  // Transaction de sortie
  const outTransaction = {
    id: Date.now(),
    date: today,
    libelle: `Transfert vers ${transferData.value.to}`,
    motif: transferData.value.motif || 'Transfert de fonds',
    type: 'depense',
    montant: transferAmount,
    responsable: 'Système',
    source: transferData.value.from
  }
  
  // Transaction d'entrée
  const inTransaction = {
    id: Date.now() + 1,
    date: today,
    libelle: `Transfert depuis ${transferData.value.from}`,
    motif: transferData.value.motif || 'Transfert de fonds',
    type: 'recette',
    montant: transferAmount,
    responsable: 'Système',
    source: transferData.value.to
  }
  
  transactions.value.unshift(outTransaction, inTransaction)
  filterTransactions()
  closeTransferDialog()
}

const confirmDelete = (transaction) => {
  transactionToDelete.value = transaction
  confirmDeleteDialog.value = true
}

const closeConfirmDelete = () => {
  confirmDeleteDialog.value = false
  transactionToDelete.value = null
}

const deleteItem = () => {
  const index = transactions.value.findIndex(t => t.id === transactionToDelete.value.id)
  transactions.value.splice(index, 1)
  filterTransactions()
  closeConfirmDelete()
}

const generateReport = () => {
  // Simulation de génération de rapport
  alert('Rapport généré avec succès !')
}

const exportData = () => {
  const dataStr = JSON.stringify(transactions.value, null, 2)
  const dataBlob = new Blob([dataStr], { type: 'application/json' })
  const url = URL.createObjectURL(dataBlob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'comptabilite-aeemci.json'
  link.click()
}

// Fonctions de graphiques
const drawMonthlyChart = () => {
  const canvas = monthlyChart.value
  if (!canvas) return
  
  const ctx = canvas.getContext('2d')
  const { width, height } = canvas.getBoundingClientRect()
  canvas.width = width
  canvas.height = height
  
  ctx.clearRect(0, 0, width, height)
  
  // Données mensuelles simulées
  const monthlyData = [
    { month: 'Nov', recettes: 800000, depenses: 300000 },
    { month: 'Déc', recettes: 950000, depenses: 450000 },
    { month: 'Jan', recettes: 1070000, depenses: 255000 }
  ]
  
  const padding = 40
  const chartWidth = width - 2 * padding
  const chartHeight = height - 2 * padding
  const barWidth = chartWidth / (monthlyData.length * 2) * 0.8
  
  const maxValue = Math.max(...monthlyData.flatMap(d => [d.recettes, d.depenses]))
  
  // Dessiner les barres
  monthlyData.forEach((data, index) => {
    const x = padding + (index * chartWidth / monthlyData.length)
    
    // Barre recettes (vert)
    const recettesHeight = (data.recettes / maxValue) * chartHeight
    ctx.fillStyle = '#10B981'
    ctx.fillRect(x, height - padding - recettesHeight, barWidth, recettesHeight)
    
    // Barre dépenses (rouge)
    const depensesHeight = (data.depenses / maxValue) * chartHeight
    ctx.fillStyle = '#EF4444'
    ctx.fillRect(x + barWidth + 5, height - padding - depensesHeight, barWidth, depensesHeight)
    
    // Labels
    ctx.fillStyle = '#374151'
    ctx.font = '12px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(data.month, x + barWidth, height - 10)
  })
  
  // Légende
  ctx.fillStyle = '#10B981'
  ctx.fillRect(width - 120, 20, 15, 15)
  ctx.fillStyle = '#374151'
  ctx.font = '12px sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText('Recettes', width - 100, 32)
  
  ctx.fillStyle = '#EF4444'
  ctx.fillRect(width - 120, 40, 15, 15)
  ctx.fillStyle = '#374151'
  ctx.fillText('Dépenses', width - 100, 52)
}

const drawSourceChart = () => {
  const canvas = sourceChart.value
  if (!canvas) return
  
  const ctx = canvas.getContext('2d')
  const { width, height } = canvas.getBoundingClientRect()
  canvas.width = width
  canvas.height = height
  
  ctx.clearRect(0, 0, width, height)
  
  const centerX = width / 2
  const centerY = height / 2
  const radius = Math.min(width, height) / 3
  
  const sourceData = [
    { name: 'Caisse Centrale', value: 570000, color: '#3B82F6' },
    { name: 'Banque BICICI', value: 320000, color: '#10B981' },
    { name: 'Banque NSIA', value: 500000, color: '#F59E0B' },
    { name: 'Caisse Régionale', value: 320000, color: '#EF4444' }
  ]
  
  const total = sourceData.reduce((sum, item) => sum + item.value, 0)
  let currentAngle = -Math.PI / 2
  
  sourceData.forEach((data) => {
    const sliceAngle = (data.value / total) * 2 * Math.PI
    
    ctx.beginPath()
    ctx.moveTo(centerX, centerY)
    ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle)
    ctx.closePath()
    ctx.fillStyle = data.color
    ctx.fill()
    
    currentAngle += sliceAngle
  })
  
  // Légende
  sourceData.forEach((data, index) => {
    const y = 20 + index * 20
    ctx.fillStyle = data.color
    ctx.fillRect(10, y, 15, 15)
    ctx.fillStyle = '#374151'
    ctx.font = '12px sans-serif'
    ctx.textAlign = 'left'
    ctx.fillText(`${data.name} (${Math.round((data.value / total) * 100)}%)`, 30, y + 12)
  })
}

// Lifecycle
onMounted(async () => {
  await nextTick()
  filterTransactions()
  drawMonthlyChart()
  drawSourceChart()
  
  window.addEventListener('resize', () => {
    setTimeout(() => {
      drawMonthlyChart()
      drawSourceChart()
    }, 100)
  })
})
</script>

<style scoped>
/* Reset global */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* Animations */
@keyframes fade {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slide {
  from { transform: translateY(-20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@keyframes pop {
  from { transform: scale(0.8); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

.animate-fade { animation: fade 0.6s ease-out; }
.animate-slide { animation: slide 0.6s ease-out; }
.animate-pop { animation: pop 0.6s ease-out; }
.animate-pop-delay-1 { animation: pop 0.6s ease-out 0.1s both; }
.animate-pop-delay-2 { animation: pop 0.6s ease-out 0.2s both; }
.animate-pop-delay-3 { animation: pop 0.6s ease-out 0.3s both; }

/* Base - Page complète */
.compta-wrapper {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: #ffffff;
  min-height: 100vh;
  height: 100vh;
  overflow-y: auto;
  padding: 0;
  margin: 0;
}

.compta-container {
  background: #ffffff;
  min-height: 100vh;
  padding: 32px;
  max-width: none;
  width: 100%;
  margin: 0;
}

/* Header */
.compta-header {
  margin-bottom: 32px;
  text-align: center;
  padding: 20px 0;
}

.compta-header h1 {
  font-size: 2.5rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 8px 0;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.compta-header p {
  color: #6b7280;
  font-size: 1.1rem;
  margin: 0;
}

/* Cartes statistiques */
.stat-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
}

.card {
  border-radius: 20px;
  padding: 24px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #667eea, #764ba2);
}

.card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
}

.card-gradient {
  background: linear-gradient(135deg, #10b981, #047857);
  color: white;
  border: none;
}

.card-gradient::before {
  background: rgba(255, 255, 255, 0.2);
}

.card-glass {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
}

.label {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
  margin: 0 0 8px 0;
  font-weight: 500;
}

.card-glass .label {
  color: #6b7280;
}

.card h2 {
  font-size: 1.8rem;
  font-weight: 700;
  margin: 0 0 12px 0;
}

.stat-trend {
  display: flex;
  align-items: center;
  font-size: 0.85rem;
  font-weight: 500;
}

.stat-trend.positive {
  color: rgba(255, 255, 255, 0.9);
}

.stat-trend.negative {
  color: rgba(255, 255, 255, 0.9);
}

.card-glass .stat-trend.positive {
  color: #059669;
}

.card-glass .stat-trend.negative {
  color: #dc2626;
}

.trend-icon {
  width: 16px;
  height: 16px;
  margin-right: 4px;
}

.stat-progress {
  margin-top: 12px;
}

.progress-bar {
  width: 100%;
  height: 6px;
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
  overflow: hidden;
}

.card-glass .progress-bar {
  background-color: #e5e7eb;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #34d399, #10b981);
  transition: width 0.6s ease;
}

/* Graphiques */
.charts-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
}

.chart-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
  border: 1px solid #e5e7eb;
}

.chart-card h3 {
  margin: 0 0 16px 0;
  color: #1f2937;
  font-size: 1.2rem;
  font-weight: 600;
}

.chart-container {
  height: 200px;
}

.chart-canvas {
  width: 100%;
  height: 100%;
}

/* Actions globales */
.global-actions {
  display: flex;
  gap: 16px;
  margin-bottom: 32px;
  flex-wrap: wrap;
}

.action-button {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  border-radius: 12px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.95rem;
}

.action-button.primary {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
}

.action-button.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
}

.action-button.secondary {
  background: white;
  color: #374151;
  border: 2px solid #e5e7eb;
}

.action-button.secondary:hover {
  border-color: #667eea;
  color: #667eea;
  transform: translateY(-2px);
}

.button-icon {
  width: 18px;
  height: 18px;
  margin-right: 8px;
}

/* Filtres et actions */
.table-actions {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  flex-wrap: wrap;
  align-items: center;
}

.search-container {
  position: relative;
  flex: 1;
  min-width: 250px;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 18px;
  height: 18px;
  color: #9ca3af;
}

.search-input {
  width: 100%;
  padding: 12px 12px 12px 44px;
  border-radius: 12px;
  border: 2px solid #e5e7eb;
  font-size: 0.95rem;
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.filter-select {
  padding: 12px 16px;
  border-radius: 12px;
  border: 2px solid #e5e7eb;
  background: white;
  cursor: pointer;
  font-size: 0.95rem;
  transition: all 0.3s ease;
}

.filter-select:focus {
  outline: none;
  border-color: #667eea;
}

.add-button {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  background: linear-gradient(135deg, #10b981, #047857);
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.95rem;
}

.add-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(16, 185, 129, 0.4);
}

/* Tableau */
.table-wrapper {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
  border: 1px solid #e5e7eb;
  margin-bottom: 32px;
}

.table-header {
  padding: 24px;
  border-bottom: 1px solid #e5e7eb;
  background: #f8fafc;
}

.table-title {
  margin: 0 0 8px 0;
  color: #1f2937;
  font-size: 1.4rem;
  font-weight: 600;
}

.table-summary {
  color: #6b7280;
  font-size: 0.9rem;
}

.table-container {
  overflow-x: auto;
}

.compta-table {
  width: 100%;
  border-collapse: collapse;
}

.compta-table th,
.compta-table td {
  padding: 16px 20px;
  text-align: left;
  border-bottom: 1px solid #f3f4f6;
}

.compta-table th {
  background-color: #f8fafc;
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
  color: #374151;
  letter-spacing: 0.5px;
}

.compta-table th.sortable {
  cursor: pointer;
  user-select: none;
  position: relative;
  transition: all 0.2s ease;
}

.compta-table th.sortable:hover {
  background-color: #e2e8f0;
}

.sort-icon {
  width: 14px;
  height: 14px;
  margin-left: 4px;
  display: inline-block;
}

.compta-table td {
  font-size: 0.95rem;
  color: #374151;
}

.row-hover {
  transition: all 0.2s ease;
}

.row-hover:hover {
  background-color: #f8fafc;
  transform: scale(1.01);
}

.libelle-cell strong {
  display: block;
  margin-bottom: 2px;
}

.libelle-cell small {
  color: #6b7280;
  font-size: 0.8rem;
}

.type-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
}

.type-badge.recette {
  background-color: #d1fae5;
  color: #047857;
}

.type-badge.depense {
  background-color: #fee2e2;
  color: #dc2626;
}

.montant {
  font-weight: 600;
  font-size: 1rem;
}

.montant.recette {
  color: #047857;
}

.montant.depense {
  color: #dc2626;
}

.source-badge {
  padding: 4px 8px;
  background-color: #e0e7ff;
  color: #3730a3;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 500;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.action-btn {
  padding: 6px 8px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-btn:hover {
  transform: scale(1.1);
}

.action-btn.edit {
  background-color: #fbbf24;
  color: white;
}

.action-btn.delete {
  background-color: #ef4444;
  color: white;
}

.action-icon {
  width: 14px;
  height: 14px;
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: #f8fafc;
  border-top: 1px solid #e5e7eb;
}

.pagination-btn {
  padding: 8px;
  border: 1px solid #d1d5db;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.pagination-btn:hover:not(:disabled) {
  background: #f3f4f6;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-icon {
  width: 16px;
  height: 16px;
}

.pagination-info {
  font-size: 0.9rem;
  color: #6b7280;
}

/* Dialogs - Plein écran avec scroll */
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  z-index: 1000;
  backdrop-filter: blur(4px);
  overflow-y: auto;
  padding: 20px;
}

.dialog-box {
  background: white;
  border-radius: 20px;
  width: 100%;
  max-width: 500px;
  margin: auto;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
  animation: pop 0.3s ease-out;
  max-height: calc(100vh - 40px);
  display: flex;
  flex-direction: column;
}

.dialog-box.large {
  max-width: 600px;
}

.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 24px 0 24px;
  flex-shrink: 0;
}

.dialog-header h3 {
  margin: 0;
  color: #1f2937;
  font-size: 1.3rem;
  font-weight: 600;
}

.close-btn {
  padding: 8px;
  border: none;
  background: #f3f4f6;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: #e5e7eb;
}

.close-icon {
  width: 18px;
  height: 18px;
}

.dialog-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px 24px 24px 24px;
}

.dialog-content form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group label {
  font-weight: 600;
  color: #374151;
  font-size: 0.9rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.form-group input,
.form-group select,
.form-group textarea {
  padding: 12px;
  border-radius: 8px;
  border: 2px solid #e5e7eb;
  font-size: 0.95rem;
  transition: all 0.3s ease;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-group textarea {
  resize: vertical;
  min-height: 80px;
}

.dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 8px;
  flex-shrink: 0;
}

.dialog-btn {
  display: flex;
  align-items: center;
  padding: 10px 20px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.dialog-btn.save {
  background: linear-gradient(135deg, #10b981, #047857);
  color: white;
}

.dialog-btn.save:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
}

.dialog-btn.cancel {
  background: #f3f4f6;
  color: #374151;
}

.dialog-btn.cancel:hover {
  background: #e5e7eb;
}

.dialog-btn.delete {
  background: #ef4444;
  color: white;
}

.dialog-btn.delete:hover {
  background: #dc2626;
  transform: translateY(-1px);
}

/* Confirmation dialog */
.confirmation-content {
  text-align: center;
}

.warning-icon {
  width: 48px;
  height: 48px;
  color: #f59e0b;
  margin: 0 auto 16px auto;
}

.confirmation-content p {
  margin: 0 0 16px 0;
  color: #374151;
  font-size: 1.1rem;
}

.transaction-preview {
  background: #f3f4f6;
  padding: 12px;
  border-radius: 8px;
  margin-top: 16px;
  font-size: 0.9rem;
  color: #6b7280;
}

/* Responsive */
@media (max-width: 768px) {
  .compta-container {
    padding: 20px;
  }
  
  .compta-header h1 {
    font-size: 2rem;
  }
  
  .stat-cards {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .charts-section {
    grid-template-columns: 1fr;
  }
  
  .global-actions {
    flex-direction: column;
  }
  
  .action-button {
    justify-content: center;
  }
  
  .table-actions {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-container {
    min-width: auto;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .dialog-overlay {
    padding: 10px;
  }
  
  .dialog-box {
    max-width: none;
    margin: 0;
  }
  
  .compta-table {
    font-size: 0.85rem;
  }
  
  .compta-table th,
  .compta-table td {
    padding: 12px 8px;
  }
}

@media (max-width: 480px) {
  .compta-container {
    padding: 16px;
  }
  
  .compta-header h1 {
    font-size: 1.8rem;
  }
  
  .card {
    padding: 16px;
  }
  
  .card h2 {
    font-size: 1.5rem;
  }
}
</style>