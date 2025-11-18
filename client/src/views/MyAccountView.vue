<template>
  <div class="account-page">
    <header class="top-bar"></header>
    <div class="content">
      <aside class="sidebar">
        <ul>
          <li 
            :class="{ active: activeTab === 'info' }"
            @click="activeTab = 'info'"
          >
            Information
          </li>
          <!-- Ici on va rajouter les autres onglets -->
        </ul>
      </aside>

      <main class="main-content">
        <h2>My Account</h2>
        <section v-if="activeTab === 'info'">
          <h3>Account Information</h3>

          <div class="info-box">
            <p><strong>Name:</strong> {{ user.name }}</p>
            <p><strong>Email:</strong> {{ user.email }}</p>
            <p><strong>User ID:</strong> {{ user.id }}</p>
          </div>
        </section>
      </main>

    </div>

  </div>
</template>


<script setup>
import { ref, onMounted } from "vue"
import { useRouter } from "vue-router"

const router = useRouter()
const activeTab = ref("info")

const user = ref({
  id: "",
  name: "",
  email: ""
})

onMounted(() => {
  const storedUser = localStorage.getItem("user")

  if (!storedUser) {
    router.push("/login")
    return
  }

  user.value = JSON.parse(storedUser)
})
</script>


<style scoped>
.account-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 38px 25px;
  background-color: #004aad;
  color: white;
}

p{
    color:black;
}

h2{
    color:black;
    margin-left: 41%;
    margin-top: 20px;
}
/* Content layout */
.content {
  display: flex;
  flex: 1;
}

/* Sidebar */
.sidebar {
  width: 220px;
  background-color: #f5f7fa;
  border-right: 1px solid #dce1e8;
  padding-top: 20px;
}

.sidebar ul {
  list-style: none;
  padding: 0;
}

.sidebar li {
  padding: 14px 20px;
  cursor: pointer;
  font-size: 16px;
  color: #333;
  transition: 0.2s;
}

.sidebar li:hover {
  background-color: #e6ecf5;
}

.sidebar li.active {
  font-weight: bold;
  background-color: #dde7f4;
  border-left: 4px solid #004aad;
}

/* Main content */
.main-content {
  flex: 1;
  padding: 30px;
}

.info-box {
  margin-top: 15px;
  padding: 20px;
  background: #f9fbfd;
  border: 1px solid #e1e7ef;
  border-radius: 8px;
}
</style>
