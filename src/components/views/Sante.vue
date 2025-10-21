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
                  <svg class="w-6 h-6 lg:w-8 lg:h-8 text-red-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  Commission Santé SENAFOI 25
                </h1>
                <p class="overview-date">Gestion des visites médicales - {{ currentDateFormatted }}</p>
              </div>
            </div>
            <div class="header-actions-right">
              <button @click="exportHealthReport()" class="export-button green-button">
                <svg class="w-4 h-4 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Rapport Excel</span>
              </button>
              <button @click="exportHealthPDF()" class="export-button red-button">
                <svg class="w-4 h-4 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <span>Rapport PDF</span>
              </button>
            </div>
          </div>
  
          <!-- Statistiques -->
          <div class="product-stats">
            <div class="stat-card">
              <div class="stat-icon stat-icon-red">
                <svg class="w-5 h-5 lg:w-6 lg:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <div class="stat-info">
                <div class="stat-value">{{ totalHealthVisits }}</div>
                <div class="stat-label">Total Visites</div>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon stat-icon-green">
                <svg class="w-5 h-5 lg:w-6 lg:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div class="stat-info">
                <div class="stat-value">{{ uniqueSeminaristsVisited }}</div>
                <div class="stat-label">Séminaristes Traités</div>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon stat-icon-blue">
                <svg class="w-5 h-5 lg:w-6 lg:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div class="stat-info">
                <div class="stat-value">{{ recentHealthVisits.length }}</div>
                <div class="stat-label">Visites Récentes</div>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon stat-icon-purple">
                <svg class="w-5 h-5 lg:w-6 lg:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div class="stat-info">
                <div class="stat-value">{{ todayVisits }}</div>
                <div class="stat-label">Visites Aujourd'hui</div>
              </div>
            </div>
          </div>
  
          <!-- Filtres avancés -->
          <div class="search-filters">
            <div class="search-bar">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-search">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <input v-model="matriculeInput" @keyup.enter="handleLookup" type="text" placeholder="Rechercher par matricule...">
            </div>
            <div class="filter-options">
              <select v-model="filters.period" @change="applyFilters">
                <option value="">Toutes les périodes</option>
                <option value="today">Aujourd'hui</option>
                <option value="week">Cette semaine</option>
                <option value="month">Ce mois</option>
              </select>
              <select v-model="filters.diagnosis_type" @change="applyFilters">
                <option value="">Tous les diagnostics</option>
                <option value="grippe">Grippe</option>
                <option value="maux_tete">Maux de tête</option>
                <option value="fievre">Fièvre</option>
                <option value="fatigue">Fatigue</option>
                <option value="autre">Autre</option>
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
  
          <!-- Section de recherche rapide -->
          <div class="quick-search-section">
            <div class="quick-search-card">
              <div class="card-header">
                <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <h3>Recherche Rapide</h3>
              </div>
              <div class="search-form">
                <input
                  v-model="matriculeInput"
                  @keyup.enter="handleLookup"
                  type="text"
                  placeholder="Entrer le matricule du séminariste"
                  class="search-input"
                />
                <button @click="handleLookup" class="search-button">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Rechercher
                </button>
              </div>
            </div>
          </div>
  
          <!-- Tableau des visites santé -->
          <div class="products-table">
            <!-- Desktop Table View -->
            <div class="desktop-only">
              <div class="table-header">
                <div class="table-cell name-cell">
                  <div class="flex items-center space-x-2">
                    <svg class="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>Séminariste</span>
                  </div>
                </div>
                <div class="table-cell">Date Visite</div>
                <div class="table-cell">Diagnostic</div>
                <div class="table-cell">Médicaments</div>
                <div class="table-cell">Statut</div>
                <div class="table-cell actions-cell">Actions</div>
              </div>
              
              <div v-if="loading" class="loading-indicator">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-loader-2">
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
                Chargement...
              </div>
              
              <div v-else-if="displayedVisits.length === 0" class="no-products">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-heart-pulse">
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7Z"/>
                  <path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27"/>
                </svg>
                <p>Aucune visite santé trouvée</p>
              </div>
              
              <template v-else>
                <div v-for="visit in displayedVisits" :key="visit.id" class="table-row">
                  <div class="table-cell name-cell">
                    <div class="flex items-center">
                      <div class="product-image">
                        {{ getSeminaristPhoto(visit.seminaristId) }}
                        <img v-if="getSeminaristPhoto(visit.seminaristId)" :src="getSeminaristPhoto(visit.seminaristId)" :alt="getSeminaristName(visit.seminaristId)">
                        <div v-else class="no-image">
                          <svg class="w-4 h-4 lg:w-5 lg:h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                      </div>
                      <div class="product-info">
                        <div class="product-name">{{ getSeminaristName(visit.seminaristId) }}</div>
                        <div class="product-reference mobile-only">{{ visit.seminaristId }}</div>
                      </div>
                    </div>
                  </div>
                  <div class="table-cell">
                    <span class="status-badge status-blue">{{ formatDate(visit.date) }}</span>
                  </div>
                  <div class="table-cell">
                    <div class="diagnosis-cell">
                      <p class="diagnosis-text">{{ visit.diagnosis }}</p>
                    </div>
                  </div>
                  <div class="table-cell">
                    <span v-if="visit.medication" class="medication-text">{{ visit.medication }}</span>
                    <span v-else class="status-badge status-out">Aucun</span>
                  </div>
                  <div class="table-cell">
                    <span class="status-badge status-in">
                      <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Traité
                    </span>
                  </div>
                  <div class="table-cell actions-cell">
                    <button @click="viewVisitDetails(visit)" style="padding:2px" class="action-icon view-button" title="Voir détails">
                      <svg class="w-3 h-3 lg:w-4 lg:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                    <button @click="editVisit(visit)" style="padding:2px" class="action-icon edit-button-green" title="Modifier">
                      <svg class="w-3 h-3 lg:w-4 lg:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button @click="downloadVisitReport(visit)" style="padding:2px" class="action-icon download-button-purple" title="Télécharger rapport">
                      <svg class="w-3 h-3 lg:w-4 lg:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </template>
            </div>
  
            <!-- Mobile Card View -->
            <div class="mobile-only">
              <div v-if="loading" class="loading-indicator">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-loader-2">
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
                Chargement...
              </div>
              
              <div v-else-if="displayedVisits.length === 0" class="no-products">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-heart-pulse">
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7Z"/>
                  <path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27"/>
                </svg>
                <p>Aucune visite santé trouvée</p>
              </div>
              
              <template v-else>
                <div class="product-cards-mobile">
                  <div v-for="visit in displayedVisits" :key="visit.id" class="product-card-mobile">
                    <div class="card-header">
                      <div class="product-image">
                        <img v-if="getSeminaristPhoto(visit.seminaristId)" :src="getSeminaristPhoto(visit.seminaristId)" :alt="getSeminaristName(visit.seminaristId)">
                        <div v-else class="no-image">
                          <svg class="w-4 h-4 lg:w-5 lg:h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                      </div>
                      <div class="product-info">
                        <div class="product-name">{{ getSeminaristName(visit.seminaristId) }}</div>
                        <div class="product-reference">{{ formatDate(visit.date) }}</div>
                      </div>
                    </div>
                    <div class="card-body">
                      <div class="card-detail">
                        <span class="detail-label">Diagnostic:</span>
                        <span class="detail-value">{{ visit.diagnosis }}</span>
                      </div>
                      <div class="card-detail">
                        <span class="detail-label">Médicaments:</span>
                        <span class="detail-value">{{ visit.medication || 'Aucun' }}</span>
                      </div>
                      <div class="card-detail">
                        <span class="detail-label">Notes:</span>
                        <span class="detail-value">{{ visit.notes || 'Aucune' }}</span>
                      </div>
                    </div>
                    <div class="card-actions">
                      <button @click="viewVisitDetails(visit)" class="action-icon view-button" title="Voir détails">
                        <svg class="w-3 h-3 lg:w-4 lg:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      <button @click="editVisit(visit)" class="action-icon edit-button-green" title="Modifier">
                        <svg class="w-3 h-3 lg:w-4 lg:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button @click="downloadVisitReport(visit)" class="action-icon download-button-purple" title="Télécharger rapport">
                        <svg class="w-3 h-3 lg:w-4 lg:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </template>
            </div>
          </div>
  
          <!-- Pagination -->
          <div class="pagination">
            <div class="pagination-info">
              Affichage de {{ pagination.from || 0 }} à {{ pagination.to || 0 }} sur {{ pagination.total || 0 }} visites
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
  
          <!-- Formulaire d'ajout de visite -->
          <div v-if="selectedSeminarist" class="add-visit-section">
            <div class="add-visit-card">
              <div class="card-header">
                <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <h3>Nouvelle Visite pour {{ selectedSeminarist.name }}</h3>
              </div>
              <form @submit.prevent="addHealthVisit" class="visit-form">
                <div class="form-row">
                  <div class="form-group">
                    <label class="form-label">Diagnostic *</label>
                    <textarea v-model="newVisitForm.diagnosis" rows="3" required class="form-textarea" placeholder="Décrivez le diagnostic..."></textarea>
                  </div>
                </div>
                <div class="form-row">
                  <div class="form-group">
                    <label class="form-label">Médicaments prescrits</label>
                    <textarea v-model="newVisitForm.medication" rows="2" class="form-textarea" placeholder="Médicaments et posologie..."></textarea>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Notes supplémentaires</label>
                    <textarea v-model="newVisitForm.notes" rows="2" class="form-textarea" placeholder="Observations, recommandations..."></textarea>
                  </div>
                </div>
                <div class="form-actions">
                  <button type="button" @click="clearSelectedSeminarist" class="cancel-button">
                    Annuler
                  </button>
                  <button type="submit" class="save-button edit-button-green">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Enregistrer la Visite
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
  
      <!-- Modal Détails Visite -->
      <div v-if="showDetailModal" class="modal" @click.self="closeDetailModal">
        <div class="modal-content view-modal">
          <div class="modal-header">
            <h2>Détails de la Visite Santé</h2>
            <button @click="closeDetailModal" class="close-button">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          <div v-if="selectedVisit" class="modal-body">
            <div class="product-view">
              <div class="product-view-header">
                <div class="product-view-image">
                  <img v-if="getSeminaristPhoto(selectedVisit.seminaristId)" :src="getSeminaristPhoto(selectedVisit.seminaristId)" :alt="getSeminaristName(selectedVisit.seminaristId)">
                  <div v-else class="no-image-large">
                    <svg class="w-16 h-16 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>
                <div class="product-view-info">
                  <h3 class="product-view-name">{{ getSeminaristName(selectedVisit.seminaristId) }}</h3>
                  <div class="product-view-meta">
                    <div class="meta-item">
                      <span class="meta-label">Date de visite:</span>
                      <span class="meta-value">{{ formatDate(selectedVisit.date) }}</span>
                    </div>
                    <div class="meta-item">
                      <span class="meta-label">Heure:</span>
                      <span class="meta-value">{{ formatTime(selectedVisit.date) }}</span>
                    </div>
                    <div class="meta-item">
                      <span class="meta-label">Statut:</span>
                      <span class="meta-value">
                        <span class="status-badge status-in">Traité</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="product-view-content">
                <div class="view-tab-content">
                  <div class="content-section">
                    <h4 class="section-title">Diagnostic</h4>
                    <div class="diagnosis-detail">
                      <p>{{ selectedVisit.diagnosis }}</p>
                    </div>
                  </div>
                  <div class="content-section" v-if="selectedVisit.medication">
                    <h4 class="section-title">Médicaments Prescrits</h4>
                    <div class="medication-detail">
                      <p>{{ selectedVisit.medication }}</p>
                    </div>
                  </div>
                  <div class="content-section" v-if="selectedVisit.notes">
                    <h4 class="section-title">Notes et Observations</h4>
                    <div class="notes-detail">
                      <p>{{ selectedVisit.notes }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button @click="downloadVisitReport(selectedVisit)" class="save-button download-button-purple">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Télécharger Rapport</span>
            </button>
            <button @click="editVisit(selectedVisit); closeDetailModal()" class="save-button edit-button-green">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <span>Modifier</span>
            </button>
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
  
  // API Base URL for seminarists
  const API_BASE_URL_SEMINARISTES_LIST = 'https://sogetrag.com/api/seminaire_list_api.php';
  
  // Reactive states
  const seminarists = ref([]);
  const loading = ref(false);
  const selectedDate = ref(new Date().toISOString().split('T')[0]);
  const matriculeInput = ref('');
  const selectedSeminarist = ref(null);
  const selectedVisit = ref(null);
  const healthRecords = ref({});
  const mealRecords = ref({});
  const showDetailModal = ref(false);
  
  // Form for new health visit
  const newVisitForm = ref({
    diagnosis: '',
    medication: '',
    notes: ''
  });
  
  // Filters
  const filters = ref({
    period: '',
    diagnosis_type: ''
  });
  
  // Pagination
  const pagination = ref({
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0,
    from: 0,
    to: 0
  });
  
  // Toast notifications
  const alert = ref({
    show: false,
    type: 'success',
    message: ''
  });
  
  // Load data from localStorage and API on mount
  onMounted(async () => {
    const storedHealthRecords = localStorage.getItem('healthRecords');
    if (storedHealthRecords) {
      healthRecords.value = JSON.parse(storedHealthRecords);
    }
    const storedMealRecords = localStorage.getItem('mealRecords');
    if (storedMealRecords) {
      mealRecords.value = JSON.parse(storedMealRecords);
    }
    await loadSeminarists();
  
    const defaultSeminaristId = 'SEM2025002';
    const seminaristExists = seminarists.value.some(s => String(s.matricule_seminaire) === defaultSeminaristId);
  
    if (seminaristExists && (!healthRecords.value[defaultSeminaristId] || healthRecords.value[defaultSeminaristId].length === 0)) {
      if (!healthRecords.value[defaultSeminaristId]) {
        healthRecords.value[defaultSeminaristId] = [];
      }
      healthRecords.value[defaultSeminaristId].push({
        id: Date.now(),
        date: new Date().toISOString(),
        diagnosis: 'Grippe saisonnière, forte fièvre et courbatures.',
        medication: 'Paracétamol 500mg (3x/jour), Vitamine C (1x/jour)',
        notes: 'Recommandation de repos complet pendant 3 jours. Boire beaucoup de liquides.'
      });
      localStorage.setItem('healthRecords', JSON.stringify(healthRecords.value));
      showAlert('success', `Visite par défaut ajoutée pour le séminariste ${defaultSeminaristId}.`);
    }
  });
  
  // Save health records to localStorage whenever they change
  watch(healthRecords, (newRecords) => {
    localStorage.setItem('healthRecords', JSON.stringify(newRecords));
  }, { deep: true });
  
  // Computed properties
  const currentDateFormatted = computed(() => {
    const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(selectedDate.value).toLocaleDateString('fr-FR', options);
  });
  
  const totalHealthVisits = computed(() => {
    let count = 0;
    for (const seminaristId in healthRecords.value) {
      count += healthRecords.value[seminaristId].length;
    }
    return count;
  });
  
  const uniqueSeminaristsVisited = computed(() => {
    return Object.keys(healthRecords.value).length;
  });
  
  const recentHealthVisits = computed(() => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recent = [];
    for (const seminaristId in healthRecords.value) {
      healthRecords.value[seminaristId].forEach(visit => {
        if (new Date(visit.date) >= thirtyDaysAgo) {
          recent.push({ ...visit, seminaristId });
        }
      });
    }
    recent.sort((a, b) => new Date(b.date) - new Date(a.date));
    return recent;
  });
  
  const todayVisits = computed(() => {
    const today = new Date().toDateString();
    let count = 0;
    for (const seminaristId in healthRecords.value) {
      healthRecords.value[seminaristId].forEach(visit => {
        if (new Date(visit.date).toDateString() === today) {
          count++;
        }
      });
    }
    return count;
  });
  
  const displayedVisits = computed(() => {
    let visits = [];
    for (const seminaristId in healthRecords.value) {
      healthRecords.value[seminaristId].forEach(visit => {
        visits.push({ ...visit, seminaristId });
      });
    }
    
    // Apply filters
    if (filters.value.period) {
      const now = new Date();
      let filterDate = new Date();
      
      switch (filters.value.period) {
        case 'today':
          filterDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          filterDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          filterDate.setMonth(now.getMonth() - 1);
          break;
      }
      
      visits = visits.filter(visit => new Date(visit.date) >= filterDate);
    }
    
    if (filters.value.diagnosis_type) {
      visits = visits.filter(visit => 
        visit.diagnosis.toLowerCase().includes(filters.value.diagnosis_type.toLowerCase())
      );
    }
    
    // Sort by date (most recent first)
    visits.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Apply pagination
    const start = (pagination.value.current_page - 1) * pagination.value.per_page;
    const end = start + pagination.value.per_page;
    
    // Update pagination info
    pagination.value.total = visits.length;
    pagination.value.last_page = Math.ceil(visits.length / pagination.value.per_page) || 1;
    pagination.value.from = start + 1;
    pagination.value.to = Math.min(end, visits.length);
    
    return visits.slice(start, end);
  });
  
  // Methods
  const loadSeminarists = async () => {
    loading.value = true;
    try {
      const url = `${API_BASE_URL_SEMINARISTES_LIST}?action=list_seminairistes&page=1&per_page=1000&rand=${Math.random()}`;
      const response = await fetch(url);
      const data = await response.json();
  
      if (data.success && data.data) {
        seminarists.value = data.data.map(s => ({
          id: s.id_seminaire,
          name: `${s.prenom} ${s.nom}`,
          dortoir: s.dortoir,
          photo: `/placeholder.svg?height=80&width=80`,
          matricule_seminaire: s.matricule_seminaire,
        }));
        showAlert('success', `Liste des séminaristes chargée (${seminarists.value.length} trouvés).`);
      } else {
        console.error('Failed to load seminarists:', data.error || 'Unknown error');
        showAlert('error', 'Erreur lors du chargement des séminaristes.');
        seminarists.value = [];
      }
    } catch (error) {
      console.error('Error loading seminarists:', error);
      showAlert('error', 'Erreur réseau lors du chargement des séminaristes.');
      seminarists.value = [];
    } finally {
      loading.value = false;
    }
  };
  
  const handleLookup = () => {
    const id = matriculeInput.value.trim();
    if (!id) {
      showAlert('info', 'Veuillez entrer un matricule.');
      return;
    }
  
    const seminarist = seminarists.value.find(s => String(s.matricule_seminaire) === String(id));
  
    if (!seminarist) {
      showAlert('error', `Séminariste avec l'ID "${id}" non trouvé.`);
      return;
    }
  
    selectedSeminarist.value = seminarist;
    showAlert('success', `Séminariste ${seminarist.name} sélectionné pour nouvelle visite.`);
  };
  
  const addHealthVisit = () => {
    if (!selectedSeminarist.value) {
      showAlert('error', 'Veuillez sélectionner un séminariste d\'abord.');
      return;
    }
    if (!newVisitForm.value.diagnosis.trim()) {
      showAlert('error', 'Le diagnostic est obligatoire.');
      return;
    }
  
    const seminaristId = selectedSeminarist.value.id;
    if (!healthRecords.value[seminaristId]) {
      healthRecords.value[seminaristId] = [];
    }
  
    const newVisit = {
      id: Date.now(),
      date: new Date().toISOString(),
      diagnosis: newVisitForm.value.diagnosis.trim(),
      medication: newVisitForm.value.medication.trim() || null,
      notes: newVisitForm.value.notes.trim() || null
    };
  
    healthRecords.value[seminaristId].unshift(newVisit);
    showAlert('success', `Nouvelle visite santé enregistrée pour ${selectedSeminarist.value.name}.`);
  
    // Reset form
    newVisitForm.value = {
      diagnosis: '',
      medication: '',
      notes: ''
    };
    selectedSeminarist.value = null;
  };
  
  const getSeminaristName = (id) => {
    const seminarist = seminarists.value.find(s => String(s.id) === String(id));
    return seminarist ? seminarist.name : `Séminariste ${id}`;
  };
  
  const getSeminaristPhoto = (id) => {
    const seminarist = seminarists.value.find(s => String(s.id) === String(id));
    return seminarist ? seminarist.photo : null;
  };
  
  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };
  
  const formatTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const viewVisitDetails = (visit) => {
    selectedVisit.value = visit;
    showDetailModal.value = true;
    document.body.style.overflow = 'hidden';
  };
  
  const closeDetailModal = () => {
    showDetailModal.value = false;
    selectedVisit.value = null;
    document.body.style.overflow = 'auto';
  };
  
  const editVisit = (visit) => {
    // Implementation for editing visit
    showAlert('info', 'Fonctionnalité de modification en cours de développement.');
  };
  
  const downloadVisitReport = async (visit) => {
    try {
      showAlert('info', 'Génération du rapport en cours...');
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF();
  
      // En-tête
      doc.setFontSize(20);
      doc.setTextColor(220, 38, 127);
      doc.text('RAPPORT DE VISITE SANTÉ', 105, 20, { align: 'center' });
  
      // Informations du séminariste
      doc.setFontSize(14);
      doc.setTextColor(40, 40, 40);
      doc.text('INFORMATIONS PATIENT', 20, 40);
      
      let yPos = 50;
      doc.setFontSize(10);
      doc.text(`Nom: ${getSeminaristName(visit.seminaristId)}`, 20, yPos);
      yPos += 8;
      doc.text(`Date de visite: ${formatDate(visit.date)}`, 20, yPos);
      yPos += 8;
      doc.text(`Heure: ${formatTime(visit.date)}`, 20, yPos);
      
      // Diagnostic
      yPos += 20;
      doc.setFontSize(14);
      doc.text('DIAGNOSTIC', 20, yPos);
      yPos += 10;
      doc.setFontSize(10);
      const diagnosisLines = doc.splitTextToSize(visit.diagnosis, 170);
      doc.text(diagnosisLines, 20, yPos);
      yPos += diagnosisLines.length * 6;
  
      // Médicaments
      if (visit.medication) {
        yPos += 10;
        doc.setFontSize(14);
        doc.text('MÉDICAMENTS PRESCRITS', 20, yPos);
        yPos += 10;
        doc.setFontSize(10);
        const medicationLines = doc.splitTextToSize(visit.medication, 170);
        doc.text(medicationLines, 20, yPos);
        yPos += medicationLines.length * 6;
      }
  
      // Notes
      if (visit.notes) {
        yPos += 10;
        doc.setFontSize(14);
        doc.text('NOTES ET OBSERVATIONS', 20, yPos);
        yPos += 10;
        doc.setFontSize(10);
        const notesLines = doc.splitTextToSize(visit.notes, 170);
        doc.text(notesLines, 20, yPos);
      }
  
      const filename = `rapport_visite_${getSeminaristName(visit.seminaristId).replace(/\s+/g, '_')}_${formatDate(visit.date).replace(/\//g, '-')}.pdf`;
      doc.save(filename);
      showAlert('success', 'Rapport téléchargé avec succès !');
    } catch (error) {
      console.error('Erreur lors de la génération du rapport:', error);
      showAlert('error', 'Erreur lors de la génération du rapport');
    }
  };
  
  const exportHealthReport = async () => {
    try {
      showAlert('info', 'Génération du rapport Excel en cours...');
      const visits = displayedVisits.value;
      
      if (visits.length === 0) {
        showAlert('error', 'Aucune donnée à exporter.');
        return;
      }
  
      const data = visits.map(visit => ({
        'Séminariste': getSeminaristName(visit.seminaristId),
        'Date': formatDate(visit.date),
        'Heure': formatTime(visit.date),
        'Diagnostic': visit.diagnosis,
        'Médicaments': visit.medication || 'Aucun',
        'Notes': visit.notes || 'Aucune'
      }));
  
      const XLSX = await import('xlsx');
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(data);
      
      const colWidths = [
        { wch: 25 }, { wch: 12 }, { wch: 8 }, { wch: 40 }, { wch: 30 }, { wch: 30 }
      ];
      worksheet['!cols'] = colWidths;
      
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Visites Santé');
      
      const today = new Date().toISOString().split('T')[0];
      const filename = `rapport_sante_senafoi25_${today}.xlsx`;
      XLSX.writeFile(workbook, filename);
      
      showAlert('success', `Export Excel réussi ! ${data.length} visites exportées.`);
    } catch (error) {
      console.error('Erreur lors de l\'export Excel:', error);
      showAlert('error', 'Erreur lors de l\'export Excel.');
    }
  };
  
  const exportHealthPDF = async () => {
    try {
      showAlert('info', 'Génération du rapport PDF en cours...');
      const visits = displayedVisits.value;
      
      if (visits.length === 0) {
        showAlert('error', 'Aucune donnée à exporter.');
        return;
      }
  
      const { jsPDF } = await import('jspdf');
      const autoTable = (await import('jspdf-autotable')).default;
      const doc = new jsPDF('landscape');
  
      // En-tête
      doc.setFontSize(20);
      doc.setTextColor(40, 40, 40);
      doc.text('RAPPORT COMMISSION SANTÉ SENAFOI 25', 148, 20, { align: 'center' });
  
      // Date du rapport
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      const today = new Date().toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
      doc.text(`Généré le ${today}`, 148, 30, { align: 'center' });
  
      // Tableau des données
      const tableData = visits.map(visit => [
        getSeminaristName(visit.seminaristId),
        formatDate(visit.date),
        formatTime(visit.date),
        visit.diagnosis,
        visit.medication || 'Aucun',
        visit.notes || 'Aucune'
      ]);
  
      autoTable(doc, {
        head: [['Séminariste', 'Date', 'Heure', 'Diagnostic', 'Médicaments', 'Notes']],
        body: tableData,
        startY: 40,
        styles: {
          fontSize: 8,
          cellPadding: 2
        },
        headStyles: {
          fillColor: [220, 38, 127],
          textColor: 255,
          fontStyle: 'bold'
        },
        alternateRowStyles: {
          fillColor: [248, 249, 250]
        }
      });
  
      const filename = `rapport_commission_sante_senafoi25_${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(filename);
      showAlert('success', `Export PDF réussi ! ${visits.length} visites exportées.`);
    } catch (error) {
      console.error('Erreur lors de l\'export PDF:', error);
      showAlert('error', 'Erreur lors de l\'export PDF.');
    }
  };
  
  const clearSelectedSeminarist = () => {
    selectedSeminarist.value = null;
    newVisitForm.value = {
      diagnosis: '',
      medication: '',
      notes: ''
    };
  };
  
  const applyFilters = () => {
    pagination.value.current_page = 1;
  };
  
  const resetFilters = () => {
    filters.value = {
      period: '',
      diagnosis_type: ''
    };
    matriculeInput.value = '';
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
  
  .stat-icon-red {
    background-color: #fee2e2;
    color: #ef4444;
  }
  
  .stat-icon-green {
    background-color: #d1fae5;
    color: #10b981;
  }
  
  .stat-icon-blue {
    background-color: #dbeafe;
    color: #3b82f6;
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
  
  /* Quick Search Section */
  .quick-search-section {
    padding: 1.5rem 2rem;
    border-bottom: 1px solid #f1f1f4;
  }
  
  .quick-search-card {
    background-color: #f8fafc;
    border-radius: 0.5rem;
    padding: 1.5rem;
    border: 1px solid #e2e8f0;
  }
  
  .card-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 1rem;
  }
  
  .card-header h3 {
    font-size: 1.125rem;
    font-weight: 600;
    color: #1e293b;
    margin: 0;
  }
  
  .search-form {
    display: flex;
    gap: 0.75rem;
    align-items: center;
  }
  
  .search-input {
    flex: 1;
    padding: 0.75rem 1rem;
    border: 1px solid #e2e8f0;
    border-radius: 0.5rem;
    font-size: 1rem;
    color: #1e293b;
  }
  
  .search-input:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
  
  .search-button {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background-color: #3b82f6;
    color: white;
    border: none;
    border-radius: 0.5rem;
    padding: 0.75rem 1.5rem;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  
  .search-button:hover {
    background-color: #2563eb;
  }
  
  /* Products Table */
  .products-table {
    padding: 0 2rem;
    border-bottom: 1px solid #f1f1f4;
  }
  
  .table-header {
    display: flex;
    padding: 0.75rem 0;
    background-color: #f9fafb;
    border-bottom: 1px solid #f1f1f4;
    font-size: 0.75rem;
    font-weight: 600;
    color: #6b7280;
    text-transform: uppercase;
  }
  
  .table-row {
    display: flex;
    padding: 0.75rem 0;
    border-bottom: 1px solid #f1f1f4;
    font-size: 0.875rem;
    color: #111827;
    align-items: center;
  }
  
  .table-row:hover {
    background-color: #f9fafb;
  }
  
  .table-cell {
    flex: 1;
    padding: 0 0.5rem;
    display: flex;
    align-items: center;
  }
  
  .name-cell {
    flex: 2;
  }
  
  .actions-cell {
    flex: 0 0 120px;
    justify-content: flex-end;
    gap: 0.5rem;
  }
  
  .product-image {
    width: 48px;
    height: 48px;
    border-radius: 0.375rem;
    overflow: hidden;
    background-color: #f3f4f6;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 0.75rem;
  }
  
  .product-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .no-image {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #9ca3af;
  }
  
  .product-info {
    display: flex;
    flex-direction: column;
  }
  
  .product-name {
    font-weight: 600;
    color: #111827;
  }
  
  .product-reference {
    font-size: 0.75rem;
    color: #6b7280;
  }
  
  .diagnosis-cell {
    max-width: 300px;
  }
  
  .diagnosis-text {
    font-size: 0.875rem;
    color: #374151;
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  
  .medication-text {
    font-size: 0.875rem;
    color: #059669;
    font-weight: 500;
  }
  
  .status-badge {
    padding: 0.25rem 0.5rem;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 500;
    display: inline-flex;
    align-items: center;
  }
  
  .status-in {
    background-color: #d1fae5;
    color: #10b981;
  }
  
  .status-out {
    background-color: #fee2e2;
    color: #ef4444;
  }
  
  .status-blue {
    background-color: #dbeafe;
    color: #3b82f6;
  }
  
  .action-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    background: none;
    border: none;
    color: #6b7280;
    cursor: pointer;
    width: 32px;
    height: 32px;
    border-radius: 0.25rem;
    transition: all 0.2s;
  }
  
  .view-button {
    background-color: rgba(124, 58, 237, 0.1) !important;
    color: #7c3aed !important;
  }
  
  .view-button:hover {
    background-color: rgba(124, 58, 237, 0.2) !important;
    transform: translateY(-2px);
    box-shadow: 0 3px 10px rgba(124, 58, 237, 0.2);
  }
  
  .edit-button-green {
    background-color: rgba(16, 185, 129, 0.1) !important;
    color: #10b981 !important;
  }
  
  .edit-button-green:hover {
    background-color: rgba(16, 185, 129, 0.2) !important;
    transform: translateY(-2px);
    box-shadow: 0 3px 10px rgba(16, 185, 129, 0.2);
  }
  
  .download-button-purple {
    background-color: rgba(124, 58, 237, 0.1) !important;
    color: #7c3aed !important;
  }
  
  .download-button-purple:hover {
    background-color: rgba(124, 58, 237, 0.2) !important;
    transform: translateY(-2px);
    box-shadow: 0 3px 10px rgba(124, 58, 237, 0.2);
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
  
  .no-products {
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
  
  /* Add Visit Section */
  .add-visit-section {
    padding: 1.5rem 2rem;
    border-bottom: 1px solid #f1f1f4;
  }
  
  .add-visit-card {
    background-color: #f0fdf4;
    border-radius: 0.5rem;
    padding: 1.5rem;
    border: 1px solid #bbf7d0;
  }
  
  .visit-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  .form-row {
    display: flex;
    gap: 1rem;
  }
  
  .form-group {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .form-label {
    font-size: 0.875rem;
    font-weight: 500;
    color: #374151;
  }
  
  .form-textarea {
    padding: 0.75rem 1rem;
    border: 1px solid #e2e8f0;
    border-radius: 0.5rem;
    font-size: 0.875rem;
    color: #1e293b;
    resize: vertical;
  }
  
  .form-textarea:focus {
    outline: none;
    border-color: #10b981;
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
  }
  
  .form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.75rem;
    margin-top: 1rem;
  }
  
  .cancel-button {
    padding: 0.5rem 1rem;
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
  
  .save-button {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: white;
    border: none;
    border-radius: 0.375rem;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .save-button.edit-button-green {
    background-color: #10b981;
  }
  
  .save-button.edit-button-green:hover {
    background-color: #059669;
  }
  
  .save-button.download-button-purple {
    background-color: #7c3aed;
  }
  
  .save-button.download-button-purple:hover {
    background-color: #6d28d9;
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
  
  .view-modal {
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
  
  .product-view-header {
    display: flex;
    gap: 2rem;
    margin-bottom: 2rem;
  }
  
  .product-view-image {
    width: 200px;
    height: 200px;
    border-radius: 0.5rem;
    overflow: hidden;
    background-color: #f9fafb;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #e5e7eb;
  }
  
  .product-view-image img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
  
  .no-image-large {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #9ca3af;
  }
  
  .product-view-info {
    flex: 1;
  }
  
  .product-view-name {
    font-size: 1.5rem;
    font-weight: 700;
    color: #111827;
    margin: 0 0 1rem;
  }
  
  .product-view-meta {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1rem;
  }
  
  .meta-item {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }
  
  .meta-label {
    font-size: 0.75rem;
    color: #6b7280;
    font-weight: 500;
  }
  
  .meta-value {
    font-size: 0.875rem;
    color: #111827;
    font-weight: 500;
  }
  
  .content-section {
    margin-bottom: 2rem;
  }
  
  .section-title {
    font-size: 1.125rem;
    font-weight: 600;
    color: #111827;
    margin-bottom: 1rem;
  }
  
  .diagnosis-detail,
  .medication-detail,
  .notes-detail {
    background-color: #f8fafc;
    border-radius: 0.5rem;
    padding: 1rem;
    border: 1px solid #e2e8f0;
  }
  
  .diagnosis-detail p,
  .medication-detail p,
  .notes-detail p {
    margin: 0;
    color: #374151;
    line-height: 1.6;
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
  .mobile-only {
    display: none;
  }
  
  @media (max-width: 768px) {
    .desktop-only {
      display: none !important;
    }
    
    .mobile-only {
      display: block !important;
    }
    
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
    
    .products-table {
      padding: 0 1rem;
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
    
    .quick-search-section {
      padding: 1rem;
    }
    
    .search-form {
      flex-direction: column;
    }
    
    .add-visit-section {
      padding: 1rem;
    }
    
    .form-row {
      flex-direction: column;
    }
    
    .modal-content {
      margin: 0.5rem;
      max-width: calc(100vw - 1rem);
    }
    
    .product-view-header {
      flex-direction: column;
      gap: 1.5rem;
    }
    
    .product-view-image {
      width: 100%;
      height: 250px;
    }
    
    /* Mobile Product Card Styles */
    .product-cards-mobile {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      padding: 1rem 0;
    }
    
    .product-card-mobile {
      background-color: white;
      border: 1px solid #e5e7eb;
      border-radius: 0.5rem;
      padding: 1rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    
    .product-card-mobile .card-header {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      border-bottom: 1px solid #f1f1f4;
      padding-bottom: 0.75rem;
      margin-bottom: 0.75rem;
    }
    
    .product-card-mobile .product-image {
      width: 60px;
      height: 60px;
      border-radius: 0.375rem;
      overflow: hidden;
      background-color: #f3f4f6;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    
    .product-card-mobile .product-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .product-card-mobile .product-info {
      flex: 1;
      display: flex;
      flex-direction: column;
    }
    
    .product-card-mobile .product-name {
      font-weight: 600;
      color: #111827;
      font-size: 1rem;
    }
    
    .product-card-mobile .product-reference {
      font-size: 0.875rem;
      color: #6b7280;
    }
    
    .product-card-mobile .card-body {
      display: grid;
      grid-template-columns: 1fr;
      gap: 0.5rem;
      margin-bottom: 0.75rem;
    }
    
    .product-card-mobile .card-detail {
      display: flex;
      flex-direction: column;
    }
    
    .product-card-mobile .detail-label {
      font-size: 0.75rem;
      color: #6b7280;
    }
    
    .product-card-mobile .detail-value {
      font-size: 0.875rem;
      color: #111827;
      font-weight: 500;
    }
    
    .product-card-mobile .card-actions {
      display: flex;
      justify-content: flex-end;
      gap: 0.5rem;
      border-top: 1px solid #f1f1f4;
      padding-top: 0.75rem;
    }
  }
  </style>
  