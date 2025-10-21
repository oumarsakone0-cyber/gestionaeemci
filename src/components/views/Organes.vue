<template>
    <div class="app">
  
      <!-- Bannière élégante avec motif islamique -->
      <section class="page-banner">
        <div class="banner-pattern"></div>
        <div class="container">
          <div class="page-title">
            <h1>Organes <span class="highlight">Centraux</span></h1>
            <p class="subtitle">La structure organisationnelle de l'AEEMCI</p>
            <div class="breadcrumbs">
              <a href="#">Accueil</a> <span class="separator">/</span> <a href="#">AEEMCI</a> <span class="separator">/</span> <span class="current">Organes Centraux</span>
            </div>
          </div>
        </div>
      </section>
  
      <!-- Contenu principal -->
      <main class="main-content">
        <div class="container">
          <!-- Introduction -->
          <section class="intro-section">
            <div class="quote-box">
              <div class="quote-mark">"</div>
              <blockquote>
                La force de l'AEEMCI réside dans sa structure organisationnelle bien définie, permettant une gouvernance efficace et une représentation à tous les niveaux.
              </blockquote>
              <div class="quote-author">— Statuts de l'AEEMCI</div>
            </div>
            
            <div class="intro-text">
              <p>Les Organes Centraux de l'Association des Élèves et Étudiants Musulmans de Côte d'Ivoire (AEEMCI) constituent l'ossature administrative et décisionnelle de l'organisation. Ils assurent la gouvernance, la coordination et le bon fonctionnement de l'association à tous les niveaux.</p>
              <p>Cette structure hiérarchique permet une répartition claire des responsabilités et garantit une représentation démocratique des membres, depuis le niveau national jusqu'aux sections locales.</p>
            </div>
          </section>
          
          <!-- Organigramme interactif -->
          <section class="organigramme-section">
            <h2 class="section-title"><span class="highlight">O</span>rganigramme</h2>
            
            <div class="organigramme-container">
              <div class="organigramme">
                <!-- Congrès -->
                <div class="org-level">
                  <div 
                    class="org-box congres" 
                    :class="{ active: activeOrgan === 'congres' }"
                    @click="setActiveOrgan('congres')"
                  >
                    <div class="org-title">Congrès</div>
                  </div>
                </div>
                
                <!-- Flèche -->
                <div class="org-arrow">
                  <div class="arrow-line"></div>
                  <div class="arrow-head"></div>
                </div>
                
                <!-- AGO -->
                <div class="org-level">
                  <div 
                    class="org-box ago" 
                    :class="{ active: activeOrgan === 'ago' }"
                    @click="setActiveOrgan('ago')"
                  >
                    <div class="org-title">AGO</div>
                  </div>
                </div>
                
                <!-- Flèche -->
                <div class="org-arrow">
                  <div class="arrow-line"></div>
                  <div class="arrow-head"></div>
                </div>
                
                <!-- Conseil Administratif -->
                <div class="org-level">
                  <div 
                    class="org-box ca" 
                    :class="{ active: activeOrgan === 'ca' }"
                    @click="setActiveOrgan('ca')"
                  >
                    <div class="org-title">Conseil Administratif (CA)</div>
                  </div>
                </div>
                
                <!-- Flèches divergentes -->
                <div class="org-arrows-split">
                  <div class="arrow-split left">
                    <div class="arrow-line"></div>
                    <div class="arrow-head"></div>
                  </div>
                  <div class="arrow-split right">
                    <div class="arrow-line"></div>
                    <div class="arrow-head"></div>
                  </div>
                </div>
                
                <!-- Comité Exécutif et Commissaire -->
                <div class="org-level split">
                  <div 
                    class="org-box comite" 
                    :class="{ active: activeOrgan === 'comite' }"
                    @click="setActiveOrgan('comite')"
                  >
                    <div class="org-title">Comité Exécutif</div>
                  </div>
                  
                  <div 
                    class="org-box commissaire" 
                    :class="{ active: activeOrgan === 'commissaire' }"
                    @click="setActiveOrgan('commissaire')"
                  >
                    <div class="org-title">Commissaire Central aux comptes</div>
                  </div>
                </div>
                
                <!-- Flèche sous Comité Exécutif -->
                <div class="org-arrow-left">
                  <div class="arrow-line"></div>
                  <div class="arrow-head"></div>
                </div>
                
                <!-- Conseil Régional -->
                <div class="org-level left">
                  <div 
                    class="org-box conseil-regional" 
                    :class="{ active: activeOrgan === 'conseil-regional' }"
                    @click="setActiveOrgan('conseil-regional')"
                  >
                    <div class="org-title">Conseil Régional</div>
                  </div>
                </div>
                
                <!-- Flèche -->
                <div class="org-arrow-left">
                  <div class="arrow-line"></div>
                  <div class="arrow-head"></div>
                </div>
                
                <!-- Sous Comité -->
                <div class="org-level left">
                  <div 
                    class="org-box sous-comite" 
                    :class="{ active: activeOrgan === 'sous-comite' }"
                    @click="setActiveOrgan('sous-comite')"
                  >
                    <div class="org-title">Sous Comité</div>
                  </div>
                </div>
                
                <!-- Flèche -->
                <div class="org-arrow-left">
                  <div class="arrow-line"></div>
                  <div class="arrow-head"></div>
                </div>
                
                <!-- Section -->
                <div class="org-level left">
                  <div 
                    class="org-box section" 
                    :class="{ active: activeOrgan === 'section' }"
                    @click="setActiveOrgan('section')"
                  >
                    <div class="org-title">Section</div>
                  </div>
                </div>
              </div>
              
              <!-- Description de l'organe sélectionné -->
              <div class="organ-description">
                <div v-if="activeOrgan === 'congres'" class="description-content">
                  <h3>Congrès</h3>
                  <p>Le Congrès est l'instance suprême de l'AEEMCI. Il se réunit tous les quatre ans et rassemble les délégués de toutes les régions. Ses principales attributions sont :</p>
                  <ul>
                    <li>Définir les orientations stratégiques de l'association</li>
                    <li>Adopter et modifier les statuts et le règlement intérieur</li>
                    <li>Élire les membres du Conseil Administratif</li>
                    <li>Examiner et approuver les rapports d'activités et financiers</li>
                  </ul>
                  <div class="description-meta">
                    <div class="meta-item">
                      <span class="meta-label">Fréquence :</span>
                      <span class="meta-value">Tous les 4 ans</span>
                    </div>
                    <div class="meta-item">
                      <span class="meta-label">Composition :</span>
                      <span class="meta-value">Délégués de toutes les régions</span>
                    </div>
                  </div>
                </div>
                
                <div v-if="activeOrgan === 'ago'" class="description-content">
                  <h3>Assemblée Générale Ordinaire (AGO)</h3>
                  <p>L'Assemblée Générale Ordinaire est l'instance qui se réunit annuellement pour faire le bilan des activités de l'association. Ses principales attributions sont :</p>
                  <ul>
                    <li>Examiner et approuver les rapports d'activités annuels</li>
                    <li>Approuver les comptes de l'exercice clos</li>
                    <li>Voter le budget de l'exercice suivant</li>
                    <li>Délibérer sur les questions inscrites à l'ordre du jour</li>
                  </ul>
                  <div class="description-meta">
                    <div class="meta-item">
                      <span class="meta-label">Fréquence :</span>
                      <span class="meta-value">Annuelle</span>
                    </div>
                    <div class="meta-item">
                      <span class="meta-label">Composition :</span>
                      <span class="meta-value">Membres du CA, représentants régionaux</span>
                    </div>
                  </div>
                </div>
                
                <div v-if="activeOrgan === 'ca'" class="description-content">
                  <h3>Conseil Administratif (CA)</h3>
                  <p>Le Conseil Administratif est l'organe de contrôle et d'orientation de l'AEEMCI entre deux Congrès. Ses principales attributions sont :</p>
                  <ul>
                    <li>Veiller à l'application des résolutions du Congrès</li>
                    <li>Contrôler la gestion du Comité Exécutif</li>
                    <li>Approuver les programmes d'activités</li>
                    <li>Élire les membres du Comité Exécutif</li>
                  </ul>
                  <div class="description-meta">
                    <div class="meta-item">
                      <span class="meta-label">Mandat :</span>
                      <span class="meta-value">4 ans</span>
                    </div>
                    <div class="meta-item">
                      <span class="meta-label">Composition :</span>
                      <span class="meta-value">15 membres élus par le Congrès</span>
                    </div>
                    <div class="meta-item">
                      <span class="meta-label">Réunions :</span>
                      <span class="meta-value">Trimestrielles</span>
                    </div>
                  </div>
                </div>
                
                <div v-if="activeOrgan === 'comite'" class="description-content">
                  <h3>Comité Exécutif</h3>
                  <p>Le Comité Exécutif est l'organe d'exécution et de gestion quotidienne de l'AEEMCI. Il est dirigé par le Président National et comprend plusieurs départements. Ses principales attributions sont :</p>
                  <ul>
                    <li>Exécuter les décisions du CA et du Congrès</li>
                    <li>Gérer les affaires courantes de l'association</li>
                    <li>Élaborer et mettre en œuvre les programmes d'activités</li>
                    <li>Représenter l'association auprès des tiers</li>
                  </ul>
                  <div class="description-meta">
                    <div class="meta-item">
                      <span class="meta-label">Mandat :</span>
                      <span class="meta-value">2 ans, renouvelable une fois</span>
                    </div>
                    <div class="meta-item">
                      <span class="meta-label">Composition :</span>
                      <span class="meta-value">Président, Vice-présidents, Secrétaire Général, Trésorier, Directeurs de départements</span>
                    </div>
                    <div class="meta-item">
                      <span class="meta-label">Réunions :</span>
                      <span class="meta-value">Bimensuelles</span>
                    </div>
                  </div>
                </div>
                
                <div v-if="activeOrgan === 'commissaire'" class="description-content">
                  <h3>Commissaire Central aux comptes</h3>
                  <p>Le Commissaire Central aux comptes est l'organe de contrôle financier de l'AEEMCI. Ses principales attributions sont :</p>
                  <ul>
                    <li>Vérifier la régularité des comptes de l'association</li>
                    <li>Contrôler la gestion financière du Comité Exécutif</li>
                    <li>Présenter des rapports financiers au CA et à l'AGO</li>
                    <li>Formuler des recommandations pour améliorer la gestion financière</li>
                  </ul>
                  <div class="description-meta">
                    <div class="meta-item">
                      <span class="meta-label">Mandat :</span>
                      <span class="meta-value">2 ans</span>
                    </div>
                    <div class="meta-item">
                      <span class="meta-label">Composition :</span>
                      <span class="meta-value">Un commissaire principal et deux adjoints</span>
                    </div>
                    <div class="meta-item">
                      <span class="meta-label">Indépendance :</span>
                      <span class="meta-value">Autonome vis-à-vis du Comité Exécutif</span>
                    </div>
                  </div>
                </div>
                
                <div v-if="activeOrgan === 'conseil-regional'" class="description-content">
                  <h3>Conseil Régional</h3>
                  <p>Le Conseil Régional est l'organe de coordination des activités de l'AEEMCI au niveau régional. Ses principales attributions sont :</p>
                  <ul>
                    <li>Coordonner les activités des Sous-Comités de la région</li>
                    <li>Mettre en œuvre les programmes nationaux au niveau régional</li>
                    <li>Représenter la région auprès des instances nationales</li>
                    <li>Organiser des activités régionales</li>
                  </ul>
                  <div class="description-meta">
                    <div class="meta-item">
                      <span class="meta-label">Mandat :</span>
                      <span class="meta-value">2 ans</span>
                    </div>
                    <div class="meta-item">
                      <span class="meta-label">Composition :</span>
                      <span class="meta-value">Secrétaire Régional et son bureau</span>
                    </div>
                    <div class="meta-item">
                      <span class="meta-label">Nombre :</span>
                      <span class="meta-value">31 Conseils Régionaux</span>
                    </div>
                  </div>
                </div>
                
                <div v-if="activeOrgan === 'sous-comite'" class="description-content">
                  <h3>Sous Comité</h3>
                  <p>Le Sous Comité est l'organe de coordination des activités de l'AEEMCI au niveau départemental ou communal. Ses principales attributions sont :</p>
                  <ul>
                    <li>Coordonner les activités des Sections de sa zone</li>
                    <li>Mettre en œuvre les programmes régionaux au niveau local</li>
                    <li>Organiser des activités locales</li>
                    <li>Représenter les Sections auprès du Conseil Régional</li>
                  </ul>
                  <div class="description-meta">
                    <div class="meta-item">
                      <span class="meta-label">Mandat :</span>
                      <span class="meta-value">1 an, renouvelable</span>
                    </div>
                    <div class="meta-item">
                      <span class="meta-label">Composition :</span>
                      <span class="meta-value">Président du Sous Comité et son bureau</span>
                    </div>
                    <div class="meta-item">
                      <span class="meta-label">Nombre :</span>
                      <span class="meta-value">236 Sous Comités</span>
                    </div>
                  </div>
                </div>
                
                <div v-if="activeOrgan === 'section'" class="description-content">
                  <h3>Section</h3>
                  <p>La Section est l'unité de base de l'AEEMCI. Elle est généralement établie dans un établissement scolaire ou universitaire. Ses principales attributions sont :</p>
                  <ul>
                    <li>Organiser des activités islamiques et éducatives pour ses membres</li>
                    <li>Représenter l'AEEMCI dans l'établissement</li>
                    <li>Recruter de nouveaux membres</li>
                    <li>Participer aux activités du Sous Comité</li>
                  </ul>
                  <div class="description-meta">
                    <div class="meta-item">
                      <span class="meta-label">Mandat :</span>
                      <span class="meta-value">1 an</span>
                    </div>
                    <div class="meta-item">
                      <span class="meta-label">Composition :</span>
                      <span class="meta-value">Président de Section et son bureau</span>
                    </div>
                    <div class="meta-item">
                      <span class="meta-label">Nombre :</span>
                      <span class="meta-value">Plus de 1000 Sections</span>
                    </div>
                  </div>
                </div>
                
                <div v-if="!activeOrgan" class="description-placeholder">
                  <div class="placeholder-icon">
                    <span>🔍</span>
                  </div>
                  <p>Cliquez sur un organe dans l'organigramme pour afficher sa description détaillée.</p>
                </div>
              </div>
            </div>
          </section>
          
          <!-- Fonctionnement des organes -->
          <section class="fonctionnement-section">
            <h2 class="section-title"><span class="highlight">F</span>onctionnement</h2>
            
            <div class="fonctionnement-tabs">
              <div class="tabs-header">
                <button 
                  v-for="(tab, index) in fonctionnementTabs" 
                  :key="index"
                  :class="['tab-btn', { active: activeTab === index }]"
                  @click="setActiveTab(index)"
                >
                  {{ tab.title }}
                </button>
              </div>
              
              <div class="tabs-content">
                <div v-if="activeTab === 0" class="tab-content">
                  <h3>Processus Décisionnel</h3>
                  <p>Le processus décisionnel au sein de l'AEEMCI suit une approche à la fois descendante et ascendante :</p>
                  
                  <div class="process-flow">
                    <div class="process-step">
                      <div class="step-number">1</div>
                      <div class="step-content">
                        <h4>Élaboration des politiques</h4>
                        <p>Le Congrès définit les orientations stratégiques et les politiques générales de l'association pour une période de quatre ans.</p>
                      </div>
                    </div>
                    
                    <div class="process-step">
                      <div class="step-number">2</div>
                      <div class="step-content">
                        <h4>Planification</h4>
                        <p>Le Conseil Administratif traduit ces orientations en plans d'action et objectifs spécifiques.</p>
                      </div>
                    </div>
                    
                    <div class="process-step">
                      <div class="step-number">3</div>
                      <div class="step-content">
                        <h4>Mise en œuvre</h4>
                        <p>Le Comité Exécutif élabore des programmes détaillés et les met en œuvre à travers les structures régionales et locales.</p>
                      </div>
                    </div>
                    
                    <div class="process-step">
                      <div class="step-number">4</div>
                      <div class="step-content">
                        <h4>Remontée d'information</h4>
                        <p>Les Sections et Sous Comités font remonter les informations, besoins et suggestions du terrain vers les instances supérieures.</p>
                      </div>
                    </div>
                    
                    <div class="process-step">
                      <div class="step-number">5</div>
                      <div class="step-content">
                        <h4>Évaluation et ajustement</h4>
                        <p>L'AGO et le CA évaluent régulièrement les résultats et ajustent les stratégies si nécessaire.</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div v-if="activeTab === 1" class="tab-content">
                  <h3>Élections et Mandats</h3>
                  
                  <div class="elections-grid">
                    <div class="election-card">
                      <div class="election-header">
                        <h4>Conseil Administratif</h4>
                      </div>
                      <div class="election-content">
                        <div class="election-item">
                          <span class="item-label">Élection :</span>
                          <span class="item-value">Par le Congrès</span>
                        </div>
                        <div class="election-item">
                          <span class="item-label">Mandat :</span>
                          <span class="item-value">4 ans</span>
                        </div>
                        <div class="election-item">
                          <span class="item-label">Renouvellement :</span>
                          <span class="item-value">Intégral</span>
                        </div>
                        <div class="election-item">
                          <span class="item-label">Conditions d'éligibilité :</span>
                          <span class="item-value">Membre actif depuis au moins 5 ans, avoir occupé un poste de responsabilité</span>
                        </div>
                      </div>
                    </div>
                    
                    <div class="election-card">
                      <div class="election-header">
                        <h4>Comité Exécutif</h4>
                      </div>
                      <div class="election-content">
                        <div class="election-item">
                          <span class="item-label">Élection :</span>
                          <span class="item-value">Par le Conseil Administratif</span>
                        </div>
                        <div class="election-item">
                          <span class="item-label">Mandat :</span>
                          <span class="item-value">2 ans, renouvelable une fois</span>
                        </div>
                        <div class="election-item">
                          <span class="item-label">Mode d'élection :</span>
                          <span class="item-value">Scrutin de liste</span>
                        </div>
                        <div class="election-item">
                          <span class="item-label">Conditions d'éligibilité :</span>
                          <span class="item-value">Membre actif depuis au moins 3 ans, compétences spécifiques selon le poste</span>
                        </div>
                      </div>
                    </div>
                    
                    <div class="election-card">
                      <div class="election-header">
                        <h4>Conseil Régional</h4>
                      </div>
                      <div class="election-content">
                        <div class="election-item">
                          <span class="item-label">Élection :</span>
                          <span class="item-value">Par les représentants des Sous Comités</span>
                        </div>
                        <div class="election-item">
                          <span class="item-label">Mandat :</span>
                          <span class="item-value">2 ans</span>
                        </div>
                        <div class="election-item">
                          <span class="item-label">Validation :</span>
                          <span class="item-value">Par le Comité Exécutif</span>
                        </div>
                        <div class="election-item">
                          <span class="item-label">Conditions d'éligibilité :</span>
                          <span class="item-value">Membre actif depuis au moins 2 ans, résider dans la région</span>
                        </div>
                      </div>
                    </div>
                    
                    <div class="election-card">
                      <div class="election-header">
                        <h4>Sous Comité et Section</h4>
                      </div>
                      <div class="election-content">
                        <div class="election-item">
                          <span class="item-label">Élection :</span>
                          <span class="item-value">Par les membres de la structure</span>
                        </div>
                        <div class="election-item">
                          <span class="item-label">Mandat :</span>
                          <span class="item-value">1 an, renouvelable</span>
                        </div>
                        <div class="election-item">
                          <span class="item-label">Validation :</span>
                          <span class="item-value">Par le niveau hiérarchique supérieur</span>
                        </div>
                        <div class="election-item">
                          <span class="item-label">Conditions d'éligibilité :</span>
                          <span class="item-value">Être membre actif, avoir une bonne moralité</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div v-if="activeTab === 2" class="tab-content">
                  <h3>Réunions et Rapports</h3>
                  
                  <div class="meetings-table">
                    <div class="table-header">
                      <div class="header-cell">Organe</div>
                      <div class="header-cell">Fréquence des réunions</div>
                      <div class="header-cell">Rapports produits</div>
                      <div class="header-cell">Destinataires</div>
                    </div>
                    
                    <div class="table-row">
                      <div class="row-cell">Congrès</div>
                      <div class="row-cell">Tous les 4 ans</div>
                      <div class="row-cell">Résolutions, Motions, Recommandations</div>
                      <div class="row-cell">Tous les organes, Membres</div>
                    </div>
                    
                    <div class="table-row">
                      <div class="row-cell">AGO</div>
                      <div class="row-cell">Annuelle</div>
                      <div class="row-cell">Procès-verbal, Résolutions</div>
                      <div class="row-cell">CA, Comité Exécutif</div>
                    </div>
                    
                    <div class="table-row">
                      <div class="row-cell">Conseil Administratif</div>
                      <div class="row-cell">Trimestrielle</div>
                      <div class="row-cell">Procès-verbal, Directives</div>
                      <div class="row-cell">Comité Exécutif</div>
                    </div>
                    
                    <div class="table-row">
                      <div class="row-cell">Comité Exécutif</div>
                      <div class="row-cell">Bimensuelle</div>
                      <div class="row-cell">Rapports d'activités, Rapports financiers</div>
                      <div class="row-cell">CA, Conseils Régionaux</div>
                    </div>
                    
                    <div class="table-row">
                      <div class="row-cell">Conseil Régional</div>
                      <div class="row-cell">Mensuelle</div>
                      <div class="row-cell">Rapports régionaux</div>
                      <div class="row-cell">Comité Exécutif, Sous Comités</div>
                    </div>
                    
                    <div class="table-row">
                      <div class="row-cell">Sous Comité</div>
                      <div class="row-cell">Bimensuelle</div>
                      <div class="row-cell">Rapports d'activités locales</div>
                      <div class="row-cell">Conseil Régional, Sections</div>
                    </div>
                    
                    <div class="table-row">
                      <div class="row-cell">Section</div>
                      <div class="row-cell">Hebdomadaire</div>
                      <div class="row-cell">Comptes rendus d'activités</div>
                      <div class="row-cell">Sous Comité</div>
                    </div>
                  </div>
                  
                  <div class="reporting-cycle">
                    <h4>Cycle de reporting</h4>
                    <p>L'AEEMCI a mis en place un système de reporting régulier qui permet de suivre les activités à tous les niveaux :</p>
                    <ul>
                      <li>Les Sections soumettent des rapports mensuels aux Sous Comités</li>
                      <li>Les Sous Comités compilent ces rapports et les transmettent trimestriellement aux Conseils Régionaux</li>
                      <li>Les Conseils Régionaux préparent des rapports semestriels pour le Comité Exécutif</li>
                      <li>Le Comité Exécutif présente un rapport annuel au CA et à l'AGO</li>
                      <li>Le CA présente un rapport quadriennal au Congrès</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>
          
          <!-- FAQ -->
          <section class="faq-section">
            <h2 class="section-title"><span class="highlight">Q</span>uestions Fréquentes</h2>
            
            <div class="faq-container">
              <div 
                v-for="(faq, index) in faqs" 
                :key="index" 
                class="faq-item"
                :class="{ 'active': activeFaq === index }"
              >
                <div class="faq-question" @click="toggleFaq(index)">
                  <h3>{{ faq.question }}</h3>
                  <span class="faq-icon">{{ activeFaq === index ? '−' : '+' }}</span>
                </div>
                <div class="faq-answer" v-show="activeFaq === index">
                  <p>{{ faq.answer }}</p>
                </div>
              </div>
            </div>
          </section>
          
          <!-- Contact -->
          <section class="contact-section">
            <h2 class="section-title"><span class="highlight">C</span>ontacter les Organes Centraux</h2>
            
            <div class="contact-cards">
              <div class="contact-card">
                <div class="contact-icon">
                  <span>📞</span>
                </div>
                <h3>Téléphone</h3>
                <p>+225 27 22 43 47 58</p>
                <p>+225 07 07 07 07 07</p>
              </div>
              
              <div class="contact-card">
                <div class="contact-icon">
                  <span>✉️</span>
                </div>
                <h3>Email</h3>
                <p>organes.centraux@aeemci.org</p>
                <p>secretariat@aeemci.org</p>
              </div>
              
              <div class="contact-card">
                <div class="contact-icon">
                  <span>📍</span>
                </div>
                <h3>Adresse</h3>
                <p>Siège de l'AEEMCI</p>
                <p>Mosquée An Nour de l'AEEMCI</p>
                <p>Cocody Riviera 2, Abidjan</p>
              </div>
            </div>
          </section>
        </div>
      </main>
  
      <!-- Footer -->

    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  
  // État pour les dropdowns
  const dropdowns = ref({
    aeemci: true, // Ouvert par défaut car nous sommes sur la page Organes Centraux
    activites: false,
    mediatheque: false
  });
  
  // État pour l'organe actif dans l'organigramme
  const activeOrgan = ref(null);
  
  const setActiveOrgan = (organ) => {
    if (activeOrgan.value === organ) {
      activeOrgan.value = null;
    } else {
      activeOrgan.value = organ;
    }
  };
  
  // Onglets de fonctionnement
  const fonctionnementTabs = [
    { title: 'Processus Décisionnel' },
    { title: 'Élections et Mandats' },
    { title: 'Réunions et Rapports' }
  ];
  
  const activeTab = ref(0);
  
  const setActiveTab = (index) => {
    activeTab.value = index;
  };
  
  // FAQ
  const faqs = [
    {
      question: "Quelle est la différence entre le Comité Exécutif et le Conseil Administratif ?",
      answer: "Le Conseil Administratif (CA) est l'organe de contrôle et d'orientation stratégique, élu pour 4 ans par le Congrès. Le Comité Exécutif est l'organe d'exécution, élu par le CA pour 2 ans, chargé de la gestion quotidienne de l'association."
    },
    {
      question: "Comment devient-on membre d'un organe central de l'AEEMCI ?",
      answer: "Pour devenir membre d'un organe central, il faut d'abord être membre actif de l'association, puis se présenter aux élections selon le niveau souhaité. Chaque organe a ses propres conditions d'éligibilité, généralement liées à l'ancienneté, l'expérience et les compétences."
    },
    {
      question: "Quelle est la fréquence des réunions du Congrès ?",
      answer: "Le Congrès se réunit tous les quatre ans en session ordinaire. Cependant, des sessions extraordinaires peuvent être convoquées en cas de besoin, sur demande du Conseil Administratif ou des deux tiers des Conseils Régionaux."
    },
    {
      question: "Comment les décisions sont-elles prises au sein des organes centraux ?",
      answer: "Les décisions sont généralement prises par consensus. En cas de désaccord, un vote est organisé. Pour les questions importantes, une majorité qualifiée (2/3 des voix) est souvent requise, tandis que pour les questions courantes, une majorité simple suffit."
    },
    {
      question: "Quel est le rôle du Commissaire Central aux comptes ?",
      answer: "Le Commissaire Central aux comptes est chargé de vérifier la régularité des comptes de l'association, de contrôler la gestion financière du Comité Exécutif et de présenter des rapports financiers au CA et à l'AGO. Il agit en toute indépendance vis-à-vis du Comité Exécutif."
    },
    {
      question: "Comment sont financés les organes centraux de l'AEEMCI ?",
      answer: "Les organes centraux sont financés par les cotisations des membres, les subventions, les dons et legs, les revenus des activités génératrices de revenus, et les partenariats avec diverses institutions nationales et internationales."
    }
  ];

  const animateCounters = () => {
    const counters = document.querySelectorAll('.animate-count .stat-number');
    
    counters.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-count'));
      const duration = 2000; // ms
      const step = target / (duration / 16); // 60fps
      let current = 0;
      
      const updateCounter = () => {
        current += step;
        if (current < target) {
          counter.textContent = Math.ceil(current);
          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent = target;
          if (target >= 1000) {
            counter.textContent = target.toLocaleString('fr-FR');
          } else {
            counter.textContent = target;
          }
        }
      };
      
      updateCounter();
    });
  };

  const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-visible');
          
          // Si c'est la section des statistiques, démarrer l'animation des compteurs
          if (entry.target.classList.contains('stats-grid')) {
            animateCounters();
          }
        }
      });
    }, { threshold: 0.1 });
  
  const activeFaq = ref(null);
  
  const toggleFaq = (index) => {
    if (activeFaq.value === index) {
      activeFaq.value = null;
    } else {
      activeFaq.value = index;
    }
  };
  
  // Initialisation
  onMounted(() => {

    document.querySelectorAll('.period-card, .intro-section, .testimonials-section, .gallery-section, .stats-grid').forEach(el => {
      observer.observe(el);
    });
    // Fermer les dropdowns quand on clique en dehors
    document.addEventListener('click', (event) => {
      const isDropdownButton = event.target.closest('.dropdown');
      if (!isDropdownButton) {
        Object.keys(dropdowns.value).forEach(key => {
          dropdowns.value[key] = false;
        });
      }
    });
  });
  </script>
  <script>
  // Pour respecter la règle multi-word
  export default {
    name: 'OrGanes'
  }
  </script>
  
  <style>
  :root {
    --primary: #006400;
    --primary-dark: #004d00;
    --primary-light: #008000;
    --primary-lighter: #e6f0e6;
    --secondary: #f8b400;
    --secondary-dark: #d99b00;
    --secondary-light: #ffc933;
    --accent: #ff6600;
    --accent-dark: #e65c00;
    --accent-light: #ff8533;
    --text-primary: #333333;
    --text-secondary: #666666;
    --text-light: #999999;
    --background: #ffffff;
    --background-alt: #f5f5f5;
    --border: #e0e0e0;
    --success: #28a745;
    --danger: #dc3545;
    --warning: #ffc107;
    --info: #17a2b8;
  }
  
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    color: var(--text-primary);
    line-height: 1.6;
    background-color: var(--background);
    font-size: 14px;
  }
  
  .container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
  }
  
  a {
    color: var(--primary);
    text-decoration: none;
    transition: all 0.3s ease;
  }
  
  a:hover {
    color: var(--primary-dark);
  }
  
  img {
    max-width: 100%;
    height: auto;
  }
  
  ul {
    list-style-position: inside;
    margin-bottom: 1rem;
  }
  
  /* Header Styles */
  .header {
    background-color: white;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
    position: sticky;
    top: 0;
    z-index: 1000;
  }
  
  .header-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.8rem 0;
  }
  
  .logo {
    display: flex;
    align-items: center;
  }
  
  .logo-img {
    width: 35px;
    height: 35px;
    object-fit: contain;
    transition: transform 0.3s ease;
  }
  
  .logo-text {
    font-size: 1.2rem;
    font-weight: 700;
    color: var(--primary);
    margin-left: 0.3rem;
  }
  
  .main-nav {
    flex-grow: 1;
    display: flex;
    justify-content: flex-end;
  }
  
  .nav-list {
    display: flex;
    list-style: none;
    margin: 0;
    padding: 0;
    align-items: center;
  }
  
  .nav-item {
    position: relative;
    margin-left: 1.2rem;
  }
  
  .nav-link {
    color: var(--text-primary);
    font-weight: 500;
    padding: 0.4rem 0;
    display: flex;
    align-items: center;
    font-size: 0.85rem;
    transition: all 0.2s ease;
  }
  
  .nav-link.active {
    color: var(--primary);
    font-weight: 600;
  }
  
  .nav-link:hover {
    color: var(--primary);
  }
  
  .dropdown-arrow {
    font-size: 0.5rem;
    margin-left: 0.2rem;
    opacity: 0.7;
  }
  
  .dropdown-menu {
    position: absolute;
    top: 100%;
    left: 0;
    background-color: white;
    min-width: 160px;
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.08);
    border-radius: 3px;
    padding: 0.4rem 0;
    z-index: 100;
    list-style: none;
    transform-origin: top center;
    animation: dropdown-anim 0.2s ease;
    border: 1px solid var(--border);
  }
  
  .dropdown-menu a.active {
    background-color: var(--background-alt);
    color: var(--primary);
    font-weight: 600;
  }
  
  @keyframes dropdown-anim {
    from {
      opacity: 0;
      transform: translateY(-6px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .dropdown-menu a {
    display: block;
    padding: 0.4rem 0.8rem;
    color: var(--text-primary);
    font-size: 0.8rem;
    transition: all 0.2s ease;
  }
  
  .dropdown-menu a:hover {
    background-color: var(--background-alt);
    color: var(--primary);
    padding-left: 1rem;
  }
  
  .nav-buttons {
    display: flex;
    align-items: center;
    gap: 0.6rem;
  }
  
  .btn-donate, .btn-espace {
    padding: 0.3rem 0.7rem;
    border-radius: 2px;
    font-size: 0.75rem;
    font-weight: 500;
    transition: all 0.3s ease;
  }
  
  .btn-donate {
    background-color: var(--secondary);
    color: var(--text-primary);
  }
  
  .btn-donate:hover {
    background-color: var(--secondary-dark);
    transform: translateY(-2px);
  }
  
  .btn-espace {
    background-color: var(--accent);
    color: white;
  }
  
  .btn-espace:hover {
    background-color: var(--accent-dark);
    transform: translateY(-2px);
  }
  
  .mobile-menu-btn {
    display: none;
    background: none;
    border: none;
    cursor: pointer;
    font-size: 1.1rem;
  }
  
  /* Page Banner */
  .page-banner {
    background: linear-gradient(rgba(0, 100, 0, 0.9), rgba(0, 100, 0, 0.9));
    color: white;
    padding: 4rem 0;
    text-align: center;
    position: relative;
    overflow: hidden;
  }
  
  .banner-pattern {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
    opacity: 0.1;
  }
  
  .page-title {
    position: relative;
    z-index: 1;
  }
  
  .page-title h1 {
    font-size: 3rem;
    margin-bottom: 0.5rem;
    font-weight: 700;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  }
  
  .subtitle {
    font-size: 1.2rem;
    margin-bottom: 1rem;
    opacity: 0.9;
  }
  
  .breadcrumbs {
    font-size: 0.85rem;
    opacity: 0.8;
  }
  
  .breadcrumbs a {
    color: white;
    opacity: 0.8;
    transition: opacity 0.3s ease;
  }
  
  .breadcrumbs a:hover {
    opacity: 1;
  }
  
  .separator {
    margin: 0 0.5rem;
    opacity: 0.6;
  }
  
  .current {
    opacity: 1;
    font-weight: 600;
  }
  
  .highlight {
    color: var(--secondary);
    font-weight: 800;
  }
  
  /* Main Content */
  .main-content {
    padding: 4rem 0;
    background-color: var(--background);
  }
  
  /* Introduction Section */
  .intro-section {
    display: flex;
    gap: 2rem;
    margin-bottom: 4rem;
    align-items: center;
  }
  
  .quote-box {
    flex: 0 0 40%;
    background-color: var(--primary-lighter);
    padding: 2rem;
    border-radius: 8px;
    position: relative;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  }
  
  .quote-mark {
    position: absolute;
    top: 1rem;
    left: 1rem;
    font-size: 4rem;
    color: var(--primary);
    opacity: 0.2;
    line-height: 1;
  }
  
  blockquote {
    font-size: 1.2rem;
    font-style: italic;
    line-height: 1.6;
    margin-bottom: 1rem;
    position: relative;
    z-index: 1;
    color: var(--primary-dark);
  }
  
  .quote-author {
    text-align: right;
    font-weight: 600;
    font-size: 0.9rem;
    color: var(--primary);
  }
  
  .intro-text {
    flex: 1;
  }
  
  .intro-text p {
    margin-bottom: 1rem;
    font-size: 1rem;
    line-height: 1.8;
  }
  
  /* Section Titles */
  .section-title {
    text-align: center;
    font-size: 2rem;
    margin-bottom: 2rem;
    position: relative;
    padding-bottom: 1rem;
  }
  
  .section-title::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 3px;
    background-color: var(--primary);
    border-radius: 3px;
  }
  
  /* Organigramme Section */
  .organigramme-section {
    margin-bottom: 4rem;
  }
  
  .organigramme-container {
    display: flex;
    gap: 2rem;
    align-items: flex-start;
  }
  
  .organigramme {
    flex: 0 0 40%;
    position: relative;
  }
  
  .org-level {
    display: flex;
    justify-content: center;
    margin-bottom: 1rem;
  }
  
  .org-level.split {
    justify-content: space-between;
  }
  
  .org-level.left {
    justify-content: flex-start;
    padding-left: 20%;
  }
  
  .org-box {
    background-color: #f8b400;
    color: white;
    padding: 1rem;
    border-radius: 8px;
    text-align: center;
    min-width: 200px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .org-box:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }
  
  .org-box.active {
    background-color: var(--accent-dark);
    transform: translateY(-5px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }
  
  .org-title {
    font-weight: 700;
    font-size: 1rem;
  }
  
  .org-arrow {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 40px;
    position: relative;
    margin-bottom: 1rem;
  }
  
  .org-arrow-left {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    height: 40px;
    position: relative;
    margin-bottom: 1rem;
    padding-left: 20%;
  }
  
  .arrow-line {
    width: 2px;
    height: 30px;
    background-color: var(--accent);
  }
  
  .arrow-head {
    width: 0;
    height: 0;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-top: 10px solid var(--accent);
  }
  
  .org-arrows-split {
    display: flex;
    justify-content: space-between;
    height: 40px;
    position: relative;
    margin-bottom: 1rem;
  }
  
  .arrow-split {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 50%;
    position: relative;
  }
  
  .arrow-split.left {
    align-items: flex-end;
    padding-right: 25%;
  }
  
  .arrow-split.right {
    align-items: flex-start;
    padding-left: 25%;
  }
  
  .arrow-split .arrow-line {
    width: 2px;
    height: 30px;
    background-color: var(--accent);
  }
  
  .arrow-split .arrow-head {
    width: 0;
    height: 0;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-top: 10px solid var(--accent);
  }
  
  .organ-description {
    flex: 1;
    background-color: var(--background-alt);
    border-radius: 8px;
    padding: 2rem;
    min-height: 400px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  }
  
  .description-content h3 {
    color: var(--accent);
    font-size: 1.5rem;
    margin-bottom: 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid var(--accent-light);
  }
  
  .description-content p {
    margin-bottom: 1rem;
    line-height: 1.8;
  }
  
  .description-content ul {
    margin-bottom: 1.5rem;
    padding-left: 1rem;
  }
  
  .description-content li {
    margin-bottom: 0.5rem;
  }
  
  .description-meta {
    background-color: white;
    border-radius: 8px;
    padding: 1.5rem;
    margin-top: 1.5rem;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  }
  
  .meta-item {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.5rem;
  }
  
  .meta-label {
    font-weight: 600;
    color: var(--text-secondary);
  }
  
  .meta-value {
    color: var(--accent);
  }
  
  .description-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 300px;
    text-align: center;
  }
  
  .placeholder-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
    color: var(--text-light);
  }
  
  .placeholder-icon span {
    display: inline-block;
    animation: pulse 2s infinite;
  }
  
  @keyframes pulse {
    0% {
      transform: scale(1);
      opacity: 0.7;
    }
    50% {
      transform: scale(1.1);
      opacity: 1;
    }
    100% {
      transform: scale(1);
      opacity: 0.7;
    }
  }
  
  /* Fonctionnement Section */
  .fonctionnement-section {
    margin-bottom: 4rem;
  }
  
  .fonctionnement-tabs {
    background-color: white;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  }
  
  .tabs-header {
    display: flex;
    background-color: var(--background-alt);
    border-bottom: 1px solid var(--border);
  }
  
  .tab-btn {
    padding: 1rem 1.5rem;
    background: none;
    border: none;
    cursor: pointer;
    font-size: 1rem;
    font-weight: 600;
    color: var(--text-secondary);
    transition: all 0.3s ease;
    flex: 1;
    text-align: center;
  }
  
  .tab-btn:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
  
  .tab-btn.active {
    color: var(--accent);
    border-bottom: 3px solid var(--accent);
    background-color: white;
  }
  
  .tabs-content {
    padding: 2rem;
  }
  
  .tab-content h3 {
    color: #f8b400;
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
  }
  
  /* Process Flow */
  .process-flow {
    margin-top: 2rem;
  }
  
  .process-step {
    display: flex;
    margin-bottom: 1.5rem;
    position: relative;
  }
  
  .process-step:not(:last-child)::after {
    content: '';
    position: absolute;
    top: 40px;
    left: 20px;
    width: 2px;
    height: calc(100% + 1.5rem);
    background-color: var(--accent-light);
  }
  
  .step-number {
    width: 40px;
    height: 40px;
    background-color: #f8b400;
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    margin-right: 1.5rem;
    position: relative;
    z-index: 1;
  }
  
  .step-content {
    flex: 1;
  }
  
  .step-content h4 {
    font-size: 1.2rem;
    color: #f8b400;
    margin-bottom: 0.5rem;
  }
  
  /* Elections Grid */
  .elections-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
    margin-top: 1.5rem;
  }
  
  .election-card {
    background-color: var(--background-alt);
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  }
  
  .election-header {
    background-color: #f8b400;
    color: white;
    padding: 1rem;
    text-align: center;
  }
  
  .election-header h4 {
    font-size: 1.2rem;
    margin: 0;
  }
  
  .election-content {
    padding: 1.5rem;
  }
  
  .election-item {
    margin-bottom: 0.8rem;
  }
  
  .item-label {
    font-weight: 600;
    color: var(--text-secondary);
    display: block;
    margin-bottom: 0.3rem;
  }
  
  .item-value {
    color: var(--text-primary);
  }
  
  /* Meetings Table */
  .meetings-table {
    margin-top: 1.5rem;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  }
  
  .table-header {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    background-color: #f8b400;
    color: white;
    font-weight: 600;
  }
  
  .header-cell {
    padding: 1rem;
    text-align: center;
    border-right: 1px solid rgba(255, 255, 255, 0.2);
  }
  
  .header-cell:last-child {
    border-right: none;
  }
  
  .table-row {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    border-bottom: 1px solid var(--border);
  }
  
  .table-row:nth-child(even) {
    background-color: var(--background-alt);
  }
  
  .table-row:last-child {
    border-bottom: none;
  }
  
  .row-cell {
    padding: 1rem;
    text-align: center;
    border-right: 1px solid var(--border);
  }
  
  .row-cell:last-child {
    border-right: none;
  }
  
  .reporting-cycle {
    margin-top: 2rem;
    background-color: var(--primary-lighter);
    padding: 1.5rem;
    border-radius: 8px;
  }
  
  .reporting-cycle h4 {
    color: var(--primary);
    margin-bottom: 1rem;
    font-size: 1.2rem;
  }
  
  /* FAQ Section */
  .faq-section {
    margin-bottom: 4rem;
  }
  
  .faq-container {
    max-width: 800px;
    margin: 0 auto;
  }
  
  .faq-item {
    background-color: white;
    border-radius: 8px;
    margin-bottom: 1rem;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
    overflow: hidden;
  }
  
  .faq-question {
    padding: 1.5rem;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: all 0.3s ease;
  }
  
  .faq-question h3 {
    font-size: 1.1rem;
    margin: 0;
    color: var(--text-primary);
  }
  
  .faq-icon {
    font-size: 1.5rem;
    color: #f8b400;
  }
  
  .faq-item.active .faq-question {
    background-color: #f8b400;
  }
  
  .faq-item.active .faq-question h3 {
    color: white;
  }
  
  .faq-item.active .faq-icon {
    color: white;
  }
  
  .faq-answer {
    padding: 0 1.5rem 1.5rem;
    border-top: 1px solid var(--border);
  }
  
  /* Contact Section */
  .contact-section {
    margin-bottom: 2rem;
  }
  
  .contact-cards {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
  }
  
  .contact-card {
    background-color: white;
    border-radius: 8px;
    padding: 2rem;
    text-align: center;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;
  }
  
  .contact-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
  }
  
  .contact-icon {
    font-size: 2.5rem;
    margin-bottom: 1rem;
    color: #f8b400;
  }
  
  .contact-card h3 {
    font-size: 1.3rem;
    margin-bottom: 1rem;
    color: #f8b400;
  }
  
  .contact-card p {
    margin-bottom: 0.5rem;
    color: var(--text-secondary);
  }
  
  /* Footer */
  .footer {
    background-color: #333;
    color: white;
    padding: 3rem 0 1rem;
    position: relative;
    overflow: hidden;
  }
  
  .footer-pattern {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
    opacity: 0.1;
  }
  
  .footer-content {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 2rem;
    margin-bottom: 2rem;
    position: relative;
    z-index: 1;
  }
  
  .footer-logo {
    display: flex;
    align-items: center;
    margin-bottom: 1rem;
  }
  
  .footer-description {
    font-size: 0.9rem;
    opacity: 0.8;
    line-height: 1.6;
  }
  
  .footer-title {
    font-size: 1.1rem;
    margin-bottom: 1.2rem;
    position: relative;
    padding-bottom: 0.5rem;
  }
  
  .footer-title::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 30px;
    height: 2px;
    background-color: var(--primary);
    border-radius: 2px;
  }
  
  .footer-links {
    list-style: none;
    padding: 0;
  }
  
  .footer-links li {
    margin-bottom: 0.6rem;
  }
  
  .footer-links a {
    color: white;
    opacity: 0.8;
    transition: all 0.3s ease;
    font-size: 0.9rem;
  }
  
  .footer-links a:hover {
    opacity: 1;
    padding-left: 3px;
  }
  
  .contact-info {
    list-style: none;
    padding: 0;
  }
  
  .contact-info li {
    display: flex;
    align-items: flex-start;
    margin-bottom: 1rem;
    font-size: 0.9rem;
  }
  
  .opening-hours {
    list-style: none;
    padding: 0;
  }
  
  .opening-hours li {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.6rem;
    font-size: 0.9rem;
  }
  
  .footer-bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 1.5rem;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    font-size: 0.85rem;
    position: relative;
    z-index: 1;
  }
  
  .footer-nav {
    display: flex;
    gap: 1.5rem;
  }
  
  .footer-nav a {
    color: white;
    opacity: 0.8;
    transition: opacity 0.3s ease;
  }
  
  .footer-nav a:hover {
    opacity: 1;
  }
  
  /* Responsive Styles */
  @media (max-width: 992px) {
    .intro-section {
      flex-direction: column;
    }
    
    .quote-box {
      width: 100%;
    }
    
    .organigramme-container {
      flex-direction: column;
    }
    
    .organigramme {
      flex: 0 0 auto;
      width: 100%;
    }
    
    .elections-grid {
      grid-template-columns: 1fr;
    }
    
    .contact-cards {
      grid-template-columns: repeat(2, 1fr);
    }
    
    .footer-content {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  
  @media (max-width: 768px) {
    .mobile-menu-btn {
      display: block;
    }
    
    .main-nav {
      position: fixed;
      top: 60px;
      left: 0;
      right: 0;
      background-color: white;
      box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
      padding: 1rem;
      display: none;
      flex-direction: column;
    }
    
    .main-nav.mobile-open {
      display: flex;
      animation: slide-down 0.3s ease;
    }
    
    @keyframes slide-down {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    .nav-list {
      flex-direction: column;
      width: 100%;
      margin-bottom: 1rem;
    }
    
    .nav-item {
      margin: 0;
      margin-bottom: 0.8rem;
    }
    
    .dropdown-menu {
      position: static;
      box-shadow: none;
      padding-left: 1rem;
      animation: none;
      border: none;
      border-left: 2px solid var(--primary);
    }
    
    .nav-buttons {
      width: 100%;
      justify-content: space-between;
    }
    
    .btn-donate, .btn-espace {
      width: 48%;
      text-align: center;
    }
    
    .page-title h1 {
      font-size: 2.2rem;
    }
    
    .tabs-header {
      flex-direction: column;
    }
    
    .table-header, .table-row {
      grid-template-columns: 1fr;
    }
    
    .header-cell, .row-cell {
      border-right: none;
      border-bottom: 1px solid var(--border);
    }
    
    .header-cell:last-child, .row-cell:last-child {
      border-bottom: none;
    }
    
    .contact-cards {
      grid-template-columns: 1fr;
    }
    
    .footer-content {
      grid-template-columns: 1fr;
    }
    
    .footer-bottom {
      flex-direction: column;
      gap: 1rem;
      text-align: center;
    }
    
    .footer-nav {
      flex-direction: column;
      gap: 0.6rem;
    }
  }
  
  @media (max-width: 576px) {
    .page-title h1 {
      font-size: 1.8rem;
    }
    
    .org-level.split {
      flex-direction: column;
      align-items: center;
      gap: 1rem;
    }
    
    .org-arrows-split {
      display: none;
    }
    
    .faq-question h3 {
      font-size: 1rem;
    }
  }
  </style>