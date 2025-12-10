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
      <div v-if="loading">Loading...</div>
      <p v-else>You have no favorites yet.</p>
    </section>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useFavorites } from '@/store/favorites.js';
import ItemCard from '@/components/ItemCard.vue';

const { favoriteItems } = useFavorites();

const favoritedItems = computed(() => favoriteItems.value || []);
</script>
