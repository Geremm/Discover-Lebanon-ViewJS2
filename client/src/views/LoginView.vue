<template>
  <section class="places-hero-login fade-in">
    <div class="login-box">
      <h1>Login</h1>
  
  
      <div class="login-page">
        <form @submit.prevent="onLogin">
          <input 
            v-model="email"
            type="email"
            placeholder="Email"
            required
          />

          <input 
            v-model="password"
            type="password"
            placeholder="Password"
            required
          />

          <router-link to="/register" class="qst">Don't have an account? <strong>Register.</strong>></router-link>

          <button type="submit">Login</button>
        </form>
      </div>
    </div>
            
    </section>
 
    <p v-if="error" class="error">{{ error }}</p>
</template>

<script setup>
import { ref } from "vue"
import { useRouter } from "vue-router"
import { login } from "@/store/auth"

const email = ref("")
const password = ref("")
const error = ref("")
const router = useRouter()
const API_URL = "http://localhost:3000"

const onLogin = async () => {
  error.value = ""

  try {
    const response = await fetch(`${API_URL}/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email.value,
        password: password.value
      })
    })
    const data = await response.json()

    if (!response.ok) {
      error.value = data.error || "Login failed"
      return
    }
    localStorage.setItem("token", data.token)
    localStorage.setItem("user", JSON.stringify(data.user))
    login(data.user)
    
    router.push("/")

  } catch (err) {
    error.value = "Cannot reach server"
  }
}
</script>

<style scoped>
  .error {color: red;margin-top: 10px;}

  .login-page{
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 30px;
    gap: 15px;
  }

  .qst{padding-bottom:5%; padding-top:10%}

  /* AJOUTEZ CE BLOC COMPLETMENT MANQUANT POUR QUE LE BOUTON SOIT BIEN STYLISÉ ET SANS OUTLINE */
.login-box input[type="submit"] {
  display: block; 
  width: 100%; 
  /* Le padding et la couleur sont gérés par la règle '.view-all-btn, .login-box [type="submit"]' */
  margin-top: 30px;
  border: none;
  border-radius: 8px; /* Pour un coin moins arrondi que le 30px de la règle générique */
  outline: none; /* Assurance anti-contour */
}

.login-box input[type="submit"]:hover {
  outline: none;
}

/* Le lien est déjà présent plus bas */
.login-box a {
  display: block;
  text-align: center;
  margin-top: 15px; 
  font-size: 0.95em;
  color: #FFD700;
  text-decoration: none; 
  transition: color 0.3s ease;
}

.login-box a:hover {
  color: #ffffff;
  text-decoration: underline;
}

/* Fin du bloc à ajouter */
</style>
