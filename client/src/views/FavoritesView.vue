<template>
  <div>
    <section class="places-hero">
      <h1>Your Favorites</h1>
      <p>Here are all the places you've saved.</p>
    </section>

    <section v-if="favoritedItems.length > 0" class="place-section">
      <div class="destinations-grid">
        <ItemCard
          v-for="item in favoritedItems"
          :key="item.id"
          :id="item.id"
          :category="item.category"
          :title="item.name"
          :description="item.shortDesc"
          :image="item.imageUrl"
        />
      </div>
    </section>

    <section v-else class="place-section">
      <p>You have no favorites yet.</p>
    </section>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useFavorites } from '@/store/favorites.js';
import { allItems } from '@/data/database.js';
import ItemCard from '@/components/ItemCard.vue';

const { favoriteSet } = useFavorites();

// On filtre la base de données entière pour ne garder que les favoris
const favoritedItems = computed(() => {
  return allItems.filter(item => favoriteSet.value.has(item.id));
});
</script>