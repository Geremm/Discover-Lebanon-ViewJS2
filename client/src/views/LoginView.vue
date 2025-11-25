<template>
  <div class="login-shell">

    <div class="login-card">
      <div class="login-left">

        <h1 class="brand">DISCOVER LEBANON</h1>

        <h2 class="headline">
          Uncover the hidden gems of Lebanon.
        </h2>

        <form class="login-form" @submit.prevent="onLogin">
          <input type="email" v-model="email" placeholder="Email" required />
          <input type="password" v-model="password" placeholder="Password" required />

          <button class="start-btn" type="submit">Login</button>
        </form>

        <p class="bottom-text">
          Don't have an account?
          <router-link to="/register">Create one</router-link>
        </p>

        <p v-if="error" class="error-msg">{{ error }}</p>

      </div>

      <div class="login-right">
        <img src="/images/zeytunaaaa.jpg" alt="Lebanon Landscape" class="login-img" />
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref } from "vue"
import { useRouter } from "vue-router"
import { login } from "@/store/auth"
import { useFavorites } from '@/store/favorites';
const { initFavorites } = useFavorites();

const email = ref("")
const password = ref("")
const error = ref("")
const API_URL = "http://localhost:3000"
const router = useRouter()

const onLogin = async () => {
  error.value = ""

  try {
    const res = await fetch(`${API_URL}/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.value, password: password.value })
    })

    const data = await res.json()

    if (!res.ok) {
      error.value = data.error || "Login failed"
      return
    }

    localStorage.setItem("token", data.token)
    localStorage.setItem("user", JSON.stringify(data.user))
    login(data.user)

    const user = JSON.parse(localStorage.getItem('user')); 
    initFavorites(user);
    router.push("/")

  } catch {
    error.value = "Server unreachable"
  }
}
</script>

<style scoped>
/* MAIN WRAPPER */
.login-shell {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;   
  align-items: center;
  /* Assurez-vous que le chemin de l'image est correct */
  background-image: url('../assets/images/zeytunaaaa.jpg'); 
  background-position: center;
  background-size: cover;

  
  /* IMPORTANT : Pour que le background prenne tout l'écran même avec le padding */
  box-sizing: border-box;
}

/* CARD */
.login-card {
  background: white;
  width: 100%;
  max-width: 1100px;
  height: 600px;
  border-radius: 30px;
  overflow: hidden;
  display: grid;
  grid-template-columns: 1fr 1fr;
  box-shadow: 0 20px 40px rgba(0,0,0,0.12);
  margin-top: 1.5%
}

/* LEFT SIDE - Centrage vertical amélioré */
.login-left {
  padding: 10px 60px; /* Un peu plus de padding sur les côtés */
  display: flex;
  flex-direction: column;
  justify-content: center; /* Centre tout verticalement */
  height: 90%;
}

.brand {
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 2px; /* Espacement des lettres pour un look "Premium" */
  font-weight: 700;
  color: #8fa195; /* Un gris-vert subtil */
  margin-bottom: 10px;
}

/* NOUVEAU : Style du séparateur (le cèdre) */
.graphic-separator {
  margin-bottom: 20px;
  color: #324c3f; /* Même vert que le bouton */
  display: flex;
  justify-content: flex-start;
  font-size: 40px; /* Taille des emojis */
}

/* Amélioration de la typographie du titre */
.headline {
  font-size: 44px; /* Plus grand pour combler le vide */
  line-height: 1.15;
  font-weight: 800;
  margin-bottom: 40px; /* Marge augmentée pour aérer avant le formulaire */
  color: #1a1a1a;
  letter-spacing: -1px;
}

/* INPUTS */
.login-form input {
  width: 100%;
  padding: 16px 18px; /* Inputs un peu plus hauts */
  border-radius: 12px;
  border: 1px solid #e0e0e0;
  background: #f9f9f9;
  margin-bottom: 15px;
  font-size: 15px;
  transition: all 0.3s ease;
}

.login-form input:focus {
  outline: none;
  background: #fff;
  border-color: #324c3f; /* Focus vert au lieu de doré pour la cohérence */
  box-shadow: 0 0 0 4px rgba(50, 76, 63, 0.1);
}

/* BUTTON */
.start-btn {
  width: 100%;
  padding: 16px;
  border-radius: 14px;
  border: none;
  background: #324c3f; /* Vert foncé */
  color: white;
  font-weight: 600;
  font-size: 16px;
  margin-top: 10px;
  cursor: pointer;
  transition: 0.3s;
  letter-spacing: 0.5px;
}

.start-btn:hover {
  background: #25392f;
  transform: translateY(-2px); /* Petit effet de levier */
  box-shadow: 0 10px 20px rgba(37, 57, 47, 0.15);
}

/* RIGHT IMAGE */
.login-right {
  position: relative;
  width: 100%;
  height: 100%;
}

.login-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* BOTTOM TEXT */
.bottom-text {
  margin-top: 30px;
  font-size: 14px;
  color: #666;
  text-align: center; /* Centré pour l'équilibre */
}

.bottom-text a {
  color: #324c3f;
  font-weight: 700;
  text-decoration: none;
  border-bottom: 1px solid transparent;
  transition: border-color 0.3s;
}

.bottom-text a:hover {
  border-bottom-color: #324c3f;
}

/* ERROR */
.error-msg {
  margin-top: 15px;
  color: #e74c3c;
  font-size: 14px;
  text-align: center;
}

/* RESPONSIVE */
@media (max-width: 850px) {
  .login-card {
    grid-template-columns: 1fr;
    height: auto;
    min-height: 100vh; /* Prend tout l'écran sur mobile */
    border-radius: 0;
  }
  .login-right {
    display: none;
  }
  .login-left {
    padding: 40px 30px;
  }
  .headline {
    font-size: 32px;
  }
}
</style>