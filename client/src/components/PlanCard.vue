<template>
    <div class="destination-card">
    <router-link :to="detailsLink" class="card-link">
      <img :src="image" :alt="title" />
      <div class="card-content">
        <p style="color: black; font-size: large; font-weight: bold; text-align: center;">{{ title }}</p>
        <p>{{ description }}</p>
        <div class="card-footer">
            <span class="price-footer">{{price}}</span>
            <router-link :to="detailsLink" class="learn-more">Reserve</router-link>
          </div>
      </div>
    </router-link>  
  </div>
</template>

<script setup>

import { computed } from 'vue';

const props = defineProps({
  id: Number,
  title: String,
  description: String,
  image: String,
  price: Number
});

const detailsLink = computed(() => {
  return {
    path: '/reserve',
    query: {
      trip: props.title,
      price: props.price
    }
  };
});
</script>

<style scoped>

.destination-card {
  width: 300px;
  border-radius: 12px;
  overflow: hidden;
  background: white;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.destination-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.2);
}


.destination-card.visible {
  opacity: 1;
  transform: translateY(0);
}


.destination-card img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.destination-card:hover img {
  transform: scale(1.05);
}


.destination-card h3 {
  margin: 20px 0 10px;
  font-size: 1.4em;
}

.destination-card p {
  padding: 0 15px 20px;
  font-size: 0.95em;
  color: #333;
}

.destination-card:hover .learn-more {
  display: inline-block;
  animation: fadeIn 0.4s ease;
}

.card-content {
  padding: 16px;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  padding: 0 1rem;
}

.price-footer {
  color: black;
  font-weight: bold;
  font-size: 1rem;
}


.learn-more {
  color: #D4AF37;
  font-weight: bold;
  text-decoration: none;
  font-size: 1rem;
  background: none;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 30px;
  transition: all 0.3s ease;
}
.learn-more:hover {
  background-color: #fff8e1;
  color: #000;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.learn-more {
margin-top: auto;
font-weight: bold;
color: #D4AF37;
display: inline-block;
text-align: center;
}

@media (max-width: 768px) {
  .destination-card {
  width: 100%;
  max-width: 90%;
  margin: auto;
  }

  .destination-card p {
  font-size: 0.9em;
  }

  .learn-more {
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  }
}
</style>