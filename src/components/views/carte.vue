<template>
  <div class="min-h-screen bg-gradient-to-br from-orange-50 to-green-50 p-6">
    <div class="max-w-7xl mx-auto">
      <h1 class="text-3xl font-bold text-center mb-8 text-gray-800">
        Carte Interactive de la Côte d'Ivoire
      </h1>
      
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Carte principale -->
        <div class="lg:col-span-2">
          <div class="bg-white rounded-lg shadow-lg p-4">
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-xl font-semibold text-gray-700">Régions administratives</h2>
              <div class="flex gap-2">
                <button 
                  @click="zoomIn" 
                  class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm font-medium"
                >
                  Zoom +
                </button>
                <button 
                  @click="zoomOut" 
                  class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm font-medium"
                >
                  Zoom -
                </button>
                <button 
                  @click="resetView" 
                  class="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm font-medium"
                >
                  Reset
                </button>
              </div>
            </div>
            
            <!-- Utilisation de l'image réelle avec zones cliquables -->
            <div class="border rounded-lg overflow-hidden bg-white relative">
              <div 
                class="relative cursor-move"
                :style="`transform: scale(${zoomLevel}) translate(${panX}px, ${panY}px)`"
                @mousedown="startDrag"
                @mousemove="drag"
                @mouseup="endDrag"
                @wheel="handleWheel"
              >
                <!-- Image de la carte réelle -->
                <img 
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/carte%20abidjan-6YJCY4wGeGvrlmGuPyc9ulVLF1dskM.png" 
                  alt="Carte de la Côte d'Ivoire"
                  class="w-full h-auto max-w-4xl"
                  draggable="false"
                />
                
                <!-- Overlays cliquables pour chaque région -->
                <svg 
                  class="absolute top-0 left-0 w-full h-full"
                  viewBox="0 0 1000 800"
                  preserveAspectRatio="xMidYMid meet"
                >
                  <!-- Zones cliquables basées sur les positions réelles des régions dans l'image -->
                  <g v-for="region in regions" :key="region.id">
                    <polygon
                      :points="region.coordinates"
                      :fill="selectedRegion?.id === region.id ? 'rgba(249, 115, 22, 0.4)' : 'rgba(34, 197, 94, 0.2)'"
                      :stroke="selectedRegion?.id === region.id ? '#ea580c' : '#16a34a'"
                      stroke-width="2"
                      class="cursor-pointer transition-all duration-200 hover:fill-opacity-60"
                      @click="selectRegion(region)"
                    />
                    <!-- Tooltip au survol -->
                    <text 
                      :x="region.centerX" 
                      :y="region.centerY" 
                      text-anchor="middle" 
                      class="fill-gray-800 text-sm font-semibold pointer-events-none opacity-0 hover:opacity-100"
                      style="text-shadow: 2px 2px 4px rgba(255,255,255,0.8)"
                    >
                      {{ region.nom }}
                    </text>
                  </g>
                </svg>
              </div>
            </div>
            
            <!-- Légende -->
            <div class="mt-4 flex flex-wrap gap-4 text-sm">
              <div class="flex items-center gap-2">
                <div class="w-4 h-4 bg-green-500 bg-opacity-40 border-2 border-green-600 rounded"></div>
                <span>Région normale</span>
              </div>
              <div class="flex items-center gap-2">
                <div class="w-4 h-4 bg-orange-500 bg-opacity-40 border-2 border-orange-600 rounded"></div>
                <span>Région sélectionnée</span>
              </div>
              <div class="text-gray-600">
                SC = Sous-comités | S = Sections
              </div>
            </div>
          </div>
        </div>
        
        <!-- Panneau d'informations -->
        <div class="space-y-6">
          <!-- Informations région sélectionnée -->
          <div class="bg-white rounded-lg shadow-lg p-6">
            <h3 class="text-lg font-semibold mb-4 text-gray-800">
              {{ selectedRegion ? selectedRegion.nom : 'Sélectionnez une région' }}
            </h3>
            
            <div v-if="selectedRegion" class="space-y-3">
              <div class="bg-orange-50 p-3 rounded-lg">
                <div class="text-sm text-gray-600">Chef-lieu</div>
                <div class="font-semibold text-gray-800">{{ selectedRegion.chefLieu }}</div>
              </div>
              
              <div class="grid grid-cols-2 gap-3">
                <div class="bg-green-50 p-3 rounded-lg text-center">
                  <div class="text-2xl font-bold text-green-600">{{ selectedRegion.sousComites }}</div>
                  <div class="text-sm text-gray-600">Sous-comités</div>
                </div>
                <div class="bg-blue-50 p-3 rounded-lg text-center">
                  <div class="text-2xl font-bold text-blue-600">{{ selectedRegion.sections }}</div>
                  <div class="text-sm text-gray-600">Sections</div>
                </div>
              </div>
              
              <div class="bg-gray-50 p-3 rounded-lg">
                <div class="text-sm text-gray-600">Population estimée</div>
                <div class="font-semibold text-gray-800">{{ selectedRegion.population.toLocaleString() }} habitants</div>
              </div>
              
              <div class="bg-gray-50 p-3 rounded-lg">
                <div class="text-sm text-gray-600">Superficie</div>
                <div class="font-semibold text-gray-800">{{ selectedRegion.superficie.toLocaleString() }} km²</div>
              </div>
            </div>
            
            <div v-else class="text-center text-gray-500 py-8">
              <div class="text-4xl mb-2">🗺️</div>
              <p>Cliquez sur une région pour voir ses détails</p>
            </div>
          </div>
          
          <!-- Résumé national -->
          <div class="bg-white rounded-lg shadow-lg p-6">
            <h3 class="text-lg font-semibold mb-4 text-gray-800">Résumé National</h3>
            
            <div class="grid grid-cols-2 gap-3 mb-4">
              <div class="bg-green-50 p-3 rounded-lg text-center">
                <div class="text-2xl font-bold text-green-600">{{ totalSousComites }}</div>
                <div class="text-sm text-gray-600">Total Sous-comités</div>
              </div>
              <div class="bg-blue-50 p-3 rounded-lg text-center">
                <div class="text-2xl font-bold text-blue-600">{{ totalSections }}</div>
                <div class="text-sm text-gray-600">Total Sections</div>
              </div>
            </div>
            
            <div class="bg-orange-50 p-3 rounded-lg text-center">
              <div class="text-2xl font-bold text-orange-600">{{ regions.length }}</div>
              <div class="text-sm text-gray-600">Régions administratives</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const selectedRegion = ref(null)
const isDragging = ref(false)
const dragStart = ref({ x: 0, y: 0 })
const zoomLevel = ref(1)
const panX = ref(0)
const panY = ref(0)

const regions = ref([
  {
    id: 1,
    nom: 'FOLON',
    chefLieu: 'Minignan',
    population: 96415,
    superficie: 4467,
    sousComites: 8,
    sections: 22,
    centerX: 120,
    centerY: 180,
    coordinates: '80,160 160,160 160,200 80,200'
  },
  {
    id: 2,
    nom: 'KABADOUGOU',
    chefLieu: 'Odienné',
    population: 193364,
    superficie: 9873,
    sousComites: 12,
    sections: 35,
    centerX: 180,
    centerY: 280,
    coordinates: '140,250 220,250 220,310 140,310'
  },
  {
    id: 3,
    nom: 'BAFING',
    chefLieu: 'Touba',
    population: 183047,
    superficie: 8720,
    sousComites: 11,
    sections: 32,
    centerX: 220,
    centerY: 380,
    coordinates: '180,350 260,350 260,410 180,410'
  },
  {
    id: 4,
    nom: 'WORODOUGOU',
    chefLieu: 'Séguéla',
    population: 272334,
    superficie: 22040,
    sousComites: 15,
    sections: 42,
    centerX: 320,
    centerY: 380,
    coordinates: '270,350 370,350 370,410 270,410'
  },
  {
    id: 5,
    nom: 'BÉRÉ',
    chefLieu: 'Mankono',
    population: 389462,
    superficie: 8680,
    sousComites: 18,
    sections: 48,
    centerX: 380,
    centerY: 380,
    coordinates: '340,350 420,350 420,410 340,410'
  },
  {
    id: 6,
    nom: 'BAGOUÉ',
    chefLieu: 'Boundiali',
    population: 375687,
    superficie: 28350,
    sousComites: 16,
    sections: 45,
    centerX: 280,
    centerY: 220,
    coordinates: '230,180 330,180 330,260 230,260'
  },
  {
    id: 7,
    nom: 'PORO',
    chefLieu: 'Korhogo',
    population: 763852,
    superficie: 10498,
    sousComites: 28,
    sections: 78,
    centerX: 420,
    centerY: 220,
    coordinates: '370,180 470,180 470,260 370,260'
  },
  {
    id: 8,
    nom: 'TCHOLOGO',
    chefLieu: 'Ferkessédougou',
    population: 467958,
    superficie: 9670,
    sousComites: 22,
    sections: 58,
    centerX: 520,
    centerY: 220,
    coordinates: '470,180 570,180 570,260 470,260'
  },
  {
    id: 9,
    nom: 'HAMBOL',
    chefLieu: 'Katiola',
    population: 429977,
    superficie: 8886,
    sousComites: 20,
    sections: 52,
    centerX: 480,
    centerY: 320,
    coordinates: '430,280 530,280 530,360 430,360'
  },
  {
    id: 10,
    nom: 'VALLÉE DU BANDAMA',
    chefLieu: 'Bouaké',
    population: 1081404,
    superficie: 28530,
    sousComites: 35,
    sections: 95,
    centerX: 420,
    centerY: 380,
    coordinates: '370,340 470,340 470,420 370,420'
  },
  {
    id: 11,
    nom: 'BOUNKANI',
    chefLieu: 'Bouna',
    population: 267167,
    superficie: 19210,
    sousComites: 14,
    sections: 38,
    centerX: 680,
    centerY: 220,
    coordinates: '630,180 730,180 730,260 630,260'
  },
  {
    id: 12,
    nom: 'GONTOUGO',
    chefLieu: 'Bondoukou',
    population: 667185,
    superficie: 12739,
    sousComites: 25,
    sections: 68,
    centerX: 680,
    centerY: 380,
    coordinates: '630,340 730,340 730,420 630,420'
  },
  {
    id: 13,
    nom: 'TONKPI',
    chefLieu: 'Man',
    population: 992564,
    superficie: 12093,
    sousComites: 32,
    sections: 85,
    centerX: 220,
    centerY: 480,
    coordinates: '170,440 270,440 270,520 170,520'
  },
  {
    id: 14,
    nom: 'GUÉMON',
    chefLieu: 'Duékoué',
    population: 919392,
    superficie: 8480,
    sousComites: 30,
    sections: 82,
    centerX: 280,
    centerY: 520,
    coordinates: '230,480 330,480 330,560 230,560'
  },
  {
    id: 15,
    nom: 'CAVALLY',
    chefLieu: 'Guiglo',
    population: 459964,
    superficie: 14100,
    sousComites: 19,
    sections: 48,
    centerX: 180,
    centerY: 580,
    coordinates: '130,540 230,540 230,620 130,620'
  },
  {
    id: 16,
    nom: 'HAUT-SASSANDRA',
    chefLieu: 'Daloa',
    population: 1430960,
    superficie: 15200,
    sousComites: 42,
    sections: 115,
    centerX: 320,
    centerY: 480,
    coordinates: '270,440 370,440 370,520 270,520'
  },
  {
    id: 17,
    nom: 'MARAHOUÉ',
    chefLieu: 'Bouaflé',
    population: 862344,
    superficie: 8500,
    sousComites: 28,
    sections: 75,
    centerX: 380,
    centerY: 480,
    coordinates: '330,440 430,440 430,520 330,520'
  },
  {
    id: 18,
    nom: 'BÉLIER',
    chefLieu: 'Yamoussoukro',
    population: 346462,
    superficie: 3500,
    sousComites: 15,
    sections: 38,
    centerX: 450,
    centerY: 450,
    coordinates: '420,420 480,420 480,480 420,480'
  },
  {
    id: 19,
    nom: 'N\'ZI',
    chefLieu: 'Dimbokro',
    population: 247578,
    superficie: 19560,
    sousComites: 12,
    sections: 32,
    centerX: 520,
    centerY: 480,
    coordinates: '480,440 560,440 560,520 480,520'
  },
  {
    id: 20,
    nom: 'MORONOU',
    chefLieu: 'Bongouanou',
    population: 352616,
    superficie: 8720,
    sousComites: 16,
    sections: 42,
    centerX: 580,
    centerY: 480,
    coordinates: '540,440 620,440 620,520 540,520'
  },
  {
    id: 21,
    nom: 'INDÉNIÉ-DJUABLIN',
    chefLieu: 'Abengourou',
    population: 560432,
    superficie: 9670,
    sousComites: 22,
    sections: 58,
    centerX: 650,
    centerY: 480,
    coordinates: '610,440 690,440 690,520 610,520'
  },
  {
    id: 22,
    nom: 'SUD-COMOÉ',
    chefLieu: 'Aboisso',
    population: 642620,
    superficie: 7073,
    sousComites: 24,
    sections: 65,
    centerX: 680,
    centerY: 580,
    coordinates: '640,540 720,540 720,620 640,620'
  },
  {
    id: 23,
    nom: 'NAWA',
    chefLieu: 'Soubré',
    population: 1053084,
    superficie: 9895,
    sousComites: 35,
    sections: 92,
    centerX: 280,
    centerY: 580,
    coordinates: '230,540 330,540 330,620 230,620'
  },
  {
    id: 24,
    nom: 'GBÔKLÉ',
    chefLieu: 'Sassandra',
    population: 400798,
    superficie: 8280,
    sousComites: 18,
    sections: 45,
    centerX: 220,
    centerY: 620,
    coordinates: '170,580 270,580 270,660 170,660'
  },
  {
    id: 25,
    nom: 'SAN PÉDRO',
    chefLieu: 'San-Pédro',
    population: 826666,
    superficie: 6900,
    sousComites: 28,
    sections: 72,
    centerX: 180,
    centerY: 680,
    coordinates: '130,640 230,640 230,720 130,720'
  },
  {
    id: 26,
    nom: 'GOH',
    chefLieu: 'Gagnoa',
    population: 876117,
    superficie: 7222,
    sousComites: 30,
    sections: 78,
    centerX: 350,
    centerY: 580,
    coordinates: '310,540 390,540 390,620 310,620'
  },
  {
    id: 27,
    nom: 'LOH-DJIBOUA',
    chefLieu: 'Divo',
    population: 729169,
    superficie: 21263,
    sousComites: 26,
    sections: 68,
    centerX: 380,
    centerY: 620,
    coordinates: '340,580 420,580 420,660 340,660'
  },
  {
    id: 28,
    nom: 'AGNÉBY-TIASSA',
    chefLieu: 'Agboville',
    population: 606852,
    superficie: 9420,
    sousComites: 22,
    sections: 58,
    centerX: 480,
    centerY: 620,
    coordinates: '440,580 520,580 520,660 440,660'
  },
  {
    id: 29,
    nom: 'MÉ',
    chefLieu: 'Adzopé',
    population: 514700,
    superficie: 4756,
    sousComites: 20,
    sections: 52,
    centerX: 580,
    centerY: 620,
    coordinates: '540,580 620,580 620,660 540,660'
  },
  {
    id: 30,
    nom: 'GRANDS-PONTS',
    chefLieu: 'Dabou',
    population: 356495,
    superficie: 8715,
    sousComites: 16,
    sections: 42,
    centerX: 420,
    centerY: 680,
    coordinates: '380,640 460,640 460,720 380,720'
  },
  {
    id: 31,
    nom: 'ABIDJAN',
    chefLieu: 'Abidjan',
    population: 4707404,
    superficie: 2119,
    sousComites: 85,
    sections: 245,
    centerX: 480,
    centerY: 680,
    coordinates: '440,640 520,640 520,720 440,720'
  }
])

const totalSousComites = computed(() => {
  return regions.value.reduce((total, region) => total + region.sousComites, 0)
})

const totalSections = computed(() => {
  return regions.value.reduce((total, region) => total + region.sections, 0)
})

const selectRegion = (region) => {
  selectedRegion.value = region
}

const zoomIn = () => {
  zoomLevel.value = Math.min(zoomLevel.value * 1.2, 3)
}

const zoomOut = () => {
  zoomLevel.value = Math.max(zoomLevel.value / 1.2, 0.5)
}

const resetView = () => {
  zoomLevel.value = 1
  panX.value = 0
  panY.value = 0
  selectedRegion.value = null
}

const startDrag = (event) => {
  isDragging.value = true
  dragStart.value = { x: event.clientX - panX.value, y: event.clientY - panY.value }
}

const drag = (event) => {
  if (isDragging.value) {
    panX.value = event.clientX - dragStart.value.x
    panY.value = event.clientY - dragStart.value.y
  }
}

const endDrag = () => {
  isDragging.value = false
}

const handleWheel = (event) => {
  event.preventDefault()
  if (event.deltaY < 0) {
    zoomIn()
  } else {
    zoomOut()
  }
}

onMounted(() => {
  // Sélectionner la première région par défaut
  selectedRegion.value = regions.value[0]
})
</script>
