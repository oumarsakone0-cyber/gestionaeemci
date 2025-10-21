<template>
    <div class="missions-wrapper">
      <div class="missions-container">
        <!-- Header Section -->
        <div class="missions-header animate-slide">
          <div class="header-content">
            <div class="title-section">
              <h1>Gestion des Missions</h1>
              <p>Suivi et attribution des missions aux membres de l'AEEMCI</p>
            </div>
            <div class="header-actions">
              <button class="action-btn primary" @click="openCreateMissionDialog">
                <PlusIcon class="btn-icon" />
                Nouvelle Mission
              </button>
              <button class="action-btn secondary" @click="exportMissions">
                <DownloadIcon class="btn-icon" />
                Exporter
              </button>
            </div>
          </div>
        </div>
  
        <!-- Statistics Cards -->
        <div class="stats-section">
          <div class="stat-cards">
            <div class="stat-card primary animate-pop">
              <div class="card-icon">
                <ClipboardListIcon class="icon" />
              </div>
              <div class="card-content">
                <h3>{{ totalMissions }}</h3>
                <p>Total des Missions</p>
                <div class="card-trend neutral">
                  <InfoIcon class="trend-icon" />
                  <span>{{ totalTasks }} tâches</span>
                </div>
              </div>
            </div>
  
            <div class="stat-card secondary animate-pop-delay-1">
              <div class="card-icon">
                <PlayIcon class="icon" />
              </div>
              <div class="card-content">
                <h3>{{ activeMissions }}</h3>
                <p>Missions Actives</p>
                <div class="card-trend positive">
                  <TrendingUpIcon class="trend-icon" />
                  <span>En cours</span>
                </div>
              </div>
            </div>
  
            <div class="stat-card tertiary animate-pop-delay-2">
              <div class="card-icon">
                <CheckCircleIcon class="icon" />
              </div>
              <div class="card-content">
                <h3>{{ completedMissions }}</h3>
                <p>Missions Terminées</p>
                <div class="card-trend positive">
                  <CheckIcon class="trend-icon" />
                  <span>Ce mois</span>
                </div>
              </div>
            </div>
  
            <div class="stat-card quaternary animate-pop-delay-3">
              <div class="card-icon">
                <AlertTriangleIcon class="icon" />
              </div>
              <div class="card-content">
                <h3>{{ overdueMissions }}</h3>
                <p>Missions en Retard</p>
                <div class="card-trend negative">
                  <ClockIcon class="trend-icon" />
                  <span>À traiter</span>
                </div>
              </div>
            </div>
          </div>
        </div>
  
        <!-- Filters and Search -->
        <div class="filters-section">
          <div class="search-container">
            <SearchIcon class="search-icon" />
            <input 
              type="text" 
              placeholder="Rechercher une mission..." 
              class="search-input"
              v-model="searchTerm"
              @input="filterMissions"
            />
          </div>
          <select class="filter-select" v-model="selectedStatus" @change="filterMissions">
            <option value="">Tous les statuts</option>
            <option value="draft">Brouillon</option>
            <option value="assigned">Assignée</option>
            <option value="in_progress">En cours</option>
            <option value="completed">Terminée</option>
            <option value="overdue">En retard</option>
          </select>
          <select class="filter-select" v-model="selectedPriority" @change="filterMissions">
            <option value="">Toutes les priorités</option>
            <option value="low">Faible</option>
            <option value="medium">Moyenne</option>
            <option value="high">Élevée</option>
            <option value="urgent">Urgente</option>
          </select>
        </div>
  
        <!-- Missions Table -->
        <div class="table-wrapper">
          <div class="table-header">
            <h2 class="table-title animate-slide">Liste des Missions</h2>
            <div class="table-summary">
              {{ filteredMissions.length }} mission(s) • 
              {{ activeMissions }} active(s) • 
              {{ completedMissions }} terminée(s)
            </div>
          </div>
          
          <div class="table-container">
            <table class="missions-table animate-fade">
              <thead>
                <tr>
                  <th @click="sortBy('title')" class="sortable">
                    Mission
                    <ChevronUpIcon v-if="sortField === 'title' && sortOrder === 'asc'" class="sort-icon" />
                    <ChevronDownIcon v-if="sortField === 'title' && sortOrder === 'desc'" class="sort-icon" />
                  </th>
                  <th>Responsable</th>
                  <th>Équipe</th>
                  <th>Priorité</th>
                  <th @click="sortBy('status')" class="sortable">
                    Statut
                    <ChevronUpIcon v-if="sortField === 'status' && sortOrder === 'asc'" class="sort-icon" />
                    <ChevronDownIcon v-if="sortField === 'status' && sortOrder === 'desc'" class="sort-icon" />
                  </th>
                  <th>Progression</th>
                  <th @click="sortBy('dueDate')" class="sortable">
                    Échéance
                    <ChevronUpIcon v-if="sortField === 'dueDate' && sortOrder === 'asc'" class="sort-icon" />
                    <ChevronDownIcon v-if="sortField === 'dueDate' && sortOrder === 'desc'" class="sort-icon" />
                  </th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr 
                  v-for="mission in paginatedMissions" 
                  :key="mission.id" 
                  class="row-hover"
                >
                  <td>
                    <div class="mission-cell">
                      <strong class="mission-title">{{ mission.title }}</strong>
                      <small class="mission-description">{{ mission.description.substring(0, 80) }}...</small>
                      <div class="mission-stats">
                        <span class="stat-item">
                          <ListIcon class="stat-icon" />
                          {{ mission.tasks.length }} tâche(s)
                        </span>
                        <span class="stat-item">
                          <CalendarIcon class="stat-icon" />
                          {{ formatDate(mission.createdAt) }}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div class="user-cell" v-if="mission.responsible">
                      <img 
                        :src="mission.responsible.avatar" 
                        :alt="mission.responsible.name"
                        class="user-avatar"
                      />
                      <div class="user-details">
                        <strong>{{ mission.responsible.name }}</strong>
                        <small>{{ mission.responsible.role }}</small>
                      </div>
                    </div>
                    <span v-else class="no-assignee">Non assigné</span>
                  </td>
                  <td>
                    <div class="team-avatars">
                      <img 
                        v-for="member in mission.team.slice(0, 3)" 
                        :key="member.id"
                        :src="member.avatar" 
                        :alt="member.name"
                        class="team-avatar"
                        :title="member.name"
                      />
                      <span v-if="mission.team.length > 3" class="more-members">
                        +{{ mission.team.length - 3 }}
                      </span>
                    </div>
                  </td>
                  <td>
                    <span class="priority-badge" :class="mission.priority">
                      <div class="priority-dot"></div>
                      {{ getPriorityText(mission.priority) }}
                    </span>
                  </td>
                  <td>
                    <span class="status-badge" :class="mission.status">
                      {{ getStatusText(mission.status) }}
                    </span>
                  </td>
                  <td>
                    <div class="progress-cell">
                      <div class="progress-bar">
                        <div 
                          class="progress-fill" 
                          :style="{ width: `${mission.progress}%` }"
                          :class="getProgressClass(mission.progress)"
                        ></div>
                      </div>
                      <span class="progress-text">{{ mission.progress }}%</span>
                    </div>
                  </td>
                  <td>
                    <div class="date-cell">
                      <span class="date">{{ formatDate(mission.dueDate) }}</span>
                      <span class="days-left" :class="getDaysLeftClass(mission.dueDate)">
                        {{ getDaysLeft(mission.dueDate) }}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div class="action-buttons">
                      <button class="action-btn-small view" @click="openMissionDetails(mission)" title="Voir détails">
                        <EyeIcon class="action-icon" />
                      </button>
                      <button class="action-btn-small edit" @click="editMission(mission)" title="Modifier">
                        <EditIcon class="action-icon" />
                      </button>
                      <button class="action-btn-small tasks" @click="openTasksDialog(mission)" title="Gérer les tâches">
                        <ListIcon class="action-icon" />
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
  
          <!-- Pagination -->
          <div class="pagination" v-if="totalPages > 1">
            <button 
              @click="currentPage = Math.max(1, currentPage - 1)"
              :disabled="currentPage === 1"
              class="pagination-btn"
            >
              <ChevronLeftIcon class="pagination-icon" />
            </button>
            <span class="pagination-info">
              Page {{ currentPage }} sur {{ totalPages }}
            </span>
            <button 
              @click="currentPage = Math.min(totalPages, currentPage + 1)"
              :disabled="currentPage === totalPages"
              class="pagination-btn"
            >
              <ChevronRightIcon class="pagination-icon" />
            </button>
          </div>
        </div>
      </div>
  
      <!-- Create/Edit Mission Dialog -->
      <div v-if="missionDialog" class="dialog-overlay" @click="closeMissionDialog">
        <div class="dialog-box large" @click.stop>
          <div class="dialog-header">
            <h3>{{ editingMission ? 'Modifier la Mission' : 'Nouvelle Mission' }}</h3>
            <button class="close-btn" @click="closeMissionDialog">
              <XIcon class="close-icon" />
            </button>
          </div>
          <div class="dialog-content">
            <form @submit.prevent="saveMission">
              <div class="form-group">
                <label>Titre de la mission *</label>
                <input 
                  type="text" 
                  v-model="missionForm.title"
                  placeholder="Ex: Organisation de l'événement culturel..."
                  required 
                />
              </div>
              
              <div class="form-group">
                <label>Description détaillée *</label>
                <textarea 
                  v-model="missionForm.description"
                  placeholder="Description complète de la mission, objectifs, livrables attendus..."
                  rows="4"
                  required
                ></textarea>
              </div>
              
              <div class="form-row">
                <div class="form-group">
                  <label>Priorité *</label>
                  <select v-model="missionForm.priority" required>
                    <option value="">Choisir la priorité</option>
                    <option value="low">Faible</option>
                    <option value="medium">Moyenne</option>
                    <option value="high">Élevée</option>
                    <option value="urgent">Urgente</option>
                  </select>
                </div>
                <div class="form-group">
                  <label>Date d'échéance *</label>
                  <input 
                    type="date" 
                    v-model="missionForm.dueDate"
                    :min="today"
                    required 
                  />
                </div>
              </div>
              
              <div class="form-group">
                <label>Responsable principal *</label>
                <select v-model="missionForm.responsibleId" required>
                  <option value="">Sélectionner un responsable</option>
                  <option 
                    v-for="member in members" 
                    :key="member.id" 
                    :value="member.id"
                  >
                    {{ member.name }} - {{ member.role }}
                  </option>
                </select>
              </div>
              
              <div class="form-group">
                <label>Membres de l'équipe</label>
                <div class="team-selection">
                  <div 
                    v-for="member in members" 
                    :key="member.id" 
                    class="member-checkbox"
                  >
                    <input 
                      type="checkbox" 
                      :id="'member-' + member.id"
                      :value="member.id"
                      v-model="missionForm.teamIds"
                    />
                    <label :for="'member-' + member.id" class="member-label">
                      <img :src="member.avatar" :alt="member.name" class="member-avatar" />
                      <div class="member-info">
                        <strong>{{ member.name }}</strong>
                        <small>{{ member.role }}</small>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
              
              <div class="form-group">
                <label>Instructions spéciales</label>
                <textarea 
                  v-model="missionForm.instructions"
                  placeholder="Instructions particulières, ressources nécessaires, contacts..."
                  rows="3"
                ></textarea>
              </div>
              
              <div class="dialog-actions">
                <button type="submit" class="dialog-btn save">
                  <SaveIcon class="button-icon" />
                  {{ editingMission ? 'Mettre à jour' : 'Créer la mission' }}
                </button>
                <button type="button" class="dialog-btn cancel" @click="closeMissionDialog">
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
  
      <!-- Mission Details Dialog -->
      <div v-if="detailsDialog" class="dialog-overlay" @click="closeDetailsDialog">
        <div class="dialog-box extra-large" @click.stop>
          <div class="dialog-header">
            <h3>{{ selectedMission?.title }}</h3>
            <div class="header-actions">
              <button class="action-btn small primary" @click="openTasksDialog(selectedMission)">
                <ListIcon class="btn-icon" />
                Gérer les tâches
              </button>
              <button class="close-btn" @click="closeDetailsDialog">
                <XIcon class="close-icon" />
              </button>
            </div>
          </div>
          <div class="dialog-content">
            <div class="mission-details" v-if="selectedMission">
              <!-- Mission Info -->
              <div class="details-section">
                <h4>Informations de la mission</h4>
                <div class="info-grid">
                  <div class="info-item">
                    <label>Statut:</label>
                    <span class="status-badge" :class="selectedMission.status">
                      {{ getStatusText(selectedMission.status) }}
                    </span>
                  </div>
                  <div class="info-item">
                    <label>Priorité:</label>
                    <span class="priority-badge" :class="selectedMission.priority">
                      {{ getPriorityText(selectedMission.priority) }}
                    </span>
                  </div>
                  <div class="info-item">
                    <label>Progression:</label>
                    <span>{{ selectedMission.progress }}%</span>
                  </div>
                  <div class="info-item">
                    <label>Créée le:</label>
                    <span>{{ formatDate(selectedMission.createdAt) }}</span>
                  </div>
                  <div class="info-item">
                    <label>Échéance:</label>
                    <span>{{ formatDate(selectedMission.dueDate) }}</span>
                  </div>
                  <div class="info-item">
                    <label>Tâches:</label>
                    <span>{{ selectedMission.tasks.length }} tâche(s)</span>
                  </div>
                </div>
              </div>
  
              <!-- Team -->
              <div class="details-section">
                <h4>Équipe</h4>
                <div class="team-grid">
                  <div class="team-member responsible" v-if="selectedMission.responsible">
                    <img :src="selectedMission.responsible.avatar" :alt="selectedMission.responsible.name" class="team-member-avatar" />
                    <div class="team-member-info">
                      <strong>{{ selectedMission.responsible.name }}</strong>
                      <small>{{ selectedMission.responsible.role }}</small>
                      <span class="member-role">Responsable</span>
                    </div>
                  </div>
                  <div 
                    v-for="member in selectedMission.team" 
                    :key="member.id" 
                    class="team-member"
                  >
                    <img :src="member.avatar" :alt="member.name" class="team-member-avatar" />
                    <div class="team-member-info">
                      <strong>{{ member.name }}</strong>
                      <small>{{ member.role }}</small>
                      <span class="member-role">Membre</span>
                    </div>
                  </div>
                </div>
              </div>
  
              <!-- Description -->
              <div class="details-section">
                <h4>Description</h4>
                <p class="mission-description-full">{{ selectedMission.description }}</p>
                <div v-if="selectedMission.instructions" class="instructions">
                  <h5>Instructions spéciales:</h5>
                  <p>{{ selectedMission.instructions }}</p>
                </div>
              </div>
  
              <!-- Tasks Summary -->
              <div class="details-section">
                <h4>Résumé des tâches</h4>
                <div class="tasks-summary">
                  <div class="summary-item">
                    <span class="summary-label">Total:</span>
                    <span class="summary-value">{{ selectedMission.tasks.length }}</span>
                  </div>
                  <div class="summary-item">
                    <span class="summary-label">En cours:</span>
                    <span class="summary-value">{{ selectedMission.tasks.filter(t => t.status === 'in_progress').length }}</span>
                  </div>
                  <div class="summary-item">
                    <span class="summary-label">Terminées:</span>
                    <span class="summary-value">{{ selectedMission.tasks.filter(t => t.status === 'completed').length }}</span>
                  </div>
                  <div class="summary-item">
                    <span class="summary-label">Temps total:</span>
                    <span class="summary-value">{{ getTotalDuration(selectedMission.tasks) }}h</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Tasks Management Dialog -->
      <div v-if="tasksDialog" class="dialog-overlay" @click="closeTasksDialog">
        <div class="dialog-box extra-large" @click.stop>
          <div class="dialog-header">
            <h3>Tâches - {{ selectedMission?.title }}</h3>
            <div class="header-actions">
              <button class="action-btn small primary" @click="openCreateTaskDialog">
                <PlusIcon class="btn-icon" />
                Nouvelle tâche
              </button>
              <button class="close-btn" @click="closeTasksDialog">
                <XIcon class="close-icon" />
              </button>
            </div>
          </div>
          <div class="dialog-content">
            <div class="tasks-container" v-if="selectedMission">
              <!-- Tasks Table -->
              <div class="tasks-table-wrapper">
                <table class="tasks-table">
                  <thead>
                    <tr>
                      <th>Tâche</th>
                      <th>Assigné à</th>
                      <th>Statut</th>
                      <th>Durée</th>
                      <th>Échéance</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="task in selectedMission.tasks" :key="task.id" class="task-row">
                      <td>
                        <div class="task-cell">
                          <strong>{{ task.title }}</strong>
                          <small v-if="task.description">{{ task.description }}</small>
                        </div>
                      </td>
                      <td>
                        <div class="user-cell" v-if="task.assignee">
                          <img :src="task.assignee.avatar" :alt="task.assignee.name" class="user-avatar small" />
                          <div class="user-details">
                            <strong>{{ task.assignee.name }}</strong>
                            <small>{{ task.assignee.role }}</small>
                          </div>
                        </div>
                        <button v-else class="assign-btn" @click="assignTask(task)">
                          <UserPlusIcon class="assign-icon" />
                          S'assigner
                        </button>
                      </td>
                      <td>
                        <span class="task-status-badge" :class="task.status">
                          {{ getTaskStatusText(task.status) }}
                        </span>
                      </td>
                      <td>
                        <span class="duration">{{ task.duration || 0 }}h</span>
                      </td>
                      <td>
                        <span class="task-date">{{ formatDate(task.dueDate) }}</span>
                      </td>
                      <td>
                        <div class="task-actions">
                          <button 
                            v-if="canUpdateTask(task)" 
                            class="task-action-btn update" 
                            @click="openTaskUpdateDialog(task)"
                            title="Mettre à jour"
                          >
                            <EditIcon class="task-action-icon" />
                          </button>
                          <button 
                            class="task-action-btn view" 
                            @click="viewTaskDetails(task)"
                            title="Voir détails"
                          >
                            <EyeIcon class="task-action-icon" />
                          </button>
                          <button 
                            class="task-action-btn delete" 
                            @click="deleteTask(task)"
                            title="Supprimer"
                          >
                            <TrashIcon class="task-action-icon" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
                
                <div v-if="selectedMission.tasks.length === 0" class="no-tasks">
                  <ListIcon class="no-tasks-icon" />
                  <p>Aucune tâche créée pour cette mission</p>
                  <button class="create-task-btn" @click="openCreateTaskDialog">
                    <PlusIcon class="btn-icon" />
                    Créer la première tâche
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Create/Edit Task Dialog -->
      <div v-if="taskDialog" class="dialog-overlay" @click="closeTaskDialog">
        <div class="dialog-box" @click.stop>
          <div class="dialog-header">
            <h3>{{ editingTask ? 'Modifier la Tâche' : 'Nouvelle Tâche' }}</h3>
            <button class="close-btn" @click="closeTaskDialog">
              <XIcon class="close-icon" />
            </button>
          </div>
          <div class="dialog-content">
            <form @submit.prevent="saveTask">
              <div class="form-group">
                <label>Titre de la tâche *</label>
                <input 
                  type="text" 
                  v-model="taskForm.title"
                  placeholder="Ex: Réserver la salle..."
                  required 
                />
              </div>
              
              <div class="form-group">
                <label>Description</label>
                <textarea 
                  v-model="taskForm.description"
                  placeholder="Description détaillée de la tâche..."
                  rows="3"
                ></textarea>
              </div>
              
              <div class="form-row">
                <div class="form-group">
                  <label>Assigner à</label>
                  <select v-model="taskForm.assigneeId">
                    <option value="">Non assigné</option>
                    <option 
                      v-for="member in getAvailableMembers()" 
                      :key="member.id" 
                      :value="member.id"
                    >
                      {{ member.name }} - {{ member.role }}
                    </option>
                  </select>
                </div>
                <div class="form-group">
                  <label>Date d'échéance *</label>
                  <input 
                    type="date" 
                    v-model="taskForm.dueDate"
                    :min="today"
                    :max="selectedMission?.dueDate ? formatDateForInput(selectedMission.dueDate) : ''"
                    required 
                  />
                </div>
              </div>
              
              <div class="dialog-actions">
                <button type="submit" class="dialog-btn save">
                  <SaveIcon class="button-icon" />
                  {{ editingTask ? 'Mettre à jour' : 'Créer la tâche' }}
                </button>
                <button type="button" class="dialog-btn cancel" @click="closeTaskDialog">
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
  
      <!-- Task Update Dialog -->
      <div v-if="taskUpdateDialog" class="dialog-overlay" @click="closeTaskUpdateDialog">
        <div class="dialog-box" @click.stop>
          <div class="dialog-header">
            <h3>Mettre à jour la tâche</h3>
            <button class="close-btn" @click="closeTaskUpdateDialog">
              <XIcon class="close-icon" />
            </button>
          </div>
          <div class="dialog-content">
            <form @submit.prevent="saveTaskUpdate">
              <div class="form-group">
                <label>Tâche: {{ selectedTask?.title }}</label>
                <div class="task-info">
                  <span class="task-status-badge" :class="selectedTask?.status">
                    {{ getTaskStatusText(selectedTask?.status) }}
                  </span>
                </div>
              </div>
              
              <div class="form-group">
                <label>Rapport d'activité *</label>
                <textarea 
                  v-model="taskUpdateForm.report"
                  placeholder="Décrivez ce qui a été fait, les difficultés rencontrées, les résultats obtenus..."
                  rows="4"
                  required
                ></textarea>
              </div>
              
              <div class="form-row">
                <div class="form-group">
                  <label>Durée réalisée (heures) *</label>
                  <input 
                    type="number" 
                    v-model="taskUpdateForm.duration"
                    placeholder="0"
                    min="0"
                    step="0.5"
                    required 
                  />
                </div>
                <div class="form-group">
                  <label>Nouveau statut *</label>
                  <select v-model="taskUpdateForm.status" required>
                    <option value="in_progress">En cours</option>
                    <option value="completed">Terminée</option>
                    <option value="cancelled">Annulée</option>
                  </select>
                </div>
              </div>
              
              <div class="dialog-actions">
                <button type="submit" class="dialog-btn save">
                  <SaveIcon class="button-icon" />
                  Enregistrer la mise à jour
                </button>
                <button type="button" class="dialog-btn cancel" @click="closeTaskUpdateDialog">
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
  
      <!-- Task Details Dialog -->
      <div v-if="taskDetailsDialog" class="dialog-overlay" @click="closeTaskDetailsDialog">
        <div class="dialog-box large" @click.stop>
          <div class="dialog-header">
            <h3>{{ selectedTask?.title }}</h3>
            <button class="close-btn" @click="closeTaskDetailsDialog">
              <XIcon class="close-icon" />
            </button>
          </div>
          <div class="dialog-content">
            <div class="task-details" v-if="selectedTask">
              <!-- Task Info -->
              <div class="details-section">
                <h4>Informations de la tâche</h4>
                <div class="info-grid">
                  <div class="info-item">
                    <label>Statut:</label>
                    <span class="task-status-badge" :class="selectedTask.status">
                      {{ getTaskStatusText(selectedTask.status) }}
                    </span>
                  </div>
                  <div class="info-item">
                    <label>Assignée à:</label>
                    <div v-if="selectedTask.assignee" class="assignee-details">
                      <img :src="selectedTask.assignee.avatar" :alt="selectedTask.assignee.name" class="mini-avatar" />
                      <span>{{ selectedTask.assignee.name }}</span>
                    </div>
                    <span v-else>Non assignée</span>
                  </div>
                  <div class="info-item">
                    <label>Durée réalisée:</label>
                    <span>{{ selectedTask.duration || 0 }}h</span>
                  </div>
                  <div class="info-item">
                    <label>Créée le:</label>
                    <span>{{ formatDate(selectedTask.createdAt) }}</span>
                  </div>
                  <div class="info-item">
                    <label>Échéance:</label>
                    <span>{{ formatDate(selectedTask.dueDate) }}</span>
                  </div>
                  <div class="info-item">
                    <label>Mises à jour:</label>
                    <span>{{ selectedTask.updates?.length || 0 }}</span>
                  </div>
                </div>
              </div>
  
              <!-- Description -->
              <div class="details-section" v-if="selectedTask.description">
                <h4>Description</h4>
                <p>{{ selectedTask.description }}</p>
              </div>
  
              <!-- Updates Timeline -->
              <div class="details-section">
                <h4>Historique des mises à jour</h4>
                <div class="timeline" v-if="selectedTask.updates && selectedTask.updates.length > 0">
                  <div 
                    v-for="update in selectedTask.updates" 
                    :key="update.id" 
                    class="timeline-item"
                  >
                    <div class="timeline-marker"></div>
                    <div class="timeline-content">
                      <div class="update-header">
                        <div class="update-author">
                          <img :src="update.author.avatar" :alt="update.author.name" class="author-avatar" />
                          <div class="author-info">
                            <strong>{{ update.author.name }}</strong>
                            <small>{{ update.author.role }}</small>
                          </div>
                        </div>
                        <div class="update-date">
                          {{ formatDateTime(update.createdAt) }}
                        </div>
                      </div>
                      <div class="update-content">
                        <p>{{ update.report }}</p>
                        <div class="update-meta">
                          <span class="duration-info">
                            <ClockIcon class="meta-icon" />
                            {{ update.duration }}h réalisées
                          </span>
                          <span class="status-info">
                            <span class="task-status-badge small" :class="update.status">
                              {{ getTaskStatusText(update.status) }}
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-else class="no-updates">
                  <MessageSquareIcon class="no-updates-icon" />
                  <p>Aucune mise à jour pour cette tâche</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue'
  import {
    PlusIcon,
    DownloadIcon,
    ClipboardListIcon,
    PlayIcon,
    CheckCircleIcon,
    AlertTriangleIcon,
    InfoIcon,
    TrendingUpIcon,
    CheckIcon,
    ClockIcon,
    SearchIcon,
    CalendarIcon,
    MessageSquareIcon,
    XIcon,
    SaveIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    ChevronUpIcon,
    ChevronDownIcon,
    EyeIcon,
    EditIcon,
    ListIcon,
    UserPlusIcon,
    TrashIcon
  } from 'lucide-vue-next'
  
  // Données réactives
  const missionDialog = ref(false)
  const detailsDialog = ref(false)
  const tasksDialog = ref(false)
  const taskDialog = ref(false)
  const taskUpdateDialog = ref(false)
  const taskDetailsDialog = ref(false)
  const editingMission = ref(null)
  const editingTask = ref(null)
  const selectedMission = ref(null)
  const selectedTask = ref(null)
  
  // Filtres et recherche
  const searchTerm = ref('')
  const selectedStatus = ref('')
  const selectedPriority = ref('')
  const sortField = ref('createdAt')
  const sortOrder = ref('desc')
  const currentPage = ref(1)
  const itemsPerPage = 10
  
  // Formulaires
  const missionForm = ref({
    title: '',
    description: '',
    priority: '',
    dueDate: '',
    responsibleId: '',
    teamIds: [],
    instructions: ''
  })
  
  const taskForm = ref({
    title: '',
    description: '',
    assigneeId: '',
    dueDate: ''
  })
  
  const taskUpdateForm = ref({
    report: '',
    duration: '',
    status: 'in_progress'
  })
  
  // Date d'aujourd'hui pour la validation
  const today = new Date().toISOString().split('T')[0]
  
  // Utilisateur actuel (simulé)
  const currentUser = ref({
    id: 1,
    name: 'Abdoulaye Koné',
    role: 'SENACREX',
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=AK&backgroundColor=10b981'
  })
  
  // Membres disponibles
  const members = ref([
    {
      id: 1,
      name: 'Abdoulaye Koné',
      role: 'SENACREX',
      avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=AK&backgroundColor=10b981'
    },
    {
      id: 2,
      name: 'Fatoumata Maiga',
      role: 'SENAFI',
      avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=FM&backgroundColor=3b82f6'
    },
    {
      id: 3,
      name: 'Karim Mory',
      role: 'SENAMO',
      avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=KM&backgroundColor=f59e0b'
    },
    {
      id: 4,
      name: 'Aminata Traoré',
      role: 'SENACUL',
      avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=AT&backgroundColor=ef4444'
    },
    {
      id: 5,
      name: 'Moussa Diarra',
      role: 'SENASPO',
      avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=MD&backgroundColor=8b5cf6'
    }
  ])
  
  // Données des missions avec tâches
  const missions = ref([
    {
      id: 1,
      title: 'Organisation Soirée Culturelle 2025',
      description: 'Organiser la soirée culturelle annuelle avec spectacles, expositions et restauration traditionnelle malienne.',
      priority: 'high',
      status: 'in_progress',
      progress: 65,
      createdAt: new Date('2025-01-15'),
      dueDate: new Date('2025-02-28'),
      responsible: {
        id: 4,
        name: 'Aminata Traoré',
        role: 'SENACUL',
        avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=AT&backgroundColor=ef4444'
      },
      team: [
        {
          id: 1,
          name: 'Abdoulaye Koné',
          role: 'SENACREX',
          avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=AK&backgroundColor=10b981'
        },
        {
          id: 3,
          name: 'Karim Mory',
          role: 'SENAMO',
          avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=KM&backgroundColor=f59e0b'
        }
      ],
      instructions: 'Coordonner avec les partenaires locaux et prévoir un budget de 500 000 FCFA',
      tasks: [
        {
          id: 1,
          title: 'Réserver la salle',
          description: 'Contacter et réserver la salle municipale pour le 28 février',
          status: 'completed',
          duration: 3,
          createdAt: new Date('2025-01-16'),
          dueDate: new Date('2025-01-25'),
          assignee: {
            id: 4,
            name: 'Aminata Traoré',
            role: 'SENACUL',
            avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=AT&backgroundColor=ef4444'
          },
          updates: [
            {
              id: 1,
              report: 'Salle municipale contactée et réservée pour le 28 février. Contrat signé et acompte versé.',
              duration: 3,
              status: 'completed',
              createdAt: new Date('2025-01-18T14:30:00'),
              author: {
                id: 4,
                name: 'Aminata Traoré',
                role: 'SENACUL',
                avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=AT&backgroundColor=ef4444'
              }
            }
          ]
        },
        {
          id: 2,
          title: 'Contacter les groupes musicaux',
          description: 'Identifier et contacter 3 groupes musicaux maliens',
          status: 'in_progress',
          duration: 5,
          createdAt: new Date('2025-01-16'),
          dueDate: new Date('2025-02-01'),
          assignee: {
            id: 3,
            name: 'Karim Mory',
            role: 'SENAMO',
            avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=KM&backgroundColor=f59e0b'
          },
          updates: [
            {
              id: 1,
              report: 'Contact établi avec 2 groupes. Négociation des tarifs en cours.',
              duration: 2,
              status: 'in_progress',
              createdAt: new Date('2025-01-19T10:15:00'),
              author: {
                id: 3,
                name: 'Karim Mory',
                role: 'SENAMO',
                avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=KM&backgroundColor=f59e0b'
              }
            },
            {
              id: 2,
              report: 'Troisième groupe contacté. Programmation des répétitions prévue.',
              duration: 3,
              status: 'in_progress',
              createdAt: new Date('2025-01-21T16:45:00'),
              author: {
                id: 3,
                name: 'Karim Mory',
                role: 'SENAMO',
                avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=KM&backgroundColor=f59e0b'
              }
            }
          ]
        },
        {
          id: 3,
          title: 'Organiser la restauration',
          description: 'Trouver un traiteur spécialisé dans la cuisine malienne',
          status: 'pending',
          duration: 0,
          createdAt: new Date('2025-01-17'),
          dueDate: new Date('2025-02-10'),
          assignee: null,
          updates: []
        }
      ]
    },
    {
      id: 2,
      title: 'Campagne de Recrutement Q1 2025',
      description: 'Lancer une campagne de recrutement dans les universités et grandes écoles de Côte d\'Ivoire.',
      priority: 'medium',
      status: 'assigned',
      progress: 25,
      createdAt: new Date('2025-01-10'),
      dueDate: new Date('2025-03-31'),
      responsible: {
        id: 3,
        name: 'Karim Mory',
        role: 'SENAMO',
        avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=KM&backgroundColor=f59e0b'
      },
      team: [
        {
          id: 1,
          name: 'Abdoulaye Koné',
          role: 'SENACREX',
          avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=AK&backgroundColor=10b981'
        }
      ],
      instructions: 'Cibler prioritairement les nouveaux étudiants maliens',
      tasks: [
        {
          id: 4,
          title: 'Préparer les supports de communication',
          description: 'Créer flyers, affiches et présentation PowerPoint',
          status: 'in_progress',
          duration: 8,
          createdAt: new Date('2025-01-12'),
          dueDate: new Date('2025-01-30'),
          assignee: {
            id: 3,
            name: 'Karim Mory',
            role: 'SENAMO',
            avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=KM&backgroundColor=f59e0b'
          },
          updates: [
            {
              id: 1,
              report: 'Maquettes des flyers terminées. Travail sur les affiches en cours.',
              duration: 4,
              status: 'in_progress',
              createdAt: new Date('2025-01-14T09:00:00'),
              author: {
                id: 3,
                name: 'Karim Mory',
                role: 'SENAMO',
                avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=KM&backgroundColor=f59e0b'
              }
            },
            {
              id: 2,
              report: 'Affiches finalisées. Début de la présentation PowerPoint.',
              duration: 4,
              status: 'in_progress',
              createdAt: new Date('2025-01-18T15:30:00'),
              author: {
                id: 3,
                name: 'Karim Mory',
                role: 'SENAMO',
                avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=KM&backgroundColor=f59e0b'
              }
            }
          ]
        }
      ]
    }
  ])
  
  // Données calculées
  const filteredMissions = ref([...missions.value])
  
  const paginatedMissions = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage
    const end = start + itemsPerPage
    return filteredMissions.value.slice(start, end)
  })
  
  const totalPages = computed(() => 
    Math.ceil(filteredMissions.value.length / itemsPerPage)
  )
  
  const totalMissions = computed(() => missions.value.length)
  const totalTasks = computed(() => missions.value.reduce((sum, m) => sum + m.tasks.length, 0))
  const activeMissions = computed(() => missions.value.filter(m => m.status === 'in_progress' || m.status === 'assigned').length)
  const completedMissions = computed(() => missions.value.filter(m => m.status === 'completed').length)
  const overdueMissions = computed(() => missions.value.filter(m => m.status === 'overdue').length)
  
  // Fonctions utilitaires
  const formatDate = (date) => {
    return date.toLocaleDateString('fr-FR')
  }
  
  const formatDateTime = (date) => {
    return date.toLocaleDateString('fr-FR') + ' à ' + date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
  }
  
  const formatDateForInput = (date) => {
    return date.toISOString().split('T')[0]
  }
  
  const getPriorityText = (priority) => {
    const priorities = {
      'low': 'Faible',
      'medium': 'Moyenne',
      'high': 'Élevée',
      'urgent': 'Urgente'
    }
    return priorities[priority] || priority
  }
  
  const getStatusText = (status) => {
    const statuses = {
      'draft': 'Brouillon',
      'assigned': 'Assignée',
      'in_progress': 'En cours',
      'completed': 'Terminée',
      'overdue': 'En retard'
    }
    return statuses[status] || status
  }
  
  const getTaskStatusText = (status) => {
    const statuses = {
      'pending': 'En attente',
      'in_progress': 'En cours',
      'completed': 'Terminée',
      'cancelled': 'Annulée'
    }
    return statuses[status] || status
  }
  
  const getProgressClass = (progress) => {
    if (progress >= 80) return 'high-progress'
    if (progress >= 50) return 'medium-progress'
    return 'low-progress'
  }
  
  const getDaysLeft = (dueDate) => {
    const today = new Date()
    const due = new Date(dueDate)
    const diffTime = due - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays < 0) return `${Math.abs(diffDays)} jour(s) de retard`
    if (diffDays === 0) return 'Aujourd\'hui'
    if (diffDays === 1) return 'Demain'
    return `${diffDays} jour(s) restant(s)`
  }
  
  const getDaysLeftClass = (dueDate) => {
    const today = new Date()
    const due = new Date(dueDate)
    const diffTime = due - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays < 0) return 'overdue'
    if (diffDays <= 3) return 'urgent'
    if (diffDays <= 7) return 'warning'
    return 'normal'
  }
  
  const getTotalDuration = (tasks) => {
    return tasks.reduce((sum, task) => sum + (task.duration || 0), 0)
  }
  
  const canUpdateTask = (task) => {
    return task.assignee && task.assignee.id === currentUser.value.id && task.status !== 'completed' && task.status !== 'cancelled'
  }
  
  const getAvailableMembers = () => {
    if (!selectedMission.value) return members.value
    
    const teamIds = [selectedMission.value.responsible?.id, ...selectedMission.value.team.map(m => m.id)]
    return members.value.filter(m => teamIds.includes(m.id))
  }
  
  // Fonctions de filtrage et tri
  const filterMissions = () => {
    let filtered = [...missions.value]
    
    if (searchTerm.value) {
      const search = searchTerm.value.toLowerCase()
      filtered = filtered.filter(m => 
        m.title.toLowerCase().includes(search) ||
        m.description.toLowerCase().includes(search) ||
        (m.responsible && m.responsible.name.toLowerCase().includes(search))
      )
    }
    
    if (selectedStatus.value) {
      filtered = filtered.filter(m => m.status === selectedStatus.value)
    }
    
    if (selectedPriority.value) {
      filtered = filtered.filter(m => m.priority === selectedPriority.value)
    }
    
    filteredMissions.value = filtered
    currentPage.value = 1
  }
  
  const sortBy = (field) => {
    if (sortField.value === field) {
      sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
    } else {
      sortField.value = field
      sortOrder.value = 'asc'
    }
  
    filteredMissions.value.sort((a, b) => {
      let aVal = a[field]
      let bVal = b[field]
      
      if (field === 'dueDate' || field === 'createdAt') {
        aVal = new Date(aVal)
        bVal = new Date(bVal)
      }
      
      if (sortOrder.value === 'asc') {
        return aVal > bVal ? 1 : -1
      } else {
        return aVal < bVal ? 1 : -1
      }
    })
  }
  
  // Fonctions de dialog - Missions
  const openCreateMissionDialog = () => {
    editingMission.value = null
    missionForm.value = {
      title: '',
      description: '',
      priority: '',
      dueDate: '',
      responsibleId: '',
      teamIds: [],
      instructions: ''
    }
    missionDialog.value = true
  }
  
  const closeMissionDialog = () => {
    missionDialog.value = false
    editingMission.value = null
  }
  
  const editMission = (mission) => {
    editingMission.value = mission
    missionForm.value = {
      title: mission.title,
      description: mission.description,
      priority: mission.priority,
      dueDate: formatDateForInput(mission.dueDate),
      responsibleId: mission.responsible?.id || '',
      teamIds: mission.team.map(m => m.id),
      instructions: mission.instructions || ''
    }
    missionDialog.value = true
  }
  
  const saveMission = () => {
    const responsible = missionForm.value.responsibleId ? 
      members.value.find(m => m.id === parseInt(missionForm.value.responsibleId)) : null
    
    const team = missionForm.value.teamIds.map(id => 
      members.value.find(m => m.id === parseInt(id))
    ).filter(Boolean)
  
    if (editingMission.value) {
      // Mise à jour
      const index = missions.value.findIndex(m => m.id === editingMission.value.id)
      missions.value[index] = {
        ...missions.value[index],
        title: missionForm.value.title,
        description: missionForm.value.description,
        priority: missionForm.value.priority,
        dueDate: new Date(missionForm.value.dueDate),
        responsible,
        team,
        instructions: missionForm.value.instructions
      }
    } else {
      // Nouvelle mission
      const newMission = {
        id: Date.now(),
        title: missionForm.value.title,
        description: missionForm.value.description,
        priority: missionForm.value.priority,
        status: responsible ? 'assigned' : 'draft',
        progress: 0,
        createdAt: new Date(),
        dueDate: new Date(missionForm.value.dueDate),
        responsible,
        team,
        instructions: missionForm.value.instructions,
        tasks: []
      }
      missions.value.unshift(newMission)
    }
    
    filterMissions()
    closeMissionDialog()
  }
  
  const openMissionDetails = (mission) => {
    selectedMission.value = mission
    detailsDialog.value = true
  }
  
  const closeDetailsDialog = () => {
    detailsDialog.value = false
    selectedMission.value = null
  }
  
  // Fonctions de dialog - Tâches
  const openTasksDialog = (mission) => {
    selectedMission.value = mission
    tasksDialog.value = true
  }
  
  const closeTasksDialog = () => {
    tasksDialog.value = false
    selectedMission.value = null
  }
  
  const openCreateTaskDialog = () => {
    editingTask.value = null
    taskForm.value = {
      title: '',
      description: '',
      assigneeId: '',
      dueDate: ''
    }
    taskDialog.value = true
  }
  
  const closeTaskDialog = () => {
    taskDialog.value = false
    editingTask.value = null
  }
  
  const saveTask = () => {
    const assignee = taskForm.value.assigneeId ? 
      members.value.find(m => m.id === parseInt(taskForm.value.assigneeId)) : null
  
    if (editingTask.value) {
      // Mise à jour
      const taskIndex = selectedMission.value.tasks.findIndex(t => t.id === editingTask.value.id)
      selectedMission.value.tasks[taskIndex] = {
        ...selectedMission.value.tasks[taskIndex],
        title: taskForm.value.title,
        description: taskForm.value.description,
        assignee,
        dueDate: new Date(taskForm.value.dueDate)
      }
    } else {
      // Nouvelle tâche
      const newTask = {
        id: Date.now(),
        title: taskForm.value.title,
        description: taskForm.value.description,
        status: assignee ? 'in_progress' : 'pending',
        duration: 0,
        createdAt: new Date(),
        dueDate: new Date(taskForm.value.dueDate),
        assignee,
        updates: []
      }
      selectedMission.value.tasks.push(newTask)
    }
    
    // Mettre à jour la mission dans la liste principale
    const missionIndex = missions.value.findIndex(m => m.id === selectedMission.value.id)
    if (missionIndex !== -1) {
      missions.value[missionIndex] = { ...selectedMission.value }
    }
    
    closeTaskDialog()
  }
  
  const assignTask = (task) => {
    task.assignee = currentUser.value
    task.status = 'in_progress'
    
    // Mettre à jour la mission dans la liste principale
    const missionIndex = missions.value.findIndex(m => m.id === selectedMission.value.id)
    if (missionIndex !== -1) {
      missions.value[missionIndex] = { ...selectedMission.value }
    }
  }
  
  const openTaskUpdateDialog = (task) => {
    selectedTask.value = task
    taskUpdateForm.value = {
      report: '',
      duration: '',
      status: task.status
    }
    taskUpdateDialog.value = true
  }
  
  const closeTaskUpdateDialog = () => {
    taskUpdateDialog.value = false
    selectedTask.value = null
  }
  
  const saveTaskUpdate = () => {
    const newUpdate = {
      id: Date.now(),
      report: taskUpdateForm.value.report,
      duration: parseFloat(taskUpdateForm.value.duration),
      status: taskUpdateForm.value.status,
      createdAt: new Date(),
      author: currentUser.value
    }
    
    // Ajouter la mise à jour
    selectedTask.value.updates.push(newUpdate)
    
    // Mettre à jour la durée totale et le statut
    selectedTask.value.duration = (selectedTask.value.duration || 0) + parseFloat(taskUpdateForm.value.duration)
    selectedTask.value.status = taskUpdateForm.value.status
    
    // Recalculer la progression de la mission
    const completedTasks = selectedMission.value.tasks.filter(t => t.status === 'completed').length
    const totalTasks = selectedMission.value.tasks.length
    selectedMission.value.progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
    
    // Mettre à jour le statut de la mission si toutes les tâches sont terminées
    if (selectedMission.value.progress === 100) {
      selectedMission.value.status = 'completed'
    } else if (selectedMission.value.status === 'assigned') {
      selectedMission.value.status = 'in_progress'
    }
    
    // Mettre à jour la mission dans la liste principale
    const missionIndex = missions.value.findIndex(m => m.id === selectedMission.value.id)
    if (missionIndex !== -1) {
      missions.value[missionIndex] = { ...selectedMission.value }
    }
    
    filterMissions()
    closeTaskUpdateDialog()
  }
  
  const viewTaskDetails = (task) => {
    selectedTask.value = task
    taskDetailsDialog.value = true
  }
  
  const closeTaskDetailsDialog = () => {
    taskDetailsDialog.value = false
    selectedTask.value = null
  }
  
  const deleteTask = (task) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) {
      const taskIndex = selectedMission.value.tasks.findIndex(t => t.id === task.id)
      selectedMission.value.tasks.splice(taskIndex, 1)
      
      // Recalculer la progression
      const completedTasks = selectedMission.value.tasks.filter(t => t.status === 'completed').length
      const totalTasks = selectedMission.value.tasks.length
      selectedMission.value.progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
      
      // Mettre à jour la mission dans la liste principale
      const missionIndex = missions.value.findIndex(m => m.id === selectedMission.value.id)
      if (missionIndex !== -1) {
        missions.value[missionIndex] = { ...selectedMission.value }
      }
    }
  }
  
  const exportMissions = () => {
    const dataStr = JSON.stringify(missions.value, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'missions-aeemci.json'
    link.click()
  }
  
  // Lifecycle
  onMounted(() => {
    filterMissions()
  })
  </script>
  
  <style scoped>
  /* Reset et animations */
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  @keyframes fade {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes slide {
    from { transform: translateY(-20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
  
  @keyframes pop {
    from { transform: scale(0.8); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
  }
  
  .animate-fade { animation: fade 0.6s ease-out; }
  .animate-slide { animation: slide 0.6s ease-out; }
  .animate-pop { animation: pop 0.6s ease-out; }
  .animate-pop-delay-1 { animation: pop 0.6s ease-out 0.1s both; }
  .animate-pop-delay-2 { animation: pop 0.6s ease-out 0.2s both; }
  .animate-pop-delay-3 { animation: pop 0.6s ease-out 0.3s both; }
  
  /* Base */
  .missions-wrapper {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background: #ffffff;
    min-height: 100vh;
    height: 100vh;
    overflow-y: auto;
    padding: 0;
    margin: 0;
  }
  
  .missions-container {
    background: #ffffff;
    min-height: 100vh;
    padding: 32px;
    max-width: none;
    width: 100%;
    margin: 0;
  }
  
  /* Header */
  .missions-header {
    margin-bottom: 32px;
    padding: 24px 0;
  }
  
  .header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 20px;
  }
  
  .title-section h1 {
    font-size: 2.5rem;
    font-weight: 700;
    color: #1f2937;
    margin: 0 0 8px 0;
    background: linear-gradient(135deg, #8b5cf6, #7c3aed);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  .title-section p {
    color: #6b7280;
    font-size: 1.1rem;
    margin: 0;
  }
  
  .header-actions {
    display: flex;
    gap: 12px;
    align-items: center;
  }
  
  .action-btn {
    display: flex;
    align-items: center;
    padding: 12px 20px;
    border-radius: 12px;
    border: none;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 0.95rem;
  }
  
  .action-btn.small {
    padding: 8px 16px;
    font-size: 0.85rem;
  }
  
  .action-btn.primary {
    background: linear-gradient(135deg, #8b5cf6, #7c3aed);
    color: white;
  }
  
  .action-btn.primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(139, 92, 246, 0.4);
  }
  
  .action-btn.secondary {
    background: white;
    color: #374151;
    border: 2px solid #e5e7eb;
  }
  
  .action-btn.secondary:hover {
    border-color: #8b5cf6;
    color: #8b5cf6;
    transform: translateY(-2px);
  }
  
  .btn-icon {
    width: 18px;
    height: 18px;
    margin-right: 8px;
  }
  
  /* Statistics Cards */
  .stats-section {
    margin-bottom: 32px;
  }
  
  .stat-cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 24px;
  }
  
  .stat-card {
    background: white;
    border-radius: 20px;
    padding: 24px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
    border: 1px solid #e5e7eb;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
  }
  
  .stat-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
  }
  
  .stat-card.primary::before { background: linear-gradient(90deg, #8b5cf6, #7c3aed); }
  .stat-card.secondary::before { background: linear-gradient(90deg, #10b981, #047857); }
  .stat-card.tertiary::before { background: linear-gradient(90deg, #3b82f6, #1d4ed8); }
  .stat-card.quaternary::before { background: linear-gradient(90deg, #ef4444, #dc2626); }
  
  .stat-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
  }
  
  .card-icon {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 16px;
  }
  
  .stat-card.primary .card-icon { background: rgba(139, 92, 246, 0.1); }
  .stat-card.secondary .card-icon { background: rgba(16, 185, 129, 0.1); }
  .stat-card.tertiary .card-icon { background: rgba(59, 130, 246, 0.1); }
  .stat-card.quaternary .card-icon { background: rgba(239, 68, 68, 0.1); }
  
  .card-icon .icon {
    width: 24px;
    height: 24px;
  }
  
  .stat-card.primary .icon { color: #8b5cf6; }
  .stat-card.secondary .icon { color: #10b981; }
  .stat-card.tertiary .icon { color: #3b82f6; }
  .stat-card.quaternary .icon { color: #ef4444; }
  
  .card-content h3 {
    font-size: 2rem;
    font-weight: 700;
    color: #1f2937;
    margin: 0 0 4px 0;
  }
  
  .card-content p {
    color: #6b7280;
    font-size: 0.95rem;
    margin: 0 0 12px 0;
  }
  
  .card-trend {
    display: flex;
    align-items: center;
    font-size: 0.85rem;
    font-weight: 500;
  }
  
  .card-trend.positive { color: #059669; }
  .card-trend.negative { color: #dc2626; }
  .card-trend.neutral { color: #6b7280; }
  
  .trend-icon {
    width: 16px;
    height: 16px;
    margin-right: 4px;
  }
  
  /* Filters */
  .filters-section {
    display: flex;
    gap: 16px;
    margin-bottom: 32px;
    flex-wrap: wrap;
    align-items: center;
  }
  
  .search-container {
    position: relative;
    flex: 1;
    min-width: 250px;
  }
  
  .search-icon {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    width: 18px;
    height: 18px;
    color: #9ca3af;
  }
  
  .search-input {
    width: 100%;
    padding: 12px 12px 12px 44px;
    border-radius: 12px;
    border: 2px solid #e5e7eb;
    font-size: 0.95rem;
    transition: all 0.3s ease;
  }
  
  .search-input:focus {
    outline: none;
    border-color: #8b5cf6;
    box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
  }
  
  .filter-select {
    padding: 12px 16px;
    border-radius: 12px;
    border: 2px solid #e5e7eb;
    background: white;
    cursor: pointer;
    font-size: 0.95rem;
    transition: all 0.3s ease;
  }
  
  .filter-select:focus {
    outline: none;
    border-color: #8b5cf6;
  }
  
  /* Table */
  .table-wrapper {
    background: white;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
    border: 1px solid #e5e7eb;
    margin-bottom: 32px;
  }
  
  .table-header {
    padding: 24px;
    border-bottom: 1px solid #e5e7eb;
    background: #f8fafc;
  }
  
  .table-title {
    margin: 0 0 8px 0;
    color: #1f2937;
    font-size: 1.4rem;
    font-weight: 600;
  }
  
  .table-summary {
    color: #6b7280;
    font-size: 0.9rem;
  }
  
  .table-container {
    overflow-x: auto;
  }
  
  .missions-table {
    width: 100%;
    border-collapse: collapse;
  }
  
  .missions-table th,
  .missions-table td {
    padding: 16px 20px;
    text-align: left;
    border-bottom: 1px solid #f3f4f6;
  }
  
  .missions-table th {
    background-color: #f8fafc;
    font-size: 0.85rem;
    font-weight: 600;
    text-transform: uppercase;
    color: #374151;
    letter-spacing: 0.5px;
  }
  
  .missions-table th.sortable {
    cursor: pointer;
    user-select: none;
    position: relative;
    transition: all 0.2s ease;
  }
  
  .missions-table th.sortable:hover {
    background-color: #e2e8f0;
  }
  
  .sort-icon {
    width: 14px;
    height: 14px;
    margin-left: 4px;
    display: inline-block;
  }
  
  .missions-table td {
    font-size: 0.95rem;
    color: #374151;
  }
  
  .row-hover {
    transition: all 0.2s ease;
  }
  
  .row-hover:hover {
    background-color: #f8fafc;
    transform: scale(1.01);
  }
  
  /* Table Cells */
  .mission-cell {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  
  .mission-title {
    font-weight: 600;
    color: #1f2937;
    margin: 0;
  }
  
  .mission-description {
    color: #6b7280;
    font-size: 0.8rem;
    line-height: 1.4;
  }
  
  .mission-stats {
    display: flex;
    gap: 12px;
    margin-top: 8px;
  }
  
  .stat-item {
    display: flex;
    align-items: center;
    font-size: 0.75rem;
    color: #9ca3af;
  }
  
  .stat-icon {
    width: 12px;
    height: 12px;
    margin-right: 4px;
  }
  
  .user-cell {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  
  .user-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid #e5e7eb;
  }
  
  .user-avatar.small {
    width: 32px;
    height: 32px;
  }
  
  .user-details strong {
    display: block;
    margin-bottom: 2px;
    font-size: 0.9rem;
  }
  
  .user-details small {
    color: #6b7280;
    font-size: 0.8rem;
  }
  
  .no-assignee {
    color: #9ca3af;
    font-style: italic;
    font-size: 0.9rem;
  }
  
  .team-avatars {
    display: flex;
    align-items: center;
    gap: -8px;
  }
  
  .team-avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid white;
    margin-left: -8px;
  }
  
  .team-avatar:first-child {
    margin-left: 0;
  }
  
  .more-members {
    background: #f3f4f6;
    color: #6b7280;
    font-size: 0.75rem;
    font-weight: 600;
    padding: 4px 8px;
    border-radius: 50%;
    margin-left: 4px;
    min-width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .priority-badge {
    display: flex;
    align-items: center;
    padding: 4px 8px;
    border-radius: 8px;
    font-size: 0.8rem;
    font-weight: 500;
  }
  
  .priority-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    margin-right: 6px;
  }
  
  .priority-badge.low {
    background: #f3f4f6;
    color: #6b7280;
  }
  
  .priority-badge.low .priority-dot {
    background: #9ca3af;
  }
  
  .priority-badge.medium {
    background: #fef3c7;
    color: #d97706;
  }
  
  .priority-badge.medium .priority-dot {
    background: #f59e0b;
  }
  
  .priority-badge.high {
    background: #fee2e2;
    color: #dc2626;
  }
  
  .priority-badge.high .priority-dot {
    background: #ef4444;
  }
  
  .priority-badge.urgent {
    background: #fce7f3;
    color: #be185d;
  }
  
  .priority-badge.urgent .priority-dot {
    background: #ec4899;
  }
  
  .status-badge {
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 600;
    text-transform: uppercase;
  }
  
  .status-badge.draft {
    background: #f3f4f6;
    color: #6b7280;
  }
  
  .status-badge.assigned {
    background: #dbeafe;
    color: #1d4ed8;
  }
  
  .status-badge.in_progress {
    background: #fef3c7;
    color: #d97706;
  }
  
  .status-badge.completed {
    background: #d1fae5;
    color: #047857;
  }
  
  .status-badge.overdue {
    background: #fee2e2;
    color: #dc2626;
  }
  
  .progress-cell {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  
  .progress-bar {
    width: 80px;
    height: 8px;
    background-color: #e5e7eb;
    border-radius: 4px;
    overflow: hidden;
  }
  
  .progress-fill {
    height: 100%;
    transition: width 0.6s ease;
    border-radius: 4px;
  }
  
  .progress-fill.low-progress {
    background: linear-gradient(90deg, #f87171, #ef4444);
  }
  
  .progress-fill.medium-progress {
    background: linear-gradient(90deg, #fbbf24, #f59e0b);
  }
  
  .progress-fill.high-progress {
    background: linear-gradient(90deg, #34d399, #10b981);
  }
  
  .progress-text {
    font-size: 0.85rem;
    font-weight: 600;
    color: #374151;
    min-width: 40px;
  }
  
  .date-cell {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  
  .date {
    font-weight: 500;
    font-size: 0.9rem;
  }
  
  .days-left {
    font-size: 0.75rem;
    font-weight: 500;
  }
  
  .days-left.normal {
    color: #6b7280;
  }
  
  .days-left.warning {
    color: #d97706;
  }
  
  .days-left.urgent {
    color: #dc2626;
  }
  
  .days-left.overdue {
    color: #dc2626;
    font-weight: 600;
  }
  
  .action-buttons {
    display: flex;
    gap: 8px;
  }
  
  .action-btn-small {
    padding: 6px 8px;
    border-radius: 8px;
    border: none;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .action-btn-small:hover {
    transform: scale(1.1);
  }
  
  .action-btn-small.view {
    background-color: #3b82f6;
    color: white;
  }
  
  .action-btn-small.edit {
    background-color: #fbbf24;
    color: white;
  }
  
  .action-btn-small.tasks {
    background-color: #8b5cf6;
    color: white;
  }
  
  .action-icon {
    width: 14px;
    height: 14px;
  }
  
  /* Task Status Badges */
  .task-status-badge {
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
  }
  
  .task-status-badge.small {
    padding: 2px 6px;
    font-size: 0.7rem;
  }
  
  .task-status-badge.pending {
    background: #f3f4f6;
    color: #6b7280;
  }
  
  .task-status-badge.in_progress {
    background: #fef3c7;
    color: #d97706;
  }
  
  .task-status-badge.completed {
    background: #d1fae5;
    color: #047857;
  }
  
  .task-status-badge.cancelled {
    background: #fee2e2;
    color: #dc2626;
  }
  
  /* Assign Button */
  .assign-btn {
    display: flex;
    align-items: center;
    padding: 6px 12px;
    background: #f0f9ff;
    color: #1d4ed8;
    border: 1px solid #bfdbfe;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 0.8rem;
    font-weight: 500;
  }
  
  .assign-btn:hover {
    background: #dbeafe;
    border-color: #93c5fd;
  }
  
  .assign-icon {
    width: 14px;
    height: 14px;
    margin-right: 4px;
  }
  
  /* Pagination */
  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 16px;
    padding: 20px;
    background: #f8fafc;
    border-top: 1px solid #e5e7eb;
  }
  
  .pagination-btn {
    padding: 8px;
    border: 1px solid #d1d5db;
    background: white;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  
  .pagination-btn:hover:not(:disabled) {
    background: #f3f4f6;
  }
  
  .pagination-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  .pagination-icon {
    width: 16px;
    height: 16px;
  }
  
  .pagination-info {
    font-size: 0.9rem;
    color: #6b7280;
  }
  
  /* Dialogs */
  .dialog-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    justify-content: center;
    align-items: flex-start;
    z-index: 1000;
    backdrop-filter: blur(4px);
    overflow-y: auto;
    padding: 20px;
  }
  
  .dialog-box {
    background: white;
    border-radius: 20px;
    width: 100%;
    max-width: 500px;
    margin: auto;
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
    animation: pop 0.3s ease-out;
    max-height: calc(100vh - 40px);
    display: flex;
    flex-direction: column;
  }
  
  .dialog-box.large {
    max-width: 700px;
  }
  
  .dialog-box.extra-large {
    max-width: 1000px;
  }
  
  .dialog-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 24px 24px 0 24px;
    flex-shrink: 0;
  }
  
  .dialog-header h3 {
    margin: 0;
    color: #1f2937;
    font-size: 1.3rem;
    font-weight: 600;
  }
  
  .close-btn {
    padding: 8px;
    border: none;
    background: #f3f4f6;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  
  .close-btn:hover {
    background: #e5e7eb;
  }
  
  .close-icon {
    width: 18px;
    height: 18px;
  }
  
  .dialog-content {
    flex: 1;
    overflow-y: auto;
    padding: 20px 24px 24px 24px;
  }
  
  .dialog-content form {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  
  .form-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  
  .form-group label {
    font-weight: 600;
    color: #374151;
    font-size: 0.9rem;
  }
  
  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }
  
  .form-group input,
  .form-group select,
  .form-group textarea {
    padding: 12px;
    border-radius: 8px;
    border: 2px solid #e5e7eb;
    font-size: 0.95rem;
    transition: all 0.3s ease;
  }
  
  .form-group input:focus,
  .form-group select:focus,
  .form-group textarea:focus {
    outline: none;
    border-color: #8b5cf6;
    box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
  }
  
  .form-group textarea {
    resize: vertical;
    min-height: 80px;
  }
  
  /* Team Selection */
  .team-selection {
    display: flex;
    flex-direction: column;
    gap: 12px;
    max-height: 200px;
    overflow-y: auto;
    padding: 12px;
    border: 2px solid #e5e7eb;
    border-radius: 8px;
  }
  
  .member-checkbox {
    display: flex;
    align-items: center;
  }
  
  .member-checkbox input[type="checkbox"] {
    margin-right: 12px;
    width: 16px;
    height: 16px;
  }
  
  .member-label {
    display: flex;
    align-items: center;
    gap: 12px;
    cursor: pointer;
    padding: 8px;
    border-radius: 8px;
    transition: all 0.2s ease;
    flex: 1;
  }
  
  .member-label:hover {
    background: #f8fafc;
  }
  
  .member-avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    object-fit: cover;
  }
  
  .member-info strong {
    display: block;
    font-size: 0.9rem;
    color: #1f2937;
  }
  
  .member-info small {
    color: #6b7280;
    font-size: 0.8rem;
  }
  
  .dialog-actions {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    margin-top: 8px;
    flex-shrink: 0;
  }
  
  .dialog-btn {
    display: flex;
    align-items: center;
    padding: 10px 20px;
    border-radius: 8px;
    border: none;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.3s ease;
    font-size: 0.9rem;
  }
  
  .dialog-btn.save {
    background: linear-gradient(135deg, #8b5cf6, #7c3aed);
    color: white;
  }
  
  .dialog-btn.save:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4);
  }
  
  .dialog-btn.cancel {
    background: #f3f4f6;
    color: #374151;
  }
  
  .dialog-btn.cancel:hover {
    background: #e5e7eb;
  }
  
  .button-icon {
    width: 16px;
    height: 16px;
    margin-right: 8px;
  }
  
  /* Mission Details */
  .mission-details {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }
  
  .details-section {
    padding: 20px;
    background: #f8fafc;
    border-radius: 12px;
    border: 1px solid #e5e7eb;
  }
  
  .details-section h4 {
    margin: 0 0 16px 0;
    color: #1f2937;
    font-size: 1.1rem;
    font-weight: 600;
  }
  
  .details-section h5 {
    margin: 16px 0 8px 0;
    color: #374151;
    font-size: 1rem;
    font-weight: 600;
  }
  
  .info-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
  }
  
  .info-item {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  
  .info-item label {
    font-size: 0.85rem;
    font-weight: 600;
    color: #6b7280;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  
  .assignee-details {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .mini-avatar {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    object-fit: cover;
  }
  
  .mission-description-full {
    color: #374151;
    line-height: 1.6;
    margin: 0;
  }
  
  .instructions {
    margin-top: 16px;
    padding: 16px;
    background: #fff7ed;
    border-radius: 8px;
    border-left: 4px solid #f59e0b;
  }
  
  .instructions p {
    margin: 0;
    color: #92400e;
    line-height: 1.5;
  }
  
  /* Team Grid */
  .team-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 16px;
  }
  
  .team-member {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    background: white;
    border-radius: 8px;
    border: 1px solid #e5e7eb;
  }
  
  .team-member.responsible {
    border-color: #8b5cf6;
    background: #f5f3ff;
  }
  
  .team-member-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
  }
  
  .team-member-info strong {
    display: block;
    font-size: 0.9rem;
    color: #1f2937;
  }
  
  .team-member-info small {
    color: #6b7280;
    font-size: 0.8rem;
  }
  
  .member-role {
    font-size: 0.75rem;
    font-weight: 600;
    color: #8b5cf6;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  
  /* Tasks Summary */
  .tasks-summary {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 16px;
  }
  
  .summary-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 16px;
    background: white;
    border-radius: 8px;
    border: 1px solid #e5e7eb;
  }
  
  .summary-label {
    font-size: 0.8rem;
    color: #6b7280;
    font-weight: 500;
    margin-bottom: 4px;
  }
  
  .summary-value {
    font-size: 1.5rem;
    font-weight: 700;
    color: #1f2937;
  }
  
  /* Tasks Table */
  .tasks-table-wrapper {
    background: white;
    border-radius: 12px;
    overflow: hidden;
    border: 1px solid #e5e7eb;
  }
  
  .tasks-table {
    width: 100%;
    border-collapse: collapse;
  }
  
  .tasks-table th,
  .tasks-table td {
    padding: 12px 16px;
    text-align: left;
    border-bottom: 1px solid #f3f4f6;
  }
  
  .tasks-table th {
    background-color: #f8fafc;
    font-size: 0.8rem;
    font-weight: 600;
    text-transform: uppercase;
    color: #374151;
    letter-spacing: 0.5px;
  }
  
  .task-row {
    transition: all 0.2s ease;
  }
  
  .task-row:hover {
    background-color: #f8fafc;
  }
  
  .task-cell {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  
  .task-cell strong {
    font-size: 0.9rem;
    color: #1f2937;
  }
  
  .task-cell small {
    color: #6b7280;
    font-size: 0.8rem;
    line-height: 1.3;
  }
  
  .duration {
    font-weight: 600;
    color: #374151;
  }
  
  .task-date {
    font-size: 0.9rem;
    color: #374151;
  }
  
  .task-actions {
    display: flex;
    gap: 6px;
  }
  
  .task-action-btn {
    padding: 4px 6px;
    border-radius: 6px;
    border: none;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .task-action-btn:hover {
    transform: scale(1.1);
  }
  
  .task-action-btn.update {
    background-color: #fbbf24;
    color: white;
  }
  
  .task-action-btn.view {
    background-color: #3b82f6;
    color: white;
  }
  
  .task-action-btn.delete {
    background-color: #ef4444;
    color: white;
  }
  
  .task-action-icon {
    width: 12px;
    height: 12px;
  }
  
  .no-tasks {
    text-align: center;
    padding: 40px 20px;
    color: #6b7280;
  }
  
  .no-tasks-icon {
    width: 48px;
    height: 48px;
    margin: 0 auto 16px auto;
    opacity: 0.5;
  }
  
  .no-tasks p {
    margin: 0 0 16px 0;
    font-size: 1rem;
  }
  
  .create-task-btn {
    display: inline-flex;
    align-items: center;
    padding: 10px 16px;
    background: linear-gradient(135deg, #8b5cf6, #7c3aed);
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.3s ease;
  }
  
  .create-task-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4);
  }
  
  /* Task Details */
  .task-details {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }
  
  .task-info {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    background: #f8fafc;
    border-radius: 8px;
    margin-top: 8px;
  }
  
  /* Timeline */
  .timeline {
    position: relative;
    padding-left: 32px;
  }
  
  .timeline::before {
    content: '';
    position: absolute;
    left: 16px;
    top: 0;
    bottom: 0;
    width: 2px;
    background: #e5e7eb;
  }
  
  .timeline-item {
    position: relative;
    margin-bottom: 24px;
  }
  
  .timeline-item:last-child {
    margin-bottom: 0;
  }
  
  .timeline-marker {
    position: absolute;
    left: -24px;
    top: 8px;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: #8b5cf6;
    border: 3px solid white;
    box-shadow: 0 0 0 2px #e5e7eb;
  }
  
  .timeline-content {
    background: white;
    border-radius: 12px;
    padding: 16px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    border: 1px solid #e5e7eb;
  }
  
  .update-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
  }
  
  .update-author {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  
  .author-avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    object-fit: cover;
  }
  
  .author-info strong {
    display: block;
    font-size: 0.9rem;
    color: #1f2937;
  }
  
  .author-info small {
    color: #6b7280;
    font-size: 0.8rem;
  }
  
  .update-date {
    font-size: 0.85rem;
    color: #6b7280;
  }
  
  .update-content p {
    margin: 0 0 12px 0;
    color: #374151;
    line-height: 1.5;
  }
  
  .update-meta {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 8px 12px;
    background: #f8fafc;
    border-radius: 6px;
  }
  
  .duration-info,
  .status-info {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.85rem;
    color: #6b7280;
  }
  
  .meta-icon {
    width: 14px;
    height: 14px;
  }
  
  .no-updates {
    text-align: center;
    padding: 40px 20px;
    color: #6b7280;
  }
  
  .no-updates-icon {
    width: 48px;
    height: 48px;
    margin: 0 auto 16px auto;
    opacity: 0.5;
  }
  
  .no-updates p {
    margin: 0;
    font-size: 1rem;
  }
  
  /* Responsive */
  @media (max-width: 768px) {
    .missions-container {
      padding: 20px;
    }
    
    .title-section h1 {
      font-size: 2rem;
    }
    
    .header-content {
      flex-direction: column;
      align-items: stretch;
    }
    
    .stat-cards {
      grid-template-columns: 1fr;
    }
    
    .filters-section {
      flex-direction: column;
      align-items: stretch;
    }
    
    .search-container {
      min-width: auto;
    }
    
    .form-row {
      grid-template-columns: 1fr;
    }
    
    .dialog-overlay {
      padding: 10px;
    }
    
    .dialog-box {
      max-width: none;
      margin: 0;
    }
    
    .info-grid {
      grid-template-columns: 1fr;
    }
    
    .team-grid {
      grid-template-columns: 1fr;
    }
    
    .tasks-summary {
      grid-template-columns: repeat(2, 1fr);
    }
    
    .missions-table {
      font-size: 0.85rem;
    }
    
    .missions-table th,
    .missions-table td {
      padding: 12px 8px;
    }
    
    .mission-cell {
      min-width: 200px;
    }
    
    .user-cell {
      flex-direction: column;
      text-align: center;
      gap: 8px;
    }
    
    .team-avatars {
      justify-content: center;
    }
    
    .update-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 8px;
    }
    
    .update-meta {
      flex-direction: column;
      align-items: flex-start;
      gap: 8px;
    }
  }
  
  @media (max-width: 480px) {
    .missions-container {
      padding: 16px;
    }
    
    .title-section h1 {
      font-size: 1.8rem;
    }
    
    .stat-card {
      padding: 20px;
    }
    
    .card-content h3 {
      font-size: 1.5rem;
    }
    
    .table-container {
      overflow-x: scroll;
    }
    
    .missions-table {
      min-width: 800px;
    }
    
    .dialog-actions {
      flex-direction: column;
    }
    
    .dialog-btn {
      justify-content: center;
    }
    
    .tasks-summary {
      grid-template-columns: 1fr;
    }
  }
  </style>