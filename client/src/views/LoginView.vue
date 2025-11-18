<template>
  <div class="login-page">
    <section class="places-hero fade-in">
            <h1>Login</h1>
            <p>Connect to your account now !</p>
    </section>

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

      <button type="submit">Login</button>
    </form>

    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref } from "vue"
import { useRouter } from "vue-router"

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
    router.push("/profile")

  } catch (err) {
    error.value = "Cannot reach server"
  }
}
</script>

<style scoped>
.error {
  color: red;
  margin-top: 10px;
}
</style>
