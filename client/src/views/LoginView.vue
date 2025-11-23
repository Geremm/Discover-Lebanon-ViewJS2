<template>
  <div class="login-shell">

    <div class="login-card">
      <div class="login-left">

        <h1 class="brand">DISCOVER LEBANON</h1>

        <h2 class="headline">
          Start your Perfect Trip
        </h2>

        <!-- Social buttons -->
        <div class="social-row">
          <button class="social-btn"><span></span></button>
          <button class="social-btn google"><span>G</span></button>
          <button class="social-btn"><span>F</span></button>
        </div>


        <form class="login-form" @submit.prevent="onLogin">
          <input type="email" v-model="email" placeholder="Email" required />
          <input type="password" v-model="password" placeholder="Password" required />

          <button class="start-btn" type="submit">Start</button>
        </form>

        <p class="bottom-text">
          Don't have an account?
          <router-link to="/register">Create one</router-link>
        </p>

        <p v-if="error" class="error-msg">{{ error }}</p>

      </div>

      <!-- RIGHT BIG IMAGE -->
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
  background-image: url('../assets/images/zeytunaaaa.jpg');
  background-position: center;
  background-size: cover;
}

/* CARD */
.login-card {
  background: white;
  width: 100%;
  max-width: 1100px;
  height: 650px;
  border-radius: 30px;
  overflow: hidden;
  display: grid;
  grid-template-columns: 1fr 1fr;
  box-shadow: 0 20px 40px rgba(0,0,0,0.12);
}

/* LEFT SIDE */
.login-left {
  padding: 60px 50px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.brand {
  font-size: 20px;
  font-weight: 700;
  color: #3b4a3f;
  margin-bottom: 25px;
}

.headline {
  font-size: 38px;
  line-height: 1.1;
  font-weight: 800;
  margin-bottom: 25px;
  color: #222;
}

/* SOCIAL */
.social-row {
  display: flex;
  gap: 18px;
  margin-bottom: 18px;
}

.social-btn {
  width: 50px;
  height: 50px;
  border-radius: 14px;
  border: none;
  font-size: 22px;
  cursor: pointer;
  background: #f3f3f3;
  display: flex;
  align-items: center;
  justify-content: center;
}

.google {
  font-weight: bold;
  color: #4285f4;
}

/* INPUTS */
.login-form input {
  width: 100%;
  padding: 14px 16px;
  border-radius: 12px;
  border: 1px solid #ddd;
  background: #f7f7f7;
  margin-bottom: 12px;
  font-size: 15px;
}

.login-form input:focus {
  outline: none;
  border-color: #d4af37;
  box-shadow: 0 0 0 3px rgba(212,175,55,0.25);
}

/* BUTTON */
.start-btn {
  width: 100%;
  padding: 14px;
  border-radius: 14px;
  border: none;
  background: #324c3f;
  color: white;
  font-weight: 600;
  font-size: 16px;
  margin-top: 8px;
  cursor: pointer;
  transition: 0.3s;
}

.start-btn:hover {
  background: #25392f;
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

/* BOTTOM */
.bottom-text {
  margin-top: 20px;
  font-size: 14px;
  color: #555;
}

.bottom-text a {
  color: #324c3f;
  font-weight: 700;
}

/* ERROR */
.error-msg {
  margin-top: 15px;
  color: red;
  font-size: 14px;
}

/* RESPONSIVE */
@media (max-width: 850px) {
  .login-card {
    grid-template-columns: 1fr;
    height: auto;
  }
  .login-right {
    display: none;
  }
}
</style>
