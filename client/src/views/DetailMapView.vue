<template>
  <div v-if="item" class="container my-5">
    <div class="row g-4">
      <div class="col-lg-6">
        <div id="photoCarousel" ref="carouselElement" class="carousel slide mb-3" data-bs-ride="carousel">
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
        <p class="item-phone" v-html="phoneHtml"></p>
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
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import L from 'leaflet';
import { Carousel } from 'bootstrap'; // Import ciblé du JS de Bootstrap
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';
import { allItems } from '@/data/database.js';

// --- Configuration initiale de Leaflet ---
L.Icon.Default.mergeOptions({
  iconUrl: iconUrl,
  shadowUrl: shadowUrl
});

// --- État réactif (Refs) ---
const route = useRoute();
const mapContainer = ref(null);
const carouselElement = ref(null);
let mapInstance = null;
let carouselInstance = null;

// --- Logique du composant (Computed Properties) ---
const item = computed(() => {
  const itemId = Number(route.params.id);
  return allItems.find(i => i.id === itemId);
});

const phoneHtml = computed(() => {
  if (!item.value?.phone) return '';
  return `<i class="bi bi-telephone-fill"></i> <a href="tel:${item.value.phone}">${item.value.phone}</a>`;
});

// --- Fonctions d'initialisation et de nettoyage ---
function initializeComponent() {
  if (mapInstance) mapInstance.remove();
  if (carouselInstance) carouselInstance.dispose();

  if (item.value && mapContainer.value && carouselElement.value) {
    // Initialise la carte
    mapInstance = L.map(mapContainer.value).setView([item.value.lat, item.value.lng], 15);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(mapInstance);
    
    const redIcon = new L.Icon({
      iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
      shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
      iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
    });
    L.marker([item.value.lat, item.value.lng], { icon: redIcon }).addTo(mapInstance);
    
    setTimeout(() => mapInstance.invalidateSize(), 100);

    // Initialise le carrousel
    carouselInstance = new Carousel(carouselElement.value, {
      interval: 3000,
      ride: 'carousel'
    });
  }
}

// --- Hooks de cycle de vie ---
onMounted(initializeComponent);
watch(item, initializeComponent);
onUnmounted(() => {
  if (mapInstance) mapInstance.remove();
  if (carouselInstance) carouselInstance.dispose();
});
</script>

<style scoped>
/* --- Imports CSS --- */
/* Ces styles ne seront chargés que lorsque ce composant est affiché */
@import 'bootstrap/dist/css/bootstrap.min.css';
@import 'bootstrap-icons/font/bootstrap-icons.css';
@import 'leaflet/dist/leaflet.css';
</style>

<style scoped>
/* Vos styles spécifiques à ce composant */
.container {
  padding-top: 50px;
  color: #333;
}
.carousel-inner img {
  border-radius: 8px;
  height: 350px;
  object-fit: cover;
}
.not-found {
  text-align: center;
  padding: 5rem;
  color: #333;
}
.item-title, .item-desc, .item-phone {
  color: #333;
}


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


.carousel {
  border-radius: 10px;
  overflow: hidden;
  border: 2px solid #ccc;
}

.carousel-inner img {
  object-fit: cover;
  height: 300px;
  width: 100%;
  transition: opacity 0.5s ease-in-out;
}

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
}

.item-phone i {
  color: #d9230f;
  margin-right: 8px;
}

.item-phone a {
  color: #d9230f;
  text-decoration: none;
}

.item-phone a:hover {
  text-decoration: underline;
}

.map-popup {
     max-width: 270px;
    text-align: center;

}

.map-popup img {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 6px;
  margin-bottom: 8px;
}

.map-popup h5 {
  font-size: 1.1rem;
  margin-bottom: 5px;
  font-weight: 600;
}

.map-popup p {
  font-size: 0.9rem;
  color: #333;
  margin-bottom: 6px;
}

.map-popup .phone i {
  color: #d9230f;
  margin-right: 5px;
}

.map-popup a {
  color: #d9230f;
  text-decoration: none;
}

.map-popup a:hover {
  text-decoration: underline;
}

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

.leaflet-popup-tip {
  z-index: 1000 !important;
}

.leaflet-marker-icon {
  z-index: 1002 !important;
}

.leaflet-tile {
  filter: none !important;
}

.leaflet-container {
  background-color: #f8f9fa !important;
}

.leaflet-control-container .leaflet-top.leaflet-left {
  top: 10px;
  left: 10px;
}

html, body {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  background-color: #ffffff;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

@media (max-width: 576px) {
  .map-popup img {
    height: 120px;
  }

  .map-popup h5 {
    font-size: 1rem;
  }

  .map-popup p {
    font-size: 0.85rem;
  }

  .item-title {
    font-size: 1.5rem;
  }
}

</style>