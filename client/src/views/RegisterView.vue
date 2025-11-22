<template>
  <section class="places-hero-login fade-in"> 
    <div class=" login-box ">
      <h1>Register</h1>
      <p id="create">Create an account now !</p>
    
      <div class="login-page">
        <form @submit.prevent="registerUser">

          <input v-model="name" type="text" placeholder="Name" required />

          <input v-model="email" type="email" placeholder="Email" required />

          <input v-model="password" type="password" placeholder="Password" required />

    
          <button type="submit">Create Account</button>
        </form>

        <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
        <p v-if="successMessage" class="success">{{ successMessage }}</p>
      </div>
    </div>
  </section>
</template>


<script setup>
import { ref } from "vue"

const name = ref("")
const email = ref("")
const password = ref("")
const errorMessage = ref("")
const successMessage = ref("")
const API_URL = "http://localhost:3000"

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
      console.log("Registration error:", data);
      errorMessage.value = data.message || data.error || "Registration failed"
      return
    }
    successMessage.value = "Account created! You can now login."

  } catch (err) {
    errorMessage.value = "Server error"
    console.error(err)
  }
}
</script>


<style scoped>
.error{color: red;}
.success {color: green;}

.places-hero-login{padding-top:5%;}

#create{
  margin-bottom: 25px;
}

form{
  display: flex;
  flex-direction: column;
  gap: 15px
}
</style>
