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
      
      <div v-if="showSuccessMessage" class="toast show">Reservation confirmed!</div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

// --- Initialisation ---
const route = useRoute();    // Pour lire les paramètres de l'URL
const router = useRouter();  // Pour naviguer vers une autre page

// --- État réactif du formulaire ---
const tripName = ref('');
const basePrice = ref(0);
const reservationDate = ref('');
const customerName = ref('');
const numPeople = ref(1);
const showSuccessMessage = ref(false);

// --- Logique ---

// Quand le composant est monté, on récupère les infos de l'URL
onMounted(() => {
  tripName.value = route.query.trip || 'Trip not specified';
  basePrice.value = Number(route.query.price) || 0;
});

// Propriété calculée pour le prix total. Elle se met à jour
// automatiquement dès que `numPeople` change.
const totalPrice = computed(() => {
  return (basePrice.value * numPeople.value).toFixed(2);
});

// Fonction appelée lors de la soumission du formulaire
function handleReservation() {
  console.log('Reservation submitted:', {
    trip: tripName.value,
    date: reservationDate.value,
    name: customerName.value,
    people: numPeople.value,
    total: totalPrice.value,
  });

  // Affiche le message de succès
  showSuccessMessage.value = true;

  // Redirige vers la page d'accueil après 2 secondes
  setTimeout(() => {
    showSuccessMessage.value = false; // Cache le message
    router.push('/plan-your-trip'); // Utilise le routeur pour changer de page
  }, 2000);
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
    .toast {
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