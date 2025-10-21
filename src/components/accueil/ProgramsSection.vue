<template>
    <section class="programmes animate-slide-up" style="animation-delay: 0.2s;">
      <div class="section-header">
        <h2><span class="highlight">P</span>rogrammes à venir</h2>
        <span class="section-icon">📆</span>
      </div>
      
      <div class="programme-timeline">
        <div class="timeline-item animate-slide-right" v-for="(programme, index) in programmes" :key="programme.id" :style="{ animationDelay: `${index * 0.2}s` }">
          <div class="timeline-date">
            <span class="month">{{ programme.month }}</span>
            <span class="day">{{ programme.day }}</span>
            <span class="year">{{ programme.year }}</span>
          </div>
          <div class="timeline-content">
            <h4>{{ programme.title }}</h4>
            <p>{{ programme.description }}</p>
            <a href="#" class="btn btn-sm">{{ programme.action }}</a>
          </div>
        </div>
      </div>
    </section>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  
  const programmes = ref([
    {
      id: 1,
      month: 'AOÛT',
      day: '10-18',
      year: '2024',
      title: 'SENAFOI MAN 2024',
      description: 'Séminaire National de Formation Islamique et Managériale',
      action: 'S\'inscrire'
    },
    {
      id: 2,
      month: 'SEPT',
      day: '15',
      year: '2024',
      title: 'Rentrée Académique',
      description: 'Cérémonie officielle de la rentrée académique 2024-2025',
      action: 'En savoir plus'
    },
    {
      id: 3,
      month: 'OCT',
      day: '05',
      year: '2024',
      title: 'Conférence Nationale',
      description: 'Thème: "L\'éducation islamique face aux défis contemporains"',
      action: 'En savoir plus'
    }
  ])
  </script>
  
  <style scoped>
  /* Programme Timeline */
  .programmes {
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
  
  .programme-timeline {
    position: relative;
    padding-left: 1.2rem;
  }
  
  .programme-timeline::before {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: 70px;
    width: 2px;
    background-color: var(--primary);
    border-radius: 2px;
  }
  
  .timeline-item {
    display: flex;
    margin-bottom: 1.2rem;
    position: relative;
    opacity: 0;
    transform: translateX(20px);
  }
  
  .timeline-date {
    width: 70px;
    text-align: center;
    background-color: var(--primary);
    color: white;
    padding: 0.4rem;
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 6px rgba(26, 95, 63, 0.2);
    z-index: 2;
  }
  
  .timeline-date .month {
    font-size: 0.7rem;
    text-transform: uppercase;
    font-weight: 600;
  }
  
  .timeline-date .day {
    font-size: 1rem;
    font-weight: 700;
    margin: 0.1rem 0;
  }
  
  .timeline-date .year {
    font-size: 0.7rem;
  }
  
  .timeline-content {
    flex: 1;
    background-color: white;
    padding: 0.8rem;
    border-radius: 4px;
    margin-left: 1.2rem;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
    transition: transform 0.3s ease;
  }
  
  .timeline-content:hover {
    transform: translateY(-3px);
  }
  
  .timeline-content h4 {
    margin-bottom: 0.4rem;
    font-size: 0.9rem;
    color: var(--primary);
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
  
  .animate-slide-up {
    opacity: 0;
    transform: translateY(20px);
    animation: slideUp 0.6s ease forwards;
  }
  
  .animate-slide-right {
    opacity: 0;
    transform: translateX(-20px);
    animation: slideRight 0.6s ease forwards;
  }
  
  @keyframes slideUp {
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes slideRight {
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  
  /* Responsive */
  @media (max-width: 768px) {
    .timeline-item {
      flex-direction: column;
      align-items: flex-start;
      padding-left: 0;
    }
    
    .timeline-date {
      margin-bottom: 0.5rem;
      width: 100%;
      max-width: 120px;
    }
    
    .timeline-content {
      margin-left: 0;
      width: 100%;
    }
    
    .programme-timeline::before {
      display: none;
    }
  }
  </style>
  