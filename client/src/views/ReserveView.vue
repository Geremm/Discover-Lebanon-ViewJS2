<template>
  <div>
    <section class="places-hero fade-in">
      <h1>Complete Your Reservation</h1>
      <p>Fill in the details below to finalize your booking.</p>
    </section>

    <form class="reservation-form" @submit.prevent="handleReservation">
      <div>
        <label for="tripName">Trip Name:</label>
        <input type="text" id="tripName" v-model="tripName" readonly />
      </div>

      <div>
        <label for="date">Date:</label>
        <input type="date" id="date" v-model="reservationDate" required />
      </div>

      <div>
        <label for="name">Your Name:</label>
        <input type="text" id="name" v-model="customerName" placeholder="Enter your name" required />
      </div>

      <div>
        <label for="people">Number of People:</label>
        <input type="number" id="people" v-model="numPeople" min="1" required />
      </div>

      <div>
        <label>Total Price:</label>
        <div id="total-price">€{{ totalPrice }}</div>
      </div>

      <button id="reserveBtn" type="submit">Reserve</button>
      
      <div v-if="showSuccessMessage" class="toast2 show">Reservation confirmed!</div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from "@/services/api";

const route = useRoute();    
const router = useRouter();  

const productId = ref(null);
const tripName = ref('');
const basePrice = ref(0);
const reservationDate = ref('');
const customerName = ref('');
const numPeople = ref(1);
const showSuccessMessage = ref(false);


onMounted(() => {
  productId.value = route.query.id;
  tripName.value = route.query.trip || 'Trip not specified';
  basePrice.value = Number(route.query.price) || 0;
  
  const user = JSON.parse(localStorage.getItem('user'));
  if (user) {
    customerName.value = user.name;
  }
});

const totalPrice = computed(() => {
  return (basePrice.value * numPeople.value).toFixed(2);
});

async function handleReservation() {
  const user = JSON.parse(localStorage.getItem('user'));
  
  if (!user) {
    alert("Please log in to complete your reservation.");
    router.push('/login');
    return;
  }

  try {
    await api.createBooking({
        userId: user.id,
        productId: productId.value, 
        date: reservationDate.value,
        time: '09:00', 
        guests: numPeople.value,
        notes: `Custom Trip: ${tripName.value}` 
      });
      showSuccessMessage.value = true;
      setTimeout(() => {
        showSuccessMessage.value = false; 
        router.push('/account'); 
      }, 1500);
  } catch (err) {
    console.error("Server error:", err);
    alert("Reservation failed. Please try again later.");
  }
}
</script>
<style scoped>
    form {
      max-width: 600px;
      margin: 60px auto;
      display: flex;
      flex-direction: column;
      gap: 20px;
      background-color: white;
      padding: 40px;
      border-radius: 10px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
    label {
      font-weight: bold;
      color: black;
      margin-bottom: 6px;
      display: block;
      text-align: left;
    }
    input {
      padding: 12px;
      font-size: 1rem;
      border-radius: 6px;
      border: 1px solid #ccc;
      width: 100%;
    }
    #reserveBtn {
      padding: 12px;
      background-color: black;
      color: white;
      border: none;
      font-weight: bold;
      cursor: pointer;
      border-radius: 6px;
      margin-top: 10px;
    }
    #reserveBtn:hover {
      background-color: #333;
    }
    .toast2 {
      text-align: center;
      margin-top: 20px;
      font-weight: bold;
      color: green;
    }
    #total-price {
      font-size: 1.2rem;
      font-weight: bold;
      color: #222;
    }
  </style>