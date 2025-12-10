<template>
  <div v-if="item" class="container my-5">
    <div class="row g-4">
      <div class="col-lg-6">
        
        <div class="carousel-container mb-3">
          <div class="carousel-inner-custom">
            
            <transition-group :name="transitionName" tag="div" class="slides-wrapper">
              <div 
                v-for="(img, id) in item.carouselImages" 
                v-show="id === currentSlide"
                :key="img" 
                class="carousel-item-custom"
              >
                <img :src="img" loading="lazy" class="d-block w-100" :alt="item.name" />
              </div>
            </transition-group>

          </div>

          <button v-if="item.carouselImages.length > 1" class="carousel-control-prev" type="button" @click.stop.prevent="prevSlide">
            <span class="carousel-control-prev-icon"></span>
          </button>
          <button v-if="item.carouselImages.length > 1" class="carousel-control-next" type="button" @click.stop.prevent="nextSlide">
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
            <div ref="mapContainer" style="height: 400px; border-radius: 8px; z-index:1"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="not-found">
    <h1 v-if="loading">Loading...</h1>
    <h1 v-else>Item Not Found</h1>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import L from 'leaflet';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';
import api from '@/services/api.js';

L.Icon.Default.mergeOptions({ iconUrl, shadowUrl });

const route = useRoute();
const router = useRouter();
const mapContainer = ref(null);
const item = ref(null);
const loading = ref(false);

const currentSlide = ref(0);
const transitionName = ref('slide-next');

const nextSlide = () => {
  if (item.value && item.value.carouselImages) {
    transitionName.value = 'slide-next';
    currentSlide.value = (currentSlide.value + 1) % item.value.carouselImages.length;
  }
};

const prevSlide = () => {
  if (item.value && item.value.carouselImages) {
    transitionName.value = 'slide-prev';
    currentSlide.value = (currentSlide.value - 1 + item.value.carouselImages.length) % item.value.carouselImages.length;
  }
};

let mapInstance = null;

const loadItem = async () => {
  const id = route.params.id;
  if (!id) return;
  loading.value = true;
  currentSlide.value = 0;
  
  if (mapInstance) { mapInstance.remove(); mapInstance = null; }

  try {
    const data = await api.getItemById(id);
    if (data?.price) data.price = parseFloat(data.price);
    item.value = data; 
  } catch (error) {
    console.error("Erreur chargement:", error);
  } finally {
    loading.value = false;
  }
};

const phoneHtml = computed(() => {
  if (!item.value?.phone) return '';
  return `<i class="bi bi-telephone-fill"></i> <a href="tel:${item.value.phone}">${item.value.phone}</a>`;
});

const goToReservation = () => {
  if(item.value) router.push(`/reserve/${item.value.id}`);
};

function initializeMap() {
  if (mapInstance) { mapInstance.remove(); mapInstance = null; }
  if (!item.value) return;
  if (item.value.lat === null) item.value.lat = 0;
  if (item.value.lng === null) item.value.lng = 0;
  if (item.value && mapContainer.value) {
    mapInstance = L.map(mapContainer.value).setView([item.value.lat, item.value.lng], 15);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap' }).addTo(mapInstance);
    
    const redIcon = new L.Icon({
      iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
      shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
      iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
    });
    const marker = L.marker([item.value.lat, item.value.lng], { icon: redIcon }).addTo(mapInstance);

    const popupImage = (item.value.carouselImages && item.value.carouselImages.length > 0) 
      ? item.value.carouselImages[0] 
      : (item.value.imageUrl || 'https://via.placeholder.com/250x150?text=No+Image'); 

    let phoneSection = '';
    if (item.value.phone) {
      phoneSection = `
        <div class="popup-phone">
          <i class="bi bi-telephone-fill"></i>
          <a href="tel:${item.value.phone}">${item.value.phone}</a>
        </div>
      `;
    }

    const description = item.value.shortDesc || (item.value.longDesc ? item.value.longDesc.substring(0, 60) + '...' : '');

    const popupHTML = `
      <div class="popup-content">
        <img src="${popupImage}" alt="${item.value.name || 'Image'}" class="popup-img" />
        <h5 class="popup-title">${item.value.title}</h5>
        <p class="popup-desc">${description}</p>
        ${phoneSection}
      </div>
    `;

    marker.bindPopup(popupHTML, {
      offset: L.point(0, -30),
      maxWidth: 250,
      className: 'custom-popup-wrapper'
    }).openPopup();

    setTimeout(() => mapInstance?.invalidateSize(), 100);
  }
}

onMounted(() => loadItem());
watch(() => route.params.id, (newId) => { if(newId) loadItem(); });
watch(item, async () => { await nextTick(); initializeMap(); });
onBeforeUnmount(() => { if (mapInstance) { mapInstance.remove(); mapInstance = null; } });
</script>

<style scoped>
@import 'bootstrap/dist/css/bootstrap.min.css';
@import 'bootstrap-icons/font/bootstrap-icons.css';
@import 'leaflet/dist/leaflet.css';

.container {
  padding-top: 50px;
  color: #333;
}

.not-found {
  text-align: center;
  padding: 5rem;
  color: #333;
}
.carousel-container {
  position: relative;
  border-radius: 10px;
  overflow: hidden;
  border: 2px solid #ccc;
  height: 350px; 
  background: #f0f0f0;
}

.carousel-inner-custom {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.carousel-item-custom {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.carousel-item-custom img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
}


.slide-next-enter-active,
.slide-next-leave-active {
  transition: transform 0.6s ease-in-out;
}
.slide-next-enter-from {
  transform: translateX(100%); 
}
.slide-next-leave-to {
  transform: translateX(-100%); 
}

.slide-prev-enter-active,
.slide-prev-leave-active {
  transition: transform 0.6s ease-in-out;
}
.slide-prev-enter-from {
  transform: translateX(-100%); 
}
.slide-prev-leave-to {
  transform: translateX(100%); 
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
  color: #d9534f;
  margin-right: 8px;
}

.item-phone a {
  color: #d9534f;
  text-decoration: none;
}

.item-phone a:hover {
  text-decoration: underline;
}
.reserve-btn-large {
  width: 100%;
  background: linear-gradient(135deg, #ac8d30 0%, #977b29 100%);
  color: white;
  border: none;
  
  border-radius: 50px;
  padding: 16px 24px;
  
  font-size: 1.1rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  
  box-shadow: 0 8px 20px #977b29;
  cursor: pointer;
  
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  position: relative;
  overflow: hidden;
}

.reserve-btn-large:hover {
  transform: translateY(-5px) scale(1.02);
  box-shadow: 0 15px 30px rgba(50, 76, 63, 0.35);
  background: linear-gradient(135deg,#977b29 0%,#c3a036 100%);
}

.reserve-btn-large:active {
  transform: scale(0.95);
  box-shadow: 0 5px 10px rgba(50, 76, 63, 0.2);
}
.reserve-btn-large::after {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  border-radius: 50px;
  box-shadow: 0 0 0 0 #c29e33;
  animation: pulse-green 2s infinite;
}

@keyframes pulse-green {
  0% { transform: scale(0.95); box-shadow: 0 0 0 0 #977b29; }
  70% { transform: scale(1); box-shadow: 0 0 0 10px #977b29; }
  100% { transform: scale(0.95); box-shadow: 0 0 0 0 #977b29; }
}

@media (max-width: 576px) {
  .item-title {
    font-size: 1.5rem;
  }
}
</style>

<style>

.leaflet-container {
  background-color: #f8f9fa !important;
}

.leaflet-tile {
  filter: none !important;
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

.popup-content {
  text-align: center;
  max-width: 270px;
}

.popup-img {
  width: 100%;
  height: 150px; 
  object-fit: cover;
  border-radius: 6px; 
  margin-bottom: 8px;
  display: block;
}

.popup-title {
  font-size: 1.1rem;
  margin-bottom: 5px;
  font-weight: 600;
  padding: 0 10px; 
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