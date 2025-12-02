<template>
    <div class="booking-shell">
      <div v-if="item" class="booking-card">
        
        <div class="booking-visual" :style="{ backgroundImage: `url(${itemImage})` }">
          <div class="visual-overlay">
            <button class="back-btn" @click="$router.go(-1)">
              <i class="bi bi-arrow-left"></i> Back
            </button>
            <div class="visual-content">
              <span class="badge-category">{{ item.category || 'Experience' }}</span>
              <h1>{{ item.title }}</h1>
              <p class="visual-desc">
                <i class="bi bi-geo-alt-fill"></i> 
                <span v-if="isHotel">Book your stay at this beautiful location.</span>
                <span v-else>You are moments away from a great experience.</span>
              </p>
            </div>
          </div>
        </div>
  
        <div class="booking-form-side">
          <div class="form-header">
            <h2>{{ isHotel ? 'Book your Stay' : 'Complete Reservation' }}</h2>
            <p>Please enter your details to secure your spot.</p>
          </div>
  
          <form @submit.prevent="sendReservation" class="real-form">
            
            <div v-if="isHotel" class="input-row">
              <div class="input-group">
                <label>Check-in</label>
                <input 
                  type="date" 
                  v-model="resData.checkIn" 
                  :min="today" 
                  @change="handleCheckInChange" 
                  required 
                />
              </div>
              <div class="input-group">
                <label>Check-out</label>
                <input 
                  type="date" 
                  v-model="resData.checkOut" 
                  :min="minCheckOutDate" 
                  @change="calculateNights" 
                  required 
                  :disabled="!resData.checkIn" 
                />
              </div>
            </div>
  
            <div v-else class="input-row">
              <div class="input-group">
                <label>Date</label>
                <input type="date" v-model="resData.date" :min="today" required />
              </div>
              <div class="input-group">
                <label>Time</label>
                <input type="time" v-model="resData.time" required />
              </div>
            </div>
  
            <div class="input-group">
              <label>{{ isHotel ? 'Guests' : 'People' }}</label>
              <div class="guests-selector">
                <button type="button" @click="updateGuests(-1)">-</button>
                <span>{{ resData.guests }} {{ isHotel ? 'Guests' : 'People' }}</span>
                <button type="button" @click="updateGuests(1)">+</button>
              </div>
            </div>
  
            <div class="input-group">
              <label>Special Requests (Optional)</label>
              <textarea 
                v-model="resData.notes" 
                placeholder="Allergies, preferences, special occasion..." 
                rows="3"
              ></textarea>
            </div>
  
            <div class="summary-box">
              <div v-if="isHotel" class="summary-row">
                <span>Duration</span>
                <span class="fw-bold">{{ numberOfNights }} Night(s)</span>
              </div>
  
              <div class="summary-row">
                <span>Reservation Fee</span>
                <span>Free</span>
              </div>
              <div class="summary-row total">
                <span>Status</span>
                <span class="text-pending">Pending Confirmation</span>
              </div>
            </div>
  
            <button type="submit" class="btn-submit">
              Confirm {{ isHotel ? 'Booking' : 'Reservation' }}
            </button>
          </form>
        </div>
  
      </div>
      
      <div v-else class="loading-state">
        <div class="spinner-border text-success" role="status"></div>
        <span>Loading details...</span>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, computed } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import api from '@/services/api.js';
  
  const route = useRoute();
  const router = useRouter();
  const item = ref(null);
  const numberOfNights = ref(0);
  
  const today = new Date().toISOString().split('T')[0];
  
  const resData = ref({
    date: '',        
    time: '20:00',   
    checkIn: '',     
    checkOut: '',    
    guests: 2,
    notes: ''
  });
  
  const minCheckOutDate = computed(() => {
    if (!resData.value.checkIn) return today;
    
    const date = new Date(resData.value.checkIn);
    date.setDate(date.getDate() + 1);
    
    return date.toISOString().split('T')[0];
  });
  
  const isHotel = computed(() => {
    return item.value?.category === 'hotels';
  });
  
  const itemImage = computed(() => {
    if (!item.value) return '';
    return (item.value.carouselImages && item.value.carouselImages.length > 0)
      ? item.value.carouselImages[0]
      : item.value.imageUrl;
  });
  
  const updateGuests = (val) => {
    const newVal = resData.value.guests + val;
    if (newVal >= 1 && newVal <= 20) resData.value.guests = newVal;
  };
  
  const handleCheckInChange = () => {
    if (resData.value.checkOut && resData.value.checkOut <= resData.value.checkIn) {
      resData.value.checkOut = ''; 
      numberOfNights.value = 0;
    } else {
      calculateNights();
    }
  };
  
  const calculateNights = () => {
    if (resData.value.checkIn && resData.value.checkOut) {
      const start = new Date(resData.value.checkIn);
      const end = new Date(resData.value.checkOut);
      
      if (end <= start) {
        alert("Check-out must be after Check-in!");
        resData.value.checkOut = '';
        numberOfNights.value = 0;
        return;
      }
  
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
      numberOfNights.value = diffDays;
    }
  };
  
  onMounted(async () => {
    try {
      const data = await api.getItemById(route.params.id);
      item.value = data;
    } catch (e) {
      console.error("Error fetching item", e);
    }
  });
  
  const sendReservation = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      alert("Please log in to make a reservation.");
      router.push('/login');
      return;
    }
  
    if (isHotel.value) {
      if (!resData.value.checkIn || !resData.value.checkOut) {
        alert("Please select Check-in and Check-out dates.");
        return;
      }
    } else {
      if (!resData.value.date) {
        alert("Please select a date.");
        return;
      }
    }
  
    const payload = {
      userId: user.id,
      productId: item.value.id,
      guests: resData.value.guests,
      notes: resData.value.notes
    };
  
    if (isHotel.value) {
      payload.date = resData.value.checkIn;
      payload.time = "Check-in"; 
      payload.notes = `Check-out: ${resData.value.checkOut} (${numberOfNights.value} nights). ` + payload.notes;
    } else {
      payload.date = resData.value.date;
      payload.time = resData.value.time;
    }
  
    try {
      const res = await fetch('http://localhost:3000/api/reserve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
  
      if (res.ok) {
        router.push('/account');
      } else {
        alert("Booking failed. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("Server connection error.");
    }
  };
  </script>
  
  <style scoped>
  /* Main Page Background */
  .booking-shell {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f4f7f5;
    padding: 20px;
  }
  
  /* Card Container */
  .booking-card {
    background: white;
    width: 100%;
    max-width: 1000px;
    min-height: 600px;
    border-radius: 24px;
    overflow: hidden;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15);
    display: grid;
    grid-template-columns: 1.1fr 1fr;
  }
  
  /* Left Side (Visual) */
  .booking-visual {
    background-size: cover;
    background-position: center;
    position: relative;
    color: white;
  }
  
  .visual-overlay {
    background: linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.8));
    width: 100%;
    height: 100%;
    padding: 40px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  
  .back-btn {
    align-self: flex-start;
    background: rgba(255, 255, 255, 0.25);
    backdrop-filter: blur(4px);
    border: 1px solid rgba(255,255,255,0.3);
    color: white;
    padding: 8px 16px;
    border-radius: 20px;
    cursor: pointer;
    font-size: 14px;
    transition: 0.2s;
    display: flex;
    align-items: center;
    gap: 5px;
  }
  .back-btn:hover { background: rgba(255, 255, 255, 0.4); }
  
  .visual-content h1 {
    font-family: 'Playfair Display', serif;
    font-size: 3rem;
    line-height: 1.1;
    margin: 10px 0;
    text-shadow: 0 2px 10px rgba(0,0,0,0.3);
  }
  
  .badge-category {
    text-transform: uppercase;
    letter-spacing: 2px;
    font-size: 12px;
    font-weight: 700;
    background: #d4af37; 
    padding: 4px 10px;
    border-radius: 4px;
    color: #fff;
    display: inline-block;
  }
  
  .visual-desc { font-size: 1.1rem; opacity: 0.95; }
  
  /* Right Side (Form) */
  .booking-form-side {
    padding: 50px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  
  .form-header h2 { font-family: 'Playfair Display', serif; color: #977b29; margin-bottom: 5px; }
  .form-header p { color: #666; margin-bottom: 30px; font-size: 0.95rem; }
  
  .real-form { display: flex; flex-direction: column; gap: 20px; }
  
  .input-row { display: flex; gap: 20px; }
  .input-group { display: flex; flex-direction: column; gap: 8px; flex: 1; }
  
  .input-group label {
    font-size: 12px;
    font-weight: 700;
    color: #444;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  
  .input-group input, .input-group textarea {
    padding: 12px 15px;
    border-radius: 10px;
    border: 1px solid #e0e0e0;
    background: #fcfcfc;
    font-family: inherit;
    transition: 0.3s;
  }
  
  .input-group input:focus, .input-group textarea:focus {
    outline: none;
    border-color: #977b29;
    background: #fff;
    box-shadow: 0 0 0 4px rgba(50, 76, 63, 0.1);
  }
  
  /* Disabled state for Check-out until Check-in is picked */
  .input-group input:disabled {
    background-color: #eee;
    cursor: not-allowed;
  }
  
  .guests-selector {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border: 1px solid #e0e0e0;
    border-radius: 10px;
    padding: 5px;
    background: #fcfcfc;
  }
  .guests-selector button {
    width: 35px; height: 35px; border-radius: 8px; border: none; background: #eee; font-weight: bold; cursor: pointer; transition: 0.2s;
  }
  .guests-selector button:hover { background: #ddd; }
  .guests-selector span { font-weight: 600; color: #333; }
  
  .summary-box { background: #f4f7f5; padding: 15px; border-radius: 10px; margin-top: 10px; }
  .summary-row { display: flex; justify-content: space-between; font-size: 14px; color: #555; margin-bottom: 5px; }
  .summary-row.total { margin-top: 10px; padding-top: 10px; border-top: 1px dashed #ccc; font-weight: 700; color: #333; }
  .text-pending { color: #d35400; }
  .fw-bold { font-weight: 700; color: #324c3f; }
  
  .btn-submit {
    background-color: #b8962d; color: white; padding: 16px; border-radius: 12px; border: none; font-weight: 600; font-size: 16px; cursor: pointer; transition: 0.3s; margin-top: 10px;
  }
  .btn-submit:hover { background-color: #977b29; transform: translateY(-2px); box-shadow: 0 10px 20px #977b29; }
  
  .loading-state { display: flex; align-items: center; justify-content: center; height: 100vh; gap: 10px; font-size: 1.2rem; color: #666; }
  
  @media (max-width: 850px) {
    .booking-card { grid-template-columns: 1fr; height: auto; }
    .booking-visual { height: 250px; }
    .booking-form-side { padding: 30px; }
  }
  </style>