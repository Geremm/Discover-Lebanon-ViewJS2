<template>
  <header class="navbar-lebanon">
    <div class="nav-left">DISCOVER LEBANON</div>
    <div class="burger" @click="isMenuOpen = !isMenuOpen">&#9776;</div>
    <div class="nav-right nav-menu" :class="{ active: isMenuOpen }">
      <router-link to="/">Home</router-link>
      <div class="dropdown">
        <router-link to="/places" class="dropdown-toggle2">Places ▾</router-link>
        <div class="mega-menu">
          <div class="mega-column">
            <h4>Region</h4>
            <router-link to="/places#Beirut">Beirut</router-link>
            <router-link to="/places#North">North</router-link>
            <router-link to="/places#South">South</router-link>
            <router-link to="/places#Bekaa">Bekaa</router-link>
          </div>
        </div>
      </div>
      <div class="dropdown">
        <router-link to="/hotels" class="dropdown-toggle2">Hotels ▾</router-link>
        <div class="mega-menu">
          <div class="mega-column">
            <h4>Style</h4>
            <router-link to="/hotels#Luxury">Luxury Hotels</router-link>
            <router-link to="/hotels#Boutique">Boutique Hotels</router-link>
            <router-link to="/hotels#Budget">Budget Hotels</router-link>
          </div>
        </div>
        
      </div>
      <div class="dropdown">
        <router-link to="/restaurants" class="dropdown-toggle2">Restaurants ▾</router-link>
        <div class="mega-menu">
          <div class="mega-column">
            <h4>Style</h4>
            <router-link to="/restaurants#Lebanese">Lebanese</router-link>
            <router-link to="/restaurants#French">French</router-link>
            <router-link to="/restaurants#Italian">Italian</router-link>
            <router-link to="/restaurants#Fast">Fast foods</router-link>
          </div>
        </div>        
      </div>
      <div class="dropdown">
        <router-link to="/activities" class="dropdown-toggle2">Activities ▾</router-link>
        <div class="mega-menu">
          <div class="mega-column">
            <h4>Style</h4>
            <router-link to="/activities#Outdoor">Outdoors</router-link>
            <router-link to="/activities#Cultural">Cultural</router-link>
          </div>
        </div>        
      </div>
      
      <router-link to="/plan-your-trip">Plan your trip</router-link>
      <router-link to="/about">About</router-link>
      <router-link to="/contact">Contact</router-link>
      <router-link v-if="!isLoggedIn" to="/login">Login</router-link>
      <router-link v-else to="/account">My Account</router-link>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { isLoggedIn, user } from "@/store/auth"
const isMenuOpen = ref(false);
const route = useRoute();

const InMyAccount = ref(false)

onMounted(() => {
  const token = localStorage.getItem("token")
  const userData = localStorage.getItem("user")
  InMyAccount.value = route.meta.showLogout === true;

  if (token && userData) {
    isLoggedIn.value = true
    user.value = JSON.parse(userData)
  }else {
    isLoggedIn.value = false
    user.value = null
  }
})

watch(() => route.meta, (newMeta) => {
  InMyAccount.value = newMeta.showLogout === true;
});

</script>

<style scoped>

.navbar-lebanon {
  position: fixed;
  width: 100%;
  padding: 25px 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 3;
  
}


.nav-left {
  
  font-weight: bold;
  font-size: 1em;
  letter-spacing: 1px;
  color: rgb(255, 255, 255); 
}

.nav-right a {

  margin-left: 24px;
  text-decoration: none;
  color: white; 
  font-size: 0.95em;
  font-weight: 500;
  transition: 0.2s ease;
}

.nav-right a:hover {
  color: #FFD700;
}


.nav-right a:hover {
  color: #FFD700;
}


@keyframes slightZoom {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

.scroll-down {
  position: absolute;
  bottom: 30px;
  width: 100%;
  display: flex;
  justify-content: center;
  z-index: 2;
}

.arrow {
  font-size: 2em;
  color: white;
  animation: bounce 2s infinite;
  transition: 0.3s ease;
  display: none;
}

.arrow:hover {
  color: #FFD700;
  transform: scale(1.1);
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(10px);
  }
  60% {
    transform: translateY(5px);
  }
}

.dropdown {
  position: relative;
  display: inline-block;
}

.dropdown > a {
  color: white;
  font-weight: 500;
  text-decoration: none;
  padding: 10px 12px;
  transition: color 0.3s ease;
  position: relative;
}

.dropdown-toggle2{
  text-align: center;
}

.dropdown > a:hover {
  color: #FFD700;
}

.mega-menu {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%) translateY(20px);
  background: #ffffff;
  border: 1px solid #eee;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  padding: 24px 32px;
  display: inline-flex;
  gap: 48px;
  min-width: 200px;
  width: fit-content;
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  transition: all 0.3s ease;
  z-index: 999;
}


.dropdown:hover .mega-menu,
.dropdown.open .mega-menu {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
  pointer-events: auto;
}


.mega-column {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.mega-column h4 {
  margin-bottom: 8px;
  font-size: 1rem;
  font-weight: 600;
  color: #333;
}

.mega-column a {
  font-size: 0.95rem;
  color: #444;
  text-decoration: none;
  transition: color 0.2s ease;
}

.mega-column a:hover {
  color: #D4AF37;
}

.burger {
  display: none;
  font-size: 2rem;
  cursor: pointer;
  color: white;
  padding: 10px 20px;
}

@media (max-width: 768px) {
  .burger {
    display: block;
  }

  .nav-menu {
    display: none;
    flex-direction: column;
    background: white;
    width: 100%;
    position: absolute;
    top: 70px;
    left: 0;
    z-index: 999;
    padding: 20px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  }

  .nav-menu.active {
    display: flex;
  }

  .nav-menu a,
  .dropdown > a {
    color: #333 !important;
    padding: 10px 0;
  }

  .dropdown {
    width: 100%;
  }
}

</style>
