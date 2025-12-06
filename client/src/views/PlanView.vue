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
import api from '@/services/api';

const plans = ref([]);

onMounted(async () => {
  try {
    const data = await api.getItemsByCategory('plans');
    plans.value = data;
  } catch (error) {
    console.error("Erreur lors du chargement des plans:", error);
  }
});

</script>

<style scoped>

.chatbot-icon {
  position: fixed;
  bottom: 20px;
  right: 20px;
  font-size: 28px;
  background-color: #ad9617;
  padding: 12px 14px;
  border-radius: 50%;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  text-decoration: none;
  color: black;
  z-index: 999;
}
.chatbot-icon:hover {
  background-color: #000000;
}
</style>