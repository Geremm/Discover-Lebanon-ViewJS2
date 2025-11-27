<template>
  <div class="login-shell">

    <div class="login-card">
      <div class="login-left">

        <h1 class="brand">DISCOVER LEBANON</h1>

        <h2 class="headline">
          Start your journey with us.
        </h2>

        <form class="login-form" @submit.prevent="registerUser">
          <input type="text" v-model="name" placeholder="Name" required />

          <input type="email" v-model="email" placeholder="Email" required />
          <div class="password-wrapper">
            <input :type="showPasswords ? 'text' : 'password'" v-model="password" placeholder="Mot de passe" required />

            <span class="eye-icon" @click="togglePassword()">

              <svg v-if="showPasswords" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
                <line x1="3" y1="3" x2="21" y2="21"></line>
              </svg>

              <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>

            </span>
          </div>

          <button class="start-btn" type="submit">Create Account</button>
        </form>

        <p class="bottom-text">
          Already have an account?
          <router-link to="/login">Login</router-link>
        </p>

        <p v-if="errorMessage" class="error-msg">{{ errorMessage }}</p>
        <p v-if="successMessage" class="success-msg">{{ successMessage }}</p>

      </div>

      <div class="login-right">
        <img src="/images/zeytunaaaa.jpg" alt="Lebanon Landscape" class="login-img" />
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref } from "vue"

const name = ref("")
const email = ref("")
const password = ref("")
const errorMessage = ref("")
const successMessage = ref("")
const API_URL = "http://localhost:3000"

const showPasswords = ref(false)

// Fonction pour basculer la visibilité
const togglePassword = () => {
  showPasswords.value = !showPasswords.value;
};

const registerUser = async () => {
  errorMessage.value = ""
  successMessage.value = ""

  try {
    const res = await fetch(`${API_URL}/api/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: name.value,
        email: email.value,
        password: password.value
      })
    })

    const data = await res.json()

    if (!res.ok) {
      errorMessage.value = data.message || data.error || "Registration failed"
      return
    }

    successMessage.value = "Account created! You can now login."

    // Clear the form
    name.value = ""
    email.value = ""
    password.value = ""

  } catch (err) {
    errorMessage.value = "Server error"
    console.error(err)
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
  /* Make sure this path matches exactly where your image is stored */
  background-image: url('../assets/images/zeytunaaaa.jpg');
  background-position: center;
  background-size: cover;
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
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
  margin-top: 1.5%
}

/* LEFT SIDE */
.login-left {
  padding: 10px 60px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 90%;
}

.brand {
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 2px;
  font-weight: 700;
  color: #8fa195;
  margin-bottom: 10px;
}

.headline {
  font-size: 44px;
  line-height: 1.15;
  font-weight: 800;
  margin-bottom: 40px;
  color: #1a1a1a;
  letter-spacing: -1px;
}

/* INPUTS */
.login-form input {
  width: 100%;
  padding: 16px 18px;
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
  border-color: #324c3f;
}

/* BUTTON */
.start-btn {
  width: 100%;
  padding: 16px;
  border-radius: 14px;
  border: none;
  background: #324c3f;
  /* Dark Green */
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
  transform: translateY(-2px);
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
  text-align: center;
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

/* MESSAGES */
.error-msg {
  margin-top: 15px;
  color: #e74c3c;
  font-size: 14px;
  text-align: center;
}

.success-msg {
  margin-top: 15px;
  color: #27ae60;
  /* Green for success */
  font-size: 14px;
  text-align: center;
  font-weight: 600;
}

.password-wrapper {
  display: flex;
  align-items: center;
  /* Changement ici : Fond gris clair au lieu de blanc */
  background-color: #f9f9f9; 
  /* Changement ici : Bordure gris très pâle au lieu de foncé */
  border: 1px solid #e5e5e5; 
  /* Coins un peu plus arrondis pour matcher l'image */
  border-radius: 8px;        
  padding: 10px 12px;
  width: 100%;
  max-width: 430px;
  max-height: 52px;
  box-sizing: border-box;
  transition: all 0.2s;
}

/* Optionnel : Effet quand on clique dedans (Focus) */
.password-wrapper:focus-within {
  background-color: #fff;       /* Devient blanc quand on écrit (souvent utilisé) */
  border-color: #ccc;           /* La bordure fonce un peu */
}

/* Le reste ne change pas */
.password-wrapper input {
  border: none;
  outline: none;
  background: transparent;
  flex-grow: 1;
  font-size: 16px;
  color: #333;
  margin-right: 8px;
  margin-bottom: 0;
  margin-left: 0;
  padding-left: 0;
}

.password-wrapper input::placeholder {
  color: #6c757d; /* Couleur grise standard pour le placeholder */
}

.eye-icon {
  display: flex;
  cursor: pointer;
  color: #555; /* Icône un peu moins noire pour aller avec le gris */
}

/* L'icône (l'œil) */
.eye-icon {
  display: flex;
  cursor: pointer;
  color: #000;
  /* Couleur noire de l'icône */
  align-items: center;
  justify-content: center;
}

.eye-icon svg {
  width: 20px;
  height: 20px;
}

/* RESPONSIVE */
@media (max-width: 850px) {
  .login-card {
    grid-template-columns: 1fr;
    height: auto;
    min-height: 100vh;
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