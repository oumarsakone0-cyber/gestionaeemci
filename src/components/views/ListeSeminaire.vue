<template>
  <div class="dashboard">
    <!-- Animations de fond - Supprimées pour correspondre au design de la Page 2 -->

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
                <svg class="w-6 h-6 lg:w-8 lg:h-8 text-green-600 mr-3" fill="none" stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h4a1 1 0 011 1v5m-6 0V9a1 1 0 011-1h4a1 1 0 011 1v11" />
                </svg>
                Séminairistes SENAFOI 25
              </h1>
              <p class="overview-date">Gestion des inscriptions au séminaire</p>
            </div>
          </div>

          <div class="header-actions-right">
            <button @click="exportExcel()" class="export-button green-button">
              <svg class="w-4 h-4 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Excel</span>
            </button>
            <button @click="exportPDF()" class="export-button red-button">
              <svg class="w-4 h-4 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <span>PDF</span>
            </button>
          </div>
        </div>

        <!-- Statistiques -->
        <div class="product-stats">
          <div class="stat-card">
            <div class="stat-icon stat-icon-green" @click="envoyer">
              <svg class="w-5 h-5 lg:w-6 lg:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ pagination.total || 0 }}</div>
              <div class="stat-label">Total Inscrits</div>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon stat-icon-emerald">
              <svg class="w-5 h-5 lg:w-6 lg:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ formatXOF(stats.total_paid) || 0 }}</div>
              <div class="stat-label">Paiements Validés</div>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon stat-icon-teal">
              <svg class="w-5 h-5 lg:w-6 lg:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h4a1 1 0 011 1v5m-6 0V9a1 1 0 011-1h4a1 1 0 011 1v11" />
              </svg>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.assigned_dortoirs || 0 }}</div>
              <div class="stat-label">Dortoirs Assignés</div>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon stat-icon-blue">
              <svg class="w-5 h-5 lg:w-6 lg:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2v0a2 2 0 01-2 2H8a2 2 0 01-2-2v0a2 2 0 01-2-2V9a2 2 0 012-2h2z" />
              </svg>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.assigned_cars || 0 }}</div>
              <div class="stat-label">Cars Assignés</div>
            </div>
          </div>
        </div>

        <!-- Filtres avancés -->
        <div class="search-filters">
          <div class="search-bar">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
              class="lucide lucide-search">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input v-model="filters.search" @input="debounceSearch" type="text" placeholder="Nom, prénom, matricule...">
          </div>

          <div class="filter-options">
            <select v-model="filters.niveau_seminaire" @change="applyFilters">
              <option value="">Tous les niveaux</option>
              <option value="1AS">1AS</option>
              <option value="2AS">2AS</option>
              <option value="3AS">3AS</option>
              <option value="1AF">1AF</option>
              <option value="2AF">2AF</option>
              <option value="3AF">3AF</option>
              <option value="1BS">1BS</option>
              <option value="2BS">2BS</option>
              <option value="3BS">3BS</option>
              <option value="1BF">1BF</option>
              <option value="2BF">2BF</option>
              <option value="3BF">3BF</option>
              <option value="4">4</option>
              <option value="TEST_ENTREE">Test d'entrée</option>
            </select>

            <select v-model="filters.statut_paiement" @change="applyFilters">
              <option value="">Tous</option>
              <option value="PAYE">Payé</option>
              <option value="EN_ATTENTE">En attente</option>
              <option value="ECHEC">Échec</option>
            </select>

            <select v-model="filters.statut_inscription" @change="applyFilters">
              <option value="">Tous</option>
              <option value="VALIDEE">Validée</option>
              <option value="EN_COURS">En cours</option>
              <option value="REJETEE">Rejetée</option>
              <option value="ANNULEE">Annulée</option>
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
              <option value="100">100</option>
            </select>
          </div>
          <button @click="resetFilters" class="action-button-outlined">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Réinitialiser</span>
          </button>
        </div>

        <!-- Tableau des séminairistes -->
        <div class="products-table">
          <!-- Desktop Table View -->
          <div class="desktop-only">
            <div class="table-header">
              <div class="table-cell name-cell">
                <div class="flex items-center space-x-2">
                  <svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>Séminairiste</span>
                </div>
              </div>
              <div class="table-cell">Matricule</div>
              <div class="table-cell">Niveau</div>
              <div class="table-cell">Secrétariat</div>
              <div class="table-cell">Contact</div>
              <div class="table-cell">Dortoir</div>
              <div class="table-cell">Paiement</div>
              <div class="table-cell actions-cell">Actions</div>
            </div>

            <div v-if="loading" class="loading-indicator">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                class="lucide lucide-loader-2">
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
              Chargement...
            </div>

            <div v-else-if="seminairistes.length === 0" class="no-products">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                class="lucide lucide-package-search">
                <path
                  d="M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14" />
                <path d="m7.5 4.27 9 5.15" />
                <polyline points="3.29 7 12 12 20.71 7" />
                <line x1="12" x2="12" y1="22" y2="12" />
                <circle cx="18.5" cy="15.5" r="2.5" />
                <path d="M20.27 17.27 22 19" />
              </svg>
              <p>Aucun séminairiste trouvé</p>
            </div>

            <template v-else>
              <div v-for="seminairiste in seminairistes" :key="seminairiste.id_seminaire" class="table-row">
                <div class="table-cell name-cell">
                  <div class="flex items-center">
                    <div class="product-image">
                      <img v-if="seminairiste.photo" :src="seminairiste.photo"
                        :alt="`Photo de ${seminairiste.prenom} ${seminairiste.nom}`"
                        @click="openImageModal(seminairiste.photo)">
                      <div v-else class="no-image">
                        <svg class="w-4 h-4 lg:w-5 lg:h-5 text-green-600" fill="none" stroke="currentColor"
                          viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                    </div>
                    <div class="product-info">
                      <div class="product-name">{{ seminairiste.prenom }} {{ seminairiste.nom }}</div>
                      <div class="product-reference mobile-only">{{ seminairiste.contact }}</div>
                    </div>
                  </div>
                </div>

                <div class="table-cell">
                  <span class="status-badge status-in">{{ seminairiste.matricule_seminaire }}</span>
                </div>

                <div class="table-cell">
                  <span class="status-badge" :class="getNiveauBadgeClass(seminairiste.niveau_seminaire)">
                    {{ seminairiste.niveau_seminaire }}
                  </span>
                </div>

                <div class="table-cell">
                  {{ seminairiste.secretariat_regional }}
                </div>

                <div class="table-cell">
                  {{ seminairiste.contact }}
                </div>

                <div class="table-cell">
                  <div class="space-y-1">
                    <div v-if="seminairiste.dortoir">
                      <span v-if="seminairiste.sexe == 'M'" class="status-badge status-blue">
                        {{ getDortoirLabel(seminairiste.dortoir) }}
                      </span>
                      <span v-if="seminairiste.sexe == 'F'" class="status-badge status-purple">
                        {{ getDortoirLabel(seminairiste.dortoir) }}
                      </span>
                    </div>
                    <div v-else>
                      <span class="status-badge status-out">
                        Non assigné
                      </span>
                    </div>
                    <div v-if="seminairiste.car_transport" class="text-xs text-gray-500">
                      Car: {{ getCarLabel(seminairiste.car_transport) }}
                    </div>
                  </div>
                </div>

                <div class="table-cell">
                  <div class="space-y-1">
                    <span v-if="seminairiste.statut_paiement === 'PAYE'" class="status-badge status-in">
                      <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Payé
                    </span>
                    <span v-else-if="seminairiste.statut_paiement === 'EN_ATTENTE'" class="status-badge status-low">
                      <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      En attente
                    </span>
                    <span v-else class="status-badge status-out">
                      <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Échec
                    </span>
                    <div v-if="seminairiste.ref_paiement" class="text-xs text-gray-800 font-mono">
                      {{ seminairiste.somme_paye }}
                    </div>
                    <div v-if="seminairiste.ref_paiement" class="text-xs text-gray-500 font-mono">
                      {{ seminairiste.ref_paiement }}
                    </div>
                  </div>
                </div>

                <div class="table-cell actions-cell">
                  <button @click="viewSeminairiste(seminairiste)" style="padding: 2px" class="action-icon view-button" title="Voir détails">
                    <svg class="w-3 h-3 lg:w-4 lg:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>

                  <button @click="editSeminairiste(seminairiste)" style="padding: 2px" class="action-icon edit-button-green" title="Modifier">
                    <svg class="w-3 h-3 lg:w-4 lg:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>

                  <button @click="downloadFicheSeminairiste(seminairiste)" style="padding: 2px" class="action-icon download-button-purple"
                    title="Télécharger fiche">
                    <svg class="w-3 h-3 lg:w-4 lg:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </button>

                  <button @click="assignDortoir(seminairiste)" style="padding: 2px" class="action-icon assign-button-orange"
                    title="Assigner dortoir">
                    <svg class="w-3 h-3 lg:w-4 lg:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h4a1 1 0 011 1v5m-6 0V9a1 1 0 011-1h4a1 1 0 011 1v11" />
                    </svg>
                  </button>
                </div>
              </div>
            </template>
          </div>

          <!-- Mobile Card View -->
          <div class="mobile-only">
            <div v-if="loading" class="loading-indicator">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                class="lucide lucide-loader-2">
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
              Chargement...
            </div>

            <div v-else-if="seminairistes.length === 0" class="no-products">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                class="lucide lucide-package-search">
                <path
                  d="M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14" />
                <path d="m7.5 4.27 9 5.15" />
                <polyline points="3.29 7 12 12 20.71 7" />
                <line x1="12" x2="12" y1="22" y2="12" />
                <circle cx="18.5" cy="15.5" r="2.5" />
                <path d="M20.27 17.27 22 19" />
              </svg>
              <p>Aucun séminairiste trouvé</p>
            </div>

            <template v-else>
              <div class="product-cards-mobile">
                <div v-for="seminairiste in seminairistes" :key="seminairiste.id_seminaire" class="product-card-mobile">
                  <div class="card-header">
                    <div class="product-image">
                      <img v-if="seminairiste.photo" :src="seminairiste.photo"
                        :alt="`Photo de ${seminairiste.prenom} ${seminairiste.nom}`"
                        @click="openImageModal(seminairiste.photo)">
                      <div v-else class="no-image">
                        <svg class="w-4 h-4 lg:w-5 lg:h-5 text-green-600" fill="none" stroke="currentColor"
                          viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                    </div>
                    <div class="product-info">
                      <div class="product-name">{{ seminairiste.prenom }} {{ seminairiste.nom }}</div>
                      <div class="product-reference">{{ seminairiste.matricule_seminaire }}</div>
                    </div>
                  </div>
                  <div class="card-body">
                    <div class="card-detail">
                      <span class="detail-label">Niveau:</span>
                      <span class="detail-value">
                        <span class="status-badge" :class="getNiveauBadgeClass(seminairiste.niveau_seminaire)">
                          {{ seminairiste.niveau_seminaire }}
                        </span>
                      </span>
                    </div>
                    <div class="card-detail">
                      <span class="detail-label">Secrétariat:</span>
                      <span class="detail-value">{{ seminairiste.secretariat_regional }}</span>
                    </div>
                    <div class="card-detail">
                      <span class="detail-label">Contact:</span>
                      <span class="detail-value">{{ seminairiste.contact }}</span>
                    </div>
                    <div class="card-detail">
                      <span class="detail-label">Dortoir:</span>
                      <span class="detail-value">
                        <span v-if="seminairiste.dortoir"
                          :class="seminairiste.sexe == 'M' ? 'status-blue' : 'status-purple'" class="status-badge">
                          {{ getDortoirLabel(seminairiste.dortoir) }}
                        </span>
                        <span v-else class="status-badge status-out">Non assigné</span>
                      </span>
                    </div>
                    <div class="card-detail">
                      <span class="detail-label">Paiement:</span>
                      <span class="detail-value">
                        <span v-if="seminairiste.statut_paiement === 'PAYE'" class="status-badge status-in">
                          Payé
                        </span>
                        <span v-else-if="seminairiste.statut_paiement === 'EN_ATTENTE'" class="status-badge status-low">
                          En attente
                        </span>
                        <span v-else class="status-badge status-out">
                          Échec
                        </span>
                      </span>
                    </div>
                  </div>
                  <div class="card-actions">
                    <button @click="viewSeminairiste(seminairiste)" class="action-icon view-button" title="Voir détails">
                      <svg class="w-3 h-3 lg:w-4 lg:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>

                    <button @click="editSeminairiste(seminairiste)" class="action-icon edit-button-green"
                      title="Modifier">
                      <svg class="w-3 h-3 lg:w-4 lg:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>

                    <button @click="downloadFicheSeminairiste(seminairiste)" class="action-icon download-button-purple"
                      title="Télécharger fiche">
                      <svg class="w-3 h-3 lg:w-4 lg:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </button>

                    <button @click="assignDortoir(seminairiste)" class="action-icon assign-button-orange"
                      title="Assigner dortoir">
                      <svg class="w-3 h-3 lg:w-4 lg:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h4a1 1 0 011 1v5m-6 0V9a1 1 0 011-1h4a1 1 0 011 1v11" />
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
            Affichage de {{ pagination.from || 0 }} à {{ pagination.to || 0 }} sur {{ pagination.total || 0 }} inscrits
          </div>
          <div class="pagination-controls">
            <button @click="changePage(pagination.current_page - 1)" :disabled="pagination.current_page === 1"
              class="pagination-button">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                class="lucide lucide-chevron-left">
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>
            <span class="pagination-pages">Page {{ pagination.current_page }} sur {{ pagination.last_page }}</span>
            <button @click="changePage(pagination.current_page + 1)"
              :disabled="pagination.current_page === pagination.last_page" class="pagination-button">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                class="lucide lucide-chevron-right">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </main>

    <!-- Modal Agrandissement Image -->
    <div v-if="showImageModal" class="modal" @click="closeImageModal">
      <div class="modal-content view-modal">
        <div class="modal-header">
          <h2>Photo agrandie</h2>
          <button @click="closeImageModal" class="close-button">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        <div class="modal-body">
          <div class="product-view-image">
            <img :src="selectedImage" alt="Photo agrandie" class="max-w-full max-h-full object-contain rounded-lg shadow-2xl">
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Détails Séminairiste -->
    <div v-if="showDetailModal" class="modal" @click.self="closeDetailModal">
      <div class="modal-content view-modal">
        <div class="modal-header">
          <h2>Détails du Séminairiste</h2>
          <button @click="closeDetailModal" class="close-button">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <div v-if="selectedSeminairiste" class="modal-body">
          <div class="product-view">
            <div class="product-view-header">
              <div class="product-view-image">
                <img v-if="selectedSeminairiste.photo" :src="selectedSeminairiste.photo"
                  :alt="`Photo de ${selectedSeminairiste.prenom} ${selectedSeminairiste.nom}`">
                <div v-else class="no-image-large">
                  <svg class="w-16 h-16 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
              <div class="product-view-info">
                <h3 class="product-view-name">{{ selectedSeminairiste.prenom }} {{ selectedSeminairiste.nom }}</h3>
                <div class="product-view-meta">
                  <div class="meta-item">
                    <span class="meta-label">Matricule:</span>
                    <span class="meta-value">{{ selectedSeminairiste.matricule_seminaire }}</span>
                  </div>
                  <div class="meta-item">
                    <span class="meta-label">Inscription:</span>
                    <span class="meta-value">
                      <span :class="[
                        'status-badge',
                        selectedSeminairiste.statut_inscription === 'VALIDEE' ? 'status-in' :
                          selectedSeminairiste.statut_inscription === 'EN_COURS' ? 'status-low' :
                            'status-out'
                      ]">
                        {{ getInscriptionStatusLabel(selectedSeminairiste.statut_inscription) }}
                      </span>
                    </span>
                  </div>
                  <div class="meta-item">
                    <span class="meta-label">Paiement:</span>
                    <span class="meta-value">
                      <span :class="[
                        'status-badge',
                        selectedSeminairiste.statut_paiement === 'PAYE' ? 'status-in' :
                          selectedSeminairiste.statut_paiement === 'EN_ATTENTE' ? 'status-low' :
                            'status-out'
                      ]">
                        {{ getPaymentStatusLabel(selectedSeminairiste.statut_paiement) }}
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div class="product-view-tabs">
              <button class="view-tab" :class="{ active: activeViewTab === 'description' }"
                @click="activeViewTab = 'description'">
                Informations
              </button>
              <button class="view-tab" :class="{ active: activeViewTab === 'details' }"
                @click="activeViewTab = 'details'">
                Logistique & Paiement
              </button>
            </div>

            <div class="product-view-content">
              <!-- Onglet Informations -->
              <div v-if="activeViewTab === 'description'" class="view-tab-content">
                <div class="content-section">
                  <h4 class="section-title">Informations Personnelles</h4>
                  <div class="details-grid">
                    <div class="detail-item">
                      <span class="detail-label">Sexe</span>
                      <span class="detail-value">{{ selectedSeminairiste.sexe === 'M' ? 'Masculin' : 'Féminin' }}</span>
                    </div>
                    <div class="detail-item">
                      <span class="detail-label">Contact</span>
                      <span class="detail-value">{{ selectedSeminairiste.contact || 'Non renseigné' }}</span>
                    </div>
                    <div class="detail-item">
                      <span class="detail-label">Contact Parent</span>
                      <span class="detail-value">{{ selectedSeminairiste.contact_parent || 'Non renseigné' }}</span>
                    </div>
                    <div class="detail-item">
                      <span class="detail-label">Niveau d'Étude</span>
                      <span class="detail-value">{{ selectedSeminairiste.niveau_etude || 'Non renseigné' }}</span>
                    </div>
                  </div>
                </div>
                <div class="content-section">
                  <h4 class="section-title">Informations Séminaire</h4>
                  <div class="details-grid">
                    <div class="detail-item">
                      <span class="detail-label">Niveau Séminaire</span>
                      <span class="detail-value">{{ selectedSeminairiste.niveau_seminaire }}</span>
                    </div>
                    <div class="detail-item">
                      <span class="detail-label">Secrétariat Régional</span>
                      <span class="detail-value">{{ selectedSeminairiste.secretariat_regional || 'Non renseigné' }}</span>
                    </div>
                    <div class="detail-item">
                      <span class="detail-label">Sous-comité</span>
                      <span class="detail-value">{{ selectedSeminairiste.sous_comite || 'Non renseigné' }}</span>
                    </div>
                    <div class="detail-item">
                      <span class="detail-label">Qualité</span>
                      <span class="detail-value">{{ selectedSeminairiste.qualite || 'Non renseigné' }}</span>
                    </div>
                    <div class="detail-item">
                      <span class="detail-label">Taille T-shirt</span>
                      <span class="detail-value">{{ selectedSeminairiste.taille_tshirt || 'Non renseigné' }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Onglet Logistique & Paiement -->
              <div v-if="activeViewTab === 'details'" class="view-tab-content">
                <div class="content-section">
                  <h4 class="section-title">Logistique</h4>
                  <div class="details-grid">
                    <div class="detail-item">
                      <span class="detail-label">Dortoir</span>
                      <span class="detail-value">{{ getDortoirLabel(selectedSeminairiste.dortoir) }}</span>
                    </div>
                    <div class="detail-item">
                      <span class="detail-label">Car de Transport</span>
                      <span class="detail-value">{{ getCarLabel(selectedSeminairiste.car_transport) }}</span>
                    </div>
                  </div>
                </div>
                <div class="content-section">
                  <h4 class="section-title">Paiement</h4>
                  <div class="details-grid">
                    <div class="detail-item">
                      <span class="detail-label">Numéro Wave</span>
                      <span class="detail-value">{{ selectedSeminairiste.numero_wave || 'Non renseigné' }}</span>
                    </div>
                    <div class="detail-item">
                      <span class="detail-label">Référence Paiement</span>
                      <span class="detail-value font-mono">{{ selectedSeminairiste.ref_paiement || 'Non renseigné' }}</span>
                    </div>
                    <div class="detail-item">
                      <span class="detail-label">Date d'Inscription</span>
                      <span class="detail-value">{{ formatDate(selectedSeminairiste.created_at) }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button @click="downloadFicheSeminairiste(selectedSeminairiste)" class="save-button download-button-purple">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Télécharger Fiche</span>
          </button>
          <button @click="editSeminairiste(selectedSeminairiste); closeDetailModal()" class="save-button edit-button-green">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <span>Modifier</span>
          </button>
          <button @click="assignDortoir(selectedSeminairiste); closeDetailModal()" class="save-button assign-button-orange">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h4a1 1 0 011 1v5m-6 0V9a1 1 0 011-1h4a1 1 0 011 1v11" />
            </svg>
            <span>Assigner Logistique</span>
          </button>
          <button @click="downloadBadge(selectedSeminairiste)" class="save-button badge-button-indigo" title="Générer Badge">
            <AwardIcon class="w-4 h-4" />
            <span>Générer Badge</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Édition Séminairiste -->
    <div v-if="showEditModal" class="modal" @click.self="closeEditModal">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Modifier le Séminairiste</h2>
          <button @click="closeEditModal" class="close-button">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <form @submit.prevent="saveEdit" class="modal-body">
          <div class="form-section">
            <div class="form-row">
              <div class="form-group">
                <label class="block text-sm font-medium text-gray-700 mb-2">Prénom *</label>
                <input v-model="editForm.prenom" type="text" required>
              </div>

              <div class="form-group">
                <label class="block text-sm font-medium text-gray-700 mb-2">Nom *</label>
                <input v-model="editForm.nom" type="text" required>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="block text-sm font-medium text-gray-700 mb-2">Sexe</label>
                <select v-model="editForm.sexe">
                  <option value="M">Masculin</option>
                  <option value="F">Féminin</option>
                </select>
              </div>

              <div class="form-group">
                <label class="block text-sm font-medium text-gray-700 mb-2">Contact *</label>
                <input v-model="editForm.contact" type="text" required>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="block text-sm font-medium text-gray-700 mb-2">Contact Parent</label>
                <input v-model="editForm.contact_parent" type="text">
              </div>

              <div class="form-group">
                <label class="block text-sm font-medium text-gray-700 mb-2">Niveau d'Étude</label>
                <input v-model="editForm.niveau_etude" type="text">
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="block text-sm font-medium text-gray-700 mb-2">Secrétariat Régional</label>
                <input v-model="editForm.secretariat_regional" type="text">
              </div>

              <div class="form-group">
                <label class="block text-sm font-medium text-gray-700 mb-2">Sous-comité</label>
                <input v-model="editForm.sous_comite" type="text">
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="block text-sm font-medium text-gray-700 mb-2">Qualité</label>
                <input v-model="editForm.qualite" type="text">
              </div>

              <div class="form-group">
                <label class="block text-sm font-medium text-gray-700 mb-2">Taille T-shirt</label>
                <select v-model="editForm.taille_tshirt">
                  <option value="">Sélectionner</option>
                  <option value="XS">XS</option>
                  <option value="S">S</option>
                  <option value="M">M</option>
                  <option value="L">L</option>
                  <option value="XL">XL</option>
                  <option value="XXL">XXL</option>
                </select>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="block text-sm font-medium text-gray-700 mb-2">Niveau Séminaire</label>
                <select v-model="editForm.niveau_seminaire">
                  <option value="">Sélectionner</option>
                  <option value="1AS">1AS</option>
                  <option value="2AS">2AS</option>
                  <option value="3AS">3AS</option>
                  <option value="1AF">1AF</option>
                  <option value="2AF">2AF</option>
                  <option value="3AF">3AF</option>
                  <option value="1BS">1BS</option>
                  <option value="2BS">2BS</option>
                  <option value="3BS">3BS</option>
                  <option value="1BF">1BF</option>
                  <option value="2BF">2BF</option>
                  <option value="3BF">3BF</option>
                  <option value="4">4</option>
                  <option value="TEST_ENTREE">Test d'entrée</option>
                </select>
              </div>

              <div class="form-group">
                <label class="block text-sm font-medium text-gray-700 mb-2">Statut Inscription</label>
                <select v-model="editForm.statut_inscription">
                  <option value="EN_COURS">En cours</option>
                  <option value="VALIDEE">Validée</option>
                  <option value="REJETEE">Rejetée</option>
                  <option value="ANNULEE">Annulée</option>
                </select>
              </div>
            </div>
          </div>

          <div class="form-actions">
            <button type="button" @click="closeEditModal" class="cancel-button">
              Annuler
            </button>
            <button type="submit" :disabled="submitting" class="save-button edit-button-green">
              <svg v-if="submitting" class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>{{ submitting ? 'Sauvegarde...' : 'Sauvegarder' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal Assignation Dortoir/Car -->
    <div v-if="showDortoirModal" class="modal" @click.self="closeDortoirModal">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Assignation Logistique</h2>
          <button @click="closeDortoirModal" class="close-button">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <form @submit.prevent="saveDortoirAssignment" class="modal-body">
          <div class="form-section">
            <div class="form-group">
              <label class="block text-sm font-medium text-gray-700 mb-2">Dortoir</label>
              <select v-model="dortoirForm.dortoir">
                <option value="">Sélectionner un dortoir</option>
                <option value="DORTOIR_A">Dortoir A - Hommes</option>
                <option value="DORTOIR_B">Dortoir B - Hommes</option>
                <option value="DORTOIR_C">Dortoir C - Hommes</option>
                <option value="DORTOIR_D">Dortoir D - Hommes</option>
                <option value="DORTOIR_E">Dortoir E - Hommes</option>
                <option value="DORTOIR_F">Dortoir F - Hommes</option>
                <option value="DORTOIR_G">Dortoir G - Hommes</option>
                <option value="DORTOIR_H">Dortoir H - Hommes</option>
                <option value="DORTOIR_I">Dortoir I - Femmes</option>
                <option value="DORTOIR_J">Dortoir J - Femmes</option>
                <option value="DORTOIR_K">Dortoir K - Femmes</option>
                <option value="DORTOIR_L">Dortoir L - Femmes</option>
                <option value="DORTOIR_M">Dortoir M - Femmes</option>
                <option value="DORTOIR_N">Dortoir N - Femmes</option>
                <option value="DORTOIR_O">Dortoir O - Femmes</option>
                <option value="DORTOIR_P">Dortoir P - Femmes</option>
                <option value="DORTOIR_Q">Dortoir Q - Femmes</option>
                <option value="DORTOIR_R">Dortoir R - Femmes</option>
                <option value="DORTOIR_S">Dortoir S - Femmes</option>
                <option value="DORTOIR_T">Dortoir T - Femmes</option>
                <option value="DORTOIR_U">Dortoir U - Femmes</option>
                <option value="DORTOIR_V">Dortoir V - Femmes</option>
                <option value="DORTOIR_W">Dortoir W - Femmes</option>
                <option value="DORTOIR_X">Dortoir X - Femmes</option>
                <option value="DORTOIR_Y">Dortoir Y - Femmes</option>
                <option value="DORTOIR_Z">Dortoir Z - Femmes</option>
                <option value="EXTERNE">Externe</option>
              </select>
            </div>

            <div class="form-group">
              <label class="block text-sm font-medium text-gray-700 mb-2">Car de Transport</label>
              <select v-model="dortoirForm.car_transport">
                <option value="">Sélectionner un car</option>
                <option value="CAR_1">Car 1 - Abidjan Nord</option>
                <option value="CAR_2">Car 2 - Abidjan Sud</option>
                <option value="CAR_3">Car 3 - Intérieur</option>
                <option value="CAR_4">Car 4 - Bouaké</option>
                <option value="CAR_5">Car 5 - San Pedro</option>
              </select>
            </div>
          </div>

          <div class="form-actions">
            <button type="button" @click="closeDortoirModal" class="cancel-button">
              Annuler
            </button>
            <button type="submit" :disabled="submitting" class="save-button assign-button-orange">
              <svg v-if="submitting" class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>{{ submitting ? 'Assignation...' : 'Assigner' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Alert Messages -->
    <div class="toast-container" v-if="alert.show">
      <div class="toast" :class="alert.type">
        <div class="toast-icon">
          <svg v-if="alert.type === 'success'" xmlns="http://www.w3.org/2000/svg" width="20" height="20"
            viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
            stroke-linejoin="round" class="lucide lucide-check-circle">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
          <svg v-else-if="alert.type === 'error'" xmlns="http://www.w3.org/2000/svg" width="20" height="20"
            viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
            stroke-linejoin="round" class="lucide lucide-alert-circle">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" x2="12" y1="8" y2="12" />
            <line x1="12" x2="12.01" y1="16" y2="16" />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
            class="lucide lucide-info">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" x2="12" y1="16" y2="12" />
            <line x1="12" x2="12.01" y1="8" y2="8" />
          </svg>
        </div>
        <div class="toast-content">{{ alert.message }}</div>
        <button class="toast-close" @click="alert.show = false">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
            class="lucide lucide-x">
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { sendSMS } from '../../services/smsService.js'
import { AwardIcon } from 'lucide-vue-next' // Import de l'icône Award
import QRCode from 'qrcode';

// Données réactives
const API_BASE_URL = 'https://sogetrag.com/api/seminaire_list_api.php'
const seminairistes = ref([])
const loading = ref(false)
const submitting = ref(false)
const exporting = ref(false)
const showImageModal = ref(false)
const selectedImage = ref('')
const searchTimeout = ref(null)
const phone = ref('')
const message = ref('')
const result = ref(null)
const error = ref(null)

// Modals
const showDetailModal = ref(false)
const showEditModal = ref(false)
const showDortoirModal = ref(false)
const selectedSeminairiste = ref(null)
const editForm = ref({})
const dortoirForm = ref({
  dortoir: '',
  car_transport: ''
})

const stats = ref({
  total_inscrits: 0,
  paid_count: 0,
  assigned_dortoirs: 0,
  assigned_cars: 0
})

const pagination = ref({
  current_page: 1,
  last_page: 1,
  per_page: 10,
  total: 0,
  from: 0,
  to: 0
})

const filters = ref({
  search: '',
  niveau_seminaire: '',
  statut_paiement: '',
  statut_inscription: ''
})

const alert = ref({
  show: false,
  type: 'success',
  message: ''
})

const activeViewTab = ref('description'); // For detail modal tabs

// Computed properties
const paginationPages = computed(() => {
  const pages = []
  const maxPages = 5

  if (pagination.value.last_page <= maxPages) {
    for (let i = 1; i <= pagination.value.last_page; i++) {
      pages.push(i)
    }
  } else {
    let startPage = Math.max(1, pagination.value.current_page - Math.floor(maxPages / 2))
    let endPage = Math.min(pagination.value.last_page, startPage + maxPages - 1)

    if (endPage - startPage + 1 < maxPages) {
      startPage = Math.max(1, endPage - maxPages + 1)
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }
  }

  return pages
})
const formatXOF = (amount) => {
  if (!amount) return '0 F CFA';
  return new Intl.NumberFormat('fr-FR').format(amount) + ' F CFA';
}

// Méthodes
const openImageModal = (imageUrl) => {
  selectedImage.value = imageUrl
  showImageModal.value = true
  document.body.style.overflow = 'hidden'
}

const closeImageModal = () => {
  showImageModal.value = false
  selectedImage.value = ''
  document.body.style.overflow = 'auto'
}

const changePage = async (page) => {
  if (page < 1 || page > pagination.value.last_page) return
  pagination.value.current_page = page
  await loadSeminairistes()
}

const changePerPage = async () => {
  pagination.value.current_page = 1
  await loadSeminairistes()
}

const applyFilters = async () => {
  pagination.value.current_page = 1
  await loadSeminairistes()
}

const debounceSearch = () => {
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value)
  }
  searchTimeout.value = setTimeout(() => {
    applyFilters()
  }, 500)
}

const resetFilters = () => {
  filters.value = {
    search: '',
    niveau_seminaire: '',
    statut_paiement: '',
    statut_inscription: ''
  }
  pagination.value.current_page = 1
  loadSeminairistes()
}

const loadData = async () => {
  loading.value = true
  try {
    await Promise.all([
      loadSeminairistes(),
      loadStats()
    ])
  } catch (error) {
    console.error('Erreur lors du chargement:', error)
    showAlert('error', 'Erreur lors du chargement des données')
  } finally {
    loading.value = false
  }
}

const envoyer = async () => {
  try {
    result.value = await sendSMS(phone.value, message.value)
    error.value = null
  } catch (err) {
    error.value = err.message
    result.value = null
  }
}
const loadSeminairistes = async () => {
  try {
    let url = `${API_BASE_URL}?action=list_seminairistes&page=${pagination.value.current_page}&per_page=${pagination.value.per_page}&rand=${Math.random()}`

    if (filters.value.search) {
      url += `&search=${encodeURIComponent(filters.value.search)}`
    }
    if (filters.value.niveau_seminaire) {
      url += `&niveau_seminaire=${filters.value.niveau_seminaire}`
    }
    if (filters.value.statut_paiement) {
      url += `&statut_paiement=${filters.value.statut_paiement}`
    }
    if (filters.value.statut_inscription) {
      url += `&statut_inscription=${filters.value.statut_inscription}`
    }

    const response = await fetch(url)
    const data = await response.json()

    if (data.success) {
      seminairistes.value = data.data || []

      if (data.pagination) {
        pagination.value = {
          ...pagination.value,
          ...data.pagination
        }
      }
    } else {
      throw new Error(data.error || 'Erreur lors du chargement des séminairistes')
    }
  } catch (error) {
    console.error('Erreur loadSeminairistes:', error)
    showAlert('error', 'Erreur lors du chargement des séminairistes')
  }
}

const loadStats = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}?action=stats&rand=${Math.random()}`)
    const data = await response.json()

    if (data.success) {
      stats.value = data.data || {}
    }
  } catch (error) {
    console.error('Erreur loadStats:', error)
  }
}

const exportExcel = async () => {
  try {
    exporting.value = true
    showAlert('info', 'Génération du fichier Excel en cours...')

    if (seminairistes.value.length === 0) {
      showAlert('error', 'Aucune donnée à exporter.')
      return
    }

    const data = seminairistes.value.map(seminairiste => ({
      'Matricule': seminairiste.matricule_seminaire,
      'Prénom': seminairiste.prenom,
      'Nom': seminairiste.nom,
      'Sexe': seminairiste.sexe === 'M' ? 'Masculin' : 'Féminin',
      'Contact': seminairiste.contact,
      'Niveau séminaire': seminairiste.niveau_seminaire,
      'Niveau Etude': seminairiste.niveau_etude,
      'Secrétariat': seminairiste.secretariat_regional,
      'Sous-comité': seminairiste.sous_comite,
      'Qualité': seminairiste.qualite,
      'Photo': seminairiste.photo,
      'T-shirt': seminairiste.taille_tshirt,
      'Dortoir': getDortoirLabel(seminairiste.dortoir),
      'Car': getCarLabel(seminairiste.car_transport),
      'Statut paiement': getPaymentStatusLabel(seminairiste.statut_paiement),
      'Statut inscription': getInscriptionStatusLabel(seminairiste.statut_inscription),
      'Date inscription': formatDate(seminairiste.created_at)
    }))

    const XLSX = await import('xlsx')
    const workbook = XLSX.utils.book_new()
    const worksheet = XLSX.utils.json_to_sheet(data)

    const colWidths = [
      { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 10 }, { wch: 15 },
      { wch: 20 }, { wch: 20 }, { wch: 15 }, { wch: 20 }, { wch: 15 },
      { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }
    ]
    worksheet['!cols'] = colWidths

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Séminairistes SENAFOI 25')

    const today = new Date().toISOString().split('T')[0]
    const filename = `seminairistes_senafoi25_${today}.xlsx`
    XLSX.writeFile(workbook, filename)

    showAlert('success', `Export Excel réussi ! ${data.length} séminairistes exportés.`)

  } catch (error) {
    console.error('Erreur lors de l\'export Excel:', error)
    showAlert('error', 'Erreur lors de l\'export Excel.')
  } finally {
    exporting.value = false
  }
}

const exportPDF = async () => {
  try {
    exporting.value = true
    showAlert('info', 'Génération du PDF en cours...')

    if (seminairistes.value.length === 0) {
      showAlert('error', 'Aucune donnée à exporter.')
      return
    }

    const { jsPDF } = await import('jspdf')
    const autoTable = (await import('jspdf-autotable')).default

    const doc = new jsPDF('landscape')

    // En-tête
    doc.setFontSize(20)
    doc.setTextColor(40, 40, 40)
    doc.text('LISTE DES SÉMINAIRISTES SENAFOI 25', 148, 20, { align: 'center' })

    // Date du rapport
    doc.setFontSize(10)
    doc.setTextColor(100, 100, 100)
    const today = new Date().toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
    doc.text(`Généré le ${today}`, 148, 30, { align: 'center' })

    // Tableau des données
    const tableData = seminairistes.value.map(seminairiste => [
      seminairiste.matricule_seminaire || '',
      `${seminairiste.prenom} ${seminairiste.nom}`,
      getNiveauLabel(seminairiste.niveau_seminaire),
      seminairiste.secretariat_regional || '',
      seminairiste.contact || '',
      getDortoirLabel(seminairiste.dortoir),
      getPaymentStatusLabel(seminairiste.statut_paiement),
      formatDate(seminairiste.created_at) || ''
    ])

    autoTable(doc, {
      head: [['Matricule', 'Nom Complet', 'Niveau', 'Secrétariat', 'Contact', 'Dortoir', 'Paiement', 'Date Inscription']],
      body: tableData,
      startY: 40,
      styles: {
        fontSize: 8,
        cellPadding: 2
      },
      headStyles: {
        fillColor: [34, 197, 94],
        textColor: 255,
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [248, 249, 250]
      }
    })

    const filename = `liste_seminairistes_senafoi25_${new Date().toISOString().split('T')[0]}.pdf`
    doc.save(filename)

    showAlert('success', `Export PDF réussi ! ${seminairistes.value.length} séminairistes exportés.`)

  } catch (error) {
    console.error('Erreur lors de l\'export PDF:', error)
    showAlert('error', 'Erreur lors de l\'export PDF.')
  } finally {
    exporting.value = false
  }
}

const viewSeminairiste = async (seminairiste) => {
  try {
    const response = await fetch(`${API_BASE_URL}?action=view_seminairiste&id=${seminairiste.id_seminaire}`)
    const data = await response.json()

    if (data.success) {
      selectedSeminairiste.value = data.data
      showDetailModal.value = true
      activeViewTab.value = 'description'; // Reset tab to default
      document.body.style.overflow = 'hidden'
    } else {
      showAlert('error', 'Erreur lors du chargement des détails')
    }
  } catch (error) {
    console.error('Erreur viewSeminairiste:', error)
    showAlert('error', 'Erreur lors du chargement des détails')
  }
}

const editSeminairiste = (seminairiste) => {
  selectedSeminairiste.value = seminairiste
  editForm.value = {
    prenom: seminairiste.prenom,
    nom: seminairiste.nom,
    sexe: seminairiste.sexe,
    contact: seminairiste.contact,
    contact_parent: seminairiste.contact_parent,
    niveau_etude: seminairiste.niveau_etude,
    secretariat_regional: seminairiste.secretariat_regional,
    sous_comite: seminairiste.sous_comite,
    qualite: seminairiste.qualite,
    taille_tshirt: seminairiste.taille_tshirt,
    niveau_seminaire: seminairiste.niveau_seminaire,
    statut_inscription: seminairiste.statut_inscription
  }
  showEditModal.value = true
  document.body.style.overflow = 'hidden'
}

const downloadFicheSeminairiste = async (seminairiste) => {
  try {
    exporting.value = true
    showAlert('info', 'Génération de la fiche en cours...')

    const { jsPDF } = await import('jspdf')
    const doc = new jsPDF()

    // En-tête avec logo/titre
    doc.setFontSize(20)
    doc.setTextColor(34, 197, 94)
    doc.text('FICHE SÉMINAIRISTE SENAFOI 25', 105, 20, { align: 'center' })

    // Ligne de séparation
    doc.setDrawColor(34, 197, 94)
    doc.setLineWidth(0.5)
    doc.line(20, 25, 190, 25)

    // Informations personnelles
    doc.setFontSize(14)
    doc.setTextColor(40, 40, 40)
    doc.text('INFORMATIONS PERSONNELLES', 20, 40)

    doc.setFontSize(10)
    let yPos = 50

    const personalInfo = [
      ['Matricule:', seminairiste.matricule_seminaire || 'Non défini'],
      ['Nom complet:', `${seminairiste.prenom} ${seminairiste.nom}`],
      ['Sexe:', seminairiste.sexe === 'M' ? 'Masculin' : 'Féminin'],
      ['Contact:', seminairiste.contact || 'Non renseigné'],
      ['Contact parent:', seminairiste.contact_parent || 'Non renseigné'],
      ['Niveau d\'étude:', seminairiste.niveau_etude || 'Non renseigné']
    ]

    personalInfo.forEach(([label, value]) => {
      doc.setFont(undefined, 'bold')
      doc.text(label, 20, yPos)
      doc.setFont(undefined, 'normal')
      doc.text(value, 70, yPos)
      yPos += 8
    })

    // Informations séminaire
    yPos += 10
    doc.setFontSize(14)
    doc.setFont(undefined, 'bold')
    doc.text('INFORMATIONS SÉMINAIRE', 20, yPos)

    yPos += 10
    doc.setFontSize(10)

    const seminarInfo = [
      ['Niveau séminaire:', getNiveauLabel(seminairiste.niveau_seminaire)],
      ['Secrétariat régional:', seminairiste.secretariat_regional || 'Non renseigné'],
      ['Sous-comité:', seminairiste.sous_comite || 'Non renseigné'],
      ['Qualité:', seminairiste.qualite || 'Non renseigné'],
      ['Taille T-shirt:', seminairiste.taille_tshirt || 'Non renseigné']
    ]

    seminarInfo.forEach(([label, value]) => {
      doc.setFont(undefined, 'bold')
      doc.text(label, 20, yPos)
      doc.setFont(undefined, 'normal')
      doc.text(value, 70, yPos)
      yPos += 8
    })

    // Logistique
    yPos += 10
    doc.setFontSize(14)
    doc.setFont(undefined, 'bold')
    doc.text('LOGISTIQUE', 20, yPos)

    yPos += 10
    doc.setFontSize(10)

    const logisticInfo = [
      ['Dortoir:', getDortoirLabel(seminairiste.dortoir)],
      ['Car de transport:', getCarLabel(seminairiste.car_transport)]
    ]

    logisticInfo.forEach(([label, value]) => {
      doc.setFont(undefined, 'bold')
      doc.text(label, 20, yPos)
      doc.setFont(undefined, 'normal')
      doc.text(value, 70, yPos)
      yPos += 8
    })

    // Statuts
    yPos += 10
    doc.setFontSize(14)
    doc.setFont(undefined, 'bold')
    doc.text('STATUTS', 20, yPos)

    yPos += 10
    doc.setFontSize(10)

    const statusInfo = [
      ['Statut inscription:', getInscriptionStatusLabel(seminairiste.statut_inscription)],
      ['Statut paiement:', getPaymentStatusLabel(seminairiste.statut_paiement)],
      ['Référence paiement:', seminairiste.ref_paiement || 'Non renseigné'],
      ['Date inscription:', formatDate(seminairiste.created_at)]
    ]

    statusInfo.forEach(([label, value]) => {
      doc.setFont(undefined, 'bold')
      doc.text(label, 20, yPos)
      doc.setFont(undefined, 'normal')
      doc.text(value, 70, yPos)
      yPos += 8
    })

    // Pied de page
    doc.setFontSize(8)
    doc.setTextColor(100, 100, 100)
    doc.text(`Fiche générée le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}`, 105, 280, { align: 'center' })

    const filename = `fiche_${seminairiste.prenom}_${seminairiste.nom}_${seminairiste.matricule_seminaire}.pdf`
    doc.save(filename)

    showAlert('success', 'Fiche téléchargée avec succès !')

  } catch (error) {
    console.error('Erreur lors de la génération de la fiche:', error)
    showAlert('error', 'Erreur lors de la génération de la fiche')
  } finally {
    exporting.value = false
  }
}  // si tu utilises un bundler (vite, webpack), sinon utilise une import dynamique

const downloadBadge = async (seminairiste) => {
  try {
    exporting.value = true;
    showAlert('info', 'Génération du badge...');

    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a7',
    });

    const width = doc.internal.pageSize.getWidth();
    const height = doc.internal.pageSize.getHeight();

    // Fond personnalisé (image PNG)
    try {
      const background = new Image();
      background.crossOrigin = 'anonymous';
      background.src = 'https://res.cloudinary.com/dqk65objc/image/upload/v1752540035/aeemci_photo_1752540028107_senafoi_badge%C3%B9.png.png';
      await new Promise((res, rej) => {
        background.onload = res;
        background.onerror = rej;
      });
      doc.addImage(background, 'PNG', 0, 0, width, height);
    } catch (e) {
      console.warn('Image de fond non chargée', e);
    }

    let yOffset = 35;

    // Photo avec coins arrondis
    if (seminairiste.photo) {
      try {
        const imgResponse = await fetch(seminairiste.photo);
        const blob = await imgResponse.blob();
        const reader = new FileReader();
        reader.readAsDataURL(blob);

        await new Promise((resolve) => {
          reader.onloadend = () => {
            const base64 = reader.result;
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.src = base64;

            img.onload = () => {
              const canvasSize = 300;
              const canvas = document.createElement('canvas');
              canvas.width = canvas.height = canvasSize;
              const ctx = canvas.getContext('2d');

              const radius = 100;
              ctx.beginPath();
              ctx.moveTo(radius, 0);
              ctx.lineTo(canvasSize - radius, 0);
              ctx.quadraticCurveTo(canvasSize, 0, canvasSize, radius);
              ctx.lineTo(canvasSize, canvasSize - radius);
              ctx.quadraticCurveTo(canvasSize, canvasSize, canvasSize - radius, canvasSize);
              ctx.lineTo(radius, canvasSize);
              ctx.quadraticCurveTo(0, canvasSize, 0, canvasSize - radius);
              ctx.lineTo(0, radius);
              ctx.quadraticCurveTo(0, 0, radius, 0);
              ctx.closePath();
              ctx.clip();

              ctx.drawImage(img, 0, 0, canvasSize, canvasSize);

              const roundedBase64 = canvas.toDataURL('image/png');

              const size = 18;
              const x = 27;
              doc.addImage(roundedBase64, 'PNG', x, yOffset, size, size + 4, '', 'FAST');
              yOffset += size + 4;

              resolve();
            };

            img.onerror = () => {
              console.warn('Erreur chargement image');
              resolve();
            };
          };
        });
      } catch (e) {
        doc.setFontSize(8);
        doc.text('Photo non dispo.', width / 2, yOffset + 15, { align: 'center' });
        yOffset += 30;
      }
    }

    // Nom complet
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(33, 33, 33);
    doc.text(`${seminairiste.prenom} ${seminairiste.nom}`, width / 2, yOffset + 6, { align: 'center' });
    yOffset += 13;

    // Infos diverses
    doc.setFontSize(6);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(80, 80, 80);
    doc.text(`${seminairiste.dortoir}`, width / 2, yOffset, { align: 'center' });
    yOffset += 3;

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(16, 185, 129);
    doc.text(`${seminairiste.niveau_seminaire}`, width / 2, yOffset, { align: 'center' });
    yOffset += 3;

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(80, 80, 80);
    doc.text(`${seminairiste.car_transport}`, width / 2, yOffset, { align: 'center' });
    yOffset += 3;

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(80, 80, 80);
    doc.text(`${seminairiste.matricule_seminaire}`, width / 2, yOffset, { align: 'center' });
    yOffset += 3;

    // Génération QR Code à partir du matricule
    try {
      const qrUrl = `${seminairiste.matricule_seminaire}`;
      const qrDataURL = await QRCode.toDataURL(qrUrl, { width: 100, margin: 1 });
      doc.addImage(qrDataURL, 'PNG', (width - 13) / 2 + 15, yOffset+3, 13, 13);
      yOffset += 22;
    } catch (e) {
      console.warn('QR non chargé', e);
    }

    doc.save(`badge_${seminairiste.prenom}_${seminairiste.nom}.pdf`);
    showAlert('success', 'Badge généré avec succès !');

  } catch (error) {
    console.error(error);
    showAlert('error', 'Erreur lors de la génération du badge.');
  } finally {
    exporting.value = false;
  }
};



const assignDortoir = (seminairiste) => {
  selectedSeminairiste.value = seminairiste
  dortoirForm.value = {
    dortoir: seminairiste.dortoir || '',
    car_transport: seminairiste.car_transport || ''
  }
  showDortoirModal.value = true
  document.body.style.overflow = 'hidden'
}

const closeDetailModal = () => {
  showDetailModal.value = false
  selectedSeminairiste.value = null
  document.body.style.overflow = 'auto'
}

const closeEditModal = () => {
  showEditModal.value = false
  selectedSeminairiste.value = null
  editForm.value = {}
  document.body.style.overflow = 'auto'
}

const closeDortoirModal = () => {
  showDortoirModal.value = false
  selectedSeminairiste.value = null
  dortoirForm.value = { dortoir: '', car_transport: '' }
  document.body.style.overflow = 'auto'
}

const saveEdit = async () => {
  try {
    submitting.value = true

    const response = await fetch(`${API_BASE_URL}?action=update_seminairiste&id=${selectedSeminairiste.value.id_seminaire}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(editForm.value)
    })

    const data = await response.json()

    if (data.success) {
      showAlert('success', 'Séminairiste modifié avec succès')
      closeEditModal()
      await loadSeminairistes()
    } else {
      showAlert('error', data.message || 'Erreur lors de la modification')
    }
  } catch (error) {
    console.error('Erreur saveEdit:', error)
    showAlert('error', 'Erreur lors de la modification')
  } finally {
    submitting.value = false
  }
}

const saveDortoirAssignment = async () => {
  try {
    submitting.value = true

    // Assigner le dortoir
    if (dortoirForm.value.dortoir) {
      const dortoirResponse = await fetch(`${API_BASE_URL}?action=assign_dortoir`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id_seminaire: selectedSeminairiste.value.id_seminaire,
          dortoir: dortoirForm.value.dortoir
        })
      })

      const dortoirData = await dortoirResponse.json()
      if (!dortoirData.success) {
        throw new Error(dortoirData.message || 'Erreur lors de l\'assignation du dortoir')
      }
    }

    // Assigner le car
    if (dortoirForm.value.car_transport) {
      const carResponse = await fetch(`${API_BASE_URL}?action=assign_car`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id_seminaire: selectedSeminairiste.value.id_seminaire,
          car_transport: dortoirForm.value.car_transport
        })
      })

      const carData = await carResponse.json()
      if (!carData.success) {
        throw new Error(carData.message || 'Erreur lors de l\'assignation du car')
      }
    }

    showAlert('success', 'Assignations effectuées avec succès')
    closeDortoirModal()
    await loadSeminairistes()

  } catch (error) {
    console.error('Erreur saveDortoirAssignment:', error)
    showAlert('error', error.message || 'Erreur lors des assignations')
  } finally {
    submitting.value = false
  }
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const getNiveauLabel = (niveau) => {
  const labels = {
    '1AS': '1ère Année Secondaire',
    '2AS': '2ème Année Secondaire',
    '3AS': '3ème Année Secondaire',
    '1AF': '1ère Année Formation',
    '2AF': '2ème Année Formation',
    '3AF': '3ème Année Formation',
    '1BS': '1ère Année Supérieure',
    '2BS': '2ème Année Supérieure',
    '3BS': '3ème Année Supérieure',
    '1BF': '1ère Année Formation Avancée',
    '2BF': '2ème Année Formation Avancée',
    '3BF': '3ème Année Formation Avancée',
    '4': 'Niveau 4',
    'TEST_ENTREE': 'Test d\'entrée requis'
  }
  return labels[niveau] || niveau
}

const getNiveauBadgeClass = (niveau) => {
  const classes = {
    '1AS': 'status-blue',
    '2AS': 'status-blue',
    '3AS': 'status-blue',
    '1AF': 'status-in', // green
    '2AF': 'status-in',
    '3AF': 'status-in',
    '1BS': 'status-purple',
    '2BS': 'status-purple',
    '3BS': 'status-purple',
    '1BF': 'status-orange',
    '2BF': 'status-orange',
    '3BF': 'status-orange',
    '4': 'status-indigo',
    'TEST_ENTREE': 'status-out' // gray
  }
  return classes[niveau] || 'status-out'
}

const getDortoirLabel = (dortoir) => {
  const labels = {
    'DORTOIR_A': 'Dortoir A - Hommes',
    'DORTOIR_B': 'Dortoir B - Hommes',
    'DORTOIR_C': 'Dortoir C - Hommes',
    'DORTOIR_D': 'Dortoir D - Hommes',
    'DORTOIR_E': 'Dortoir E - Hommes',
    'DORTOIR_F': 'Dortoir F - Hommes',
    'DORTOIR_G': 'Dortoir G - Hommes',
    'DORTOIR_H': 'Dortoir H - Hommes',
    'DORTOIR_I': 'Dortoir I - Femmes',
    'DORTOIR_J': 'Dortoir J - Femmes',
    'DORTOIR_K': 'Dortoir K - Femmes',
    'DORTOIR_L': 'Dortoir L - Femmes',
    'DORTOIR_M': 'Dortoir M - Femmes',
    'DORTOIR_N': 'Dortoir N - Femmes',
    'DORTOIR_O': 'Dortoir O - Femmes',
    'DORTOIR_P': 'Dortoir P - Femmes',
    'DORTOIR_Q': 'Dortoir Q - Femmes',
    'DORTOIR_R': 'Dortoir R - Femmes',
    'DORTOIR_S': 'Dortoir S - Femmes',
    'DORTOIR_T': 'Dortoir T - Femmes',
    'DORTOIR_U': 'Dortoir U - Femmes',
    'DORTOIR_V': 'Dortoir V - Femmes',
    'DORTOIR_W': 'Dortoir W - Femmes',
    'DORTOIR_X': 'Dortoir X - Femmes',
    'DORTOIR_Y': 'Dortoir Y - Femmes',
    'DORTOIR_Z': 'Dortoir Z - Femmes',
    'EXTERNE': 'Externe'
  }
  return labels[dortoir] || (dortoir || 'Non assigné')
}

const getCarLabel = (car) => {
  const labels = {
    'CAR_1': 'Car 1 - Abidjan Nord',
    'CAR_2': 'Car 2 - Abidjan Sud',
    'CAR_3': 'Car 3 - Intérieur',
    'CAR_4': 'Car 4 - Bouaké',
    'CAR_5': 'Car 5 - San Pedro'
  }
  return labels[car] || (car || 'Non assigné')
}

const getPaymentStatusLabel = (status) => {
  const labels = {
    'PAYE': 'Payé',
    'EN_ATTENTE': 'En attente',
    'ECHEC': 'Échec'
  }
  return labels[status] || 'Non payé'
}

const getInscriptionStatusLabel = (status) => {
  const labels = {
    'VALIDEE': 'Validée',
    'EN_COURS': 'En cours',
    'REJETEE': 'Rejetée',
    'ANNULEE': 'Annulée'
  }
  return labels[status] || status
}

const showAlert = (type, message) => {
  alert.value = {
    show: true,
    type,
    message
  }

  setTimeout(() => {
    alert.value.show = false
  }, 5000)
}

// Lifecycle hooks
onMounted(() => {
  loadData()
})

onBeforeUnmount(() => {
  document.body.style.overflow = 'auto'
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value)
  }
})
</script>

<style scoped>
.dashboard {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f8f9fa;
}

/* Header Styles */
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1.5rem;
  background-color: #1e0a3c;
  color: white;
  height: 64px;
}

.header-left,
.header-right,
.header-center {
  display: flex;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.main-nav {
  display: flex;
  gap: 1rem;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  font-size: 0.875rem;
  padding: 0.5rem 0.75rem;
  border-radius: 0.375rem;
  transition: all 0.2s;
}

.nav-item:hover,
.nav-item.active {
  color: white;
  background-color: rgba(255, 255, 255, 0.1);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.action-button {
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  color: white;
  cursor: pointer;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  transition: background-color 0.2s;
}

.action-button:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid rgba(255, 255, 255, 0.2);
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
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

.add-product-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #7c3aed;
  color: white;
  border: none;
  border-radius: 9999px;
  padding: 0.5rem 1.25rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.add-product-button:hover {
  background-color: #6d28d9;
}

/* Custom buttons for Page 1 exports */
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


/* Product Tabs - Not directly used in Page 1, but keeping for consistency */
.product-tabs {
  display: flex;
  gap: 0.75rem;
  padding: 1rem 2rem;
  border-bottom: 1px solid #f1f1f4;
  overflow-x: auto;
}

.tab-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 9999px;
  padding: 0.5rem 1.25rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #4b5563;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.tab-button:hover,
.tab-button.active {
  background-color: #7c3aed;
  border-color: #7c3aed;
  color: white;
}

.tab-button.active svg,
.tab-button:hover svg {
  color: white;
}

.tab-button svg {
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
  background-color: #e0e7ff;
  color: #6366f1;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-icon.warning {
  background-color: #fef3c7;
  color: #f59e0b;
}

.stat-icon.danger {
  background-color: #fee2e2;
  color: #ef4444;
}

/* Custom stat icon colors for Page 1 */
.stat-icon-green {
  background-color: #d1fae5;
  color: #10b981;
}

.stat-icon-emerald {
  background-color: #d1fae5;
  color: #059669;
}

.stat-icon-teal {
  background-color: #ccfbf1;
  color: #14b8a6;
}

.stat-icon-blue {
  background-color: #dbeafe;
  color: #3b82f6;
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

.checkbox-cell {
  flex: 0 0 40px;
}

.image-cell {
  flex: 0 0 80px;
}

.name-cell {
  flex: 2;
}

.actions-cell {
  flex: 0 0 100px;
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

.status-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
}

.status-in {
  background-color: #d1fae5;
  color: #10b981;
}

.status-low {
  background-color: #fef3c7;
  color: #f59e0b;
}

.status-out {
  background-color: #fee2e2;
  color: #ef4444;
}

/* Custom status badge colors for Page 1 */
.status-blue {
  background-color: #dbeafe;
  color: #3b82f6;
}

.status-purple {
  background-color: #ede9fe;
  color: #7c3aed;
}

.status-orange {
  background-color: #fff7ed;
  color: #f97316;
}

.status-indigo {
  background-color: #e0e7ff;
  color: #6366f1;
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

.action-icon:hover {
  background-color: #f3f4f6;
  color: #111827;
}

/* Custom action icon colors for Page 1 */
.view-button {
  background-color: rgba(124, 58, 237, 0.1) !important;
  color: #7c3aed !important;
  transition: all 0.2s ease;
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

.assign-button-orange {
  background-color: rgba(249, 115, 22, 0.1) !important;
  color: #f97316 !important;
}

.assign-button-orange:hover {
  background-color: rgba(249, 115, 22, 0.2) !important;
  transform: translateY(-2px);
  box-shadow: 0 3px 10px rgba(249, 115, 22, 0.2);
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

/* Custom pagination active button color */
.pagination-controls .bg-green-600 {
  background-color: #10b981;
  color: white;
  border-color: #10b981;
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

.delete-modal {
  max-width: 500px;
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

/* Custom badge button color */
.save-button.badge-button-indigo {
  background-color: #6366f1;
  border-color: #6366f1;
}

.save-button.badge-button-indigo:hover {
  background-color: #4f46e5;
  border-color: #4f46e5;
}


/* Form Tabs */
.form-tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid #f1f1f4;
  padding-bottom: 0.5rem;
}

.form-tab {
  background: none;
  border: none;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  color: #6b7280;
  cursor: pointer;
  border-radius: 0.375rem;
  transition: all 0.2s;
}

.form-tab:hover {
  background-color: #f3f4f6;
  color: #111827;
}

.form-tab.active {
  background-color: #f3f4f6;
  color: #7c3aed;
  font-weight: 500;
}

/* Product Image Upload */
.product-image-upload {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.product-image-preview {
  width: 120px;
  height: 120px;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f9fafb;
}

.product-image-preview img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.image-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  color: #9ca3af;
}

.image-actions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  justify-content: center;
}

.upload-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  color: #4b5563;
  cursor: pointer;
  transition: all 0.2s;
}

.upload-button:hover {
  background-color: #f3f4f6;
  border-color: #d1d5db;
}

.remove-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #fee2e2;
  border: 1px solid #fecaca;
  border-radius: 0.375rem;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  color: #ef4444;
  cursor: pointer;
  transition: all 0.2s;
}

.remove-button:hover {
  background-color: #fecaca;
  border-color: #fca5a5;
}

.hidden-input {
  display: none;
}

/* Form */
.form-section {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-group {
  margin-bottom: 0;
}

.form-row {
  display: flex;
  gap: 1rem;
  margin-bottom: 0;
}

.form-row .form-group {
  flex: 1;
}

.form-group label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  color: #111827;
  background-color: white;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #a78bfa;
  box-shadow: 0 0 0 2px rgba(167, 139, 250, 0.25);
}

/* Custom focus color for Page 1 */
.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  border-color: #10b981;
  box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.25);
}


.input-with-icon {
  position: relative;
}

.input-with-icon input {
  padding-right: 2.5rem;
}

.input-with-icon .input-icon {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: #6b7280;
}

.dimensions-inputs {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.dimensions-inputs input {
  flex: 1;
}

.checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #374151;
  cursor: pointer;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1.5rem;
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
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: white;
  background-color: #7c3aed;
  border: 1px solid #7c3aed;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s;
}

.save-button:hover {
  background-color: #6d28d9;
  border-color: #6d28d9;
}

/* Custom save button colors for Page 1 */
.save-button.edit-button-green {
  background-color: #10b981;
  border-color: #10b981;
}

.save-button.edit-button-green:hover {
  background-color: #059669;
  border-color: #059669;
}

.save-button.download-button-purple {
  background-color: #7c3aed;
  border-color: #7c3aed;
}

.save-button.download-button-purple:hover {
  background-color: #6d28d9;
  border-color: #6d28d9;
}

.save-button.assign-button-orange {
  background-color: #f97316;
  border-color: #f97316;
}

.save-button.assign-button-orange:hover {
  background-color: #ea580c;
  border-color: #ea580c;
}


.delete-button {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: white;
  background-color: #ef4444;
  border: 1px solid #ef4444;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s;
}

.delete-button:hover {
  background-color: #dc2626;
  border-color: #dc2626;}

/* Delete Warning */
.delete-warning {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 1.5rem;
  gap: 1rem;
}

.delete-warning svg {
  color: #ef4444;
}

.warning-text {
  font-size: 0.875rem;
  color: #6b7280;
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

.view-modal {
  max-width: 900px;
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

.options-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.option-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.option-status {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.option-status.status-in {
  background-color: #10b981;
}

.option-status.status-out {
  background-color: #9ca3af;
}

.option-label {
  font-size: 0.875rem;
  color: #4b5563;
}

.action-button {
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

.action-button:hover {
  background-color: #f3f4f6;
  border-color: #9ca3af;
}

.edit-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: white;
  background-color: #7c3aed;
  border: 1px solid #7c3aed;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s;
}

.edit-button:hover {
  background-color: #6d28d9;
  border-color: #6d28d9;
}

@media (max-width: 768px) {
  .product-view-header {
    flex-direction: column;
    gap: 1.5rem;
  }

  .product-view-image {
    width: 100%;
    height: 250px;
  }
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

@media (max-width: 480px) {
  .main-content {
    min-width: 150px;
    padding: 0.5rem;
  }

  .overview-section {
    width: 100%;
    max-width: 400px;
    margin: 0 auto;
    border-radius: 0.5rem;
  }

  .overview-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
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

  .header-center {
    display: none;
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

  .modal-content {
    margin: 0.5rem;
    max-width: calc(100vw - 1rem);
  }

  .modal-header {
    padding: 1rem;
  }

  .modal-header h2 {
    font-size: 1rem;
  }

  .modal-body {
    padding: 1rem;
  }

  .modal-footer {
    padding: 1rem;
  }

  .product-image-upload {
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }

  .image-actions {
    width: 100%;
    align-items: center;
  }

  .upload-button,
  .remove-button {
    width: 100%;
    justify-content: center;
  }

  .form-row {
    flex-direction: column;
    gap: 1rem;
  }

  .dimensions-inputs {
    flex-direction: column;
    gap: 0.75rem;
  }

  .dimensions-inputs input {
    width: 100%;
  }

  .data-table {
    display: none;
  }

  .list-header {
    justify-content: center;
    padding: 0 1rem;
  }

  .add-button {
    width: 100%;
    justify-content: center;
  }
}

/* Mobile-specific display classes */
.mobile-only {
  display: none;
}

/* Responsive Adjustments */
/* Hide desktop elements on mobile */
@media (max-width: 768px) {
  .desktop-only {
    display: none !important;
  }

  .mobile-only {
    display: block !important;
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
    grid-template-columns: 1fr 1fr;
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

  .product-card-mobile .detail-value.price {
    font-weight: 600;
    color: #7c3aed;
  }

  .product-card-mobile .card-actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
    border-top: 1px solid #f1f1f4;
    padding-top: 0.75rem;
  }

  /* Mobile Data Table Card Styles (for categories/warehouses) */
  .data-cards-mobile {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem 0;
  }

  .data-card-mobile {
    background-color: white;
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    padding: 1rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .data-card-mobile .card-content {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .data-card-mobile .card-item {
    display: flex;
    flex-direction: column;
  }

  .data-card-mobile .item-label {
    font-size: 0.75rem;
    color: #6b7280;
  }

  .data-card-mobile .item-value {
    font-size: 0.875rem;
    color: #111827;
    font-weight: 500;
  }

  .data-card-mobile .card-actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
    border-top: 1px solid #f1f1f4;
    padding-top: 0.75rem;
  }
}

.detail-value {
  padding: 10px;
  font-weight: 500;
}

.history-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
  font-size: 0.875rem;
}

.history-table th,
.history-table td {
  padding: 0.75rem 1rem;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
}

.history-table th {
  background-color: #f9fafb;
  font-weight: 600;
  color: #6b7280;
  font-size: 0.75rem;
  text-transform: uppercase;
}

.history-table tr:last-child td {
  border-bottom: none;
}

.history-table tr:hover {
  background-color: #f9fafb;
}

/* Styles pour les badges d'opération */
.operation-add {
  display: inline-block;
  color: #10b981;
  background-color: #d1fae5;
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
}

.operation-subtract {
  display: inline-block;
  color: #ef4444;
  background-color: #fee2e2;
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
}

.operation-set {
  display: inline-block;
  color: #3b82f6;
  background-color: #fef2db;
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
}

.operation-vente {
  display: inline-block;
  color: #573708;
  background-color: #f0c483;
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
}

/* Styles pour les tableaux de données */
.data-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
  font-size: 0.875rem;
}

.data-table th,
.data-table td {
  padding: 0.75rem 1rem;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
}

.data-table th {
  background-color: #f9fafb;
  font-weight: 600;
  color: #6b7280;
  font-size: 0.75rem;
  text-transform: uppercase;
}

.data-table tr:last-child td {
  border-bottom: none;
}

.data-table tr:hover {
  background-color: #f9fafb;
}

/* Styles pour l'en-tête de liste */
.list-header {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1rem;
}

.add-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #7c3aed;
  color: white;
  border: none;
  border-radius: 0.375rem;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.add-button:hover {
  background-color: #6d28d9;
}

/* Styles pour l'état vide */
.no-items {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 0;
  color: #6b7280;
  gap: 1rem;
  text-align: center;
}

.stock-stats {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.stat-card {
  background-color: #f9fafb;
  border-radius: 0.5rem;
  padding: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.stat-title {
  font-size: 0.75rem;
  color: #6b7280;
  margin-bottom: 0.5rem;
}

.stat-value {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
}

/* Styles pour la répartition par entrepôt */
.no-data {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem 0;
  color: #6b7280;
  gap: 1rem;
  text-align: center;
}

.warehouse-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.warehouse-card {
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.warehouse-name {
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #374151;
}

.warehouse-location {
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 0.5rem;
}

.warehouse-stock {
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 0.25rem;
}

.warehouse-percentage {
  font-size: 0.75rem;
  color: #6b7280;
  margin-bottom: 0.5rem;
}

.progress-bar {
  height: 0.5rem;
  background-color: #f3f4f6;
  border-radius: 9999px;
  overflow: hidden;
  margin-bottom: 1rem;
}

.progress {
  height: 100%;
  background-color: #7c3aed;
  border-radius: 9999px;
}

.warehouse-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  border-radius: 0.375rem;
  cursor: pointer;
}

.btn-outline {
  background-color: white;
  border: 1px solid #d1d5db;
  color: #6b7280;
}

.btn-outline:hover {
  background-color: #f3f4f6;
  border-color: #9ca3af;
  color: #111827;
}

/* Ajout d'une colonne pour l'entrepôt dans la table d'historique */
.history-table th,
.history-table td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
}

.history-table th {
  font-size: 0.75rem;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
}

.export-actions {
  display: flex;
  gap: 0.75rem;
  padding: 0 2rem 1rem;
  border-bottom: 1px solid #f1f1f4;
}

.export-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  color: #4b5563;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.export-button:hover:not(:disabled) {
  background-color: #f3f4f6;
  border-color: #d1d5db;
  color: #111827;
}

.export-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
