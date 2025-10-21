<template>
  <div class="materiel-page">
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">📦 Gestion du Matériel</h1><br/>
        <p class="page-subtitle">Administration du matériel de l'AEEMCI</p>
      </div>
      <div class="header-stats">
        <div class="stat-card">
          <div class="stat-number">{{ pagination.total || 0 }}</div>
          <div class="stat-label">Matériels</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">{{ totalQuantiteStock }}</div>
          <div class="stat-label">Unités en stock</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">{{ totalQuantitePret }}</div>
          <div class="stat-label">Unités en prêt</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">{{ materielsEnRetard }}</div>
          <div class="stat-label">En retard</div>
        </div>
      </div>
    </div>

    <div class="content-container">
      <div class="content-header">
        <h2 class="content-title">Liste du Matériel</h2>
        <div class="header-actions">
          <button @click="showHistoriqueModal = true" class="secondary-btn">
            📊 Historique des mouvements
          </button>
          <button @click="showRapportModal = true" class="secondary-btn">
            📈 Rapport par période
          </button>
          <button @click="showAddMateriel = true" class="primary-btn">
            ➕ Nouveau matériel
          </button>
        </div>
      </div>

       Filtres et recherche 
      <div class="filters-section">
        <div class="search-container">
          <input type="text" v-model="searchTerm" placeholder="Rechercher un matériel..." class="search-input">
        </div>
        <div class="filters-container">
          <select v-model="filterType" class="filter-select">
            <option value="">Tous les types</option>
            <option value="Informatique">Informatique</option>
            <option value="Audio-Visuel">Audio-Visuel</option>
            <option value="Mobilier">Mobilier</option>
            <option value="Électronique">Électronique</option>
          </select>
          <select v-model="filterEtat" class="filter-select">
            <option value="">Tous les états</option>
            <option value="En stock">En stock</option>
            <option value="En prêt">En prêt</option>
            <option value="En maintenance">En maintenance</option>
            <option value="Hors service">Hors service</option>
          </select>
        </div>
      </div>

       Table du matériel 
      <div v-if="loading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>Chargement des matériels...</p>
      </div>

      <div v-else class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>Matériel</th>
              <th>Type</th>
              <th>Quantité</th>
              <th>État</th>
              <th>Localisation</th>
              <th>Activité liée</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="materiel in materiels" :key="materiel.id" class="table-row">
              <td class="name-cell">
                <div class="materiel-info">
                  <span class="materiel-nom">{{ materiel.nom }}</span>
                  <span class="materiel-description">{{ materiel.description }}</span>
                  <span v-if="materiel.numero_serie" class="numero-serie">N° {{ materiel.numero_serie }}</span>
                </div>
              </td>
              <td>
                <span :class="['type-badge', getTypeClass(materiel.type)]">{{ materiel.type }}</span>
              </td>
               <!-- Ajout de la gestion des quantités -->
              <td class="quantity-cell">
                <div class="quantity-info">
                  <div class="quantity-total">Total: {{ materiel.quantite_totale }}</div>
                  <div class="quantity-available">Dispo: {{ materiel.quantite_disponible }}</div>
                  <div v-if="materiel.quantite_pret > 0" class="quantity-loan">Prêt: {{ materiel.quantite_pret }}</div>
                </div>
              </td>
              <td>
                <span :class="['status-badge', getStatusClass(materiel.etat)]">{{ materiel.etat }}</span>
                <div v-if="materiel.etat === 'En prêt' && isEnRetard(materiel)" class="retard-badge">En retard</div>
              </td>
              <td>{{ materiel.localisation }}</td>
               <!-- Ajout de l'activité liée -->
              <td>
                <span v-if="materiel.activite_liee" class="activite-badge">{{ materiel.activite_liee }}</span>
                <span v-else class="no-activite">-</span>
              </td>
              <td class="actions-cell">
                <div class="action-buttons">
                  <button @click="viewMateriel(materiel)" class="action-btn view-btn" title="Voir détails">👁️</button>
                  <button @click="viewHistorique(materiel)" class="action-btn history-btn" title="Historique">📋</button>
                  <button v-if="materiel.quantite_disponible > 0" @click="loanMateriel(materiel)" class="action-btn loan-btn" title="Prêter">📤</button>
                  <button v-if="materiel.quantite_pret > 0" @click="showReturnModal(materiel)" class="action-btn return-btn" title="Retour">📥</button>
                  <button @click="editMateriel(materiel)" class="action-btn edit-btn" title="Modifier">✏️</button>
                  <button @click="deleteMateriel(materiel)" class="action-btn delete-btn" title="Supprimer">🗑️</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

     Modal Ajout/Modification Matériel 
    <div v-if="showAddMateriel || showEditMateriel" class="modal-overlay" @click="closeModals">
      <div class="modal-content large-modal" @click.stop>
        <div class="modal-header">
          <h3>{{ showEditMateriel ? 'Modifier le Matériel' : 'Nouveau Matériel' }}</h3>
          <button @click="closeModals" class="close-btn">×</button>
        </div>
        
        <form @submit.prevent="saveMateriel" class="modal-form">
          <div class="form-row">
            <div class="form-group">
              <label>Nom du matériel *</label>
              <input type="text" v-model="newMateriel.nom" required class="form-input">
            </div>
            <div class="form-group">
              <label>Type de matériel *</label>
              <select v-model="newMateriel.type" required class="form-select">
                <option value="">Sélectionner un type</option>
                <option value="Informatique">Informatique</option>
                <option value="Audio-Visuel">Audio-Visuel</option>
                <option value="Mobilier">Mobilier</option>
                <option value="Électronique">Électronique</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label>Description</label>
            <textarea v-model="newMateriel.description" class="form-textarea" rows="3"></textarea>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Numéro de série</label>
              <input type="text" v-model="newMateriel.numero_serie" class="form-input">
            </div>
             <!-- Ajout de la quantité totale -->
            <div class="form-group">
              <label>Quantité totale *</label>
              <input type="number" v-model="newMateriel.quantite_totale" required class="form-input" min="1">
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Date d'entrée *</label>
              <input type="date" v-model="newMateriel.date_entree" required class="form-input">
            </div>
            <div class="form-group">
              <label>Valeur unitaire (FCFA)</label>
              <input type="number" v-model="newMateriel.valeur_unitaire" class="form-input" min="0">
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Responsable - Nom *</label>
              <input type="text" v-model="newMateriel.responsable_nom" required class="form-input">
            </div>
            <div class="form-group">
              <label>Responsable - Téléphone</label>
              <input type="tel" v-model="newMateriel.responsable_telephone" class="form-input">
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Localisation *</label>
              <input type="text" v-model="newMateriel.localisation" required class="form-input" 
                     placeholder="ex: Bureau AEEMCI, Salle de réunion...">
            </div>
             <!-- Ajout de l'activité liée -->
            <div class="form-group">
              <label>Activité liée</label>
              <select v-model="newMateriel.activite_liee" class="form-select">
                <option value="">Aucune activité</option>
                <option value="Conférence IA 2024">Conférence IA 2024</option>
                <option value="Formation Leadership">Formation Leadership</option>
                <option value="Assemblée Générale">Assemblée Générale</option>
                <option value="Journée Culturelle">Journée Culturelle</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label>Observations</label>
            <textarea v-model="newMateriel.observations" class="form-textarea" rows="4" 
                      placeholder="Notes importantes sur ce matériel..."></textarea>
          </div>

          <div class="modal-actions">
            <button type="button" @click="closeModals" class="cancel-btn">Annuler</button>
            <button type="submit" class="save-btn">{{ showEditMateriel ? 'Modifier' : 'Ajouter' }}</button>
          </div>
        </form>
      </div>
    </div>

     Modal Prêt de Matériel 
    <div v-if="showLoanModal" class="modal-overlay" @click="closeModals">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Prêter le matériel: {{ currentMateriel?.nom }}</h3>
          <button @click="closeModals" class="close-btn">×</button>
        </div>
        
        <form @submit.prevent="confirmLoan" class="modal-form">
           <!-- Ajout de la quantité à prêter -->
          <div class="form-row">
            <div class="form-group">
              <label>Quantité à prêter *</label>
              <input type="number" v-model="loanData.quantite" required class="form-input" 
                     :max="currentMateriel?.quantite_disponible" min="1">
              <small>Disponible: {{ currentMateriel?.quantite_disponible }}</small>
            </div>
            <div class="form-group">
              <label>Date de retour prévue *</label>
              <input type="date" v-model="loanData.date_retour_prevue" required class="form-input">
            </div>
          </div>

          <div class="form-group">
            <label>Emprunteur - Nom *</label>
            <input type="text" v-model="loanData.emprunteur_nom" required class="form-input">
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Emprunteur - Téléphone</label>
              <input type="tel" v-model="loanData.emprunteur_telephone" class="form-input">
            </div>
            <div class="form-group">
              <label>Emprunteur - Organisation</label>
              <input type="text" v-model="loanData.emprunteur_organisation" class="form-input">
            </div>
          </div>

          <div class="form-group">
            <label>Motif du prêt *</label>
            <textarea v-model="loanData.motif" class="form-textarea" rows="3" required
                      placeholder="Raison du prêt..."></textarea>
          </div>

          <div class="modal-actions">
            <button type="button" @click="closeModals" class="cancel-btn">Annuler</button>
            <button type="submit" class="save-btn">Confirmer le prêt</button>
          </div>
        </form>
      </div>
    </div>

     <!-- Modal Retour de Matériel -->
    <div v-if="showReturnMaterielModal" class="modal-overlay" @click="closeModals">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Retour du matériel: {{ currentMateriel?.nom }}</h3>
          <button @click="closeModals" class="close-btn">×</button>
        </div>
        
        <div class="modal-form">
          <div class="prets-actifs">
            <h4>Prêts actifs:</h4>
            <div v-for="pret in pretsActifs" :key="pret.id" class="pret-item">
              <div class="pret-info">
                <div class="pret-details">
                  <strong>{{ pret.emprunteur_nom }}</strong> - {{ pret.quantite }} unité(s)
                  <div class="pret-dates">
                    Prêté le {{ formatDate(pret.date_pret) }} - Retour prévu: {{ formatDate(pret.date_retour_prevue) }}
                  </div>
                  <div v-if="isEnRetard(pret)" class="retard-warning">⚠️ En retard</div>
                </div>
                <div class="pret-actions">
                  <button @click="confirmerRetour(pret)" class="return-btn">Retour complet</button>
                  <button @click="retourPartiel(pret)" class="partial-return-btn">Retour partiel</button>
                  <button @click="declareNonRetour(pret)" class="no-return-btn">Non retourné</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

     <!-- Modal Déclaration de non-retour -->
    <div v-if="showNonRetourModal" class="modal-overlay" @click="closeModals">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Déclaration de non-retour</h3>
          <button @click="closeModals" class="close-btn">×</button>
        </div>
        
        <form @submit.prevent="confirmerNonRetour" class="modal-form">
          <div class="form-group">
            <label>Motif du non-retour *</label>
            <select v-model="nonRetourData.motif" required class="form-select">
              <option value="">Sélectionner un motif</option>
              <option value="Perdu">Perdu</option>
              <option value="Volé">Volé</option>
              <option value="Cassé">Cassé/Endommagé</option>
              <option value="Non rendu">Non rendu par l'emprunteur</option>
              <option value="Autre">Autre</option>
            </select>
          </div>

          <div class="form-group">
            <label>Quantité non retournée *</label>
            <input type="number" v-model="nonRetourData.quantite" required class="form-input" 
                   :max="currentPret?.quantite" min="1">
          </div>

          <div class="form-group">
            <label>Description détaillée *</label>
            <textarea v-model="nonRetourData.description" class="form-textarea" rows="4" required
                      placeholder="Expliquez les circonstances du non-retour..."></textarea>
          </div>

          <div class="form-group">
            <label>Action à entreprendre</label>
            <textarea v-model="nonRetourData.action_entreprendre" class="form-textarea" rows="3"
                      placeholder="Mesures prises ou à prendre..."></textarea>
          </div>

          <div class="modal-actions">
            <button type="button" @click="closeModals" class="cancel-btn">Annuler</button>
            <button type="submit" class="save-btn">Confirmer</button>
          </div>
        </form>
      </div>
    </div>

     <!-- Modal Historique des mouvements -->
    <div v-if="showHistoriqueModal" class="modal-overlay" @click="closeModals">
      <div class="modal-content large-modal" @click.stop>
        <div class="modal-header">
          <h3>Historique des mouvements</h3>
          <button @click="closeModals" class="close-btn">×</button>
        </div>
        
        <div class="historique-content">
          <div class="historique-filters">
            <input type="text" v-model="historiqueSearch" placeholder="Rechercher..." class="search-input">
            <select v-model="historiqueFilter" class="filter-select">
              <option value="">Tous les mouvements</option>
              <option value="entree">Entrées</option>
              <option value="sortie">Sorties</option>
              <option value="retour">Retours</option>
              <option value="non_retour">Non retours</option>
            </select>
          </div>
          
          <div class="historique-table">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Matériel</th>
                  <th>Type mouvement</th>
                  <th>Quantité</th>
                  <th>Responsable/Emprunteur</th>
                  <th>Motif</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="mouvement in historiqueFiltered" :key="mouvement.id">
                  <td>{{ formatDate(mouvement.date) }}</td>
                  <td>{{ mouvement.materiel_nom }}</td>
                  <td>
                    <span :class="['mouvement-badge', mouvement.type]">{{ getMouvementLabel(mouvement.type) }}</span>
                  </td>
                  <td>{{ mouvement.quantite }}</td>
                  <td>{{ mouvement.responsable || mouvement.emprunteur }}</td>
                  <td>{{ mouvement.motif || '-' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

     <!-- Modal Rapport par période -->
    <div v-if="showRapportModal" class="modal-overlay" @click="closeModals">
      <div class="modal-content large-modal" @click.stop>
        <div class="modal-header">
          <h3>Rapport par période</h3>
          <button @click="closeModals" class="close-btn">×</button>
        </div>
        
        <div class="rapport-content">
          <div class="rapport-filters">
            <div class="form-row">
              <div class="form-group">
                <label>Date de début</label>
                <input type="date" v-model="rapportDateDebut" class="form-input">
              </div>
              <div class="form-group">
                <label>Date de fin</label>
                <input type="date" v-model="rapportDateFin" class="form-input">
              </div>
              <div class="form-group">
                <button @click="genererRapport" class="primary-btn">Générer</button>
              </div>
            </div>
          </div>
          
          <div v-if="rapportData" class="rapport-results">
            <div class="rapport-stats">
              <div class="stat-card">
                <div class="stat-number">{{ rapportData.total_sorties }}</div>
                <div class="stat-label">Sorties</div>
              </div>
              <div class="stat-card">
                <div class="stat-number">{{ rapportData.total_retours }}</div>
                <div class="stat-label">Retours</div>
              </div>
              <div class="stat-card">
                <div class="stat-number">{{ rapportData.total_non_retours }}</div>
                <div class="stat-label">Non retours</div>
              </div>
              <div class="stat-card">
                <div class="stat-number">{{ rapportData.valeur_totale }} FCFA</div>
                <div class="stat-label">Valeur impliquée</div>
              </div>
            </div>
            
            <div class="rapport-details">
              <h4>Détails par matériel</h4>
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Matériel</th>
                    <th>Sorties</th>
                    <th>Retours</th>
                    <th>En cours</th>
                    <th>Non retours</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="detail in rapportData.details" :key="detail.materiel_id">
                    <td>{{ detail.materiel_nom }}</td>
                    <td>{{ detail.sorties }}</td>
                    <td>{{ detail.retours }}</td>
                    <td>{{ detail.en_cours }}</td>
                    <td>{{ detail.non_retours }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

// État de l'application
const loading = ref(false)
const searchTerm = ref('')
const filterType = ref('')
const filterEtat = ref('')

// Modals
const showAddMateriel = ref(false)
const showEditMateriel = ref(false)
const showViewModal = ref(false)
const showLoanModal = ref(false)
const showReturnMaterielModal = ref(false)
const showNonRetourModal = ref(false)
const showHistoriqueModal = ref(false)
const showRapportModal = ref(false)

// Pagination
const pagination = ref({
  currentPage: 1,
  itemsPerPage: 10,
  total: 0
})

const API_BASE_URL = 'https://sogetrag.com/api/materiel.php'

const materiels = ref([
  {
    id: 1,
    nom: 'Ordinateur portable Dell Latitude 5520',
    description: 'Ordinateur portable i7, 16GB RAM, 512GB SSD pour les activités administratives et formations',
    type: 'Informatique',
    numero_serie: 'DL2024001',
    etat: 'En stock',
    quantite_totale: 8,
    quantite_disponible: 5,
    quantite_pret: 3,
    date_entree: '2024-01-15',
    responsable_nom: 'Amadou Diallo',
    responsable_telephone: '+221 77 123 45 67',
    localisation: 'Bureau AEEMCI - Salle informatique',
    valeur_unitaire: 650000,
    activite_liee: 'Formation Leadership Digital',
    observations: 'Excellent état, garantie jusqu\'en 2026. Logiciels Office et développement installés'
  },
  {
    id: 2,
    nom: 'Projecteur Epson EB-X41 3LCD',
    description: 'Projecteur haute définition 3600 lumens pour conférences et présentations',
    type: 'Audio-Visuel',
    numero_serie: 'EP2024002',
    etat: 'En prêt',
    quantite_totale: 3,
    quantite_disponible: 1,
    quantite_pret: 2,
    date_entree: '2024-02-10',
    responsable_nom: 'Fatou Sall',
    responsable_telephone: '+221 76 987 65 43',
    localisation: 'Amphithéâtre A - Régie technique',
    valeur_unitaire: 420000,
    activite_liee: 'Conférence IA & Innovation 2024',
    observations: 'Prêté pour la conférence sur l\'IA. Lampe changée récemment (500h d\'utilisation)'
  },
  {
    id: 3,
    nom: 'Chaises pliantes métalliques',
    description: 'Chaises pliantes robustes en métal avec assise rembourrée pour événements',
    type: 'Mobilier',
    numero_serie: null,
    etat: 'En stock',
    quantite_totale: 120,
    quantite_disponible: 85,
    quantite_pret: 35,
    date_entree: '2024-01-20',
    responsable_nom: 'Moussa Ba',
    responsable_telephone: '+221 78 456 78 90',
    localisation: 'Entrepôt principal - Zone A',
    valeur_unitaire: 18000,
    activite_liee: null,
    observations: 'Bon état général. Quelques rayures mineures sur 5-6 chaises. Nettoyage mensuel effectué'
  },
  {
    id: 4,
    nom: 'Système audio JBL EON615',
    description: 'Enceintes amplifiées 1000W avec mixeur pour événements et conférences',
    type: 'Audio-Visuel',
    numero_serie: 'JBL2024003',
    etat: 'En maintenance',
    quantite_totale: 2,
    quantite_disponible: 0,
    quantite_pret: 0,
    date_entree: '2024-03-05',
    responsable_nom: 'Ibrahima Koné',
    responsable_telephone: '+221 77 234 56 78',
    localisation: 'Atelier technique',
    valeur_unitaire: 850000,
    activite_liee: 'Journée Culturelle AEEMCI',
    observations: 'En réparation - problème de connecteur XLR. Retour prévu dans 1 semaine'
  },
  {
    id: 5,
    nom: 'Tables pliantes rectangulaires',
    description: 'Tables pliantes 180x80cm en bois stratifié pour réunions et formations',
    type: 'Mobilier',
    numero_serie: null,
    etat: 'En stock',
    quantite_totale: 25,
    quantite_disponible: 20,
    quantite_pret: 5,
    date_entree: '2024-02-28',
    responsable_nom: 'Aïcha Touré',
    responsable_telephone: '+221 76 345 67 89',
    localisation: 'Entrepôt principal - Zone B',
    valeur_unitaire: 45000,
    activite_liee: 'Formation Entrepreneuriat',
    observations: 'Neuves, livrées le mois dernier. Très bon état, faciles à manipuler'
  },
  {
    id: 6,
    nom: 'Tablettes Samsung Galaxy Tab A8',
    description: 'Tablettes Android 10.5" pour formations numériques et enquêtes terrain',
    type: 'Informatique',
    numero_serie: 'SGT2024004',
    etat: 'En prêt',
    quantite_totale: 15,
    quantite_disponible: 8,
    quantite_pret: 7,
    date_entree: '2024-03-12',
    responsable_nom: 'Mamadou Camara',
    responsable_telephone: '+221 77 456 78 90',
    localisation: 'Bureau AEEMCI - Armoire sécurisée',
    valeur_unitaire: 180000,
    activite_liee: 'Enquête Besoins Étudiants 2024',
    observations: 'Applications éducatives installées. Coques de protection fournies. Chargeurs inclus'
  },
  {
    id: 7,
    nom: 'Écran LED 55" Samsung',
    description: 'Écran LED 4K 55 pouces pour présentations et affichage dynamique',
    type: 'Audio-Visuel',
    numero_serie: 'SAM2024005',
    etat: 'En stock',
    quantite_totale: 1,
    quantite_disponible: 1,
    quantite_pret: 0,
    date_entree: '2024-03-20',
    responsable_nom: 'Khadija Ndiaye',
    responsable_telephone: '+221 76 567 89 01',
    localisation: 'Salle de conférence principale',
    valeur_unitaire: 750000,
    activite_liee: null,
    observations: 'Installation murale récente. Support mural inclus. Télécommande et câbles HDMI fournis'
  },
  {
    id: 8,
    nom: 'Imprimante laser HP LaserJet Pro',
    description: 'Imprimante laser noir et blanc A4, recto-verso automatique',
    type: 'Informatique',
    numero_serie: 'HP2024006',
    etat: 'Hors service',
    quantite_totale: 2,
    quantite_disponible: 1,
    quantite_pret: 0,
    date_entree: '2023-11-15',
    responsable_nom: 'Ousmane Diouf',
    responsable_telephone: '+221 77 678 90 12',
    localisation: 'Bureau administratif',
    valeur_unitaire: 280000,
    activite_liee: null,
    observations: 'Une unité HS (bourrage papier récurrent). L\'autre fonctionne parfaitement. Toner récent'
  }
])

const historiqueMouvements = ref([
  {
    id: 1,
    materiel_id: 1,
    materiel_nom: 'Ordinateur portable Dell Latitude 5520',
    type: 'entree',
    quantite: 8,
    date: '2024-01-15',
    responsable: 'Amadou Diallo',
    motif: 'Achat initial - Dotation informatique 2024'
  },
  {
    id: 2,
    materiel_id: 1,
    materiel_nom: 'Ordinateur portable Dell Latitude 5520',
    type: 'sortie',
    quantite: 3,
    date: '2024-02-20',
    emprunteur: 'Aissata Traoré - Responsable Formation',
    motif: 'Formation Leadership Digital - 3 jours'
  },
  {
    id: 3,
    materiel_id: 2,
    materiel_nom: 'Projecteur Epson EB-X41 3LCD',
    type: 'entree',
    quantite: 3,
    date: '2024-02-10',
    responsable: 'Fatou Sall',
    motif: 'Achat pour équipement audiovisuel'
  },
  {
    id: 4,
    materiel_id: 2,
    materiel_nom: 'Projecteur Epson EB-X41 3LCD',
    type: 'sortie',
    quantite: 2,
    date: '2024-03-15',
    emprunteur: 'Université Cheikh Anta Diop',
    motif: 'Conférence IA & Innovation 2024 - Partenariat UCAD'
  },
  {
    id: 5,
    materiel_id: 3,
    materiel_nom: 'Chaises pliantes métalliques',
    type: 'entree',
    quantite: 120,
    date: '2024-01-20',
    responsable: 'Moussa Ba',
    motif: 'Renouvellement mobilier événementiel'
  },
  {
    id: 6,
    materiel_id: 3,
    materiel_nom: 'Chaises pliantes métalliques',
    type: 'sortie',
    quantite: 35,
    date: '2024-03-10',
    emprunteur: 'Association Étudiants Médecine',
    motif: 'Assemblée Générale - Prêt inter-association'
  },
  {
    id: 7,
    materiel_id: 6,
    materiel_nom: 'Tablettes Samsung Galaxy Tab A8',
    type: 'entree',
    quantite: 15,
    date: '2024-03-12',
    responsable: 'Mamadou Camara',
    motif: 'Acquisition pour digitalisation des enquêtes'
  },
  {
    id: 8,
    materiel_id: 6,
    materiel_nom: 'Tablettes Samsung Galaxy Tab A8',
    type: 'sortie',
    quantite: 7,
    date: '2024-03-25',
    emprunteur: 'Équipe Enquête Terrain',
    motif: 'Enquête Besoins Étudiants 2024 - Mission 2 semaines'
  },
  {
    id: 9,
    materiel_id: 1,
    materiel_nom: 'Ordinateur portable Dell Latitude 5520',
    type: 'retour',
    quantite: 2,
    date: '2024-03-22',
    emprunteur: 'Aissata Traoré',
    motif: 'Retour partiel - Formation terminée'
  },
  {
    id: 10,
    materiel_id: 8,
    materiel_nom: 'Imprimante laser HP LaserJet Pro',
    type: 'non_retour',
    quantite: 1,
    date: '2024-03-28',
    emprunteur: 'Service Maintenance',
    motif: 'Panne irréparable - Bourrage papier récurrent, coût réparation > valeur'
  }
])


// Computed properties
const totalQuantiteStock = computed(() => {
  return materiels.value.reduce((total, materiel) => total + materiel.quantite_disponible, 0)
})

const totalQuantitePret = computed(() => {
  return materiels.value.reduce((total, materiel) => total + materiel.quantite_pret, 0)
})

const materielsEnRetard = computed(() => {
  // Logique pour calculer les matériels en retard
  return pretsActifs.value.filter(pret => isEnRetard(pret)).length
})

const historiqueFiltered = computed(() => {
  let filtered = historiqueMouvements.value
  
  if (historiqueSearch.value) {
    filtered = filtered.filter(mouvement => 
      mouvement.materiel_nom.toLowerCase().includes(historiqueSearch.value.toLowerCase()) ||
      (mouvement.responsable && mouvement.responsable.toLowerCase().includes(historiqueSearch.value.toLowerCase())) ||
      (mouvement.emprunteur && mouvement.emprunteur.toLowerCase().includes(historiqueSearch.value.toLowerCase()))
    )
  }
  
  if (historiqueFilter.value) {
    filtered = filtered.filter(mouvement => mouvement.type === historiqueFilter.value)
  }
  
  return filtered.sort((a, b) => new Date(b.date) - new Date(a.date))
})

// Fonctions utilitaires
const getTypeClass = (type) => {
  switch(type) {
    case 'Informatique': return 'informatique'
    case 'Audio-Visuel': return 'audio-visuel'
    case 'Mobilier': return 'mobilier'
    case 'Électronique': return 'electronique'
    default: return 'default'
  }
}

const getStatusClass = (etat) => {
  switch(etat) {
    case 'En stock': return 'en-stock'
    case 'En prêt': return 'en-pret'
    case 'En maintenance': return 'en-maintenance'
    case 'Hors service': return 'hors-service'
    default: return 'default'
  }
}

const isEnRetard = (pret) => {
  if (!pret.date_retour_prevue) return false
  return new Date(pret.date_retour_prevue) < new Date()
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('fr-FR')
}

const getMouvementLabel = (type) => {
  switch(type) {
    case 'entree': return 'Entrée'
    case 'sortie': return 'Sortie'
    case 'retour': return 'Retour'
    case 'non_retour': return 'Non retour'
    default: return type
  }
}

// Fonctions de recherche et filtrage
const debouncedSearch = () => {
  clearTimeout(searchTimeout.value)
  searchTimeout.value = setTimeout(() => {
    filters.value.search = searchTerm.value
    pagination.value.current_page = 1
    loadMateriels()
  }, 300)
}

const clearSearch = () => {
  searchTerm.value = ''
  filters.value.search = ''
  loadMateriels()
}

const selectType = (type) => {
  filters.value.type = type
  showTypeDropdown.value = false
  pagination.value.current_page = 1
  loadMateriels()
}

const selectEtat = (etat) => {
  filters.value.etat = etat
  showEtatDropdown.value = false
  pagination.value.current_page = 1
  loadMateriels()
}

// Fonctions de chargement des données
const loadMateriels = async () => {
  try {
    loading.value = true
    error.value = null
    
    let url = `${API_BASE_URL}?action=materiels&page=${pagination.value.current_page}&per_page=${pagination.value.per_page}&rand=${Math.random()}`

    if (filters.value.search) {
      url += `&search=${encodeURIComponent(filters.value.search)}` 
    }
    if (filters.value.type) {
      url += `&type=${encodeURIComponent(filters.value.type)}` 
    }
    if (filters.value.etat) {
      url += `&etat=${encodeURIComponent(filters.value.etat)}` 
    }
    
    const response = await fetch(url)
    const data = await response.json()
    
    if (data.success) {
      materiels.value = data.data || []
      
      if (data.pagination) {
        pagination.value = {
          current_page: data.pagination.current_page,
          per_page: data.pagination.per_page,
          total: data.pagination.total,
          last_page: data.pagination.last_page
        }
      }
    } else {
      error.value = data.message || 'Erreur lors du chargement du matériel'
    }
  } catch (err) {
    error.value = 'Erreur de connexion au serveur'
    console.error('Erreur:', err)
  } finally {
    loading.value = false
  }
}

// Fonctions de gestion du matériel
const viewMateriel = (materiel) => {
  currentMateriel.value = materiel
  showViewModal.value = true
}

const editMateriel = (materiel) => {
  currentMateriel.value = materiel
  newMateriel.value = { ...materiel }
  showEditMateriel.value = true
}

const deleteMateriel = async (materiel) => {
  if (!confirm(`Êtes-vous sûr de vouloir supprimer le matériel "${materiel.nom}" ?`)) {
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
        id: materiel.id
      })
    })

    const data = await response.json()
    
    if (data.success) {
      await loadMateriels()
    } else {
      alert('Erreur lors de la suppression: ' + (data.message || 'Erreur inconnue'))
    }
  } catch (err) {
    alert('Erreur de connexion lors de la suppression')
    console.error('Erreur:', err)
  }
}

const saveMateriel = async () => {
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: showEditMateriel.value ? 'update' : 'create',
        id: showEditMateriel.value ? currentMateriel.value.id : undefined,
        ...newMateriel.value
      })
    })

    const data = await response.json()
    
    if (data.success) {
      closeModals()
      await loadMateriels()
    } else {
      alert('Erreur lors de la sauvegarde: ' + (data.message || 'Erreur inconnue'))
    }
  } catch (err) {
    alert('Erreur de connexion lors de la sauvegarde')
    console.error('Erreur:', err)
  }
}

// Fonctions de prêt
const loanMateriel = (materiel) => {
  currentMateriel.value = materiel
  showLoanModal.value = true
}

const confirmLoan = async () => {
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'loan',
        id: currentMateriel.value.id,
        ...loanData.value
      })
    })

    const data = await response.json()
    
    if (data.success) {
      closeModals()
      await loadMateriels()
    } else {
      alert('Erreur lors du prêt: ' + (data.message || 'Erreur inconnue'))
    }
  } catch (err) {
    alert('Erreur de connexion lors du prêt')
    console.error('Erreur:', err)
  }
}

const returnMateriel = async (materiel) => {
  if (!confirm(`Confirmer le retour du matériel "${materiel.nom}" ?`)) {
    return
  }

  try {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'return',
        id: materiel.id
      })
    })

    const data = await response.json()
    
    if (data.success) {
      await loadMateriels()
    } else {
      alert('Erreur lors du retour: ' + (data.message || 'Erreur inconnue'))
    }
  } catch (err) {
    alert('Erreur de connexion lors du retour')
    console.error('Erreur:', err)
  }
}

const viewHistorique = (materiel) => {
  currentMateriel.value = materiel
  // Charger l'historique spécifique à ce matériel
  showHistoriqueModal.value = true
}

const showReturnModal = (materiel) => {
  currentMateriel.value = materiel
  // Charger les prêts actifs pour ce matériel
  loadPretsActifs(materiel.id)
  showReturnMaterielModal.value = true
}

const declareNonRetour = (pret) => {
  currentPret.value = pret
  nonRetourData.value.quantite = pret.quantite
  showNonRetourModal.value = true
}

const confirmerRetour = async (pret) => {
  // Logique pour confirmer le retour complet
  console.log('Retour complet confirmé pour:', pret)
}

const retourPartiel = (pret) => {
  // Logique pour le retour partiel
  console.log('Retour partiel pour:', pret)
}

const confirmerNonRetour = async () => {
  // Logique pour confirmer le non-retour
  console.log('Non-retour confirmé:', nonRetourData.value)
  closeModals()
}

const genererRapport = async () => {
  // Logique pour générer le rapport
  rapportData.value = {
    total_sorties: 25,
    total_retours: 20,
    total_non_retours: 2,
    valeur_totale: 1500000,
    details: [
      {
        materiel_id: 1,
        materiel_nom: 'Ordinateur portable Dell Latitude',
        sorties: 5,
        retours: 3,
        en_cours: 2,
        non_retours: 0
      }
    ]
  }
}

const loadPretsActifs = async (materielId) => {
  // Charger les prêts actifs pour un matériel
  pretsActifs.value = [
    {
      id: 1,
      materiel_id: materielId,
      emprunteur_nom: 'Aissata Traoré',
      quantite: 2,
      date_pret: '2024-02-20',
      date_retour_prevue: '2024-02-15' // En retard
    }
  ]
}

// Fonctions utilitaires
const closeModals = () => {
  showAddMateriel.value = false
  showEditMateriel.value = false
  showViewModal.value = false
  showLoanModal.value = false
  showReturnMaterielModal.value = false
  showNonRetourModal.value = false
  showHistoriqueModal.value = false
  showRapportModal.value = false
  currentMateriel.value = null
  currentPret.value = null
  newMateriel.value = {
    nom: '',
    description: '',
    type: '',
    numero_serie: '',
    quantite_totale: 1,
    date_entree: '',
    responsable_nom: '',
    responsable_telephone: '',
    localisation: '',
    valeur_unitaire: null,
    activite_liee: '',
    observations: ''
  }
  loanData.value = {
    quantite: 1,
    emprunteur_nom: '',
    emprunteur_telephone: '',
    emprunteur_organisation: '',
    date_retour_prevue: '',
    motif: ''
  }
  nonRetourData.value = {
    motif: '',
    quantite: 1,
    description: '',
    action_entreprendre: ''
  }
}

const changePage = (page) => {
  if (page >= 1 && page <= pagination.value.last_page) {
    pagination.value.current_page = page
    loadMateriels()
  }
}

// Gestion des clics extérieurs pour fermer les dropdowns
const handleClickOutside = (event) => {
  if (!event.target.closest('.filter-dropdown-container')) {
    showTypeDropdown.value = false
    showEtatDropdown.value = false
  }
}

// Lifecycle hooks
onMounted(() => {
  loadMateriels()
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

const pretsActifs = ref([])
const historiqueSearch = ref('')
const historiqueFilter = ref('')
const searchTimeout = ref(null)
const filters = ref({
  search: '',
  type: '',
  etat: ''
})
const showTypeDropdown = ref(false)
const showEtatDropdown = ref(false)
const error = ref(null)
const currentMateriel = ref(null)
const newMateriel = ref({
    nom: '',
    description: '',
    type: '',
    numero_serie: '',
    quantite_totale: 1,
    date_entree: '',
    responsable_nom: '',
    responsable_telephone: '',
    localisation: '',
    valeur_unitaire: null,
    activite_liee: '',
    observations: ''
  })
const loanData = ref({
    quantite: 1,
    emprunteur_nom: '',
    emprunteur_telephone: '',
    emprunteur_organisation: '',
    date_retour_prevue: '',
    motif: ''
  })
const currentPret = ref(null)
const nonRetourData = ref({
    motif: '',
    quantite: 1,
    description: '',
    action_entreprendre: ''
  })
const rapportData = ref(null)
const rapportDateDebut = ref('')
const rapportDateFin = ref('')
</script>

<style scoped>
/* Amélioration complète du design avec palette de couleurs cohérente */
.materiel-page {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  min-height: 100vh;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.page-header {
  background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
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
  min-width: 100px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: transform 0.2s, background 0.2s;
}

.stat-card:hover {
  transform: translateY(-2px);
  background: rgba(255, 255, 255, 0.2);
}

.stat-number {
  font-size: 28px;
  font-weight: 700;
  color: white;
  margin-bottom: 6px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.stat-label {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.content-container {
  padding: 40px;
}

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
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 2px 4px rgba(59, 130, 246, 0.2);
}

.primary-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(59, 130, 246, 0.3);
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
  border-color: #3b82f6;
  color: #3b82f6;
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
  border-color: #3b82f6;
  background: white;
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
}

.search-input::placeholder {
  color: #94a3b8;
  font-weight: 400;
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
  border-color: #3b82f6;
  background: white;
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
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
  border-top: 4px solid #3b82f6;
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

.materiel-info {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.materiel-nom {
  font-weight: 700;
  color: #1e293b;
  font-size: 15px;
}

.materiel-description {
  font-size: 13px;
  color: #64748b;
  line-height: 1.5;
}

.numero-serie {
  font-size: 11px;
  color: #94a3b8;
  font-family: 'JetBrains Mono', monospace;
  background: #f1f5f9;
  padding: 2px 6px;
  border-radius: 4px;
  display: inline-block;
  width: fit-content;
}

.quantity-cell {
  min-width: 120px;
}

.quantity-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.quantity-total {
  font-weight: 700;
  color: #1e293b;
  font-size: 15px;
}

.quantity-available {
  font-size: 13px;
  color: #059669;
  font-weight: 600;
}

.quantity-loan {
  font-size: 13px;
  color: #d97706;
  font-weight: 600;
}

.type-badge {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.type-badge.informatique {
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
  color: #1d4ed8;
  border: 1px solid #93c5fd;
}

.type-badge.audio-visuel {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  color: #d97706;
  border: 1px solid #fbbf24;
}

.type-badge.mobilier {
  background: linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%);
  color: #7c3aed;
  border: 1px solid #c4b5fd;
}

.type-badge.electronique {
  background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
  color: #059669;
  border: 1px solid #6ee7b7;
}

.status-badge {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status-badge.en-stock {
  background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%);
  color: #16a34a;
  border: 1px solid #86efac;
}

.status-badge.en-pret {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  color: #d97706;
  border: 1px solid #fbbf24;
}

.status-badge.en-maintenance {
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
  color: #1d4ed8;
  border: 1px solid #93c5fd;
}

.status-badge.hors-service {
  background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
  color: #dc2626;
  border: 1px solid #f87171;
}

.retard-badge {
  background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
  color: #dc2626;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  margin-top: 4px;
  border: 1px solid #f87171;
}

.activite-badge {
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  color: #0369a1;
  padding: 4px 10px;
  border-radius: 16px;
  font-size: 11px;
  font-weight: 600;
  border: 1px solid #7dd3fc;
}

.no-activite {
  color: #94a3b8;
  font-style: italic;
  font-size: 13px;
}

.actions-cell {
  min-width: 200px;
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

.action-btn.view-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(59, 130, 246, 0.2);
}

.action-btn.history-btn {
  background: linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%);
  border: 1px solid #c4b5fd;
}

.action-btn.history-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(124, 58, 237, 0.2);
}

.action-btn.loan-btn {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border: 1px solid #fbbf24;
}

.action-btn.loan-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(217, 119, 6, 0.2);
}

.action-btn.return-btn {
  background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%);
  border: 1px solid #86efac;
}

.action-btn.return-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(22, 163, 74, 0.2);
}

.action-btn.edit-btn {
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  border: 1px solid #7dd3fc;
}

.action-btn.edit-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(3, 105, 161, 0.2);
}

.action-btn.delete-btn {
  background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
  border: 1px solid #f87171;
}

.action-btn.delete-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(220, 38, 38, 0.2);
}

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
  border-color: #3b82f6;
  background: white;
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
  font-family: inherit;
}

.form-group small {
  font-size: 12px;
  color: #64748b;
  margin-top: 4px;
  display: block;
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
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 2px 4px rgba(59, 130, 246, 0.2);
}

.save-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(59, 130, 246, 0.3);
}

.return-btn, .partial-return-btn, .no-return-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.return-btn {
  background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%);
  color: #16a34a;
  border: 1px solid #86efac;
}

.partial-return-btn {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  color: #d97706;
  border: 1px solid #fbbf24;
}

.no-return-btn {
  background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
  color: #dc2626;
  border: 1px solid #f87171;
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
    min-width: 80px;
  }

  .content-container {
    padding: 20px;
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
}
</style>
