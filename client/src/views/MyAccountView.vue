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
            <div class="avatar-hello">Hello, </div>
          </div>

          <div class="profile-text">
            <h2 class="profile-name">{{ user && user.name ? user.name : 'Traveler' }}</h2>
            <p class="profile-email">{{ user && user.email ? user.email : '' }}</p>
            <p class="profile-tagline">Ready for your next Lebanese escape 🌿</p>
          </div>

          <div class="profile-badges">
            <span v-if="user && user.role !== 'admin'" class="badge-chip">Member</span>
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

          <div class="calendar-container">
            <div class="calendar-header-row">
              <h3>Your Trip Calendar</h3>
              <div class="calendar-controls">
                <button @click="changeMonth(-1)">‹</button>
                <span>{{ currentMonthName }} {{ currentYear }}</span>
                <button @click="changeMonth(1)">›</button>
              </div>
            </div>

            <div class="calendar-grid">
              <div class="cal-weekday">Mon</div>
              <div class="cal-weekday">Tue</div>
              <div class="cal-weekday">Wed</div>
              <div class="cal-weekday">Thu</div>
              <div class="cal-weekday">Fri</div>
              <div class="cal-weekday">Sat</div>
              <div class="cal-weekday">Sun</div>

              <div 
                v-for="pad in paddingDays" 
                :key="'pad-' + pad" 
                class="cal-day cal-day-empty"
              ></div>

              <div 
                v-for="day in daysInMonth" 
                :key="day" 
                class="cal-day clickable-day"
                :class="{ 'is-today': isToday(day) }"
                @click="openDayModal(day)"
              >
                <span class="cal-date-num">{{ day }}</span>
                
                <div class="cal-events">
                  <div 
                    v-for="event in getEventsForDay(day)" 
                    :key="event.id" 
                    class="cal-event-pill"
                    :class="'pill-' + event.status"
                  >
                    {{ event.title || 'Trip #' + event.id }}
                  </div>
                </div>
              </div>
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
          <div v-if="orders.length" class="table-card">
            <table class="orders-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Trip / Item</th>
                  <th>Date & Time</th> <th>Status</th>
                  <th>Details</th>     </tr>
              </thead>
              <tbody>
                <tr v-for="order in orders" :key="order.id">
                  <td>#{{ order.id }}</td>
                  
                  <td>
                    <strong>{{ order.title }}</strong>
                  </td>

                  <td>
                    <div>{{ order.date }}</div>
                    <small style="color: #888; font-size: 0.85em;">
                      {{ order.time }}
                    </small>
                  </td>

                  <td>
                    <span :class="['status-badge', 'status-' + order.status]">
                      {{ order.statusLabel }}
                    </span>
                  </td>

                  <td>
                    {{ order.total }} 
                  </td>
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
            <div class="info-card reservation-card">
  <div class="res-header">
    <h3>Reservation Management</h3>
    <span class="badge-count">{{ pendingReservations.length }} to do</span>
  </div>

  <div class="reservation-grid">
    
    <div class="res-column pending-col">
      <h4 class="col-title">⏳ Pending Requests</h4>

      <div v-if="pendingReservations.length !== 0" class="res-list">
        <div v-for="res in pendingReservations" :key="res.id" class="res-item-card">
          <div class="res-content">
            <div class="res-top">
              <span class="res-id">User n°{{ res.id }}</span>
              <span class="res-date">{{ res.date + " " + res.hour}}</span>
            </div>
            <div class="res-main">
              <span class="res-user">{{ res.user }}</span>
              <span class="res-product">{{ res.item }}</span>
            </div>
          </div>
          <button class="action-btn" @click="markAsProcessed(res.id)" title="Confirm booking">
            ✓
          </button>
        </div>
      </div>
    </div>

    <div class="res-column done-col">
      <h4 class="col-title">✅ Processed History</h4>
      
      <div class="res-list">
        <div v-for="res in processedReservations" :key="res.id" class="res-item-card done-item">
          <div class="res-content">
            <div class="res-top">
              <span class="res-id">User n°{{ res.id }}</span>
              <span class="res-date">{{ res.date + " " + res.hour}}</span>
            </div>
            <div class="res-main">
              <span class="res-user">{{ res.user }}</span>
              <span class="res-product">{{ res.item }}</span>
            </div>
          </div>
          <button class="action-btn-rmv" @click="markAsUnprocessed(res.id)" title="Confirm booking">
            X
          </button>
        </div>
      </div>
    </div>

  </div>
</div>
          </div>
        </section>

      </main>
    </div>

    <div v-if="isModalOpen" class="modal-backdrop" @click="closeModal">
      <div class="modal-card" @click.stop>
        <div class="modal-header">
          <h3>{{ selectedDateString }}</h3>
          <button class="modal-close-btn" @click="closeModal">✕</button>
        </div>
        
        <div class="modal-body">
          <div v-if="selectedDayEvents.length > 0" class="modal-events-list">
            <div v-for="event in selectedDayEvents" :key="event.id" class="modal-event-item">
              <div class="event-time">{{ event.time }}</div>
              <div class="event-details">
                <span class="event-title">{{ event.title }}</span>
                <span :class="['status-badge', 'status-' + event.status]">{{ event.statusLabel }}</span>
              </div>
            </div>
          </div>
          
          <div v-else class="modal-empty">
            <p>Nothing planned for this day.</p>
            <router-link to="/plan-your-trip" class="empty-btn-small">Plan something?</router-link>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue"
import { useRouter } from "vue-router"

// Imports
import { useFavorites } from "@/store/favorites.js"
import api from "@/services/api.js" 
import ItemCard from "@/components/ItemCard.vue"
import { logout } from "@/store/auth"

const router = useRouter()

// CORRECTION 1 : On importe les bons noms depuis le store
// On récupère favoriteItems directement (c'est plus simple !)
const { favoriteItems } = useFavorites()

// UI State
const activeTab = ref("info")
const allItems = ref([]) // For favorites
const orders = ref([])   // <--- NOW EMPTY, WILL BE FILLED BY DB
const securityError = ref("")
const securitySuccess = ref("")
const adminReservations = ref([])

// Calendar & Modal State
const calendarDate = ref(new Date())
const isModalOpen = ref(false)
const selectedDayEvents = ref([])
const selectedDateString = ref("")

// User local data
const user = ref({
  id: "",
  name: "",
  email: "",
  role: ""
})  

const securityForm = ref({
  currentPassword: "",
  newPassword: "",
  confirmPassword: ""
})

// --- Computed Props ---
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

// CORRECTION 2 : On utilise directement la liste du store
const favoritedItems = computed(() => {
  return favoriteItems.value || [];
})

const userInitials = computed(() => {
  if (!user.value.name) return "DL"
  return user.value.name
    .split(" ")
    .filter(Boolean)
    .map(part => part[0]?.toUpperCase())
    .slice(0, 2)
    .join("")
})
// --- ADMIN LOGIC ---

const pendingReservations = computed(() => {
  return adminReservations.value.filter(r => r.status === 'pending');
});

const processedReservations = computed(() => {
  return adminReservations.value.filter(r => r.status === 'completed');
});

const fetchAdminBookings = async () => {
    try {
        const response = await fetch('http://localhost:3000/api/admin/bookings');
        const data = await response.json();
        
        // On mappe les données SQL pour qu'elles collent à ton affichage
        adminReservations.value = data.map(row => ({
            id: row.id,
            user: row.user_name,     // Vient du JOIN users
            item: row.product_name,  // Vient du JOIN products
            date: row.booking_date,
            hour: row.booking_time,
            status: row.status
        }));
        console.log("Date : ", adminReservations.value.date)
    } catch (e) {
        console.error("Erreur chargement admin:", e);
    }
};

// Action pour valider (Appel API)
const markAsProcessed = async (id) => {
  try {
      // 1. On dit au serveur de mettre à jour
      await fetch(`http://localhost:3000/api/admin/bookings/${id}/complete`, {
          method: 'PUT'
      });

      // 2. On met à jour localement sans recharger la page
      const reservation = adminReservations.value.find(r => r.id === id);
      if (reservation) {
        reservation.status = 'completed';
      }
  } catch (e) {
      console.error("Erreur validation:", e);
  }
};

const markAsUnprocessed = async (id) => {
  try {
      // 1. On dit au serveur de mettre à jour
      await fetch(`http://localhost:3000/api/admin/bookings/${id}/pending`, {
          method: 'PUT'
      });

      const reservation = adminReservations.value.find(r => r.id === id);
      if (reservation) {
        reservation.status = 'pending';
      }
  } catch (e) {
      console.error("Erreur validation:", e);
  }
};



// --- Calendar Logic ---
const currentYear = computed(() => calendarDate.value.getFullYear())
const currentMonthName = computed(() => {
  return calendarDate.value.toLocaleString('default', { month: 'long' })
})
const daysInMonth = computed(() => {
  const year = calendarDate.value.getFullYear()
  const month = calendarDate.value.getMonth()
  return new Date(year, month + 1, 0).getDate()
})
const paddingDays = computed(() => {
  const year = calendarDate.value.getFullYear()
  const month = calendarDate.value.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  return firstDay === 0 ? 6 : firstDay - 1
})
const changeMonth = (offset) => {
  const newDate = new Date(calendarDate.value)
  newDate.setMonth(newDate.getMonth() + offset)
  calendarDate.value = newDate
}
const isToday = (day) => {
  const today = new Date()
  const d = calendarDate.value
  return today.getDate() === day && 
         today.getMonth() === d.getMonth() && 
         today.getFullYear() === d.getFullYear()
}
const getEventsForDay = (day) => {
  const year = calendarDate.value.getFullYear()
  const month = calendarDate.value.getMonth() + 1
  const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  return orders.value.filter(order => order.date === dateStr)
}

// --- Modal Logic ---
const openDayModal = (day) => {
  selectedDayEvents.value = getEventsForDay(day)
  const year = calendarDate.value.getFullYear()
  const monthName = calendarDate.value.toLocaleString('default', { month: 'long' })
  selectedDateString.value = `${monthName} ${day}, ${year}`
  isModalOpen.value = true
}
const closeModal = () => { isModalOpen.value = false }

// --- Methods ---
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

  console.log("Change password payload:", {
    currentPassword: securityForm.value.currentPassword,
    newPassword: securityForm.value.newPassword
  })

  securitySuccess.value = "Password updated (demo)."
}

const handleLogout = () => {
  localStorage.removeItem("user")
  localStorage.removeItem("token")
  logout();
  router.push("/login")
}

// --- INITIALIZATION (FETCH DATA) ---
onMounted(async () => {
  const storedUser = localStorage.getItem("user")
  if (!storedUser) {
    router.push("/login")
    return
  }
  user.value = JSON.parse(storedUser)

  if (user.value && user.value.role === 'admin') {
      fetchAdminBookings();
  }

  try {
    // 1. Fetch Items (Favorites)
    const itemsData = await api.getAllItems()
    allItems.value = itemsData

    // 2. Fetch Real Bookings from MySQL
    // Make sure your backend port is correct (3000)
    const res = await fetch(`http://localhost:3000/api/my-bookings/${user.value.id}`)
    
    if (res.ok) {
      const data = await res.json()
      
      // Map database columns to frontend format
      orders.value = data.map(b => ({
        id: b.order_id,
        title: b.product_name,
        date: b.booking_date ? b.booking_date.split('T')[0] : '', // Clean MySQL date
        time: b.booking_time,
        guests: b.guests,
        status: b.status,
        statusLabel: b.status.charAt(0).toUpperCase() + b.status.slice(1),
        total: b.total_price ? b.total_price + ' €' : 'Free' 
      }))
    }
  } catch (error) {
    console.error("Error fetching account data:", error)
  }
})
</script>
<style scoped>
*{
  color :black;
}
/* Page Layout */
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
  padding-top:1.43%;
}

/* Sidebar */
.account-sidebar {
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 26px;
  box-shadow: 0 18px 45px rgba(0, 0, 0, 0.06);
  padding: 22px 20px 20px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  border: 1px solid rgba(225, 219, 196, 0.9);
  height: fit-content;
}

.account-profile-card {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

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
  font-size: 32px;
  padding: 4px 10px;
  font-weight: 1000;
}

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

/* Main Content Area */
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

/* Account Info Cards */
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

.info-label {
  color: #777;
}

.info-value {
  font-weight: 600;
  color: #333;
}

.soft-card {
  background: #fbfaf5;
}

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

/* === CALENDAR STYLES === */
.calendar-container {
  margin-top: 24px;
  background: #fffdf7;
  border: 1px solid #efe3c8;
  border-radius: 18px;
  padding: 16px;
}

.calendar-header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
}

.calendar-header-row h3 {
  margin: 0;
  font-size: 16px;
  color: #333;
}

.calendar-controls {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  font-weight: 600;
}

.calendar-controls button {
  background: transparent;
  border: 1px solid #d4af37;
  color: #d4af37;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 6px;
}

.cal-weekday {
  text-align: center;
  font-size: 11px;
  font-weight: 600;
  color: #999;
  padding-bottom: 4px;
}

.cal-day {
  background: #fff;
  border: 1px solid #f2edd9;
  border-radius: 8px;
  min-height: 60px;
  padding: 4px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  position: relative;
  transition: transform 0.1s ease;
}

/* Click interaction */
.clickable-day {
  cursor: pointer;
}

.clickable-day:hover {
  border-color: #d4af37;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(212, 175, 55, 0.15);
  z-index: 2;
}

.cal-day-empty {
  background: transparent;
  border: none;
}

.cal-date-num {
  font-size: 11px;
  font-weight: 600;
  color: #555;
  margin-bottom: 2px;
}

.is-today {
  background: #fff9e6;
  border-color: #d4af37;
}

.cal-events {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.cal-event-pill {
  font-size: 9px;
  padding: 2px 4px;
  border-radius: 4px;
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 600;
}

.pill-completed {
  background: #e5f7ec;
  color: #1d6b3d;
}

.pill-pending {
  background: #fff4d6;
  color: #94621b;
}

/* === MODAL STYLES === */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(2px);
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeIn 0.2s ease;
}

.modal-card {
  background: #fff;
  border-radius: 20px;
  padding: 20px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 15px 40px rgba(0,0,0,0.15);
  transform: scale(0.95);
  animation: popIn 0.2s ease forwards;
}

@keyframes popIn {
  to { transform: scale(1); }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
}

.modal-header h3 {
  margin: 0;
  color: #333;
  font-size: 18px;
}

.modal-close-btn {
  background: transparent;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: #888;
}

.modal-event-item {
  display: flex;
  gap: 12px;
  padding: 10px 0;
  border-bottom: 1px dashed #eee;
}

.event-time {
  font-size: 12px;
  font-weight: 600;
  color: #d4af37;
  min-width: 60px;
}

.event-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.event-title {
  font-weight: 600;
  font-size: 14px;
  color: #222;
}

.modal-empty {
  text-align: center;
  padding: 20px 0;
  color: #777;
  font-size: 14px;
}

.empty-btn-small {
  display: inline-block;
  margin-top: 10px;
  font-size: 12px;
  color: #d4af37;
  text-decoration: none;
  font-weight: 600;
}

/* Favorites Grid */
.favorites-grid {
  margin-top: 6px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 18px;
}

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

.status-completed {
  background: #e5f7ec;
  color: #1d6b3d;
}

.status-pending {
  background: #fff4d6;
  color: #94621b;
}

/* Forms */
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

label {
  font-size: 13px;
  color: #444;
}

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

.feedback {
  font-size: 12px;
  margin-top: 2px;
}

.feedback-error {
  color: #c0392b;
}

.feedback-success {
  color: #2e7d32;
}

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

.tips-list li + li {
  margin-top: 4px;
}

/* --- STYLE RESERVATIONS DASHBOARD --- */

/* La carte globale prend 2 colonnes sur grand écran */
.reservation-card {
  grid-column: span 2; 
}

.res-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.badge-count {
  background: #d97706;
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: bold;
}

.reservation-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 25px;
}

.res-column {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 15px;
  border: 1px solid #eef2f6;
}

.col-title {
  font-size: 0.9rem;
  text-transform: uppercase;
  color: #64748b;
  margin-bottom: 15px;
  font-weight: 700;
  letter-spacing: 0.5px;
}

/* Liste scrollable si trop d'éléments */
.res-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 350px;
  overflow-y: auto;
  padding-right: 5px; /* Espace pour la scrollbar */
}

/* STYLE DES CARTES INDIVIDUELLES */
.res-item-card {
  background: white;
  padding: 12px;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.04);
  border-left: 4px solid #d97706; /* Orange pour pending */
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: transform 0.2s;
}

.res-item-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(0,0,0,0.08);
}

/* Style spécifique pour items terminés */
.done-item {
  border-left: 4px solid #10b981; /* Vert pour done */
  opacity: 0.8;
  background: #fff;
}

.res-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.res-top {
  display: flex;
  gap: 10px;
  font-size: 0.75rem;
  color: #94a3b8;
}

.res-id { font-weight: bold; }

.res-main {
  display: flex;
  flex-direction: column;
}

.res-user {
  font-weight: 700;
  color: #334155;
  font-size: 0.95rem;
}

.res-product {
  font-size: 0.85rem;
  color: #64748b;
}

/* BOUTON D'ACTION */
.action-btn {
  background: #ecfdf5;
  color: #059669;
  border: 1px solid #d1fae5;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  transition: all 0.2s;
}

.action-btn:hover {
  background: #10b981;
  color: white;
  transform: scale(1.1);
}

.action-btn-rmv {
  background: #fdecec;
  color: #ff0000;
  border: 1px solid #fad1d1;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  transition: all 0.2s;
}


.action-btn-rmv:hover {
  background: #b91010;
  color: white;
  transform: scale(1.1);
}
.empty-state-mini {
  text-align: center;
  padding: 30px;
  color: #94a3b8;
  font-style: italic;
  background: white;
  border-radius: 8px;
  border: 1px dashed #cbd5e1;
}

/* Mobile : Une seule colonne */
@media (max-width: 768px) {
  .reservation-grid {
    grid-template-columns: 1fr;
  }
  .reservation-card {
    grid-column: span 1;
  }
}

/* Responsive */
@media (max-width: 950px) {
  .account-layout {
    grid-template-columns: 1fr;
  }

  .account-sidebar {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 16px 18px;
  }

  .account-profile-card {
    flex: 1;
  }

  .sidebar-nav {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-end;
    gap: 8px;
    max-width: 260px;
  }

  .sidebar-link {
    padding: 8px 10px;
  }
}

@media (max-width: 720px) {
  .info-grid,
  .security-layout {
    grid-template-columns: 1fr;
  }

  .account-main {
    padding: 20px 16px 22px;
  }

  .panel {
    padding: 16px 14px 20px;
  }
}

@media (max-width: 520px) {
  .account-shell {
    padding: 20px 10px 24px;
  }

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