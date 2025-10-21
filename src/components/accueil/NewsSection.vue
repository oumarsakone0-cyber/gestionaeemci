<template>
  <section class="actualites animate-slide-up">
    <div class="section-header">
      <h2><span class="highlight">A</span>ctualités</h2>
      <span class="section-icon">📰</span>
    </div>
    
    <div class="news-item featured">
      <div class="news-content">
        <h3>𝗝𝗼𝘂𝗿𝗻𝗲́𝗲 𝗱𝗲 𝗹’𝗘𝗻𝘃𝗶𝗿𝗼𝗻𝗻𝗲𝗺𝗲𝗻𝘁 𝗲𝘁 𝗱𝗲 𝗹𝗮 𝗖𝗶𝘁𝗼𝘆𝗲𝗻𝗻𝗲𝘁𝗲́</h3>
        <div class="news-meta">
          <span class="icon-calendar">📅</span>
          <span>25 Juin 2026</span>
        </div>
        <p>
          Ce mercredi 25 juin, M. Youssouf BAMBA, Amir de l’AEEMCI, a pris part à la  Journée de l’Environnement et de la Citoyenneté organisée par le Sous-Comité Universitaire Félix Houphouët-Boigny de Cocody.
Placée sous le signe de la responsabilité écologique et sociale, cette journée avait pour objectif de sensibiliser les étudiants à l'urgence environnementale et de les encourager à devenir des éco-citoyens engagés, conscients de leur rôle dans la préservation de notre cadre de vie.
        </p>
        <div class="event-details">
          <div class="detail-item">
            <strong>Date :</strong> 25 Juin 2026
          </div>
          <div class="detail-item">
            <strong>Lieu :</strong> Université Felix Houphouet Boigny
          </div>
        </div>
        <a href="/detail_actualite" class="btn btn-sm">Lire plus</a>
      </div>
      <div class="news-image">
        <img src="../../assets/actualite1.jpg" alt="SENAFOI MAN 2024" class="img-responsive" />
      </div>
    </div>
    
    <NewsCarousel :articles="newsArticles" />
    
    <div class="view-all-news">
      <a href="#" class="btn btn-outline btn-sm">Voir toutes les actualités</a>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import NewsCarousel from './NewsCarousel.vue'

const newsArticles = ref([
  {
    id: 1,
    title: 'SPECIAL EDITION TALKS',
    date: '05/07/2024',
    excerpt: 'Conférence spéciale sur les défis de la jeunesse musulmane.',
    image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 2,
    title: 'Journée de solidarité',
    date: '01/07/2024',
    excerpt: 'Distribution de kits scolaires et alimentaires aux familles.',
    image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 3,
    title: 'Concours de récitation du Coran',
    date: '28/06/2024',
    excerpt: 'Grand concours national de récitation du Saint Coran.',
    image: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 4,
    title: 'Conférence sur l\'éducation',
    date: '20/06/2024',
    excerpt: 'L\'importance de l\'éducation islamique dans le monde moderne.',
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9d1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80'
  }
])
</script>

<style scoped>
/* News Section */
.actualites {
  margin-bottom: 1.8rem;
  background-color: white;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.2rem;
  border-bottom: 2px solid var(--primary);
  padding-bottom: 0.4rem;
}

.section-header h2 {
  font-size: 1.3rem;
  font-weight: 700;
}

.highlight {
  color: var(--primary);
  font-weight: 800;
}

.section-icon {
  color: var(--primary);
  font-size: 1rem;
}

.news-item.featured {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.2rem;
  background-color: var(--background-alt);
  border-radius: 6px;
  padding: 1rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease;
  margin-bottom: 1.2rem;
}

.news-item.featured:hover {
  transform: translateY(-3px);
}

.news-meta {
  display: flex;
  align-items: center;
  color: var(--text-light);
  font-size: 0.75rem;
  margin-bottom: 0.6rem;
}

.icon-calendar {
  margin-right: 0.3rem;
}

.event-details {
  background-color: rgba(26, 95, 63, 0.1);
  padding: 0.6rem;
  border-radius: 4px;
  margin: 0.8rem 0;
}

.detail-item {
  margin-bottom: 0.4rem;
  font-size: 0.8rem;
}

.img-responsive {
  display: block;
  width: 100%;
  height: auto;
  border-radius: 4px;
  transition: transform 0.5s ease;
}

.btn {
  display: inline-block;
  padding: 0.3rem 0.7rem;
  border-radius: 2px;
  font-weight: 600;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  font-size: 0.75rem;
  letter-spacing: 0.3px;
  text-decoration: none;
  background-color: var(--primary);
  color: white;
}

.btn:hover {
  background-color: var(--primary-dark);
  transform: translateY(-2px);
}

.btn-outline {
  background-color: transparent;
  border: 1px solid var(--primary);
  color: var(--primary);
}

.btn-outline:hover {
  background-color: var(--primary);
  color: white;
}

.view-all-news {
  text-align: center;
  margin-top: 1.2rem;
}

.animate-slide-up {
  opacity: 0;
  transform: translateY(20px);
  animation: slideUp 0.6s ease forwards;
}

@keyframes slideUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive */
@media (max-width: 992px) {
  .news-item.featured {
    grid-template-columns: 1fr;
  }
}
</style>
