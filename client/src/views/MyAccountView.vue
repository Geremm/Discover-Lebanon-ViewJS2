<template>
  <div class="account-shell">
    <div class="account-bg-blob"></div>

    <div class="account-layout">
      
      <aside class="account-sidebar">
        <div class="account-profile-card">
          <div class="avatar-wrapper">
            <div class="avatar-circle">
              <span>{{ userInitials }}</span>
            </div>
            <div class="avatar-hello">Hello</div>
          </div>

          <div class="profile-text">
            <h2 class="profile-name">{{ user && user.name ? user.name : 'Traveler' }}</h2>
            <p class="profile-email">{{ user && user.email ? user.email : '' }}</p>
            <p class="profile-tagline">Ready for your next Lebanese escape 🌿</p>
          </div>

          <div class="profile-badges">
            <span class="badge-chip">Member</span>
            <span v-if="user && user.role === 'admin'" class="badge-chip badge-chip-admin">Admin</span>
            <span class="badge-chip badge-chip-gold">
              {{ orders.length }} trip{{ orders.length > 1 ? 's' : '' }} planned
            </span>
          </div>
        </div>

        <nav class="sidebar-nav">
          <button
            v-for="item in sidebarItems"
            :key="item.key"
            class="sidebar-link"
            :class="{ active: activeTab === item.key }"
            @click="activeTab = item.key"
          >
            <span class="sidebar-icon">{{ item.icon }}</span>
            <span class="sidebar-label">{{ item.label }}</span>
          </button>
        </nav>
        
        <button class="logout-btn-red" @click="handleLogout">Logout</button>
      </aside>

      <main class="account-main">
        
        <section class="top-cards" v-if="activeTab === 'info'">
          <div class="top-card">
            <div class="top-card-icon">👤</div>
            <div>
              <h3>My Account</h3>
              <p>Edit your details and see your profile overview.</p>
            </div>
          </div>

          <div class="top-card">
            <div class="top-card-icon">⭐️</div>
            <div>
              <h3>Favorites</h3>
              <p>{{ favoritedItems.length }} place{{ favoritedItems.length !== 1 ? 's' : '' }} saved across Lebanon.</p>
            </div>
          </div>

          <div class="top-card">
            <div class="top-card-icon">🧳</div>
            <div>
              <h3>Trips & Orders</h3>
              <p>{{ orders.length }} reservation{{ orders.length !== 1 ? 's' : '' }} in your history.</p>
            </div>
          </div>
        </section>

        <section v-if="activeTab === 'info'" class="panel">
          <header class="panel-header">
            <div>
              <h2>Account Information</h2>
              <p>Personal details used for your Discover Lebanon experience.</p>
            </div>
          </header>

          <div class="info-grid">
            <div class="info-card">
              <h3>Profile</h3>
              <div class="info-row">
                <span class="info-label">Name</span>
                <span class="info-value">{{ user ? user.name : "" }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Email</span>
                <span class="info-value">{{ user ? user.email : "" }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">User ID</span>
                <span class="info-value">#{{ user ? user.id : "" }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Role</span>
                <span class="info-value" style="text-transform: capitalize;">{{ user ? user.role : "User" }}</span>
              </div>
            </div>

            <div class="info-card soft-card">
              <h3>Travel snapshot</h3>
              <div class="stats-row">
                <div class="stat-pill">
                  <span class="stat-label">Favorites</span>
                  <span class="stat-value">{{ favoritedItems.length }}</span>
                </div>
                <div class="stat-pill">
                  <span class="stat-label">Trips</span>
                  <span class="stat-value">{{ orders.length }}</span>
                </div>
                <div class="stat-pill">
                  <span class="stat-label">Member since</span>
                  <span class="stat-value">2025</span>
                </div>
              </div>
              <p class="info-note">
                Keep exploring Lebanon — the more you save and book, the richer this overview becomes ✨
              </p>
            </div>
          </div>
        </section>

        <section v-else-if="activeTab === 'favourites'" class="panel">
          <header class="panel-header">
            <div>
              <h2>Your Favorites</h2>
              <p>All the places, hotels, restaurants and activities you’ve hearted.</p>
            </div>
          </header>

          <div v-if="favoritedItems.length" class="favorites-grid">
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

          <div v-else class="empty-state">
            <div class="empty-illustration">🤍</div>
            <h3>No favorites yet</h3>
            <p>
              Start exploring and tap the little heart on places you love.
              We’ll keep them safe for your next trip.
            </p>
            <router-link to="/places" class="empty-btn">
              Discover places
            </router-link>
          </div>
        </section>

        <section v-else-if="activeTab === 'orders'" class="panel">
          <header class="panel-header">
            <div>
              <h2>Your Orders</h2>
              <p>Overview of your trip reservations and bookings.</p>
            </div>
          </header>

          <div v-if="orders.length" class="table-card">
            <table class="orders-table">
              <thead>
                <tr>
                  <th>Order</th>
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
                    <span :class="['status-badge', 'status-' + order.status]">
                      {{ order.statusLabel }}
                    </span>
                  </td>
                  <td>{{ order.total }} €</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div v-else class="empty-state">
            <div class="empty-illustration">🧳</div>
            <h3>No trips booked yet</h3>
            <p>
              Plan your first Lebanese escape and your reservations will appear here.
            </p>
            <router-link to="/plan-your-trip" class="empty-btn">
              Plan a trip
            </router-link>
          </div>
        </section>

        <section v-else-if="activeTab === 'security'" class="panel">
          <header class="panel-header">
            <div>
              <h2>Security</h2>
              <p>Keep your account safe with a strong password.</p>
            </div>
          </header>

          <div class="security-layout">
            <div class="info-card">
              <h3>Password</h3>
              <p class="info-note">
                Choose a unique password you don’t reuse on other websites.
              </p>

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

                <p v-if="securityError" class="feedback feedback-error">
                  {{ securityError }}
                </p>
                <p v-if="securitySuccess" class="feedback feedback-success">
                  {{ securitySuccess }}
                </p>

                <button type="submit" class="primary-btn">
                  Update password
                </button>
              </form>
            </div>

            <div class="info-card soft-card">
              <h3>Tips for a safer account</h3>
              <ul class="tips-list">
                <li>Use at least 8–12 characters with letters, numbers and symbols.</li>
                <li>Avoid using your name, email or easy words.</li>
                <li>Never share your password, even if someone claims to be support.</li>
              </ul>
            </div>
          </div>
        </section>

        <section v-else-if="activeTab === 'admin'" class="panel">
          <header class="panel-header">
            <div>
              <h2>Admin Dashboard</h2>
              <p>Manage destinations, users, and site settings.</p>
            </div>
          </header>

          <div class="info-grid">
            <div class="info-card">
              <h3>Quick Actions</h3>
              <div class="info-row">
                 <router-link to="/admin/add-place" class="sidebar-link">➕ Add new place</router-link>
              </div>
              <div class="info-row">
                 <span class="info-label">Manage Users</span>
              </div>
            </div>
             <div class="info-card soft-card">
              <h3>System Status</h3>
              <div class="stats-row">
                 <div class="stat-pill">
                  <span class="stat-label">Total Items</span>
                  <span class="stat-value">{{ allItems.length }}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue"
import { useRouter } from "vue-router"

// Components & Services
import ItemCard from "@/components/ItemCard.vue"
import api from "@/services/api.js" 
import { useFavorites } from "@/store/favorites.js"

const router = useRouter()
const { favoriteSet } = useFavorites()

// UI State
const activeTab = ref("info")
const allItems = ref([]) 
const securityError = ref("")
const securitySuccess = ref("")

// User State (mirrors structure needed for file 2)
const user = ref({
  id: "",
  name: "",
  email: "",
  role: ""
})  

// Mock Data for Orders
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

// Password Form State
const securityForm = ref({
  currentPassword: "",
  newPassword: "",
  confirmPassword: ""
})

// --- Computed Properties ---

// Dynamically generate sidebar items (injects Admin tab if role matches)
const sidebarItems = computed(() => {
  const items = [
    { key: "info", label: "Overview", icon: "🏠" },
    { key: "favourites", label: "Favorites", icon: "❤️" },
    { key: "orders", label: "Trips", icon: "🧳" },
    { key: "security", label: "Security", icon: "🔐" }
  ]

  if (user.value.role === 'admin') {
    items.push({ key: "admin", label: "Admin Panel", icon: "⚙️" })
  }

  return items
})

// Filter the full items list against our favorites set
const favoritedItems = computed(() => {
  return allItems.value.filter(item => favoriteSet.value.has(item.id))
})

// Extract initials for the avatar
const userInitials = computed(() => {
  if (!user.value.name) return "DL"
  return user.value.name
    .split(" ")
    .filter(Boolean)
    .map(part => part[0]?.toUpperCase())
    .slice(0, 2)
    .join("")
})

// --- Actions ---

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

  // @TODO: Hook this up to real backend endpoint later
  console.log("Change password payload:", {
    currentPassword: securityForm.value.currentPassword,
    newPassword: securityForm.value.newPassword
  })

  securitySuccess.value = "Password updated (demo)."
  
  // Clear form
  securityForm.value.currentPassword = ""
  securityForm.value.newPassword = ""
  securityForm.value.confirmPassword = ""
}

const handleLogout = () => {
  localStorage.removeItem("user")
  // localStorage.removeItem("token") // Uncomment when using JWT
  router.push("/login")
}

// --- Lifecycle ---

onMounted(async () => {
  // 1. Check Auth & Load Local User
  const storedUser = localStorage.getItem("user")
  
  if (!storedUser) {
    router.push("/login")
    return
  }
  user.value = JSON.parse(storedUser)

  // 2. Fetch Items Data
  try {
    const data = await api.getAllItems()
    allItems.value = data
  } catch (error) {
    console.error("Error loading items/favorites for account:", error)
  }
})
</script>

<style scoped>
/* Main Shell & Backgrounds */
.account-shell {
  min-height: 100vh;
  background: radial-gradient(circle at top left, #f6f1dd 0, #fdfdfb 40%, #ffffff 100%);
  padding: 40px 0;
}

.account-bg-blob {
  position: fixed;
  inset: 0;
  pointer-events: none;
  background:
    radial-gradient(circle at 10% 20%, rgba(212, 175, 55, 0.18) 0, transparent 45%),
    radial-gradient(circle at 90% 80%, rgba(104, 120, 93, 0.18) 0, transparent 45%);
  z-index: 0;
}

.account-layout {
  position: relative;
  z-index: 1;
  max-width: 1180px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 280px minmax(0, 1fr);
  gap: 32px;
  padding-top: 1.43%;
}

/* Sidebar Styles */
.account-sidebar {
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 26px;
  box-shadow: 0 18px 45px rgba(0, 0, 0, 0.06);
  padding: 22px 20px 20px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  border: 1px solid rgba(225, 219, 196, 0.9);
  height: fit-content; /* Sticky feel */
}

.account-profile-card {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

/* Avatar */
.avatar-wrapper {
  display: flex;
  align-items: flex-end;
  gap: 10px;
}

.avatar-circle {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: linear-gradient(135deg, #d4af37, #b1b18e);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: 700;
  font-size: 22px;
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.15);
}

.avatar-hello {
  background: #fff;
  color: #b36b00;
  font-size: 12px;
  padding: 4px 10px;
  border-radius: 999px;
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.08);
}

/* Profile Text */
.profile-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.profile-name {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  color: #2c2c2c;
}

.profile-email {
  margin: 0;
  font-size: 13px;
  color: #7b7b7b;
}

.profile-tagline {
  margin: 6px 0 0;
  font-size: 13px;
  color: #5c5c5c;
}

/* Badges */
.profile-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 4px;
}

.badge-chip {
  font-size: 11px;
  padding: 5px 10px;
  border-radius: 999px;
  background: #f0f3e9;
  color: #556056;
}

.badge-chip-gold {
  background: #fff6dd;
  color: #8c6a18;
}

.badge-chip-admin {
  background: #324c3f;
  color: #fff;
  font-weight: bold;
}

/* Navigation */
.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.sidebar-link {
  border: none;
  outline: none;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 12px;
  font-size: 14px;
  color: #444;
  transition: all 0.2s ease;
  text-decoration: none;
}

.sidebar-icon {
  width: 28px;
  height: 28px;
  border-radius: 999px;
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sidebar-link.active {
  background: linear-gradient(135deg, #d4af37, #b1b18e);
  color: #fff;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.12);
}

.sidebar-link.active .sidebar-icon {
  background: rgba(255, 255, 255, 0.3);
}

/* Content Area */
.account-main {
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 26px;
  box-shadow: 0 18px 45px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(231, 225, 205, 0.9);
  padding: 26px 26px 30px;
  display: flex;
  flex-direction: column;
  gap: 22px;
  min-height: 600px; 
}

/* Top Cards */
.top-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}

.top-card {
  background: #f9f6ec;
  border-radius: 20px;
  padding: 14px 16px;
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.top-card-icon {
  width: 36px;
  height: 36px;
  border-radius: 12px;
  background: linear-gradient(135deg, #d4af37, #b1b18e);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
}

.top-card h3 {
  margin: 0;
  font-size: 15px;
  color: #333;
}

.top-card p {
  margin: 3px 0 0;
  font-size: 13px;
  color: #666;
}

/* Panels */
.panel {
  background: #ffffff;
  border-radius: 22px;
  padding: 20px 20px 24px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.03);
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(5px); }
  to { opacity: 1; transform: translateY(0); }
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 16px;
}

.panel-header h2 {
  margin: 0;
  font-size: 20px;
  color: #222;
}

.panel-header p {
  margin: 4px 0 0;
  font-size: 13px;
  color: #777;
}

/* Info Grid / Details */
.info-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr);
  gap: 18px;
}

.info-card {
  background: #fdfdfd;
  border-radius: 18px;
  padding: 16px 16px 18px;
  border: 1px solid #ece7d6;
}

.info-card h3 {
  margin: 0 0 10px;
  font-size: 15px;
  color: #333;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 7px 0;
  border-bottom: 1px dashed #eee4ce;
  font-size: 13px;
}

.info-row:last-child {
  border-bottom: none;
}

.info-label { color: #777; }
.info-value { font-weight: 600; color: #333; }

.soft-card { background: #fbfaf5; }

.stats-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 8px;
}

.stat-pill {
  padding: 8px 10px;
  border-radius: 14px;
  background: #ffffff;
  border: 1px solid #eee1c9;
  min-width: 90px;
}

.stat-label {
  display: block;
  font-size: 11px;
  color: #8b7a53;
}

.stat-value {
  font-size: 15px;
  font-weight: 600;
  color: #3b3b2a;
}

.info-note {
  margin-top: 10px;
  font-size: 12px;
  color: #7d7d7d;
}

/* Favorites Grid */
.favorites-grid {
  margin-top: 6px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 18px;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 30px 16px 10px;
}

.empty-illustration {
  font-size: 40px;
  margin-bottom: 8px;
}

.empty-state h3 {
  margin: 0 0 6px;
  font-size: 18px;
  color: #333;
}

.empty-state p {
  margin: 0 0 16px;
  font-size: 13px;
  color: #777;
}

.empty-btn {
  display: inline-block;
  padding: 9px 22px;
  border-radius: 999px;
  background: linear-gradient(135deg, #d4af37, #b1b18e);
  color: #fff;
  text-decoration: none;
  font-size: 13px;
  font-weight: 600;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
}

/* Orders Table */
.table-card {
  border-radius: 18px;
  border: 1px solid #efe6cf;
  background: #fdfbf5;
  padding: 12px 14px;
}

.orders-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.orders-table th,
.orders-table td {
  padding: 10px 8px;
  text-align: left;
}

.orders-table thead th {
  font-weight: 600;
  color: #555;
  border-bottom: 1px solid #efe3c8;
}

.orders-table tbody tr:nth-child(even) {
  background: rgba(255, 250, 237, 0.7);
}

.status-badge {
  display: inline-block;
  padding: 4px 9px;
  border-radius: 999px;
  font-size: 11px;
}

.status-completed { background: #e5f7ec; color: #1d6b3d; }
.status-pending { background: #fff4d6; color: #94621b; }

/* Security & Forms */
.security-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr);
  gap: 18px;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 8px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

label { font-size: 13px; color: #444; }

.input {
  padding: 9px 10px;
  border-radius: 10px;
  border: 1px solid #e0d5bf;
  font-size: 13px;
  background: #fffdf7;
}

.input:focus {
  outline: none;
  border-color: #c7a44b;
  box-shadow: 0 0 0 2px rgba(212, 175, 55, 0.18);
}

.feedback { font-size: 12px; margin-top: 2px; }
.feedback-error { color: #c0392b; }
.feedback-success { color: #2e7d32; }

.primary-btn {
  align-self: flex-start;
  margin-top: 6px;
  padding: 9px 26px;
  border-radius: 999px;
  border: none;
  cursor: pointer;
  background: linear-gradient(135deg, #3b4a3f, #1f2622);
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  box-shadow: 0 13px 24px rgba(0, 0, 0, 0.2);
}

.tips-list {
  margin: 8px 0 0;
  padding-left: 18px;
  font-size: 12px;
  color: #6a6a6a;
}

.tips-list li + li { margin-top: 4px; }

/* Media Queries */
@media (max-width: 950px) {
  .account-layout { grid-template-columns: 1fr; }

  .account-sidebar {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 16px 18px;
  }

  .account-profile-card { flex: 1; }

  .sidebar-nav {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-end;
    gap: 8px;
    max-width: 260px;
  }
  
  .sidebar-link { padding: 8px 10px; }
}

@media (max-width: 720px) {
  .info-grid,
  .security-layout { grid-template-columns: 1fr; }

  .account-main { padding: 20px 16px 22px; }
  .panel { padding: 16px 14px 20px; }
}

@media (max-width: 520px) {
  .account-shell { padding: 20px 10px 24px; }

  .account-sidebar {
    flex-direction: column;
    align-items: flex-start;
  }

  .sidebar-nav {
    width: 100%;
    justify-content: flex-start;
  }
  
  .logout-btn-red {
    width: 100%;
    margin-top: 20px;
    padding: 12px 0;
    border: none;
    border-radius: 12px;
    background: #ff4b4b;
    color: white;
    font-weight: 600;
    cursor: pointer;
    box-shadow: 0 6px 15px rgba(255, 0, 0, 0.2);
    transition: 0.25s ease;
  }

  .logout-btn-red:hover {
    background: #e63c3c;
    transform: translateY(-1px);
  }
}
</style>