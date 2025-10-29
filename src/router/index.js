// src/router/index.js
import { createRouter, createWebHistory } from "vue-router"
import Dashboard from "../components/views/Dashboard.vue"
import Messages from "../components/pages/Messages.vue"
import About from "../components/clients/Clients.vue"
import Login from "../components/login/Login.vue"
import Register from "../components/login/Register.vue"
import Historique from "../components/views/Historique.vue"
import Bureau from "../components/views/Bureau.vue"
import Chauffeurs from "../components/views/Chauffeurs.vue"
import Carburants from "../components/views/Carburants.vue"
import axios from 'axios'
import CarteMembre from "../components/views/CarteMembre.vue"
import CartePaye from "../components/views/CartePaye.vue"
import ListeMembre from "../components/views/ListeMembre.vue"
import Seminariste from "../components/views/Seminariste.vue"
import SeminairePaye from "../components/views/SeminairePaye.vue"
import Contact from "../components/views/Contact.vue"
import Organes from "../components/views/Organes.vue"
import Formations from "../components/views/Formations.vue"
import Images from "../components/views/Images.vue"
import ActualiteDetail from "../components/views/actualite-detail.vue"
import ListeSeminaire from "../components/views/ListeSeminaire.vue"
import EvaluationsManagement from "../components/views/evaluations-management.vue"
import EvaluationQuestionnaire from "../components/views/evaluation-questionnaire.vue"
import EvaluationCorrectionVue from "../components/views/evaluation-correction-vue.vue"
import CarteStatus from "../components/views/carteStatus.vue"
import Comptabilite from "../components/views/Comptabilite.vue"
import Restauration from "../components/views/Restauration.vue"
import Hebergement from "../components/views/Hebergement.vue"
import Convoi from "../components/views/Convoi.vue"
import Sante from "../components/views/Sante.vue"
import Users from "../components/views/Users.vue"
import Missions from "../components/views/Missions.vue"
import Materiel from "../components/views/Materiel.vue"
import Cloud from "../components/views/Cloud.vue"
import Carte from "../components/views/carte.vue"
import AeemciOrganes from "../components/components/Organes.vue"
import AeemciMembre from "../components/components/Membres.vue"
import ActivitesBase from "../components/components/ActivitesBase.vue"
import ActivitesCe from "../components/components/ActivitesCe.vue"
import AeemciMateriel from "../components/components/Materiel.vue"
import AeemciComptabilite from "../components/components/Comptabilite.vue"
import AeemciEcoles from "../components/components/Ecoles.vue"
import Questionnaire from "../components/components/Questionnaire.vue"
import Actualites from "../components/components/actualités.vue"

const routes = [
  {
    path: "/historique",
    name: "historique",
    component: Historique,
    meta: {
      requiresAuth: false,
      hideNavigation: false,
    },
  },
  
  {
    path: "/bureau",
    name: "bureau",
    component: Bureau,
    meta: {
      requiresAuth: false,
      hideNavigation: false,
    },
  },
  {
    path: "/restauration",
    name: "restauration",
    component: Restauration,
    meta: {
      requiresAuth: false,
      hideNavigation: false,
    },
  },
  {
    path: "/questionnaire_site",
    name: "questionnaire_site",
    component: Questionnaire,
    meta: {
      requiresAuth: false,
      hideNavigation: false,
    },
  },
  {
    path: "/hebergement",
    name: "hebergement",
    component: Hebergement,
    meta: {
      requiresAuth: false,
      hideNavigation: false,
    },
  },
  {
    path: "/sante",
    name: "sante",
    component: Sante,
    meta: {
      requiresAuth: false,
      hideNavigation: false,
    },
  },
  {
    path: "/convoi",
    name: "convoi",
    component: Convoi,
    meta: {
      requiresAuth: false,
      hideNavigation: false,
    },
  },
  {
    path: "/carte_membre",
    name: "carte_membre",
    component: CarteMembre,
    meta: {
      requiresAuth: false,
      hideNavigation: false,
    },
  },
  {
    path: "/seminaristes",
    name: "seminaristes",
    component: Seminariste,
    meta: {
      requiresAuth: false,
      hideNavigation: false,
    },
  },
  {
    path: "/comptabilite",
    name: "comptabilite",
    component: Comptabilite,
    meta: {
      requiresAuth: false,
      hideNavigation: false,
    },
  },
  {
    path: "/missions",
    name: "missions",
    component: Missions,
    meta: {
      requiresAuth: false,
      hideNavigation: false,
    },
  },
  {
    path: "/materiel",
    name: "materiel",
    component: Materiel,
    meta: {
      requiresAuth: false,
      hideNavigation: false,
    },
  },
  {
    path: "/carte",
    name: "carte",
    component: Carte,
    meta: {
      requiresAuth: false,
      hideNavigation: false,
    },
  },
  {
    path: "/cloud",
    name: "cloud",
    component: Cloud,
    meta: {
      requiresAuth: false,
      hideNavigation: false,
    },
  },
  {
    path: "/users",
    name: "users",
    component: Users,
    meta: {
      requiresAuth: false,
      hideNavigation: false,
    },
  },
  {
    path: "/liste_inscrits_carte",
    name: "liste_inscrits_carte",
    component: ListeMembre,
    meta: {
      requiresAuth: false,
      hideNavigation: false,
    },
  },
  {
    path: "/",
    name: "dashboard",
    component: Dashboard,
    meta: {
      requiresAuth: false,
      hideNavigation: false,
    },
  },
  {
    path: "/aeemci_organes",
    name: "aeemci_organes",
    component: AeemciOrganes,
    meta: {
      requiresAuth: false,
      hideNavigation: false,
    },
  },
  {
    path: "/aeemci_membres",
    name: "aeemci_membres",
    component: AeemciMembre,
    meta: {
      requiresAuth: false,
      hideNavigation: false,
    },
  },
  {
    path: "/aeemci_ecoles",
    name: "aeemci_ecoles",
    component: AeemciEcoles,
    meta: {
      requiresAuth: false,
      hideNavigation: false,
    },
  },
  {
    path: "/aeemci_actualites",
    name: "aeemci_actualites",
    component: Actualites,
    meta: {
      requiresAuth: false,
      hideNavigation: false,
    },
  },
  {
    path: "/aeemci_materiel",
    name: "aeemci_materiel",
    component: AeemciMateriel,
    meta: {
      requiresAuth: false,
      hideNavigation: false,
    },
  },
  {
    path: "/aeemci_comptabilite",
    name: "aeemci_comptebilite",
    component: AeemciComptabilite,
    meta: {
      requiresAuth: false,
      hideNavigation: false,
    },
  },
  {
    path: "/aeemci_activites_base",
    name: "aeemci_activites_base",
    component: ActivitesBase,
    meta: {
      requiresAuth: false,
      hideNavigation: false,
    },
  },
  {
    path: "/aeemci_activites_ce",
    name: "aeemci_activites_ce",
    component: ActivitesCe,
    meta: {
      requiresAuth: false,
      hideNavigation: false,
    },
  },
  {
    path: "/carte_paye/:matricule",
    name: "carte_paye",
    component: CartePaye,
    props: true, // permet de passer le paramètre à ton composant
    meta: {
      requiresAuth: false,
      hideNavigation: false,
    },
  },
  {
    path: "/seminaire_paye/:matricule",
    name: "seminaire_paye",
    component: SeminairePaye,
    props: true, // permet de passer le paramètre à ton composant
    meta: {
      requiresAuth: false,
      hideNavigation: false,
    },
  },
  {
    path: "/contact",
    name: "contact",
    component: Contact,
    meta: {
      requiresAuth: false,
      hideNavigation: false,
    },
  },
  {
    path: "/verification_carte",
    name: "verification_carte",
    component: CarteStatus,
    meta: {
      requiresAuth: false,
      hideNavigation: false,
    },
  },
  {
    path: "/evaluation_management",
    name: "evaluation_management",
    component: EvaluationsManagement,
    meta: {
      requiresAuth: false,
      hideNavigation: false,
    },
  },
  {
    path: "/evaluation_question/:id",
    name: "evaluation_question",
    component: EvaluationQuestionnaire,
    meta: {
      requiresAuth: false,
      hideNavigation: false,
    },
  },
  {
    path: '/correction',
    name: 'correction',
    component: EvaluationCorrectionVue,
    props: route => ({
      evaluationId: route.query.evaluation_id,
      matricule: route.query.matricule,
      sessionId: route.query.session_id
    })
  },
  {
    path: "/detail_actualite",
    name: "detail_actualite",
    component: ActualiteDetail,
    meta: {
      requiresAuth: false,
      hideNavigation: false,
    },
  },
  {
    path: "/images",
    name: "images",
    component: Images,
    meta: {
      requiresAuth: false,
      hideNavigation: false,
    },
  },
  {
    path: "/formations",
    name: "formations",
    component: Formations,
    meta: {
      requiresAuth: false,
      hideNavigation: false,
    },
  },
  {
    path: "/organes",
    name: "organes",
    component: Organes,
    meta: {
      requiresAuth: false,
      hideNavigation: false,
    },
  },
  {
    path: "/chauffeur",
    name: "chauffeur",
    component: Chauffeurs,
    meta: {
      requiresAuth: true,
      hideNavigation: false,
    },
  },
  {
    path: "/carburants",
    name: "carburants",
    component: Carburants,
    meta: {
      requiresAuth: true,
      hideNavigation: false,
    },
  },
  {
    path: "/messages",
    name: "messages",
    component: Messages,
    meta: {
      requiresAuth: true,
      hideNavigation: false,
    },
  },
  {
    path: "/clients",
    name: "clients",
    component: About,
    meta: {
      requiresAuth: true,
      hideNavigation: false,
    },
  },
  {
    path: "/login",
    name: "login",
    component: Login,
    meta: {
      requiresAuth: false,
      hideNavigation: true,
    },
  },
  {
    path: "/register",
    name: "register",
    component: Register,
    meta: {
      requiresAuth: false,
      hideNavigation: true,
    },
  },
  // Route de redirection pour les chemins non trouvés
  {
    path: "/:pathMatch(.*)*",
    redirect: "/",
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Configuration de l'API
const API_BASE_URL = 'https://sogetrag.com/api/auth.php'

// Store simple pour l'état d'authentification
const authStore = {
  user: null,
  isAuthenticated: false,
  lastLoginTime: null,
  
  setUser(user) {
    this.user = user
    this.isAuthenticated = true
    this.lastLoginTime = Date.now()
    localStorage.setItem('user', JSON.stringify(user))
    localStorage.setItem('lastLoginTime', this.lastLoginTime.toString())
    console.log('Utilisateur connecté:', user)
  },
  
  clearUser() {
    this.user = null
    this.isAuthenticated = false
    this.lastLoginTime = null
    localStorage.removeItem('user')
    localStorage.removeItem('lastLoginTime')
    console.log('Utilisateur déconnecté')
  },
  
  loadUser() {
    const userData = localStorage.getItem('user')
    const lastLoginTime = localStorage.getItem('lastLoginTime')
    
    if (userData && lastLoginTime) {
      try {
        this.user = JSON.parse(userData)
        this.lastLoginTime = parseInt(lastLoginTime)
        this.isAuthenticated = true
        
        // Vérifier si la session locale n'est pas trop ancienne (24h)
        const now = Date.now()
        const maxAge = 24 * 60 * 60 * 1000 // 24 heures
        
        if (now - this.lastLoginTime > maxAge) {
          console.log('Session locale expirée')
          this.clearUser()
          return false
        }
        
        console.log('Utilisateur chargé depuis localStorage:', this.user)
        return true
      } catch (error) {
        console.error('Erreur parsing user data:', error)
        this.clearUser()
        return false
      }
    }
    return false
  }
}

// Fonction pour vérifier le statut d'authentification côté serveur
async function checkServerAuth() {
  try {
    const response = await axios.get(`${API_BASE_URL}?action=check_session`, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
    console.log('Réponse serveur check_session:', response.data)
    
    if (response.data.success && response.data.authenticated) {
      // Mettre à jour les infos utilisateur si nécessaire
      if (!authStore.user || authStore.user.id !== response.data.user.id) {
        authStore.setUser(response.data.user)
      }
      return true
    } else {
      console.log('Session serveur non authentifiée')
      return false
    }
  } catch (error) {
    console.error('Erreur vérification session serveur:', error)
    // En cas d'erreur réseau, on garde l'auth locale
    return authStore.isAuthenticated
  }
}

// Fonction pour vérifier le statut d'authentification
function checkAuthStatus() {
  const hasLocalUser = authStore.loadUser()
  console.log('Auth status local:', hasLocalUser)
  return hasLocalUser
}

// Variable pour éviter les redirections multiples
let isCheckingAuth = false

// Guard de navigation pour protéger les routes
router.beforeEach(async (to, from, next) => {
  console.log(`Navigation: ${from.path} -> ${to.path}`)
  
  // Charger l'utilisateur depuis le localStorage
  const hasLocalAuth = checkAuthStatus()
  
  // Si la route nécessite une authentification
  if (to.meta.requiresAuth) {
    if (!hasLocalAuth) {
      console.log('Redirection vers login - pas d\'auth locale')
      next("/login")
      return
    }
    
    // On a une auth locale, laisser passer
    console.log('Auth locale OK, accès autorisé à:', to.path)
    next()
    
    // Vérifier côté serveur en arrière-plan SANS rediriger automatiquement
    if (!isCheckingAuth) {
      isCheckingAuth = true
      checkServerAuth().then(isServerAuth => {
        if (!isServerAuth && authStore.isAuthenticated) {
          console.log('Session serveur expirée, mais on garde l\'auth locale')
          // Optionnel: afficher une notification à l'utilisateur
          // ou forcer une re-authentification silencieuse
        }
      }).catch(error => {
        console.error('Erreur vérification serveur:', error)
      }).finally(() => {
        isCheckingAuth = false
      })
    }
  }
  // Si l'utilisateur est connecté et essaie d'accéder aux pages d'auth
  else if ((to.name === "login" || to.name === "register") && hasLocalAuth) {
    console.log('Utilisateur connecté, redirection vers dashboard')
    next("/")
  }
  // Route publique ou pas d'authentification requise
  else {
    console.log('Route publique, accès libre à:', to.path)
    next()
  }
})

// Fonction utilitaire pour déconnecter l'utilisateur
export async function logout() {
  try {
    console.log('Déconnexion en cours...')
    await axios.post(`${API_BASE_URL}?action=logout`, {}, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    console.log('Déconnexion serveur réussie')
  } catch (error) {
    console.error('Erreur lors de la déconnexion serveur:', error)
  } finally {
    authStore.clearUser()
    router.push('/login')
  }
}

// Fonction utilitaire pour obtenir l'utilisateur actuel
export function getCurrentUser() {
  return authStore.user
}

// Fonction utilitaire pour vérifier si l'utilisateur est connecté
export function isAuthenticated() {
  return authStore.isAuthenticated
}

// Fonction pour forcer une vérification serveur (optionnelle)
export async function forceServerCheck() {
  const isValid = await checkServerAuth()
  if (!isValid) {
    authStore.clearUser()
    router.push('/login')
  }
  return isValid
}

// Exporter le store pour utilisation dans les composants
export { authStore }

export default router