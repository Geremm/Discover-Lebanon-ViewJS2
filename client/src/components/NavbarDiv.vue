<template>
  <header class="navbar-lebanon">
    <div class="nav-left">DISCOVER LEBANON</div>
    <div class="burger" :class="{ blackburger: isMenuOpen }" @click="isMenuOpen = !isMenuOpen" v-html="'&#9776;'"></div>
    <div class="nav-right nav-menu" :class="{ active: isMenuOpen }">
      <router-link to="/" @click="isMenuOpen = false">Home</router-link>
      <div class="dropdown">
        <router-link to="/places" class="dropdown-toggle2">Places ▾</router-link>
        <div class="mega-menu">
          <div class="mega-column">
            <h4>Region</h4>
            <router-link to="/places#Beirut" @click="isMenuOpen = false">Beirut</router-link>
            <router-link to="/places#North" @click="isMenuOpen = false">North</router-link>
            <router-link to="/places#South" @click="isMenuOpen = false">South</router-link>
            <router-link to="/places#Bekaa" @click="isMenuOpen = false">Bekaa</router-link>
          </div>
        </div>
      </div>
      <div class="dropdown">
        <router-link to="/hotels" class="dropdown-toggle2">Hotels ▾</router-link>
        <div class="mega-menu">
          <div class="mega-column">
            <h4>Style</h4>
            <router-link to="/hotels#Luxury" @click="isMenuOpen = false">Luxury Hotels</router-link>
            <router-link to="/hotels#Boutique" @click="isMenuOpen = false">Boutique Hotels</router-link>
            <router-link to="/hotels#Budget" @click="isMenuOpen = false">Budget Hotels</router-link>
          </div>
        </div>
        
      </div>
      <div class="dropdown">
        <router-link to="/restaurants" class="dropdown-toggle2">Restaurants ▾</router-link>
        <div class="mega-menu">
          <div class="mega-column">
            <h4>Style</h4>
            <router-link to="/restaurants#Lebanese" @click="isMenuOpen = false">Lebanese</router-link>
            <router-link to="/restaurants#French" @click="isMenuOpen = false">French</router-link>
            <router-link to="/restaurants#Italian" @click="isMenuOpen = false">Italian</router-link>
            <router-link to="/restaurants#Fast" @click="isMenuOpen = false">Fast foods</router-link>
          </div>
        </div>        
      </div>
      <div class="dropdown">
        <router-link to="/activities" class="dropdown-toggle2">Activities ▾</router-link>
        <div class="mega-menu">
          <div class="mega-column">
            <h4>Style</h4>
            <router-link to="/activities#Outdoor" @click="isMenuOpen = false">Outdoors</router-link>
            <router-link to="/activities#Cultural" @click="isMenuOpen = false">Cultural</router-link>
          </div>
        </div>        
      </div>
      
      <router-link to="/plan-your-trip" @click="isMenuOpen = false">Plan your trip</router-link>
      <router-link to="/about" @click="isMenuOpen = false">About</router-link>
      <router-link to="/contact" @click="isMenuOpen = false">Contact</router-link>
      <router-link v-if="!isLoggedIn" to="/login" @click="isMenuOpen = false">Login</router-link>
      <router-link v-else to="/account" @click="isMenuOpen = false">My Account</router-link>
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

.navbar-reservation {
    background-color: rgb(184, 150, 45) !important;
      padding: 1rem 1.5rem !important;
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

@media (max-width: 992px) {
  .blackburger{
    color: black;
  } /* J'ai augmenté à 992px pour inclure les tablettes */
  
  /* 1. Ajustement de la barre principale */
  .navbar-lebanon {
    padding: 6px 20px;
    background-color: rgba(0, 0, 0, 0.9); /* Fond sombre nécessaire sur mobile */
    z-index: 1000;
  }

  .burger {
    display: block;
    z-index: 1001; /* Doit être au-dessus du menu */
  }

  /* 2. Le conteneur du menu mobile */
  .nav-menu {
    position: fixed;
    top: 0;
    right: 0;
    width: 100%; /* Pleine largeur ou max-width: 300px pour un panneau latéral */
    height: 100vh;
    background: white;
    flex-direction: column;
    justify-content: flex-start;
    padding-top: 80px; /* Espace pour ne pas cacher le haut sous la navbar */
    padding-left: 20px;
    padding-right: 20px;
    
    /* Animation de glissement */
    transform: translateX(100%);
    transition: transform 0.3s ease-in-out;
    display: flex;
    overflow-y: auto; /* Permet de scroller si le menu est trop long */
    box-shadow: none;
  }

  /* État ouvert */
  .nav-menu.active {
    transform: translateX(0);
  }

  /* 3. Liens principaux */
  .nav-right a, 
  .dropdown > a {
    margin-left: 0;
    padding: 15px 0;
    display: block;
    color: #333 !important; /* Texte sombre sur fond blanc */
    font-size: 1.1rem;
    border-bottom: 1px solid #f0f0f0;
    width: 100%;
    text-align: left;
  }

  /* 4. Gestion du Dropdown et Mega Menu sur Mobile */
  .dropdown {
    width: 100%;
    display: block;
  }

  /* Réinitialisation complète du Mega Menu pour mobile */
  .mega-menu {
    position: static; /* Crucial : remet le menu dans le flux normal */
    transform: none;
    opacity: 1;
    visibility: visible;
    width: 100%;
    min-width: auto;
    border: none;
    box-shadow: none;
    border-radius: 0;
    padding: 0 0 0 20px; /* Indentation pour la hiérarchie */
    background-color: #f9f9f9; /* Fond légèrement gris pour différencier */
    display: none; /* Caché par défaut */
    gap: 0;
  }

  /* Affichage du sous-menu au survol/clic (comportement tactile) */
  .dropdown:hover .mega-menu,
  .dropdown:focus-within .mega-menu {
    display: block;
  }

  /* Style des colonnes et liens internes */
  .mega-column {
    width: 100%;
    padding: 10px 0;
  }

  .mega-column h4 {
    color: #b8962d; /* Couleur dorée pour les titres de section */
    margin-top: 10px;
  }

  .mega-column a {
    font-size: 0.9rem;
    padding: 8px 0;
    border-bottom: none;
    color: #666 !important;
  }
}

</style>
