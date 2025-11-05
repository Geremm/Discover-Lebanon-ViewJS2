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
import ItemCard from '@/components/ItemCard.vue';

const topDestinations = [
  { id: 14, name: '📍 Baalbek Temples', shortDesc: 'Explore one of the world’s most impressive Roman ruins.', imageUrl: '/images/baalbek.jpg' },
  { id: 8, name: '📍 Byblos', shortDesc: 'Stroll through the ancient streets of one of the oldest cities.', imageUrl: '/images/byblos.jpeg' },
  { id: 6, name: '📍 Cedars of God', shortDesc: 'Breathe in the crisp mountain air among ancient cedar trees.', imageUrl: '/images/cedars.jpeg' }
];
</script>

<style scoped>



</style>