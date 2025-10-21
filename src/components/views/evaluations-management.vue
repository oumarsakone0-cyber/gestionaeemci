<template>
  <div class="dashboard">
    <!-- Animations de fond -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        class="absolute -top-40 -right-40 w-80 h-80 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"
      ></div>
      <div
        class="absolute -bottom-40 -left-40 w-80 h-80 bg-amber-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"
      ></div>
      <div
        class="absolute top-40 left-40 w-80 h-80 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"
      ></div>
    </div>

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
                <svg class="w-8 h-8 text-orange-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  ></path>
                </svg>
                Gestion Évaluations
              </h1>
              <p class="overview-date">Création et suivi des évaluations QCM</p>
            </div>
          </div>

          <div class="header-actions-right">
            <button @click="exportExcel()" class="action-button-outlined">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                ></path>
              </svg>
              <span>Excel</span>
            </button>
            <button @click="exportPDF()" class="action-button-outlined">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                ></path>
              </svg>
              <span>PDF</span>
            </button>
            <button @click="showAddModal = true" class="add-product-button">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
              </svg>
              <span>Créer Évaluation</span>
            </button>
          </div>
        </div>

        <!-- Statistiques -->
        <div class="product-stats">
          <div class="stat-card">
            <div class="stat-icon">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                ></path>
              </svg>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.total_evaluations || 0 }}</div>
              <div class="stat-label">Total Évaluations</div>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                ></path>
              </svg>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.total_participants || 0 }}</div>
              <div class="stat-label">Participants</div>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon warning">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                ></path>
              </svg>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.active_evaluations || 0 }}</div>
              <div class="stat-label">Évaluations Actives</div>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                ></path>
              </svg>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.average_score || 0 }}%</div>
              <div class="stat-label">Moyenne Générale</div>
            </div>
          </div>
        </div>

        <!-- Filtres avancés -->
        <div class="search-filters">
          <div class="search-bar">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              ></path>
            </svg>
            <input
              v-model="filters.search"
              @input="debounceSearch"
              type="text"
              placeholder="Rechercher par titre..."
            />
          </div>
          <div class="filter-options">
            <select v-model="filters.statut" @change="applyFilters">
              <option value="">Tous les statuts</option>
              <option value="brouillon">Brouillon</option>
              <option value="active">Active</option>
              <option value="terminee">Terminée</option>
            </select>
            <input v-model="filters.date_debut" @change="applyFilters" type="date" />
            <input v-model="filters.date_fin" @change="applyFilters" type="date" />
            <button @click="resetFilters" class="action-button-outlined">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                ></path>
              </svg>
              <span>Réinitialiser</span>
            </button>
          </div>
        </div>

        <!-- Tableau des évaluations -->
        <div class="products-table">
          <div class="table-header desktop-only">
            <div class="table-cell">
              <div class="flex items-center space-x-2">
                <svg class="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  ></path>
                </svg>
                <span>Titre</span>
              </div>
            </div>
            <div class="table-cell">Questions</div>
            <div class="table-cell">Participants</div>
            <div class="table-cell">Statut</div>
            <div class="table-cell">Accès</div>
            <div class="table-cell actions-cell">Actions</div>
          </div>

          <div v-if="loading" class="loading-indicator">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
            </svg>
            Chargement...
          </div>
          <div v-else-if="evaluations.length === 0" class="no-products">
            <svg class="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              ></path>
            </svg>
            <p>Aucune évaluation trouvée</p>
            <button @click="showAddModal = true" class="add-product-button">
              Créer Évaluation
            </button>
          </div>
          <template v-else>
            <!-- Desktop Table View -->
            <div v-for="evaluation in evaluations" :key="evaluation.id" class="table-row desktop-only">
              <div class="table-cell">
                <div class="flex items-center">
                  <div class="product-image">
                    <div class="no-image">
                      <svg class="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        ></path>
                      </svg>
                    </div>
                  </div>
                  <div class="product-info">
                    <div class="product-name">{{ evaluation.titre }}</div>
                    <div class="product-reference">{{ evaluation.duree }} min</div>
                  </div>
                </div>
              </div>
              <div class="table-cell">
                <span class="status-badge status-blue">
                  {{ evaluation.nb_questions || 0 }}
                </span>
              </div>
              <div class="table-cell">
                <span class="status-badge status-in">
                  {{ evaluation.nb_participants || 0 }}
                </span>
              </div>
              <div class="table-cell">
                <span :class="getStatutClass(evaluation.statut)" class="status-badge">
                  {{ getStatutLabel(evaluation.statut) }}
                </span>
              </div>
              <div class="table-cell">
                <span
                  :class="evaluation.acces_type === 'libre' ? 'status-in' : 'status-low'"
                  class="status-badge"
                >
                  {{ evaluation.acces_type === 'libre' ? 'Libre' : 'Restreint' }}
                </span>
              </div>
              <div class="table-cell actions-cell">
                <button @click="showQRCode(evaluation)" class="action-icon view-button" title="Générer QR Code">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 16h4.01M4 12h4.01M4 16h4.01M4 8h4.01M8 8h.01M8 12h.01M8 16h.01M12 8h.01"
                    ></path>
                  </svg>
                </button>
                <button @click="exportEvaluationExcel(evaluation)" class="action-icon" title="Exporter Excel">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    ></path>
                  </svg>
                </button>
                <button @click="exportEvaluationPDF(evaluation)" class="action-icon" title="Exporter PDF">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                    ></path>
                  </svg>
                </button>
                <button @click="viewResults(evaluation)" class="action-icon" style="background-color: #adff2f3d;" title="Voir résultats">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    ></path>
                  </svg>
                </button>
                <button @click="editEvaluation(evaluation)" class="action-icon" title="Modifier">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    ></path>
                  </svg>
                </button>
                <button @click="duplicateEvaluation(evaluation)" class="action-icon" title="Dupliquer">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    ></path>
                  </svg>
                </button>
                <button @click="deleteEvaluation(evaluation)" class="action-icon" title="Supprimer">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    ></path>
                  </svg>
                </button>
              </div>
            </div>
            <!-- Mobile Card View -->
            <div class="product-cards-mobile mobile-only">
              <div v-for="evaluation in evaluations" :key="evaluation.id" class="product-card-mobile">
                <div class="card-header">
                  <div class="product-image">
                    <div class="no-image">
                      <svg class="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        ></path>
                      </svg>
                    </div>
                  </div>
                  <div class="product-info">
                    <div class="product-name">{{ evaluation.titre }}</div>
                    <div class="product-reference">{{ evaluation.duree }} min</div>
                  </div>
                </div>
                <div class="card-body">
                  <div class="card-detail">
                    <span class="detail-label">Questions:</span>
                    <span class="detail-value">
                      <span class="status-badge status-blue">
                        {{ evaluation.nb_questions || 0 }}
                      </span>
                    </span>
                  </div>
                  <div class="card-detail">
                    <span class="detail-label">Participants:</span>
                    <span class="detail-value">
                      <span class="status-badge status-in">
                        {{ evaluation.nb_participants || 0 }}
                      </span>
                    </span>
                  </div>
                  <div class="card-detail">
                    <span class="detail-label">Statut:</span>
                    <span class="detail-value">
                      <span :class="getStatutClass(evaluation.statut)" class="status-badge">
                        {{ getStatutLabel(evaluation.statut) }}
                      </span>
                    </span>
                  </div>
                  <div class="card-detail">
                    <span class="detail-label">Accès:</span>
                    <span class="detail-value">
                      <span
                        :class="evaluation.acces_type === 'libre' ? 'status-in' : 'status-low'"
                        class="status-badge"
                      >
                        {{ evaluation.acces_type === 'libre' ? 'Libre' : 'Restreint' }}
                      </span>
                    </span>
                  </div>
                </div>
                <div class="card-actions">
                  <button @click="showQRCode(evaluation)" class="action-icon view-button" style="padding: 2px;" title="Générer QR Code">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 16h4.01M4 12h4.01M4 16h4.01M4 8h4.01M8 8h.01M8 12h.01M8 16h.01M12 8h.01"
                      ></path>
                    </svg>
                  </button>
                  <button @click="exportEvaluationExcel(evaluation)" class="action-icon" title="Exporter Excel">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      ></path>
                    </svg>
                  </button>
                  <button @click="exportEvaluationPDF(evaluation)" class="action-icon" title="Exporter PDF">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                      ></path>
                    </svg>
                  </button>
                  <button @click="viewResults(evaluation)" class="action-icon" title="Voir résultats">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      ></path>
                    </svg>
                  </button>
                  <button @click="editEvaluation(evaluation)" class="action-icon" title="Modifier">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      ></path>
                    </svg>
                  </button>
                  <button @click="duplicateEvaluation(evaluation)" class="action-icon" title="Dupliquer">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                      ></path>
                    </svg>
                  </button>
                  <button @click="deleteEvaluation(evaluation)" class="action-icon" title="Supprimer">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      ></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </template>
        </div>

        <!-- Pagination -->
        <div class="pagination">
          <div class="pagination-info">
            Affichage de <span class="font-medium">{{ pagination.from || 0 }}</span> à
            <span class="font-medium">{{ pagination.to || 0 }}</span> sur
            <span class="font-medium">{{ pagination.total || 0 }}</span> résultats
          </div>
          <div class="pagination-controls">
            <button
              @click="changePage(pagination.current_page - 1)"
              :disabled="pagination.current_page === 1"
              class="pagination-button"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 18l-6-6 6-6"></path>
              </svg>
            </button>
            <span class="pagination-pages">Page {{ pagination.current_page }} sur {{ pagination.last_page }}</span>
            <button
              @click="changePage(pagination.current_page + 1)"
              :disabled="pagination.current_page === pagination.last_page"
              class="pagination-button"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 18l6-6-6-6"></path>
              </svg>
            </button>
          </div>
          <div class="pagination-size">
            <select v-model="pagination.per_page" @change="changePerPage">
              <option value="10">10 par page</option>
              <option value="25">25 par page</option>
              <option value="50">50 par page</option>
              <option value="100">100 par page</option>
            </select>
          </div>
        </div>
      </div>
    </main>

    <!-- Modal QR Code -->
    <div v-if="showQRModal" class="modal" @click.self="closeQRModal">
      <div class="modal-content">
        <div class="modal-header">
          <h2>
            <svg class="w-5 h-5 text-indigo-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 16h4.01M4 12h4.01M4 16h4.01M4 8h4.01M8 8h.01M8 12h.01M8 16h.01M12 8h.01"
              ></path>
            </svg>
            Code QR - {{ selectedEvaluation?.titre }}
          </h2>
          <button @click="closeQRModal" class="close-button">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <div class="modal-body text-center">
          <div class="form-section">
            <div class="product-image-upload">
              <div class="product-image-preview">
                <div id="qrcode" class="image-placeholder"></div>
              </div>
              <div class="image-actions">
                <button @click="copyQRLink" class="upload-button">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    ></path>
                  </svg>
                  <span>Copier le lien</span>
                </button>
                <button @click="downloadQRCode" class="upload-button">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    ></path>
                  </svg>
                  <span>Télécharger</span>
                </button>
              </div>
            </div>
            <p class="text-xs text-gray-500 mt-2">Scannez ce code QR pour accéder directement à l'évaluation</p>
          </div>
        </div>

        <div class="modal-footer">
          <button @click="closeQRModal" class="cancel-button">Fermer</button>
        </div>
      </div>
    </div>

    <!-- Modal Ajouter/Modifier Évaluation -->
    <div v-if="showAddModal || showEditModal" class="modal" @click.self="closeModal()">
      <div class="modal-content max-w-4xl">
        <div class="modal-header">
          <h2>
            <svg class="w-5 h-5 text-orange-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              ></path>
            </svg>
            {{ showAddModal ? 'Créer Évaluation' : 'Modifier Évaluation' }}
          </h2>
          <button @click="closeModal()" class="close-button">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <form @submit.prevent="showAddModal ? addEvaluation() : updateEvaluation()" class="modal-body space-y-8">
          <!-- Informations générales -->
          <div class="form-section">
            <div class="form-row">
              <div class="form-group">
                <label>Titre *</label>
                <input v-model="form.titre" type="text" placeholder="Ex: Évaluation Histoire Sainte" required />
              </div>
              <div class="form-group">
                <label>Durée (minutes) *</label>
                <input v-model="form.duree" type="number" min="5" max="180" placeholder="60" required />
              </div>
            </div>

            <div class="form-group">
              <label>Description</label>
              <textarea v-model="form.description" rows="3" placeholder="Description de l'évaluation..."></textarea>
            </div>
          </div>

          <!-- Configuration d'accès -->
          <div class="form-section">
            <label class="block text-sm font-medium text-gray-700 mb-4">Type d'accès</label>
            <div class="checkbox-group">
              <label class="checkbox-label">
                <input
                  v-model="form.acces_type"
                  type="radio"
                  value="libre"
                  class="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300"
                />
                Accès libre - Tous les séminaristes peuvent participer
              </label>
              <label class="checkbox-label">
                <input
                  v-model="form.acces_type"
                  type="radio"
                  value="restreint"
                  class="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300"
                />
                Accès restreint - Seuls certains matricules peuvent participer
              </label>
            </div>

            <div v-if="form.acces_type === 'restreint'" class="mt-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Matricules autorisés (séparés par des virgules)
              </label>
              <textarea
                v-model="form.matricules_autorises"
                rows="3"
                placeholder="Ex: SEM001, SEM002, SEM003..."
              ></textarea>
              <p class="text-xs text-gray-500 mt-2">Entrez les matricules séparés par des virgules</p>
            </div>
          </div>

          <!-- Questions -->
          <div class="form-section">
            <div class="flex items-center justify-between mb-4">
              <label class="block text-sm font-medium text-gray-700">Questions QCM *</label>
              <button type="button" @click="addQuestion" class="add-product-button">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                </svg>
                <span>Ajouter Question</span>
              </button>
            </div>

            <div v-if="form.questions.length === 0" class="no-products">
              <svg class="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              <p>Aucune question ajoutée</p>
              <p class="text-sm">Cliquez sur "Ajouter Question" pour commencer</p>
            </div>

            <div v-else class="space-y-6">
              <div v-for="(question, index) in form.questions" :key="index" class="question-card">
                <div class="flex items-center justify-between mb-4">
                  <h4 class="text-sm font-medium text-gray-700">Question {{ index + 1 }}</h4>
                  <button @click="removeQuestion(index)" class="action-icon" title="Supprimer question">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      ></path>
                    </svg>
                  </button>
                </div>

                <div class="space-y-4">
                  <div class="form-group">
                    <label>Question *</label>
                    <textarea
                      v-model="question.question"
                      rows="2"
                      placeholder="Posez votre question ici..."
                      required
                    ></textarea>
                  </div>

                  <div class="form-row">
                    <div class="form-group">
                      <label>Réponse A *</label>
                      <input v-model="question.reponse_a" type="text" placeholder="Première option" required />
                    </div>
                    <div class="form-group">
                      <label>Réponse B *</label>
                      <input v-model="question.reponse_b" type="text" placeholder="Deuxième option" required />
                    </div>
                  </div>
                  <div class="form-row">
                    <div class="form-group">
                      <label>Réponse C *</label>
                      <input v-model="question.reponse_c" type="text" placeholder="Troisième option" required />
                    </div>
                    <div class="form-group">
                      <label>Réponse D *</label>
                      <input v-model="question.reponse_d" type="text" placeholder="Quatrième option" required />
                    </div>
                  </div>

                  <div class="form-row">
                    <div class="form-group">
                      <label>Bonne réponse *</label>
                      <select v-model="question.bonne_reponse" required>
                        <option value="">Sélectionner...</option>
                        <option value="A">A</option>
                        <option value="B">B</option>
                        <option value="C">C</option>
                        <option value="D">D</option>
                      </select>
                    </div>
                    <div class="form-group">
                      <label>Points *</label>
                      <input v-model="question.points" type="number" min="1" max="10" placeholder="1" required />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="form-actions pt-6">
            <button type="button" @click="closeModal()" class="cancel-button">Annuler</button>
            <button type="submit" :disabled="submitting || form.questions.length === 0" class="save-button">
              <svg v-if="submitting" class="animate-spin h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span>{{ showAddModal ? 'Créer' : 'Modifier' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal Résultats -->
    <div v-if="showResultsModal" class="modal" @click.self="showResultsModal = false">
      <div class="modal-content view-modal">
        <div class="modal-header">
          <h2>
            <svg class="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              ></path>
            </svg>
            Résultats - {{ selectedEvaluation?.titre }}
          </h2>
          <button style="color: green" @click="showResultsModal = false" class="close-button">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <div v-if="results" class="modal-body">
          <!-- Statistiques générales -->
          <div class="product-stats">
            <div class="stat-card">
              <div class="stat-icon">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                  ></path>
                </svg>
              </div>
              <div class="stat-info">
                <div class="stat-value">{{ results.total_participants }}</div>
                <div class="stat-label">Participants</div>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  ></path>
                </svg>
              </div>
              <div class="stat-info">
                <div class="stat-value">{{ results.moyenne }}</div>
                <div class="stat-label">Moyenne</div>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon warning">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  ></path>
                </svg>
              </div>
              <div class="stat-info">
                <div class="stat-value">{{ results.meilleur_score }}</div>
                <div class="stat-label">Meilleur Score</div>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  ></path>
                </svg>
              </div>
              <div class="stat-info">
                <div class="stat-value">{{ results.taux_reussite }}%</div>
                <div class="stat-label">Taux Réussite</div>
              </div>
            </div>
          </div>

          <!-- Tableau des résultats -->
          <div class="products-table">
            <div class="table-header desktop-only">
              <div class="table-cell">Matricule</div>
              <div class="table-cell">Nom</div>
              <div class="table-cell">Etude</div>
              <div class="table-cell">Sexe</div>
              <div class="table-cell">Score</div>
              <div class="table-cell">Affectation</div>
              <div class="table-cell">Pourcentage</div>
              <div class="table-cell">Temps</div>
              <div class="table-cell actions-cell">Date</div>
            </div>
            <div v-if="results.participants.length === 0" class="no-products">
              <p>Aucun participant pour le moment</p>
            </div>
            <template v-else>
              <!-- Desktop Table View -->
              <div v-for="participant in results.participants" :key="participant.matricule" class="table-row desktop-only">
                <div class="table-cell">{{ participant.matricule }}</div>
                <div class="table-cell">{{ participant.nom + ' ' + participant.prenom || 'N/A' }}</div>
                <div class="table-cell">{{ participant.niveau_etude || 'N/A' }}</div>
                <div class="table-cell">{{ participant.sexe || 'N/A' }}</div>
                <div class="table-cell" style="font-weight: bold;">{{ participant.score_obtenu }}/{{ participant.score_total }}</div>
                <div class="table-cell">{{ participant.niveau_affecte || 'N/A' }}</div>
                <div class="table-cell">
                  <span :class="getScoreClass(participant.score_pourcentage)" class="status-badge">
                    {{ participant.score_pourcentage }}%
                  </span>
                </div>
                <div class="table-cell">{{ formatTime(participant.temps_ecoule) }}</div>
                <div class="table-cell actions-cell">{{ formatDate(participant.completed_at) }}</div>
              </div>
              <!-- Mobile Card View -->
              <div class="product-cards-mobile mobile-only">
                <div v-for="participant in results.participants" :key="participant.matricule" class="product-card-mobile">
                  <div class="card-header">
                    <div class="product-info">
                      <div class="product-name">{{ participant.nom + ' ' + participant.prenom || 'N/A' }}</div>
                      <div class="product-reference">{{ participant.matricule }}</div>
                    </div>
                  </div>
                  <div class="card-body">
                    <div class="card-detail">
                      <span class="detail-label">Étude:</span>
                      <span class="detail-value">{{ participant.niveau_etude || 'N/A' }}</span>
                    </div>
                    <div class="card-detail">
                      <span class="detail-label">Sexe:</span>
                      <span class="detail-value">{{ participant.sexe || 'N/A' }}</span>
                    </div>
                    <div class="card-detail">
                      <span class="detail-label">Score:</span>
                      <span class="detail-value">{{ participant.score_obtenu }}/{{ participant.score_total }}</span>
                    </div>
                    <div class="card-detail">
                      <span class="detail-label">Affectation:</span>
                      <span class="detail-value">{{ participant.niveau_affecte || 'N/A' }}</span>
                    </div>
                    <div class="card-detail">
                      <span class="detail-label">Pourcentage:</span>
                      <span class="detail-value">
                        <span :class="getScoreClass(participant.score_pourcentage)" class="status-badge">
                          {{ participant.score_pourcentage }}%
                        </span>
                      </span>
                    </div>
                    <div class="card-detail">
                      <span class="detail-label">Temps:</span>
                      <span class="detail-value">{{ formatTime(participant.temps_ecoule) }}</span>
                    </div>
                    <div class="card-detail">
                      <span class="detail-label">Date:</span>
                      <span class="detail-value">{{ formatDate(participant.completed_at) }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </div>

        <div class="modal-footer">
          <button @click="showResultsModal = false" class="cancel-button">Fermer</button>
        </div>
      </div>
    </div>

    <!-- Toast Notifications -->
    <div class="toast-container" v-if="alert.show">
      <div class="toast" :class="alert.type">
        <div class="toast-icon">
          <svg v-if="alert.type === 'success'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
          <svg v-else-if="alert.type === 'error'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
          <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
        <div class="toast-content">{{ alert.message }}</div>
        <button class="toast-close" @click="hideToast">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import QRCode from 'qrcode'

export default {
  name: 'EvaluationsManagement',
  data() {
    return {
      API_BASE_URL: 'https://sogetrag.com/api/evaluations-api.php',
      evaluations: [],
      loading: false,
      submitting: false,
      exporting: false,
      showAddModal: false,
      showEditModal: false,
      showResultsModal: false,
      showQRModal: false, // Nouveau modal QR
      selectedEvaluation: null,
      results: null,
      searchTimeout: null,
      qrCodeData: {
        // Données pour le QR Code
        url: '',
        qrInstance: null,
        imageDataURL: null
      },
      stats: {
        total_evaluations: 0,
        total_participants: 0,
        active_evaluations: 0,
        average_score: 0
      },
      pagination: {
        current_page: 1,
        last_page: 1,
        per_page: 10,
        total: 0,
        from: 0,
        to: 0
      },
      filters: {
        search: '',
        statut: '',
        date_debut: '',
        date_fin: ''
      },
      form: {
        titre: '',
        description: '',
        duree: 60,
        acces_type: 'libre',
        matricules_autorises: '',
        questions: []
      },
      alert: {
        show: false,
        type: 'success',
        message: ''
      }
    }
  },
  computed: {
    paginationPages() {
      const pages = []
      const maxPages = 5

      if (this.pagination.last_page <= maxPages) {
        for (let i = 1; i <= this.pagination.last_page; i++) {
          pages.push(i)
        }
      } else {
        let startPage = Math.max(1, this.pagination.current_page - Math.floor(maxPages / 2))
        let endPage = Math.min(this.pagination.last_page, startPage + maxPages - 1)

        if (endPage - startPage + 1 < maxPages) {
          startPage = Math.max(1, endPage - maxPages + 1)
        }

        for (let i = startPage; i <= endPage; i++) {
          pages.push(i)
        }
      }

      return pages
    }
  },
  mounted() {
    this.loadData()
  },
  methods: {
    async loadData() {
      this.loading = true
      try {
        await Promise.all([this.loadEvaluations(), this.loadStats()])
      } catch (error) {
        console.error('Erreur lors du chargement:', error)
        this.showAlert('error', 'Erreur lors du chargement des données')
      } finally {
        this.loading = false
      }
    },

    async loadEvaluations() {
      try {
        let url = `${this.API_BASE_URL}?action=evaluations&page=${this.pagination.current_page}&per_page=${this.pagination.per_page}&rand=${Math.random()}`

        if (this.filters.search) {
          url += `&search=${encodeURIComponent(this.filters.search)}`
        }
        if (this.filters.statut) {
          url += `&statut=${this.filters.statut}`
        }
        if (this.filters.date_debut) {
          url += `&date_debut=${this.filters.date_debut}`
        }
        if (this.filters.date_fin) {
          url += `&date_fin=${this.filters.date_fin}`
        }

        const response = await fetch(url)
        const data = await response.json()

        if (data.success) {
          this.evaluations = data.data || []
          if (data.pagination) {
            this.pagination = {
              ...this.pagination,
              ...data.pagination
            }
          }
        } else {
          throw new Error(data.error || 'Erreur lors du chargement des évaluations')
        }
      } catch (error) {
        console.error('Erreur loadEvaluations:', error)
        this.showAlert('error', 'Erreur lors du chargement des évaluations')
      }
    },

    async loadStats() {
      try {
        const response = await fetch(`${this.API_BASE_URL}?action=stats&rand=${Math.random()}`)
        const data = await response.json()

        if (data.success) {
          this.stats = data.data || this.stats
        }
      } catch (error) {
        console.error('Erreur loadStats:', error)
      }
    },

    async changePage(page) {
      if (page < 1 || page > this.pagination.last_page) return
      this.pagination.current_page = page
      await this.loadEvaluations()
    },

    async changePerPage() {
      this.pagination.current_page = 1
      await this.loadEvaluations()
    },

    async applyFilters() {
      this.pagination.current_page = 1
      await this.loadEvaluations()
    },

    debounceSearch() {
      if (this.searchTimeout) {
        clearTimeout(this.searchTimeout)
      }
      this.searchTimeout = setTimeout(() => {
        this.applyFilters()
      }, 500)
    },

    resetFilters() {
      this.filters = {
        search: '',
        statut: '',
        date_debut: '',
        date_fin: ''
      }
      this.pagination.current_page = 1
      this.loadEvaluations()
    },

    addQuestion() {
      this.form.questions.push({
        question: '',
        reponse_a: '',
        reponse_b: '',
        reponse_c: '',
        reponse_d: '',
        bonne_reponse: '',
        points: 1
      })
    },

    removeQuestion(index) {
      this.form.questions.splice(index, 1)
    },

    async addEvaluation() {
      if (!this.form.titre || this.form.questions.length === 0) {
        this.showAlert('error', 'Veuillez remplir tous les champs obligatoires et ajouter au moins une question')
        return
      }

      this.submitting = true
      try {
        const response = await fetch(`${this.API_BASE_URL}?action=create_evaluation&rand=${Math.random()}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(this.form)
        })
        const data = await response.json()

        if (data.success) {
          this.showAlert('success', 'Évaluation créée avec succès')
          this.closeModal()
          await this.loadData()
        } else {
          throw new Error(data.error || 'Erreur lors de la création')
        }
      } catch (error) {
        console.error('Erreur addEvaluation:', error)
        this.showAlert('error', error.message || 'Erreur lors de la création de l\'évaluation')
      } finally {
        this.submitting = false
      }
    },

    async updateEvaluation() {
      if (!this.form.titre || this.form.questions.length === 0) {
        this.showAlert('error', 'Veuillez remplir tous les champs obligatoires et ajouter au moins une question')
        return
      }

      this.submitting = true
      try {
        const response = await fetch(`${this.API_BASE_URL}?action=update_evaluation&id=${this.selectedEvaluation.id}&rand=${Math.random()}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(this.form)
        })
        const data = await response.json()

        if (data.success) {
          this.showAlert('success', 'Évaluation modifiée avec succès')
          this.closeModal()
          await this.loadData()
        } else {
          throw new Error(data.error || 'Erreur lors de la modification')
        }
      } catch (error) {
        console.error('Erreur updateEvaluation:', error)
        this.showAlert('error', error.message || 'Erreur lors de la modification de l\'évaluation')
      } finally {
        this.submitting = false
      }
    },

    async deleteEvaluation(evaluation) {
      if (!confirm(`Êtes-vous sûr de vouloir supprimer l'évaluation "${evaluation.titre}" ?`)) {
        return
      }

      try {
        const response = await fetch(`${this.API_BASE_URL}?action=delete_evaluation&id=${evaluation.id}&rand=${Math.random()}`, {
          method: 'DELETE'
        })
        const data = await response.json()

        if (data.success) {
          this.showAlert('success', 'Évaluation supprimée avec succès')
          await this.loadData()
        } else {
          throw new Error(data.error || 'Erreur lors de la suppression')
        }
      } catch (error) {
        console.error('Erreur deleteEvaluation:', error)
        this.showAlert('error', error.message || 'Erreur lors de la suppression de l\'évaluation')
      }
    },

    async duplicateEvaluation(evaluation) {
      try {
        const response = await fetch(`${this.API_BASE_URL}?action=duplicate_evaluation&id=${evaluation.id}&rand=${Math.random()}`, {
          method: 'POST'
        })
        const data = await response.json()

        if (data.success) {
          this.showAlert('success', 'Évaluation dupliquée avec succès')
          await this.loadData()
        } else {
          throw new Error(data.error || 'Erreur lors de la duplication')
        }
      } catch (error) {
        console.error('Erreur duplicateEvaluation:', error)
        this.showAlert('error', error.message || 'Erreur lors de la duplication de l\'évaluation')
      }
    },

    editEvaluation(evaluation) {
      this.selectedEvaluation = evaluation
      this.form = {
        titre: evaluation.titre,
        description: evaluation.description || '',
        duree: evaluation.duree,
        acces_type: evaluation.acces_type || 'libre',
        matricules_autorises: evaluation.matricules_autorises || '',
        questions: []
      }

      // Charger les questions existantes
      this.loadEvaluationQuestions(evaluation.id)
      this.showEditModal = true
    },

    async loadEvaluationQuestions(evaluationId) {
      try {
        const response = await fetch(`${this.API_BASE_URL}?action=questions&evaluation_id=${evaluationId}&rand=${Math.random()}`)
        const data = await response.json()

        if (data.success) {
          this.form.questions = data.data || []
        }
      } catch (error) {
        console.error('Erreur loadEvaluationQuestions:', error)
      }
    },

    async viewResults(evaluation) {
      this.selectedEvaluation = evaluation
      try {
        const response = await fetch(`${this.API_BASE_URL}?action=resultats&evaluation_id=${evaluation.id}&rand=${Math.random()}`)
        const data = await response.json()

        if (data.success) {
          this.results = data.data
          this.showResultsModal = true
        } else {
          throw new Error(data.error || 'Erreur lors du chargement des résultats')
        }
      } catch (error) {
        console.error('Erreur viewResults:', error)
        this.showAlert('error', error.message || 'Erreur lors du chargement des résultats')
      }
    },

    // Nouvelle méthode pour afficher le QR Code
    async showQRCode(evaluation) {
      this.selectedEvaluation = evaluation
      this.qrCodeData.url = `https://aeemci.sastock.com/evaluation_question/${evaluation.id}`
      this.showQRModal = true

      // Attendre que le modal soit rendu avant de générer le QR code
      this.$nextTick(() => {
        this.generateQRCode()
      })
    },

    async generateQRCode() {
      try {
        // Charger la bibliothèque QRCode dynamiquement
        const QRCode = await import('qrcode')

        // Générer le QR code comme image data URL
        const qrDataURL = await QRCode.toDataURL(this.qrCodeData.url, {
          width: 200,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        })

        // Afficher l'image dans le conteneur
        const qrContainer = document.getElementById('qrcode')
        if (qrContainer) {
          qrContainer.innerHTML = `<img src="${qrDataURL}" alt="QR Code" style="max-width: 100%; height: auto; border-radius: 8px;">`

          // Stocker l'image pour le téléchargement
          this.qrCodeData.imageDataURL = qrDataURL
        }
      } catch (error) {
        console.error('Erreur lors de la génération du QR code:', error)
        this.showAlert('error', 'Erreur lors de la génération du QR code')
      }
    },

    async copyQRLink() {
      try {
        await navigator.clipboard.writeText(this.qrCodeData.url)
        this.showAlert('success', 'Lien copié dans le presse-papiers !')
      } catch (error) {
        console.error('Erreur lors de la copie:', error)
        this.showAlert('error', 'Erreur lors de la copie du lien')
      }
    },

    async downloadQRCode() {
      try {
        if (!this.qrCodeData.imageDataURL) {
          this.showAlert('error', 'QR Code non généré')
          return
        }

        // Créer un lien de téléchargement
        const link = document.createElement('a')
        link.download = `qr-code-evaluation-${this.selectedEvaluation.id}.png`
        link.href = this.qrCodeData.imageDataURL
        link.click()

        this.showAlert('success', 'QR Code téléchargé avec succès !')
      } catch (error) {
        console.error('Erreur lors du téléchargement:', error)
        this.showAlert('error', 'Erreur lors du téléchargement du QR code')
      }
    },

    closeQRModal() {
      this.showQRModal = false
      this.selectedEvaluation = null
      this.qrCodeData = {
        url: '',
        qrInstance: null,
        imageDataURL: null
      }
    },

    closeModal() {
      this.showAddModal = false
      this.showEditModal = false
      this.showResultsModal = false
      this.selectedEvaluation = null
      this.results = null
      this.form = {
        titre: '',
        description: '',
        duree: 60,
        acces_type: 'libre',
        matricules_autorises: '',
        questions: []
      }
    },

    async exportExcel() {
      try {
        this.exporting = true
        this.showAlert('info', 'Génération du fichier Excel en cours...')

        const response = await fetch(`${this.API_BASE_URL}?action=export_results&rand=${Math.random()}`)
        const data = await response.json()

        if (!data.success) {
          throw new Error(data.error || 'Erreur lors de l\'export')
        }

        const results = data.data
        const XLSX = await import('xlsx')
        const workbook = XLSX.utils.book_new()
        const worksheet = XLSX.utils.json_to_sheet(results)

        const colWidths = [{ wch: 25 }, { wch: 15 }, { wch: 25 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 20 }]
        worksheet['!cols'] = colWidths

        XLSX.utils.book_append_sheet(workbook, worksheet, 'Résultats Évaluations')

        const today = new Date().toISOString().split('T')[0]
        const filename = `evaluations_resultats_${today}.xlsx`
        XLSX.writeFile(workbook, filename)

        this.showAlert('success', `Export Excel réussi ! ${results.length} enregistrements exportés.`)
      } catch (error) {
        console.error('Erreur lors de l\'export Excel:', error)
        this.showAlert('error', 'Erreur lors de l\'export Excel')
      } finally {
        this.exporting = false
      }
    },

    async exportPDF() {
      try {
        this.exporting = true
        this.showAlert('info', 'Génération du PDF en cours...')

        const response = await fetch(`${this.API_BASE_URL}?action=export_results&rand=${Math.random()}`)
        const data = await response.json()

        if (!data.success) {
          throw new Error(data.error || 'Erreur lors de l\'export')
        }

        const results = data.data
        const { jsPDF } = await import('jspdf')
        const autoTable = (await import('jspdf-autotable')).default

        const doc = new jsPDF()

        doc.setFontSize(20)
        doc.setTextColor(40, 40, 40)
        doc.text('RAPPORT D\'ÉVALUATION', 105, 20, { align: 'center' })

        const today = new Date().toLocaleDateString('fr-FR', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
        doc.setFontSize(10)
        doc.setTextColor(100, 100, 100)
        doc.text(`Généré le ${today}`, 105, 30, { align: 'center' })

        const tableData = results.map(result => [
          result.evaluation_titre || '',
          result.matricule || '',
          result.nom_complet || '',
          `${result.score}/${result.total_points}`,
          `${result.pourcentage}%`,
          result.temps_ecoule ? `${Math.floor(result.temps_ecoule / 60)}min` : '',
          result.date_completion || ''
        ])

        autoTable(doc, {
          head: [['Évaluation', 'Matricule', 'Nom', 'Score', '%', 'Temps', 'Date']],
          body: tableData,
          startY: 45,
          styles: {
            fontSize: 8,
            cellPadding: 2
          },
          headStyles: {
            fillColor: [255, 140, 0],
            textColor: 255,
            fontStyle: 'bold'
          },
          alternateRowStyles: {
            fillColor: [248, 249, 250]
          }
        })

        const filename = `rapport_evaluations_${new Date().toISOString().split('T')[0]}.pdf`
        doc.save(filename)

        this.showAlert('success', `Export PDF réussi ! ${results.length} enregistrements exportés.`)
      } catch (error) {
        console.error('Erreur lors de l\'export PDF:', error)
        this.showAlert('error', 'Erreur lors de l\'export PDF')
      } finally {
        this.exporting = false
      }
    },

    // Nouvelles méthodes d'export pour évaluations individuelles
    async exportEvaluationExcel(evaluation) {
      try {
        this.exporting = true
        this.showAlert('info', `Génération du fichier Excel pour "${evaluation.titre}" en cours...`)

        // Charger les résultats de l'évaluation
        const response = await fetch(`${this.API_BASE_URL}?action=resultats&evaluation_id=${evaluation.id}&rand=${Math.random()}`)
        const data = await response.json()

        if (!data.success) {
          throw new Error(data.error || 'Erreur lors du chargement des données')
        }

        const evaluationData = data.data
        const XLSX = await import('xlsx')
        const workbook = XLSX.utils.book_new()

        // Feuille 1: Statistiques de l'évaluation
        const statsData = [
          ['STATISTIQUES DE L\'ÉVALUATION'],
          [''],
          ['Titre', evaluation.titre],
          ['Description', evaluation.description || 'N/A'],
          ['Durée', `${evaluation.duree} minutes`],
          ['Type d\'accès', evaluation.acces_type === 'libre' ? 'Libre' : 'Restreint'],
          ['Nombre de questions', evaluation.nb_questions || 0],
          [''],
          ['STATISTIQUES GÉNÉRALES'],
          [''],
          ['Nombre de participants', evaluationData.total_participants || 0],
          ['Score moyen', `${evaluationData.moyenne || 0}`],
          ['Meilleur score', `${evaluationData.meilleur_score || 0}`],
          ['Taux de réussite (≥60%)', `${evaluationData.taux_reussite || 0}%`]
        ]

        const statsSheet = XLSX.utils.aoa_to_sheet(statsData)

        // Mise en forme de la feuille statistiques
        const statsColWidths = [{ wch: 25 }, { wch: 30 }]
        statsSheet['!cols'] = statsColWidths

        XLSX.utils.book_append_sheet(workbook, statsSheet, 'Statistiques')

        // Feuille 2: Détails des participants
        if (evaluationData.participants && evaluationData.participants.length > 0) {
          const participantsData = evaluationData.participants.map(participant => ({
            'Matricule': participant.matricule,
            'Nom complet': `${participant.nom} ${participant.prenom}`,
            'Score obtenu': participant.score_obtenu,
            'Score total': participant.score_total,
            'Pourcentage': `${participant.score_pourcentage}%`,
            'Temps utilisé': this.formatTime(participant.temps_ecoule),
            'Date de completion': this.formatDate(participant.completed_at),
            'Statut': participant.score_pourcentage >= 60 ? 'Réussi' : 'Échoué'
          }))

          const participantsSheet = XLSX.utils.json_to_sheet(participantsData)

          const participantsColWidths = [
            { wch: 15 },
            { wch: 25 },
            { wch: 12 },
            { wch: 12 },
            { wch: 12 },
            { wch: 15 },
            { wch: 20 },
            { wch: 10 }
          ]
          participantsSheet['!cols'] = participantsColWidths

          XLSX.utils.book_append_sheet(workbook, participantsSheet, 'Participants')
        }

        const today = new Date().toISOString().split('T')[0]
        const filename = `evaluation_${evaluation.titre.replace(/[^a-zA-Z0-9]/g, '_')}_${today}.xlsx`
        XLSX.writeFile(workbook, filename)

        this.showAlert('success', `Export Excel réussi ! Évaluation "${evaluation.titre}" exportée.`)
      } catch (error) {
        console.error('Erreur lors de l\'export Excel de l\'évaluation:', error)
        this.showAlert('error', 'Erreur lors de l\'export Excel de l\'évaluation')
      } finally {
        this.exporting = false
      }
    },

    async exportEvaluationPDF(evaluation) {
      try {
        this.exporting = true
        this.showAlert('info', `Génération du PDF pour "${evaluation.titre}" en cours...`)

        // Charger les résultats de l'évaluation
        const response = await fetch(`${this.API_BASE_URL}?action=resultats&evaluation_id=${evaluation.id}&rand=${Math.random()}`)
        const data = await response.json()

        if (!data.success) {
          throw new Error(data.error || 'Erreur lors du chargement des données')
        }

        const evaluationData = data.data
        const { jsPDF } = await import('jspdf')
        const autoTable = (await import('jspdf-autotable')).default

        const doc = new jsPDF()
        let yPosition = 20

        // En-tête du document
        doc.setFontSize(18)
        doc.setTextColor(40, 40, 40)
        doc.text('RAPPORT D\'ÉVALUATION', 105, yPosition, { align: 'center' })
        yPosition += 10

        doc.setFontSize(14)
        doc.setTextColor(255, 140, 0)
        doc.text(evaluation.titre, 105, yPosition, { align: 'center' })
        yPosition += 15

        // Informations générales
        doc.setFontSize(12)
        doc.setTextColor(40, 40, 40)
        doc.text('INFORMATIONS GÉNÉRALES', 20, yPosition)
        yPosition += 10

        const infoData = [
          ['Durée', `${evaluation.duree} minutes`],
          ['Nombre de questions', (evaluation.nb_questions || 0).toString()],
          ['Nombre de participants', (evaluationData.total_participants || 0).toString()],
          ['Meilleur score', `${evaluationData.meilleur_score || 0}`],
          ['Taux de réussite (>=50%)', `${evaluationData.taux_reussite || 0}%`]
        ]

        autoTable(doc, {
          body: infoData,
          startY: yPosition,
          theme: 'plain',
          styles: { fontSize: 10 },
          columnStyles: {
            0: { fontStyle: 'bold', cellWidth: 40 },
            1: { cellWidth: 140 }
          }
        })

        yPosition = doc.lastAutoTable.finalY + 15

        // Statistiques
        // Participants (si il y en a)
        if (evaluationData.participants && evaluationData.participants.length > 0) {
          // Nouvelle page si nécessaire
          if (yPosition > 250) {
            doc.addPage()
            yPosition = 20
          }

          doc.setFontSize(12)
          doc.text('DÉTAILS DES PARTICIPANTS', 20, yPosition)
          yPosition += 10

          const participantsTableData = evaluationData.participants.map(participant => [
            participant.matricule,
            `${participant.nom} ${participant.prenom}`,
            `${participant.score_obtenu}/${participant.score_total}`,
            `${participant.score_pourcentage}%`,
            this.formatTime(participant.temps_ecoule),
            participant.score_pourcentage >= 60 ? 'Réussi' : 'Échoué'
          ])

          autoTable(doc, {
            head: [['Matricule', 'Nom', 'Score', '%', 'Temps', 'Statut']],
            body: participantsTableData,
            startY: yPosition,
            styles: { fontSize: 8, cellPadding: 2 },
            headStyles: {
              fillColor: [255, 140, 0],
              textColor: 255,
              fontStyle: 'bold'
            },
            alternateRowStyles: { fillColor: [248, 249, 250] },
            columnStyles: {
              0: { cellWidth: 25 },
              1: { cellWidth: 45 },
              2: { cellWidth: 20 },
              3: { cellWidth: 15 },
              4: { cellWidth: 20 },
              5: { cellWidth: 20 }
            }
          })
        }

        // Pied de page avec date de génération
        const pageCount = doc.internal.getNumberOfPages()
        for (let i = 1; i <= pageCount; i++) {
          doc.setPage(i)
          doc.setFontSize(8)
          doc.setTextColor(100, 100, 100)
          const today = new Date().toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })
          doc.text(`Généré le ${today} - Page ${i}/${pageCount}`, 105, 290, { align: 'center' })
        }

        const filename = `rapport_${evaluation.titre.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`
        doc.save(filename)

        this.showAlert('success', `Export PDF réussi ! Rapport de "${evaluation.titre}" généré.`)
      } catch (error) {
        console.error('Erreur lors de l\'export PDF de l\'évaluation:', error)
        this.showAlert('error', 'Erreur lors de l\'export PDF de l\'évaluation')
      } finally {
        this.exporting = false
      }
    },

    getStatutClass(statut) {
      switch (statut) {
        case 'active':
          return 'status-in' // green
        case 'terminee':
          return 'status-out' // gray
        case 'brouillon':
          return 'status-low' // yellow
        default:
          return 'status-out' // gray
      }
    },

    getStatutLabel(statut) {
      switch (statut) {
        case 'active':
          return 'Active'
        case 'terminee':
          return 'Terminée'
        case 'brouillon':
          return 'Brouillon'
        default:
          return statut
      }
    },

    getScoreClass(pourcentage) {
      pourcentage = parseFloat(pourcentage)
      if (pourcentage >= 80) return 'status-in' // green
      if (pourcentage >= 60) return 'status-low' // yellow
      if (pourcentage >= 40) return 'status-orange' // orange
      return 'status-out' // red
    },

    formatTime(seconds) {
      if (!seconds) return 'N/A'
      const minutes = Math.floor(seconds / 60)
      const remainingSeconds = seconds % 60
      return `${minutes}min ${remainingSeconds}s`
    },

    formatDate(dateString) {
      if (!dateString) return 'N/A'
      const date = new Date(dateString)
      return date.toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    },

    showAlert(type, message, duration = 3000) {
      if (this.alert.timeout) {
        clearTimeout(this.alert.timeout);
      }
      this.alert = {
        show: true,
        type,
        message,
        timeout: setTimeout(() => {
          this.hideToast();
        }, duration)
      };
    },
    hideToast() {
      this.alert.show = false;
      if (this.alert.timeout) {
        clearTimeout(this.alert.timeout);
        this.alert.timeout = null;
      }
    }
  }
}
</script>

<style scoped>
@keyframes blob {
  0% {
    transform: translate(0px, 0px) scale(1);
  }

  33% {
    transform: translate(30px, -50px) scale(1.1);
  }

  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }

  100% {
    transform: translate(0px, 0px) scale(1);
  }
}

.animate-blob {
  animation: blob 7s infinite;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}

.dashboard {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f8f9fa;
  position: relative; /* Added for blob animations */
  overflow: hidden; /* Added for blob animations */
}

/* Main Content Styles */
.main-content {
  flex: 1;
  padding: 1.5rem;
  display: flex;
  justify-content: center;
  position: relative; /* Added for z-index */
  z-index: 10; /* Added for z-index */
}

.overview-section {
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  width: 90%;
  max-width: 1400px;
}

/* Header Styles */
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

.add-product-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #f97316; /* Orange-600 */
  color: white;
  border: none;
  border-radius: 9999px;
  padding: 0.5rem 1.25rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.add-product-button:hover {
  background-color: #ea580c; /* Orange-700 */
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
  background-color: #ffedd5; /* Orange-100 */
  color: #f97316; /* Orange-600 */
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-icon.warning {
  background-color: #fef3c7; /* Yellow-100 */
  color: #d97706; /* Amber-600 */
}

.stat-icon.danger {
  background-color: #fee2e2; /* Red-100 */
  color: #ef4444; /* Red-600 */
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
  color: #111827;
  background-color: white;
}

.filter-options {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.filter-options select,
.filter-options input[type="date"] {
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

.table-cell {
  flex: 1;
  padding: 0 0.5rem;
  display: flex;
  align-items: center;
}

.actions-cell {
  flex: 0 0 200px; /* Adjusted width for more buttons */
  justify-content: flex-end;
  gap: 0.5rem;
}

button {
    padding: 2px;
    font-size: 1em;
    font-weight: 500;
    font-family: inherit;
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
  color: #d97706;
}

.status-out {
  background-color: #fee2e2;
  color: #ef4444;
}

.status-blue {
  background-color: #dbeafe;
  color: #3b82f6;
}

.status-orange {
  background-color: #ffedd5;
  color: #f97316;
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

.action-icon.view-button {
  background-color: rgba(249, 115, 22, 0.1) !important; /* Orange-600 with opacity */
  color: #f97316 !important; /* Orange-600 */
}

.action-icon.view-button:hover {
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
  display: flex;
  align-items: center;
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

/* Product Image Upload (for QR Code modal) */
.product-image-upload {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
  justify-content: center; /* Center content */
  align-items: center; /* Center content vertically */
}

.product-image-preview {
  width: 200px; /* Adjusted for QR code size */
  height: 200px; /* Adjusted for QR code size */
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
  border-color: #f97316; /* Orange-600 */
  box-shadow: 0 0 0 2px rgba(249, 115, 22, 0.25); /* Orange-600 with opacity */
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
  background-color: #10b981; /* Green-600 */
  border: 1px solid #10b981;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s;
}

.save-button:hover {
  background-color: #059669; /* Green-700 */
  border-color: #059669;
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

/* View Modal Specific Styles (for Results Modal) */
.view-modal {
  max-width: 1300px;
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

.meta-value.price {
  font-size: 1.125rem;
  color: #f97316; /* Orange-600 */
  font-weight: 600;
}


.product-view-tabs {
  display: flex;
  gap: 0.5rem;
  border-bottom: 1px solid #f1f1f4;
  margin-bottom: 1.5rem;
}

.view-tab {
  background: none;
  border: none;
  padding: 0.75rem 1.25rem;
  font-size: 0.875rem;
  color: #6b7280;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all 0.2s;
}

.view-tab:hover {
  color: #111827;
}

.buttt {
  padding: 2px;
}

.view-tab.active {
  color: #f97316; /* Orange-600 */
  border-bottom-color: #f97316;
  font-weight: 500;
}

.view-tab-content {
  padding: 0.5rem 0;
}

.content-section {
  margin-bottom: 2rem;
}

.section-title {
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 1rem;
}

.description-text {
  font-size: 0.875rem;
  color: #4b5563;
  line-height: 1.5;
}

.details-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.25rem 2rem;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.detail-label {
  font-size: 0.75rem;
  color: #6b7280;
}

.detail-value {
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

.edit-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: white;
  background-color: #f97316; /* Orange-600 */
  border: 1px solid #f97316;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s;
}

.edit-button:hover {
  background-color: #ea580c; /* Orange-700 */
  border-color: #ea580c;
}

/* Responsive Adjustments */
@media (max-width: 768px) {
  .desktop-only {
    display: none !important;
  }
  .mobile-only {
    display: block !important;
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
  .search-filters {
    flex-direction: column;
    padding: 1rem;
  }
  .filter-options {
    width: 100%;
    flex-direction: column;
    gap: 0.5rem;
  }
  .filter-options select,
  .filter-options input[type="date"] {
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
  .upload-button {
    width: 100%;
    justify-content: center;
  }
  .form-row {
    flex-direction: column;
    gap: 1rem;
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
  color: #f97316; /* Orange-600 */
}

.product-card-mobile .card-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  border-top: 1px solid #f1f1f4;
  padding-top: 0.75rem;
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
  background-color: #dbeafe;
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
}

.operation-vente {
  display: inline-block;
  color: #d97706;
  background-color: #fef3c7;
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
  background-color: #f97316; /* Orange-600 */
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
  background-color: #ea580c; /* Orange-700 */
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
  background-color: #f97316; /* Orange-600 */
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
  background-color: #f9fafb;
}

.history-table tr:last-child td {
  border-bottom: none;
}

.history-table tr:hover {
  background-color: #f9fafb;
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

/* Mobile-specific display classes */
.mobile-only {
  display: none;
}

</style>
