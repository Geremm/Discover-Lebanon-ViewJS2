<template>
  <div>
    <section class="places-hero fade-in">
      <h1>{{ pageTitle }}</h1>
      <p>{{ pageDescription }}</p>
    </section>

    <nav class="places-nav">
      <a v-for="(items, subCategory) in itemsBySubCategory" :key="subCategory" :href="`#${subCategory}`">
        {{subCategory }}
      </a>
    </nav>

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
import { computed } from 'vue';
import { allItems } from '@/data/database.js';
import ItemCard from '@/components/ItemCard.vue';

const props = defineProps({
  category: String
});

// --- Titres et descriptions de la page ---
const titles = { hotels: 'Our Finest Hotels', restaurants: 'A Taste of Lebanon', activities: 'Unforgettable Activities' };
const descriptions = { hotels: 'Find your perfect stay.', restaurants: 'Explore rich flavors.', activities: 'Experience the best adventures.' };

const pageTitle = computed(() => titles[props.category] || 'Discover');
const pageDescription = computed(() => descriptions[props.category] || 'Explore our selections.');

// --- Titres pour les sections de sous-catégories ---
const subCategoryTitles = {
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

  // ... ajoutez d'autres titres si nécessaire
};

// --- Logique de regroupement ---
const itemsBySubCategory = computed(() => {
  // 1. D'abord, on filtre pour n'avoir que les items de la catégorie actuelle (ex: 'hotels')
  const itemsForCategory = allItems.filter(item => item.category === props.category);

  // 2. Ensuite, on utilise la même logique "reduce" que pour les régions, mais avec "subCategory"
  return itemsForCategory.reduce((acc, item) => {
    const key = item.subCategory;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(item);
    return acc;
  }, {});
});
</script>

<style scoped>

</style>