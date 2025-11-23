<template>
  <div>
    <section :class="['places-hero', 'fade-in', dynamicClass]">
      <h1>{{ pageTitle }}</h1>
      <p>{{ pageDescription }}</p>
    </section>

    <nav class="places-nav">
      <a v-for="(items, subCategory) in itemsBySubCategory" :key="subCategory" :href="`#${subCategory}`">
        {{subCategory }}
      </a>
    </nav>

    <div class="search-container">
      <input type="text" id= "searchInput" v-model="searchTerm" placeholder="Search ..." />
    </div>
    
    <div v-if="searchTerm && !Object.keys(itemsBySubCategory).length" class="no-results">
      No results found.
    </div>

    <div id="toast2" class="toast2"></div>

    <section v-for="(items, subCategory) in itemsBySubCategory" :key="subCategory" :id="subCategory" class="place-section">
      <h2>{{ subCategoryTitles[subCategory]}}</h2>
      <div class="destinations-grid">
        <ItemCard
          v-for="item in items"
          :key="item.id"
          :id="item.id"
          :category="item.category"
          :title="item.name"
          :description="item.shortDesc"
          :image="item.imageUrl"
        />
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import ItemCard from '@/components/ItemCard.vue';
import api from '@/services/api.js';

const items = ref([]);
const loading = ref(true);


const props = defineProps({
  category: String
});

const allItems = async () => {
  loading.value = true;
  
  try {
    const data = await api.getItemsByCategory(props.category);
    items.value = data; 

  } catch (error) {
    console.error("Erreur chargement:", error);
  } finally {
    loading.value = false;
  }
};


const titles = {places:"Explore the Most Iconic Places in Lebanon", hotels: 'Our Finest Hotels', restaurants: 'A Taste of Lebanon', activities: 'Unforgettable Activities' };
const descriptions = {places:"From ancient ruins to breathtaking natural wonders, discover Lebanon’s top destinations." , hotels: 'Find your perfect stay.', restaurants: 'Explore rich flavors.', activities: 'Experience the best adventures.' };
const classes = {favorites:"favorites-hero", hotels: 'hotels-hero', restaurants: 'restaurants-hero', activities: 'activities-hero' };

const pageTitle = computed(() => titles[props.category] || 'Discover');
const pageDescription = computed(() => descriptions[props.category] || 'Explore our selections.');
const dynamicClass = computed(() => {return classes[props.category] || ""; });

const subCategoryTitles = {
  Beirut: '🌇 Beirut 🌇',
  North: '⛱️ North Lebanon ⛱️',
  South: '☀️ South Lebanon ☀️',
  Bekaa: '🌳 Bekaa Valley 🌳',
  Luxury: 'Luxury Hotels',
  Boutique: 'Boutique Hotels',
  Budget: 'Budget Hotels',
  Lebanese: '🇱🇧 Lebanese 🇱🇧',
  French: '🇫🇷 French 🇫🇷',
  Italian: '🇮🇹 Italian 🇮🇹',
  Street: '🧆 Street Food 🧆',
  Fast: '🍔 Fast Food 🍔',
  Outdoor: '🌲 Outdoor Activities 🌲',
  Cultural: '🏛️ Cultural Experiences 🏛️',

};

const searchTerm = ref('');


const filteredItems = computed(() => {
  if (!searchTerm.value) return items.value;
  
  return items.value.filter(item => 
    item.name.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
    item.shortDesc.toLowerCase().includes(searchTerm.value.toLowerCase())
  );
});


const itemsBySubCategory = computed(() => {
  
  const itemsForCategory = filteredItems.value.filter(item => item.category === props.category);

  return itemsForCategory.reduce((acc, item) => {
    const key = item.subCategory;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(item);
    return acc;
  }, {});
});

onMounted(() => {
  allItems();
});

watch(() => props.category, () => {
  allItems();
});


console.log(itemsBySubCategory.value);
</script>

<style scoped>
.no-results {
  text-align: center;
  font-size: 1.2em;
  color: #000000;
  margin-top: 20px;
}
</style>