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
                  <svg class="w-6 h-6 lg:w-8 lg:h-8 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2v0a2 2 0 01-2 2H8a2 2 0 01-2-2v0a2 2 0 01-2-2V9a2 2 0 012-2h2z" />
                  </svg>
                  Gestion des Convois SENAFOI 25
                </h1>
                <p class="overview-date">Organisation du transport - {{ currentDateFormatted }}</p>
              </div>
            </div>
            <div class="header-actions-right">
              <button @click="exportConvoiReport()" class="export-button green-button">
                <svg class="w-4 h-4 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Rapport Excel</span>
              </button>
              <button @click="exportConvoiPDF()" class="export-button red-button">
                <svg class="w-4 h-4 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <span>Liste PDF</span>
              </button>
            </div>
          </div>
          
          <!-- Statistiques -->
          <div class="product-stats">
            <div class="stat-card">
              <div class="stat-icon stat-icon-blue">
                <svg class="w-5 h-5 lg:w-6 lg:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div class="stat-info">
                <div class="stat-value">{{ totalSeminarists }}</div>
                <div class="stat-label">Total Séminaristes</div>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon stat-icon-green">
                <svg class="w-5 h-5 lg:w-6 lg:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2v0a2 2 0 01-2 2H8a2 2 0 01-2-2v0a2 2 0 01-2-2V9a2 2 0 012-2h2z" />
                </svg>
              </div>
              <div class="stat-info">
                <div class="stat-value">{{ seminaristsWithAssignedCar }}</div>
                <div class="stat-label">Cars Assignés</div>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon stat-icon-orange">
                <svg class="w-5 h-5 lg:w-6 lg:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div class="stat-info">
                <div class="stat-value">{{ seminaristsWithoutAssignedCar }}</div>
                <div class="stat-label">Sans Assignation</div>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon stat-icon-purple">
                <svg class="w-5 h-5 lg:w-6 lg:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h4a1 1 0 011 1v5m-6 0V9a1 1 0 011-1h4a1 1 0 011 1v11" />
                </svg>
              </div>
              <div class="stat-info">
                <div class="stat-value">{{ availableCars.length }}</div>
                <div class="stat-label">Cars Disponibles</div>
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
              <input v-model="filters.search" @input="applyFilters" type="text" placeholder="Rechercher par nom, matricule...">
            </div>
            <div class="filter-options">
              <select v-model="filters.car_filter" @change="applyFilters">
                <option value="">Tous les cars</option>
                <option v-for="car in availableCars" :key="car.id" :value="car.id">{{ car.name }}</option>
                <option value="Non assigné">Non assigné</option>
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
          
          <!-- Section de recherche avec QR Scanner -->
          <div class="quick-search-section">
            <div class="quick-search-card">
              <div class="card-header">
                <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                </svg>
                <h3>Scanner QR Code ou Recherche Manuelle</h3>
              </div>
              <div class="search-form">
                <div class="search-input-group">
                  <input
                    v-model="matriculeInput"
                    @keyup.enter="handleLookup"
                    type="text"
                    placeholder="Scanner QR code ou entrer le matricule"
                    class="search-input"
                  />
                  <button @click="startQRScanner" class="qr-button" :class="{ 'active': showQRScanner }">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                    </svg>
                    {{ showQRScanner ? 'Arrêter' : 'Scanner QR' }}
                  </button>
                  <button @click="handleLookup" class="search-button">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    Rechercher
                  </button>
                </div>
                
                <!-- QR Scanner -->
                <div v-if="showQRScanner" class="qr-scanner-container">
                  <div class="qr-scanner-header">
                    <h4>Scanner le QR Code du séminariste</h4>
                    <button @click="stopQRScanner" class="close-scanner">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <div class="qr-scanner-video">
                    <video ref="qrVideo" autoplay playsinline class="qr-video"></video>
                    <div class="qr-overlay">
                      <div class="qr-frame"></div>
                    </div>
                  </div>
                  <p class="qr-instructions">Placez le QR code dans le cadre pour le scanner</p>
                </div>
              </div>
              
              <!-- Résultat de la recherche -->
              <div v-if="seminaristInfo" class="seminarist-result-card" :class="seminaristInfo.type">
                <div class="result-header">
                  <div class="result-icon">
                    <svg v-if="seminaristInfo.type === 'success'" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <svg v-else-if="seminaristInfo.type === 'error'" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div class="result-content">
                    <p class="result-message">{{ seminaristInfo.message }}</p>
                    <div v-if="seminaristInfo.seminarist" class="seminarist-details">
                      <div class="seminarist-profile">
                        <img :src="seminaristInfo.seminarist.photo" alt="Photo" class="profile-photo" />
                        <div class="profile-info">
                          <h4 class="profile-name">{{ seminaristInfo.seminarist.name }}</h4>
                          <p class="profile-matricule">Matricule: {{ seminaristInfo.seminarist.matricule }}</p>
                          <p class="profile-car">Car actuel: <strong>{{ getCarName(seminaristInfo.seminarist.assignedCar) }}</strong></p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <!-- Modification du car -->
                <div v-if="seminaristInfo.seminarist && seminaristInfo.type !== 'error'" class="car-modification-form">
                  <h5>Modifier l'assignation du car</h5>
                  <div class="modification-controls">
                    <select v-model="newCarId" class="car-select">
                      <option value="">Sélectionner un car</option>
                      <option v-for="car in availableCars" :key="car.id" :value="car.id">
                        {{ car.name }}
                      </option>
                      <option value="Non assigné">Non assigné</option>
                    </select>
                    <button
                      @click="modifyCar"
                      :disabled="!newCarId || newCarId === seminaristInfo.seminarist.assignedCar"
                      class="modify-button"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0V7a2 2 0 012-2h4a2 2 0 012 2v0M8 7v8a2 2 0 002 2h4a2 2 0 002-2V7m-6 0h6" />
                      </svg>
                      Modifier
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Liste des convois -->
          <div class="convois-section">
            <div class="section-header">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2v0a2 2 0 01-2 2H8a2 2 0 01-2-2v0a2 2 0 01-2-2V9a2 2 0 012-2h2z" />
              </svg>
              <h2 class="section-title">Liste des Convois</h2>
            </div>
            
            <div v-if="loadingSeminarists" class="loading-indicator">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-loader-2">
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
              Chargement des données...
            </div>
            
            <div v-else-if="Object.keys(carOccupancyBreakdown).length === 0" class="no-data">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-bus">
                <path d="M8 6v6h8V6" />
                <path d="M15 18H9" />
                <path d="M21 4H3a1 1 0 0 0-1 1v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V5a1 1 0 0 0-1-1Z" />
                <circle cx="7" cy="18" r="2" />
                <circle cx="17" cy="18" r="2" />
              </svg>
              <p>Aucun convoi trouvé</p>
            </div>
            
            <div v-else class="convois-grid">
              <div
                v-for="(data, carId) in carOccupancyBreakdown"
                :key="carId"
                class="convoi-card"
                @click="openSeminaristsInCarModal(carId, data.seminarists)"
              >
                <div class="convoi-header">
                  <div class="convoi-icon" :class="getCarIconClass(carId)">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 6v6h8V6M15 18H9m6-14H3a1 1 0 00-1 1v10a2 2 0 002 2h16a2 2 0 002-2V5a1 1 0 00-1-1zM7 18a2 2 0 11-4 0 2 2 0 014 0zm10 0a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div class="convoi-info">
                    <h4 class="convoi-name">{{ getCarName(carId) }}</h4>
                    <p class="convoi-count">{{ data.seminarists.length }} séminaristes</p>
                  </div>
                </div>
                <div class="convoi-progress">
                  <div class="progress-bar">
                    <div class="progress-fill" :style="{ width: getProgressWidth(data.seminarists.length) + '%' }"></div>
                  </div>
                  <span class="progress-text">{{ getCapacityText(data.seminarists.length) }}</span>
                </div>
                <div class="convoi-actions">
                  <button class="view-details-btn">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    Voir détails
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Pagination -->
          <div class="pagination">
            <div class="pagination-info">
              Affichage de {{ pagination.from || 0 }} à {{ pagination.to || 0 }} sur {{ pagination.total || 0 }} séminaristes
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
        </div>
      </main>
      
      <!-- Modal pour la liste des séminaristes dans un car -->
      <div v-if="showSeminaristsInCarModal" class="modal" @click.self="closeSeminaristsInCarModal">
        <div class="modal-content view-modal">
          <div class="modal-header">
            <h2>Séminaristes du {{ getCarName(selectedCarForModal.carId) }}</h2>
            <button @click="closeSeminaristsInCarModal" class="close-button">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          <div class="modal-body">
            <div v-if="selectedCarForModal.seminarists.length === 0" class="no-items">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-users">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              <p>Aucun séminariste assigné à ce convoi</p>
            </div>
            <div v-else class="seminarists-grid">
              <div v-for="seminarist in selectedCarForModal.seminarists" :key="seminarist.matricule" class="seminarist-card">
                <img :src="seminarist.photo" alt="Photo" class="seminarist-photo" />
                <div class="seminarist-info">
                  <h4 class="seminarist-name">{{ seminarist.name }}</h4>
                  <p class="seminarist-id">{{ seminarist.matricule }}</p>
                </div>
                <button @click="selectSeminaristForModification(seminarist)" class="modify-assignment-btn">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button @click="exportCarList(selectedCarForModal.carId)" class="save-button download-button-purple">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Exporter Liste</span>
            </button>
            <button @click="closeSeminaristsInCarModal" class="cancel-button">Fermer</button>
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
  import { ref, computed, onMounted, watch, onBeforeUnmount } from 'vue';
  
  // API Base URL for seminarists
  const API_BASE_URL_SEMINARISTES_LIST = 'https://sogetrag.com/api/seminaire_list_api.php';
  
  // Reactive states
  const seminarists = ref([]);
  const loadingSeminarists = ref(false);
  const selectedDate = ref(new Date().toISOString().split('T')[0]);
  const matriculeInput = ref('');
  const seminaristInfo = ref(null);
  const newCarId = ref('');
  const carAssignments = ref({});
  const showSeminaristsInCarModal = ref(false);
  const selectedCarForModal = ref({ carId: '', seminarists: [] });
  
  // QR Scanner states
  const showQRScanner = ref(false);
  const qrVideo = ref(null);
  const qrStream = ref(null);
  const qrCodeReader = ref(null);
  
  // Filters and pagination
  const filters = ref({
    search: '',
    car_filter: ''
  });
  
  const pagination = ref({
    current_page: 1,
    last_page: 1,
    per_page: 25,
    total: 0,
    from: 0,
    to: 0
  });
  
  // Available cars
  const availableCars = ref([
    { id: 'CAR_01', name: 'Car 1', capacity: 60 },
    { id: 'CAR_02', name: 'Car 2', capacity: 60 },
    { id: 'CAR_03', name: 'Car 3', capacity: 60 },
    { id: 'CAR_04', name: 'Car 4', capacity: 60 },
    { id: 'CAR_05', name: 'Car 5', capacity: 60 }
  ]);
  
  // Toast notifications
  const alert = ref({
    show: false,
    type: 'success',
    message: ''
  });
  
  // Load data on mount
  onMounted(async () => {
    const storedAssignments = localStorage.getItem('convoiCarAssignments');
    if (storedAssignments) {
      carAssignments.value = JSON.parse(storedAssignments);
    }
    await loadSeminarists();
    
    // Initialize QR code reader
    if (typeof window !== 'undefined') {
      try {
        const { BrowserQRCodeReader } = await import('@zxing/library');
        qrCodeReader.value = new BrowserQRCodeReader();
      } catch (error) {
        console.warn('QR Code reader not available:', error);
      }
    }
  });
  
  // Cleanup on unmount
  onBeforeUnmount(() => {
    stopQRScanner();
  });
  
  // Save car assignments to localStorage
  watch(carAssignments, (newAssignments) => {
    localStorage.setItem('convoiCarAssignments', JSON.stringify(newAssignments));
  }, { deep: true });
  
  // Computed properties
  const currentDateFormatted = computed(() => {
    const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(selectedDate.value).toLocaleDateString('fr-FR', options);
  });
  
  const totalSeminarists = computed(() => seminarists.value.length);
  
  const seminaristsWithAssignedCar = computed(() => {
    return seminarists.value.filter(s => s.assignedCar && s.assignedCar !== 'Non assigné').length;
  });
  
  const seminaristsWithoutAssignedCar = computed(() => {
    return totalSeminarists.value - seminaristsWithAssignedCar.value;
  });
  
  const filteredSeminarists = computed(() => {
    let filtered = [...seminarists.value];
    
    if (filters.value.search) {
      const search = filters.value.search.toLowerCase();
      filtered = filtered.filter(s => 
        s.name.toLowerCase().includes(search) ||
        s.matricule.toLowerCase().includes(search)
      );
    }
    
    if (filters.value.car_filter) {
      filtered = filtered.filter(s => s.assignedCar === filters.value.car_filter);
    }
    
    return filtered;
  });
  
  const carOccupancyBreakdown = computed(() => {
    const breakdown = {};
    
    // Initialize with all available cars
    availableCars.value.forEach(car => {
      breakdown[car.id] = { seminarists: [] };
    });
    
    // Add unassigned category
    breakdown['Non assigné'] = { seminarists: [] };
    
    filteredSeminarists.value.forEach(s => {
      const assignedCarId = s.assignedCar || 'Non assigné';
      if (!breakdown[assignedCarId]) {
        breakdown[assignedCarId] = { seminarists: [] };
      }
      breakdown[assignedCarId].seminarists.push(s);
    });
    
    return breakdown;
  });
  
  // Methods
  const loadSeminarists = async () => {
    loadingSeminarists.value = true;
    try {
      const url = `${API_BASE_URL_SEMINARISTES_LIST}?action=list_seminairistes&page=1&per_page=1000&rand=${Math.random()}`;
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.success && data.data) {
        seminarists.value = data.data.map(s => {
          // Utiliser car_transport de l'API ou l'assignation stockée
          const assignedCarId = carAssignments.value[s.matricule_seminaire] || s.car_transport || 'Non assigné';
          return {
            matricule: s.matricule_seminaire, // Utiliser matricule_seminaire
            name: `${s.prenom} ${s.nom}`,
            photo: s.photo || `/placeholder.svg?height=80&width=80`, // Utiliser la photo de l'API
            assignedCar: assignedCarId
          };
        });
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
      loadingSeminarists.value = false;
    }
  };
  
  const getCarName = (carId) => {
    if (carId === 'Non assigné') return 'Non assigné';
    const car = availableCars.value.find(c => c.id === carId);
    return car ? car.name : carId;
  };
  
  const getCarIconClass = (carId) => {
    if (carId === 'Non assigné') return 'convoi-icon-gray';
    const colors = ['convoi-icon-blue', 'convoi-icon-green', 'convoi-icon-purple', 'convoi-icon-orange', 'convoi-icon-red'];
    const index = availableCars.value.findIndex(c => c.id === carId);
    return colors[index % colors.length] || 'convoi-icon-blue';
  };
  
  const getProgressWidth = (count) => {
    const car = availableCars.value.find(c => c.id === selectedCarForModal.value.carId);
    const capacity = car ? car.capacity : 60;
    return Math.min((count / capacity) * 100, 100);
  };
  
  const getCapacityText = (count) => {
    const car = availableCars.value.find(c => c.id === selectedCarForModal.value.carId);
    const capacity = car ? car.capacity : 60;
    return `${count}/${capacity}`;
  };
  
  // QR Scanner methods
  const startQRScanner = async () => {
    if (!qrCodeReader.value) {
      showAlert('error', 'Scanner QR non disponible');
      return;
    }
    
    try {
      showQRScanner.value = true;
      await new Promise(resolve => setTimeout(resolve, 100)); // Wait for DOM update
      
      qrStream.value = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      
      if (qrVideo.value) {
        qrVideo.value.srcObject = qrStream.value;
        
        // Start scanning
        qrCodeReader.value.decodeFromVideoDevice(undefined, qrVideo.value, (result, error) => {
          if (result) {
            const scannedText = result.getText();
            // Extract matricule from QR code (assuming it contains the matricule)
            const matriculeMatch = scannedText.match(/SEM\d+/);
            if (matriculeMatch) {
              matriculeInput.value = matriculeMatch[0];
              handleLookup();
              stopQRScanner();
            } else {
              // If no matricule pattern found, use the whole text
              matriculeInput.value = scannedText;
              handleLookup();
              stopQRScanner();
            }
          }
        });
      }
    } catch (error) {
      console.error('Error starting QR scanner:', error);
      showAlert('error', 'Erreur lors de l\'accès à la caméra');
      stopQRScanner();
    }
  };
  
  const stopQRScanner = () => {
    showQRScanner.value = false;
    
    if (qrStream.value) {
      qrStream.value.getTracks().forEach(track => track.stop());
      qrStream.value = null;
    }
    
    if (qrCodeReader.value) {
      qrCodeReader.value.reset();
    }
  };
  
  const handleLookup = () => {
    const matricule = matriculeInput.value.trim();
    if (!matricule) {
      seminaristInfo.value = { type: 'info', message: 'Veuillez entrer un matricule ou scanner un code QR.' };
      return;
    }
  
    // Rechercher par matricule au lieu de l'id
    const seminarist = seminarists.value.find(s => String(s.matricule) === String(matricule));
  
    if (!seminarist) {
      seminaristInfo.value = {
        type: 'error',
        message: `Séminariste avec le matricule "${matricule}" non trouvé.`,
        seminarist: null
      };
      showAlert('error', `Séminariste "${matricule}" non trouvé.`);
      return;
    }
  
    seminaristInfo.value = {
      type: 'success',
      message: `Séminariste trouvé avec succès.`,
      seminarist: seminarist
    };
    newCarId.value = seminarist.assignedCar || '';
    showAlert('success', `Séminariste ${seminarist.name} trouvé.`);
  };
  
  const modifyCar = () => {
    if (!seminaristInfo.value || !seminaristInfo.value.seminarist || !newCarId.value) {
      showAlert('error', 'Aucun séminariste sélectionné ou nouveau car non choisi.');
      return;
    }
  
    const seminaristMatricule = seminaristInfo.value.seminarist.matricule;
    const oldCarId = seminaristInfo.value.seminarist.assignedCar;
    const newCar = newCarId.value;
  
    if (oldCarId === newCar) {
      showAlert('info', 'Le car sélectionné est le même que le car actuel.');
      return;
    }
  
    // Update local storage avec le matricule
    carAssignments.value = {
      ...carAssignments.value,
      [seminaristMatricule]: newCar
    };
  
    // Update the seminarists ref
    const index = seminarists.value.findIndex(s => String(s.matricule) === String(seminaristMatricule));
    if (index !== -1) {
      seminarists.value[index].assignedCar = newCar;
    }
  
    seminaristInfo.value.seminarist.assignedCar = newCar;
    seminaristInfo.value.type = 'success';
    seminaristInfo.value.message = `Car mis à jour de ${getCarName(oldCarId) || 'Non assigné'} à ${getCarName(newCar)}.`;
    showAlert('success', `Car de ${seminaristInfo.value.seminarist.name} mis à jour.`);
  };
  
  const openSeminaristsInCarModal = (carId, seminaristsList) => {
    selectedCarForModal.value = { carId: carId, seminarists: seminaristsList };
    showSeminaristsInCarModal.value = true;
    document.body.style.overflow = 'hidden';
  };
  
  const closeSeminaristsInCarModal = () => {
    showSeminaristsInCarModal.value = false;
    selectedCarForModal.value = { carId: '', seminarists: [] };
    document.body.style.overflow = 'auto';
  };
  
  const selectSeminaristForModification = (seminarist) => {
    matriculeInput.value = seminarist.matricule; // Utiliser matricule
    closeSeminaristsInCarModal();
    handleLookup();
  };
  
  const exportCarList = async (carId) => {
    try {
      const carData = carOccupancyBreakdown.value[carId];
      if (!carData || carData.seminarists.length === 0) {
        showAlert('error', 'Aucune donnée à exporter pour ce car.');
        return;
      }
  
      const { jsPDF } = await import('jspdf');
      const autoTable = (await import('jspdf-autotable')).default;
      const doc = new jsPDF();
  
      // En-tête
      doc.setFontSize(20);
      doc.setTextColor(40, 40, 40);
      doc.text(`LISTE - ${getCarName(carId)}`, 105, 20, { align: 'center' });
  
      // Date
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      const today = new Date().toLocaleDateString('fr-FR');
      doc.text(`Généré le ${today}`, 105, 30, { align: 'center' });
  
      // Tableau
      const tableData = carData.seminarists.map((s, index) => [
        index + 1,
        s.name,
        s.matricule // Utiliser matricule
      ]);
  
      autoTable(doc, {
        head: [['N°', 'Nom Complet', 'Matricule']],
        body: tableData,
        startY: 40,
        styles: {
          fontSize: 10,
          cellPadding: 3
        },
        headStyles: {
          fillColor: [59, 130, 246],
          textColor: 255,
          fontStyle: 'bold'
        },
        alternateRowStyles: {
          fillColor: [248, 249, 250]
        }
      });
  
      const filename = `liste_${getCarName(carId).replace(/\s+/g, '_')}_${today.replace(/\//g, '-')}.pdf`;
      doc.save(filename);
      showAlert('success', 'Liste exportée avec succès !');
    } catch (error) {
      console.error('Erreur lors de l\'export:', error);
      showAlert('error', 'Erreur lors de l\'export.');
    }
  };
  
  const exportConvoiReport = async () => {
    try {
      showAlert('info', 'Génération du rapport Excel en cours...');
      
      const data = [];
      Object.keys(carOccupancyBreakdown.value).forEach(carId => {
        const carData = carOccupancyBreakdown.value[carId];
        carData.seminarists.forEach(s => {
          data.push({
            'Car': getCarName(carId),
            'Nom Complet': s.name,
            'Matricule': s.matricule // Utiliser matricule
          });
        });
      });
  
      if (data.length === 0) {
        showAlert('error', 'Aucune donnée à exporter.');
        return;
      }
  
      const XLSX = await import('xlsx');
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(data);
      
      const colWidths = [
        { wch: 25 }, { wch: 30 }, { wch: 15 }
      ];
      worksheet['!cols'] = colWidths;
      
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Convois');
      
      const today = new Date().toISOString().split('T')[0];
      const filename = `convois_senafoi25_${today}.xlsx`;
      XLSX.writeFile(workbook, filename);
      
      showAlert('success', `Export Excel réussi ! ${data.length} assignations exportées.`);
    } catch (error) {
      console.error('Erreur lors de l\'export Excel:', error);
      showAlert('error', 'Erreur lors de l\'export Excel.');
    }
  };
  
  const exportConvoiPDF = async () => {
    try {
      showAlert('info', 'Génération du rapport PDF en cours...');
      
      const { jsPDF } = await import('jspdf');
      const autoTable = (await import('jspdf-autotable')).default;
      const doc = new jsPDF('landscape');
  
      // En-tête
      doc.setFontSize(20);
      doc.setTextColor(40, 40, 40);
      doc.text('RAPPORT CONVOIS SENAFOI 25', 148, 20, { align: 'center' });
  
      // Date
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      const today = new Date().toLocaleDateString('fr-FR');
      doc.text(`Généré le ${today}`, 148, 30, { align: 'center' });
  
      // Tableau
      const tableData = [];
      Object.keys(carOccupancyBreakdown.value).forEach(carId => {
        const carData = carOccupancyBreakdown.value[carId];
        carData.seminarists.forEach(s => {
          tableData.push([
            getCarName(carId),
            s.name,
            s.matricule // Utiliser matricule
          ]);
        });
      });
  
      autoTable(doc, {
        head: [['Car', 'Nom Complet', 'Matricule']],
        body: tableData,
        startY: 40,
        styles: {
          fontSize: 8,
          cellPadding: 2
        },
        headStyles: {
          fillColor: [59, 130, 246],
          textColor: 255,
          fontStyle: 'bold'
        },
        alternateRowStyles: {
          fillColor: [248, 249, 250]
        }
      });
  
      const filename = `rapport_convois_senafoi25_${today.replace(/\//g, '-')}.pdf`;
      doc.save(filename);
      showAlert('success', `Export PDF réussi ! ${tableData.length} assignations exportées.`);
    } catch (error) {
      console.error('Erreur lors de l\'export PDF:', error);
      showAlert('error', 'Erreur lors de l\'export PDF.');
    }
  };
  
  const applyFilters = () => {
    pagination.value.current_page = 1;
  };
  
  const resetFilters = () => {
    filters.value = {
      search: '',
      car_filter: ''
    };
    matriculeInput.value = '';
    seminaristInfo.value = null;
    newCarId.value = '';
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
  
  // Watch for matriculeInput changes
  watch(matriculeInput, (newValue) => {
    if (!newValue) {
      seminaristInfo.value = null;
      newCarId.value = '';
    }
  });
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
  
  .stat-icon-blue {
    background-color: #dbeafe;
    color: #3b82f6;
  }
  
  .stat-icon-green {
    background-color: #d1fae5;
    color: #10b981;
  }
  
  .stat-icon-orange {
    background-color: #fff7ed;
    color: #f97316;
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
    flex-direction: column;
    gap: 1rem;
  }
  
  .search-input-group {
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
  
  .qr-button {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background-color: #f3f4f6;
    color: #374151;
    border: 1px solid #d1d5db;
    border-radius: 0.5rem;
    padding: 0.75rem 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .qr-button:hover {
    background-color: #e5e7eb;
  }
  
  .qr-button.active {
    background-color: #3b82f6;
    color: white;
    border-color: #3b82f6;
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
  
  /* QR Scanner */
  .qr-scanner-container {
    background-color: white;
    border-radius: 0.5rem;
    padding: 1rem;
    border: 1px solid #e2e8f0;
  }
  
  .qr-scanner-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }
  
  .qr-scanner-header h4 {
    font-size: 1rem;
    font-weight: 600;
    color: #1e293b;
    margin: 0;
  }
  
  .close-scanner {
    background: none;
    border: none;
    color: #6b7280;
    cursor: pointer;
    padding: 0.25rem;
    border-radius: 0.25rem;
    transition: all 0.2s;
  }
  
  .close-scanner:hover {
    background-color: #f3f4f6;
    color: #374151;
  }
  
  .qr-scanner-video {
    position: relative;
    width: 100%;
    max-width: 400px;
    margin: 0 auto;
    border-radius: 0.5rem;
    overflow: hidden;
  }
  
  .qr-video {
    width: 100%;
    height: 300px;
    object-fit: cover;
    background-color: #000;
  }
  
  .qr-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .qr-frame {
    width: 200px;
    height: 200px;
    border: 2px solid #3b82f6;
    border-radius: 0.5rem;
    background: transparent;
    position: relative;
  }
  
  .qr-frame::before,
  .qr-frame::after {
    content: '';
    position: absolute;
    width: 20px;
    height: 20px;
    border: 3px solid #3b82f6;
  }
  
  .qr-frame::before {
    top: -3px;
    left: -3px;
    border-right: none;
    border-bottom: none;
  }
  
  .qr-frame::after {
    bottom: -3px;
    right: -3px;
    border-left: none;
    border-top: none;
  }
  
  .qr-instructions {
    text-align: center;
    color: #6b7280;
    font-size: 0.875rem;
    margin-top: 1rem;
    margin-bottom: 0;
  }
  
  /* Seminarist Result Card */
  .seminarist-result-card {
    background-color: white;
    border-radius: 0.5rem;
    padding: 1.5rem;
    border: 1px solid;
    margin-top: 1rem;
  }
  
  .seminarist-result-card.success {
    border-color: #10b981;
    background-color: #f0fdf4;
  }
  
  .seminarist-result-card.error {
    border-color: #ef4444;
    background-color: #fef2f2;
  }
  
  .seminarist-result-card.info {
    border-color: #3b82f6;
    background-color: #eff6ff;
  }
  
  .result-header {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
  }
  
  .result-icon {
    flex-shrink: 0;
  }
  
  .seminarist-result-card.success .result-icon {
    color: #10b981;
  }
  
  .seminarist-result-card.error .result-icon {
    color: #ef4444;
  }
  
  .seminarist-result-card.info .result-icon {
    color: #3b82f6;
  }
  
  .result-content {
    flex: 1;
  }
  
  .result-message {
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: #1e293b;
  }
  
  .seminarist-details {
    margin-top: 1rem;
  }
  
  .seminarist-profile {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    background-color: white;
    border-radius: 0.5rem;
    border: 1px solid #e2e8f0;
  }
  
  .profile-photo {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid #e2e8f0;
  }
  
  .profile-info {
    flex: 1;
  }
  
  .profile-name {
    font-size: 1.125rem;
    font-weight: 600;
    color: #1e293b;
    margin: 0 0 0.25rem;
  }
  
  .profile-matricule,
  .profile-car {
    font-size: 0.875rem;
    color: #64748b;
    margin: 0.125rem 0;
  }
  
  /* Car Modification Form */
  .car-modification-form {
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid #e2e8f0;
  }
  
  .car-modification-form h5 {
    font-size: 1rem;
    font-weight: 600;
    color: #1e293b;
    margin: 0 0 1rem;
  }
  
  .modification-controls {
    display: flex;
    gap: 0.75rem;
    align-items: center;
  }
  
  .car-select {
    flex: 1;
    padding: 0.5rem 0.75rem;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    color: #111827;
    background-color: white;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 0.5rem center;
    appearance: none;
  }
  
  .modify-button {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background-color: #3b82f6;
    color: white;
    border: none;
    border-radius: 0.375rem;
    padding: 0.625rem 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s;
    flex-shrink: 0;
  }
  
  .modify-button:hover:not(:disabled) {
    background-color: #2563eb;
  }
  
  .modify-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  /* Convois Section */
  .convois-section {
    padding: 1.5rem 2rem;
    border-bottom: 1px solid #f1f1f4;
  }
  
  .section-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 1.5rem;
  }
  
  .section-title {
    font-size: 1.5rem;
    font-weight: 600;
    color: #1e293b;
    margin: 0;
  }
  
  .convois-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
  }
  
  .convoi-card {
    background-color: white;
    border: 1px solid #e2e8f0;
    border-radius: 0.75rem;
    padding: 1.5rem;
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  }
  
  .convoi-card:hover {
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    border-color: #3b82f6;
    transform: translateY(-2px);
  }
  
  .convoi-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1rem;
  }
  
  .convoi-icon {
    width: 48px;
    height: 48px;
    border-radius: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  
  .convoi-icon-blue {
    background-color: #dbeafe;
    color: #3b82f6;
  }
  
  .convoi-icon-green {
    background-color: #d1fae5;
    color: #10b981;
  }
  
  .convoi-icon-purple {
    background-color: #ede9fe;
    color: #7c3aed;
  }
  
  .convoi-icon-orange {
    background-color: #fff7ed;
    color: #f97316;
  }
  
  .convoi-icon-red {
    background-color: #fee2e2;
    color: #ef4444;
  }
  
  .convoi-icon-gray {
    background-color: #f3f4f6;
    color: #6b7280;
  }
  
  .convoi-info {
    flex: 1;
  }
  
  .convoi-name {
    font-size: 1.125rem;
    font-weight: 600;
    color: #1e293b;
    margin: 0 0 0.25rem;
  }
  
  .convoi-count {
    font-size: 0.875rem;
    color: #64748b;
    margin: 0;
  }
  
  .convoi-progress {
    margin-bottom: 1rem;
  }
  
  .progress-bar {
    width: 100%;
    height: 8px;
    background-color: #f1f5f9;
    border-radius: 9999px;
    overflow: hidden;
    margin-bottom: 0.5rem;
  }
  
  .progress-fill {
    height: 100%;
    background-color: #3b82f6;
    border-radius: 9999px;
    transition: width 0.3s ease;
  }
  
  .progress-text {
    font-size: 0.75rem;
    color: #64748b;
    font-weight: 500;
  }
  
  .convoi-actions {
    display: flex;
    justify-content: flex-end;
  }
  
  .view-details-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background-color: #f8fafc;
    color: #475569;
    border: 1px solid #e2e8f0;
    border-radius: 0.375rem;
    padding: 0.5rem 0.75rem;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .view-details-btn:hover {
    background-color: #f1f5f9;
    border-color: #cbd5e1;
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
  
  .no-data {
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
    max-width: 1000px;
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
  
  .seminarists-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1rem;
  }
  
  .seminarist-card {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    border: 1px solid #e2e8f0;
    border-radius: 0.5rem;
    background-color: #f8fafc;
    transition: all 0.2s;
  }
  
  .seminarist-card:hover {
    background-color: #f1f5f9;
    border-color: #cbd5e1;
  }
  
  .seminarist-photo {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid #e2e8f0;
    flex-shrink: 0;
  }
  
  .seminarist-info {
    flex: 1;
  }
  
  .seminarist-name {
    font-weight: 600;
    color: #1e293b;
    font-size: 0.875rem;
    margin: 0 0 0.25rem;
  }
  
  .seminarist-id {
    font-size: 0.75rem;
    color: #64748b;
    margin: 0;
  }
  
  .modify-assignment-btn {
    background-color: #f3f4f6;
    color: #475569;
    border: 1px solid #e2e8f0;
    border-radius: 0.375rem;
    padding: 0.5rem;
    cursor: pointer;
    transition: all 0.2s;
    flex-shrink: 0;
  }
  
  .modify-assignment-btn:hover {
    background-color: #e2e8f0;
    color: #334155;
  }
  
  .cancel-button {
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: #4b5563;
    background-color: white;
    border: 1px solid #d1d5db;
    border-radius: 0.5rem;
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
  
  .download-button-purple {
    background-color: #7c3aed;
  }
  
  .download-button-purple:hover {
    background-color: #6d28d9;
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
  @media (max-width: 768px) {
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
    
    .search-input-group {
      flex-direction: column;
    }
    
    .convois-section {
      padding: 1rem;
    }
    
    .convois-grid {
      grid-template-columns: 1fr;
    }
    
    .modification-controls {
      flex-direction: column;
    }
    
    .modal-content {
      margin: 0.5rem;
      max-width: calc(100vw - 1rem);
    }
    
    .seminarists-grid {
      grid-template-columns: 1fr;
    }
    
    .seminarist-profile {
      flex-direction: column;
      text-align: center;
    }
  }
  </style>
  