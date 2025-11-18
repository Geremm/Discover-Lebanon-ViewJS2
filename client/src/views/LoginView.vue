<template>
  <section class="places-hero fade-in">
            <h1>Login</h1>
            <p>Connect to your account now !</p>
    </section>
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
      <router-link to="/register">Don't have an account? Sign up</router-link>

      <button type="submit">Login</button>
    </form>

    <p v-if="error" class="error">{{ error }}</p>
  </div>
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
.error {
  color: red;
  margin-top: 10px;
}
.login-page{
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 30px;
  gap: 15px;
}

form{
  display: flex;
  flex-direction: column;
  gap: 15px
}
</style>
