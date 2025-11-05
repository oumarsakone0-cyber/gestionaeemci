<template>
  <div class="membres-page">
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">👥 Gestion des Membres</h1><br/>
        <p class="page-subtitle">Administration des membres de l'AEEMCI</p>
      </div>
      <div class="header-stats">
        <div class="stat-card">
          <div class="stat-number">{{ pagination.total || 0 }}</div>
          <div class="stat-label">Membres</div>
        </div>
        
        <!-- Nouveau bloc : Comptes valides -->
        <div class="stat-card">
          <div class="stat-number">{{ stats.valid_accounts }}</div>
          <div class="stat-label">Comptes valides</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">{{ membresActifs }}</div>
          <div class="stat-label">Actifs</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">{{ secretariatsRepresentes }}</div>
          <div class="stat-label">Secrétariats</div>
        </div>
      </div>
    </div>

    <div class="content-container">
      <div class="content-header">
        <h2 class="content-title">Liste des Membres</h2>
        <div class="header-actions">
          <div class="search-container">
            <div class="search-input-wrapper">
              <span class="search-icon">🔍</span>
              <input 
                type="text" 
                v-model="searchTerm" 
                @input="debouncedSearch"
                placeholder="Rechercher par matricule, nom ou prénom..."
                class="search-input"
              />
              <button 
                v-if="filters.search" 
                @click="clearSearch" 
                class="clear-search"
                title="Effacer la recherche"
              >
                ×
              </button>
            </div>
          </div>
          
          <div class="filters-container">
            <div class="filter-dropdown-container">
              <div 
                @click="toggleSecretariatDropdown"
                class="filter-dropdown-trigger"
                :class="{ 'active': showSecretariatDropdown }"
              >
                <span v-if="selectedSecretariatText" class="selected-text">{{ selectedSecretariatText }}</span>
                <span v-else class="placeholder-text">Tous les secrétariats</span>
                <div class="dropdown-actions">
                  <button 
                    v-if="filters.secretariat" 
                    @click.stop="clearSecretariatSelection"
                    class="clear-button"
                    type="button"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                  <svg 
                    class="dropdown-arrow"
                    :class="{ 'rotate-180': showSecretariatDropdown }"
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </div>
              
              <div 
                v-if="showSecretariatDropdown" 
                class="filter-dropdown-menu"
              >
                <div class="dropdown-search">
                  <input
                    ref="secretariatSearchInput"
                    v-model="secretariatSearchTerm"
                    type="text"
                    placeholder="Rechercher un secrétariat..."
                    class="dropdown-search-input"
                    @click.stop
                  >
                </div>
                
                <div class="dropdown-options">
                  <div class="dropdown-option all-option" @click="selectSecretariat('', 'Tous les secrétariats')">
                    Tous les secrétariats
                  </div>
                  
                  <div 
                    v-for="secretariat in filteredSecretariatsForDropdown" 
                    :key="secretariat"
                    @click="selectSecretariat(secretariat, secretariat)"
                    class="dropdown-option"
                    :class="{ 'selected': filters.secretariat === secretariat }"
                  >
                    <span class="option-text">{{ secretariat }}</span>
                    <svg 
                      v-if="filters.secretariat === secretariat"
                      class="check-icon" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  
                  <div v-if="filteredSecretariatsForDropdown.length === 0" class="no-results">
                    Aucun secrétariat trouvé
                  </div>
                </div>
              </div>
            </div>
            
            <select 
              v-model="filters.statut"
              @change="loadMembres"
              class="filter-select"
            >
              <option value="">Tous les statuts</option>
              <option value="Actif">Actif</option>
              <option value="Inactif">Inactif</option>
            </select>
          </div>
          <div class="filter-dropdown-container" @click="toggleDropdown">
            <div :class="['filter-dropdown-trigger', { active: dropdownOpen }]">
              <span class="selected-text">
                {{ selectedOptionText || 'Tous les comptes' }}
              </span>
              <span class="dropdown-arrow">▾</span>
            </div>

            
            <!-- Affichage du menu avec les compteurs -->
            <div v-if="dropdownOpen" class="filter-dropdown-menu">
              <div 
                class="dropdown-option all-option" 
                :class="{ selected: !accountStatusFilter }"
                @click.stop="selectOption('')">
                Tous les comptes
              </div>
              <div 
                class="dropdown-option" 
                :class="{ selected: accountStatusFilter === 'valid' }" 
                @click.stop="selectOption('valid')">
                Comptes valides ({{ valid_accounts || 0 }})
              </div>
              
            </div>
          </div>



          <button class="add-btn" @click="showAddMembre = true">
            <span class="add-icon">+</span>
            <span>Nouveau Membre</span>
          </button>
        </div>
      </div>

      <div v-if="filters.search" class="search-results-info">
        <span class="results-count">{{ membres.length }} résultat(s) trouvé(s) pour "{{ filters.search }}"</span>
      </div>

      <div v-if="loading" class="loading-container">
        <div class="loading-spinner"></div>
        <p class="loading-text">Chargement des membres...</p>
      </div>

      <div v-else class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>Photo</th>
              <th style="width: 160px;">Matricule</th>
              <th>Nom & Prénom</th>
              <th>Secrétariat Régional</th>
              <th>Sous-comité</th>
              <th>Section</th>
              <th>Contact</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="membre in membres" :key="membre.id" class="table-row" :style="{ 'background-color': membre.type_membre !== 'ACTUEL' ? 'rgba(34, 197, 94, 0.1)' : '' }">
              <td>
                <div class="photo-cell">
                  <img v-if="membre.photo" 
                       :src="membre.photo" 
                       :alt="membre.nom + ' ' + membre.prenom" 
                       class="membre-photo clickable-photo"
                       @click="openPhotoModal(membre.photo, membre.nom + ' ' + membre.prenom)">
                  <div v-else class="membre-avatar">{{ membre.nom.charAt(0) }}{{ membre.prenom.charAt(0) }}</div>
                </div>
              </td>
              <td class="matricule-cell">
                <span class="matricule-badge">{{ membre.matricule }}</span>
              </td>
              <td class="name-cell">
                <div class="membre-info">
                  <span class="membre-nom">{{ membre.nom }} {{ membre.prenom }}</span>
                  <span class="membre-email"><span v-if="membre.type_membre == 'ANCIEN'">Past </span>{{ membre.poste }}</span>
                </div>
              </td>
              <td>{{ membre.secretariatRegional }}</td>
              <td>{{ membre.sousComite || 'Non assigné' }}</td>
              <td>{{ membre.section || 'Non assignée' }}</td>
              <td class="contact-cell">
                <div class="contact-info">
                  <span class="contact-phone">📞 {{ membre.contact }}</span>
                </div>
              </td>
              <td>
                <span class="status-badge" :class="membre.statut.toLowerCase()">
                  {{ membre.statut }}
                </span>
              </td>
              <td>
                <div class="action-buttons">
                  <button class="action-btn view" @click="viewMembre(membre)" title="Voir">
                    👁️
                  </button>
                  <button class="action-btn edit" @click="editMembre(membre)" title="Modifier">
                    ✏️
                  </button>
                  <button class="action-btn delete" @click="deleteMembre(membre)" title="Supprimer">
                    🗑️
                  </button>
                  <button class="action-btn reset" @click="openResetPasswordModal(membre)" title="Réinitialiser le mot de passe">
                    🔑
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        
        <div v-if="membres.length === 0 && filters.search" class="no-results">
          <div class="no-results-content">
            <span class="no-results-icon">🔍</span>
            <h3>Aucun membre trouvé</h3>
            <p>Aucun membre ne correspond à votre recherche "{{ filters.search }}"</p>
            <button @click="clearSearch" class="clear-search-btn">Effacer la recherche</button>
          </div>
        </div>
      </div>

      <div v-if="pagination.total > pagination.per_page" class="pagination-container">
        <div class="pagination-info">
          <span class="pagination-text">
            Affichage de {{ (pagination.current_page - 1) * pagination.per_page + 1 }} à 
            {{ Math.min(pagination.current_page * pagination.per_page, pagination.total) }} sur 
            {{ pagination.total }} résultats
          </span>
          <div class="per-page-selector">
            <label for="perPage" class="per-page-label">Éléments par page:</label>
            <select 
              id="perPage"
              v-model="pagination.per_page" 
              @change="changePerPage"
              class="per-page-select"
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </div>
        </div>
        <div class="pagination-controls">
          <button
            @click="changePage(pagination.current_page - 1)"
            :disabled="pagination.current_page <= 1"
            class="pagination-btn"
            :class="{ disabled: pagination.current_page <= 1 }"
          >
            Précédent
          </button>
          
          <template v-for="page in getVisiblePages()" :key="page">
            <button
              v-if="page !== '...' && page <= pagination.last_page"
              @click="changePage(page)"
              class="pagination-btn"
              :class="{ active: page === pagination.current_page }"
            >
              {{ page }}
            </button>
            <span v-else-if="page === '...'" class="pagination-ellipsis">...</span>
          </template>
          
          <button
            @click="changePage(pagination.current_page + 1)"
            :disabled="pagination.current_page >= pagination.last_page"
            class="pagination-btn"
            :class="{ disabled: pagination.current_page >= pagination.last_page }"
          >
            Suivant
          </button>
        </div>
      </div>
    </div>

    <div v-if="showAddMembre" class="modal-overlay" @click="showAddMembre = false">
      <div class="modal-container add-modal" @click.stop>
        <div class="modal-header">
          <h3 class="modal-title">Nouveau Membre</h3>
          <button class="modal-close" @click="showAddMembre = false">×</button>
        </div>
        <form class="add-form" @submit.prevent="addMembre">
          <div class="form-group">
            <label>Photo</label>
            <input type="file" accept="image/*" @change="handlePhotoUpload" />
          </div>
          <div class="form-group">
            <label>Matricule *</label>
            <input type="text" v-model="newMembre.matricule" required placeholder="Ex: AE2024001" />
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Nom *</label>
              <input type="text" v-model="newMembre.nom" required placeholder="Nom de famille" />
            </div>
            <div class="form-group">
              <label>Prénom *</label>
              <input type="text" v-model="newMembre.prenom" required placeholder="Prénom" />
            </div>
          </div>
          <div class="form-group">
            <label>Email *</label>
            <input type="email" v-model="newMembre.email" required placeholder="email@exemple.com" />
          </div>
          <div class="form-group">
            <label>Téléphone *</label>
            <input type="tel" v-model="newMembre.contact" required placeholder="+223 XX XX XX XX" />
          </div>
          <div class="form-group">
            <label>Secrétariat Régional *</label>
            <select v-model="newMembre.secretariatRegional" required>
              <option value="">Sélectionner un secrétariat</option>
              <option value="Nord">Secrétariat Nord</option>
              <option value="Sud">Secrétariat Sud</option>
              <option value="Centre">Secrétariat Centre</option>
              <option value="Est">Secrétariat Est</option>
              <option value="Ouest">Secrétariat Ouest</option>
            </select>
          </div>
          <div class="form-group">
            <label>Sous-comité</label>
            <select v-model="newMembre.sousComite">
              <option value="">Sélectionner un sous-comité</option>
              <option value="Formation">Formation</option>
              <option value="Communication">Communication</option>
              <option value="Événements">Événements</option>
              <option value="Partenariats">Partenariats</option>
            </select>
          </div>
          <div class="form-group">
            <label>Section</label>
            <select v-model="newMembre.section">
              <option value="">Sélectionner une section</option>
              <option value="Étudiants">Section Étudiants</option>
              <option value="Professionnels">Section Professionnels</option>
              <option value="Recherche">Section Recherche</option>
            </select>
          </div>
          <div class="form-actions">
            <button type="button" class="cancel-btn" @click="showAddMembre = false">Annuler</button>
            <button type="submit" class="submit-btn">Ajouter le membre</button>
          </div>
        </form>
      </div>
    </div>

    <div v-if="showViewModal" class="modal-overlay" @click="showViewModal = false">
      <div class="modal-container compact-modal" @click.stop>
        <div class="modal-header">
          <h3 class="modal-title">
            <i class="fas fa-user-circle"></i>
            Profil du Membre
          </h3>
          <button class="modal-close" @click="showViewModal = false">×</button>
        </div>
        <div class="modal-content">
          <div class="membre-profile-compact">
             <!-- CHANGE: Header compact avec photo et infos principales -->
            <div class="profile-header-compact">
              <div class="profile-photo-mini">
                <img v-if="currentMembre.photo" :src="currentMembre.photo" :alt="currentMembre.nom + ' ' + currentMembre.prenom">
                <div v-else class="profile-avatar-mini">
                  <i class="fas fa-user"></i>
                </div>
              </div>
              <div class="profile-info-compact">
                <h3 class="profile-name-compact">{{ currentMembre.nom }} {{ currentMembre.prenom }}</h3>
                <p class="profile-matricule-compact">{{ currentMembre.matricule }}</p>
                <div class="profile-badges-compact">
                  <span class="badge-mini badge-primary">{{ currentMembre.statut }}</span>
                  <span class="badge-mini" :class="currentMembre.type_membre === 'ACTUEL' ? 'badge-success' : 'badge-warning'">
                    {{ currentMembre.type_membre === 'ACTUEL' ? 'Actuel' : 'Ancien' }}
                  </span>
                  <span class="badge-mini" :class="currentMembre.statut_paiement === 'PAYE' ? 'badge-success' : 'badge-danger'">
                    {{ currentMembre.statut_paiement }}
                  </span>
                  <span class="badge-mini" :class="currentMembre.card_status">
                    {{ currentMembre.card_status === 'pending' ? 'En attente' : currentMembre.card_status }}
                  </span>
                </div>
              </div>
            </div>

             <!-- CHANGE: Grid 2x2 pour les 4 sections d'informations -->
            <div class="info-grid-2x2">
               <!-- Section 1: Informations Personnelles -->
              <div class="info-section-compact">
                <h4 class="section-title-compact">
                  <i class="fas fa-user"></i>
                  Personnel
                </h4>
                <div class="info-items-compact">
                  <div class="info-item-mini">
                    <i class="fas fa-birthday-cake"></i>
                    Date de Naiss :<span>{{ formatDate(currentMembre.date_naissance) }}</span>
                  </div>
                  <div class="info-item-mini">
                    <i class="fas fa-map-marker-alt"></i>
                    Lieu de Naiss :<span>{{ currentMembre.lieu_naissance || 'N/A' }}</span>
                  </div>
                  <div class="info-item-mini">
                    <i class="fas fa-venus-mars"></i>
                    Sexe :<span>{{ currentMembre.sexe === 'M' ? 'M' : 'F' }}</span>
                  </div>
                  <div class="info-item-mini">
                    <i class="fas fa-phone"></i>
                   Contact : <span>{{ currentMembre.contact }}</span>
                  </div>
                  <div class="info-item-mini" v-if="currentMembre.numero_wave">
                    <i class="fas fa-mobile-alt"></i>
                     <!--  <span>{{ currentMembre.numero_wave }}</span> -->
                  </div>
                </div>
              </div>

               <!-- Section 2: Informations Académiques -->
              <div class="info-section-compact">
                <h4 class="section-title-compact">
                  <i class="fas fa-graduation-cap"></i>
                  Militantisme
                </h4>
                <div class="info-items-compact">
                  <div class="info-item-mini">
                    <i class="fas fa-calendar-alt"></i>
                    <span>Début : {{ currentMembre.annee_debut }}</span>
                  </div>
                  <div class="info-item-mini">
                    <i class="fas fa-star"></i>
                    SR de début :<span>{{ currentMembre.sr_debut }}</span>
                  </div>
                  <div class="info-item-mini">
                    <i class="fas fa-star"></i>
                    SR Actuel :<span>{{ currentMembre.secretariat_poste }}</span>
                  </div>
                  <div class="info-item-mini">
                    <i class="fas fa-star"></i>
                    Qualité :<span>{{ currentMembre.qualite_membre }}</span>
                  </div>
                </div>
              </div>

               <!-- Section 3: Structure Organisationnelle -->
              <div class="info-section-compact">
                <h4 class="section-title-compact">
                  <i class="fas fa-sitemap"></i>
                  Base
                </h4>
                <div class="info-items-compact">
                  <div class="info-item-mini" v-if="currentMembre.sousComite.length > 1">
                    <i class="fas fa-map"></i>
                    Sous-comité :<span>{{ currentMembre.sousComite }}</span>
                  </div>
                  <div class="info-item-mini" v-if="currentMembre.section.length > 1">
                    <i class="fas fa-building"></i>
                    Section :<span>{{ currentMembre.section }}</span>
                  </div>
                  <div class="info-item-mini" v-if="currentMembre.sous_comite">
                    <i class="fas fa-users"></i>
                    <span>{{ currentMembre.sous_comite }}</span>
                  </div>
                  <div class="info-item-mini" v-if="currentMembre.section">
                    <i class="fas fa-layer-group"></i>
                    <span>{{ currentMembre.section }}</span>
                  </div>
                  <div class="info-item-mini" v-if="currentMembre.poste">
                    <i class="fas fa-briefcase"></i>
                    <span>{{ currentMembre.poste }}</span>
                  </div>
                </div>
              </div>

               <!-- Section 4: Paiement & Système -->
              <div class="info-section-compact">
                <h4 class="section-title-compact">
                  <i class="fas fa-cog"></i>
                  Système
                </h4>
                <div class="info-items-compact">
                  <div class="info-item-mini" v-if="currentMembre.ref_paiement">
                    <i class="fas fa-receipt"></i>
                    <span>{{ currentMembre.ref_paiement }}</span>
                  </div>
                  <div class="info-item-mini" v-if="currentMembre.transaction_id">
                    <i class="fas fa-hashtag"></i>
                    <span>{{ currentMembre.transaction_id }}</span>
                  </div>
                  <div class="info-item-mini">
                    <i class="fas fa-calendar-plus"></i>
                    <span>{{ formatDate(currentMembre.created_at) }}</span>
                  </div>
                  <div class="info-item-mini" v-if="currentMembre.printed_at">
                    <i class="fas fa-print"></i>
                    <span>{{ formatDate(currentMembre.printed_at) }}</span>
                  </div>
                  <div class="info-item-mini" v-if="currentMembre.retrieved_at">
                    <i class="fas fa-hand-holding"></i>
                    <span>{{ formatDate(currentMembre.retrieved_at) }}</span>
                  </div>
                  <div class="info-item-mini" v-if="currentMembre.retrieved_by">
                    <i class="fas fa-user-check"></i>
                    <span>{{ currentMembre.retrieved_by }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    
    <!-- Modale de confirmation pour la réinitialisation du mot de passe -->
    <div v-if="showResetPasswordModal" class="modal-overlay" @click="closeResetPasswordModal">
      <div class="modal-container reset-password-modal" @click.stop>
        <div class="modal-header">
          <h3 class="modal-title">
            <i class="fas fa-key"></i>
            Réinitialiser le mot de passe
          </h3>
          <button class="modal-close" @click="closeResetPasswordModal">×</button>
        </div>
        <div class="modal-content">
          <div v-if="!passwordReset">
            <p>Êtes-vous sûr de vouloir réinitialiser le mot de passe de :</p>
            <div class="membre-info-confirm">
              <strong>{{ selectedMembreForReset.nom }} {{ selectedMembreForReset.prenom }}</strong>
              <span class="matricule-badge">{{ selectedMembreForReset.matricule }}</span>
            </div>
            <p class="warning-text">
              <i class="fas fa-info-circle"></i>
              Le mot de passe sera réinitialisé et le membre devra en créer un nouveau.
            </p>
          </div>

          <div v-else>
            <p>Veuillez saisir le nouveau mot de passe pour :</p>
            <div class="membre-info-confirm">
              <strong>{{ selectedMembreForReset.nom }} {{ selectedMembreForReset.prenom }}</strong>
              <span class="matricule-badge">{{ selectedMembreForReset.matricule }}</span>
            </div>
            <div class="form-group">
              <label>Nouveau mot de passe *</label>
              <input type="password" v-model="newPassword" placeholder="Nouveau mot de passe" />
            </div>
            <div class="form-group">
              <label>Confirmer le mot de passe *</label>
              <input type="password" v-model="confirmPassword" placeholder="Confirmer le mot de passe" />
            </div>
            <p v-if="passwordError" class="error-text">{{ passwordError }}</p>
          </div>
        </div>
        <div class="modal-footer">
          <button class="cancel-btn" @click="closeResetPasswordModal">
            Annuler
          </button>
          <button 
            v-if="!passwordReset" 
            class="confirm-btn danger" 
            @click="initResetPassword"
          >
            <i class="fas fa-redo"></i>
            Réinitialiser
          </button>
          <button 
            v-else 
            class="confirm-btn success" 
            @click="submitNewPassword"
          >
            💾 Enregistrer
          </button>
        </div>
      </div>
    </div>


    <div v-if="showPhotoModal" class="modal-overlay" @click="closePhotoModal">
      <div class="photo-modal" @click.stop>
        <div class="photo-modal-header">
          <!-- Bouton pour modifier la photo -->
          <div class="photo-modal-actions">
            <h3>{{ currentPhotoAlt }}</h3>
            <button class="action-btn update-photo-btn" @click="openPhotoUpdateModal">
              <i class="fas fa-camera"></i>
              Modifier la photo
            </button>
          </div>
          <button class="modal-close" @click="closePhotoModal">×</button>
        </div>
        <div class="photo-modal-content">
          <img :src="currentPhoto" :alt="currentPhotoAlt" class="enlarged-photo">
        </div>
      </div>
    </div>
    
    <!-- MODAL DE MODIFICATION DU MEMBRE -->
    <div v-if="showEditModal" class="modal-overlay" @click="closeEditModal">
      <div class="modal-container edit-modal" @click.stop>
        <div class="modal-header">
          <h3 class="modal-title">Modifier le Membre</h3>
          <button class="modal-close" @click="closeEditModal">×</button>
        </div>

        <form class="edit-form" @submit.prevent="updateMembre">
          <div class="form-group">
            <label>Matricule</label>
            <input type="text" v-model="editMembreData.matricule" readonly />
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Nom</label>
              <input type="text" v-model="editMembreData.nom" required />
            </div>
            <div class="form-group">
              <label>Prénom</label>
              <input type="text" v-model="editMembreData.prenom" required />
            </div>
          </div>
          <div class="form-group">
            <label>Poste</label>
            <input type="text" v-model="editMembreData.poste" required />
          </div>
          <div class="form-group">
            <label>Photo</label>
            <input type="file" accept="image/*" @change="handleEditPhotoUpload" />
            <div v-if="editMembreData.photo" class="photo-preview">
              <img :src="editMembreData.photo" alt="Photo du membre" />
            </div>
          </div>
          <div class="form-group">
            <label>Secrétariat Régional</label>
            <select v-model="editMembreData.secretariat_poste" required>
              <option value="">-- Sélectionner --</option>
              <option v-for="region in secretariats" :key="region" :value="region">
                {{ region }}
              </option>
            </select>
          </div>


          <div class="form-group">
            <label>Sous-comité</label>
            <input type="text" v-model="editMembreData.sousComite"  required />
          </div>

          <div class="form-group">
            <label>Section</label>
            <input type="text" v-model="editMembreData.section" required/>
          </div>

          <div class="form-group">
            <label>Contact</label>
            <input type="text" v-model="editMembreData.contact"  required/>
          </div>

          <div class="form-group">
            <label>Je suis</label>
            <small v-if="editMembreData.statut" class="text-gray-600">
               <strong>{{ statut }}</strong>
            </small>
            <select v-model="editMembreData.statut" required>
              <option value="">-- Sélectionner --</option>
              <option value="CE_CE">CE_CE</option>
              <option value="SC_SC">SC_SC</option>
              <option value="SR_SR">SR_SR</option>
              <option value="SR">SR</option>
              <option value="SOUS_COMITE">SOUS_COMITE</option>
              <option value="SECTION">SECTION</option>
              <option value="BUREAU_SECTION">BUREAU_SECTION</option>
              <option value="MEMBRE_SIMPLE">MEMBRE_SIMPLE</option>
            </select>
          </div>



          <div class="form-actions">
            <button type="button" class="cancel-btn" @click="closeEditModal">Annuler</button>
            <button type="submit" class="submit-btn" @click="updateMembre">💾 Enregistrer</button>
          </div>
        </form>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, onUnmounted ,reactive} from 'vue'

const API_BASE_URL = 'https://sogetrag.com/api/membres.php'

const membres = ref([])
const loading = ref(false)
const error = ref(null)
const searchTerm = ref('')
const searchTimeout = ref(null)

const showSecretariatDropdown = ref(false)
const secretariatSearchTerm = ref('')
const secretariats = ref([
  'ABIDJAN NORD', 'ABIDJAN SUD', 'ABIDJAN EST', 'ABIDJAN OUEST',
  'AGNEBI-TIASSA ET ME', 'BAGOUE', 'BELIER', 'BERE', 'BAFING', 'BOUNKANI',
  'CAVALLY', 'FOLON', 'GBEKE', 'GBOKLE', 'GOH', 'ONTOUGO',
  'GRANDS-PONTS', 'N\'ZI', 'HAUT-SASSANDRA', 'IFFOU', 'INDENIE-DJUABLIN',
  'KABADOUGOU', 'LOH-DJIBOUA', 'NAWA', 'MORONOU', 'PORO', 'WORODOUGOU',
  'MARAHOUE', 'TCHOLOGO', 'TONPKI', 'SAN-PEDRO', 'SUD COMOE', 'GUEMON', 'HAMBOL'
])

const filters = ref({
  search: '',
  secretariat: '',
  statut: '',
  card_status: ''
})

const pagination = ref({
  current_page: 1,
  per_page: 10,
  total: 0,
  last_page: 1
})

const showAddMembre = ref(false)
const showViewModal = ref(false)
const currentMembre = ref(null)
const showEditModal = ref(false)
const editMembreData = ref({})


const newMembre = ref({
  matricule: '',
  nom: '',
  prenom: '',
  email: '',
  contact: '',
  secretariatRegional: '',
  sousComite: '',
  section: '',
  poste: '',
  type_membre: '',
  photo: null
})
const showResetPasswordModal = ref(false)
const selectedMembreForReset = reactive({
  id: null,
  nom: '',
  prenom: '',
  matricule: ''
})

const showPhotoModal = ref(false)
const currentPhoto = ref(null)
const currentPhotoAlt = ref('')
const accountStatusFilter = ref('') // '', 'valid', 'invalid'
const dropdownOpen = ref(false)
const selectOption = (option) => {
  accountStatusFilter.value = option
  dropdownOpen.value = false
  loadMembres()
}
const selectedOptionText = computed(() => {
  if (accountStatusFilter.value === 'valid') {
    return `Comptes valides (${stats.value.valid_accounts || 0})`
  } 
  return 'Tous les comptes'
})
const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value
}


// Compte valide initialisé à 0
const validAccounts = ref(0)

const loadValidAccounts = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}?action=stats`)
    const data = await res.json()
    if (data.success && data.data?.valid_accounts !== undefined) {
      validAccounts.value = data.data.valid_accounts
      console.log('Comptes valides:', validAccounts.value)
    } else {
      console.warn('Propriété valid_accounts introuvable dans la réponse:', data)
    }
  } catch (err) {
    console.error('Erreur fetch comptes valides:', err)
  }
}

onMounted(() => {
  loadValidAccounts()
})

const loadMembres = async () => {
  try {
    loading.value = true
    error.value = null
    
    let url = `${API_BASE_URL}?action=membres&page=${pagination.value.current_page}&per_page=${pagination.value.per_page}&rand=${Math.random()}`

    if (filters.value.search) {
      url += `&search=${encodeURIComponent(filters.value.search)}` 
    }
    if (filters.value.secretariat) {
      url += `&secretariat=${encodeURIComponent(filters.value.secretariat)}` 
    }
    if (filters.value.statut) {
      url += `&statut=${encodeURIComponent(filters.value.statut)}` 
    }
    if (filters.value.card_status) {
      url += `&card_status=${encodeURIComponent(filters.value.card_status)}` 
    }
    if (accountStatusFilter.value) {
     url += `&valid_accounts=${accountStatusFilter.value}` // 'valid' ou 'invalid'
    }

    
    const response = await fetch(url)
    const data = await response.json()
    
    if (data.success) {
      membres.value = (data.data || []).map(membre => ({
        id: membre.id,
        matricule: membre.matricule || membre.numero_membre,
        nom: membre.nom,
        prenom: membre.prenom,
        email: membre.email,
        contact: membre.contact || membre.contact,
        je_suis:membre.statut,
        secretariatRegional: membre.region || membre.secretariat,
        sousComite: membre.sous_comite,
        section: membre.section,
        poste: membre.poste || 'Membre',
        type_membre: membre.type_membre,
        statut: membre.statut || 'SECTION',
        photo: membre.photo,
        card_status: membre.card_status || 'pending',
        statut_paiement: membre.statut_paiement || 'NON_PAYE',
        printed_at: membre.printed_at,
        retrieved_at: membre.retrieved_at,
        retrieved_by: membre.retrieved_by,
        date_naissance: membre.date_naissance,
        lieu_naissance: membre.lieu_naissance,
        sexe: membre.sexe,
        numero_wave: membre.numero_wave,
        annee_debut: membre.annee_debut,
        qualite_membre: membre.qualite_membre,
        sr_debut: membre.sr_debut,
        secretariat_poste: membre.secretariat_poste,
        ref_paiement: membre.ref_paiement,
        transaction_id: membre.transaction_id,
        created_at: membre.created_at
      }))
      
      if (data.pagination) {
        pagination.value = {
          ...pagination.value,
          ...data.pagination
        }
      }
    } else {
      throw new Error(data.error || 'Erreur lors du chargement des membres')
    }
  } catch (err) {
    console.error('Erreur loadMembres:', err)
    error.value = err.message
    membres.value = []
  } finally {
    loading.value = false
  }
}

// Indique si le mot de passe a été réinitialisé
const passwordReset = ref(false)
const newPassword = ref('')
const confirmPassword = ref('')
const passwordError = ref('')

// Étape 1 : réinitialisation (backend met un mot de passe temporaire)
const initResetPassword = async () => {
  try {
    const response = await fetch(
      `${API_BASE_URL}?action=reset_password&id=${selectedMembreForReset.id}`,
      { method: 'POST' }
    )
    const data = await response.json()
    
    if (data.success) {
      alert('✅ Mot de passe réinitialisé. Veuillez saisir le nouveau mot de passe.')
      passwordReset.value = true
      newPassword.value = ''
      confirmPassword.value = ''
      passwordError.value = ''
    } else {
      alert(`❌ Erreur : ${data.message || data.error}`)
    }
  } catch (err) {
    console.error(err)
    alert('🚨 Erreur serveur lors de la réinitialisation.')
  }
}

// Étape 2 : soumission du nouveau mot de passe
const submitNewPassword = async () => {
  if (!newPassword.value || !confirmPassword.value) {
    passwordError.value = 'Veuillez remplir tous les champs.'
    return
  }
  if (newPassword.value !== confirmPassword.value) {
    passwordError.value = 'Les mots de passe ne correspondent pas.'
    return
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}?action=set_new_password&id=${selectedMembreForReset.id}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: newPassword.value })
      }
    )
    const data = await response.json()

    if (data.success) {
      alert('✅ Nouveau mot de passe enregistré avec succès !')
      closeResetPasswordModal()
    } else {
      passwordError.value = data.message || 'Erreur lors de l’enregistrement du mot de passe.'
    }
  } catch (err) {
    console.error(err)
    passwordError.value = '🚨 Erreur serveur lors de l’enregistrement.'
  }
}

// Adapter close modal
const closeResetPasswordModal = () => {
  showResetPasswordModal.value = false
  selectedMembreForReset.id = null
  selectedMembreForReset.nom = ''
  selectedMembreForReset.prenom = ''
  selectedMembreForReset.matricule = ''
  passwordReset.value = false
  newPassword.value = ''
  confirmPassword.value = ''
  passwordError.value = ''
}


const openResetPasswordModal = (membre) => {
  selectedMembreForReset.id = membre.id
  selectedMembreForReset.nom = membre.nom
  selectedMembreForReset.prenom = membre.prenom
  selectedMembreForReset.matricule = membre.matricule
  showResetPasswordModal.value = true
}
const openPhotoUpdateModal = (membreId) => {
  const fileInput = document.createElement('input')
  fileInput.type = 'file'
  fileInput.accept = 'image/*'
  fileInput.addEventListener('change', (e) => handlePhotoUpload(e, membreId))
  fileInput.click()
}

const debouncedSearch = () => {
  clearTimeout(searchTimeout.value)
  searchTimeout.value = setTimeout(() => {
    filters.value.search = searchTerm.value
    pagination.value.current_page = 1
    loadMembres()
  }, 500)
}

const membresActifs = computed(() => {
  return membres.value.filter(m => m.statut === 'Actif').length
})

const secretariatsRepresentes = computed(() => {
  const secretariatsSet = new Set(membres.value.map(m => m.secretariatRegional).filter(Boolean))
  return secretariatsSet.size
})

const changePage = (page) => {
  if (page >= 1 && page <= pagination.value.last_page) {
    pagination.value.current_page = page
    loadMembres()
  }
}

const changePerPage = () => {
  pagination.value.current_page = 1 // Reset to first page when changing per_page
  loadMembres()
}

const getVisiblePages = () => {
  const current = pagination.value.current_page
  const last = pagination.value.last_page
  const pages = []
  
  if (last <= 7) {
    for (let i = 1; i <= last; i++) {
      pages.push(i)
    }
  } else {
    if (current <= 4) {
      for (let i = 1; i <= 5; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(last)
    } else if (current >= last - 3) {
      pages.push(1)
      pages.push('...')
      for (let i = last - 4; i <= last; i++) {
        pages.push(i)
      }
    } else {
      pages.push(1)
      pages.push('...')
      for (let i = current - 1; i <= current + 1; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(last)
    }
  }
  
  return pages
}

const handlePhotoUpload = (event,membreId) => {
  const file = event.target.files[0]
  if (!file) return
  editPhotoFile.value = file

  const formData = new FormData()
  formData.append('photo', file)

  // Envoi direct au backend
  fetch(`update_photo.php?id=${membreId}`, {
    method: 'POST',
    body: formData
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      alert('Photo mise à jour ✅')
      // Met à jour la photo dans la liste des membres
      const membreIndex = membres.value.findIndex(m => m.id === membreId)
      if (membreIndex !== -1) {
        membres.value[membreIndex].photo = data.new_photo_url || currentPhoto.value
      }
      closePhotoModal()
    } else {
      alert(`Erreur : ${data.message}`)
    }
  })
  .catch(err => {
    console.error(err)
    alert('Erreur serveur lors de la mise à jour de la photo ❌')
  })
}

const addMembre = async () => {
  try {
    const nouveauMembre = {
      id: Date.now(),
      ...newMembre.value,
      statut: 'Actif'
    }
    
    await loadMembres()
    
    newMembre.value = {
      matricule: '',
      nom: '',
      prenom: '',
      email: '',
      contact: '',
      secretariatRegional: '',
      sousComite: '',
      section: '',
      je_suis:'',
      photo: null
    }
    
    showAddMembre.value = false
  } catch (err) {
    console.error('Erreur lors de l\'ajout:', err)
  }
}

const viewMembre = (membre) => {
  currentMembre.value = membre
  showViewModal.value = true
}

const editMembre = (membre) => {
  editMembreData.value = { ...membre }
  showEditModal.value = true
}
const closeEditModal = () => {
  showEditModal.value = false
  editMembreData.value = {}
}

const handleEditPhotoUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      editMembreData.value.photo = e.target.result
    }
    reader.readAsDataURL(file)
  }
}
const updateMembre = async () => {
  try {
    const response = await fetch(
      `${API_BASE_URL}?action=update_membre&id=${editMembreData.value.id}`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editMembreData.value),
      }
    );

    const data = await response.json();

    if (data.success) {
      alert('✅ Modifications enregistrées avec succès !');
      await loadMembres();
      closeEditModal();
    } else {
      alert('❌ Erreur lors de la mise à jour : ' + (data.message || data.error));
    }
  } catch (err) {
    console.error('Erreur updateMembre:', err);
    alert('🚨 Une erreur est survenue lors de l’enregistrement.');
  }
};


const deleteMembre = async (membre) => {
  if (confirm(`Êtes-vous sûr de vouloir supprimer ${membre.nom} ${membre.prenom} ?`)) {
    try {
      await loadMembres()
    } catch (err) {
      console.error('Erreur lors de la suppression:', err)
    }
  }
}

const clearSearch = () => {
  searchTerm.value = ''
  filters.value.search = ''
  pagination.value.current_page = 1
  loadMembres()
}

const selectedSecretariatText = computed(() => {
  return filters.value.secretariat || ''
})

const filteredSecretariatsForDropdown = computed(() => {
  if (!secretariatSearchTerm.value) {
    return secretariats.value
  }
  return secretariats.value.filter(secretariat => 
    secretariat.toLowerCase().includes(secretariatSearchTerm.value.toLowerCase())
  )
})

const handleClickOutside = (event) => {
  if (!event.target.closest('.filter-dropdown-container')) {
    showSecretariatDropdown.value = false
  }
}

const toggleSecretariatDropdown = () => {
  showSecretariatDropdown.value = !showSecretariatDropdown.value
  if (showSecretariatDropdown.value) {
    secretariatSearchTerm.value = ''
    nextTick(() => {
      if (document.querySelector('.dropdown-search-input')) {
        document.querySelector('.dropdown-search-input').focus()
      }
    })
  }
}

const selectSecretariat = (value, text) => {
  filters.value.secretariat = value
  showSecretariatDropdown.value = false
  secretariatSearchTerm.value = ''
  loadMembres()
}

const clearSecretariatSelection = () => {
  filters.value.secretariat = ''
  secretariatSearchTerm.value = ''
  loadMembres()
}

const openPhotoModal = (photo, alt) => {
  if (photo) {
    currentPhoto.value = photo
    currentPhotoAlt.value = alt
    showPhotoModal.value = true
  }
}

const closePhotoModal = () => {
  showPhotoModal.value = false
  currentPhoto.value = null
  currentPhotoAlt.value = ''
}

onMounted(() => {
  loadMembres()
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

const formatDate = (dateString) => {
  if (!dateString) return 'Non renseigné'
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
const stats = ref({});

const loadStats = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}?action=stats`);
    const data = await res.json();
    if (data.success) {
      stats.value = data.data;
    }
  } catch (err) {
    console.error(err);
  }
}

onMounted(() => {
  loadStats();
});


const formatDateTime = (dateString) => {
  if (!dateString) return 'Non renseigné'
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<style scoped>

/* ---------------------- MODAL RESET MOT DE PASSE ---------------------- */
.reset-password-modal {
  max-width: 400px;
  width: 100%;
  border-radius: 12px;
  background: white;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
}

.reset-password-modal .modal-header {
  padding: 16px 20px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.reset-password-modal .modal-title {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  display: flex;
  align-items: center;
  gap: 8px;
}

.reset-password-modal .modal-close {
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  border-radius: 4px;
  cursor: pointer;
  font-size: 20px;
  color: #6b7280;
  display: flex;
  align-items: center;
  justify-content: center;
}

.reset-password-modal .modal-close:hover {
  background: #f3f4f6;
}

.reset-password-modal .modal-content {
  padding: 20px;
  text-align: center;
  font-size: 14px;
  color: #374151;
}

.reset-password-modal .membre-info-confirm {
  margin: 12px 0;
  font-weight: 600;
  color: #1f2937;
}

.reset-password-modal .warning-text {
  color: #dc2626;
  font-size: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  margin-top: 10px;
}

.reset-password-modal .modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 20px;
  border-top: 1px solid #e5e7eb;
}

.reset-password-modal .cancel-btn {
  padding: 8px 16px;
  background: #f9fafb;
  border: 1px solid #d1d5db;
  color: #6b7280;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.reset-password-modal .cancel-btn:hover {
  background: #f3f4f6;
  color: #374151;
}

.reset-password-modal .confirm-btn.danger {
  padding: 8px 16px;
  background: #dc2626;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  justify-content: center;
  transition: all 0.2s;
}

.reset-password-modal .confirm-btn.danger:hover {
  background: #b91c1c;
}

/* ---------------------- BOUTON RESET ---------------------- */
.action-btn.reset {
  background: #fef2f2;
  color: #dc2626;
}

.action-btn.reset:hover {
  background: #fee2e2;
  color: #991b1b;
}
.photo-modal-actions {
  display: flex;
  flex-direction: column; /* empile le h3 et le bouton verticalement */
  align-items: flex-start; /* aligne à gauche, tu peux changer en center si tu veux centrer */
  gap: 8px; /* espace entre le h3 et le bouton */
}

.update-photo-btn {
  display: flex;
  align-items: center;
  gap: 5px;           /* espace entre icône et texte */
  background: #007BFF; 
  border: none;
  border-radius: 4px;
  padding: 5px 10px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.2s;
}

.update-photo-btn:hover {
  background: #0056b3;
}

.update-photo-btn i {
  font-size: 16px; /* taille de l'icône de la caméra */
}


.membres-page {
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

.content-container {
  padding: 32px;
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
}

.content-title {
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.search-container {
  position: relative;
}

.search-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.search-input {
  width: 320px;
  padding: 10px 12px 10px 40px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  background: white;
  color: #374151;
  transition: all 0.2s;
}

.search-input:focus {
  outline: none;
  border-color: #16a34a;
  box-shadow: 0 0 0 3px rgba(22, 163, 74, 0.1);
}

.search-input::placeholder {
  color: #9ca3af;
}

.search-icon {
  position: absolute;
  left: 12px;
  color: #6b7280;
  font-size: 14px;
  pointer-events: none;
}

.clear-search {
  position: absolute;
  right: 8px;
  width: 20px;
  height: 20px;
  border: none;
  background: #f3f4f6;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: #6b7280;
  transition: all 0.2s;
}

.clear-search:hover {
  background: #e5e7eb;
  color: #374151;
}

.filters-container {
  display: flex;
  gap: 8px;
}

.filter-select {
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  background: white;
  color: #374151;
  transition: all 0.2s;
}

.filter-select:focus {
  outline: none;
  border-color: #16a34a;
  box-shadow: 0 0 0 3px rgba(22, 163, 74, 0.1);
}

.search-results-info {
  margin-bottom: 16px;
  padding: 12px 16px;
  background: #f0f9ff;
  border: 1px solid #bae6fd;
  border-radius: 6px;
}

.results-count {
  font-size: 14px;
  color: #0369a1;
  font-weight: 500;
}

.loading-container {
  padding: 48px 24px;
  text-align: center;
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #f3f4f6;
  border-top: 3px solid #16a34a;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-text {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
}

.add-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
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
  background: #15803d;
}

.add-icon {
  font-size: 16px;
  font-weight: bold;
}

.table-container {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th {
  background: #f9fafb;
  padding: 16px;
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

.photo-cell {
  display: flex;
  justify-content: center;
}

.membre-photo {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
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
  font-size: 14px;
}

.matricule-cell {
  text-align: center;
}

.matricule-badge {
  background: #eff6ff;
  color: #16a34a;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.name-cell {
  min-width: 200px;
}

.membre-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.membre-nom {
  font-weight: 500;
  color: #1f2937;
}

.membre-email {
  font-size: 12px;
  color: #6b7280;
}

.contact-cell {
  min-width: 180px;
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.contact-phone, .contact-email {
  font-size: 12px;
  color: #6b7280;
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

.no-results {
  padding: 48px 24px;
  text-align: center;
  background: white;
}

.no-results-content {
  max-width: 300px;
  margin: 0 auto;
}

.no-results-icon {
  font-size: 48px;
  margin-bottom: 16px;
  display: block;
}

.no-results h3 {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 8px 0;
}

.no-results p {
  font-size: 14px;
  color: #6b7280;
  margin: 0 0 20px 0;
}

.clear-search-btn {
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

.clear-search-btn:hover {
  background: #15803d;
}

.pagination-container {
  margin-top: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  padding: 16px 24px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.pagination-info {
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}

.per-page-selector {
  display: flex;
  align-items: center;
  gap: 8px;
}

.per-page-label {
  font-size: 14px;
  color: #666;
  white-space: nowrap;
}

.per-page-select {
  padding: 4px 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  background: white;
  cursor: pointer;
}

.per-page-select:focus {
  outline: none;
  border-color: #4CAF50;
}

.pagination-controls {
  display: flex;
  gap: 4px;
  align-items: center;
}

.pagination-btn {
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  background: white;
  color: #374151;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.pagination-btn:hover:not(.disabled) {
  background: #f9fafb;
}

.pagination-btn.active {
  background: #16a34a;
  color: white;
  border-color: #16a34a;
}

.pagination-btn.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-ellipsis {
  padding: 8px 4px;
  color: #6b7280;
}

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
  max-width: 600px;
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
}

.modal-close:hover {
  background: #f3f4f6;
}

.modal-content {
  padding: 24px;
  overflow-y: auto;
  width: 100%;
    max-width: 100%;
}
/* Modal globale pour édition */
.edit-modal {
  max-width: 600px; /* largeur */
  width: 100%;
  max-height: 80vh; /* hauteur maximale pour éviter de dépasser l'écran */
  overflow-y: auto; /* scroll vertical si contenu trop grand */
  border-radius: 12px;
  background: white;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  padding: 10px;
}

/* Contenu interne de la modal */
.edit-modal .modal-content {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* Champ photo avec preview */
.edit-modal .photo-preview {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  margin-top: 8px;
}

/* Input et select */
.edit-modal input,
.edit-modal select {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
}

.edit-modal input:focus,
.edit-modal select:focus {
  border-color: #16a34a;
  box-shadow: 0 0 0 3px rgba(22, 163, 74, 0.1);
}

/* Boutons */
.edit-modal .form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #e5e7eb;
}

.edit-modal .submit-btn {
  background: #16a34a;
  color: white;
}

.edit-modal .submit-btn:hover {
  background: #15803d;
}

.edit-modal .cancel-btn {
  background: #f9fafb;
  border: 1px solid #d1d5db;
}

.edit-modal .cancel-btn:hover {
  background: #f3f4f6;
}

/* Photo et champs alignés proprement */
.edit-modal .form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

/* Responsive : champs sur une seule colonne sur petits écrans */
@media (max-width: 500px) {
  .edit-modal .form-row {
    grid-template-columns: 1fr;
  }
}


/* Photo Upload Preview */
.edit-modal .photo-preview {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  margin-top: 8px;
}

.edit-modal .photo-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.add-form {
  padding: 24px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
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
  box-shadow: 0 0 0 3px rgba(22, 163, 74, 0.1);
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
  background: #15803d;
}

.membre-details {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.membre-header {
  display: flex;
  gap: 20px;
  align-items: center;
}

.membre-photo-large {
  flex-shrink: 0;
}

.membre-photo-large img {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
}

.membre-avatar-large {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #16a34a;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 24px;
}

.membre-info-large h4 {
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 8px 0;
}

.matricule-large {
  font-size: 14px;
  color: #6b7280;
  margin: 0 0 4px 0;
}

.email-large {
  font-size: 14px;
  color: #6b7280;
  margin: 0 0 12px 0;
}

.status-badge-large {
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 500;
}

.status-badge-large.actif {
  background: #dcfce7;
  color: #166534;
}

.status-badge-large.inactif {
  background: #fef2f2;
  color: #991b1b;
}

.membre-details-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 16px;
  background: #f9fafb;
  border-radius: 8px;
}

.detail-item strong {
  font-size: 12px;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.detail-item span {
  font-size: 14px;
  color: #1f2937;
  font-weight: 500;
}

.filter-dropdown-container {
  position: relative;
  min-width: 200px;
}

.filter-dropdown-trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 14px;
}

.filter-dropdown-trigger:hover {
  border-color: #22c55e;
}

.filter-dropdown-trigger.active {
  border-color: #22c55e;
  box-shadow: 0 0 0 2px rgba(34, 197, 94, 0.1);
}

.selected-text {
  color: #111827;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.placeholder-text {
  color: #6b7280;
}

.dropdown-actions {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
}

.clear-button {
  padding: 2px;
  color: #6b7280;
  transition: color 0.2s;
}

.dropdown-arrow {
  width: 16px;
  height: 16px;
  color: #6b7280;
  transition: transform 0.2s;
}

.filter-dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 50;
  margin-top: 4px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  max-height: 300px;
  overflow: hidden;
}

.dropdown-search {
  padding: 8px;
  border-bottom: 1px solid #e5e7eb;
}

.dropdown-search-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 14px;
  outline: none;
}

.dropdown-search-input:focus {
  border-color: #22c55e;
  box-shadow: 0 0 0 2px rgba(34, 197, 94, 0.1);
}

.dropdown-options {
  max-height: 240px;
  overflow-y: auto;
}

.dropdown-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  cursor: pointer;
  transition: background-color 0.2s;
  font-size: 14px;
}

.dropdown-option:hover {
  background-color: #f9fafb;
}

.dropdown-option.all-option {
  color: #6b7280;
  font-style: italic;
}

.dropdown-option.selected {
  background-color: #ecfdf5;
  color: #059669;
  font-weight: 500;
}

.option-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.check-icon {
  width: 16px;
  height: 16px;
  color: #059669;
  flex-shrink: 0;
}

.no-results {
  padding: 12px 16px;
  text-align: center;
  color: #6b7280;
  font-size: 14px;
}

.membre-profile-compact {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
}

.profile-header-compact {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}

.profile-photo-mini {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
}

.profile-photo-mini img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-avatar-mini {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #9ca3af;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}

.profile-info-compact {
  display: flex;
  flex-direction: column;
}

.profile-name-compact {
  font-size: 16px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 4px;
}

.profile-matricule-compact {
  font-size: 12px;
  color: #6b7280;
  margin-bottom: 8px;
}

.profile-badges-compact {
  display: flex;
  gap: 4px;
}

.badge-mini {
  font-size: 10px;
  font-weight: 500;
  padding: 4px 6px;
  border-radius: 4px;
  color: #fff;
}

.badge-primary {
  background-color: #3b82f6;
}

.badge-success {
  background-color: #16a34a;
}

.badge-warning {
  background-color: #f59e0b;
}

.badge-danger {
  background-color: #dc2626;
}

.badge.pending {
  background: #f3f4f6;
  color: #6b7280;
}

.badge.approved {
  background: #dcfce7;
  color: #166534;
}

.badge.rejected {
  background: #fef2f2;
  color: #991b1b;
}

.info-grid-2x2 {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.info-section-compact {
  background-color: #f9fafb;
  border-radius: 8px;
  padding: 16px;
}

.section-title-compact {
  font-size: 14px;
  font-weight: 500;
  color: #4b5563;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.info-items-compact {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.info-item-mini {
  font-size: 12px;
  color: #374151;
  display: flex;
  align-items: center;
  gap: 4px;
}

.info-item-mini i {
  color: #6b7280;
}

.compact-modal {
  max-width: 700px;
}

.clickable-photo {
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.clickable-photo:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.photo-modal {
  background: white;
  border-radius: 12px;
  max-width: 90vw;
  max-height: 90vh;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  position: relative;
}

.photo-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #e5e7eb;
  background: #f9fafb;
}

.photo-modal-header h3 {
  margin: 0;
  color: #1f2937;
  font-size: 18px;
  font-weight: 600;
}

.photo-modal-content {
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f9fafb;
}

.enlarged-photo {
  max-width: 100%;
  max-height: 70vh;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
</style>
