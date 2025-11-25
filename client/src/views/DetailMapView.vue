<template>
  <div v-if="item" class="container my-5">
    <div class="row g-4">
      <div class="col-lg-6">
        
        <div id="photoCarousel" ref="carouselElement" class="carousel slide mb-3">
          <div class="carousel-inner">
            <div v-for="(img, idx) in item.carouselImages" :key="img" class="carousel-item" :class="{ active: idx === 0 }">
              <img :src="img" class="d-block w-100" :alt="item.name" />
            </div>
          </div>
          <button class="carousel-control-prev" type="button" data-bs-target="#photoCarousel" data-bs-slide="prev">
            <span class="carousel-control-prev-icon"></span>
          </button>
          <button class="carousel-control-next" type="button" data-bs-target="#photoCarousel" data-bs-slide="next">
            <span class="carousel-control-next-icon"></span>
          </button>
        </div>

        <h2 class="fw-bold item-title">{{ item.title }}</h2>
        <p class="item-desc">{{ item.longDesc }}</p>
        
        <div class="popup-phone" v-html="phoneHtml"></div>

        <div class="mt-4">
          <button @click="goToReservation" class="reserve-btn-large">
            📅 Make a Reservation!
          </button>
        </div>

      </div>

      <div class="col-lg-6">
        <div class="card shadow-sm">
          <div class="card-body p-0">
            <div ref="mapContainer" style="height: 400px; border-radius: 8px;"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="not-found">
    <h1>Item Not Found</h1>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue';
import { useRoute,useRouter } from 'vue-router';
import L from 'leaflet';
import { Carousel } from 'bootstrap'; 
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';
import api from '@/services/api.js';

// --- Configuration initiale de Leaflet ---
L.Icon.Default.mergeOptions({
  iconUrl: iconUrl,
  shadowUrl: shadowUrl
});

// --- État réactif (Refs) ---
const route = useRoute();
const router = useRouter();
const mapContainer = ref(null);
const carouselElement = ref(null);
const item = ref(null); // 1. CORRECTION : Déclaration de la variable item
let mapInstance = null;
let carouselInstance = null;

// --- Chargement des données ---
const loadItem = async () => {
  const id = route.params.id;
  try {
    // 2. CORRECTION : Avec fetch, la réponse est directement l'objet de données
    const data = await api.getItemById(id);
    item.value = data; 
  } catch (error) {
    console.error("Erreur lors du chargement de l'item:", error);
  }
};

// --- Computed Properties ---
const phoneHtml = computed(() => {
  if (!item.value?.phone) return '';
  return `<i class="bi bi-telephone-fill"></i>
          <a href="tel:${item.value.phone}">${item.value.phone}</a>`;
});
const goToReservation = () => {
  router.push(`/reserve/${item.value.id}`);
};

// --- Fonctions d'initialisation ---
function initializeComponent() {
  // 1. Nettoyage préalable
  if (mapInstance) {
    mapInstance.remove();
    mapInstance = null;
  }
  if (carouselInstance) {
    carouselInstance.dispose();
    carouselInstance = null;
  }

  // 2. Vérification que le DOM et les données sont prêts
  if (item.value && mapContainer.value && carouselElement.value) {
    
    // --- A. Initialisation de la Carte ---
    mapInstance = L.map(mapContainer.value).setView([item.value.lat, item.value.lng], 15);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(mapInstance);
    
    // Configuration de l'icône rouge
    const redIcon = new L.Icon({
      iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
      shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });
    
    const marker = L.marker([item.value.lat, item.value.lng], { icon: redIcon }).addTo(mapInstance);
    
   // --- CONSTRUCTION DU POPUP (Version Propre) ---
    
    // 1. Choix de l'image
    const popupImage = (item.value.carouselImages && item.value.carouselImages.length > 0) 
      ? item.value.carouselImages[0] 
      : item.value.imageUrl;

    // 2. Gestion du téléphone
    let phoneSection = '';
    if (item.value.phone) {
      phoneSection = `
        <div class="popup-phone">
          <i class="bi bi-telephone-fill"></i>
          <a href="tel:${item.value.phone}">${item.value.phone}</a>
        </div>
      `;
    }

    // 3. HTML final simplifié
    const popupHTML = `
      <div class="popup-content">
        <img src="${popupImage}" alt="${item.value.name}" class="popup-img" />
        <h5 class="popup-title">${item.value.title}</h5>
        <p class="popup-desc">${item.value.shortDesc || ''}</p>
        ${phoneSection}
      </div>
    `;

    marker.bindPopup(popupHTML, {
      offset: L.point(0, -30),
      maxWidth: 250,
      className: 'custom-popup-wrapper' // On donne une classe au conteneur global Leaflet
    }).openPopup();

    // Correction du bug d'affichage Leaflet
    setTimeout(() => mapInstance.invalidateSize(), 100);

    // --- B. Initialisation du Carrousel ---
    // --- B. Initialisation du Carrousel ---
    if (carouselElement.value) {
      // Just use .value directly
      carouselInstance = new Carousel(carouselElement.value, {
        interval: 3000,
        ride: 'carousel'
      });
    }
  }
}

// --- Hooks de cycle de vie ---
onMounted(() => {
  loadItem();// On lance le chargement
});


// 3. CORRECTION : Utilisation de nextTick
// On surveille l'item. Quand il arrive, on attend que Vue mette à jour le DOM (v-if), PUIS on initialise.
watch(item, async () => {
  await nextTick(); 
  initializeComponent();
});

onUnmounted(() => {
  if (mapInstance) mapInstance.remove();
  if (carouselInstance) carouselInstance.dispose();
});
</script>

<style scoped>
/* 1. LES IMPORTS DOIVENT ÊTRE EN PREMIER ABSOLU */
@import 'bootstrap/dist/css/bootstrap.min.css';
@import 'bootstrap-icons/font/bootstrap-icons.css';
@import 'leaflet/dist/leaflet.css';

/* 2. Styles propres au composant (Scoped) */
.container {
  padding-top: 50px;
  color: #333;
}

.not-found {
  text-align: center;
  padding: 5rem;
  color: #333;
}

/* --- Carousel --- */
.carousel {
  border-radius: 10px;
  overflow: hidden;
  border: 2px solid #ccc;
}

.carousel-inner img {
  border-radius: 8px; /* Attention: redondant avec .carousel overflow hidden, mais ok */
  height: 350px;
  width: 100%;
  object-fit: cover;
  transition: opacity 0.5s ease-in-out;
}

/* --- Carte --- */
#map {
  height: 400px;
  width: 100%;
  border-radius: 10px;
  background: none;
  z-index: 1;
}

.card-body.p-0 {
  padding: 0 !important;
  overflow: hidden;
}

/* --- Détails de l'item (Gauche) --- */
.item-title {
  font-family: 'Playfair Display', serif;
  font-size: 2rem;
  color: #2c3e50;
  margin-top: 1rem;
}

.item-desc {
  font-size: 1.1rem;
  line-height: 1.6;
  color: #555;
}

.item-phone {
  font-size: 1.05rem;
  margin-top: 10px;
  color: #d9534f;
}

.item-phone i {
  color: #d9534f; /* Corrigé pour uniformité (d9230f vs d9534f) */
  margin-right: 8px;
}

.item-phone a {
  color: #d9534f;
  text-decoration: none;
}

.item-phone a:hover {
  text-decoration: underline;
}

@media (max-width: 576px) {
  .item-title {
    font-size: 1.5rem;
  }
}
</style>

<style>

/* --- Styles Leaflet Globaux --- */
.leaflet-container {
  background-color: #f8f9fa !important;
}

.leaflet-tile {
  filter: none !important;
}

/* Fix z-index pour éviter que la carte passe au dessus du menu si besoin */
.leaflet-popup-content-wrapper {
  z-index: 1001 !important;
  border-radius: 12px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  padding: 0 !important;
}

.leaflet-popup-content {
  margin: 0 !important;
  padding: 0 !important;
}

/* --- Styles du contenu du Popup (générés par JS) --- */
/* Ces classes correspondent à ce que j'ai mis dans le JS "propre" précédent */

.popup-content {
  text-align: center;
  max-width: 270px;
}

.popup-img {
  width: 100%;
  height: 150px; /* Votre hauteur souhaitée */
  object-fit: cover;
  border-radius: 6px; /* Retiré le border-radius bas pour coller au design wrapper */
  margin-bottom: 8px;
  display: block;
}

.popup-title {
  font-size: 1.1rem;
  margin-bottom: 5px;
  font-weight: 600;
  padding: 0 10px; /* Un peu d'air sur les côtés */
}

.popup-desc {
  font-size: 0.9rem;
  color: #333;
  margin-bottom: 6px;
  padding: 0 10px;
}

.popup-phone {
  margin-bottom: 10px;
  font-size: 0.95rem;
}

.popup-phone i,
.popup-phone a {
  color: #d9534f;
  text-decoration: none;
}

.popup-phone a:hover {
  text-decoration: underline;
}

/* Responsive Popup */
@media (max-width: 576px) {
  .popup-img {
    height: 120px;
  }
  .popup-title {
    font-size: 1rem;
  }
  .popup-desc {
    font-size: 0.85rem;
  }
}
</style>