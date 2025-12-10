<template>
  <div>
    <div v-if="!place">
      <p>Place not found.</p>
    </div>
    <div v-else>
      <section class="baalbek-hero">
        <div class="baalbek-overlay"></div>
        <div class="baalbek-text fade-in-up" id="baalbekText">
          <h1 class="hero-title">{{ place.title }}</h1>
          <p>{{ place.longDesc }}</p>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import api from '@/services/api.js';

const route = useRoute();
const place = ref(null); 

const loadItem = async () => {
  const id = route.params.id;
  try {
    const data = await api.getItemById(id);
    place.value = data;
    
    updateBodyBackground();
  } catch (error) {
    console.error("Erreur lors du chargement du lieu:", error);
  }
};

function updateBodyBackground() {
  if (place.value) {
    document.body.style.backgroundImage = `url(${place.value.imageUrl})`;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';
    document.body.style.backgroundAttachment = 'fixed';
  }
}

onMounted(() => {
  loadItem();
});

watch(() => route.params.id, () => {
  loadItem();
});

onUnmounted(() => {
  document.body.style.backgroundImage = '';
  document.body.style.backgroundSize = '';
  document.body.style.backgroundPosition = '';
  document.body.style.backgroundAttachment = '';
});
</script>

<style scoped>
.baalbek-hero {
  position: relative;
  width: 100%;
  height: 90vh;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: white;
}

.baalbek-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 50%;
  height: 50%;
  display: none;
  z-index: 1;
}

.baalbek-text {
  position: relative;
  z-index: 2;
  width: 50%;
  left: -0%;
  padding: 40px;
  font-size: 1.2rem;
  font-family: 'Inter', sans-serif;
  background: rgba(0, 0, 0, 0.5);
  line-height: 1.8;
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2.2em;
  }
  .baalbek-text{
    width: 100%;
    padding: 20px;
    padding-top: 30%;
  }
}
</style>