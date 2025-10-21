<template>
    <div class="cloud-wrapper">
      <div class="cloud-container">
        <!-- Header Section -->
        <div class="cloud-header animate-slide">
          <div class="header-content">
            <div class="title-section">
              <h1>Cloud AEEMCI</h1>
              <p>Gestion des documents et archives par département</p>
            </div>
            <div class="header-actions">
              <button class="action-btn primary" @click="openCreateFolderDialog">
                <FolderPlusIcon class="btn-icon" />
                Nouveau Dossier
              </button>
              <button class="action-btn secondary" @click="openUploadDialog">
                <UploadIcon class="btn-icon" />
                Téléverser
              </button>
              <button class="action-btn tertiary" @click="toggleViewMode">
                <GridIcon v-if="viewMode === 'list'" class="btn-icon" />
                <ListIcon v-else class="btn-icon" />
                {{ viewMode === 'list' ? 'Grille' : 'Liste' }}
              </button>
            </div>
          </div>
        </div>
  
        <!-- Statistics Cards -->
        <div class="stats-section">
          <div class="stat-cards">
            <div class="stat-card primary animate-pop">
              <div class="card-icon">
                <FolderIcon class="icon" />
              </div>
              <div class="card-content">
                <h3>{{ totalFolders }}</h3>
                <p>Dossiers</p>
                <div class="card-trend neutral">
                  <InfoIcon class="trend-icon" />
                  <span>{{ departments.length }} départements</span>
                </div>
              </div>
            </div>
  
            <div class="stat-card secondary animate-pop-delay-1">
              <div class="card-icon">
                <FileIcon class="icon" />
              </div>
              <div class="card-content">
                <h3>{{ totalFiles }}</h3>
                <p>Fichiers</p>
                <div class="card-trend positive">
                  <TrendingUpIcon class="trend-icon" />
                  <span>{{ formatFileSize(totalSize) }}</span>
                </div>
              </div>
            </div>
  
            <div class="stat-card tertiary animate-pop-delay-2">
              <div class="card-icon">
                <LockIcon class="icon" />
              </div>
              <div class="card-content">
                <h3>{{ protectedItems }}</h3>
                <p>Éléments Protégés</p>
                <div class="card-trend warning">
                  <ShieldIcon class="trend-icon" />
                  <span>Accès restreint</span>
                </div>
              </div>
            </div>
  
            <div class="stat-card quaternary animate-pop-delay-3">
              <div class="card-icon">
                <ClockIcon class="icon" />
              </div>
              <div class="card-content">
                <h3>{{ recentFiles }}</h3>
                <p>Récents (7j)</p>
                <div class="card-trend positive">
                  <CalendarIcon class="trend-icon" />
                  <span>Cette semaine</span>
                </div>
              </div>
            </div>
          </div>
        </div>
  
        <!-- Navigation and Filters -->
        <div class="navigation-section">
          <div class="breadcrumb">
            <button 
              v-for="(crumb, index) in breadcrumbs" 
              :key="index"
              class="breadcrumb-item"
              @click="navigateToPath(crumb.path)"
              :class="{ active: index === breadcrumbs.length - 1 }"
            >
              <FolderIcon v-if="index === 0" class="breadcrumb-icon" />
              <ChevronRightIcon v-if="index > 0" class="breadcrumb-separator" />
              {{ crumb.name }}
            </button>
          </div>
          
          <div class="filters-section">
            <div class="search-container">
              <SearchIcon class="search-icon" />
              <input 
                type="text" 
                placeholder="Rechercher des fichiers..." 
                class="search-input"
                v-model="searchTerm"
                @input="filterItems"
              />
            </div>
            <select class="filter-select" v-model="selectedDepartment" @change="filterItems">
              <option value="">Tous les départements</option>
              <option 
                v-for="dept in departments" 
                :key="dept.id" 
                :value="dept.id"
              >
                {{ dept.name }}
              </option>
            </select>
            <select class="filter-select" v-model="selectedFileType" @change="filterItems">
              <option value="">Tous les types</option>
              <option value="document">Documents</option>
              <option value="image">Images</option>
              <option value="video">Vidéos</option>
              <option value="archive">Archives</option>
            </select>
          </div>
        </div>
  
        <!-- File Explorer -->
        <div class="explorer-section">
          <div class="explorer-header">
            <h2 class="explorer-title">{{ currentFolder?.name || 'Racine' }}</h2>
            <div class="explorer-info">
              {{ filteredItems.length }} élément(s) • 
              {{ formatFileSize(getCurrentFolderSize()) }}
            </div>
          </div>
  
          <!-- List View -->
          <div v-if="viewMode === 'list'" class="list-view">
            <table class="files-table animate-fade">
              <thead>
                <tr>
                  <th @click="sortBy('name')" class="sortable">
                    Nom
                    <ChevronUpIcon v-if="sortField === 'name' && sortOrder === 'asc'" class="sort-icon" />
                    <ChevronDownIcon v-if="sortField === 'name' && sortOrder === 'desc'" class="sort-icon" />
                  </th>
                  <th @click="sortBy('type')" class="sortable">
                    Type
                    <ChevronUpIcon v-if="sortField === 'type' && sortOrder === 'asc'" class="sort-icon" />
                    <ChevronDownIcon v-if="sortField === 'type' && sortOrder === 'desc'" class="sort-icon" />
                  </th>
                  <th @click="sortBy('size')" class="sortable">
                    Taille
                    <ChevronUpIcon v-if="sortField === 'size' && sortOrder === 'asc'" class="sort-icon" />
                    <ChevronDownIcon v-if="sortField === 'size' && sortOrder === 'desc'" class="sort-icon" />
                  </th>
                  <th @click="sortBy('modifiedAt')" class="sortable">
                    Modifié
                    <ChevronUpIcon v-if="sortField === 'modifiedAt' && sortOrder === 'asc'" class="sort-icon" />
                    <ChevronDownIcon v-if="sortField === 'modifiedAt' && sortOrder === 'desc'" class="sort-icon" />
                  </th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr 
                  v-for="item in paginatedItems" 
                  :key="item.id" 
                  class="file-row"
                  @dblclick="handleItemDoubleClick(item)"
                >
                  <td>
                    <div class="file-cell">
                      <div class="file-icon">
                        <component :is="getFileIcon(item)" class="icon" :class="getFileIconClass(item)" />
                        <LockIcon v-if="item.isProtected" class="protection-icon" />
                      </div>
                      <div class="file-info">
                        <strong class="file-name">{{ item.name }}</strong>
                        <small class="file-description" v-if="item.description">{{ item.description }}</small>
                        <div class="file-meta">
                          <span class="meta-item">
                            <UserIcon class="meta-icon" />
                            {{ item.owner?.name }}
                          </span>
                          <span class="meta-item" v-if="item.department">
                            <BuildingIcon class="meta-icon" />
                            {{ getDepartmentName(item.departmentId) }}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span class="type-badge" :class="getTypeClass(item)">
                      {{ getTypeText(item) }}
                    </span>
                  </td>
                  <td>
                    <span class="file-size">
                      {{ item.type === 'folder' ? '-' : formatFileSize(item.size) }}
                    </span>
                  </td>
                  <td>
                    <div class="date-cell">
                      <span class="date">{{ formatDate(item.modifiedAt) }}</span>
                      <small class="time">{{ formatTime(item.modifiedAt) }}</small>
                    </div>
                  </td>
                  <td>
                    <div class="action-buttons">
                      <button 
                        v-if="item.type === 'folder'" 
                        class="action-btn-small open" 
                        @click="openFolder(item)" 
                        title="Ouvrir"
                      >
                        <FolderOpenIcon class="action-icon" />
                      </button>
                      <button 
                        v-else 
                        class="action-btn-small view" 
                        @click="viewFile(item)" 
                        title="Voir"
                      >
                        <EyeIcon class="action-icon" />
                      </button>
                      <button 
                        v-if="item.type !== 'folder'" 
                        class="action-btn-small download" 
                        @click="downloadFile(item)" 
                        title="Télécharger"
                      >
                        <DownloadIcon class="action-icon" />
                      </button>
                      <button 
                        class="action-btn-small share" 
                        @click="shareItem(item)" 
                        title="Partager"
                      >
                        <ShareIcon class="action-icon" />
                      </button>
                      <button 
                        class="action-btn-small more" 
                        @click="showItemMenu(item, $event)" 
                        title="Plus d'options"
                      >
                        <MoreHorizontalIcon class="action-icon" />
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
  
          <!-- Grid View -->
          <div v-else class="grid-view">
            <div class="files-grid">
              <div 
                v-for="item in paginatedItems" 
                :key="item.id" 
                class="file-card animate-fade"
                @dblclick="handleItemDoubleClick(item)"
              >
                <div class="card-header">
                  <div class="file-icon-large">
                    <component :is="getFileIcon(item)" class="icon" :class="getFileIconClass(item)" />
                    <LockIcon v-if="item.isProtected" class="protection-icon" />
                  </div>
                  <div class="card-actions">
                    <button 
                      class="card-action-btn" 
                      @click="showItemMenu(item, $event)"
                    >
                      <MoreHorizontalIcon class="action-icon" />
                    </button>
                  </div>
                </div>
                
                <div class="card-content">
                  <h3 class="card-title">{{ item.name }}</h3>
                  <p class="card-description" v-if="item.description">{{ item.description }}</p>
                  
                  <div class="card-meta">
                    <div class="meta-row">
                      <span class="type-badge small" :class="getTypeClass(item)">
                        {{ getTypeText(item) }}
                      </span>
                      <span class="file-size small">
                        {{ item.type === 'folder' ? '' : formatFileSize(item.size) }}
                      </span>
                    </div>
                    <div class="meta-row">
                      <span class="owner">
                        <UserIcon class="meta-icon" />
                        {{ item.owner?.name }}
                      </span>
                      <span class="date">{{ formatDate(item.modifiedAt) }}</span>
                    </div>
                  </div>
                </div>
                
                <div class="card-footer">
                  <div class="quick-actions">
                    <button 
                      v-if="item.type === 'folder'" 
                      class="quick-action-btn primary" 
                      @click="openFolder(item)"
                    >
                      <FolderOpenIcon class="action-icon" />
                      Ouvrir
                    </button>
                    <button 
                      v-else 
                      class="quick-action-btn primary" 
                      @click="viewFile(item)"
                    >
                      <EyeIcon class="action-icon" />
                      Voir
                    </button>
                    <button 
                      v-if="item.type !== 'folder'" 
                      class="quick-action-btn secondary" 
                      @click="downloadFile(item)"
                    >
                      <DownloadIcon class="action-icon" />
                    </button>
                    <button 
                      class="quick-action-btn secondary" 
                      @click="shareItem(item)"
                    >
                      <ShareIcon class="action-icon" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
  
          <!-- Empty State -->
          <div v-if="filteredItems.length === 0" class="empty-state">
            <FolderIcon class="empty-icon" />
            <h3>Aucun élément trouvé</h3>
            <p>Ce dossier est vide ou aucun élément ne correspond à vos critères de recherche.</p>
            <button class="action-btn primary" @click="openUploadDialog">
              <UploadIcon class="btn-icon" />
              Ajouter des fichiers
            </button>
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
  
      <!-- Create Folder Dialog -->
      <div v-if="createFolderDialog" class="dialog-overlay" @click="closeCreateFolderDialog">
        <div class="dialog-box" @click.stop>
          <div class="dialog-header">
            <h3>Nouveau Dossier</h3>
            <button class="close-btn" @click="closeCreateFolderDialog">
              <XIcon class="close-icon" />
            </button>
          </div>
          <div class="dialog-content">
            <form @submit.prevent="createFolder">
              <div class="form-group">
                <label>Nom du dossier *</label>
                <input 
                  type="text" 
                  v-model="folderForm.name"
                  placeholder="Ex: Rapports 2025..."
                  required 
                  ref="folderNameInput"
                />
              </div>
              
              <div class="form-group">
                <label>Description</label>
                <textarea 
                  v-model="folderForm.description"
                  placeholder="Description du dossier..."
                  rows="3"
                ></textarea>
              </div>
              
              <div class="form-group">
                <label>Département *</label>
                <select v-model="folderForm.departmentId" required>
                  <option value="">Sélectionner un département</option>
                  <option 
                    v-for="dept in departments" 
                    :key="dept.id" 
                    :value="dept.id"
                  >
                    {{ dept.name }}
                  </option>
                </select>
              </div>
              
              <div class="form-group">
                <div class="checkbox-group">
                  <input 
                    type="checkbox" 
                    id="isProtected"
                    v-model="folderForm.isProtected"
                  />
                  <label for="isProtected" class="checkbox-label">
                    <LockIcon class="checkbox-icon" />
                    Protéger ce dossier par un code
                  </label>
                </div>
              </div>
              
              <div v-if="folderForm.isProtected" class="form-group">
                <label>Code d'accès *</label>
                <input 
                  type="password" 
                  v-model="folderForm.accessCode"
                  placeholder="Code à 4 chiffres minimum"
                  minlength="4"
                  required 
                />
              </div>
              
              <div class="dialog-actions">
                <button type="submit" class="dialog-btn save">
                  <FolderPlusIcon class="button-icon" />
                  Créer le dossier
                </button>
                <button type="button" class="dialog-btn cancel" @click="closeCreateFolderDialog">
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
  
      <!-- Upload Dialog -->
      <div v-if="uploadDialog" class="dialog-overlay" @click="closeUploadDialog">
        <div class="dialog-box large" @click.stop>
          <div class="dialog-header">
            <h3>Téléverser des fichiers</h3>
            <button class="close-btn" @click="closeUploadDialog">
              <XIcon class="close-icon" />
            </button>
          </div>
          <div class="dialog-content">
            <div class="upload-area" @drop="handleDrop" @dragover.prevent @dragenter.prevent>
              <div class="upload-zone" :class="{ 'drag-over': isDragOver }">
                <UploadIcon class="upload-icon" />
                <h4>Glissez-déposez vos fichiers ici</h4>
                <p>ou cliquez pour sélectionner</p>
                <input 
                  type="file" 
                  ref="fileInput"
                  multiple
                  @change="handleFileSelect"
                  class="file-input"
                />
                <button type="button" class="upload-btn" @click="$refs.fileInput.click()">
                  Sélectionner des fichiers
                </button>
              </div>
            </div>
            
            <div v-if="uploadQueue.length > 0" class="upload-queue">
              <h4>Fichiers à téléverser ({{ uploadQueue.length }})</h4>
              <div class="queue-list">
                <div 
                  v-for="(file, index) in uploadQueue" 
                  :key="index" 
                  class="queue-item"
                >
                  <div class="queue-file-info">
                    <component :is="getFileIconByName(file.name)" class="queue-file-icon" />
                    <div class="queue-file-details">
                      <strong>{{ file.name }}</strong>
                      <small>{{ formatFileSize(file.size) }}</small>
                    </div>
                  </div>
                  <div class="queue-file-options">
                    <div class="protection-option">
                      <input 
                        type="checkbox" 
                        :id="'protect-' + index"
                        v-model="file.isProtected"
                      />
                      <label :for="'protect-' + index" class="protection-label">
                        <LockIcon class="protection-icon" />
                        Protéger
                      </label>
                    </div>
                    <button 
                      class="remove-btn" 
                      @click="removeFromQueue(index)"
                      title="Retirer"
                    >
                      <XIcon class="remove-icon" />
                    </button>
                  </div>
                </div>
              </div>
              
              <div class="upload-options">
                <div class="form-group">
                  <label>Département de destination *</label>
                  <select v-model="uploadForm.departmentId" required>
                    <option value="">Sélectionner un département</option>
                    <option 
                      v-for="dept in departments" 
                      :key="dept.id" 
                      :value="dept.id"
                    >
                      {{ dept.name }}
                    </option>
                  </select>
                </div>
              </div>
              
              <div class="dialog-actions">
                <button 
                  type="button" 
                  class="dialog-btn save" 
                  @click="startUpload"
                  :disabled="!uploadForm.departmentId"
                >
                  <UploadIcon class="button-icon" />
                  Téléverser {{ uploadQueue.length }} fichier(s)
                </button>
                <button type="button" class="dialog-btn cancel" @click="clearQueue">
                  Vider la file
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Access Code Dialog -->
      <div v-if="accessCodeDialog" class="dialog-overlay" @click="closeAccessCodeDialog">
        <div class="dialog-box small" @click.stop>
          <div class="dialog-header">
            <h3>Accès Protégé</h3>
            <button class="close-btn" @click="closeAccessCodeDialog">
              <XIcon class="close-icon" />
            </button>
          </div>
          <div class="dialog-content">
            <div class="access-info">
              <LockIcon class="access-icon" />
              <p>Ce {{ selectedItem?.type === 'folder' ? 'dossier' : 'fichier' }} est protégé par un code d'accès.</p>
              <strong>{{ selectedItem?.name }}</strong>
            </div>
            
            <form @submit.prevent="verifyAccessCode">
              <div class="form-group">
                <label>Code d'accès *</label>
                <input 
                  type="password" 
                  v-model="accessForm.code"
                  placeholder="Entrez le code d'accès"
                  required 
                  ref="accessCodeInput"
                  class="access-code-input"
                />
              </div>
              
              <div v-if="accessError" class="error-message">
                <AlertTriangleIcon class="error-icon" />
                Code d'accès incorrect
              </div>
              
              <div class="dialog-actions">
                <button type="submit" class="dialog-btn save">
                  <UnlockIcon class="button-icon" />
                  Accéder
                </button>
                <button type="button" class="dialog-btn cancel" @click="closeAccessCodeDialog">
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
  
      <!-- File Viewer Dialog -->
      <div v-if="fileViewerDialog" class="dialog-overlay" @click="closeFileViewer">
        <div class="dialog-box extra-large" @click.stop>
          <div class="dialog-header">
            <h3>{{ selectedFile?.name }}</h3>
            <div class="viewer-actions">
              <button class="action-btn small secondary" @click="downloadFile(selectedFile)">
                <DownloadIcon class="btn-icon" />
                Télécharger
              </button>
              <button class="close-btn" @click="closeFileViewer">
                <XIcon class="close-icon" />
              </button>
            </div>
          </div>
          <div class="dialog-content">
            <div class="file-viewer" v-if="selectedFile">
              <!-- Image Viewer -->
              <div v-if="isImageFile(selectedFile)" class="image-viewer">
                <img :src="selectedFile.url" :alt="selectedFile.name" class="preview-image" />
              </div>
              
              <!-- Video Viewer -->
              <div v-else-if="isVideoFile(selectedFile)" class="video-viewer">
                <video :src="selectedFile.url" controls class="preview-video">
                  Votre navigateur ne supporte pas la lecture vidéo.
                </video>
              </div>
              
              <!-- Document Viewer -->
              <div v-else-if="isDocumentFile(selectedFile)" class="document-viewer">
                <div class="document-info">
                  <component :is="getFileIcon(selectedFile)" class="doc-icon" />
                  <div class="doc-details">
                    <h4>{{ selectedFile.name }}</h4>
                    <p>{{ formatFileSize(selectedFile.size) }} • {{ getFileExtension(selectedFile.name) }}</p>
                    <p class="doc-description" v-if="selectedFile.description">{{ selectedFile.description }}</p>
                  </div>
                </div>
                <div class="document-actions">
                  <button class="action-btn primary" @click="downloadFile(selectedFile)">
                    <DownloadIcon class="btn-icon" />
                    Télécharger pour ouvrir
                  </button>
                </div>
              </div>
              
              <!-- Default Viewer -->
              <div v-else class="default-viewer">
                <component :is="getFileIcon(selectedFile)" class="file-icon-large" />
                <h4>{{ selectedFile.name }}</h4>
                <p>{{ formatFileSize(selectedFile.size) }} • {{ getFileExtension(selectedFile.name) }}</p>
                <p class="file-description" v-if="selectedFile.description">{{ selectedFile.description }}</p>
                <button class="action-btn primary" @click="downloadFile(selectedFile)">
                  <DownloadIcon class="btn-icon" />
                  Télécharger
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Context Menu -->
      <div 
        v-if="contextMenu.show" 
        class="context-menu"
        :style="{ top: contextMenu.y + 'px', left: contextMenu.x + 'px' }"
        @click.stop
      >
        <button class="context-menu-item" @click="renameItem(contextMenu.item)">
          <EditIcon class="context-icon" />
          Renommer
        </button>
        <button class="context-menu-item" @click="moveItem(contextMenu.item)">
          <MoveIcon class="context-icon" />
          Déplacer
        </button>
        <button class="context-menu-item" @click="copyItem(contextMenu.item)">
          <CopyIcon class="context-icon" />
          Copier
        </button>
        <button class="context-menu-item" @click="shareItem(contextMenu.item)">
          <ShareIcon class="context-icon" />
          Partager
        </button>
        <div class="context-menu-separator"></div>
        <button class="context-menu-item" @click="toggleProtection(contextMenu.item)">
          <LockIcon v-if="!contextMenu.item.isProtected" class="context-icon" />
          <UnlockIcon v-else class="context-icon" />
          {{ contextMenu.item.isProtected ? 'Déprotéger' : 'Protéger' }}
        </button>
        <div class="context-menu-separator"></div>
        <button class="context-menu-item danger" @click="deleteItem(contextMenu.item)">
          <TrashIcon class="context-icon" />
          Supprimer
        </button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted, nextTick } from 'vue'
  import {
    FolderIcon,
    FolderPlusIcon,
    FolderOpenIcon,
    FileIcon,
    UploadIcon,
    DownloadIcon,
    GridIcon,
    ListIcon,
    LockIcon,
    UnlockIcon,
    ShieldIcon,
    ClockIcon,
    CalendarIcon,
    InfoIcon,
    TrendingUpIcon,
    SearchIcon,
    ChevronRightIcon,
    ChevronLeftIcon,
    ChevronUpIcon,
    ChevronDownIcon,
    EyeIcon,
    ShareIcon,
    MoreHorizontalIcon,
    XIcon,
    UserIcon,
    BuildingIcon,
    AlertTriangleIcon,
    EditIcon,
    MoveIcon,
    CopyIcon,
    TrashIcon,
    FileTextIcon,
    ImageIcon,
    VideoIcon,
    ArchiveIcon,
    MusicIcon
  } from 'lucide-vue-next'
  
  // Données réactives
  const createFolderDialog = ref(false)
  const uploadDialog = ref(false)
  const accessCodeDialog = ref(false)
  const fileViewerDialog = ref(false)
  const selectedItem = ref(null)
  const selectedFile = ref(null)
  const viewMode = ref('list') // 'list' ou 'grid'
  const isDragOver = ref(false)
  
  // Navigation - Correction de l'initialisation
  const currentPath = ref([])
  const currentFolder = ref(null)
  
  // Filtres et recherche
  const searchTerm = ref('')
  const selectedDepartment = ref('')
  const selectedFileType = ref('')
  const sortField = ref('name')
  const sortOrder = ref('asc')
  const currentPage = ref(1)
  const itemsPerPage = 20
  
  // Formulaires
  const folderForm = ref({
    name: '',
    description: '',
    departmentId: '',
    isProtected: false,
    accessCode: ''
  })
  
  const uploadForm = ref({
    departmentId: ''
  })
  
  const accessForm = ref({
    code: ''
  })
  
  const accessError = ref(false)
  const uploadQueue = ref([])
  
  // Context Menu
  const contextMenu = ref({
    show: false,
    x: 0,
    y: 0,
    item: null
  })
  
  // Utilisateur actuel
  const currentUser = ref({
    id: 1,
    name: 'Abdoulaye Koné',
    role: 'SENACREX'
  })
  
  // Départements
  const departments = ref([
    {
      id: 1,
      name: 'SENACREX',
      code: 'SCRX',
      color: '#10b981'
    },
    {
      id: 2,
      name: 'SENAFI',
      code: 'SNFI',
      color: '#3b82f6'
    },
    {
      id: 3,
      name: 'SENAMO',
      code: 'SNMO',
      color: '#f59e0b'
    },
    {
      id: 4,
      name: 'SENACUL',
      code: 'SCUL',
      color: '#ef4444'
    },
    {
      id: 5,
      name: 'SENASPO',
      code: 'SSPO',
      color: '#8b5cf6'
    }
  ])
  
  // Structure des fichiers et dossiers
  const fileSystem = ref([
    // Dossiers racine par département
    {
      id: 1,
      name: 'SENACREX',
      type: 'folder',
      departmentId: 1,
      parentId: null,
      isProtected: false,
      accessCode: null,
      description: 'Documents du Secrétariat aux Relations Extérieures',
      owner: { id: 1, name: 'Abdoulaye Koné' },
      createdAt: new Date('2024-01-15'),
      modifiedAt: new Date('2025-01-20'),
      size: 0
    },
    {
      id: 2,
      name: 'SENAFI',
      type: 'folder',
      departmentId: 2,
      parentId: null,
      isProtected: false,
      accessCode: null,
      description: 'Documents du Secrétariat aux Finances',
      owner: { id: 2, name: 'Fatoumata Maiga' },
      createdAt: new Date('2024-01-15'),
      modifiedAt: new Date('2025-01-18'),
      size: 0
    },
    {
      id: 3,
      name: 'SENAMO',
      type: 'folder',
      departmentId: 3,
      parentId: null,
      isProtected: false,
      accessCode: null,
      description: 'Documents du Secrétariat à la Mobilisation',
      owner: { id: 3, name: 'Karim Mory' },
      createdAt: new Date('2024-01-15'),
      modifiedAt: new Date('2025-01-19'),
      size: 0
    },
    {
      id: 4,
      name: 'SENACUL',
      type: 'folder',
      departmentId: 4,
      parentId: null,
      isProtected: false,
      accessCode: null,
      description: 'Documents du Secrétariat à la Culture',
      owner: { id: 4, name: 'Aminata Traoré' },
      createdAt: new Date('2024-01-15'),
      modifiedAt: new Date('2025-01-21'),
      size: 0
    },
    {
      id: 5,
      name: 'SENASPO',
      type: 'folder',
      departmentId: 5,
      parentId: null,
      isProtected: false,
      accessCode: null,
      description: 'Documents du Secrétariat aux Sports',
      owner: { id: 5, name: 'Moussa Diarra' },
      createdAt: new Date('2024-01-15'),
      modifiedAt: new Date('2025-01-17'),
      size: 0
    },
    
    // Sous-dossiers SENACREX
    {
      id: 11,
      name: 'Rapports Annuels',
      type: 'folder',
      departmentId: 1,
      parentId: 1,
      isProtected: true,
      accessCode: '2025',
      description: 'Rapports d\'activité annuels confidentiels',
      owner: { id: 1, name: 'Abdoulaye Koné' },
      createdAt: new Date('2024-02-01'),
      modifiedAt: new Date('2025-01-20'),
      size: 0
    },
    {
      id: 12,
      name: 'Correspondances',
      type: 'folder',
      departmentId: 1,
      parentId: 1,
      isProtected: false,
      accessCode: null,
      description: 'Correspondances officielles',
      owner: { id: 1, name: 'Abdoulaye Koné' },
      createdAt: new Date('2024-02-01'),
      modifiedAt: new Date('2025-01-15'),
      size: 0
    },
    
    // Fichiers SENACREX
    {
      id: 101,
      name: 'Rapport_Activite_2024.pdf',
      type: 'file',
      fileType: 'document',
      extension: 'pdf',
      departmentId: 1,
      parentId: 11,
      isProtected: true,
      accessCode: '2024',
      description: 'Rapport d\'activité complet pour l\'année 2024',
      owner: { id: 1, name: 'Abdoulaye Koné' },
      createdAt: new Date('2024-12-30'),
      modifiedAt: new Date('2024-12-30'),
      size: 2547892,
      url: '/placeholder.svg?height=600&width=800'
    },
    {
      id: 102,
      name: 'Budget_Previsionnel_2025.xlsx',
      type: 'file',
      fileType: 'document',
      extension: 'xlsx',
      departmentId: 1,
      parentId: 11,
      isProtected: true,
      accessCode: '2025',
      description: 'Budget prévisionnel pour l\'année 2025',
      owner: { id: 1, name: 'Abdoulaye Koné' },
      createdAt: new Date('2024-12-15'),
      modifiedAt: new Date('2025-01-10'),
      size: 1234567,
      url: '/placeholder.svg?height=600&width=800'
    },
    {
      id: 103,
      name: 'Lettre_Ambassade_Mali.docx',
      type: 'file',
      fileType: 'document',
      extension: 'docx',
      departmentId: 1,
      parentId: 12,
      isProtected: false,
      accessCode: null,
      description: 'Correspondance avec l\'Ambassade du Mali',
      owner: { id: 1, name: 'Abdoulaye Koné' },
      createdAt: new Date('2025-01-15'),
      modifiedAt: new Date('2025-01-15'),
      size: 456789,
      url: '/placeholder.svg?height=600&width=800'
    },
    
    // Sous-dossiers SENACUL
    {
      id: 21,
      name: 'Événements 2025',
      type: 'folder',
      departmentId: 4,
      parentId: 4,
      isProtected: false,
      accessCode: null,
      description: 'Organisation des événements culturels 2025',
      owner: { id: 4, name: 'Aminata Traoré' },
      createdAt: new Date('2024-12-01'),
      modifiedAt: new Date('2025-01-21'),
      size: 0
    },
    {
      id: 22,
      name: 'Archives Photos',
      type: 'folder',
      departmentId: 4,
      parentId: 4,
      isProtected: false,
      accessCode: null,
      description: 'Archives photographiques des événements',
      owner: { id: 4, name: 'Aminata Traoré' },
      createdAt: new Date('2024-01-20'),
      modifiedAt: new Date('2025-01-10'),
      size: 0
    },
    
    // Fichiers SENACUL
    {
      id: 201,
      name: 'Soiree_Culturelle_2025.jpg',
      type: 'file',
      fileType: 'image',
      extension: 'jpg',
      departmentId: 4,
      parentId: 22,
      isProtected: false,
      accessCode: null,
      description: 'Affiche de la soirée culturelle 2025',
      owner: { id: 4, name: 'Aminata Traoré' },
      createdAt: new Date('2025-01-10'),
      modifiedAt: new Date('2025-01-10'),
      size: 3456789,
      url: '/placeholder.svg?height=600&width=800'
    },
    {
      id: 202,
      name: 'Programme_Soiree.pdf',
      type: 'file',
      fileType: 'document',
      extension: 'pdf',
      departmentId: 4,
      parentId: 21,
      isProtected: false,
      accessCode: null,
      description: 'Programme détaillé de la soirée culturelle',
      owner: { id: 4, name: 'Aminata Traoré' },
      createdAt: new Date('2025-01-20'),
      modifiedAt: new Date('2025-01-21'),
      size: 987654,
      url: '/placeholder.svg?height=600&width=800'
    },
    {
      id: 203,
      name: 'Video_Presentation.mp4',
      type: 'file',
      fileType: 'video',
      extension: 'mp4',
      departmentId: 4,
      parentId: 21,
      isProtected: true,
      accessCode: '1234',
      description: 'Vidéo de présentation de l\'AEEMCI',
      owner: { id: 4, name: 'Aminata Traoré' },
      createdAt: new Date('2025-01-18'),
      modifiedAt: new Date('2025-01-18'),
      size: 45678901,
      url: '/placeholder.svg?height=400&width=600'
    },
    
    // Fichiers SENAFI
    {
      id: 301,
      name: 'Bilan_Financier_2024.xlsx',
      type: 'file',
      fileType: 'document',
      extension: 'xlsx',
      departmentId: 2,
      parentId: 2,
      isProtected: true,
      accessCode: 'finance2024',
      description: 'Bilan financier complet de l\'année 2024',
      owner: { id: 2, name: 'Fatoumata Maiga' },
      createdAt: new Date('2024-12-31'),
      modifiedAt: new Date('2025-01-05'),
      size: 2345678,
      url: '/placeholder.svg?height=600&width=800'
    },
    {
      id: 302,
      name: 'Factures_2024.zip',
      type: 'file',
      fileType: 'archive',
      extension: 'zip',
      departmentId: 2,
      parentId: 2,
      isProtected: false,
      accessCode: null,
      description: 'Archive des factures de l\'année 2024',
      owner: { id: 2, name: 'Fatoumata Maiga' },
      createdAt: new Date('2025-01-02'),
      modifiedAt: new Date('2025-01-02'),
      size: 12345678,
      url: '/placeholder.svg?height=600&width=800'
    }
  ])
  
  // Données calculées
  const filteredItems = ref([])
  
  // Correction du breadcrumbs
  const breadcrumbs = computed(() => {
    const crumbs = [{ name: 'Racine', path: [] }]
    
    let pathSoFar = []
    for (const folderId of currentPath.value) {
      const folder = fileSystem.value.find(item => item.id === folderId)
      if (folder) {
        pathSoFar.push(folderId)
        crumbs.push({
          name: folder.name,
          path: [...pathSoFar]
        })
      }
    }
    
    return crumbs
  })
  
  const paginatedItems = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage
    const end = start + itemsPerPage
    return filteredItems.value.slice(start, end)
  })
  
  const totalPages = computed(() => 
    Math.ceil(filteredItems.value.length / itemsPerPage)
  )
  
  const totalFolders = computed(() => 
    fileSystem.value.filter(item => item.type === 'folder').length
  )
  
  const totalFiles = computed(() => 
    fileSystem.value.filter(item => item.type === 'file').length
  )
  
  const totalSize = computed(() => 
    fileSystem.value.filter(item => item.type === 'file').reduce((sum, file) => sum + file.size, 0)
  )
  
  const protectedItems = computed(() => 
    fileSystem.value.filter(item => item.isProtected).length
  )
  
  const recentFiles = computed(() => {
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
    return fileSystem.value.filter(item => 
      item.type === 'file' && item.modifiedAt >= oneWeekAgo
    ).length
  })
  
  // Fonctions utilitaires
  const formatDate = (date) => {
    return date.toLocaleDateString('fr-FR')
  }
  
  const formatTime = (date) => {
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
  }
  
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }
  
  const getDepartmentName = (departmentId) => {
    const dept = departments.value.find(d => d.id === departmentId)
    return dept ? dept.name : 'Inconnu'
  }
  
  const getFileIcon = (item) => {
    if (item.type === 'folder') return FolderIcon
    
    switch (item.fileType) {
      case 'document':
        return FileTextIcon
      case 'image':
        return ImageIcon
      case 'video':
        return VideoIcon
      case 'archive':
        return ArchiveIcon
      case 'audio':
        return MusicIcon
      default:
        return FileIcon
    }
  }
  
  const getFileIconByName = (fileName) => {
    const extension = getFileExtension(fileName).toLowerCase()
    
    if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg'].includes(extension)) {
      return ImageIcon
    } else if (['mp4', 'avi', 'mov', 'wmv', 'flv'].includes(extension)) {
      return VideoIcon
    } else if (['mp3', 'wav', 'flac', 'aac'].includes(extension)) {
      return MusicIcon
    } else if (['zip', 'rar', '7z', 'tar'].includes(extension)) {
      return ArchiveIcon
    } else if (['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'].includes(extension)) {
      return FileTextIcon
    } else {
      return FileIcon
    }
  }
  
  const getFileIconClass = (item) => {
    if (item.type === 'folder') return 'folder-icon'
    
    switch (item.fileType) {
      case 'document':
        return 'document-icon'
      case 'image':
        return 'image-icon'
      case 'video':
        return 'video-icon'
      case 'archive':
        return 'archive-icon'
      case 'audio':
        return 'audio-icon'
      default:
        return 'file-icon'
    }
  }
  
  const getTypeClass = (item) => {
    if (item.type === 'folder') return 'folder'
    return item.fileType || 'file'
  }
  
  const getTypeText = (item) => {
    if (item.type === 'folder') return 'Dossier'
    
    const types = {
      'document': 'Document',
      'image': 'Image',
      'video': 'Vidéo',
      'archive': 'Archive',
      'audio': 'Audio'
    }
    
    return types[item.fileType] || 'Fichier'
  }
  
  const getFileExtension = (fileName) => {
    return fileName.split('.').pop() || ''
  }
  
  const isImageFile = (file) => {
    return file.fileType === 'image'
  }
  
  const isVideoFile = (file) => {
    return file.fileType === 'video'
  }
  
  const isDocumentFile = (file) => {
    return file.fileType === 'document'
  }
  
  const getCurrentFolderSize = () => {
    const currentFolderId = currentPath.value[currentPath.value.length - 1] || null
    return fileSystem.value
      .filter(item => item.parentId === currentFolderId && item.type === 'file')
      .reduce((sum, file) => sum + file.size, 0)
  }
  
  // Fonctions de navigation
  const navigateToPath = (path) => {
    currentPath.value = [...path]
    updateCurrentFolder()
    filterItems()
  }
  
  const updateCurrentFolder = () => {
    const currentFolderId = currentPath.value[currentPath.value.length - 1] || null
    currentFolder.value = currentFolderId ? 
      fileSystem.value.find(item => item.id === currentFolderId) : null
  }
  
  const openFolder = (folder) => {
    if (folder.isProtected) {
      selectedItem.value = folder
      accessForm.value.code = ''
      accessError.value = false
      accessCodeDialog.value = true
      return
    }
    
    currentPath.value.push(folder.id)
    updateCurrentFolder()
    filterItems()
  }
  
  const handleItemDoubleClick = (item) => {
    if (item.type === 'folder') {
      openFolder(item)
    } else {
      viewFile(item)
    }
  }
  
  // Fonctions de filtrage et tri
  const filterItems = () => {
    const currentFolderId = currentPath.value[currentPath.value.length - 1] || null
    let filtered = fileSystem.value.filter(item => item.parentId === currentFolderId)
    
    if (searchTerm.value) {
      const search = searchTerm.value.toLowerCase()
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(search) ||
        (item.description && item.description.toLowerCase().includes(search))
      )
    }
    
    if (selectedDepartment.value) {
      filtered = filtered.filter(item => item.departmentId === parseInt(selectedDepartment.value))
    }
    
    if (selectedFileType.value) {
      filtered = filtered.filter(item => 
        item.type === 'folder' || item.fileType === selectedFileType.value
      )
    }
    
    filteredItems.value = filtered
    currentPage.value = 1
  }
  
  const sortBy = (field) => {
    if (sortField.value === field) {
      sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
    } else {
      sortField.value = field
      sortOrder.value = 'asc'
    }
  
    filteredItems.value.sort((a, b) => {
      let aVal = a[field]
      let bVal = b[field]
      
      // Toujours mettre les dossiers en premier
      if (a.type === 'folder' && b.type !== 'folder') return -1
      if (a.type !== 'folder' && b.type === 'folder') return 1
      
      if (field === 'modifiedAt' || field === 'createdAt') {
        aVal = new Date(aVal)
        bVal = new Date(bVal)
      } else if (field === 'size') {
        aVal = a.type === 'folder' ? 0 : aVal
        bVal = b.type === 'folder' ? 0 : bVal
      } else if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase()
        bVal = bVal.toLowerCase()
      }
      
      if (sortOrder.value === 'asc') {
        return aVal > bVal ? 1 : -1
      } else {
        return aVal < bVal ? 1 : -1
      }
    })
  }
  
  const toggleViewMode = () => {
    viewMode.value = viewMode.value === 'list' ? 'grid' : 'list'
  }
  
  // Fonctions de dialog - Dossier
  const openCreateFolderDialog = () => {
    folderForm.value = {
      name: '',
      description: '',
      departmentId: '',
      isProtected: false,
      accessCode: ''
    }
    createFolderDialog.value = true
  }
  
  const closeCreateFolderDialog = () => {
    createFolderDialog.value = false
  }
  
  const createFolder = () => {
    const currentFolderId = currentPath.value[currentPath.value.length - 1] || null
    
    const newFolder = {
      id: Date.now(),
      name: folderForm.value.name,
      type: 'folder',
      departmentId: parseInt(folderForm.value.departmentId),
      parentId: currentFolderId,
      isProtected: folderForm.value.isProtected,
      accessCode: folderForm.value.isProtected ? folderForm.value.accessCode : null,
      description: folderForm.value.description,
      owner: currentUser.value,
      createdAt: new Date(),
      modifiedAt: new Date(),
      size: 0
    }
    
    fileSystem.value.push(newFolder)
    filterItems()
    closeCreateFolderDialog()
  }
  
  // Fonctions de dialog - Upload
  const openUploadDialog = () => {
    uploadForm.value.departmentId = ''
    uploadQueue.value = []
    uploadDialog.value = true
  }
  
  const closeUploadDialog = () => {
    uploadDialog.value = false
    uploadQueue.value = []
  }
  
  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files)
    addFilesToQueue(files)
  }
  
  const handleDrop = (event) => {
    event.preventDefault()
    isDragOver.value = false
    const files = Array.from(event.dataTransfer.files)
    addFilesToQueue(files)
  }
  
  const addFilesToQueue = (files) => {
    files.forEach(file => {
      const fileObj = {
        name: file.name,
        size: file.size,
        type: file.type,
        file: file,
        isProtected: false,
        accessCode: ''
      }
      uploadQueue.value.push(fileObj)
    })
  }
  
  const removeFromQueue = (index) => {
    uploadQueue.value.splice(index, 1)
  }
  
  const clearQueue = () => {
    uploadQueue.value = []
  }
  
  const startUpload = () => {
    const currentFolderId = currentPath.value[currentPath.value.length - 1] || null
    
    uploadQueue.value.forEach(fileObj => {
      const extension = getFileExtension(fileObj.name).toLowerCase()
      let fileType = 'file'
      
      if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg'].includes(extension)) {
        fileType = 'image'
      } else if (['mp4', 'avi', 'mov', 'wmv', 'flv'].includes(extension)) {
        fileType = 'video'
      } else if (['mp3', 'wav', 'flac', 'aac'].includes(extension)) {
        fileType = 'audio'
      } else if (['zip', 'rar', '7z', 'tar'].includes(extension)) {
        fileType = 'archive'
      } else if (['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'].includes(extension)) {
        fileType = 'document'
      }
      
      const newFile = {
        id: Date.now() + Math.random(),
        name: fileObj.name,
        type: 'file',
        fileType: fileType,
        extension: extension,
        departmentId: parseInt(uploadForm.value.departmentId),
        parentId: currentFolderId,
        isProtected: fileObj.isProtected,
        accessCode: fileObj.isProtected ? fileObj.accessCode : null,
        description: '',
        owner: currentUser.value,
        createdAt: new Date(),
        modifiedAt: new Date(),
        size: fileObj.size,
        url: URL.createObjectURL(fileObj.file)
      }
      
      fileSystem.value.push(newFile)
    })
    
    filterItems()
    closeUploadDialog()
  }
  
  // Fonctions de dialog - Code d'accès
  const closeAccessCodeDialog = () => {
    accessCodeDialog.value = false
    selectedItem.value = null
    accessError.value = false
  }
  
  const verifyAccessCode = () => {
    if (accessForm.value.code === selectedItem.value.accessCode) {
      accessError.value = false
      closeAccessCodeDialog()
      
      if (selectedItem.value.type === 'folder') {
        currentPath.value.push(selectedItem.value.id)
        updateCurrentFolder()
        filterItems()
      } else {
        selectedFile.value = selectedItem.value
        fileViewerDialog.value = true
      }
    } else {
      accessError.value = true
    }
  }
  
  // Fonctions de visualisation
  const viewFile = (file) => {
    if (file.isProtected) {
      selectedItem.value = file
      accessForm.value.code = ''
      accessError.value = false
      accessCodeDialog.value = true
      return
    }
    
    selectedFile.value = file
    fileViewerDialog.value = true
  }
  
  const closeFileViewer = () => {
    fileViewerDialog.value = false
    selectedFile.value = null
  }
  
  const downloadFile = (file) => {
    if (file.isProtected) {
      selectedItem.value = file
      accessForm.value.code = ''
      accessError.value = false
      accessCodeDialog.value = true
      return
    }
    
    // Simuler le téléchargement
    const link = document.createElement('a')
    link.href = file.url
    link.download = file.name
    link.click()
  }
  
  // Fonctions de menu contextuel
  const showItemMenu = (item, event) => {
    event.preventDefault()
    contextMenu.value = {
      show: true,
      x: event.clientX,
      y: event.clientY,
      item: item
    }
  }
  
  const hideContextMenu = () => {
    contextMenu.value.show = false
  }
  
  const renameItem = (item) => {
    // Implémentation du renommage
    hideContextMenu()
  }
  
  const moveItem = (item) => {
    // Implémentation du déplacement
    hideContextMenu()
  }
  
  const copyItem = (item) => {
    // Implémentation de la copie
    hideContextMenu()
  }
  
  const shareItem = (item) => {
    // Implémentation du partage
    hideContextMenu()
  }
  
  const toggleProtection = (item) => {
    // Implémentation de la protection/déprotection
    hideContextMenu()
  }
  
  const deleteItem = (item) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer "${item.name}" ?`)) {
      const index = fileSystem.value.findIndex(i => i.id === item.id)
      if (index !== -1) {
        fileSystem.value.splice(index, 1)
        filterItems()
      }
    }
    hideContextMenu()
  }
  
  // Event listeners
  onMounted(() => {
    filterItems()
    
    // Cacher le menu contextuel au clic
    document.addEventListener('click', hideContextMenu)
    
    // Gérer le drag & drop
    document.addEventListener('dragover', (e) => {
      if (uploadDialog.value) {
        e.preventDefault()
        isDragOver.value = true
      }
    })
    
    document.addEventListener('dragleave', (e) => {
      if (uploadDialog.value && !e.relatedTarget) {
        isDragOver.value = false
      }
    })
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
  .cloud-wrapper {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background: #ffffff;
    min-height: 100vh;
    height: 100vh;
    overflow-y: auto;
    padding: 0;
    margin: 0;
  }
  
  .cloud-container {
    background: #ffffff;
    min-height: 100vh;
    padding: 32px;
    max-width: none;
    width: 100%;
    margin: 0;
  }
  
  /* Header */
  .cloud-header {
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
    background: linear-gradient(135deg, #3b82f6, #1d4ed8);
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
    background: linear-gradient(135deg, #3b82f6, #1d4ed8);
    color: white;
  }
  
  .action-btn.primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4);
  }
  
  .action-btn.secondary {
    background: linear-gradient(135deg, #10b981, #047857);
    color: white;
  }
  
  .action-btn.secondary:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(16, 185, 129, 0.4);
  }
  
  .action-btn.tertiary {
    background: white;
    color: #374151;
    border: 2px solid #e5e7eb;
  }
  
  .action-btn.tertiary:hover {
    border-color: #3b82f6;
    color: #3b82f6;
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
  
  .stat-card.primary::before { background: linear-gradient(90deg, #3b82f6, #1d4ed8); }
  .stat-card.secondary::before { background: linear-gradient(90deg, #10b981, #047857); }
  .stat-card.tertiary::before { background: linear-gradient(90deg, #f59e0b, #d97706); }
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
  
  .stat-card.primary .card-icon { background: rgba(59, 130, 246, 0.1); }
  .stat-card.secondary .card-icon { background: rgba(16, 185, 129, 0.1); }
  .stat-card.tertiary .card-icon { background: rgba(245, 158, 11, 0.1); }
  .stat-card.quaternary .card-icon { background: rgba(239, 68, 68, 0.1); }
  
  .card-icon .icon {
    width: 24px;
    height: 24px;
  }
  
  .stat-card.primary .icon { color: #3b82f6; }
  .stat-card.secondary .icon { color: #10b981; }
  .stat-card.tertiary .icon { color: #f59e0b; }
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
  .card-trend.warning { color: #d97706; }
  
  .trend-icon {
    width: 16px;
    height: 16px;
    margin-right: 4px;
  }
  
  /* Navigation */
  .navigation-section {
    margin-bottom: 32px;
  }
  
  .breadcrumb {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 20px;
    flex-wrap: wrap;
  }
  
  .breadcrumb-item {
    display: flex;
    align-items: center;
    padding: 8px 12px;
    background: #f8fafc;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 0.9rem;
    color: #6b7280;
  }
  
  .breadcrumb-item:hover {
    background: #e2e8f0;
    color: #374151;
  }
  
  .breadcrumb-item.active {
    background: #3b82f6;
    color: white;
    border-color: #3b82f6;
  }
  
  .breadcrumb-icon {
    width: 16px;
    height: 16px;
    margin-right: 6px;
  }
  
  .breadcrumb-separator {
    width: 14px;
    height: 14px;
    margin-right: 6px;
    color: #9ca3af;
  }
  
  .filters-section {
    display: flex;
    gap: 16px;
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
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
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
    border-color: #3b82f6;
  }
  
  /* Explorer */
  .explorer-section {
    background: white;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
    border: 1px solid #e5e7eb;
    margin-bottom: 32px;
  }
  
  .explorer-header {
    padding: 24px;
    border-bottom: 1px solid #e5e7eb;
    background: #f8fafc;
  }
  
  .explorer-title {
    margin: 0 0 8px 0;
    color: #1f2937;
    font-size: 1.4rem;
    font-weight: 600;
  }
  
  .explorer-info {
    color: #6b7280;
    font-size: 0.9rem;
  }
  
  /* List View */
  .list-view {
    overflow-x: auto;
  }
  
  .files-table {
    width: 100%;
    border-collapse: collapse;
  }
  
  .files-table th,
  .files-table td {
    padding: 16px 20px;
    text-align: left;
    border-bottom: 1px solid #f3f4f6;
  }
  
  .files-table th {
    background-color: #f8fafc;
    font-size: 0.85rem;
    font-weight: 600;
    text-transform: uppercase;
    color: #374151;
    letter-spacing: 0.5px;
  }
  
  .files-table th.sortable {
    cursor: pointer;
    user-select: none;
    position: relative;
    transition: all 0.2s ease;
  }
  
  .files-table th.sortable:hover {
    background-color: #e2e8f0;
  }
  
  .sort-icon {
    width: 14px;
    height: 14px;
    margin-left: 4px;
    display: inline-block;
  }
  
  .files-table td {
    font-size: 0.95rem;
    color: #374151;
  }
  
  .file-row {
    transition: all 0.2s ease;
    cursor: pointer;
  }
  
  .file-row:hover {
    background-color: #f8fafc;
  }
  
  .file-cell {
    display: flex;
    align-items: center;
    gap: 16px;
  }
  
  .file-icon {
    position: relative;
    flex-shrink: 0;
  }
  
  .file-icon .icon {
    width: 32px;
    height: 32px;
  }
  
  .file-icon .folder-icon { color: #3b82f6; }
  .file-icon .document-icon { color: #ef4444; }
  .file-icon .image-icon { color: #10b981; }
  .file-icon .video-icon { color: #8b5cf6; }
  .file-icon .archive-icon { color: #f59e0b; }
  .file-icon .audio-icon { color: #ec4899; }
  .file-icon .file-icon { color: #6b7280; }
  
  .protection-icon {
    position: absolute;
    top: -4px;
    right: -4px;
    width: 16px;
    height: 16px;
    color: #f59e0b;
    background: white;
    border-radius: 50%;
    padding: 2px;
  }
  
  .file-info {
    flex: 1;
    min-width: 0;
  }
  
  .file-name {
    font-weight: 600;
    color: #1f2937;
    margin: 0 0 4px 0;
    display: block;
    word-break: break-word;
  }
  
  .file-description {
    color: #6b7280;
    font-size: 0.85rem;
    line-height: 1.4;
    margin: 0 0 8px 0;
    display: block;
  }
  
  .file-meta {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
  }
  
  .meta-item {
    display: flex;
    align-items: center;
    font-size: 0.75rem;
    color: #9ca3af;
  }
  
  .meta-icon {
    width: 12px;
    height: 12px;
    margin-right: 4px;
  }
  
  .type-badge {
    padding: 4px 8px;
    border-radius: 8px;
    font-size: 0.8rem;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  
  .type-badge.small {
    padding: 2px 6px;
    font-size: 0.7rem;
  }
  
  .type-badge.folder {
    background: #dbeafe;
    color: #1d4ed8;
  }
  
  .type-badge.document {
    background: #fee2e2;
    color: #dc2626;
  }
  
  .type-badge.image {
    background: #d1fae5;
    color: #047857;
  }
  
  .type-badge.video {
    background: #f3e8ff;
    color: #7c3aed;
  }
  
  .type-badge.archive {
    background: #fef3c7;
    color: #d97706;
  }
  
  .type-badge.audio {
    background: #fce7f3;
    color: #be185d;
  }
  
  .type-badge.file {
    background: #f3f4f6;
    color: #6b7280;
  }
  
  .file-size {
    font-weight: 500;
    color: #374151;
  }
  
  .date-cell {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  
  .date {
    font-weight: 500;
    font-size: 0.9rem;
    color: #374151;
  }
  
  .time {
    color: #6b7280;
    font-size: 0.8rem;
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
  
  .action-btn-small.open {
    background-color: #3b82f6;
    color: white;
  }
  
  .action-btn-small.view {
    background-color: #10b981;
    color: white;
  }
  
  .action-btn-small.download {
    background-color: #f59e0b;
    color: white;
  }
  
  .action-btn-small.share {
    background-color: #8b5cf6;
    color: white;
  }
  
  .action-btn-small.more {
    background-color: #6b7280;
    color: white;
  }
  
  .action-icon {
    width: 14px;
    height: 14px;
  }
  
  /* Grid View */
  .grid-view {
    padding: 24px;
  }
  
  .files-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 24px;
  }
  
  .file-card {
    background: white;
    border-radius: 16px;
    border: 1px solid #e5e7eb;
    transition: all 0.3s ease;
    cursor: pointer;
    overflow: hidden;
  }
  
  .file-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.12);
    border-color: #3b82f6;
  }
  
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 20px 20px 0 20px;
  }
  
  .file-icon-large {
    position: relative;
  }
  
  .file-icon-large .icon {
    width: 48px;
    height: 48px;
  }
  
  .card-actions {
    opacity: 0;
    transition: opacity 0.2s ease;
  }
  
  .file-card:hover .card-actions {
    opacity: 1;
  }
  
  .card-action-btn {
    padding: 6px;
    border: none;
    background: #f3f4f6;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  
  .card-action-btn:hover {
    background: #e5e7eb;
  }
  
  .card-content {
    padding: 16px 20px;
  }
  
  .card-title {
    font-size: 1.1rem;
    font-weight: 600;
    color: #1f2937;
    margin: 0 0 8px 0;
    line-height: 1.4;
    word-break: break-word;
  }
  
  .card-description {
    color: #6b7280;
    font-size: 0.9rem;
    line-height: 1.4;
    margin: 0 0 16px 0;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  
  .card-meta {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  
  .meta-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.85rem;
  }
  
  .owner {
    display: flex;
    align-items: center;
    color: #6b7280;
  }
  
  .card-footer {
    padding: 0 20px 20px 20px;
  }
  
  .quick-actions {
    display: flex;
    gap: 8px;
  }
  
  .quick-action-btn {
    display: flex;
    align-items: center;
    padding: 8px 12px;
    border-radius: 8px;
    border: none;
    cursor: pointer;
    font-size: 0.85rem;
    font-weight: 500;
    transition: all 0.2s ease;
    flex: 1;
    justify-content: center;
  }
  
  .quick-action-btn.primary {
    background: #3b82f6;
    color: white;
  }
  
  .quick-action-btn.primary:hover {
    background: #2563eb;
  }
  
  .quick-action-btn.secondary {
    background: #f3f4f6;
    color: #374151;
  }
  
  .quick-action-btn.secondary:hover {
    background: #e5e7eb;
  }
  
  /* Empty State */
  .empty-state {
    text-align: center;
    padding: 80px 20px;
    color: #6b7280;
  }
  
  .empty-icon {
    width: 64px;
    height: 64px;
    margin: 0 auto 24px auto;
    opacity: 0.5;
  }
  
  .empty-state h3 {
    font-size: 1.5rem;
    font-weight: 600;
    color: #374151;
    margin: 0 0 12px 0;
  }
  
  .empty-state p {
    font-size: 1rem;
    margin: 0 0 24px 0;
    line-height: 1.5;
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
  
  .dialog-box.small {
    max-width: 400px;
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
  
  .viewer-actions {
    display: flex;
    gap: 12px;
    align-items: center;
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
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
  
  .form-group textarea {
    resize: vertical;
    min-height: 80px;
  }
  
  .checkbox-group {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  
  .checkbox-label {
    display: flex;
    align-items: center;
    cursor: pointer;
    font-weight: 500;
    color: #374151;
  }
  
  .checkbox-icon {
    width: 16px;
    height: 16px;
    margin-right: 8px;
    color: #f59e0b;
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
    background: linear-gradient(135deg, #3b82f6, #1d4ed8);
    color: white;
  }
  
  .dialog-btn.save:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
  }
  
  .dialog-btn.save:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
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
  
  /* Upload Dialog */
  .upload-area {
    margin-bottom: 24px;
  }
  
  .upload-zone {
    border: 2px dashed #d1d5db;
    border-radius: 12px;
    padding: 40px 20px;
    text-align: center;
    transition: all 0.3s ease;
    cursor: pointer;
  }
  
  .upload-zone.drag-over {
    border-color: #3b82f6;
    background: #f0f9ff;
  }
  
  .upload-icon {
    width: 48px;
    height: 48px;
    margin: 0 auto 16px auto;
    color: #9ca3af;
  }
  
  .upload-zone h4 {
    font-size: 1.2rem;
    font-weight: 600;
    color: #374151;
    margin: 0 0 8px 0;
  }
  
  .upload-zone p {
    color: #6b7280;
    margin: 0 0 16px 0;
  }
  
  .file-input {
    display: none;
  }
  
  .upload-btn {
    padding: 10px 20px;
    background: #3b82f6;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.2s ease;
  }
  
  .upload-btn:hover {
    background: #2563eb;
  }
  
  .upload-queue {
    border-top: 1px solid #e5e7eb;
    padding-top: 24px;
  }
  
  .upload-queue h4 {
    font-size: 1.1rem;
    font-weight: 600;
    color: #374151;
    margin: 0 0 16px 0;
  }
  
  .queue-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 20px;
    max-height: 300px;
    overflow-y: auto;
  }
  
  .queue-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px;
    background: #f8fafc;
    border-radius: 8px;
    border: 1px solid #e5e7eb;
  }
  
  .queue-file-info {
    display: flex;
    align-items: center;
    gap: 12px;
    flex: 1;
  }
  
  .queue-file-icon {
    width: 24px;
    height: 24px;
    color: #6b7280;
  }
  
  .queue-file-details strong {
    display: block;
    font-size: 0.9rem;
    color: #1f2937;
    margin-bottom: 2px;
  }
  
  .queue-file-details small {
    color: #6b7280;
    font-size: 0.8rem;
  }
  
  .queue-file-options {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  
  .protection-option {
    display: flex;
    align-items: center;
    gap: 6px;
  }
  
  .protection-label {
    display: flex;
    align-items: center;
    font-size: 0.8rem;
    color: #6b7280;
    cursor: pointer;
  }
  
  .protection-icon {
    width: 12px;
    height: 12px;
    margin-right: 4px;
  }
  
  .remove-btn {
    padding: 4px;
    border: none;
    background: #fee2e2;
    color: #dc2626;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  
  .remove-btn:hover {
    background: #fecaca;
  }
  
  .remove-icon {
    width: 14px;
    height: 14px;
  }
  
  .upload-options {
    margin-bottom: 20px;
  }
  
  /* Access Code Dialog */
  .access-info {
    text-align: center;
    padding: 20px;
    background: #fef3c7;
    border-radius: 12px;
    margin-bottom: 20px;
  }
  
  .access-icon {
    width: 48px;
    height: 48px;
    margin: 0 auto 16px auto;
    color: #d97706;
  }
  
  .access-info p {
    color: #92400e;
    margin: 0 0 8px 0;
    line-height: 1.5;
  }
  
  .access-info strong {
    color: #78350f;
    font-size: 1.1rem;
  }
  
  .access-code-input {
    text-align: center;
    font-size: 1.2rem;
    letter-spacing: 2px;
  }
  
  .error-message {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px;
    background: #fee2e2;
    border-radius: 8px;
    color: #dc2626;
    font-size: 0.9rem;
    margin-top: 12px;
  }
  
  .error-icon {
    width: 16px;
    height: 16px;
  }
  
  /* File Viewer */
  .file-viewer {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 400px;
  }
  
  .image-viewer {
    width: 100%;
    text-align: center;
  }
  
  .preview-image {
    max-width: 100%;
    max-height: 70vh;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
  
  .video-viewer {
    width: 100%;
    text-align: center;
  }
  
  .preview-video {
    max-width: 100%;
    max-height: 70vh;
    border-radius: 8px;
  }
  
  .document-viewer,
  .default-viewer {
    text-align: center;
    padding: 40px;
  }
  
  .document-info {
    display: flex;
    align-items: center;
    gap: 20px;
    margin-bottom: 24px;
    padding: 20px;
    background: #f8fafc;
    border-radius: 12px;
  }
  
  .doc-icon {
    width: 64px;
    height: 64px;
    color: #6b7280;
  }
  
  .doc-details {
    text-align: left;
    flex: 1;
  }
  
  .doc-details h4 {
    font-size: 1.3rem;
    font-weight: 600;
    color: #1f2937;
    margin: 0 0 8px 0;
  }
  
  .doc-details p {
    color: #6b7280;
    margin: 0 0 4px 0;
  }
  
  .doc-description {
    color: #374151 !important;
    font-style: italic;
  }
  
  .file-icon-large {
    width: 80px;
    height: 80px;
    color: #6b7280;
    margin-bottom: 20px;
  }
  
  .default-viewer h4 {
    font-size: 1.5rem;
    font-weight: 600;
    color: #1f2937;
    margin: 0 0 12px 0;
  }
  
  .default-viewer p {
    color: #6b7280;
    margin: 0 0 8px 0;
  }
  
  .file-description {
    color: #374151 !important;
    font-style: italic;
    margin-bottom: 24px !important;
  }
  
  /* Context Menu */
  .context-menu {
    position: fixed;
    background: white;
    border-radius: 8px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
    border: 1px solid #e5e7eb;
    padding: 8px 0;
    min-width: 180px;
    z-index: 1001;
  }
  
  .context-menu-item {
    display: flex;
    align-items: center;
    width: 100%;
    padding: 10px 16px;
    border: none;
    background: none;
    cursor: pointer;
    font-size: 0.9rem;
    color: #374151;
    transition: all 0.2s ease;
    text-align: left;
  }
  
  .context-menu-item:hover {
    background: #f3f4f6;
  }
  
  .context-menu-item.danger {
    color: #dc2626;
  }
  
  .context-menu-item.danger:hover {
    background: #fee2e2;
  }
  
  .context-icon {
    width: 16px;
    height: 16px;
    margin-right: 12px;
  }
  
  .context-menu-separator {
    height: 1px;
    background: #e5e7eb;
    margin: 8px 0;
  }
  
  /* Responsive */
  @media (max-width: 768px) {
    .cloud-container {
      padding: 20px;
    }
    
    .title-section h1 {
      font-size: 2rem;
    }
    
    .header-content {
      flex-direction: column;
      align-items: stretch;
    }
    
    .header-actions {
      flex-wrap: wrap;
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
    
    .breadcrumb {
      flex-wrap: wrap;
    }
    
    .files-grid {
      grid-template-columns: 1fr;
    }
    
    .dialog-overlay {
      padding: 10px;
    }
    
    .dialog-box {
      max-width: none;
      margin: 0;
    }
    
    .files-table {
      font-size: 0.85rem;
    }
    
    .files-table th,
    .files-table td {
      padding: 12px 8px;
    }
    
    .file-cell {
      flex-direction: column;
      align-items: flex-start;
      gap: 8px;
    }
    
    .action-buttons {
      flex-wrap: wrap;
    }
    
    .quick-actions {
      flex-direction: column;
    }
    
    .queue-item {
      flex-direction: column;
      align-items: flex-start;
      gap: 12px;
    }
    
    .queue-file-options {
      width: 100%;
      justify-content: space-between;
    }
    
    .document-info {
      flex-direction: column;
      text-align: center;
    }
    
    .doc-details {
      text-align: center;
    }
  }
  
  @media (max-width: 480px) {
    .cloud-container {
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
    
    .list-view {
      overflow-x: scroll;
    }
    
    .files-table {
      min-width: 600px;
    }
    
    .dialog-actions {
      flex-direction: column;
    }
    
    .dialog-btn {
      justify-content: center;
    }
    
    .file-card {
      margin-bottom: 16px;
    }
    
    .breadcrumb-item {
      font-size: 0.8rem;
      padding: 6px 10px;
    }
    
    .upload-zone {
      padding: 30px 15px;
    }
    
    .context-menu {
      min-width: 160px;
    }
  }
  </style>
  