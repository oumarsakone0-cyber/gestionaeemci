<template>
    <div class="materiel-wrapper">
      <div class="materiel-container">
        <!-- Header Section -->
        <div class="materiel-header animate-slide">
          <div class="header-content">
            <div class="title-section">
              <h1>Gestion du Matériel</h1>
              <p>Inventaire et suivi du matériel de l'AEEMCI</p>
            </div>
            <div class="header-actions">
              <button class="action-btn primary" @click="openAddMaterialDialog">
                <PlusIcon class="btn-icon" />
                Nouveau Matériel
              </button>
              <button class="action-btn secondary" @click="openEventDialog">
                <CalendarIcon class="btn-icon" />
                Nouvel Événement
              </button>
              <button class="action-btn tertiary" @click="exportInventory">
                <DownloadIcon class="btn-icon" />
                Exporter
              </button>
            </div>
          </div>
        </div>
  
        <!-- Statistics Cards -->
        <div class="stats-section">
          <div class="stat-cards">
            <div class="stat-card primary animate-pop">
              <div class="card-icon">
                <PackageIcon class="icon" />
              </div>
              <div class="card-content">
                <h3>{{ totalMaterials }}</h3>
                <p>Types de Matériel</p>
                <div class="card-trend neutral">
                  <InfoIcon class="trend-icon" />
                  <span>{{ totalStock }} unités total</span>
                </div>
              </div>
            </div>
  
            <div class="stat-card secondary animate-pop-delay-1">
              <div class="card-icon">
                <CheckCircleIcon class="icon" />
              </div>
              <div class="card-content">
                <h3>{{ availableStock }}</h3>
                <p>Unités Disponibles</p>
                <div class="card-trend positive">
                  <TrendingUpIcon class="trend-icon" />
                  <span>En stock</span>
                </div>
              </div>
            </div>
  
            <div class="stat-card tertiary animate-pop-delay-2">
              <div class="card-icon">
                <ArrowRightIcon class="icon" />
              </div>
              <div class="card-content">
                <h3>{{ outStock }}</h3>
                <p>Unités Sorties</p>
                <div class="card-trend warning">
                  <ClockIcon class="trend-icon" />
                  <span>En utilisation</span>
                </div>
              </div>
            </div>
  
            <div class="stat-card quaternary animate-pop-delay-3">
              <div class="card-icon">
                <AlertTriangleIcon class="icon" />
              </div>
              <div class="card-content">
                <h3>{{ lowStockItems }}</h3>
                <p>Stock Faible</p>
                <div class="card-trend negative">
                  <AlertTriangleIcon class="trend-icon" />
                  <span>À réapprovisionner</span>
                </div>
              </div>
            </div>
          </div>
        </div>
  
        <!-- Filters and Search -->
        <div class="filters-section">
          <div class="search-container">
            <SearchIcon class="search-icon" />
            <input 
              type="text" 
              placeholder="Rechercher du matériel..." 
              class="search-input"
              v-model="searchTerm"
              @input="filterMaterials"
            />
          </div>
          <select class="filter-select" v-model="selectedCategory" @change="filterMaterials">
            <option value="">Toutes les catégories</option>
            <option value="audio">Audio</option>
            <option value="video">Vidéo</option>
            <option value="eclairage">Éclairage</option>
            <option value="mobilier">Mobilier</option>
            <option value="decoration">Décoration</option>
            <option value="technique">Technique</option>
            <option value="autre">Autre</option>
          </select>
          <select class="filter-select" v-model="selectedStatus" @change="filterMaterials">
            <option value="">Tous les statuts</option>
            <option value="available">Disponible</option>
            <option value="out">Sorti</option>
            <option value="low_stock">Stock faible</option>
            <option value="out_of_stock">Rupture</option>
          </select>
        </div>
  
        <!-- Materials Table -->
        <div class="table-wrapper">
          <div class="table-header">
            <h2 class="table-title animate-slide">Inventaire du Matériel</h2>
            <div class="table-summary">
              {{ filteredMaterials.length }} article(s) • 
              {{ availableStock }} disponible(s) • 
              {{ outStock }} sortie(s)
            </div>
          </div>
          
          <div class="table-container">
            <table class="materials-table animate-fade">
              <thead>
                <tr>
                  <th @click="sortBy('name')" class="sortable">
                    Matériel
                    <ChevronUpIcon v-if="sortField === 'name' && sortOrder === 'asc'" class="sort-icon" />
                    <ChevronDownIcon v-if="sortField === 'name' && sortOrder === 'desc'" class="sort-icon" />
                  </th>
                  <th>Catégorie</th>
                  <th @click="sortBy('totalStock')" class="sortable">
                    Stock Total
                    <ChevronUpIcon v-if="sortField === 'totalStock' && sortOrder === 'asc'" class="sort-icon" />
                    <ChevronDownIcon v-if="sortField === 'totalStock' && sortOrder === 'desc'" class="sort-icon" />
                  </th>
                  <th>Disponible</th>
                  <th>Sorti</th>
                  <th>État</th>
                  <th>Valeur</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr 
                  v-for="material in paginatedMaterials" 
                  :key="material.id" 
                  class="row-hover"
                >
                  <td>
                    <div class="material-cell">
                      <div class="material-image">
                        <img :src="material.image" :alt="material.name" class="item-image" />
                      </div>
                      <div class="material-info">
                        <strong class="material-name">{{ material.name }}</strong>
                        <small class="material-description">{{ material.description }}</small>
                        <div class="material-meta">
                          <span class="meta-item">
                            <CalendarIcon class="meta-icon" />
                            Ajouté le {{ formatDate(material.createdAt) }}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span class="category-badge" :class="material.category">
                      {{ getCategoryText(material.category) }}
                    </span>
                  </td>
                  <td>
                    <div class="stock-cell">
                      <span class="stock-number">{{ material.totalStock }}</span>
                      <small class="stock-unit">{{ material.unit }}</small>
                    </div>
                  </td>
                  <td>
                    <div class="available-cell">
                      <span class="available-number" :class="getAvailabilityClass(material)">
                        {{ material.availableStock }}
                      </span>
                      <small class="stock-unit">{{ material.unit }}</small>
                    </div>
                  </td>
                  <td>
                    <div class="out-cell">
                      <span class="out-number">{{ material.outStock }}</span>
                      <small class="stock-unit">{{ material.unit }}</small>
                    </div>
                  </td>
                  <td>
                    <span class="status-badge" :class="getStatusClass(material)">
                      {{ getStatusText(material) }}
                    </span>
                  </td>
                  <td>
                    <div class="value-cell">
                      <span class="value-amount">{{ formatCurrency(material.unitPrice * material.totalStock) }}</span>
                      <small class="value-unit">{{ formatCurrency(material.unitPrice) }}/{{ material.unit }}</small>
                    </div>
                  </td>
                  <td>
                    <div class="action-buttons">
                      <button class="action-btn-small view" @click="viewMaterialDetails(material)" title="Voir détails">
                        <EyeIcon class="action-icon" />
                      </button>
                      <button class="action-btn-small edit" @click="editMaterial(material)" title="Modifier">
                        <EditIcon class="action-icon" />
                      </button>
                      <button class="action-btn-small history" @click="viewMaterialHistory(material)" title="Historique">
                        <HistoryIcon class="action-icon" />
                      </button>
                      <button 
                        class="action-btn-small stock" 
                        @click="openStockDialog(material)" 
                        title="Ajuster stock"
                      >
                        <PlusIcon class="action-icon" />
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
  
        <!-- Events Section -->
        <div class="events-section">
          <div class="section-header">
            <h2>Événements Récents</h2>
            <button class="action-btn small primary" @click="openEventDialog">
              <PlusIcon class="btn-icon" />
              Nouvel Événement
            </button>
          </div>
          
          <div class="events-grid">
            <div 
              v-for="event in recentEvents" 
              :key="event.id" 
              class="event-card animate-fade"
              @click="viewEventDetails(event)"
            >
              <div class="event-header">
                <div class="event-status" :class="event.status">
                  {{ getEventStatusText(event.status) }}
                </div>
                <div class="event-date">
                  {{ formatDate(event.date) }}
                </div>
              </div>
              
              <div class="event-content">
                <h3 class="event-title">{{ event.name }}</h3>
                <p class="event-description">{{ event.description }}</p>
                
                <div class="event-stats">
                  <div class="stat-item">
                    <ArrowRightIcon class="stat-icon" />
                    <span>{{ getTotalOut(event) }} sortis</span>
                  </div>
                  <div class="stat-item">
                    <ArrowLeftIcon class="stat-icon" />
                    <span>{{ getTotalReturned(event) }} retournés</span>
                  </div>
                  <div class="stat-item" v-if="getTotalLost(event) > 0">
                    <XIcon class="stat-icon" />
                    <span>{{ getTotalLost(event) }} perdus</span>
                  </div>
                </div>
                
                <div class="event-progress" v-if="event.status === 'ongoing'">
                  <div class="progress-header">
                    <span>Retour du matériel</span>
                    <span>{{ getReturnProgress(event) }}%</span>
                  </div>
                  <div class="progress-bar">
                    <div 
                      class="progress-fill" 
                      :style="{ width: `${getReturnProgress(event)}%` }"
                      :class="getProgressClass(getReturnProgress(event))"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Add/Edit Material Dialog -->
      <div v-if="materialDialog" class="dialog-overlay" @click="closeMaterialDialog">
        <div class="dialog-box large" @click.stop>
          <div class="dialog-header">
            <h3>{{ editingMaterial ? 'Modifier le Matériel' : 'Nouveau Matériel' }}</h3>
            <button class="close-btn" @click="closeMaterialDialog">
              <XIcon class="close-icon" />
            </button>
          </div>
          <div class="dialog-content">
            <form @submit.prevent="saveMaterial">
              <div class="form-row">
                <div class="form-group">
                  <label>Nom du matériel *</label>
                  <input 
                    type="text" 
                    v-model="materialForm.name"
                    placeholder="Ex: Micro sans fil..."
                    required 
                  />
                </div>
                <div class="form-group">
                  <label>Catégorie *</label>
                  <select v-model="materialForm.category" required>
                    <option value="">Choisir une catégorie</option>
                    <option value="audio">Audio</option>
                    <option value="video">Vidéo</option>
                    <option value="eclairage">Éclairage</option>
                    <option value="mobilier">Mobilier</option>
                    <option value="decoration">Décoration</option>
                    <option value="technique">Technique</option>
                    <option value="autre">Autre</option>
                  </select>
                </div>
              </div>
              
              <div class="form-group">
                <label>Description</label>
                <textarea 
                  v-model="materialForm.description"
                  placeholder="Description détaillée du matériel..."
                  rows="3"
                ></textarea>
              </div>
              
              <div class="form-row">
                <div class="form-group">
                  <label>Stock initial *</label>
                  <input 
                    type="number" 
                    v-model="materialForm.totalStock"
                    placeholder="0"
                    min="0"
                    required 
                  />
                </div>
                <div class="form-group">
                  <label>Unité *</label>
                  <select v-model="materialForm.unit" required>
                    <option value="">Choisir une unité</option>
                    <option value="pièce">Pièce</option>
                    <option value="lot">Lot</option>
                    <option value="mètre">Mètre</option>
                    <option value="kg">Kilogramme</option>
                    <option value="litre">Litre</option>
                    <option value="boîte">Boîte</option>
                    <option value="pack">Pack</option>
                  </select>
                </div>
              </div>
              
              <div class="form-row">
                <div class="form-group">
                  <label>Prix unitaire (FCFA) *</label>
                  <input 
                    type="number" 
                    v-model="materialForm.unitPrice"
                    placeholder="0"
                    min="0"
                    required 
                  />
                </div>
                <div class="form-group">
                  <label>Seuil d'alerte stock</label>
                  <input 
                    type="number" 
                    v-model="materialForm.minStock"
                    placeholder="5"
                    min="0"
                  />
                </div>
              </div>
              
              <div class="form-group">
                <label>Image du matériel</label>
                <input 
                  type="url" 
                  v-model="materialForm.image"
                  placeholder="https://exemple.com/image.jpg"
                />
              </div>
              
              <div class="form-group">
                <label>Notes</label>
                <textarea 
                  v-model="materialForm.notes"
                  placeholder="Notes particulières, fournisseur, garantie..."
                  rows="2"
                ></textarea>
              </div>
              
              <div class="dialog-actions">
                <button type="submit" class="dialog-btn save">
                  <SaveIcon class="button-icon" />
                  {{ editingMaterial ? 'Mettre à jour' : 'Ajouter le matériel' }}
                </button>
                <button type="button" class="dialog-btn cancel" @click="closeMaterialDialog">
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
  
      <!-- Stock Adjustment Dialog -->
      <div v-if="stockDialog" class="dialog-overlay" @click="closeStockDialog">
        <div class="dialog-box" @click.stop>
          <div class="dialog-header">
            <h3>Ajuster le Stock - {{ selectedMaterial?.name }}</h3>
            <button class="close-btn" @click="closeStockDialog">
              <XIcon class="close-icon" />
            </button>
          </div>
          <div class="dialog-content">
            <div class="current-stock-info">
              <div class="stock-info-item">
                <label>Stock total actuel:</label>
                <span class="stock-value">{{ selectedMaterial?.totalStock }} {{ selectedMaterial?.unit }}</span>
              </div>
              <div class="stock-info-item">
                <label>Stock disponible:</label>
                <span class="stock-value available">{{ selectedMaterial?.availableStock }} {{ selectedMaterial?.unit }}</span>
              </div>
              <div class="stock-info-item">
                <label>Stock sorti:</label>
                <span class="stock-value out">{{ selectedMaterial?.outStock }} {{ selectedMaterial?.unit }}</span>
              </div>
            </div>
            
            <form @submit.prevent="saveStockAdjustment">
              <div class="form-group">
                <label>Type d'ajustement *</label>
                <select v-model="stockForm.type" required @change="updateStockForm">
                  <option value="">Choisir le type</option>
                  <option value="add">Ajout de stock</option>
                  <option value="remove">Retrait de stock</option>
                  <option value="correction">Correction d'inventaire</option>
                </select>
              </div>
              
              <div class="form-group" v-if="stockForm.type">
                <label>
                  {{ stockForm.type === 'add' ? 'Quantité à ajouter' : 
                     stockForm.type === 'remove' ? 'Quantité à retirer' : 
                     'Nouveau stock total' }} *
                </label>
                <input 
                  type="number" 
                  v-model="stockForm.quantity"
                  :placeholder="stockForm.type === 'correction' ? selectedMaterial?.totalStock : '0'"
                  min="0"
                  required 
                />
              </div>
              
              <div class="form-group">
                <label>Motif *</label>
                <textarea 
                  v-model="stockForm.reason"
                  placeholder="Expliquez la raison de cet ajustement..."
                  rows="3"
                  required
                ></textarea>
              </div>
              
              <div class="preview-adjustment" v-if="stockForm.type && stockForm.quantity">
                <h4>Aperçu de l'ajustement:</h4>
                <div class="adjustment-preview">
                  <div class="before-after">
                    <div class="before">
                      <label>Avant:</label>
                      <span>{{ selectedMaterial?.totalStock }} {{ selectedMaterial?.unit }}</span>
                    </div>
                    <ArrowRightIcon class="arrow" />
                    <div class="after">
                      <label>Après:</label>
                      <span>{{ getNewStockValue() }} {{ selectedMaterial?.unit }}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="dialog-actions">
                <button type="submit" class="dialog-btn save">
                  <SaveIcon class="button-icon" />
                  Confirmer l'ajustement
                </button>
                <button type="button" class="dialog-btn cancel" @click="closeStockDialog">
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
  
      <!-- Event Dialog -->
      <div v-if="eventDialog" class="dialog-overlay" @click="closeEventDialog">
        <div class="dialog-box large" @click.stop>
          <div class="dialog-header">
            <h3>{{ editingEvent ? 'Modifier l\'Événement' : 'Nouvel Événement' }}</h3>
            <button class="close-btn" @click="closeEventDialog">
              <XIcon class="close-icon" />
            </button>
          </div>
          <div class="dialog-content">
            <form @submit.prevent="saveEvent">
              <div class="form-row">
                <div class="form-group">
                  <label>Nom de l'événement *</label>
                  <input 
                    type="text" 
                    v-model="eventForm.name"
                    placeholder="Ex: Soirée culturelle 2025..."
                    required 
                  />
                </div>
                <div class="form-group">
                  <label>Date de l'événement *</label>
                  <input 
                    type="date" 
                    v-model="eventForm.date"
                    required 
                  />
                </div>
              </div>
              
              <div class="form-group">
                <label>Description</label>
                <textarea 
                  v-model="eventForm.description"
                  placeholder="Description de l'événement..."
                  rows="3"
                ></textarea>
              </div>
              
              <div class="form-group">
                <label>Responsable *</label>
                <select v-model="eventForm.responsibleId" required>
                  <option value="">Sélectionner un responsable</option>
                  <option 
                    v-for="member in members" 
                    :key="member.id" 
                    :value="member.id"
                  >
                    {{ member.name }} - {{ member.role }}
                  </option>
                </select>
              </div>
              
              <div class="dialog-actions">
                <button type="submit" class="dialog-btn save">
                  <SaveIcon class="button-icon" />
                  {{ editingEvent ? 'Mettre à jour' : 'Créer l\'événement' }}
                </button>
                <button type="button" class="dialog-btn cancel" @click="closeEventDialog">
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
  
      <!-- Material Details Dialog -->
      <div v-if="detailsDialog" class="dialog-overlay" @click="closeDetailsDialog">
        <div class="dialog-box extra-large" @click.stop>
          <div class="dialog-header">
            <h3>{{ selectedMaterial?.name }}</h3>
            <div class="header-actions">
              <button class="action-btn small primary" @click="openStockDialog(selectedMaterial)">
                <PlusIcon class="btn-icon" />
                Ajuster stock
              </button>
              <button class="close-btn" @click="closeDetailsDialog">
                <XIcon class="close-icon" />
              </button>
            </div>
          </div>
          <div class="dialog-content">
            <div class="material-details" v-if="selectedMaterial">
              <!-- Material Info -->
              <div class="details-section">
                <h4>Informations générales</h4>
                <div class="material-overview">
                  <div class="material-image-large">
                    <img :src="selectedMaterial.image" :alt="selectedMaterial.name" class="detail-image" />
                  </div>
                  <div class="material-info-detailed">
                    <div class="info-grid">
                      <div class="info-item">
                        <label>Catégorie:</label>
                        <span class="category-badge" :class="selectedMaterial.category">
                          {{ getCategoryText(selectedMaterial.category) }}
                        </span>
                      </div>
                      <div class="info-item">
                        <label>Prix unitaire:</label>
                        <span>{{ formatCurrency(selectedMaterial.unitPrice) }}</span>
                      </div>
                      <div class="info-item">
                        <label>Valeur totale:</label>
                        <span class="value-highlight">{{ formatCurrency(selectedMaterial.unitPrice * selectedMaterial.totalStock) }}</span>
                      </div>
                      <div class="info-item">
                        <label>Seuil d'alerte:</label>
                        <span>{{ selectedMaterial.minStock }} {{ selectedMaterial.unit }}</span>
                      </div>
                      <div class="info-item">
                        <label>Ajouté le:</label>
                        <span>{{ formatDate(selectedMaterial.createdAt) }}</span>
                      </div>
                      <div class="info-item">
                        <label>Statut:</label>
                        <span class="status-badge" :class="getStatusClass(selectedMaterial)">
                          {{ getStatusText(selectedMaterial) }}
                        </span>
                      </div>
                    </div>
                    <div class="description-section" v-if="selectedMaterial.description">
                      <h5>Description:</h5>
                      <p>{{ selectedMaterial.description }}</p>
                    </div>
                    <div class="notes-section" v-if="selectedMaterial.notes">
                      <h5>Notes:</h5>
                      <p>{{ selectedMaterial.notes }}</p>
                    </div>
                  </div>
                </div>
              </div>
  
              <!-- Stock Summary -->
              <div class="details-section">
                <h4>Résumé du stock</h4>
                <div class="stock-summary">
                  <div class="stock-item total">
                    <div class="stock-icon">
                      <PackageIcon class="icon" />
                    </div>
                    <div class="stock-details">
                      <span class="stock-label">Stock Total</span>
                      <span class="stock-value">{{ selectedMaterial.totalStock }} {{ selectedMaterial.unit }}</span>
                    </div>
                  </div>
                  <div class="stock-item available">
                    <div class="stock-icon">
                      <CheckCircleIcon class="icon" />
                    </div>
                    <div class="stock-details">
                      <span class="stock-label">Disponible</span>
                      <span class="stock-value">{{ selectedMaterial.availableStock }} {{ selectedMaterial.unit }}</span>
                    </div>
                  </div>
                  <div class="stock-item out">
                    <div class="stock-icon">
                      <ArrowRightIcon class="icon" />
                    </div>
                    <div class="stock-details">
                      <span class="stock-label">Sorti</span>
                      <span class="stock-value">{{ selectedMaterial.outStock }} {{ selectedMaterial.unit }}</span>
                    </div>
                  </div>
                  <div class="stock-item lost" v-if="selectedMaterial.lostStock > 0">
                    <div class="stock-icon">
                      <XIcon class="icon" />
                    </div>
                    <div class="stock-details">
                      <span class="stock-label">Perdu/Cassé</span>
                      <span class="stock-value">{{ selectedMaterial.lostStock }} {{ selectedMaterial.unit }}</span>
                    </div>
                  </div>
                </div>
              </div>
  
              <!-- Recent Events -->
              <div class="details-section">
                <h4>Événements récents</h4>
                <div class="recent-events-list">
                  <div 
                    v-for="usage in getRecentUsage(selectedMaterial)" 
                    :key="usage.eventId" 
                    class="usage-item"
                  >
                    <div class="usage-header">
                      <strong>{{ usage.eventName }}</strong>
                      <span class="usage-date">{{ formatDate(usage.date) }}</span>
                    </div>
                    <div class="usage-details">
                      <div class="usage-stat">
                        <ArrowRightIcon class="usage-icon out" />
                        <span>{{ usage.quantityOut }} sortis</span>
                      </div>
                      <div class="usage-stat">
                        <ArrowLeftIcon class="usage-icon in" />
                        <span>{{ usage.quantityReturned }} retournés</span>
                      </div>
                      <div class="usage-stat" v-if="usage.quantityLost > 0">
                        <XIcon class="usage-icon lost" />
                        <span>{{ usage.quantityLost }} perdus</span>
                      </div>
                    </div>
                  </div>
                  <div v-if="getRecentUsage(selectedMaterial).length === 0" class="no-usage">
                    <CalendarIcon class="no-usage-icon" />
                    <p>Aucun événement récent</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Material History Dialog -->
      <div v-if="historyDialog" class="dialog-overlay" @click="closeHistoryDialog">
        <div class="dialog-box large" @click.stop>
          <div class="dialog-header">
            <h3>Historique - {{ selectedMaterial?.name }}</h3>
            <button class="close-btn" @click="closeHistoryDialog">
              <XIcon class="close-icon" />
            </button>
          </div>
          <div class="dialog-content">
            <div class="history-timeline" v-if="selectedMaterial">
              <div 
                v-for="entry in getMaterialHistory(selectedMaterial)" 
                :key="entry.id" 
                class="timeline-item"
              >
                <div class="timeline-marker" :class="entry.type"></div>
                <div class="timeline-content">
                  <div class="timeline-header">
                    <div class="timeline-title">
                      <strong>{{ entry.title }}</strong>
                      <span class="timeline-type">{{ entry.typeText }}</span>
                    </div>
                    <div class="timeline-date">
                      {{ formatDateTime(entry.date) }}
                    </div>
                  </div>
                  <div class="timeline-details">
                    <p>{{ entry.description }}</p>
                    <div class="timeline-meta" v-if="entry.quantity">
                      <span class="quantity-change" :class="entry.changeType">
                        {{ entry.changeType === 'increase' ? '+' : '-' }}{{ entry.quantity }} {{ selectedMaterial.unit }}
                      </span>
                      <span class="author" v-if="entry.author">par {{ entry.author }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Event Details Dialog -->
      <div v-if="eventDetailsDialog" class="dialog-overlay" @click="closeEventDetailsDialog">
        <div class="dialog-box extra-large" @click.stop>
          <div class="dialog-header">
            <h3>{{ selectedEvent?.name }}</h3>
            <div class="header-actions">
              <button 
                v-if="selectedEvent?.status === 'planned'" 
                class="action-btn small primary" 
                @click="startEvent(selectedEvent)"
              >
                <PlayIcon class="btn-icon" />
                Démarrer
              </button>
              <button 
                v-if="selectedEvent?.status === 'ongoing'" 
                class="action-btn small secondary" 
                @click="openMaterialUsageDialog(selectedEvent)"
              >
                <PackageIcon class="btn-icon" />
                Gérer matériel
              </button>
              <button 
                v-if="selectedEvent?.status === 'ongoing'" 
                class="action-btn small tertiary" 
                @click="endEvent(selectedEvent)"
              >
                <CheckIcon class="btn-icon" />
                Terminer
              </button>
              <button class="close-btn" @click="closeEventDetailsDialog">
                <XIcon class="close-icon" />
              </button>
            </div>
          </div>
          <div class="dialog-content">
            <div class="event-details" v-if="selectedEvent">
              <!-- Event Info -->
              <div class="details-section">
                <h4>Informations de l'événement</h4>
                <div class="info-grid">
                  <div class="info-item">
                    <label>Statut:</label>
                    <span class="event-status-badge" :class="selectedEvent.status">
                      {{ getEventStatusText(selectedEvent.status) }}
                    </span>
                  </div>
                  <div class="info-item">
                    <label>Date:</label>
                    <span>{{ formatDate(selectedEvent.date) }}</span>
                  </div>
                  <div class="info-item">
                    <label>Responsable:</label>
                    <span>{{ selectedEvent.responsible?.name }}</span>
                  </div>
                  <div class="info-item">
                    <label>Créé le:</label>
                    <span>{{ formatDate(selectedEvent.createdAt) }}</span>
                  </div>
                </div>
                <div class="description-section" v-if="selectedEvent.description">
                  <h5>Description:</h5>
                  <p>{{ selectedEvent.description }}</p>
                </div>
              </div>
  
              <!-- Material Usage -->
              <div class="details-section">
                <h4>Utilisation du matériel</h4>
                <div class="material-usage-table">
                  <table class="usage-table">
                    <thead>
                      <tr>
                        <th>Matériel</th>
                        <th>Quantité sortie</th>
                        <th>Quantité retournée</th>
                        <th>Pertes/Casse</th>
                        <th>Statut</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="usage in selectedEvent.materialUsage" :key="usage.materialId">
                        <td>
                          <div class="material-usage-cell">
                            <strong>{{ getMaterialName(usage.materialId) }}</strong>
                            <small>{{ getMaterialCategory(usage.materialId) }}</small>
                          </div>
                        </td>
                        <td>
                          <span class="quantity out">{{ usage.quantityOut }}</span>
                        </td>
                        <td>
                          <span class="quantity in">{{ usage.quantityReturned }}</span>
                        </td>
                        <td>
                          <span class="quantity lost" v-if="usage.quantityLost > 0">{{ usage.quantityLost }}</span>
                          <span v-else class="no-loss">-</span>
                        </td>
                        <td>
                          <span class="usage-status" :class="getUsageStatus(usage)">
                            {{ getUsageStatusText(usage) }}
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <div v-if="selectedEvent.materialUsage.length === 0" class="no-material-usage">
                    <PackageIcon class="no-usage-icon" />
                    <p>Aucun matériel utilisé pour cet événement</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Material Usage Dialog -->
      <div v-if="materialUsageDialog" class="dialog-overlay" @click="closeMaterialUsageDialog">
        <div class="dialog-box large" @click.stop>
          <div class="dialog-header">
            <h3>Gestion Matériel - {{ selectedEvent?.name }}</h3>
            <button class="close-btn" @click="closeMaterialUsageDialog">
              <XIcon class="close-icon" />
            </button>
          </div>
          <div class="dialog-content">
            <div class="usage-tabs">
              <button 
                class="tab-btn" 
                :class="{ active: activeUsageTab === 'out' }"
                @click="activeUsageTab = 'out'"
              >
                Sortie de matériel
              </button>
              <button 
                class="tab-btn" 
                :class="{ active: activeUsageTab === 'return' }"
                @click="activeUsageTab = 'return'"
              >
                Retour de matériel
              </button>
              <button 
                class="tab-btn" 
                :class="{ active: activeUsageTab === 'loss' }"
                @click="activeUsageTab = 'loss'"
              >
                Pertes/Casse
              </button>
            </div>
  
            <!-- Sortie de matériel -->
            <div v-if="activeUsageTab === 'out'" class="tab-content">
              <form @submit.prevent="addMaterialOut">
                <div class="form-row">
                  <div class="form-group">
                    <label>Matériel *</label>
                    <select v-model="usageForm.materialId" required>
                      <option value="">Sélectionner un matériel</option>
                      <option 
                        v-for="material in availableMaterials" 
                        :key="material.id" 
                        :value="material.id"
                      >
                        {{ material.name }} ({{ material.availableStock }} {{ material.unit }} disponibles)
                      </option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label>Quantité *</label>
                    <input 
                      type="number" 
                      v-model="usageForm.quantity"
                      :max="getMaxAvailable(usageForm.materialId)"
                      min="1"
                      required 
                    />
                  </div>
                </div>
                <div class="form-group">
                  <label>Notes</label>
                  <textarea 
                    v-model="usageForm.notes"
                    placeholder="Notes sur l'utilisation..."
                    rows="2"
                  ></textarea>
                </div>
                <button type="submit" class="dialog-btn save">
                  <ArrowRightIcon class="button-icon" />
                  Sortir le matériel
                </button>
              </form>
            </div>
  
            <!-- Retour de matériel -->
            <div v-if="activeUsageTab === 'return'" class="tab-content">
              <form @submit.prevent="addMaterialReturn">
                <div class="form-row">
                  <div class="form-group">
                    <label>Matériel *</label>
                    <select v-model="returnForm.materialId" required>
                      <option value="">Sélectionner un matériel</option>
                      <option 
                        v-for="usage in getOutMaterials()" 
                        :key="usage.materialId" 
                        :value="usage.materialId"
                      >
                        {{ getMaterialName(usage.materialId) }} ({{ usage.quantityOut - usage.quantityReturned }} à retourner)
                      </option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label>Quantité retournée *</label>
                    <input 
                      type="number" 
                      v-model="returnForm.quantity"
                      :max="getMaxReturn(returnForm.materialId)"
                      min="1"
                      required 
                    />
                  </div>
                </div>
                <div class="form-group">
                  <label>État du matériel</label>
                  <select v-model="returnForm.condition">
                    <option value="good">Bon état</option>
                    <option value="damaged">Endommagé</option>
                    <option value="lost">Perdu</option>
                  </select>
                </div>
                <div class="form-group">
                  <label>Notes</label>
                  <textarea 
                    v-model="returnForm.notes"
                    placeholder="Notes sur l'état du matériel..."
                    rows="2"
                  ></textarea>
                </div>
                <button type="submit" class="dialog-btn save">
                  <ArrowLeftIcon class="button-icon" />
                  Retourner le matériel
                </button>
              </form>
            </div>
  
            <!-- Pertes/Casse -->
            <div v-if="activeUsageTab === 'loss'" class="tab-content">
              <form @submit.prevent="addMaterialLoss">
                <div class="form-row">
                  <div class="form-group">
                    <label>Matériel *</label>
                    <select v-model="lossForm.materialId" required>
                      <option value="">Sélectionner un matériel</option>
                      <option 
                        v-for="usage in getOutMaterials()" 
                        :key="usage.materialId" 
                        :value="usage.materialId"
                      >
                        {{ getMaterialName(usage.materialId) }}
                      </option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label>Quantité perdue/cassée *</label>
                    <input 
                      type="number" 
                      v-model="lossForm.quantity"
                      min="1"
                      required 
                    />
                  </div>
                </div>
                <div class="form-group">
                  <label>Type de perte *</label>
                  <select v-model="lossForm.type" required>
                    <option value="">Choisir le type</option>
                    <option value="lost">Perdu</option>
                    <option value="broken">Cassé</option>
                    <option value="stolen">Volé</option>
                    <option value="damaged">Endommagé irréparable</option>
                  </select>
                </div>
                <div class="form-group">
                  <label>Description *</label>
                  <textarea 
                    v-model="lossForm.description"
                    placeholder="Décrivez les circonstances de la perte..."
                    rows="3"
                    required
                  ></textarea>
                </div>
                <button type="submit" class="dialog-btn save">
                  <XIcon class="button-icon" />
                  Déclarer la perte
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue'
  import {
    PlusIcon,
    DownloadIcon,
    PackageIcon,
    CheckCircleIcon,
    ArrowRightIcon,
    ArrowLeftIcon,
    AlertTriangleIcon,
    InfoIcon,
    TrendingUpIcon,
    ClockIcon,
    SearchIcon,
    CalendarIcon,
    XIcon,
    SaveIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    ChevronUpIcon,
    ChevronDownIcon,
    EyeIcon,
    EditIcon,
    HistoryIcon,
    PlayIcon,
    CheckIcon
  } from 'lucide-vue-next'
  
  // Données réactives
  const materialDialog = ref(false)
  const stockDialog = ref(false)
  const eventDialog = ref(false)
  const detailsDialog = ref(false)
  const historyDialog = ref(false)
  const eventDetailsDialog = ref(false)
  const materialUsageDialog = ref(false)
  const editingMaterial = ref(null)
  const editingEvent = ref(null)
  const selectedMaterial = ref(null)
  const selectedEvent = ref(null)
  
  // Filtres et recherche
  const searchTerm = ref('')
  const selectedCategory = ref('')
  const selectedStatus = ref('')
  const sortField = ref('name')
  const sortOrder = ref('asc')
  const currentPage = ref(1)
  const itemsPerPage = 10
  
  // Onglets
  const activeUsageTab = ref('out')
  
  // Formulaires
  const materialForm = ref({
    name: '',
    category: '',
    description: '',
    totalStock: '',
    unit: '',
    unitPrice: '',
    minStock: 5,
    image: '',
    notes: ''
  })
  
  const stockForm = ref({
    type: '',
    quantity: '',
    reason: ''
  })
  
  const eventForm = ref({
    name: '',
    date: '',
    description: '',
    responsibleId: ''
  })
  
  const usageForm = ref({
    materialId: '',
    quantity: '',
    notes: ''
  })
  
  const returnForm = ref({
    materialId: '',
    quantity: '',
    condition: 'good',
    notes: ''
  })
  
  const lossForm = ref({
    materialId: '',
    quantity: '',
    type: '',
    description: ''
  })
  
  // Date d'aujourd'hui
  const today = new Date().toISOString().split('T')[0]
  
  // Utilisateur actuel
  const currentUser = ref({
    id: 1,
    name: 'Abdoulaye Koné',
    role: 'SENACREX'
  })
  
  // Membres disponibles
  const members = ref([
    {
      id: 1,
      name: 'Abdoulaye Koné',
      role: 'SENACREX',
      avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=AK&backgroundColor=10b981'
    },
    {
      id: 2,
      name: 'Fatoumata Maiga',
      role: 'SENAFI',
      avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=FM&backgroundColor=3b82f6'
    },
    {
      id: 3,
      name: 'Karim Mory',
      role: 'SENAMO',
      avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=KM&backgroundColor=f59e0b'
    },
    {
      id: 4,
      name: 'Aminata Traoré',
      role: 'SENACUL',
      avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=AT&backgroundColor=ef4444'
    },
    {
      id: 5,
      name: 'Moussa Diarra',
      role: 'SENASPO',
      avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=MD&backgroundColor=8b5cf6'
    }
  ])
  
  // Données du matériel
  const materials = ref([
    {
      id: 1,
      name: 'Microphone sans fil',
      category: 'audio',
      description: 'Microphone sans fil professionnel avec récepteur',
      totalStock: 10,
      availableStock: 7,
      outStock: 3,
      lostStock: 0,
      unit: 'pièce',
      unitPrice: 75000,
      minStock: 2,
      image: '/placeholder.svg?height=100&width=100',
      notes: 'Marque Shure, garantie 2 ans',
      createdAt: new Date('2024-01-15'),
      history: []
    },
    {
      id: 2,
      name: 'Projecteur LED',
      category: 'eclairage',
      description: 'Projecteur LED haute puissance pour éclairage de scène',
      totalStock: 8,
      availableStock: 5,
      outStock: 2,
      lostStock: 1,
      unit: 'pièce',
      unitPrice: 120000,
      minStock: 2,
      image: '/placeholder.svg?height=100&width=100',
      notes: 'Consommation 200W, plusieurs couleurs disponibles',
      createdAt: new Date('2024-02-10'),
      history: []
    },
    {
      id: 3,
      name: 'Table pliante',
      category: 'mobilier',
      description: 'Table pliante rectangulaire 180x80cm',
      totalStock: 25,
      availableStock: 20,
      outStock: 5,
      lostStock: 0,
      unit: 'pièce',
      unitPrice: 35000,
      minStock: 5,
      image: '/placeholder.svg?height=100&width=100',
      notes: 'Plateau en bois, pieds métalliques',
      createdAt: new Date('2024-01-20'),
      history: []
    },
    {
      id: 4,
      name: 'Chaise plastique',
      category: 'mobilier',
      description: 'Chaise en plastique empilable',
      totalStock: 100,
      availableStock: 85,
      outStock: 15,
      lostStock: 0,
      unit: 'pièce',
      unitPrice: 8000,
      minStock: 20,
      image: '/placeholder.svg?height=100&width=100',
      notes: 'Couleur blanche, empilable',
      createdAt: new Date('2024-01-10'),
      history: []
    },
    {
      id: 5,
      name: 'Enceinte portable',
      category: 'audio',
      description: 'Enceinte portable Bluetooth avec micro intégré',
      totalStock: 6,
      availableStock: 4,
      outStock: 2,
      lostStock: 0,
      unit: 'pièce',
      unitPrice: 95000,
      minStock: 1,
      image: '/placeholder.svg?height=100&width=100',
      notes: 'Autonomie 8h, portée Bluetooth 30m',
      createdAt: new Date('2024-03-05'),
      history: []
    },
    {
      id: 6,
      name: 'Nappe blanche',
      category: 'decoration',
      description: 'Nappe en tissu blanc pour table rectangulaire',
      totalStock: 30,
      availableStock: 25,
      outStock: 3,
      lostStock: 2,
      unit: 'pièce',
      unitPrice: 12000,
      minStock: 10,
      image: '/placeholder.svg?height=100&width=100',
      notes: 'Lavable en machine, dimensions 200x150cm',
      createdAt: new Date('2024-02-15'),
      history: []
    }
  ])
  
  // Données des événements
  const events = ref([
    {
      id: 1,
      name: 'Soirée Culturelle 2025',
      description: 'Soirée culturelle annuelle avec spectacles et expositions',
      date: new Date('2025-02-28'),
      status: 'ongoing',
      createdAt: new Date('2025-01-15'),
      responsible: {
        id: 4,
        name: 'Aminata Traoré',
        role: 'SENACUL'
      },
      materialUsage: [
        {
          materialId: 1,
          quantityOut: 3,
          quantityReturned: 0,
          quantityLost: 0,
          notes: 'Pour les artistes sur scène'
        },
        {
          materialId: 2,
          quantityOut: 2,
          quantityReturned: 0,
          quantityLost: 0,
          notes: 'Éclairage de la scène principale'
        },
        {
          materialId: 3,
          quantityOut: 5,
          quantityReturned: 0,
          quantityLost: 0,
          notes: 'Tables pour l\'exposition'
        },
        {
          materialId: 4,
          quantityOut: 15,
          quantityReturned: 0,
          quantityLost: 0,
          notes: 'Chaises pour le public'
        }
      ]
    },
    {
      id: 2,
      name: 'Assemblée Générale 2024',
      description: 'Assemblée générale annuelle des membres',
      date: new Date('2024-12-15'),
      status: 'completed',
      createdAt: new Date('2024-11-20'),
      responsible: {
        id: 1,
        name: 'Abdoulaye Koné',
        role: 'SENACREX'
      },
      materialUsage: [
        {
          materialId: 1,
          quantityOut: 2,
          quantityReturned: 2,
          quantityLost: 0,
          notes: 'Micros pour les interventions'
        },
        {
          materialId: 3,
          quantityOut: 8,
          quantityReturned: 8,
          quantityLost: 0,
          notes: 'Tables pour les documents'
        },
        {
          materialId: 4,
          quantityOut: 50,
          quantityReturned: 50,
          quantityLost: 0,
          notes: 'Chaises pour les participants'
        },
        {
          materialId: 6,
          quantityOut: 5,
          quantityReturned: 3,
          quantityLost: 2,
          notes: 'Nappes pour les tables - 2 tachées irrémédiablement'
        }
      ]
    },
    {
      id: 3,
      name: 'Journée Portes Ouvertes',
      description: 'Présentation de l\'association aux nouveaux étudiants',
      date: new Date('2025-03-15'),
      status: 'planned',
      createdAt: new Date('2025-01-20'),
      responsible: {
        id: 3,
        name: 'Karim Mory',
        role: 'SENAMO'
      },
      materialUsage: []
    }
  ])
  
  // Données calculées
  const filteredMaterials = ref([...materials.value])
  
  const paginatedMaterials = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage
    const end = start + itemsPerPage
    return filteredMaterials.value.slice(start, end)
  })
  
  const totalPages = computed(() => 
    Math.ceil(filteredMaterials.value.length / itemsPerPage)
  )
  
  const totalMaterials = computed(() => materials.value.length)
  const totalStock = computed(() => materials.value.reduce((sum, m) => sum + m.totalStock, 0))
  const availableStock = computed(() => materials.value.reduce((sum, m) => sum + m.availableStock, 0))
  const outStock = computed(() => materials.value.reduce((sum, m) => sum + m.outStock, 0))
  const lowStockItems = computed(() => materials.value.filter(m => m.availableStock <= m.minStock).length)
  
  const recentEvents = computed(() => 
    events.value.slice().sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 6)
  )
  
  const availableMaterials = computed(() => 
    materials.value.filter(m => m.availableStock > 0)
  )
  
  // Fonctions utilitaires
  const formatDate = (date) => {
    return date.toLocaleDateString('fr-FR')
  }
  
  const formatDateTime = (date) => {
    return date.toLocaleDateString('fr-FR') + ' à ' + date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
  }
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(amount)
  }
  
  const getCategoryText = (category) => {
    const categories = {
      'audio': 'Audio',
      'video': 'Vidéo',
      'eclairage': 'Éclairage',
      'mobilier': 'Mobilier',
      'decoration': 'Décoration',
      'technique': 'Technique',
      'autre': 'Autre'
    }
    return categories[category] || category
  }
  
  const getStatusClass = (material) => {
    if (material.availableStock === 0) return 'out-of-stock'
    if (material.availableStock <= material.minStock) return 'low-stock'
    return 'available'
  }
  
  const getStatusText = (material) => {
    if (material.availableStock === 0) return 'Rupture'
    if (material.availableStock <= material.minStock) return 'Stock faible'
    return 'Disponible'
  }
  
  const getAvailabilityClass = (material) => {
    if (material.availableStock === 0) return 'zero'
    if (material.availableStock <= material.minStock) return 'low'
    return 'good'
  }
  
  const getEventStatusText = (status) => {
    const statuses = {
      'planned': 'Planifié',
      'ongoing': 'En cours',
      'completed': 'Terminé',
      'cancelled': 'Annulé'
    }
    return statuses[status] || status
  }
  
  const getProgressClass = (progress) => {
    if (progress >= 80) return 'high-progress'
    if (progress >= 50) return 'medium-progress'
    return 'low-progress'
  }
  
  const getTotalOut = (event) => {
    return event.materialUsage.reduce((sum, usage) => sum + usage.quantityOut, 0)
  }
  
  const getTotalReturned = (event) => {
    return event.materialUsage.reduce((sum, usage) => sum + usage.quantityReturned, 0)
  }
  
  const getTotalLost = (event) => {
    return event.materialUsage.reduce((sum, usage) => sum + usage.quantityLost, 0)
  }
  
  const getReturnProgress = (event) => {
    const totalOut = getTotalOut(event)
    const totalReturned = getTotalReturned(event)
    return totalOut > 0 ? Math.round((totalReturned / totalOut) * 100) : 0
  }
  
  const getMaterialName = (materialId) => {
    const material = materials.value.find(m => m.id === materialId)
    return material ? material.name : 'Matériel inconnu'
  }
  
  const getMaterialCategory = (materialId) => {
    const material = materials.value.find(m => m.id === materialId)
    return material ? getCategoryText(material.category) : ''
  }
  
  const getUsageStatus = (usage) => {
    if (usage.quantityLost > 0) return 'with-loss'
    if (usage.quantityReturned === usage.quantityOut) return 'complete'
    if (usage.quantityReturned > 0) return 'partial'
    return 'pending'
  }
  
  const getUsageStatusText = (usage) => {
    const status = getUsageStatus(usage)
    const statuses = {
      'complete': 'Complet',
      'partial': 'Partiel',
      'pending': 'En attente',
      'with-loss': 'Avec pertes'
    }
    return statuses[status] || status
  }
  
  const getMaxAvailable = (materialId) => {
    const material = materials.value.find(m => m.id === parseInt(materialId))
    return material ? material.availableStock : 0
  }
  
  const getMaxReturn = (materialId) => {
    if (!selectedEvent.value) return 0
    const usage = selectedEvent.value.materialUsage.find(u => u.materialId === parseInt(materialId))
    return usage ? usage.quantityOut - usage.quantityReturned : 0
  }
  
  const getOutMaterials = () => {
    if (!selectedEvent.value) return []
    return selectedEvent.value.materialUsage.filter(usage => usage.quantityOut > usage.quantityReturned)
  }
  
  const getRecentUsage = (material) => {
    const usage = []
    events.value.forEach(event => {
      const materialUsage = event.materialUsage.find(u => u.materialId === material.id)
      if (materialUsage) {
        usage.push({
          eventId: event.id,
          eventName: event.name,
          date: event.date,
          quantityOut: materialUsage.quantityOut,
          quantityReturned: materialUsage.quantityReturned,
          quantityLost: materialUsage.quantityLost
        })
      }
    })
    return usage.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5)
  }
  
  const getMaterialHistory = (material) => {
    const history = []
    
    // Ajout initial
    history.push({
      id: `init-${material.id}`,
      type: 'creation',
      typeText: 'Création',
      title: 'Matériel ajouté à l\'inventaire',
      description: `${material.totalStock} ${material.unit} ajoutées au stock initial`,
      date: material.createdAt,
      quantity: material.totalStock,
      changeType: 'increase',
      author: 'Système'
    })
    
    // Événements d'utilisation
    events.value.forEach(event => {
      const usage = event.materialUsage.find(u => u.materialId === material.id)
      if (usage) {
        if (usage.quantityOut > 0) {
          history.push({
            id: `out-${event.id}-${material.id}`,
            type: 'out',
            typeText: 'Sortie',
            title: `Sortie pour ${event.name}`,
            description: `${usage.quantityOut} ${material.unit} sorties pour l'événement`,
            date: event.date,
            quantity: usage.quantityOut,
            changeType: 'decrease',
            author: event.responsible?.name
          })
        }
        
        if (usage.quantityReturned > 0) {
          history.push({
            id: `return-${event.id}-${material.id}`,
            type: 'return',
            typeText: 'Retour',
            title: `Retour de ${event.name}`,
            description: `${usage.quantityReturned} ${material.unit} retournées après l'événement`,
            date: new Date(event.date.getTime() + 24 * 60 * 60 * 1000), // Jour suivant
            quantity: usage.quantityReturned,
            changeType: 'increase',
            author: event.responsible?.name
          })
        }
        
        if (usage.quantityLost > 0) {
          history.push({
            id: `loss-${event.id}-${material.id}`,
            type: 'loss',
            typeText: 'Perte',
            title: `Perte lors de ${event.name}`,
            description: `${usage.quantityLost} ${material.unit} perdues/cassées`,
            date: new Date(event.date.getTime() + 24 * 60 * 60 * 1000),
            quantity: usage.quantityLost,
            changeType: 'decrease',
            author: event.responsible?.name
          })
        }
      }
    })
    
    return history.sort((a, b) => new Date(b.date) - new Date(a.date))
  }
  
  const getNewStockValue = () => {
    if (!selectedMaterial.value || !stockForm.value.type || !stockForm.value.quantity) return 0
    
    const current = selectedMaterial.value.totalStock
    const quantity = parseInt(stockForm.value.quantity)
    
    switch (stockForm.value.type) {
      case 'add':
        return current + quantity
      case 'remove':
        return Math.max(0, current - quantity)
      case 'correction':
        return quantity
      default:
        return current
    }
  }
  
  // Fonctions de filtrage et tri
  const filterMaterials = () => {
    let filtered = [...materials.value]
    
    if (searchTerm.value) {
      const search = searchTerm.value.toLowerCase()
      filtered = filtered.filter(m => 
        m.name.toLowerCase().includes(search) ||
        m.description.toLowerCase().includes(search) ||
        getCategoryText(m.category).toLowerCase().includes(search)
      )
    }
    
    if (selectedCategory.value) {
      filtered = filtered.filter(m => m.category === selectedCategory.value)
    }
    
    if (selectedStatus.value) {
      filtered = filtered.filter(m => {
        const status = getStatusClass(m)
        return status === selectedStatus.value
      })
    }
    
    filteredMaterials.value = filtered
    currentPage.value = 1
  }
  
  const sortBy = (field) => {
    if (sortField.value === field) {
      sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
    } else {
      sortField.value = field
      sortOrder.value = 'asc'
    }
  
    filteredMaterials.value.sort((a, b) => {
      let aVal = a[field]
      let bVal = b[field]
      
      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase()
        bVal = bVal.toLowerCase()
      }
      
      if (sortOrder.value === 'asc') {
        return aVal > bVal ? 1 : -1
      } else {
        return aVal < bVal ? 1 : -1
      }
    })
  }
  
  // Fonctions de dialog - Matériel
  const openAddMaterialDialog = () => {
    editingMaterial.value = null
    materialForm.value = {
      name: '',
      category: '',
      description: '',
      totalStock: '',
      unit: '',
      unitPrice: '',
      minStock: 5,
      image: '',
      notes: ''
    }
    materialDialog.value = true
  }
  
  const closeMaterialDialog = () => {
    materialDialog.value = false
    editingMaterial.value = null
  }
  
  const editMaterial = (material) => {
    editingMaterial.value = material
    materialForm.value = {
      name: material.name,
      category: material.category,
      description: material.description,
      totalStock: material.totalStock,
      unit: material.unit,
      unitPrice: material.unitPrice,
      minStock: material.minStock,
      image: material.image,
      notes: material.notes
    }
    materialDialog.value = true
  }
  
  const saveMaterial = () => {
    if (editingMaterial.value) {
      // Mise à jour
      const index = materials.value.findIndex(m => m.id === editingMaterial.value.id)
      const oldStock = materials.value[index].totalStock
      const newStock = parseInt(materialForm.value.totalStock)
      const stockDiff = newStock - oldStock
      
      materials.value[index] = {
        ...materials.value[index],
        name: materialForm.value.name,
        category: materialForm.value.category,
        description: materialForm.value.description,
        totalStock: newStock,
        availableStock: materials.value[index].availableStock + stockDiff,
        unit: materialForm.value.unit,
        unitPrice: parseFloat(materialForm.value.unitPrice),
        minStock: parseInt(materialForm.value.minStock),
        image: materialForm.value.image || '/placeholder.svg?height=100&width=100&query=' + encodeURIComponent(materialForm.value.name),
        notes: materialForm.value.notes
      }
    } else {
      // Nouveau matériel
      const newMaterial = {
        id: Date.now(),
        name: materialForm.value.name,
        category: materialForm.value.category,
        description: materialForm.value.description,
        totalStock: parseInt(materialForm.value.totalStock),
        availableStock: parseInt(materialForm.value.totalStock),
        outStock: 0,
        lostStock: 0,
        unit: materialForm.value.unit,
        unitPrice: parseFloat(materialForm.value.unitPrice),
        minStock: parseInt(materialForm.value.minStock),
        image: materialForm.value.image || '/placeholder.svg?height=100&width=100&query=' + encodeURIComponent(materialForm.value.name),
        notes: materialForm.value.notes,
        createdAt: new Date(),
        history: []
      }
      materials.value.unshift(newMaterial)
    }
    
    filterMaterials()
    closeMaterialDialog()
  }
  
  const viewMaterialDetails = (material) => {
    selectedMaterial.value = material
    detailsDialog.value = true
  }
  
  const closeDetailsDialog = () => {
    detailsDialog.value = false
    selectedMaterial.value = null
  }
  
  const viewMaterialHistory = (material) => {
    selectedMaterial.value = material
    historyDialog.value = true
  }
  
  const closeHistoryDialog = () => {
    historyDialog.value = false
    selectedMaterial.value = null
  }
  
  // Fonctions de dialog - Stock
  const openStockDialog = (material) => {
    selectedMaterial.value = material
    stockForm.value = {
      type: '',
      quantity: '',
      reason: ''
    }
    stockDialog.value = true
  }
  
  const closeStockDialog = () => {
    stockDialog.value = false
    selectedMaterial.value = null
  }
  
  const updateStockForm = () => {
    stockForm.value.quantity = ''
  }
  
  const saveStockAdjustment = () => {
    const material = selectedMaterial.value
    const type = stockForm.value.type
    const quantity = parseInt(stockForm.value.quantity)
    const reason = stockForm.value.reason
    
    const materialIndex = materials.value.findIndex(m => m.id === material.id)
    const oldTotal = material.totalStock
    let newTotal = oldTotal
    
    switch (type) {
      case 'add':
        newTotal = oldTotal + quantity
        materials.value[materialIndex].totalStock = newTotal
        materials.value[materialIndex].availableStock += quantity
        break
      case 'remove':
        newTotal = Math.max(0, oldTotal - quantity)
        const removed = oldTotal - newTotal
        materials.value[materialIndex].totalStock = newTotal
        materials.value[materialIndex].availableStock = Math.max(0, materials.value[materialIndex].availableStock - removed)
        break
      case 'correction':
        newTotal = quantity
        const diff = newTotal - oldTotal
        materials.value[materialIndex].totalStock = newTotal
        materials.value[materialIndex].availableStock = Math.max(0, materials.value[materialIndex].availableStock + diff)
        break
    }
    
    // Ajouter à l'historique
    const historyEntry = {
      id: Date.now(),
      type: 'adjustment',
      typeText: 'Ajustement',
      title: `Ajustement de stock - ${type === 'add' ? 'Ajout' : type === 'remove' ? 'Retrait' : 'Correction'}`,
      description: reason,
      date: new Date(),
      quantity: type === 'correction' ? Math.abs(newTotal - oldTotal) : quantity,
      changeType: type === 'add' || (type === 'correction' && newTotal > oldTotal) ? 'increase' : 'decrease',
      author: currentUser.value.name
    }
    
    if (!materials.value[materialIndex].history) {
      materials.value[materialIndex].history = []
    }
    materials.value[materialIndex].history.push(historyEntry)
    
    filterMaterials()
    closeStockDialog()
  }
  
  // Fonctions de dialog - Événements
  const openEventDialog = () => {
    editingEvent.value = null
    eventForm.value = {
      name: '',
      date: '',
      description: '',
      responsibleId: ''
    }
    eventDialog.value = true
  }
  
  const closeEventDialog = () => {
    eventDialog.value = false
    editingEvent.value = null
  }
  
  const saveEvent = () => {
    const responsible = members.value.find(m => m.id === parseInt(eventForm.value.responsibleId))
    
    if (editingEvent.value) {
      // Mise à jour
      const index = events.value.findIndex(e => e.id === editingEvent.value.id)
      events.value[index] = {
        ...events.value[index],
        name: eventForm.value.name,
        date: new Date(eventForm.value.date),
        description: eventForm.value.description,
        responsible
      }
    } else {
      // Nouvel événement
      const newEvent = {
        id: Date.now(),
        name: eventForm.value.name,
        description: eventForm.value.description,
        date: new Date(eventForm.value.date),
        status: 'planned',
        createdAt: new Date(),
        responsible,
        materialUsage: []
      }
      events.value.unshift(newEvent)
    }
    
    closeEventDialog()
  }
  
  const viewEventDetails = (event) => {
    selectedEvent.value = event
    eventDetailsDialog.value = true
  }
  
  const closeEventDetailsDialog = () => {
    eventDetailsDialog.value = false
    selectedEvent.value = null
  }
  
  const startEvent = (event) => {
    const eventIndex = events.value.findIndex(e => e.id === event.id)
    events.value[eventIndex].status = 'ongoing'
  }
  
  const endEvent = (event) => {
    const eventIndex = events.value.findIndex(e => e.id === event.id)
    events.value[eventIndex].status = 'completed'
  }
  
  // Fonctions de gestion du matériel pour événements
  const openMaterialUsageDialog = (event) => {
    selectedEvent.value = event
    usageForm.value = { materialId: '', quantity: '', notes: '' }
    returnForm.value = { materialId: '', quantity: '', condition: 'good', notes: '' }
    lossForm.value = { materialId: '', quantity: '', type: '', description: '' }
    materialUsageDialog.value = true
  }
  
  const closeMaterialUsageDialog = () => {
    materialUsageDialog.value = false
    selectedEvent.value = null
    activeUsageTab.value = 'out'
  }
  
  const addMaterialOut = () => {
    const materialId = parseInt(usageForm.value.materialId)
    const quantity = parseInt(usageForm.value.quantity)
    const notes = usageForm.value.notes
    
    // Mettre à jour le stock du matériel
    const materialIndex = materials.value.findIndex(m => m.id === materialId)
    materials.value[materialIndex].availableStock -= quantity
    materials.value[materialIndex].outStock += quantity
    
    // Ajouter ou mettre à jour l'utilisation dans l'événement
    const eventIndex = events.value.findIndex(e => e.id === selectedEvent.value.id)
    const existingUsage = events.value[eventIndex].materialUsage.find(u => u.materialId === materialId)
    
    if (existingUsage) {
      existingUsage.quantityOut += quantity
      if (notes) existingUsage.notes += '; ' + notes
    } else {
      events.value[eventIndex].materialUsage.push({
        materialId,
        quantityOut: quantity,
        quantityReturned: 0,
        quantityLost: 0,
        notes
      })
    }
    
    // Mettre à jour selectedEvent
    selectedEvent.value = events.value[eventIndex]
    
    // Réinitialiser le formulaire
    usageForm.value = { materialId: '', quantity: '', notes: '' }
  }
  
  const addMaterialReturn = () => {
    const materialId = parseInt(returnForm.value.materialId)
    const quantity = parseInt(returnForm.value.quantity)
    const condition = returnForm.value.condition
    const notes = returnForm.value.notes
    
    // Mettre à jour l'utilisation dans l'événement
    const eventIndex = events.value.findIndex(e => e.id === selectedEvent.value.id)
    const usage = events.value[eventIndex].materialUsage.find(u => u.materialId === materialId)
    
    if (usage) {
      usage.quantityReturned += quantity
      if (notes) usage.notes += '; Retour: ' + notes
      
      // Si en bon état, remettre en stock disponible
      if (condition === 'good') {
        const materialIndex = materials.value.findIndex(m => m.id === materialId)
        materials.value[materialIndex].availableStock += quantity
        materials.value[materialIndex].outStock -= quantity
      } else if (condition === 'damaged' || condition === 'lost') {
        // Si endommagé ou perdu, compter comme perte
        usage.quantityLost += quantity
        const materialIndex = materials.value.findIndex(m => m.id === materialId)
        materials.value[materialIndex].outStock -= quantity
        materials.value[materialIndex].lostStock += quantity
        materials.value[materialIndex].totalStock -= quantity
      }
    }
    
    // Mettre à jour selectedEvent
    selectedEvent.value = events.value[eventIndex]
    
    // Réinitialiser le formulaire
    returnForm.value = { materialId: '', quantity: '', condition: 'good', notes: '' }
  }
  
  const addMaterialLoss = () => {
    const materialId = parseInt(lossForm.value.materialId)
    const quantity = parseInt(lossForm.value.quantity)
    const type = lossForm.value.type
    const description = lossForm.value.description
    
    // Mettre à jour l'utilisation dans l'événement
    const eventIndex = events.value.findIndex(e => e.id === selectedEvent.value.id)
    const usage = events.value[eventIndex].materialUsage.find(u => u.materialId === materialId)
    
    if (usage) {
      usage.quantityLost += quantity
      usage.notes += `; Perte (${type}): ${description}`
    }
    
    // Mettre à jour le stock du matériel
    const materialIndex = materials.value.findIndex(m => m.id === materialId)
    materials.value[materialIndex].outStock -= quantity
    materials.value[materialIndex].lostStock += quantity
    materials.value[materialIndex].totalStock -= quantity
    
    // Mettre à jour selectedEvent
    selectedEvent.value = events.value[eventIndex]
    
    // Réinitialiser le formulaire
    lossForm.value = { materialId: '', quantity: '', type: '', description: '' }
  }
  
  const exportInventory = () => {
    const data = {
      materials: materials.value,
      events: events.value,
      exportDate: new Date(),
      summary: {
        totalMaterials: totalMaterials.value,
        totalStock: totalStock.value,
        availableStock: availableStock.value,
        outStock: outStock.value,
        lowStockItems: lowStockItems.value
      }
    }
    
    const dataStr = JSON.stringify(data, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `inventaire-aeemci-${new Date().toISOString().split('T')[0]}.json`
    link.click()
  }
  
  // Lifecycle
  onMounted(() => {
    filterMaterials()
  })
  </script>
  
  <style scoped>
  /* Reset et animations */
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
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
  
  /* Base */
  .materiel-wrapper {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background: #ffffff;
    min-height: 100vh;
    height: 100vh;
    overflow-y: auto;
    padding: 0;
    margin: 0;
  }
  
  .materiel-container {
    background: #ffffff;
    min-height: 100vh;
    padding: 32px;
    max-width: none;
    width: 100%;
    margin: 0;
  }
  
  /* Header */
  .materiel-header {
    margin-bottom: 32px;
    padding: 24px 0;
  }
  
  .header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 20px;
  }
  
  .title-section h1 {
    font-size: 2.5rem;
    font-weight: 700;
    color: #1f2937;
    margin: 0 0 8px 0;
    background: linear-gradient(135deg, #10b981, #047857);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  .title-section p {
    color: #6b7280;
    font-size: 1.1rem;
    margin: 0;
  }
  
  .header-actions {
    display: flex;
    gap: 12px;
    align-items: center;
  }
  
  .action-btn {
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
  
  .action-btn.small {
    padding: 8px 16px;
    font-size: 0.85rem;
  }
  
  .action-btn.primary {
    background: linear-gradient(135deg, #10b981, #047857);
    color: white;
  }
  
  .action-btn.primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(16, 185, 129, 0.4);
  }
  
  .action-btn.secondary {
    background: linear-gradient(135deg, #3b82f6, #1d4ed8);
    color: white;
  }
  
  .action-btn.secondary:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4);
  }
  
  .action-btn.tertiary {
    background: white;
    color: #374151;
    border: 2px solid #e5e7eb;
  }
  
  .action-btn.tertiary:hover {
    border-color: #10b981;
    color: #10b981;
    transform: translateY(-2px);
  }
  
  .btn-icon {
    width: 18px;
    height: 18px;
    margin-right: 8px;
  }
  
  /* Statistics Cards */
  .stats-section {
    margin-bottom: 32px;
  }
  
  .stat-cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 24px;
  }
  
  .stat-card {
    background: white;
    border-radius: 20px;
    padding: 24px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
    border: 1px solid #e5e7eb;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
  }
  
  .stat-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
  }
  
  .stat-card.primary::before { background: linear-gradient(90deg, #10b981, #047857); }
  .stat-card.secondary::before { background: linear-gradient(90deg, #22c55e, #16a34a); }
  .stat-card.tertiary::before { background: linear-gradient(90deg, #f59e0b, #d97706); }
  .stat-card.quaternary::before { background: linear-gradient(90deg, #ef4444, #dc2626); }
  
  .stat-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
  }
  
  .card-icon {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 16px;
  }
  
  .stat-card.primary .card-icon { background: rgba(16, 185, 129, 0.1); }
  .stat-card.secondary .card-icon { background: rgba(34, 197, 94, 0.1); }
  .stat-card.tertiary .card-icon { background: rgba(245, 158, 11, 0.1); }
  .stat-card.quaternary .card-icon { background: rgba(239, 68, 68, 0.1); }
  
  .card-icon .icon {
    width: 24px;
    height: 24px;
  }
  
  .stat-card.primary .icon { color: #10b981; }
  .stat-card.secondary .icon { color: #22c55e; }
  .stat-card.tertiary .icon { color: #f59e0b; }
  .stat-card.quaternary .icon { color: #ef4444; }
  
  .card-content h3 {
    font-size: 2rem;
    font-weight: 700;
    color: #1f2937;
    margin: 0 0 4px 0;
  }
  
  .card-content p {
    color: #6b7280;
    font-size: 0.95rem;
    margin: 0 0 12px 0;
  }
  
  .card-trend {
    display: flex;
    align-items: center;
    font-size: 0.85rem;
    font-weight: 500;
  }
  
  .card-trend.positive { color: #059669; }
  .card-trend.negative { color: #dc2626; }
  .card-trend.neutral { color: #6b7280; }
  .card-trend.warning { color: #d97706; }
  
  .trend-icon {
    width: 16px;
    height: 16px;
    margin-right: 4px;
  }
  
  /* Filters */
  .filters-section {
    display: flex;
    gap: 16px;
    margin-bottom: 32px;
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
    border-color: #10b981;
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
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
    border-color: #10b981;
  }
  
  /* Table */
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
  
  .materials-table {
    width: 100%;
    border-collapse: collapse;
  }
  
  .materials-table th,
  .materials-table td {
    padding: 16px 20px;
    text-align: left;
    border-bottom: 1px solid #f3f4f6;
  }
  
  .materials-table th {
    background-color: #f8fafc;
    font-size: 0.85rem;
    font-weight: 600;
    text-transform: uppercase;
    color: #374151;
    letter-spacing: 0.5px;
  }
  
  .materials-table th.sortable {
    cursor: pointer;
    user-select: none;
    position: relative;
    transition: all 0.2s ease;
  }
  
  .materials-table th.sortable:hover {
    background-color: #e2e8f0;
  }
  
  .sort-icon {
    width: 14px;
    height: 14px;
    margin-left: 4px;
    display: inline-block;
  }
  
  .materials-table td {
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
  
  /* Table Cells */
  .material-cell {
    display: flex;
    align-items: center;
    gap: 16px;
  }
  
  .material-image {
    flex-shrink: 0;
  }
  
  .item-image {
    width: 60px;
    height: 60px;
    border-radius: 8px;
    object-fit: cover;
    border: 2px solid #e5e7eb;
  }
  
  .material-info {
    flex: 1;
  }
  
  .material-name {
    font-weight: 600;
    color: #1f2937;
    margin: 0 0 4px 0;
    display: block;
  }
  
  .material-description {
    color: #6b7280;
    font-size: 0.85rem;
    line-height: 1.4;
    margin: 0 0 8px 0;
    display: block;
  }
  
  .material-meta {
    display: flex;
    gap: 12px;
  }
  
  .meta-item {
    display: flex;
    align-items: center;
    font-size: 0.75rem;
    color: #9ca3af;
  }
  
  .meta-icon {
    width: 12px;
    height: 12px;
    margin-right: 4px;
  }
  
  .category-badge {
    padding: 4px 8px;
    border-radius: 8px;
    font-size: 0.8rem;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  
  .category-badge.audio {
    background: #fef3c7;
    color: #d97706;
  }
  
  .category-badge.video {
    background: #dbeafe;
    color: #1d4ed8;
  }
  
  .category-badge.eclairage {
    background: #fce7f3;
    color: #be185d;
  }
  
  .category-badge.mobilier {
    background: #f3e8ff;
    color: #7c3aed;
  }
  
  .category-badge.decoration {
    background: #ecfdf5;
    color: #047857;
  }
  
  .category-badge.technique {
    background: #f1f5f9;
    color: #475569;
  }
  
  .category-badge.autre {
    background: #f3f4f6;
    color: #6b7280;
  }
  
  .stock-cell,
  .available-cell,
  .out-cell {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .stock-number,
  .available-number,
  .out-number {
    font-weight: 600;
    font-size: 1.1rem;
    color: #1f2937;
  }
  
  .available-number.zero {
    color: #dc2626;
  }
  
  .available-number.low {
    color: #f59e0b;
  }
  
  .available-number.good {
    color: #10b981;
  }
  
  .stock-unit {
    color: #6b7280;
    font-size: 0.8rem;
  }
  
  .status-badge {
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 600;
    text-transform: uppercase;
  }
  
  .status-badge.available {
    background: #d1fae5;
    color: #047857;
  }
  
  .status-badge.low-stock {
    background: #fef3c7;
    color: #d97706;
  }
  
  .status-badge.out-of-stock {
    background: #fee2e2;
    color: #dc2626;
  }
  
  .value-cell {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  }
  
  .value-amount {
    font-weight: 600;
    color: #1f2937;
    font-size: 1rem;
  }
  
  .value-unit {
    color: #6b7280;
    font-size: 0.8rem;
  }
  
  .action-buttons {
    display: flex;
    gap: 8px;
  }
  
  .action-btn-small {
    padding: 6px 8px;
    border-radius: 8px;
    border: none;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .action-btn-small:hover {
    transform: scale(1.1);
  }
  
  .action-btn-small.view {
    background-color: #3b82f6;
    color: white;
  }
  
  .action-btn-small.edit {
    background-color: #fbbf24;
    color: white;
  }
  
  .action-btn-small.history {
    background-color: #8b5cf6;
    color: white;
  }
  
  .action-btn-small.stock {
    background-color: #10b981;
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
  
  /* Events Section */
  .events-section {
    margin-bottom: 32px;
  }
  
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
  }
  
  .section-header h2 {
    color: #1f2937;
    font-size: 1.5rem;
    font-weight: 600;
    margin: 0;
  }
  
  .events-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 24px;
  }
  
  .event-card {
    background: white;
    border-radius: 16px;
    padding: 24px;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
    border: 1px solid #e5e7eb;
    transition: all 0.3s ease;
    cursor: pointer;
  }
  
  .event-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.12);
  }
  
  .event-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }
  
  .event-status {
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 600;
    text-transform: uppercase;
  }
  
  .event-status.planned {
    background: #dbeafe;
    color: #1d4ed8;
  }
  
  .event-status.ongoing {
    background: #fef3c7;
    color: #d97706;
  }
  
  .event-status.completed {
    background: #d1fae5;
    color: #047857;
  }
  
  .event-status.cancelled {
    background: #fee2e2;
    color: #dc2626;
  }
  
  .event-date {
    font-size: 0.9rem;
    color: #6b7280;
    font-weight: 500;
  }
  
  .event-title {
    font-size: 1.2rem;
    font-weight: 600;
    color: #1f2937;
    margin: 0 0 8px 0;
    line-height: 1.4;
  }
  
  .event-description {
    color: #6b7280;
    font-size: 0.9rem;
    line-height: 1.5;
    margin: 0 0 16px 0;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  
  .event-stats {
    display: flex;
    gap: 16px;
    margin-bottom: 16px;
    flex-wrap: wrap;
  }
  
  .stat-item {
    display: flex;
    align-items: center;
    font-size: 0.85rem;
    color: #6b7280;
  }
  
  .stat-icon {
    width: 14px;
    height: 14px;
    margin-right: 4px;
  }
  
  .event-progress {
    margin-top: 16px;
  }
  
  .progress-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
    font-size: 0.9rem;
    font-weight: 500;
    color: #374151;
  }
  
  .progress-bar {
    width: 100%;
    height: 8px;
    background-color: #e5e7eb;
    border-radius: 4px;
    overflow: hidden;
  }
  
  .progress-fill {
    height: 100%;
    transition: width 0.6s ease;
    border-radius: 4px;
  }
  
  .progress-fill.low-progress {
    background: linear-gradient(90deg, #f87171, #ef4444);
  }
  
  .progress-fill.medium-progress {
    background: linear-gradient(90deg, #fbbf24, #f59e0b);
  }
  
  .progress-fill.high-progress {
    background: linear-gradient(90deg, #34d399, #10b981);
  }
  
  /* Dialogs */
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
    max-width: 700px;
  }
  
  .dialog-box.extra-large {
    max-width: 1000px;
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
    border-color: #10b981;
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
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
  
  .button-icon {
    width: 16px;
    height: 16px;
    margin-right: 8px;
  }
  
  /* Stock Dialog Specific */
  .current-stock-info {
    background: #f8fafc;
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 20px;
    border: 1px solid #e5e7eb;
  }
  
  .stock-info-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
  }
  
  .stock-info-item:last-child {
    margin-bottom: 0;
  }
  
  .stock-info-item label {
    font-weight: 500;
    color: #6b7280;
  }
  
  .stock-value {
    font-weight: 600;
    color: #1f2937;
  }
  
  .stock-value.available {
    color: #10b981;
  }
  
  .stock-value.out {
    color: #f59e0b;
  }
  
  .preview-adjustment {
    background: #f0f9ff;
    border-radius: 12px;
    padding: 16px;
    border: 1px solid #bfdbfe;
  }
  
  .preview-adjustment h4 {
    margin: 0 0 12px 0;
    color: #1d4ed8;
    font-size: 1rem;
  }
  
  .adjustment-preview {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .before-after {
    display: flex;
    align-items: center;
    gap: 16px;
  }
  
  .before,
  .after {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
  }
  
  .before label,
  .after label {
    font-size: 0.8rem;
    color: #6b7280;
    font-weight: 500;
  }
  
  .before span,
  .after span {
    font-weight: 600;
    color: #1f2937;
  }
  
  .arrow {
    width: 20px;
    height: 20px;
    color: #6b7280;
  }
  
  /* Material Details */
  .material-details {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }
  
  .details-section {
    padding: 20px;
    background: #f8fafc;
    border-radius: 12px;
    border: 1px solid #e5e7eb;
  }
  
  .details-section h4 {
    margin: 0 0 16px 0;
    color: #1f2937;
    font-size: 1.1rem;
    font-weight: 600;
  }
  
  .details-section h5 {
    margin: 16px 0 8px 0;
    color: #374151;
    font-size: 1rem;
    font-weight: 600;
  }
  
  .material-overview {
    display: flex;
    gap: 24px;
    align-items: flex-start;
  }
  
  .material-image-large {
    flex-shrink: 0;
  }
  
  .detail-image {
    width: 150px;
    height: 150px;
    border-radius: 12px;
    object-fit: cover;
    border: 2px solid #e5e7eb;
  }
  
  .material-info-detailed {
    flex: 1;
  }
  
  .info-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
    margin-bottom: 20px;
  }
  
  .info-item {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  
  .info-item label {
    font-size: 0.85rem;
    font-weight: 600;
    color: #6b7280;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  
  .value-highlight {
    font-weight: 700;
    color: #10b981;
    font-size: 1.1rem;
  }
  
  .description-section p,
  .notes-section p {
    color: #374151;
    line-height: 1.6;
    margin: 0;
  }
  
  .stock-summary {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
  }
  
  .stock-item {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 16px;
    background: white;
    border-radius: 12px;
    border: 1px solid #e5e7eb;
  }
  
  .stock-item.total {
    border-color: #10b981;
    background: #f0fdf4;
  }
  
  .stock-item.available {
    border-color: #22c55e;
    background: #f0fdf4;
  }
  
  .stock-item.out {
    border-color: #f59e0b;
    background: #fffbeb;
  }
  
  .stock-item.lost {
    border-color: #ef4444;
    background: #fef2f2;
  }
  
  .stock-icon {
    width: 40px;
    height: 40px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .stock-item.total .stock-icon { background: rgba(16, 185, 129, 0.1); }
  .stock-item.available .stock-icon { background: rgba(34, 197, 94, 0.1); }
  .stock-item.out .stock-icon { background: rgba(245, 158, 11, 0.1); }
  .stock-item.lost .stock-icon { background: rgba(239, 68, 68, 0.1); }
  
  .stock-icon .icon {
    width: 20px;
    height: 20px;
  }
  
  .stock-item.total .icon { color: #10b981; }
  .stock-item.available .icon { color: #22c55e; }
  .stock-item.out .icon { color: #f59e0b; }
  .stock-item.lost .icon { color: #ef4444; }
  
  .stock-details {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  
  .stock-label {
    font-size: 0.85rem;
    color: #6b7280;
    font-weight: 500;
  }
  
  .stock-value {
    font-size: 1.2rem;
    font-weight: 700;
    color: #1f2937;
  }
  
  .recent-events-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  
  .usage-item {
    padding: 16px;
    background: white;
    border-radius: 12px;
    border: 1px solid #e5e7eb;
  }
  
  .usage-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
  }
  
  .usage-header strong {
    color: #1f2937;
    font-size: 1rem;
  }
  
  .usage-date {
    color: #6b7280;
    font-size: 0.85rem;
  }
  
  .usage-details {
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
  }
  
  .usage-stat {
    display: flex;
    align-items: center;
    font-size: 0.85rem;
    color: #6b7280;
  }
  
  .usage-icon {
    width: 14px;
    height: 14px;
    margin-right: 4px;
  }
  
  .usage-icon.out {
    color: #f59e0b;
  }
  
  .usage-icon.in {
    color: #10b981;
  }
  
  .usage-icon.lost {
    color: #ef4444;
  }
  
  .no-usage {
    text-align: center;
    padding: 40px 20px;
    color: #6b7280;
  }
  
  .no-usage-icon {
    width: 48px;
    height: 48px;
    margin: 0 auto 16px auto;
    opacity: 0.5;
  }
  
  .no-usage p {
    margin: 0;
    font-size: 1rem;
  }
  
  /* History Timeline */
  .history-timeline {
    position: relative;
    padding-left: 32px;
  }
  
  .history-timeline::before {
    content: '';
    position: absolute;
    left: 16px;
    top: 0;
    bottom: 0;
    width: 2px;
    background: #e5e7eb;
  }
  
  .timeline-item {
    position: relative;
    margin-bottom: 24px;
  }
  
  .timeline-item:last-child {
    margin-bottom: 0;
  }
  
  .timeline-marker {
    position: absolute;
    left: -24px;
    top: 8px;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    border: 3px solid white;
    box-shadow: 0 0 0 2px #e5e7eb;
  }
  
  .timeline-marker.creation {
    background: #10b981;
  }
  
  .timeline-marker.out {
    background: #f59e0b;
  }
  
  .timeline-marker.return {
    background: #22c55e;
  }
  
  .timeline-marker.loss {
    background: #ef4444;
  }
  
  .timeline-marker.adjustment {
    background: #8b5cf6;
  }
  
  .timeline-content {
    background: white;
    border-radius: 12px;
    padding: 16px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    border: 1px solid #e5e7eb;
  }
  
  .timeline-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 12px;
  }
  
  .timeline-title {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  
  .timeline-title strong {
    color: #1f2937;
    font-size: 0.95rem;
  }
  
  .timeline-type {
    font-size: 0.75rem;
    color: #6b7280;
    text-transform: uppercase;
    font-weight: 600;
    letter-spacing: 0.5px;
  }
  
  .timeline-date {
    font-size: 0.85rem;
    color: #6b7280;
  }
  
  .timeline-details p {
    margin: 0 0 12px 0;
    color: #374151;
    line-height: 1.5;
  }
  
  .timeline-meta {
    display: flex;
    align-items: center;
    gap: 16px;
    font-size: 0.85rem;
  }
  
  .quantity-change {
    font-weight: 600;
    padding: 2px 8px;
    border-radius: 4px;
  }
  
  .quantity-change.increase {
    background: #d1fae5;
    color: #047857;
  }
  
  .quantity-change.decrease {
    background: #fee2e2;
    color: #dc2626;
  }
  
  .author {
    color: #6b7280;
  }
  
  /* Event Details */
  .event-details {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }
  
  .event-status-badge {
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 600;
    text-transform: uppercase;
  }
  
  .event-status-badge.planned {
    background: #dbeafe;
    color: #1d4ed8;
  }
  
  .event-status-badge.ongoing {
    background: #fef3c7;
    color: #d97706;
  }
  
  .event-status-badge.completed {
    background: #d1fae5;
    color: #047857;
  }
  
  .event-status-badge.cancelled {
    background: #fee2e2;
    color: #dc2626;
  }
  
  .material-usage-table {
    background: white;
    border-radius: 12px;
    overflow: hidden;
    border: 1px solid #e5e7eb;
  }
  
  .usage-table {
    width: 100%;
    border-collapse: collapse;
  }
  
  .usage-table th,
  .usage-table td {
    padding: 12px 16px;
    text-align: left;
    border-bottom: 1px solid #f3f4f6;
  }
  
  .usage-table th {
    background-color: #f8fafc;
    font-size: 0.8rem;
    font-weight: 600;
    text-transform: uppercase;
    color: #374151;
    letter-spacing: 0.5px;
  }
  
  .material-usage-cell {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  
  .material-usage-cell strong {
    font-size: 0.9rem;
    color: #1f2937;
  }
  
  .material-usage-cell small {
    color: #6b7280;
    font-size: 0.8rem;
  }
  
  .quantity {
    font-weight: 600;
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 0.9rem;
  }
  
  .quantity.out {
    background: #fef3c7;
    color: #d97706;
  }
  
  .quantity.in {
    background: #d1fae5;
    color: #047857;
  }
  
  .quantity.lost {
    background: #fee2e2;
    color: #dc2626;
  }
  
  .no-loss {
    color: #9ca3af;
    font-style: italic;
  }
  
  .usage-status {
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
  }
  
  .usage-status.complete {
    background: #d1fae5;
    color: #047857;
  }
  
  .usage-status.partial {
    background: #fef3c7;
    color: #d97706;
  }
  
  .usage-status.pending {
    background: #f3f4f6;
    color: #6b7280;
  }
  
  .usage-status.with-loss {
    background: #fee2e2;
    color: #dc2626;
  }
  
  .no-material-usage {
    text-align: center;
    padding: 40px 20px;
    color: #6b7280;
  }
  
  .no-usage-icon {
    width: 48px;
    height: 48px;
    margin: 0 auto 16px auto;
    opacity: 0.5;
  }
  
  .no-material-usage p {
    margin: 0;
    font-size: 1rem;
  }
  
  /* Material Usage Dialog */
  .usage-tabs {
    display: flex;
    border-bottom: 1px solid #e5e7eb;
    margin-bottom: 20px;
  }
  
  .tab-btn {
    padding: 12px 20px;
    border: none;
    background: none;
    cursor: pointer;
    font-weight: 500;
    color: #6b7280;
    border-bottom: 2px solid transparent;
    transition: all 0.2s ease;
  }
  
  .tab-btn.active {
    color: #10b981;
    border-bottom-color: #10b981;
  }
  
  .tab-btn:hover {
    color: #374151;
  }
  
  .tab-content {
    padding: 20px 0;
  }
  
  /* Responsive */
  @media (max-width: 768px) {
    .materiel-container {
      padding: 20px;
    }
    
    .title-section h1 {
      font-size: 2rem;
    }
    
    .header-content {
      flex-direction: column;
      align-items: stretch;
    }
    
    .header-actions {
      flex-wrap: wrap;
    }
    
    .stat-cards {
      grid-template-columns: 1fr;
    }
    
    .filters-section {
      flex-direction: column;
      align-items: stretch;
    }
    
    .search-container {
      min-width: auto;
    }
    
    .events-grid {
      grid-template-columns: 1fr;
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
    
    .info-grid {
      grid-template-columns: 1fr;
    }
    
    .stock-summary {
      grid-template-columns: 1fr;
    }
    
    .material-overview {
      flex-direction: column;
    }
    
    .materials-table {
      font-size: 0.85rem;
    }
    
    .materials-table th,
    .materials-table td {
      padding: 12px 8px;
    }
    
    .material-cell {
      flex-direction: column;
      align-items: flex-start;
      gap: 8px;
    }
    
    .material-image {
      align-self: center;
    }
    
    .event-stats {
      flex-direction: column;
      gap: 8px;
    }
    
    .before-after {
      flex-direction: column;
      gap: 12px;
    }
    
    .usage-details {
      flex-direction: column;
      gap: 8px;
    }
    
    .timeline-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 8px;
    }
    
    .timeline-meta {
      flex-direction: column;
      align-items: flex-start;
      gap: 8px;
    }
    
    .usage-tabs {
      flex-wrap: wrap;
    }
    
    .tab-btn {
      flex: 1;
      min-width: 120px;
    }
  }
  
  @media (max-width: 480px) {
    .materiel-container {
      padding: 16px;
    }
    
    .title-section h1 {
      font-size: 1.8rem;
    }
    
    .stat-card {
      padding: 20px;
    }
    
    .card-content h3 {
      font-size: 1.5rem;
    }
    
    .table-container {
      overflow-x: scroll;
    }
    
    .materials-table {
      min-width: 800px;
    }
    
    .dialog-actions {
      flex-direction: column;
    }
    
    .dialog-btn {
      justify-content: center;
    }
    
    .stock-summary {
      grid-template-columns: 1fr;
    }
    
    .event-card {
      padding: 20px;
    }
    
    .action-buttons {
      flex-wrap: wrap;
    }
  }
  </style>