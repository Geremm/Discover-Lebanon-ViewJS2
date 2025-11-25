<template>
  <div>
    <section class="hero fade-in" >
      <img src="/images/raouche.jpg" alt="Raouché Rock" class="hero-bg" />
      <div class="hero-text">
        <h1 class="hero-title">The Gateway to Lebanon</h1>
        <router-link to="/places" class="hero-btn">Explore Now</router-link>
      </div>
    </section>

    <section id="next" class="next-section">
      <h2>Top Destinations</h2>
      <p class="section-intro">Discover the most iconic places to visit in Lebanon</p>
      <div class="destinations-grid">
        <ItemCard
          v-for="dest in topDestinations"
          :key="dest.id"
          :id="dest.id"
          :category="dest.category"
          :title="dest.name"
          :description="dest.shortDesc"
          :image="dest.imageUrl"
        />
      </div>
      <div class="view-all-container">
        <router-link to="/places" class="view-all-btn">View All Destinations</router-link>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '@/services/api.js'; 
import ItemCard from '@/components/ItemCard.vue';

const topDestinations = ref([]);

onMounted(async () => {
  try {
    const allItems = await api.getAllItems();

    const idsToShow = [14, 8, 6];

    topDestinations.value = allItems.filter(item => idsToShow.includes(item.id));
  } catch (error) {
    console.error("Erreur lors du chargement des Top Destinations:", error);
  }
});
</script>

<style scoped>



</style>