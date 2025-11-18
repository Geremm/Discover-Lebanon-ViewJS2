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
            <router-link to="/hotels">Luxury Hotels</router-link>
            <router-link to="/hotels">Boutique Hotels</router-link>
            <router-link to="/hotels">Budget Hotels</router-link>
          </div>
        </div>
        
      </div>
      <div class="dropdown">
        <router-link to="/restaurants" class="dropdown-toggle2">Restaurants ▾</router-link>
        <div class="mega-menu">
          <div class="mega-column">
            <h4>Style</h4>
            <router-link to="/restaurants">Lebanese</router-link>
            <router-link to="/restaurants">French</router-link>
            <router-link to="/restaurants">Italian</router-link>
            <router-link to="/restaurants">Fast foods</router-link>
          </div>
        </div>        
      </div>
      <div class="dropdown">
        <router-link to="/activities" class="dropdown-toggle2">Activities ▾</router-link>
        <div class="mega-menu">
          <div class="mega-column">
            <h4>Style</h4>
            <router-link to="/activities">Outdoors</router-link>
            <router-link to="/activities">Cultural</router-link>
          </div>
        </div>        
      </div>
      
      <router-link to="/plan-your-trip">Plan your trip</router-link>
      <router-link to="/about">About</router-link>
      <router-link to="/contact">Contact</router-link>
      <router-link to="/login">Login</router-link>
      <router-link to="/register">Register</router-link>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue';
const isMenuOpen = ref(false);
</script>
