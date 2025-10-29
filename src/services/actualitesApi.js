// Configuration spécifique pour sogetrag.com
import axios from 'axios'

// Créer une instance Axios pour sogetrag.com - Utiliser le répertoire /apistage/
const actualitesApiClient = axios.create({
  baseURL: 'https://sogetrag.com/apistage',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
})

// Intercepteur pour les requêtes
actualitesApiClient.interceptors.request.use(
  (config) => {
    console.log(`🔄 Actualités API Request: ${config.method?.toUpperCase()} ${config.url}`)
    return config
  },
  (error) => {
    console.error('❌ Actualités Request Error:', error)
    return Promise.reject(error)
  }
)

// Intercepteur pour les réponses
actualitesApiClient.interceptors.response.use(
  (response) => {
    console.log(`✅ Actualités API Response: ${response.status}`, response.data)
    return response
  },
  (error) => {
    console.error('❌ Actualités Response Error:', error.response?.data || error.message)
    return Promise.reject(error)
  }
)

// Service API pour les actualités - Compatible avec le système existant
export const actualitesApi = {
  /**
   * Récupérer la liste des actualités avec filtres et pagination
   * @param {Object} params - Paramètres de filtrage et pagination
   * @returns {Promise} Réponse de l'API
   */
  async getActualites(params = {}) {
    try {
      const response = await actualitesApiClient.get("/api-actualites.php", {
        params: {
          action: "list",
          ...params,
        },
      })
      return response.data
    } catch (error) {
      throw this.handleError(error, "Erreur lors de la récupération des actualités")
    }
  },

  /**
   * Récupérer une actualité par ID
   * @param {number} id - ID de l'actualité
   * @returns {Promise} Données de l'actualité
   */
  async getActualite(id) {
    try {
      const response = await actualitesApiClient.get("/api-actualites.php", {
        params: {
          action: "get",
          id,
        },
      })
      return response.data
    } catch (error) {
      throw this.handleError(error, "Erreur lors de la récupération de l'actualité")
    }
  },

  /**
   * Créer une nouvelle actualité
   * @param {Object} actualiteData - Données de l'actualité
   * @returns {Promise} Actualité créée
   */
  async createActualite(actualiteData) {
    try {
      const response = await actualitesApiClient.post("/api-actualites.php", actualiteData, {
        params: {
          action: "create",
        },
      })
      return response.data
    } catch (error) {
      throw this.handleError(error, "Erreur lors de la création de l'actualité")
    }
  },

  /**
   * Mettre à jour une actualité existante
   * @param {number} id - ID de l'actualité
   * @param {Object} actualiteData - Nouvelles données de l'actualité
   * @returns {Promise} Actualité mise à jour
   */
  async updateActualite(id, actualiteData) {
    try {
      const response = await actualitesApiClient.put("/api-actualites.php", actualiteData, {
        params: {
          action: "update",
          id,
        },
      })
      return response.data
    } catch (error) {
      throw this.handleError(error, "Erreur lors de la mise à jour de l'actualité")
    }
  },

  /**
   * Supprimer une actualité
   * @param {number} id - ID de l'actualité
   * @returns {Promise} Réponse de l'API
   */
  async deleteActualite(id) {
    try {
      const response = await actualitesApiClient.delete("/api-actualites.php", {
        params: {
          action: "delete",
          id,
        },
      })
      return response.data
    } catch (error) {
      throw this.handleError(error, "Erreur lors de la suppression de l'actualité")
    }
  },

  /**
   * Rechercher des actualités
   * @param {string} query - Terme de recherche
   * @param {Object} filters - Filtres additionnels
   * @returns {Promise} Résultats de recherche
   */
  async searchActualites(query, filters = {}) {
    try {
      const params = {
        action: "list",
        search: query,
        ...filters,
      }

      const response = await actualitesApiClient.get("/api-actualites.php", { params })
      return response.data
    } catch (error) {
      throw this.handleError(error, "Erreur lors de la recherche")
    }
  },

  /**
   * Récupérer les statistiques des actualités
   * @param {Object} params - Paramètres (period, etc.)
   * @returns {Promise} Statistiques
   */
  async getStats(params = {}) {
    try {
      const response = await actualitesApiClient.get("/api-actualites.php", {
        params: {
          action: "stats",
          ...params,
        },
      })
      return response.data
    } catch (error) {
      throw this.handleError(error, "Erreur lors de la récupération des statistiques")
    }
  },

  /**
   * Upload d'une image d'actualité
   * @param {File} file - Fichier image
   * @param {number} actualiteId - ID de l'actualité (optionnel)
   * @param {string} altText - Texte alternatif (optionnel)
   * @returns {Promise} URL de l'image uploadée
   */
  async uploadImage(file, actualiteId = null, altText = "") {
    try {
      const formData = new FormData()
      formData.append("image", file)

      if (actualiteId) {
        formData.append("actualite_id", actualiteId)
      }

      if (altText) {
        formData.append("alt_text", altText)
      }

      const response = await actualitesApiClient.post("/api-actualites.php", formData, {
        params: {
          action: "upload-image",
        },
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          console.log(`📤 Upload Progress: ${percentCompleted}%`)
        },
      })

      return response.data
    } catch (error) {
      throw this.handleError(error, "Erreur lors de l'upload de l'image")
    }
  },

  /**
   * Gestion des erreurs
   * @param {Error} error - Erreur capturée
   * @param {string} defaultMessage - Message par défaut
   * @returns {Error} Erreur formatée
   */
  handleError(error, defaultMessage) {
    const message = error.response?.data?.error || error.message || defaultMessage
    const statusCode = error.response?.status || 500

    const formattedError = new Error(message)
    formattedError.statusCode = statusCode
    formattedError.originalError = error

    return formattedError
  },
}

// Utilitaires pour les actualités
export const actualiteUtils = {
  /**
   * Formater les données d'actualité pour l'envoi
   * @param {Object} actualiteData - Données brutes de l'actualité
   * @returns {Object} Données formatées
   */
  formatActualiteData(actualiteData) {
    return {
      ...actualiteData,
      titre: actualiteData.titre?.trim() || '',
      type: actualiteData.type || 'ÉVÉNEMENT',
      lieu: actualiteData.lieu?.trim() || '',
      texte_affichage: actualiteData.texteAffichage?.trim() || actualiteData.texte_affichage?.trim() || '',
      texte_detaille: actualiteData.texteDetaille || actualiteData.texte_detaille || '',
      statut: actualiteData.statut || 'BROUILLON',
      photos: actualiteData.photos || [],
      // Mapping des dates
      date_debut: actualiteData.dateDebut || actualiteData.date_debut || null,
      date_fin: actualiteData.dateFin || actualiteData.date_fin || null,
      date_specifique: actualiteData.dateSpecifique || actualiteData.date_specifique || '',
    }
  },

  /**
   * Valider les données d'actualité
   * @param {Object} actualiteData - Données à valider
   * @returns {Object} Résultat de la validation
   */
  validateActualiteData(actualiteData) {
    const errors = []

    // Vérifier les champs requis avec support des deux formats (camelCase et snake_case)
    if (!actualiteData.titre || actualiteData.titre.trim() === '') {
      errors.push('Le champ titre est requis')
    }
    
    if (!actualiteData.type || actualiteData.type.trim() === '') {
      errors.push('Le champ type est requis')
    }
    
    if (!actualiteData.lieu || actualiteData.lieu.trim() === '') {
      errors.push('Le champ lieu est requis')
    }
    
    const texteAffichage = actualiteData.texteAffichage || actualiteData.texte_affichage
    if (!texteAffichage || texteAffichage.trim() === '') {
      errors.push('Le champ texte_affichage est requis')
    }
    
    const texteDetaille = actualiteData.texteDetaille || actualiteData.texte_detaille
    if (!texteDetaille || texteDetaille.trim() === '') {
      errors.push('Le champ texte_detaille est requis')
    }

    // Validation du type
    const validTypes = ['ÉVÉNEMENT', 'FORMATION', 'SÉMINAIRE', 'PARTENARIAT', 'AUTRE']
    if (actualiteData.type && !validTypes.includes(actualiteData.type)) {
      errors.push('Type d\'actualité invalide')
    }

    // Validation du statut
    const validStatuts = ['BROUILLON', 'PUBLIÉ', 'ARCHIVÉ']
    if (actualiteData.statut && !validStatuts.includes(actualiteData.statut)) {
      errors.push('Statut invalide')
    }

    // Validation des dates
    if (actualiteData.date_debut && actualiteData.date_fin) {
      const dateDebut = new Date(actualiteData.date_debut)
      const dateFin = new Date(actualiteData.date_fin)
      if (dateDebut > dateFin) {
        errors.push('La date de début doit être antérieure à la date de fin')
      }
    }

    return {
      isValid: errors.length === 0,
      errors: errors,
    }
  },

  /**
   * Formater les photos pour l'affichage
   * @param {Array} photos - Liste des photos
   * @returns {Array} Photos formatées
   */
  formatPhotos(photos) {
    if (!Array.isArray(photos)) return []
    
    return photos.map((photo, index) => ({
      id: index,
      url: photo.preview || photo.url || '',
      filename: photo.filename || `photo_${index + 1}.jpg`,
      alt: photo.alt || `Photo ${index + 1}`,
    }))
  },
}

// Export par défaut
export default actualitesApi
