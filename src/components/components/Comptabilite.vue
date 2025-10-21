<template>
  <div class="comptabilite-page">
     <!-- Remplacer le header par le style de la page matériel -->
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">💰 Comptabilité AEEMCI</h1>
        <p class="page-subtitle">Gestion financière de l'association étudiante</p>
      </div>
      <div class="header-stats">
        <div class="stat-card">
          <div class="stat-number">{{ formatCurrency(soldeTotal) }}</div>
          <div class="stat-label">Solde Total</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">{{ formatCurrency(totalRecettes) }}</div>
          <div class="stat-label">Recettes</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">{{ formatCurrency(totalDepenses) }}</div>
          <div class="stat-label">Dépenses</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">{{ formatCurrency(budgetRestant) }}</div>
          <div class="stat-label">Budget Restant</div>
        </div>
      </div>
    </div>

    <div class="content-container">
       <!-- Ajouter section avec graphiques et rapports -->
      <div class="dashboard-section">
        <div class="dashboard-grid">
           <!-- Graphique des revenus/dépenses -->
          <div class="dashboard-card chart-card">
            <div class="card-header">
              <h3>Évolution Mensuelle</h3>
              <select v-model="selectedYear" class="year-select">
                <option value="2024">2024</option>
                <option value="2023">2023</option>
              </select>
            </div>
            <div class="chart-container">
              <div class="chart-bars">
                <div v-for="(month, index) in monthlyData" :key="index" class="chart-bar-group">
                  <div class="chart-bar recette-bar" :style="`height: ${(month.recettes / maxAmount) * 100}%`"></div>
                  <div class="chart-bar depense-bar" :style="`height: ${(month.depenses / maxAmount) * 100}%`"></div>
                  <div class="chart-label">{{ month.name }}</div>
                </div>
              </div>
              <div class="chart-legend">
                <div class="legend-item">
                  <div class="legend-color recette-color"></div>
                  <span>Recettes</span>
                </div>
                <div class="legend-item">
                  <div class="legend-color depense-color"></div>
                  <span>Dépenses</span>
                </div>
              </div>
            </div>
          </div>

           <!-- Répartition par catégorie -->
          <div class="dashboard-card category-card">
            <div class="card-header">
              <h3>Dépenses par Catégorie</h3>
              <button @click="showCategoryModal = true" class="view-all-btn">Voir tout</button>
            </div>
            <div class="category-list">
              <div v-for="category in topCategories" :key="category.name" class="category-item">
                <div class="category-info">
                  <span class="category-name">{{ category.name }}</span>
                  <span class="category-amount">{{ formatCurrency(category.amount) }}</span>
                </div>
                <div class="category-bar">
                  <div class="category-progress" :style="`width: ${(category.amount / maxCategoryAmount) * 100}%`"></div>
                </div>
                <span class="category-percentage">{{ ((category.amount / totalDepenses) * 100).toFixed(1) }}%</span>
              </div>
            </div>
          </div>

           <!-- Budgets par projet -->
          <div class="dashboard-card budget-card">
            <div class="card-header">
              <h3>Budgets par Projet</h3>
              <button @click="showBudgetModal = true" class="add-budget-btn">+ Nouveau</button>
            </div>
            <div class="budget-list">
              <div v-for="budget in budgetsProjets" :key="budget.id" class="budget-item">
                <div class="budget-header">
                  <span class="budget-name">{{ budget.nom }}</span>
                  <span class="budget-status" :class="getBudgetStatusClass(budget)">{{ getBudgetStatus(budget) }}</span>
                </div>
                <div class="budget-progress-container">
                  <div class="budget-progress-bar">
                    <div class="budget-progress-fill" :style="`width: ${(budget.depense / budget.alloue) * 100}%`"></div>
                  </div>
                  <div class="budget-amounts">
                    <span class="budget-spent">{{ formatCurrency(budget.depense) }}</span>
                    <span class="budget-total">/ {{ formatCurrency(budget.alloue) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

           <!-- Transactions récentes -->
          <div class="dashboard-card recent-card">
            <div class="card-header">
              <h3>Transactions Récentes</h3>
              <button @click="showAllTransactions = true" class="view-all-btn">Voir tout</button>
            </div>
            <div class="recent-transactions">
              <div v-for="transaction in recentTransactions" :key="transaction.id" class="recent-item">
                <div class="recent-icon" :class="transaction.type === 'recette' ? 'recette-icon' : 'depense-icon'">
                  {{ transaction.type === 'recette' ? '↗️' : '↘️' }}
                </div>
                <div class="recent-info">
                  <div class="recent-description">{{ transaction.description }}</div>
                  <div class="recent-category">{{ transaction.categorie }} • {{ formatDate(transaction.date) }}</div>
                </div>
                <div class="recent-amount" :class="transaction.type === 'recette' ? 'recette-amount' : 'depense-amount'">
                  {{ transaction.type === 'recette' ? '+' : '-' }}{{ formatCurrency(transaction.montant) }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="content-header">
        <h2 class="content-title">Gestion des Transactions</h2>
        <div class="header-actions">
          <button @click="showRapportModal = true" class="secondary-btn">
            📊 Rapports détaillés
          </button>
          <button @click="exportData" class="secondary-btn">
            📤 Exporter données
          </button>
          <button @click="showAddModal = true" class="primary-btn">
            ➕ Nouvelle transaction
          </button>
        </div>
      </div>

       <!-- Améliorer la section des filtres avec le style matériel -->
      <div class="filters-section">
        <div class="search-container">
          <input type="text" v-model="searchTerm" placeholder="Rechercher une transaction..." class="search-input">
        </div>
        <div class="filters-container">
          <select v-model="selectedType" class="filter-select">
            <option value="">Tous les types</option>
            <option value="recette">Recettes</option>
            <option value="depense">Dépenses</option>
          </select>
          <select v-model="selectedCategory" class="filter-select">
            <option value="">Toutes les catégories</option>
            <option v-for="category in categories" :key="category" :value="category">{{ category }}</option>
          </select>
          <input v-model="dateDebut" type="date" class="filter-select">
          <input v-model="dateFin" type="date" class="filter-select">
        </div>
      </div>

       <!-- Améliorer le tableau avec le style matériel -->
      <div v-if="loading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>Chargement des transactions...</p>
      </div>

      <div v-else class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Description</th>
              <th>Catégorie</th>
              <th>Type</th>
              <th>Montant</th>
              <th>Référence</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="transaction in paginatedTransactions" :key="transaction.id" class="table-row">
              <td>{{ formatDate(transaction.date) }}</td>
              <td class="description-cell">
                <div class="transaction-info">
                  <span class="transaction-description">{{ transaction.description }}</span>
                  <span v-if="transaction.projet" class="transaction-projet">Projet: {{ transaction.projet }}</span>
                </div>
              </td>
              <td>
                <span :class="['category-badge', getCategoryClass(transaction.categorie)]">{{ transaction.categorie }}</span>
              </td>
              <td>
                <span :class="['type-badge', transaction.type === 'recette' ? 'recette' : 'depense']">
                  {{ transaction.type === 'recette' ? 'Recette' : 'Dépense' }}
                </span>
              </td>
              <td class="amount-cell" :class="transaction.type === 'recette' ? 'recette-amount' : 'depense-amount'">
                {{ transaction.type === 'recette' ? '+' : '-' }}{{ formatCurrency(transaction.montant) }}
              </td>
              <td>
                <span v-if="transaction.reference" class="reference-code">{{ transaction.reference }}</span>
                <span v-else class="no-reference">-</span>
              </td>
              <td class="actions-cell">
                <div class="action-buttons">
                  <button @click="viewTransaction(transaction)" class="action-btn view-btn" title="Voir détails">👁️</button>
                  <button @click="editTransaction(transaction)" class="action-btn edit-btn" title="Modifier">✏️</button>
                  <button @click="duplicateTransaction(transaction)" class="action-btn duplicate-btn" title="Dupliquer">📋</button>
                  <button @click="deleteTransaction(transaction.id)" class="action-btn delete-btn" title="Supprimer">🗑️</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

         <!-- Pagination -->
        <div class="pagination-container">
          <div class="pagination-info">
            Affichage de {{ (currentPage - 1) * itemsPerPage + 1 }} à {{ Math.min(currentPage * itemsPerPage, filteredTransactions.length) }} 
            sur {{ filteredTransactions.length }} transactions
          </div>
          <div class="pagination-controls">
            <button @click="currentPage--" :disabled="currentPage === 1" class="pagination-btn">Précédent</button>
            <span class="pagination-numbers">
              <button v-for="page in visiblePages" :key="page" @click="currentPage = page" 
                      :class="['pagination-number', { active: page === currentPage }]">
                {{ page }}
              </button>
            </span>
            <button @click="currentPage++" :disabled="currentPage >= totalPages" class="pagination-btn">Suivant</button>
          </div>
        </div>
      </div>
    </div>

     <!-- Améliorer les modals avec le style matériel -->
     <!-- Modal Ajout/Modification Transaction -->
    <div v-if="showAddModal || showEditModal" class="modal-overlay" @click="closeModals">
      <div class="modal-content large-modal" @click.stop>
        <div class="modal-header">
          <h3>{{ showEditModal ? 'Modifier la Transaction' : 'Nouvelle Transaction' }}</h3>
          <button @click="closeModals" class="close-btn">×</button>
        </div>
        
        <form @submit.prevent="saveTransaction" class="modal-form">
          <div class="form-row">
            <div class="form-group">
              <label>Type de transaction *</label>
              <select v-model="formData.type" required class="form-select">
                <option value="">Sélectionner un type</option>
                <option value="recette">Recette</option>
                <option value="depense">Dépense</option>
              </select>
            </div>
            <div class="form-group">
              <label>Catégorie *</label>
              <select v-model="formData.categorie" required class="form-select">
                <option value="">Sélectionner une catégorie</option>
                <option v-for="category in categories" :key="category" :value="category">{{ category }}</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label>Description *</label>
            <input type="text" v-model="formData.description" required class="form-input" 
                   placeholder="Description de la transaction">
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Montant (FCFA) *</label>
              <input type="number" v-model.number="formData.montant" required class="form-input" 
                     min="0" step="100" placeholder="0">
            </div>
            <div class="form-group">
              <label>Date *</label>
              <input type="date" v-model="formData.date" required class="form-input">
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Référence</label>
              <input type="text" v-model="formData.reference" class="form-input" 
                     placeholder="Numéro de référence">
            </div>
            <div class="form-group">
              <label>Projet associé</label>
              <select v-model="formData.projet" class="form-select">
                <option value="">Aucun projet</option>
                <option v-for="budget in budgetsProjets" :key="budget.id" :value="budget.nom">{{ budget.nom }}</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label>Notes complémentaires</label>
            <textarea v-model="formData.notes" class="form-textarea" rows="3" 
                      placeholder="Informations supplémentaires..."></textarea>
          </div>

          <div class="modal-actions">
            <button type="button" @click="closeModals" class="cancel-btn">Annuler</button>
            <button type="submit" class="save-btn">{{ showEditModal ? 'Modifier' : 'Ajouter' }}</button>
          </div>
        </form>
      </div>
    </div>

     <!-- Modal Budget Projet -->
    <div v-if="showBudgetModal" class="modal-overlay" @click="closeModals">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Nouveau Budget Projet</h3>
          <button @click="closeModals" class="close-btn">×</button>
        </div>
        
        <form @submit.prevent="saveBudget" class="modal-form">
          <div class="form-group">
            <label>Nom du projet *</label>
            <input type="text" v-model="budgetData.nom" required class="form-input" 
                   placeholder="Ex: Gala de fin d'année">
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Budget alloué (FCFA) *</label>
              <input type="number" v-model.number="budgetData.alloue" required class="form-input" 
                     min="0" step="1000" placeholder="0">
            </div>
            <div class="form-group">
              <label>Date limite</label>
              <input type="date" v-model="budgetData.dateLimite" class="form-input">
            </div>
          </div>

          <div class="form-group">
            <label>Responsable</label>
            <input type="text" v-model="budgetData.responsable" class="form-input" 
                   placeholder="Nom du responsable">
          </div>

          <div class="form-group">
            <label>Description</label>
            <textarea v-model="budgetData.description" class="form-textarea" rows="3" 
                      placeholder="Description du projet..."></textarea>
          </div>

          <div class="modal-actions">
            <button type="button" @click="closeModals" class="cancel-btn">Annuler</button>
            <button type="submit" class="save-btn">Créer le budget</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const transactions = ref([
  {
    id: 1,
    date: '2024-03-15',
    description: 'Cotisations membres mars',
    categorie: 'Cotisations',
    type: 'recette',
    montant: 180000,
    reference: 'COT-2024-003',
    projet: 'Fonctionnement général',
    notes: 'Cotisations de 36 membres'
  },
  {
    id: 2,
    date: '2024-03-12',
    description: 'Achat matériel sonorisation événement',
    categorie: 'Équipement',
    type: 'depense',
    montant: 125000,
    reference: 'ACH-2024-008',
    projet: 'Gala de fin d\'année',
    notes: 'Micros et enceintes pour le gala'
  },
  {
    id: 3,
    date: '2024-03-10',
    description: 'Don entreprise Société Générale',
    categorie: 'Dons',
    type: 'recette',
    montant: 300000,
    reference: 'DON-2024-003',
    projet: 'Bourse d\'études',
    notes: 'Don pour aider les étudiants en difficulté'
  },
  {
    id: 4,
    date: '2024-03-08',
    description: 'Frais organisation conférence leadership',
    categorie: 'Événements',
    type: 'depense',
    montant: 85000,
    reference: 'EVT-2024-005',
    projet: 'Formation leadership',
    notes: 'Location salle + rafraîchissements'
  },
  {
    id: 5,
    date: '2024-03-05',
    description: 'Vente billets soirée culturelle',
    categorie: 'Événements',
    type: 'recette',
    montant: 450000,
    reference: 'BIL-2024-002',
    projet: 'Gala de fin d\'année',
    notes: '150 billets vendus à 3000 FCFA'
  },
  {
    id: 6,
    date: '2024-03-03',
    description: 'Frais administratifs et bancaires',
    categorie: 'Administration',
    type: 'depense',
    montant: 25000,
    reference: 'ADM-2024-003',
    projet: 'Fonctionnement général',
    notes: 'Frais de tenue de compte'
  },
  {
    id: 7,
    date: '2024-03-01',
    description: 'Subvention Conseil Régional',
    categorie: 'Subventions',
    type: 'recette',
    montant: 500000,
    reference: 'SUB-2024-002',
    projet: 'Bourse d\'études',
    notes: 'Subvention annuelle pour les bourses'
  },
  {
    id: 8,
    date: '2024-02-28',
    description: 'Achat fournitures bureau et papeterie',
    categorie: 'Fournitures',
    type: 'depense',
    montant: 45000,
    reference: 'FOU-2024-002',
    projet: 'Fonctionnement général',
    notes: 'Papier, stylos, classeurs'
  },
  {
    id: 9,
    date: '2024-02-25',
    description: 'Formation en gestion de projet',
    categorie: 'Formation',
    type: 'depense',
    montant: 150000,
    reference: 'FOR-2024-001',
    projet: 'Formation leadership',
    notes: 'Formation pour 10 membres du bureau'
  },
  {
    id: 10,
    date: '2024-02-22',
    description: 'Cotisations membres février',
    categorie: 'Cotisations',
    type: 'recette',
    montant: 175000,
    reference: 'COT-2024-002',
    projet: 'Fonctionnement général',
    notes: 'Cotisations de 35 membres'
  },
  {
    id: 11,
    date: '2024-02-20',
    description: 'Location véhicule déplacement officiel',
    categorie: 'Transport',
    type: 'depense',
    montant: 75000,
    reference: 'TRA-2024-001',
    projet: 'Représentation officielle',
    notes: 'Déplacement délégation à Yamoussoukro'
  },
  {
    id: 12,
    date: '2024-02-18',
    description: 'Campagne communication réseaux sociaux',
    categorie: 'Communication',
    type: 'depense',
    montant: 35000,
    reference: 'COM-2024-002',
    projet: 'Gala de fin d\'année',
    notes: 'Promotion événement sur Facebook et Instagram'
  },
  {
    id: 13,
    date: '2024-02-15',
    description: 'Don anonyme membre bienfaiteur',
    categorie: 'Dons',
    type: 'recette',
    montant: 200000,
    reference: 'DON-2024-002',
    projet: 'Bourse d\'études',
    notes: 'Don d\'un ancien membre de l\'association'
  },
  {
    id: 14,
    date: '2024-02-12',
    description: 'Achat équipement informatique',
    categorie: 'Équipement',
    type: 'depense',
    montant: 180000,
    reference: 'ACH-2024-007',
    projet: 'Fonctionnement général',
    notes: 'Ordinateur portable pour le secrétariat'
  },
  {
    id: 15,
    date: '2024-02-10',
    description: 'Vente produits artisanaux maliens',
    categorie: 'Événements',
    type: 'recette',
    montant: 95000,
    reference: 'VEN-2024-001',
    projet: 'Promotion culture malienne',
    notes: 'Vente lors du marché culturel'
  }
])

const categories = ref([
  'Cotisations', 'Dons', 'Subventions', 'Événements', 'Équipement', 
  'Fournitures', 'Administration', 'Transport', 'Communication', 'Formation'
])

const budgetsProjets = ref([
  {
    id: 1,
    nom: 'Gala de fin d\'année',
    alloue: 800000,
    depense: 485000,
    dateLimite: '2024-06-30',
    responsable: 'Aminata Traoré',
    description: 'Organisation du gala annuel de l\'association'
  },
  {
    id: 2,
    nom: 'Bourse d\'études',
    alloue: 1200000,
    depense: 700000,
    dateLimite: '2024-12-31',
    responsable: 'Ibrahim Koné',
    description: 'Programme d\'aide aux étudiants en difficulté financière'
  },
  {
    id: 3,
    nom: 'Formation leadership',
    alloue: 400000,
    depense: 235000,
    dateLimite: '2024-05-31',
    responsable: 'Fatoumata Sidibé',
    description: 'Formation des membres du bureau et futurs leaders'
  },
  {
    id: 4,
    nom: 'Promotion culture malienne',
    alloue: 300000,
    depense: 95000,
    dateLimite: '2024-08-31',
    responsable: 'Moussa Diarra',
    description: 'Événements de promotion de la culture malienne'
  },
  {
    id: 5,
    nom: 'Fonctionnement général',
    alloue: 600000,
    depense: 425000,
    dateLimite: '2024-12-31',
    responsable: 'Secrétaire Général',
    description: 'Frais de fonctionnement quotidien de l\'association'
  }
])


const showAddModal = ref(false)
const showEditModal = ref(false)
const showBudgetModal = ref(false)
const showCategoryModal = ref(false)
const showRapportModal = ref(false)
const showAllTransactions = ref(false)
const editingTransaction = ref(null)
const loading = ref(false)
const searchTerm = ref('')
const selectedType = ref('')
const selectedCategory = ref('')
const dateDebut = ref('')
const dateFin = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(10)
const budgetTotal = ref(2000000)
const selectedYear = ref('2024')

const formData = ref({
  type: '',
  description: '',
  categorie: '',
  montant: 0,
  date: new Date().toISOString().split('T')[0],
  reference: '',
  projet: '',
  notes: ''
})

const budgetData = ref({
  nom: '',
  alloue: 0,
  dateLimite: '',
  responsable: '',
  description: ''
})

// Computed properties
const recettes = computed(() => transactions.value.filter(t => t.type === 'recette'))
const depenses = computed(() => transactions.value.filter(t => t.type === 'depense'))

const totalRecettes = computed(() => 
  recettes.value.reduce((sum, t) => sum + t.montant, 0)
)

const totalDepenses = computed(() => 
  depenses.value.reduce((sum, t) => sum + t.montant, 0)
)

const soldeTotal = computed(() => totalRecettes.value - totalDepenses.value)
const budgetRestant = computed(() => budgetTotal.value - totalDepenses.value)

const filteredTransactions = computed(() => {
  let filtered = transactions.value

  if (searchTerm.value) {
    filtered = filtered.filter(t => 
      t.description.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      t.reference?.toLowerCase().includes(searchTerm.value.toLowerCase())
    )
  }

  if (selectedType.value) {
    filtered = filtered.filter(t => t.type === selectedType.value)
  }

  if (selectedCategory.value) {
    filtered = filtered.filter(t => t.categorie === selectedCategory.value)
  }

  if (dateDebut.value) {
    filtered = filtered.filter(t => t.date >= dateDebut.value)
  }

  if (dateFin.value) {
    filtered = filtered.filter(t => t.date <= dateFin.value)
  }

  return filtered.sort((a, b) => new Date(b.date) - new Date(a.date))
})

const totalPages = computed(() => 
  Math.ceil(filteredTransactions.value.length / itemsPerPage.value)
)

const paginatedTransactions = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredTransactions.value.slice(start, end)
})

const monthlyData = computed(() => {
  const months = [
    'Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun',
    'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'
  ]
  
  return months.map((name, index) => {
    const monthTransactions = transactions.value.filter(t => {
      const date = new Date(t.date)
      return date.getMonth() === index && date.getFullYear() === parseInt(selectedYear.value)
    })
    
    const recettes = monthTransactions.filter(t => t.type === 'recette').reduce((sum, t) => sum + t.montant, 0)
    const depenses = monthTransactions.filter(t => t.type === 'depense').reduce((sum, t) => sum + t.montant, 0)
    
    return { name, recettes, depenses }
  })
})

const maxAmount = computed(() => {
  const amounts = monthlyData.value.flatMap(m => [m.recettes, m.depenses])
  return Math.max(...amounts, 100000)
})

const topCategories = computed(() => {
  const categoryTotals = {}
  transactions.value.filter(t => t.type === 'depense').forEach(t => {
    categoryTotals[t.categorie] = (categoryTotals[t.categorie] || 0) + t.montant
  })
  
  return Object.entries(categoryTotals)
    .map(([name, amount]) => ({ name, amount }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5)
})

const maxCategoryAmount = computed(() => {
  return Math.max(...topCategories.value.map(c => c.amount), 1)
})

const recentTransactions = computed(() => {
  return transactions.value
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5)
})

const visiblePages = computed(() => {
  const pages = []
  const start = Math.max(1, currentPage.value - 2)
  const end = Math.min(totalPages.value, start + 4)
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})

// Methods
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0
  }).format(amount).replace('XOF', 'FCFA')
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const getBudgetStatus = (budget) => {
  const percentage = (budget.depense / budget.alloue) * 100
  if (percentage >= 90) return 'Critique'
  if (percentage >= 75) return 'Attention'
  if (percentage >= 50) return 'En cours'
  return 'Démarré'
}

const getBudgetStatusClass = (budget) => {
  const percentage = (budget.depense / budget.alloue) * 100
  if (percentage >= 90) return 'status-critical'
  if (percentage >= 75) return 'status-warning'
  if (percentage >= 50) return 'status-progress'
  return 'status-started'
}

const getCategoryClass = (category) => {
  const classes = {
    'Cotisations': 'cotisations',
    'Dons': 'dons',
    'Subventions': 'subventions',
    'Événements': 'evenements',
    'Équipement': 'equipement',
    'Fournitures': 'fournitures',
    'Administration': 'administration',
    'Transport': 'transport',
    'Communication': 'communication',
    'Formation': 'formation'
  }
  return classes[category] || 'default'
}

const viewTransaction = (transaction) => {
  // Logique pour voir les détails
  console.log('Voir transaction:', transaction)
}

const duplicateTransaction = (transaction) => {
  const newTransaction = {
    ...transaction,
    id: Math.max(...transactions.value.map(t => t.id)) + 1,
    date: new Date().toISOString().split('T')[0],
    reference: ''
  }
  transactions.value.push(newTransaction)
}

const saveBudget = () => {
  const newBudget = {
    ...budgetData.value,
    id: Math.max(...budgetsProjets.value.map(b => b.id)) + 1,
    depense: 0
  }
  budgetsProjets.value.push(newBudget)
  closeModals()
}

const saveTransaction = () => {
  if (editingTransaction.value) {
    const index = transactions.value.findIndex(t => t.id === editingTransaction.value.id)
    transactions.value[index] = { ...formData.value, id: editingTransaction.value.id }
  } else {
    const newTransaction = {
      ...formData.value,
      id: Math.max(...transactions.value.map(t => t.id)) + 1
    }
    transactions.value.push(newTransaction)
  }
  closeModals()
}

const editTransaction = (transaction) => {
  editingTransaction.value = transaction
  formData.value = { ...transaction }
  showAddModal.value = true
  showEditModal.value = true
}

const deleteTransaction = (id) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer cette transaction ?')) {
    transactions.value = transactions.value.filter(t => t.id !== id)
  }
}

const closeModals = () => {
  showAddModal.value = false
  showEditModal.value = false
  showBudgetModal.value = false
  showCategoryModal.value = false
  showRapportModal.value = false
  editingTransaction.value = null
  
  // Reset form data
  formData.value = {
    type: '',
    description: '',
    categorie: '',
    montant: 0,
    date: new Date().toISOString().split('T')[0],
    reference: '',
    projet: '',
    notes: ''
  }
  
  budgetData.value = {
    nom: '',
    alloue: 0,
    dateLimite: '',
    responsable: '',
    description: ''
  }
}

const exportData = () => {
  const csvContent = [
    ['Date', 'Description', 'Catégorie', 'Type', 'Montant', 'Référence', 'Projet', 'Notes'],
    ...filteredTransactions.value.map(t => [
      t.date,
      t.description,
      t.categorie,
      t.type,
      t.montant,
      t.reference || '',
      t.projet || '',
      t.notes || ''
    ])
  ].map(row => row.join(',')).join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `comptabilite-aeemci-${new Date().toISOString().split('T')[0]}.csv`
  a.click()
  window.URL.revokeObjectURL(url)
}

onMounted(() => {
  // Initialize component
  loading.value = true
  setTimeout(() => {
    loading.value = false
  }, 500)
})
</script>

<style scoped>
/* Appliquer le même style que la page matériel avec améliorations */
.comptabilite-page {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  min-height: 100vh;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.page-header {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: white;
  border: none;
  padding: 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.header-content h1 {
  font-size: 28px;
  font-weight: 700;
  color: white;
  margin: 0 0 8px 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.page-subtitle {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
  font-weight: 400;
}

.header-stats {
  display: flex;
  gap: 20px;
}

.stat-card {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  padding: 20px 24px;
  border-radius: 12px;
  text-align: center;
  min-width: 120px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: transform 0.2s, background 0.2s;
}

.stat-card:hover {
  transform: translateY(-2px);
  background: rgba(255, 255, 255, 0.2);
}

.stat-number {
  font-size: 20px;
  font-weight: 700;
  color: white;
  margin-bottom: 6px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.stat-label {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.content-container {
  padding: 40px;
}

/* Ajouter styles pour le dashboard */
.dashboard-section {
  margin-bottom: 40px;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
}

.dashboard-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #f1f5f9;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.card-header h3 {
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.year-select, .view-all-btn, .add-budget-btn {
  padding: 6px 12px;
  border: 2px solid #e2e8f0;
  border-radius: 6px;
  background: #f8fafc;
  color: #475569;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.view-all-btn:hover, .add-budget-btn:hover {
  border-color: #f59e0b;
  color: #f59e0b;
}

.chart-container {
  height: 200px;
}

.chart-bars {
  display: flex;
  align-items: end;
  justify-content: space-between;
  height: 160px;
  padding: 0 10px;
  margin-bottom: 20px;
}

.chart-bar-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  flex: 1;
  max-width: 40px;
}

.chart-bar {
  width: 16px;
  min-height: 4px;
  border-radius: 2px;
  transition: all 0.3s;
}

.recette-bar {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}

.depense-bar {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
}

.chart-label {
  font-size: 10px;
  color: #64748b;
  font-weight: 600;
  text-align: center;
}

.chart-legend {
  display: flex;
  justify-content: center;
  gap: 20px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #64748b;
  font-weight: 500;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 2px;
}

.recette-color {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}

.depense-color {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
}

.category-list, .budget-list, .recent-transactions {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.category-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.category-info {
  display: flex;
  flex-direction: column;
  min-width: 120px;
}

.category-name {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
}

.category-amount {
  font-size: 12px;
  color: #64748b;
}

.category-bar {
  flex: 1;
  height: 8px;
  background: #f1f5f9;
  border-radius: 4px;
  overflow: hidden;
}

.category-progress {
  height: 100%;
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  border-radius: 4px;
  transition: width 0.3s;
}

.category-percentage {
  font-size: 12px;
  font-weight: 600;
  color: #f59e0b;
  min-width: 40px;
  text-align: right;
}

.budget-item {
  padding: 16px;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.budget-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.budget-name {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
}

.budget-status {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status-started {
  background: #dbeafe;
  color: #1d4ed8;
}

.status-progress {
  background: #fef3c7;
  color: #d97706;
}

.status-warning {
  background: #fed7aa;
  color: #ea580c;
}

.status-critical {
  background: #fee2e2;
  color: #dc2626;
}

.budget-progress-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.budget-progress-bar {
  height: 6px;
  background: #e2e8f0;
  border-radius: 3px;
  overflow: hidden;
}

.budget-progress-fill {
  height: 100%;
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  border-radius: 3px;
  transition: width 0.3s;
}

.budget-amounts {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
}

.budget-spent {
  font-weight: 600;
  color: #1e293b;
}

.budget-total {
  color: #64748b;
}

.recent-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  transition: all 0.2s;
}

.recent-item:hover {
  background: #f1f5f9;
  transform: translateY(-1px);
}

.recent-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
}

.recette-icon {
  background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%);
}

.depense-icon {
  background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
}

.recent-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.recent-description {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
}

.recent-category {
  font-size: 12px;
  color: #64748b;
}

.recent-amount {
  font-size: 14px;
  font-weight: 700;
}

.recette-amount {
  color: #059669;
}

.depense-amount {
  color: #dc2626;
}

/* Styles existants améliorés */
.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  flex-wrap: wrap;
  gap: 20px;
}

.content-title {
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.primary-btn {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 2px 4px rgba(245, 158, 11, 0.2);
}

.primary-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(245, 158, 11, 0.3);
}

.secondary-btn {
  background: white;
  color: #475569;
  border: 2px solid #e2e8f0;
  padding: 10px 18px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.secondary-btn:hover {
  border-color: #f59e0b;
  color: #f59e0b;
  transform: translateY(-1px);
}

.filters-section {
  background: white;
  padding: 24px;
  border-radius: 12px;
  margin-bottom: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #f1f5f9;
}

.search-container {
  margin-bottom: 20px;
}

.search-input {
  width: 100%;
  max-width: 400px;
  padding: 12px 16px 12px 44px;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-size: 15px;
  background: #f8fafc;
  color: #334155;
  transition: all 0.2s;
  font-weight: 500;
}

.search-input:focus {
  outline: none;
  border-color: #f59e0b;
  background: white;
  box-shadow: 0 0 0 4px rgba(245, 158, 11, 0.1);
}

.filters-container {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.filter-select {
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  background: #f8fafc;
  color: #334155;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  min-width: 160px;
}

.filter-select:focus {
  outline: none;
  border-color: #f59e0b;
  background: white;
  box-shadow: 0 0 0 4px rgba(245, 158, 11, 0.1);
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  color: #64748b;
  background: white;
  border-radius: 12px;
}

.loading-spinner {
  width: 48px;
  height: 48px;
  border: 4px solid #f1f5f9;
  border-top: 4px solid #f59e0b;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

.table-container {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  border: 1px solid #f1f5f9;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  padding: 20px 16px;
  text-align: left;
  font-weight: 700;
  color: #1e293b;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 2px solid #e2e8f0;
}

.data-table td {
  padding: 20px 16px;
  border-bottom: 1px solid #f1f5f9;
  font-size: 14px;
  color: #475569;
}

.table-row {
  transition: background-color 0.2s;
}

.table-row:hover {
  background: #f8fafc;
}

.description-cell {
  min-width: 200px;
}

.transaction-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.transaction-description {
  font-weight: 600;
  color: #1e293b;
}

.transaction-projet {
  font-size: 12px;
  color: #64748b;
  font-style: italic;
}

.category-badge {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.category-badge.cotisations {
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
  color: #1d4ed8;
  border: 1px solid #93c5fd;
}

.category-badge.dons {
  background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%);
  color: #16a34a;
  border: 1px solid #86efac;
}

.category-badge.subventions {
  background: linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%);
  color: #7c3aed;
  border: 1px solid #c4b5fd;
}

.category-badge.evenements {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  color: #d97706;
  border: 1px solid #fbbf24;
}

.category-badge.equipement {
  background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
  color: #059669;
  border: 1px solid #6ee7b7;
}

.category-badge.fournitures {
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  color: #0369a1;
  border: 1px solid #7dd3fc;
}

.category-badge.administration {
  background: linear-gradient(135deg, #fafafa 0%, #f4f4f5 100%);
  color: #52525b;
  border: 1px solid #a1a1aa;
}

.category-badge.transport {
  background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
  color: #dc2626;
  border: 1px solid #f87171;
}

.category-badge.communication {
  background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
  color: #d97706;
  border: 1px solid #fbbf24;
}

.category-badge.formation {
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
  color: #16a34a;
  border: 1px solid #86efac;
}

.type-badge {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.type-badge.recette {
  background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%);
  color: #16a34a;
  border: 1px solid #86efac;
}

.type-badge.depense {
  background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
  color: #dc2626;
  border: 1px solid #f87171;
}

.amount-cell {
  font-weight: 700;
  font-size: 15px;
}

.reference-code {
  font-family: 'JetBrains Mono', monospace;
  background: #f1f5f9;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  color: #475569;
}

.no-reference {
  color: #94a3b8;
  font-style: italic;
}

.actions-cell {
  min-width: 160px;
}

.action-buttons {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.action-btn {
  padding: 8px 10px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 32px;
  height: 32px;
}

.action-btn.view-btn {
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
  border: 1px solid #93c5fd;
}

.action-btn.edit-btn {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border: 1px solid #fbbf24;
}

.action-btn.duplicate-btn {
  background: linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%);
  border: 1px solid #c4b5fd;
}

.action-btn.delete-btn {
  background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
  border: 1px solid #f87171;
}

.action-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.pagination-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-top: 2px solid #f1f5f9;
  background: #f8fafc;
}

.pagination-info {
  font-size: 14px;
  color: #64748b;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 12px;
}

.pagination-btn {
  padding: 8px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  background: white;
  color: #475569;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.pagination-btn:hover:not(:disabled) {
  border-color: #f59e0b;
  color: #f59e0b;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-numbers {
  display: flex;
  gap: 4px;
}

.pagination-number {
  padding: 8px 12px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  background: white;
  color: #475569;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.pagination-number:hover {
  border-color: #f59e0b;
  color: #f59e0b;
}

.pagination-number.active {
  background: #f59e0b;
  border-color: #f59e0b;
  color: white;
}

/* Modal styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  background: white;
  border-radius: 16px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  border: 1px solid #f1f5f9;
}

.modal-content.large-modal {
  max-width: 900px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 28px;
  border-bottom: 2px solid #f1f5f9;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
}

.modal-header h3 {
  font-size: 20px;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.close-btn {
  background: #f1f5f9;
  border: 2px solid #e2e8f0;
  font-size: 20px;
  color: #64748b;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.close-btn:hover {
  background: #e2e8f0;
  color: #475569;
  transform: scale(1.05);
}

.modal-form {
  padding: 28px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.form-input, .form-select, .form-textarea {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-size: 15px;
  color: #334155;
  background: #f8fafc;
  transition: all 0.2s;
  font-weight: 500;
}

.form-input:focus, .form-select:focus, .form-textarea:focus {
  outline: none;
  border-color: #f59e0b;
  background: white;
  box-shadow: 0 0 0 4px rgba(245, 158, 11, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
  font-family: inherit;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 2px solid #f1f5f9;
}

.cancel-btn {
  padding: 12px 24px;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  background: white;
  color: #475569;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.cancel-btn:hover {
  background: #f8fafc;
  border-color: #cbd5e1;
  transform: translateY(-1px);
}

.save-btn {
  padding: 12px 24px;
  border: none;
  border-radius: 10px;
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: white;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 2px 4px rgba(245, 158, 11, 0.2);
}

.save-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(245, 158, 11, 0.3);
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    gap: 20px;
    align-items: flex-start;
    padding: 24px;
  }

  .header-stats {
    width: 100%;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 12px;
  }

  .stat-card {
    flex: 1;
    min-width: 100px;
  }

  .content-container {
    padding: 20px;
  }

  .dashboard-grid {
    grid-template-columns: 1fr;
  }

  .content-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .header-actions {
    width: 100%;
    flex-direction: column;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .filters-container {
    flex-direction: column;
  }

  .search-input {
    max-width: 100%;
  }

  .pagination-container {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }
}
</style>
