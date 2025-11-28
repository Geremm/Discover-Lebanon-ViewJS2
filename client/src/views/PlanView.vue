<template>
    <div>
        <section class="places-hero fade-in">
            <h1>Plan Your Trip</h1>
            <p>Choose one of our curated experiences and reserve now!</p>
        </section>

        <section class="place-section">
            <div class="destinations-grid">
                <PlanCard
                v-for="plan in plans"
                :key="plan.id"
                :id="plan.id"
                :title="plan.name"
                :description="plan.shortDesc"
                :image="plan.imageUrl"
                :price="plan.price"
                />
                <router-link to="/chatbot" class="chatbot-icon" title="Chat with us">💬</router-link>
            </div>
        </section>
    </div>
</template>

<style scoped>
</style>

<script setup>

import { ref, onMounted } from 'vue';
import PlanCard from '@/components/PlanCard.vue';

const plans = ref([]);

onMounted(async () => {
  try {
    const response = await fetch('http://localhost:3000/api/items?category=plans');
    const data = await response.json();
    plans.value = data;
  } catch (error) {
    console.error("Erreur lors du chargement des plans:", error);
  }
});

</script>