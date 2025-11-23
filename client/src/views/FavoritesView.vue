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
import { ref, computed, onMounted } from 'vue'; // Import de ref et onMounted
import { useFavorites } from '@/store/favorites.js';
import ItemCard from '@/components/ItemCard.vue';
import api from '@/services/api.js'; // Import de l'API

const { favoriteSet } = useFavorites();
const allItems = ref([]); // On initialise avec un tableau vide
const loading = ref(true);

// Fonction pour charger tous les items depuis le serveur
const fetchAllItems = async () => {
  try {
    const data = await api.getAllItems();
    allItems.value = data;
  } catch (error) {
    console.error("Erreur chargement favoris:", error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchAllItems();
});

// Le calcul se fait maintenant sur la variable réactive allItems.value
const favoritedItems = computed(() => {
  return allItems.value.filter(item => favoriteSet.value.has(item.id));
});
</script>