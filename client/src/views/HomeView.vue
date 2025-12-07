<template>
  <div>
    <section class="hero fade-in" >
      <img src="/images/raouche.jpg" loading="lazy" alt="Raouché Rock" class="hero-bg" />
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

.next-section {
  margin-top: 4%;
  background: white;
  color: black;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
  z-index: 4;
  position: relative;
  max-height: 100%;
}

.next-section h2 {
  font-size: 2.5em;
  margin-bottom: 20px;
  font-family: 'Playfair Display', serif;
}

.next-section p {
  font-size: 1.2em;
  max-width: 600px;
}

.section-intro {
  font-size: 1.05rem;
  color: #666;
  max-width: 700px;
  margin: 0 auto 40px;
}

.view-all-container {
  margin-top: 40px;
  display: flex;
  justify-content: center;
}

.view-all-btn, .login-box button {
  padding: 14px 36px;
  background: linear-gradient(to right, #FFD700, #D4AF37);
  color: black;
  font-size: 1em;
  font-weight: bold;
  border-radius: 30px;
  text-decoration: none;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  transition: 0.3s ease;
  margin-bottom: 10%;
  min-width: 60%;
}

.view-all-btn:hover, .login-box button:hover {
  background: linear-gradient(to right, #FFF176, #FFD700);
  transform: scale(1.05);
  cursor: pointer;
}

.hero {
  height: 100vh; /* try 60vh or 70vh */
  /*background: url('../images/about-hero.jpg') center/cover no-repeat;*/
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}


.hero-bg {
  position: absolute;
  width: 120%;
  height: 120%;
  top: -10%;
  left: -10%;
  object-fit: cover;
  z-index: 0;
  animation: slightZoom 10s ease-in-out infinite;
}

.hero-overlay {
  background: rgba(0, 0, 0, 0.4);
  width: 100%;
  height: 100%;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 30px;
}


.hero-text {
  position: relative;
  z-index: 2;
  text-align: center;
  color: white;
  padding: 0 20px;
}


.hero-subtitle {
  text-transform: uppercase;
  font-size: 0.9em;
  color: #bbbbbb;
  margin-bottom: 10px;
  letter-spacing: 2px;
}

.hero-title {
  font-family: 'Playfair Display', serif;
  font-size: 3.8em;
  font-weight: 700;
  margin-bottom: 30px;
  line-height: 1.2;
  text-shadow: 2px 2px 6px rgba(0, 0, 0, 0.4); 
}

.hero-btn {
  text-decoration: none;
  padding: 14px 30px;
  background-color: white;
  color: black;
  font-weight: bold;
  font-size: 1em;
  letter-spacing: 1px;
  transition: 0.3s ease;
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
}

.hero-btn:hover {
  background-color: #FFD700;
  color: black;
  transform: scale(1.05);
}

</style>