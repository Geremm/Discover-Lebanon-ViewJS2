<template>
  <div>
    <section class="places-hero fade-in">
      <h1>Explore the Most Iconic Places in Lebanon</h1>
      <p>From ancient ruins to breathtaking natural wonders, discover Lebanon’s top destinations.</p>
    </section>

    <nav class="places-nav">
      <a href="#beirut">Beirut</a>
      <a href="#north">North</a>
      <a href="#south">South</a>
      <a href="#bekaa">Bekaa</a>
    </nav>

    <div class="search-container">
      <input type="text" id= "searchInput" v-model="searchTerm" placeholder="Search places..." />
    </div>
    
    <div v-if="searchTerm && !Object.keys(placesByRegion).length" class="no-results">
      No results found.
    </div>

    <section v-for="(places, region) in placesByRegion" :key="region" :id="region" class="place-section">
      <h2>{{ regionTitles[region] }}</h2>
      <div class="destinations-grid">
        <ItemCard
          v-for="place in places"
          :key="place.id"
          :id="place.id"
          :category="place.category"
          :title="place.name"
          :description="place.shortDesc"
          :image="place.imageUrl"
        />
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import ItemCard from '@/components/ItemCard.vue';
import { allItems } from '@/data/database.js';

const allPlaces = allItems.filter(item => item.category === 'places');
// --- Données ---
// Plus tard, ces données viendront de votre API backend.
// const allPlaces = [
//   // Beirut
//   { id: 1, name: '📍 Raouche Rock', shortDesc: 'Iconic coastal landmark, perfect for sunset views.', imageUrl: '/images/raouche.jpg', region: 'beirut' },
//   { id: 2, name: '📍 Zeytuna Bay', shortDesc: 'A serene coastal destination for a tranquil escape.', imageUrl: '/images/zeytuna.jpeg', region: 'beirut' },
//   { id: 3, name: '📍 Beirut Souks', shortDesc: 'A signature shopping, hospitality, and entertainment place.', imageUrl: '/images/beirutsouks.jpeg', region: 'beirut' },
//   { id: 4, name: '📍 Beirut Downtown', shortDesc: 'A captivating blend of ancient history and modern life.', imageUrl: '/images/downtown.jpeg', region: 'beirut' },
//   { id: 5, name: '📍 National Museum', shortDesc: 'Home to an extraordinary collection of archaeological objects.', imageUrl: '/images/museum.webp', region: 'beirut' },
//   // North
//   { id: 6, name: '📍 Cedars of God', shortDesc: 'One of Lebanon’s oldest cedar forests, a UNESCO heritage site.', imageUrl: '/images/cedars.jpeg', region: 'north' },
//   { id: 7, name: '📍 Batroun', shortDesc: 'Charming coastal town with Phoenician walls and vibrant nightlife.', imageUrl: '/images/batroun.jpeg', region: 'north' },
//   { id: 8, name: '📍 Byblos', shortDesc: 'A very charming city distinguished for its ancient souks.', imageUrl: '/images/byblos.jpeg', region: 'north' },
//   { id: 9, name: '📍 Harissa Jounieh', shortDesc: 'A significant religious and cultural destination in Lebanon.', imageUrl: '/images/harrissa.jpeg', region: 'north' },
//   { id: 10, name: '📍 Jeita Grotto', shortDesc: 'Breathtaking UNESCO World Heritage site featuring stunning caves.', imageUrl: '/images/jeitta.jpeg', region: 'north' },
//   { id: 11, name: '📍 Beiteddine Palace', shortDesc: 'Stunning terraced gardens and orchards in the Chouf Mountains.', imageUrl: '/images/beiteddine.jpeg', region: 'north' },
//   // South
//   { id: 12, name: '📍 Tyre Ruins', shortDesc: 'Ancient Roman ruins with hippodrome and necropolis by the sea.', imageUrl: '/images/TyreRuins.jpeg', region: 'south' },
//   { id: 13, name: '📍 Sidon Sea Castle', shortDesc: 'Crusader fortress built on a small island connected by a bridge.', imageUrl: '/images/SidonSeaCastle.jpg', region: 'south' },
//   // Bekaa
//   { id: 14, name: '📍 Baalbek Temples', shortDesc: 'Massive Roman temples with grand columns in the heart of the Bekaa.', imageUrl: '/images/baalbek.jpg', region: 'bekaa' },
//   { id: 15, name: '📍 Anjar', shortDesc: 'Umayyad-era archaeological city featuring symmetrical design.', imageUrl: '/images/anjar.jpeg', region: 'bekaa' },
//   { id: 16, name: '📍 Ammiq', shortDesc: 'A pristine natural reserve nestled in the heart of Lebanon.', imageUrl: '/images/ammiq.jpeg', region: 'bekaa' },
//   { id: 17, name: '📍 Berdawni Zahle', shortDesc: 'Famous for its riverside cafés and the tastiest ice cream in Zahle.', imageUrl: '/images/zahle.jpeg', region: 'bekaa' },
// ];

// Titres pour chaque section de région
const regionTitles = {
  Beirut: '🌇 Beirut 🌇',
  North: '⛱️ North Lebanon ⛱️',
  South: '☀️ South Lebanon ☀️',
  Bekaa: '🌳 Bekaa Valley 🌳'
};

// --- Logique de recherche ---
const searchTerm = ref('');

// Propriété calculée qui filtre les lieux en fonction de la recherche
const filteredPlaces = computed(() => {
  if (!searchTerm.value) {
    return allPlaces;
  }
  return allPlaces.filter(place =>
    place.name.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
    place.shortDesc.toLowerCase().includes(searchTerm.value.toLowerCase())
  );
});

// Propriété calculée qui groupe les lieux filtrés par région
const placesByRegion = computed(() => {
  return filteredPlaces.value.reduce((acc, place) => {
    // Si la région n'existe pas encore dans l'accumulateur, on la crée
    if (!acc[place.subCategory]) {
      acc[place.subCategory] = [];
    }
    // On ajoute le lieu à la bonne région
    acc[place.subCategory].push(place);
    return acc;
  }, {});
});

console.log('Places by Region:');
console.log(placesByRegion.value);
</script>

<style scoped>
.no-results {
  text-align: center;
  font-size: 1.2em;
  color: #000000;
  margin-top: 20px;
}
</style>