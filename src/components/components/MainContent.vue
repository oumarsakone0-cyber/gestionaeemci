<template>
  <div class="min-h-screen bg-gray-50" style="width: 100%;">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
      <div class="max-w-full mx-auto px-8 py-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Questionnaire AEEMCI</h1>
            <p style="padding: 10px;" class="text-gray-600 mt-1">Gestion des questions et réponses</p>
          </div>
          <button
            @click="openModal()"
            class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
          >
            + Ajouter une question
          </button>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-full mx-auto px-8 py-8">
      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <p class="text-red-800">{{ error }}</p>
      </div>

      <!-- Table -->
      <div v-else class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50 border-b border-gray-200">
              <tr >
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider" style="padding: 10px;">Question</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Réponse</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Gain</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Contact</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Date Début</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Date Fin</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">État</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Progression</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-for="item in questionnaires" :key="item.id" class="hover:bg-gray-50 transition-colors">
                <td class="px-6 py-4" style="padding: 10px;">
                  <div class="text-sm font-medium text-gray-900">{{ item.question }}</div>
                </td>
                <td class="px-6 py-4">
                  <div class="text-sm text-gray-700">{{ item.reponse }}</div>
                </td>
                <td class="px-6 py-4">
                  <div class="text-sm font-semibold text-green-600">{{ item.gain }}</div>
                </td>
                <td class="px-6 py-4">
                  <a :href="`tel:${item.contact}`" class="text-sm text-blue-600 hover:text-blue-800 hover:underline">
                    {{ item.contact }}
                  </a>
                </td>
                <td class="px-6 py-4">
                  <div class="text-sm text-gray-700">
                    {{ item.debut ? formatDate(item.debut) : '-' }}
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div class="text-sm text-gray-700">{{ formatDate(item.date) }}</div>
                </td>
                <td class="px-6 py-4">
                  <span :class="getStatusClass(item.etat)" class="px-3 py-1 rounded-full text-xs font-medium">
                    {{ item.etat }}
                  </span>
                </td>
                <td class="px-6 py-4">
                  <div v-if="item.etat === 'En cours' && item.debut" class="space-y-2">
                    <div class="flex items-center gap-3">
                      <div class="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div 
                          :class="getProgressColor(calculateProgress(item.debut))"
                          class="h-full transition-all duration-1000 ease-linear"
                          :style="{ width: `${calculateProgress(item.debut)}%` }"
                        ></div>
                      </div>
                      <span class="text-xs font-medium text-gray-700 min-w-[45px]">
                        {{ calculateProgress(item.debut) }}%
                      </span>
                    </div>
                    <div class="text-xs text-gray-600 font-mono">
                      ⏱️ {{ formatTimeRemaining(item.debut) }}
                    </div>
                  </div>
                  <div v-else class="text-sm text-gray-400">-</div>
                </td>
                <td class="px-6 py-4" style="padding: 10px;">
                  <div class="flex items-center gap-2">
                    <button
                      v-if="item.etat !== 'En cours'"
                      @click="startTimer(item.id)"
                      class="px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                      title="Démarrer le compte à rebours"
                    >
                      ▶️ Démarrer
                    </button>
                    <button
                      @click="openModal(item)"
                      class="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      Modifier
                    </button>
                    <button
                      @click="deleteQuestionnaire(item.id)"
                      class="px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                    >
                      Supprimer
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>

    <!-- Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" style="padding: 15px;">
        <div class="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 class="text-2xl font-bold text-gray-900">
            {{ editingItem ? 'Modifier la question' : 'Ajouter une question' }}
          </h2>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600 text-2xl">×</button>
        </div>

        <form @submit.prevent="saveQuestionnaire" class="p-6 space-y-5">
          <div>
            <label style="padding: 10px;" class="block text-sm font-semibold text-gray-700 mb-2">Question *</label>
            <textarea
            style="padding: 5px; margin: 10px;"
              v-model="formData.question"
              required
              rows="3"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Entrez la question..."
            ></textarea>
          </div>

          <div>
            <label style="padding: 10px;" class="block text-sm font-semibold text-gray-700 mb-2">Réponse *</label>
            <textarea
            style="padding: 5px; margin: 10px;"
              v-model="formData.reponse"
              required
              rows="3"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Entrez la réponse..."
            ></textarea>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label style="padding: 10px;" class="block text-sm font-semibold text-gray-700 mb-2">Gain *</label>
              <input
              style="padding: 5px; margin: 10px;"
                v-model="formData.gain"
                type="text"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: 1000 FCFA"
              />
            </div>

            <div>
              <label style="padding: 10px;" class="block text-sm font-semibold text-gray-700 mb-2">Contact *</label>
              <input
              style="padding: 5px; margin: 10px;"
                v-model="formData.contact"
                type="tel"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: +225 07 XX XX XX XX"
              />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label style="padding: 10px;" class="block text-sm font-semibold text-gray-700 mb-2">Date de fin *</label>
              <input
              style="padding: 5px; margin: 10px;"
                v-model="formData.date"
                type="datetime-local"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label style="padding: 10px;" class="block text-sm font-semibold text-gray-700 mb-2">État *</label>
              <select
              style="padding: 5px; margin: 10px;"
                v-model="formData.etat"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="En attente">En attente</option>
                <option value="En cours">En cours</option>
                <option value="Terminé">Terminé</option>
                <option value="Annulé">Annulé</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4" v-if="editingItem">
            <div>
              <label style="padding: 10px;" class="block text-sm font-semibold text-gray-700 mb-2">Matricule Gagnant *</label>
              <input
              style="padding: 5px; margin: 10px;"
                v-model="formData.repondu"
                type="text"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="SAK-ONE-01-001"
              />
            </div>
          </div>

          <div class="flex gap-3 pt-4">
            <button
              type="submit"
              :disabled="saving"
              class="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ saving ? 'Enregistrement...' : (editingItem ? 'Mettre à jour' : 'Ajouter') }}
            </button>
            <button
              type="button"
              @click="closeModal"
              class="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const API_URL = 'https://www.sogetrag.com/api/questionnaire.php'

const questionnaires = ref([])
const showModal = ref(false)
const editingItem = ref(null)
const loading = ref(false)
const saving = ref(false)
const error = ref(null)

const formData = ref({
  question: '',
  reponse: '',
  gain: '',
  date: '',
  etat: 'En attente',
  contact: '',
  repondu: ''
})

let progressInterval = null

// Fetch questionnaires from API
const fetchQuestionnaires = async () => {
  loading.value = true
  error.value = null

  try {
    const cacheBuster = Math.random().toString(36).substring(2) // ou Date.now()
    const response = await fetch(`${API_URL}?action=questionnaires&cb=${cacheBuster}`)
    
    const data = await response.json()

    if (data.success) {
      questionnaires.value = data.data
    } else {
      error.value = data.message || 'Erreur lors du chargement des questionnaires'
    }
  } catch (err) {
    console.error('[v0] Error fetching questionnaires:', err)
    error.value = 'Erreur de connexion à l\'API'
  } finally {
    loading.value = false
  }
}


// Create or update questionnaire
const saveQuestionnaire = async () => {
  saving.value = true
  error.value = null

  try {
    const isUpdate = !!editingItem.value
    const action = isUpdate ? 'update' : 'create'

    // Construire l'URL avec l'action, et l'id uniquement si c'est une mise à jour
    let url = `${API_URL}?action=${action}`
    if (isUpdate) {
      url += `&id=${editingItem.value.id}`
    }

    // Préparer les données sans inclure l'id (puisqu'il est dans l'URL pour update)
    const payload = {
      ...formData.value
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    })

    const data = await response.json()

    if (data.success) {
      await fetchQuestionnaires()
      closeModal()
    } else {
      error.value = data.message || 'Erreur lors de l\'enregistrement'
    }
  } catch (err) {
    console.error('[v0] Error saving questionnaire:', err)
    error.value = 'Erreur de connexion à l\'API'
  } finally {
    saving.value = false
  }
}

// Delete questionnaire
const deleteQuestionnaire = async (id) => {
  if (!confirm('Êtes-vous sûr de vouloir supprimer cette question ?')) {
    return
  }

  try {
    const cacheBuster = Math.random().toString(36).substring(2) // pour éviter le cache
    const url = `${API_URL}?action=delete&id=${id}&cb=${cacheBuster}`

    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: null // plus besoin d’envoyer de données dans le corps
    })

    const data = await response.json()

    if (data.success) {
      await fetchQuestionnaires()
    } else {
      error.value = data.message || 'Erreur lors de la suppression'
    }
  } catch (err) {
    console.error('[v0] Error deleting questionnaire:', err)
    error.value = 'Erreur de connexion à l\'API'
  }
}

// Start timer
const startTimer = async (id) => {
  try {
    const cacheBuster = Math.random().toString(36).substring(2)
    const url = `${API_URL}?action=start_timer&id=${id}&cb=${cacheBuster}`

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: null // 👈 aucun body n’est nécessaire dans ce cas
    })

    const data = await response.json()

    if (data.success) {
      await fetchQuestionnaires()
    } else {
      error.value = data.message || 'Erreur lors du démarrage du timer'
    }
  } catch (err) {
    console.error('[v0] Error starting timer:', err)
    error.value = 'Erreur de connexion à l\'API'
  }
}


const openModal = (item = null) => {
  editingItem.value = item
  if (item) {
    formData.value = {
      question: item.question,
      reponse: item.reponse,
      gain: item.gain,
      date: item.date ? item.date.replace(' ', 'T').substring(0, 16) : '',
      etat: item.etat,
      contact: item.contact
    }
  } else {
    formData.value = {
      question: '',
      reponse: '',
      gain: '',
      date: '',
      etat: 'En attente',
      contact: ''
    }
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  editingItem.value = null
}

const calculateProgress = (debutDate) => {
  if (!debutDate) return 0
  
  const debut = new Date(debutDate)
  const now = new Date()
  const elapsed = (now - debut) / 1000 // seconds
  const total = 15 * 60 // 15 minutes in seconds
  
  const progress = Math.min(Math.round((elapsed / total) * 100), 100)
  return progress
}

const formatTimeRemaining = (debutDate) => {
  if (!debutDate) return '15:00'
  
  const debut = new Date(debutDate)
  const now = new Date()
  const elapsed = (now - debut) / 1000 // seconds
  const total = 15 * 60 // 15 minutes in seconds
  const remaining = Math.max(total - elapsed, 0)
  
  const minutes = Math.floor(remaining / 60)
  const seconds = Math.floor(remaining % 60)
  
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}

const getProgressColor = (progress) => {
  if (progress < 50) return 'bg-blue-500'
  if (progress < 80) return 'bg-yellow-500'
  return 'bg-red-500'
}

const getStatusClass = (status) => {
  const classes = {
    'En cours': 'bg-blue-100 text-blue-800',
    'Terminé': 'bg-green-100 text-green-800',
    'En attente': 'bg-yellow-100 text-yellow-800',
    'Annulé': 'bg-red-100 text-red-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleString('fr-FR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(() => {
  fetchQuestionnaires()
  
  // Update progress every second
  progressInterval = setInterval(() => {
    // Force reactivity update for progress bars
    questionnaires.value = [...questionnaires.value]
  }, 1000)
})

onUnmounted(() => {
  if (progressInterval) {
    clearInterval(progressInterval)
  }
})
</script>