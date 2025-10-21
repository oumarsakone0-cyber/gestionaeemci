<template>
    <!-- Navigation fixe en haut -->
    <nav class="fixed top-0 left-0 right-0 bg-white shadow-lg border-b border-gray-200 z-50">
      <div class="max-w-full mx-auto px-6 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <button 
              @click="$router?.go(-1)"
              class="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h1 class="text-2xl font-bold text-gray-800 flex items-center">
                <svg class="w-7 h-7 text-blue-500 mr-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4z"/>
                </svg>
                Gestion des Véhicules
              </h1>
              <p class="text-sm text-gray-600">Gestion des camions et véhicules de transport</p>
            </div>
          </div>
          <div class="flex space-x-3">
            <button 
              @click="activeTab = 'nouveau'"
              class="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              Nouveau Véhicule
            </button>
          </div>
        </div>
      </div>
    </nav>
  
    <!-- Contenu principal -->
    <div class="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-50 pt-24 relative overflow-hidden">
      <!-- Animations de fond similaires à carburant.vue -->
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div class="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div class="absolute top-40 left-40 w-80 h-80 bg-slate-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        
        <!-- Petites animations supplémentaires -->
        <div class="absolute top-10 left-10 w-3 h-3 bg-blue-400 rounded-full opacity-30 animate-float-fast"></div>
        <div class="absolute top-32 right-20 w-4 h-4 bg-indigo-500 rounded-full opacity-25 animate-float-bounce"></div>
        <div class="absolute bottom-20 left-1/4 w-2 h-2 bg-cyan-500 rounded-full opacity-35 animate-float-zigzag"></div>
        <div class="absolute top-1/2 right-10 w-3 h-3 bg-blue-500 rounded-full opacity-20 animate-float-spiral"></div>
      </div>
  
      <!-- Conteneur centré sur 1300px -->
      <div class="relative z-10 p-6" style="max-width: 1300px; margin: 0 auto;">
        <!-- Onglets -->
        <div class="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div class="border-b border-gray-200">
            <nav class="flex space-x-8 px-6">
              <button
                @click="activeTab = 'liste'"
                :class="[
                  'py-4 px-1 border-b-2 font-medium text-sm transition-colors',
                  activeTab === 'liste' 
                    ? 'border-blue-500 text-blue-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                ]"
              >
                Liste des Véhicules
              </button>
              <button
                @click="activeTab = 'nouveau'"
                :class="[
                  'py-4 px-1 border-b-2 font-medium text-sm transition-colors',
                  activeTab === 'nouveau' 
                    ? 'border-blue-500 text-blue-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                ]"
              >
                Nouveau Véhicule
              </button>
            </nav>
          </div>
  
          <!-- Contenu des onglets -->
          <div class="p-6">
            <!-- Onglet Liste -->
            <div v-if="activeTab === 'liste'" class="space-y-6">
              <!-- Statistiques -->
              <div class="mb-6">
                <h3 class="text-lg font-semibold text-gray-800 mb-4">Statistiques</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div class="bg-gradient-to-r from-blue-500 to-indigo-500 p-6 rounded-xl text-white">
                    <div class="flex items-center justify-between">
                      <div>
                        <p class="text-blue-100">Total véhicules</p>
                        <p class="text-3xl font-bold">{{ stats.totalVehicules }}</p>
                      </div>
                      <svg class="w-8 h-8 text-blue-200" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4z"/>
                      </svg>
                    </div>
                  </div>
  
                  <div class="bg-gradient-to-r from-green-500 to-emerald-500 p-6 rounded-xl text-white">
                    <div class="flex items-center justify-between">
                      <div>
                        <p class="text-green-100">Véhicules actifs</p>
                        <p class="text-3xl font-bold">{{ stats.vehiculesActifs }}</p>
                      </div>
                      <svg class="w-8 h-8 text-green-200" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                    </div>
                  </div>
  
                  <div class="bg-gradient-to-r from-purple-500 to-pink-500 p-6 rounded-xl text-white">
                    <div class="flex items-center justify-between">
                      <div>
                        <p class="text-purple-100">Missions ce mois</p>
                        <p class="text-3xl font-bold">{{ stats.missionsMois }}</p>
                      </div>
                      <svg class="w-8 h-8 text-purple-200" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"/>
                        <path d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"/>
                      </svg>
                    </div>
                  </div>
  
                  <div class="bg-gradient-to-r from-amber-500 to-orange-500 p-6 rounded-xl text-white">
                    <div class="flex items-center justify-between">
                      <div>
                        <p class="text-amber-100">Poids total (kg)</p>
                        <p class="text-3xl font-bold">{{ formatNumber(stats.poidsTotal) }}</p>
                      </div>
                      <svg class="w-8 h-8 text-amber-200" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16l-3-3m3 3l3-3"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
  
              <!-- Filtres de recherche -->
              <div class="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <div class="flex items-center justify-between mb-4">
                  <h3 class="text-lg font-semibold text-gray-800">Recherche et filtres</h3>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Recherche</label>
                    <input
                      v-model="searchTerm"
                      @input="applyFilters"
                      type="text"
                      placeholder="N° immatriculation, marque..."
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Type de véhicule</label>
                    <select
                      v-model="filters.type"
                      @change="applyFilters"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Tous les types</option>
                      <option value="Camion benne">Camion benne</option>
                      <option value="Camion citerne">Camion citerne</option>
                      <option value="Camion plateau">Camion plateau</option>
                      <option value="Tracteur">Tracteur</option>
                      <option value="Autre">Autre</option>
                    </select>
                  </div>
  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Statut</label>
                    <select
                      v-model="filters.statut"
                      @change="applyFilters"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Tous les statuts</option>
                      <option value="Actif">Actif</option>
                      <option value="En maintenance">En maintenance</option>
                      <option value="Hors service">Hors service</option>
                    </select>
                  </div>
                </div>
              </div>
  
              <!-- Liste des véhicules -->
              <div class="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div class="px-6 py-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                  <h3 class="text-lg font-semibold text-gray-800">
                    Véhicules ({{ filteredVehicules.length }} résultats)
                  </h3>
                </div>
                
                <!-- État de chargement -->
                <div v-if="loadingVehicules" class="flex justify-center items-center py-12">
                  <div class="flex items-center space-x-3">
                    <svg class="animate-spin h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span class="text-gray-600">Chargement des véhicules...</span>
                  </div>
                </div>
                
                <!-- Tableau des véhicules -->
                <div v-else class="overflow-x-auto">
                  <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                      <tr>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Immatriculation
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Marque
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Missions
                        </th>
                        <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                      <tr v-for="vehicule in filteredVehicules" :key="vehicule.id" class="hover:bg-gray-50">
                        <td class="px-6 py-4 whitespace-nowrap">
                          <div class="flex items-center">
                            <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                              <svg class="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4z"/>
                              </svg>
                            </div>
                            <div class="text-sm font-medium text-gray-900">{{ vehicule.numeroImmatriculation }}</div>
                          </div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {{ vehicule.marque }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {{ vehicule.nombreMissions || 0 }} missions
                          </span>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div class="flex justify-end space-x-2">
                            <button
                              @click="viewVehicule(vehicule)"
                              class="text-blue-600 hover:text-blue-900 px-2 py-1 rounded"
                              title="Voir"
                            >
                              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            </button>
                            <button
                              @click="editVehicule(vehicule)"
                              class="text-gray-600 hover:text-gray-900 px-2 py-1 rounded"
                              title="Modifier"
                            >
                              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              @click="deleteVehicule(vehicule.id)"
                              class="text-red-600 hover:text-red-900 px-2 py-1 rounded"
                              title="Supprimer"
                            >
                              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
  
                <!-- Message si aucun véhicule -->
                <div v-if="!loadingVehicules && filteredVehicules.length === 0" class="text-center py-12">
                  <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414-2.414a1 1 0 01-.707-.293h-3.172a1 1 0 01-.707.293l-2.414 2.414A1 1 0 006.586 13H4"/>
                  </svg>
                  <h3 class="mt-2 text-sm font-medium text-gray-900">Aucun véhicule trouvé</h3>
                  <p class="mt-1 text-sm text-gray-500">Commencez par ajouter un nouveau véhicule.</p>
                </div>
              </div>
            </div>
  
            <!-- Onglet Nouveau Véhicule -->
            <div v-if="activeTab === 'nouveau'" class="space-y-6">
              <h2 class="text-2xl font-semibold text-gray-800 mb-6">Ajouter un nouveau véhicule</h2>
              
              <div class="max-w-2xl mx-auto">
                <form @submit.prevent="saveVehicule" class="space-y-6">
                  <!-- Numéro d'immatriculation -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Numéro d'immatriculation *</label>
                    <input
                      v-model="newVehicule.numeroImmatriculation"
                      type="text"
                      
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                      placeholder="Ex: AB-123-CD"
                    />
                  </div>
  
                  <!-- Marque -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Marque *</label>
                    <input
                      v-model="newVehicule.marque"
                      type="text"
                      
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                      placeholder="Ex: Mercedes, Volvo, Renault"
                    />
                  </div>
  
                  <!-- Boutons -->
                  <div class="flex justify-end space-x-4 pt-6">
                    <button
                      type="button"
                      @click="resetForm"
                      class="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      style="background-color: green;"
                      :disabled="savingVehicule"
                      class="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center disabled:opacity-50"
                    >
                      <svg v-if="savingVehicule" class="animate-spin -ml-1 mr-3 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <svg v-else class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                      </svg>
                      {{ savingVehicule ? 'Enregistrement...' : 'Enregistrer le véhicule' }}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Modal Détails Véhicule -->
      <div v-if="showVehiculeModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div class="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-medium text-gray-900">Détails du véhicule {{ selectedVehicule?.numeroImmatricule }}</h3>
            <button @click="showVehiculeModal = false" class="text-gray-400 hover:text-gray-600">
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div v-if="selectedVehicule" class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><strong>Immatriculation:</strong> {{ selectedVehicule.numeroImmatriculation }}</div>
            <div><strong>Marque:</strong> {{ selectedVehicule.marque }}</div>
            <div><strong>Modèle:</strong> {{ selectedVehicule.modele }}</div>
            <div><strong>Type:</strong> {{ selectedVehicule.type }}</div>
            <div><strong>Année:</strong> {{ selectedVehicule.annee }}</div>
            <div><strong>Capacité:</strong> {{ selectedVehicule.capacite }} kg</div>
            <div><strong>Statut:</strong> {{ selectedVehicule.statut }}</div>
            <div><strong>Châssis:</strong> {{ selectedVehicule.numeroChassis || 'Non renseigné' }}</div>
            <div><strong>Date d'achat:</strong> {{ selectedVehicule.dateAchat || 'Non renseignée' }}</div>
            <div><strong>Dernière révision:</strong> {{ selectedVehicule.derniereRevision || 'Non renseignée' }}</div>
            <div><strong>Prochaine révision:</strong> {{ selectedVehicule.prochaineRevision || 'Non renseignée' }}</div>
            <div><strong>Missions effectuées:</strong> {{ selectedVehicule.nombreMissions || 0 }}</div>
            <div class="md:col-span-2"><strong>Observations:</strong> {{ selectedVehicule.observations || 'Aucune' }}</div>
          </div>
        </div>
      </div>
  
      <!-- Modal Modification Véhicule -->
      <div v-if="showEditModal && editingVehicule" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div class="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-medium text-gray-900">Modifier le véhicule {{ editingVehicule.numeroImmatriculation }}</h3>
            <button @click="cancelEdit" class="text-gray-400 hover:text-gray-600">
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <form @submit.prevent="saveEditVehicule" class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Numéro d'immatriculation *</label>
              <input
                v-model="editingVehicule.numeroImmatriculation"
                type="text"
                
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
  
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Marque *</label>
              <input
                v-model="editingVehicule.marque"
                type="text"
                
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
  
            <div class="flex justify-end space-x-4 pt-6">
              <button
                type="button"
                @click="cancelEdit"
                class="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                :disabled="savingVehicule"
                class="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center disabled:opacity-50"
              >
                <svg v-if="savingVehicule" class="animate-spin -ml-1 mr-3 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <svg v-else class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                {{ savingVehicule ? 'Modification...' : 'Modifier le véhicule' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, reactive, computed, onMounted } from 'vue'
  import axios from 'axios'
  
  // Configuration de l'API
  const API_BASE_URL = 'https://sogetrag.com/api/bons-voyage.php'
  
  // États de chargement
  const loadingVehicules = ref(false)
  const savingVehicule = ref(false)
  
  // État des onglets
  const activeTab = ref('liste')
  
  // État des modals
  const showVehiculeModal = ref(false)
  const selectedVehicule = ref(null)
  const showEditModal = ref(false)
  const editingVehicule = ref(null)
  
  // Données
  const vehicules = ref([])
  const searchTerm = ref('')
  
  // Filtres
  const filters = reactive({
    type: '',
    statut: ''
  })
  
  // Formulaire nouveau véhicule
  const newVehicule = reactive({
    numeroImmatriculation: '',
    marque: ''
  })
  
  // Statistiques
  const stats = ref({
    totalVehicules: 0,
    vehiculesActifs: 0,
    missionsMois: 0,
    poidsTotal: 0
  })
  
  // Véhicules filtrés
  const filteredVehicules = computed(() => {
    let filtered = vehicules.value
  
    // Filtre par recherche
    if (searchTerm.value) {
      const search = searchTerm.value.toLowerCase()
      filtered = filtered.filter(v => 
        v.numeroImmatriculation.toLowerCase().includes(search) ||
        v.marque.toLowerCase().includes(search) ||
        v.modele.toLowerCase().includes(search)
      )
    }
  
    // Filtre par type
    if (filters.type) {
      filtered = filtered.filter(v => v.type === filters.type)
    }
  
    // Filtre par statut
    if (filters.statut) {
      filtered = filtered.filter(v => v.statut === filters.statut)
    }
  
    return filtered
  })
  
  // Fonction pour formater les nombres
  const formatNumber = (number) => {
    if (!number) return '0'
    return new Intl.NumberFormat('fr-FR').format(number)
  }
  
  // Cache buster
  const getCacheBuster = () => {
    return `_t=${Date.now()}&_r=${Math.random().toString(36).substr(2, 9)}`
  }
  
  // Charger les véhicules
  const fetchVehicules = async () => {
    loadingVehicules.value = true
    
    try {
      const cacheBuster = getCacheBuster()
      const response = await axios.get(`${API_BASE_URL}?action=camions&${cacheBuster}`)
      
      if (response.data.success) {
        vehicules.value = response.data.data.map(camion => ({
          id: camion.id,
          numeroImmatriculation: camion.numero_immatricule,
          marque: camion.marque || 'Non renseigné',
          modele: camion.modele || 'Non renseigné',
          type: camion.type || 'Camion benne',
          annee: camion.annee || new Date().getFullYear(),
          capacite: camion.capacite || 0,
          statut: camion.statut || 'Actif',
          numeroChassis: camion.numero_chassis || '',
          dateAchat: camion.date_achat || '',
          derniereRevision: camion.derniere_revision || '',
          prochaineRevision: camion.prochaine_revision || '',
          observations: camion.observations || '',
          nombreMissions: camion.bons_count || 0
        }))
        
        // Calculer les statistiques
        stats.value = {
          totalVehicules: vehicules.value.length,
          vehiculesActifs: vehicules.value.filter(v => v.statut === 'Actif').length,
          missionsMois: vehicules.value.reduce((sum, v) => sum + (v.nombreMissions || 0), 0),
          poidsTotal: vehicules.value.reduce((sum, v) => sum + (v.poids_total || 0), 0)
        }
      }
      
    } catch (error) {
      console.error('Erreur lors du chargement des véhicules:', error)
      // Données de test
      vehicules.value = [
        {
          id: 1,
          numeroImmatriculation: 'AB-123-CD',
          marque: 'Mercedes',
          modele: 'Actros',
          type: 'Camion benne',
          annee: 2020,
          capacite: 25000,
          statut: 'Actif',
          numeroChassis: 'WDB9634321L123456',
          dateAchat: '2020-01-15',
          derniereRevision: '2024-01-15',
          prochaineRevision: '2024-07-15',
          observations: 'Véhicule en excellent état',
          nombreMissions: 45
        },
        {
          id: 2,
          numeroImmatriculation: 'EF-456-GH',
          marque: 'Volvo',
          modele: 'FH',
          type: 'Camion citerne',
          annee: 2019,
          capacite: 30000,
          statut: 'En maintenance',
          numeroChassis: 'YV2A4D6B8KA123456',
          dateAchat: '2019-03-20',
          derniereRevision: '2023-12-10',
          prochaineRevision: '2024-06-10',
          observations: 'Révision moteur en cours',
          nombreMissions: 38
        }
      ]
      
      stats.value = {
        totalVehicules: 2,
        vehiculesActifs: 1,
        missionsMois: 83,
        poidsTotal: 125000
      }
    } finally {
      loadingVehicules.value = false
    }
  }
  
  // Appliquer les filtres
  const applyFilters = () => {
    // Les filtres sont appliqués automatiquement via computed
  }
  
  // Sauvegarder un véhicule
  const saveVehicule = async () => {
    savingVehicule.value = true
    
    try {
      const vehiculeData = {
        numero_immatricule: newVehicule.numeroImmatriculation,
        marque: newVehicule.marque
      }
      
      const response = await axios.post(`${API_BASE_URL}?action=create_camion&${getCacheBuster()}`, vehiculeData)
      
      if (response.data.success) {
        resetForm()
        activeTab.value = 'liste'
        alert('Véhicule enregistré avec succès !')
        await fetchVehicules()
      } else {
        throw new Error(response.data.error || 'Erreur lors de la sauvegarde')
      }
      
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error)
      alert('Erreur lors de la sauvegarde: ' + (error.response?.data?.error || error.message))
    } finally {
      savingVehicule.value = false
    }
  }
  
  // Réinitialiser le formulaire
  const resetForm = () => {
    newVehicule.numeroImmatriculation = ''
    newVehicule.marque = ''
  }
  
  // Voir un véhicule
  const viewVehicule = (vehicule) => {
    selectedVehicule.value = vehicule
    showVehiculeModal.value = true
  }
  
  // Modifier un véhicule
  const editVehicule = (vehicule) => {
    editingVehicule.value = { ...vehicule }
    showEditModal.value = true
  }
  
  // Sauvegarder les modifications
  const saveEditVehicule = async () => {
    if (!editingVehicule.value) return
    
    try {
      savingVehicule.value = true
      
      const vehiculeData = {
        numero_immatricule: editingVehicule.value.numeroImmatriculation,
        marque: editingVehicule.value.marque
      }
      
      const response = await axios.put(`${API_BASE_URL}?action=update_camion&id=${editingVehicule.value.id}&${getCacheBuster()}`, vehiculeData)
      
      if (response.data.success) {
        showEditModal.value = false
        editingVehicule.value = null
        alert('Véhicule modifié avec succès !')
        await fetchVehicules()
      } else {
        throw new Error(response.data.error || 'Erreur lors de la modification')
      }
      
    } catch (error) {
      console.error('Erreur lors de la modification:', error)
      alert('Erreur lors de la modification: ' + (error.response?.data?.error || error.message))
    } finally {
      savingVehicule.value = false
    }
  }
  
  // Annuler la modification
  const cancelEdit = () => {
    showEditModal.value = false
    editingVehicule.value = null
  }
  
  // Supprimer un véhicule
  const deleteVehicule = async (id) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce véhicule ?')) {
      try {
        const response = await axios.delete(`${API_BASE_URL}?action=delete_camion&id=${id}&${getCacheBuster()}`)
        
        if (response.data.success) {
          alert('Véhicule supprimé avec succès !')
          await fetchVehicules()
        } else {
          throw new Error(response.data.error || 'Erreur lors de la suppression')
        }
        
      } catch (error) {
        console.error('Erreur lors de la suppression:', error)
        alert('Erreur lors de la suppression: ' + (error.response?.data?.error || error.message))
      }
    }
  }
  
  // Navigation
  const goBack = () => {
    window.history.back()
  }
  
  // Initialisation
  onMounted(async () => {
    await fetchVehicules()
  })
  </script>
  
  <style scoped>
  /* Animations blob similaires à carburant.vue */
  @keyframes blob {
    0% { transform: translate(0px, 0px) scale(1); }
    33% { transform: translate(30px, -50px) scale(1.1); }
    66% { transform: translate(-20px, 20px) scale(0.9); }
    100% { transform: translate(0px, 0px) scale(1); }
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
  
  /* Animations supplémentaires */
  @keyframes float-fast {
    0%, 100% { transform: translateY(0px) rotate(0deg) scale(1); }
    25% { transform: translateY(-15px) rotate(90deg) scale(1.1); }
    50% { transform: translateY(-30px) rotate(180deg) scale(0.9); }
    75% { transform: translateY(-15px) rotate(270deg) scale(1.1); }
  }
  
  @keyframes float-bounce {
    0%, 100% { transform: translateY(0px) scale(1); }
    25% { transform: translateY(-20px) scale(1.2); }
    50% { transform: translateY(-40px) scale(0.8); }
    75% { transform: translateY(-20px) scale(1.2); }
  }
  
  @keyframes float-zigzag {
    0% { transform: translateX(0px) translateY(0px) rotate(0deg); }
    25% { transform: translateX(15px) translateY(-15px) rotate(90deg); }
    50% { transform: translateX(-15px) translateY(-30px) rotate(180deg); }
    75% { transform: translateX(15px) translateY(-15px) rotate(270deg); }
    100% { transform: translateX(0px) translateY(0px) rotate(360deg); }
  }
  
  @keyframes float-spiral {
    0% { transform: translateX(0px) translateY(0px) rotate(0deg) scale(1); }
    25% { transform: translateX(20px) translateY(-10px) rotate(90deg) scale(1.3); }
    50% { transform: translateX(0px) translateY(-20px) rotate(180deg) scale(0.7); }
    75% { transform: translateX(-20px) translateY(-10px) rotate(270deg) scale(1.3); }
    100% { transform: translateX(0px) translateY(0px) rotate(360deg) scale(1); }
  }
  
  .animate-float-fast { animation: float-fast 3s ease-in-out infinite; }
  .animate-float-bounce { animation: float-bounce 2.5s ease-in-out infinite; }
  .animate-float-zigzag { animation: float-zigzag 4s ease-in-out infinite; }
  .animate-float-spiral { animation: float-spiral 5s ease-in-out infinite; }
  </style>