<template>
  <div class="account-page">
    <header class="top-bar">
    </header>

    <div class="content">
      <!-- SIDEBAR -->
      <aside class="sidebar">
        <ul>
          <h1 class="user-short" v-if="user.name"> Hello,<br> {{ user.name }}</h1>
        </ul>
        <ul>
          <li 
            :class="{ active: activeTab === 'info' }"
            @click="activeTab = 'info'"
          >
            Information
          </li>

          <li
            :class="{ active: activeTab === 'favourites' }"
            @click="activeTab = 'favourites'"
          >
            Favorites
          </li>

          <li
            :class="{ active: activeTab === 'orders' }"
            @click="activeTab = 'orders'"
          >
            Orders
          </li>
          
          <li
            :class="{ active: activeTab === 'security' }"
            @click="activeTab = 'security'"
          >
            Security
          </li>
        </ul>
      </aside>

      <main class="main-content">
        <!-- INFO -->
        <section v-if="activeTab === 'info'">
          

          <h2>Account Information</h2>

          <div class="info-box">
            <p><strong>Name:</strong> {{ user.name }}</p>
            <p><strong>Email:</strong> {{ user.email }}</p>
            <p><strong>User ID:</strong> {{ user.id }}</p>
          </div>
        </section>

        <!-- FAVOURITES : même logique que FavoriteView -->
        <section v-else-if="activeTab === 'favourites'">
          <h2>Your Favorites</h2>
          <p class="subtitle">Here are all the places you've saved.</p>

          <section v-if="favoritedItems.length > 0">
            <div class="destinations-grid">
              <ItemCard
                v-for="item in favoritedItems"
                :key="item.id"
                :id="item.id"
                :category="item.category"
                :title="item.name"
                :description="item.shortDesc"
                :image="item.imageUrl"
              />
            </div>
          </section>

          <section v-else>
            <p class="empty-text">You have no favorites yet.</p>
          </section>
        </section>

        <!-- ORDERS -->
        <section v-else-if="activeTab === 'orders'">
          <h2>Orders</h2>

          <div v-if="orders.length" class="info-box">
            <table class="table">
              <thead>
                <tr>
                  <th>Order #</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="order in orders" :key="order.id">
                  <td>#{{ order.id }}</td>
                  <td>{{ order.date }}</td>
                  <td>
                    <span :class="['status', 'status-' + order.status]">
                      {{ order.statusLabel }}
                    </span>
                  </td>
                  <td>{{ order.total }} €</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p v-else class="empty-text">
            You have no orders yet.
          </p>
        </section>

        <!-- SECURITY -->
        <section v-else-if="activeTab === 'security'">
          <h2>Security</h2>

          <div class="info-box">
            <h3 class="change">Change password</h3>

            <form class="form" @submit.prevent="updatePassword">
              <div class="form-group">
                <label for="currentPassword">Current password</label>
                <input
                  id="currentPassword"
                  v-model="securityForm.currentPassword"
                  type="password"
                  class="input"
                  required
                />
              </div>

              <div class="form-group">
                <label for="newPassword">New password</label>
                <input
                  id="newPassword"
                  v-model="securityForm.newPassword"
                  type="password"
                  class="input"
                  required
                />
              </div>

              <div class="form-group">
                <label for="confirmPassword">Confirm new password</label>
                <input
                  id="confirmPassword"
                  v-model="securityForm.confirmPassword"
                  type="password"
                  class="input"
                  required
                />
              </div>

              <p v-if="securityError" class="error-text">
                {{ securityError }}
              </p>
              <p v-if="securitySuccess" class="success-text">
                {{ securitySuccess }}
              </p>

              <button type="submit" class="btn-primary">
                Update password
              </button>
            </form>
          </div>
        </section>
      </main>
    </div>
  </div>
</template>






<script setup>
import { ref, onMounted, computed } from "vue"
import { useRouter } from "vue-router"

import { useFavorites } from "@/store/favorites.js"
import { allItems } from "@/data/database.js"
import ItemCard from "@/components/ItemCard.vue"

const router = useRouter()
const activeTab = ref("info")

const user = ref({
  id: "",
  name: "",
  email: ""
})

/* ----- FAVOURITES (même logique que ta FavoriteView) ----- */
const { favoriteSet } = useFavorites()

const favoritedItems = computed(() => {
  return allItems.filter(item => favoriteSet.value.has(item.id))
})

/* ----- ORDERS (exemple de données mock) ----- */
const orders = ref([
  {
    id: "2025-001",
    date: "2025-11-21",
    status: "completed",
    statusLabel: "Completed",
    total: 49.9
  },
  {
    id: "2025-002",
    date: "2025-11-22",
    status: "pending",
    statusLabel: "Pending",
    total: 19.9
  }
])

/* ----- SECURITY FORM ----- */
const securityForm = ref({
  currentPassword: "",
  newPassword: "",
  confirmPassword: ""
})

const securityError = ref("")
const securitySuccess = ref("")

const updatePassword = () => {
  securityError.value = ""
  securitySuccess.value = ""

  if (securityForm.value.newPassword !== securityForm.value.confirmPassword) {
    securityError.value = "New passwords do not match."
    return
  }

  if (securityForm.value.newPassword.length < 8) {
    securityError.value = "Password must be at least 8 characters."
    return
  }

  // TODO : appel API vers ton backend
  console.log("Change password payload:", {
    currentPassword: securityForm.value.currentPassword,
    newPassword: securityForm.value.newPassword
  })

  securitySuccess.value = "Password updated (demo)."

  securityForm.value.currentPassword = ""
  securityForm.value.newPassword = ""
  securityForm.value.confirmPassword = ""
}

/* ----- AUTH CHECK ----- */
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

/* TOP BAR */
.top-bar {
  height: 80px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 30px;
  background-color: #b1b18e;
  color: white;
}

.top-bar h1 {
  margin: 0;
  font-size: 20px;
}

.user-short {
  font-family: 'Playfair Display', serif;
  font-size: 30px;
  padding-bottom: 10%;
  padding-left: 7%;
  opacity: 0.9;
  color: #000000;
}

p {
  color: black;
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
  margin: 0;
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
  border-left: 7px solid #e0e0b6;
}

/* Main content */
.main-content {
  flex: 1;
  padding-top: 30px;            
}


.main-content > section {
  padding: 0 4% 40px 4%;       
}

.main-content h2 {
  color: black;
  margin: 0 0 8px 0;              
}

.subtitle {
  padding-top:1%;
  margin: 0 0 18px 0;
  color: #555;
}

/* Boxes & grids */
.info-box {
  margin-top: 15px;              
  padding: 20px;
  background: #f9fbfd;
  border: 1px solid #e1e7ef;
  border-radius: 8px;
  color: #000000;
}
.info-box p + p {
  margin-top: 1%;    /* ajoute un espace à partir du 2e <p> */
}

.change {
  margin-bottom: 4%;
}

.destinations-grid {
  margin: 24px 0 0 0;                   
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 100%));
  
  justify-content: flex-start;        
  justify-items: start;                
}



/* Empty text */
.empty-text {
  margin-top: 10px;
  font-size: 14px;
  color: #555;
}

/* Table */
.table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.table th,
.table td {
  padding: 10px 8px;
  text-align: left;
  border-bottom: 1px solid #e1e7ef;
}

.table th {
  font-weight: 600;
}

/* Status badges */
.status {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 999px;
  font-size: 12px;
}

.status-completed {
  background-color: #e3f7e5;
  color: #137333;
}

.status-pending {
  background-color: #fff4ce;
  color: #8a6d1b;
}

/* Form */
.form {
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-top: 10px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.input {
  padding: 8px 10px;
  border-radius: 4px;
  border: 1px solid #d0d7e2;
  font-size: 14px;
}

.error-text {
  color: #c0392b;
  font-size: 13px;
}

.success-text {
  color: #2e7d32;
  font-size: 13px;
}

/* Button */
.btn-primary {
  padding: 9px 36px;
  background: linear-gradient(to right, #dedede, #b1b18e);
  font-size: 1em;
  font-weight: bold;
  border-radius: 10px;
  text-decoration: none;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  transition: 0.6s ease;
  margin-top: 5%;
  border: none;
}

.btn-primary:hover {
  transform: scale(1.01);
  cursor: pointer;
}

</style>
