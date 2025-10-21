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
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2v0a2 2 0 012-2h10l4 4v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
                  </svg>
                  Gestion de l'Hébergement SENAFOI 25
                </h1>
                <p class="overview-date">Contrôle des dortoirs - {{ currentDateFormatted }}</p>
              </div>
            </div>
            <div class="header-actions-right">
              <input type="date" v-model="selectedDate" class="date-input" />
              <button @click="exportDormReport()" class="export-button green-button">
                <svg class="w-4 h-4 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Rapport Excel</span>
              </button>
              <button @click="exportDormPDF()" class="export-button red-button">
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
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2v0a2 2 0 012-2h10l4 4v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
                </svg>
              </div>
              <div class="stat-info">
                <div class="stat-value">{{ seminaristsInDorm }}</div>
                <div class="stat-label">Dans les dortoirs</div>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon stat-icon-orange">
                <svg class="w-5 h-5 lg:w-6 lg:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </div>
              <div class="stat-info">
                <div class="stat-value">{{ seminaristsOutOfDorm }}</div>
                <div class="stat-label">Hors des dortoirs</div>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon stat-icon-purple">
                <svg class="w-5 h-5 lg:w-6 lg:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h4a1 1 0 011 1v5m-6 0V9a1 1 0 011-1h4a1 1 0 011 1v11" />
                </svg>
              </div>
              <div class="stat-info">
                <div class="stat-value">{{ availableDorms.length }}</div>
                <div class="stat-label">Dortoirs Disponibles</div>
              </div>
            </div>
          </div>
          
          <!-- Section de scan QR -->
          <div class="quick-search-section">
            <div class="quick-search-card">
              <div class="card-header">
                <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                </svg>
                <h3>Scanner QR Code - Contrôle Dortoir</h3>
              </div>
              <div class="search-form">
                <div class="search-input-group">
                  <input
                    v-model="matriculeInput"
                    @keyup.enter="handleScan"
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
                  <button @click="handleScan" class="search-button">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    Vérifier
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
              
              <!-- Résultat du scan -->
              <div v-if="seminaristStatus" class="seminarist-result-card" :class="seminaristStatus.type">
                <div class="result-header">
                  <div class="result-icon">
                    <svg v-if="seminaristStatus.type === 'success'" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <svg v-else-if="seminaristStatus.type === 'error'" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <svg v-else-if="seminaristStatus.type === 'warning'" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div class="result-content">
                    <p class="result-message">{{ seminaristStatus.message }}</p>
                    <div v-if="seminaristStatus.seminarist" class="seminarist-details">
                      <div class="seminarist-profile">
                        <img :src="seminaristStatus.seminarist.photo" alt="Photo" class="profile-photo" />
                        <div class="profile-info">
                          <h4 class="profile-name">{{ seminaristStatus.seminarist.name }}</h4>
                          <p class="profile-matricule">Matricule: {{ seminaristStatus.seminarist.matricule }}</p>
                          <p class="profile-dorm">Dortoir: <strong>{{ getDormName(seminaristStatus.seminarist.assignedDorm) }}</strong></p>
                          <p v-if="seminaristStatus.lastActionTime" class="profile-time">
                            Dernière action: {{ seminaristStatus.lastActionTime }}
                          </p>
                          <p class="profile-status">
                            Statut: <strong :class="seminaristStatus.currentStatus === 'in' ? 'text-green-600' : 'text-red-600'">
                              {{ seminaristStatus.currentStatus === 'in' ? 'Dans le dortoir' : 'Hors du dortoir' }}
                            </strong>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <!-- Boutons d'action -->
                <div v-if="seminaristStatus.actions && seminaristStatus.actions.length > 0" class="dorm-action-form">
                  <div class="action-buttons">
                    <button 
                      v-for="action in seminaristStatus.actions" 
                      :key="action.type"
                      @click="validateDormAction(seminaristStatus.seminarist.matricule, action.type)" 
                      :class="action.class"
                      class="action-button"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path v-if="action.type === 'enter'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                        <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      {{ action.label }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Section des dortoirs -->
          <div class="dorms-section">
            <div class="section-header">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h4a1 1 0 011 1v5m-6 0V9a1 1 0 011-1h4a1 1 0 011 1v11" />
              </svg>
              <h2 class="section-title">État des Dortoirs</h2>
            </div>
            
            <div v-if="loadingSeminarists" class="loading-indicator">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-loader-2">
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
              Chargement des données...
            </div>
            
            <div v-else-if="Object.keys(dormOccupancyBreakdown).length === 0" class="no-data">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-bed">
                <path d="M2 4v16" />
                <path d="M2 8h18a2 2 0 0 1 2 2v10" />
                <path d="M2 17h20" />
                <path d="M6 8v9" />
              </svg>
              <p>Aucun dortoir trouvé</p>
            </div>
            
            <div v-else class="dorms-grid">
              <div
                v-for="(data, dormId) in dormOccupancyBreakdown"
                :key="dormId"
                class="dorm-card"
                @click="openSeminaristsInDormModal(dormId, data.seminarists)"
              >
                <div class="dorm-header">
                  <div class="dorm-icon" :class="getDormIconClass(dormId)">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2 4v16M2 8h18a2 2 0 012 2v10M2 17h20M6 8v9" />
                    </svg>
                  </div>
                  <div class="dorm-info">
                    <h4 class="dorm-name">{{ getDormName(dormId) }}</h4>
                    <p class="dorm-count">{{ data.seminarists.length }} séminaristes</p>
                  </div>
                </div>
                <div class="dorm-status">
                  <div class="status-item in-dorm">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{{ data.inDorm }} présents</span>
                  </div>
                  <div class="status-item out-dorm">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span>{{ data.outOfDorm }} sortis</span>
                  </div>
                </div>
                <div class="dorm-progress">
                  <div class="progress-bar">
                    <div class="progress-fill" :style="{ width: getProgressWidth(data.inDorm, data.seminarists.length) + '%' }"></div>
                  </div>
                  <span class="progress-text">{{ getCapacityText(data.inDorm, data.seminarists.length) }}</span>
                </div>
                <div class="dorm-actions">
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
        </div>
      </main>
      
      <!-- Modal pour la liste des séminaristes dans un dortoir -->
      <div v-if="showSeminaristsInDormModal" class="modal" @click.self="closeSeminaristsInDormModal">
        <div class="modal-content view-modal">
          <div class="modal-header">
            <h2>Séminaristes du {{ getDormName(selectedDormForModal.dormId) }}</h2>
            <button @click="closeSeminaristsInDormModal" class="close-button">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          <div class="modal-body">
            <div v-if="selectedDormForModal.seminarists.length === 0" class="no-items">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-users">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              <p>Aucun séminariste assigné à ce dortoir</p>
            </div>
            <div v-else class="seminarists-grid">
              <div v-for="seminarist in selectedDormForModal.seminarists" :key="seminarist.matricule" class="seminarist-card">
                <img :src="seminarist.photo" alt="Photo" class="seminarist-photo" />
                <div class="seminarist-info">
                  <h4 class="seminarist-name">{{ seminarist.name }}</h4>
                  <p class="seminarist-id">{{ seminarist.matricule }}</p>
                  <p class="seminarist-status" :class="seminarist.isInDorm ? 'status-in' : 'status-out'">
                    {{ seminarist.isInDorm ? 'Présent' : 'Sorti' }}
                  </p>
                  <p v-if="seminarist.lastActionTime" class="seminarist-last-action">
                    {{ seminarist.lastActionTime }}
                  </p>
                </div>
                <button @click="selectSeminaristForAction(seminarist)" class="modify-status-btn">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button @click="exportDormList(selectedDormForModal.dormId)" class="save-button download-button-purple">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Exporter Liste</span>
            </button>
            <button @click="closeSeminaristsInDormModal" class="cancel-button">Fermer</button>
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
            <svg v-else-if="alert.type === 'warning'" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-alert-triangle">
              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
              <path d="M12 9v4" />
              <path d="m12 17 .01 0" />
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
  const seminaristStatus = ref(null);
  
  // QR Scanner states
  const showQRScanner = ref(false);
  const qrVideo = ref(null);
  const qrStream = ref(null);
  const qrCodeReader = ref(null);
  
  // Modal states
  const showSeminaristsInDormModal = ref(false);
  const selectedDormForModal = ref({ dormId: '', seminarists: [] });
  
  // Available dorms
  const availableDorms = ref([
    { id: 'DORTOIR_A', name: 'Dortoir A - Bloc Nord', capacity: 20 },
    { id: 'DORTOIR_B', name: 'Dortoir B - Bloc Sud', capacity: 20 },
    { id: 'DORTOIR_C', name: 'Dortoir C - Bloc Est', capacity: 18 },
    { id: 'DORTOIR_D', name: 'Dortoir D - Bloc Ouest', capacity: 18 },
    { id: 'DORTOIR_E', name: 'Dortoir E - Annexe', capacity: 15 }
  ]);
  
  // Dorm presence records: Format: { 'matricule': { dormId: 'DORTOIR_X', isInDorm: true/false, lastAction: 'enter'|'exit', timestamp: Date } }
  const dormPresence = ref({});
  
  // Toast notifications
  const alert = ref({
    show: false,
    type: 'success',
    message: ''
  });
  
  // Load data on mount
  onMounted(async () => {
    const storedPresence = localStorage.getItem('dormPresence');
    if (storedPresence) {
      dormPresence.value = JSON.parse(storedPresence);
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
  
  // Save dorm presence records to localStorage
  watch(dormPresence, (newPresence) => {
    localStorage.setItem('dormPresence', JSON.stringify(newPresence));
  }, { deep: true });
  
  // Computed properties
  const currentDateFormatted = computed(() => {
    const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(selectedDate.value).toLocaleDateString('fr-FR', options);
  });
  
  const totalSeminarists = computed(() => seminarists.value.length);
  
  const seminaristsInDorm = computed(() => {
    return seminarists.value.filter(s => dormPresence.value[s.matricule]?.isInDorm).length;
  });
  
  const seminaristsOutOfDorm = computed(() => {
    return totalSeminarists.value - seminaristsInDorm.value;
  });
  
  const dormOccupancyBreakdown = computed(() => {
    const breakdown = {};
    
    // Initialize with all available dorms
    availableDorms.value.forEach(dorm => {
      breakdown[dorm.id] = { seminarists: [], inDorm: 0, outOfDorm: 0 };
    });
    
    // Add unassigned category
    breakdown['Non assigné'] = { seminarists: [], inDorm: 0, outOfDorm: 0 };
    
    seminarists.value.forEach(s => {
      const assignedDormId = s.assignedDorm || 'Non assigné';
      if (!breakdown[assignedDormId]) {
        breakdown[assignedDormId] = { seminarists: [], inDorm: 0, outOfDorm: 0 };
      }
      
      const presence = dormPresence.value[s.matricule];
      const isInDorm = presence?.isInDorm || false;
      const lastActionTime = presence?.timestamp ? 
        new Date(presence.timestamp).toLocaleString('fr-FR', { 
          day: '2-digit', 
          month: '2-digit', 
          hour: '2-digit', 
          minute: '2-digit' 
        }) : '';
      
      breakdown[assignedDormId].seminarists.push({
        ...s,
        isInDorm,
        lastActionTime
      });
      
      if (isInDorm) {
        breakdown[assignedDormId].inDorm++;
      } else {
        breakdown[assignedDormId].outOfDorm++;
      }
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
        seminarists.value = data.data.map(s => ({
          matricule: s.matricule_seminaire,
          name: `${s.prenom} ${s.nom}`,
          photo: s.photo || `/placeholder.svg?height=80&width=80`,
          assignedDorm: s.dortoir || 'Non assigné'
        }));
        
        // Initialize dormPresence for new seminarists if not already present
        seminarists.value.forEach(s => {
          if (!dormPresence.value[s.matricule]) {
            dormPresence.value[s.matricule] = {
              dormId: s.assignedDorm,
              isInDorm: false, // Default to out of dorm
              lastAction: 'exit',
              timestamp: new Date().toISOString()
            };
          }
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
  
  const getDormName = (dormId) => {
    if (dormId === 'Non assigné') return 'Non assigné';
    const dorm = availableDorms.value.find(d => d.id === dormId);
    return dorm ? dorm.name : dormId;
  };
  
  const getDormIconClass = (dormId) => {
    if (dormId === 'Non assigné') return 'dorm-icon-gray';
    const colors = ['dorm-icon-blue', 'dorm-icon-green', 'dorm-icon-purple', 'dorm-icon-orange', 'dorm-icon-red'];
    const index = availableDorms.value.findIndex(d => d.id === dormId);
    return colors[index % colors.length] || 'dorm-icon-blue';
  };
  
  const getProgressWidth = (inDorm, total) => {
    if (total === 0) return 0;
    return (inDorm / total) * 100;
  };
  
  const getCapacityText = (inDorm, total) => {
    return `${inDorm}/${total}`;
  };
  
  // QR Scanner methods
  const startQRScanner = async () => {
    if (!qrCodeReader.value) {
      showAlert('error', 'Scanner QR non disponible');
      return;
    }
    
    try {
      showQRScanner.value = true;
      await new Promise(resolve => setTimeout(resolve, 100));
      
      qrStream.value = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      
      if (qrVideo.value) {
        qrVideo.value.srcObject = qrStream.value;
        
        qrCodeReader.value.decodeFromVideoDevice(undefined, qrVideo.value, (result, error) => {
          if (result) {
            const scannedText = result.getText();
            const matriculeMatch = scannedText.match(/SEM\d+/);
            if (matriculeMatch) {
              matriculeInput.value = matriculeMatch[0];
              handleScan();
              stopQRScanner();
            } else {
              matriculeInput.value = scannedText;
              handleScan();
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
  
  const handleScan = () => {
    const matricule = matriculeInput.value.trim();
    if (!matricule) {
      seminaristStatus.value = { type: 'info', message: 'Veuillez entrer un matricule ou scanner un code QR.' };
      return;
    }
  
    const seminarist = seminarists.value.find(s => String(s.matricule) === String(matricule));
  
    if (!seminarist) {
      seminaristStatus.value = {
        type: 'error',
        message: `Séminariste avec le matricule "${matricule}" non trouvé.`,
        seminarist: null
      };
      showAlert('error', `Séminariste "${matricule}" non trouvé.`);
      return;
    }
  
    if (!seminarist.assignedDorm || seminarist.assignedDorm === 'Non assigné') {
      seminaristStatus.value = {
        type: 'error',
        message: `${seminarist.name} n'est pas assigné à un dortoir.`,
        seminarist: seminarist,
        actions: []
      };
      showAlert('error', `${seminarist.name} n'a pas de dortoir assigné.`);
      return;
    }
  
    const currentStatus = dormPresence.value[seminarist.matricule];
    const isInDorm = currentStatus?.isInDorm || false;
    const lastActionTime = currentStatus?.timestamp ? 
      new Date(currentStatus.timestamp).toLocaleString('fr-FR', { 
        day: '2-digit', 
        month: '2-digit', 
        hour: '2-digit', 
        minute: '2-digit' 
      }) : '';
  
    const actions = [];
    
    if (isInDorm) {
      actions.push({
        type: 'exit',
        label: 'Marquer la sortie',
        class: 'exit-button'
      });
    } else {
      actions.push({
        type: 'enter',
        label: 'Marquer l\'entrée',
        class: 'enter-button'
      });
    }
  
    seminaristStatus.value = {
      type: 'info',
      message: `${seminarist.name} est actuellement ${isInDorm ? 'dans le dortoir' : 'hors du dortoir'}.`,
      seminarist: seminarist,
      currentStatus: isInDorm ? 'in' : 'out',
      lastActionTime,
      actions
    };
    
    showAlert('info', `Statut vérifié pour ${seminarist.name}.`);
    matriculeInput.value = '';
  };
  
  const validateDormAction = (matricule, action) => {
    const seminarist = seminarists.value.find(s => String(s.matricule) === String(matricule));
    if (!seminarist) return;
  
    const newStatus = action === 'enter';
    dormPresence.value[matricule] = {
      dormId: seminarist.assignedDorm,
      isInDorm: newStatus,
      lastAction: action,
      timestamp: new Date().toISOString()
    };
  
    seminaristStatus.value = {
      type: 'success',
      message: `${seminarist.name} a ${action === 'enter' ? 'entré dans' : 'quitté'} le ${getDormName(seminarist.assignedDorm)}.`,
      seminarist: seminarist,
      currentStatus: newStatus ? 'in' : 'out',
      lastActionTime: new Date().toLocaleString('fr-FR', { 
        day: '2-digit', 
        month: '2-digit', 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      actions: []
    };
    showAlert('success', `${seminarist.name} a ${action === 'enter' ? 'entré' : 'quitté'} le dortoir.`);
  };
  
  const openSeminaristsInDormModal = (dormId, seminaristsList) => {
    selectedDormForModal.value = { dormId: dormId, seminarists: seminaristsList };
    showSeminaristsInDormModal.value = true;
    document.body.style.overflow = 'hidden';
  };
  
  const closeSeminaristsInDormModal = () => {
    showSeminaristsInDormModal.value = false;
    selectedDormForModal.value = { dormId: '', seminarists: [] };
    document.body.style.overflow = 'auto';
  };
  
  const selectSeminaristForAction = (seminarist) => {
    matriculeInput.value = seminarist.matricule;
    closeSeminaristsInDormModal();
    handleScan();
  };
  
  const exportDormList = async (dormId) => {
    try {
      const dormData = dormOccupancyBreakdown.value[dormId];
      if (!dormData || dormData.seminarists.length === 0) {
        showAlert('error', 'Aucune donnée à exporter pour ce dortoir.');
        return;
      }
  
      const { jsPDF } = await import('jspdf');
      const autoTable = (await import('jspdf-autotable')).default;
      const doc = new jsPDF();
  
      doc.setFontSize(20);
      doc.setTextColor(40, 40, 40);
      doc.text(`LISTE - ${getDormName(dormId)}`, 105, 20, { align: 'center' });
  
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      const today = new Date().toLocaleDateString('fr-FR');
      doc.text(`Généré le ${today}`, 105, 30, { align: 'center' });
  
      const tableData = dormData.seminarists.map((s, index) => [
        index + 1,
        s.name,
        s.matricule,
        s.isInDorm ? 'Présent' : 'Sorti',
        s.lastActionTime || 'N/A'
      ]);
  
      autoTable(doc, {
        head: [['N°', 'Nom Complet', 'Matricule', 'Statut', 'Dernière Action']],
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
  
      const filename = `liste_${getDormName(dormId).replace(/\s+/g, '_')}_${today.replace(/\//g, '-')}.pdf`;
      doc.save(filename);
      showAlert('success', 'Liste exportée avec succès !');
    } catch (error) {
      console.error('Erreur lors de l\'export:', error);
      showAlert('error', 'Erreur lors de l\'export.');
    }
  };
  
  const exportDormReport = async () => {
    try {
      showAlert('info', 'Génération du rapport Excel en cours...');
      
      const data = [];
      Object.keys(dormOccupancyBreakdown.value).forEach(dormId => {
        const dormData = dormOccupancyBreakdown.value[dormId];
        dormData.seminarists.forEach(s => {
          data.push({
            'Dortoir': getDormName(dormId),
            'Nom Complet': s.name,
            'Matricule': s.matricule,
            'Statut': s.isInDorm ? 'Présent' : 'Sorti',
            'Dernière Action': s.lastActionTime || 'N/A',
            'Date': selectedDate.value
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
        { wch: 25 }, { wch: 30 }, { wch: 15 }, { wch: 10 }, { wch: 20 }, { wch: 12 }
      ];
      worksheet['!cols'] = colWidths;
      
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Dortoirs');
      
      const filename = `dortoirs_senafoi25_${selectedDate.value}.xlsx`;
      XLSX.writeFile(workbook, filename);
      
      showAlert('success', `Export Excel réussi ! ${data.length} enregistrements exportés.`);
    } catch (error) {
      console.error('Erreur lors de l\'export Excel:', error);
      showAlert('error', 'Erreur lors de l\'export Excel.');
    }
  };
  
  const exportDormPDF = async () => {
    try {
      showAlert('info', 'Génération du rapport PDF en cours...');
      
      const { jsPDF } = await import('jspdf');
      const autoTable = (await import('jspdf-autotable')).default;
      const doc = new jsPDF('landscape');
  
      doc.setFontSize(20);
      doc.setTextColor(40, 40, 40);
      doc.text('RAPPORT DORTOIRS SENAFOI 25', 148, 20, { align: 'center' });
  
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      const today = new Date().toLocaleDateString('fr-FR');
      doc.text(`Généré le ${today}`, 148, 30, { align: 'center' });
  
      const tableData = [];
      Object.keys(dormOccupancyBreakdown.value).forEach(dormId => {
        const dormData = dormOccupancyBreakdown.value[dormId];
        dormData.seminarists.forEach(s => {
          tableData.push([
            getDormName(dormId),
            s.name,
            s.matricule,
            s.isInDorm ? 'Présent' : 'Sorti',
            s.lastActionTime || 'N/A'
          ]);
        });
      });
  
      autoTable(doc, {
        head: [['Dortoir', 'Nom Complet', 'Matricule', 'Statut', 'Dernière Action']],
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
  
      const filename = `rapport_dortoirs_senafoi25_${today.replace(/\//g, '-')}.pdf`;
      doc.save(filename);
      showAlert('success', `Export PDF réussi ! ${tableData.length} enregistrements exportés.`);
    } catch (error) {
      console.error('Erreur lors de l\'export PDF:', error);
      showAlert('error', 'Erreur lors de l\'export PDF.');
    }
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
  
  // Watch for date changes
  watch(selectedDate, () => {
    seminaristStatus.value = null;
    matriculeInput.value = '';
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
    align-items: center;
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
  
  .date-input {
    padding: 0.5rem 0.75rem;
    border: 1px solid #e5e7eb;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    color: #111827;
    background-color: white;
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
  
  .seminarist-result-card.warning {
    border-color: #f59e0b;
    background-color: #fffbeb;
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
  
  .seminarist-result-card.warning .result-icon {
    color: #f59e0b;
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
  .profile-dorm,
  .profile-time,
  .profile-status {
    font-size: 0.875rem;
    color: #64748b;
    margin: 0.125rem 0;
  }
  
  /* Dorm Action Form */
  .dorm-action-form {
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid #e2e8f0;
  }
  
  .action-buttons {
    display: flex;
    gap: 0.75rem;
    flex-wrap: wrap;
  }
  
  .action-button {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    border: none;
    border-radius: 0.375rem;
    padding: 0.75rem 1.5rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    flex: 1;
    justify-content: center;
    min-width: 150px;
  }
  
  .enter-button {
    background-color: #10b981;
    color: white;
  }
  
  .enter-button:hover {
    background-color: #059669;
  }
  
  .exit-button {
    background-color: #ef4444;
    color: white;
  }
  
  .exit-button:hover {
    background-color: #dc2626;
  }
  
  /* Dorms Section */
  .dorms-section {
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
  
  .dorms-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
  }
  
  .dorm-card {
    background-color: white;
    border: 1px solid #e2e8f0;
    border-radius: 0.75rem;
    padding: 1.5rem;
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  }
  
  .dorm-card:hover {
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    border-color: #3b82f6;
    transform: translateY(-2px);
  }
  
  .dorm-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1rem;
  }
  
  .dorm-icon {
    width: 48px;
    height: 48px;
    border-radius: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  
  .dorm-icon-blue {
    background-color: #dbeafe;
    color: #3b82f6;
  }
  
  .dorm-icon-green {
    background-color: #d1fae5;
    color: #10b981;
  }
  
  .dorm-icon-purple {
    background-color: #ede9fe;
    color: #7c3aed;
  }
  
  .dorm-icon-orange {
    background-color: #fff7ed;
    color: #f97316;
  }
  
  .dorm-icon-red {
    background-color: #fee2e2;
    color: #ef4444;
  }
  
  .dorm-icon-gray {
    background-color: #f3f4f6;
    color: #6b7280;
  }
  
  .dorm-info {
    flex: 1;
  }
  
  .dorm-name {
    font-size: 1.125rem;
    font-weight: 600;
    color: #1e293b;
    margin: 0 0 0.25rem;
  }
  
  .dorm-count {
    font-size: 0.875rem;
    color: #64748b;
    margin: 0;
  }
  
  .dorm-status {
    display: flex;
    justify-content: space-between;
    margin-bottom: 1rem;
  }
  
  .status-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.875rem;
    font-weight: 500;
  }
  
  .status-item.in-dorm {
    color: #10b981;
  }
  
  .status-item.out-dorm {
    color: #ef4444;
  }
  
  .dorm-progress {
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
  
  .dorm-actions {
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
    margin: 0 0 0.25rem;
  }
  
  .seminarist-status {
    font-size: 0.75rem;
    font-weight: 500;
    margin: 0 0 0.25rem;
  }
  
  .seminarist-status.status-in {
    color: #10b981;
  }
  
  .seminarist-status.status-out {
    color: #ef4444;
  }
  
  .seminarist-last-action {
    font-size: 0.75rem;
    color: #64748b;
    margin: 0;
  }
  
  .modify-status-btn {
    background-color: #f3f4f6;
    color: #475569;
    border: 1px solid #e2e8f0;
    border-radius: 0.375rem;
    padding: 0.5rem;
    cursor: pointer;
    transition: all 0.2s;
    flex-shrink: 0;
  }
  
  .modify-status-btn:hover {
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
  
  .toast.warning {
    border-left: 4px solid #f59e0b;
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
  
  .toast.warning .toast-icon {
    color: #f59e0b;
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
    
    .product-stats {
      grid-template-columns: 1fr;
      padding: 1rem;
    }
    
    .quick-search-section {
      padding: 1rem;
    }
    
    .search-input-group {
      flex-direction: column;
    }
    
    .dorms-section {
      padding: 1rem;
    }
    
    .dorms-grid {
      grid-template-columns: 1fr;
    }
    
    .action-buttons {
      flex-direction: column;
    }
    
    .action-button {
      min-width: auto;
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
  