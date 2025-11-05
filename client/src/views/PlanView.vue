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

import { ref } from 'vue';
import PlanCard from '@/components/PlanCard.vue';

// --- Données ---
const plans = ref([
  { 
    id: 1, 
    name: '📍Batroun Beach Day', 
    shortDesc: 'Enjoy the sun and waves with a full-day beach experience in Batroun.', 
    imageUrl: '/images/batroun.jpeg', 
    price: 25 
  },
  { 
    id: 2, 
    name: '📍Baalbek Temples Tour', 
    shortDesc: 'Explore the grandeur of Roman ruins and rich history in Baalbek.', 
    imageUrl: '/images/baalbek.jpg', 
    price: 18 
  },
  { 
    id: 3, 
    name: '📍Jounieh Téléférique Ride', 
    shortDesc: 'Ascend to Harissa via the iconic téléférique and enjoy breathtaking views.', 
    imageUrl: '/images/harrissa.jpeg', 
    price: 10 
  }
]);

</script>