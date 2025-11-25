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
              <p>{{ favoritedItems.length }} place{{ favoritedItems.length !== 1 ? 's' : '' }} saved.</p>
            </div>
          </div>

          <div class="top-card">
            <div class="top-card-icon">🧳</div>
            <div>
              <h3>Trips</h3>
              <p>{{ orders.length }} reservation{{ orders.length !== 1 ? 's' : '' }} in history.</p>
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
            <p>Start exploring and tap the little heart on places you love.</p>
            <router-link to="/places" class="empty-btn">Discover places</router-link>
          </div>
        </section>

        <section v-else-if="activeTab === 'orders'" class="panel transparent-panel">
          <header class="panel-header">
            <div>
              <h2>Your Trips</h2>
              <p>Upcoming and past reservations.</p>
            </div>
          </header>

          <div v-if="orders.length" class="orders-grid">
            <div v-for="order in orders" :key="order.id" class="trip-card">
              <div class="trip-image" :style="{ backgroundImage: `url(${order.image})` }">
                <div class="trip-overlay">
                  <span class="trip-category">{{ order.category }}</span>
                  <span :class="['trip-status', 'status-' + order.status]">
                    {{ order.statusLabel }}
                  </span>
                </div>
              </div>

              <div class="trip-details">
                <div class="trip-header">
                  <h3>{{ order.title }}</h3>
                  <span class="trip-id">#{{ order.id }}</span>
                </div>

                <div class="trip-info-row">
                  <div class="info-item">
                    <span>📅 {{ order.date }}</span>
                  </div>
                  <div class="info-item">
                    <span>⏰ {{ order.time }}</span>
                  </div>
                </div>

                <div class="trip-footer">
                  <div class="trip-guests">
                    👤 {{ order.guests }} Guests
                  </div>
                  <div class="trip-price">
                    {{ order.total }}
                  </div>
                </div>
                <button v-if="order.status !== 'cancelled'" @click="promptCancel(order)" class="btn-cancel-trip">Cancel Booking</button>
              </div>

            </div>
          </div>

          <div v-else class="empty-state">
            <div class="empty-illustration">🧳</div>
            <h3>No trips booked yet</h3>
            <p>Plan your first Lebanese escape and your reservations will appear here.</p>
            <router-link to="/plan-your-trip" class="empty-btn">Plan a trip</router-link>
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
              <p class="info-note">Choose a unique password you don’t reuse on other websites.</p>
              <form class="form" @submit.prevent="updatePassword">
                <div class="form-group">
                  <label>Current password</label>
                  <input v-model="securityForm.currentPassword" type="password" class="input" required />
                </div>
                <div class="form-group">
                  <label>New password</label>
                  <input v-model="securityForm.newPassword" type="password" class="input" required />
                </div>
                <div class="form-group">
                  <label>Confirm new password</label>
                  <input v-model="securityForm.confirmPassword" type="password" class="input" required />
                </div>
                <p v-if="securityError" class="feedback feedback-error">{{ securityError }}</p>
                <p v-if="securitySuccess" class="feedback feedback-success">{{ securitySuccess }}</p>
                <button type="submit" class="primary-btn">Update password</button>
              </form>
            </div>
            <div class="info-card soft-card">
              <h3>Tips for a safer account</h3>
              <ul class="tips-list">
                <li>Use at least 8–12 characters.</li>
                <li>Avoid using your name or email.</li>
              </ul>
            </div>
          </div>
        </section>

        <section v-else-if="activeTab === 'admin'" class="panel">
          <header class="panel-header">
            <div><h2>Admin Dashboard</h2><p>Manage system.</p></div>
          </header>
          <div class="info-grid">
            <div class="info-card">
              <h3>Quick Actions</h3>
              <div class="info-row"><router-link to="/admin/add-place">➕ Add new place</router-link></div>
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
            <p>Nothing planned.</p>
          </div>
        </div>
      </div>
    </div>
    <div v-if="showCancelModal" class="modal-backdrop" @click="showCancelModal = false">
  <div class="modal-card cute-modal" @click.stop>
    <div class="cute-icon">😢</div>
    <h3>Change of plans?</h3>
    <p>Are you sure you want to cancel your reservation at <strong>{{ tripToCancel?.title }}</strong>?</p>
    <div class="cute-actions">
      <button class="btn-keep" @click="showCancelModal = false">No, Keep it</button>
      <button class="btn-confirm-cancel" @click="confirmCancel">Yes, Cancel it</button>
    </div>
  </div>
</div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue"
import { useRouter } from "vue-router"
import { useFavorites } from "@/store/favorites.js"
import api from "@/services/api.js" 
import ItemCard from "@/components/ItemCard.vue"

const router = useRouter()
const { favoriteSet } = useFavorites()

const activeTab = ref("info")
const allItems = ref([]) 
const orders = ref([])   
const securityError = ref("")
const securitySuccess = ref("")

const calendarDate = ref(new Date())
const isModalOpen = ref(false)
const selectedDayEvents = ref([])
const selectedDateString = ref("")

const user = ref({ id: "", name: "", email: "", role: "" })  
const securityForm = ref({ currentPassword: "", newPassword: "", confirmPassword: "" })

// --- COMPUTED ---
const sidebarItems = computed(() => {
  const items = [
    { key: "info", label: "Overview", icon: "🏠" },
    { key: "favourites", label: "Favorites", icon: "❤️" },
    { key: "orders", label: "Trips", icon: "🧳" },
    { key: "security", label: "Security", icon: "🔐" }
  ]
  if (user.value.role === 'admin') items.push({ key: "admin", label: "Admin Panel", icon: "⚙️" })
  return items
})

// FIX: Added Safety Check for favoriteSet
const favoritedItems = computed(() => {
  if (!favoriteSet || !favoriteSet.value || !allItems.value) return []
  return allItems.value.filter(item => favoriteSet.value.has(item.id))
})

const userInitials = computed(() => user.value.name ? user.value.name.slice(0, 2).toUpperCase() : "DL")

// --- CALENDAR ---
const currentYear = computed(() => calendarDate.value.getFullYear())
const currentMonthName = computed(() => calendarDate.value.toLocaleString('default', { month: 'long' }))
const daysInMonth = computed(() => new Date(currentYear.value, calendarDate.value.getMonth() + 1, 0).getDate())
const paddingDays = computed(() => {
  const d = new Date(currentYear.value, calendarDate.value.getMonth(), 1).getDay()
  return d === 0 ? 6 : d - 1
})
const changeMonth = (offset) => calendarDate.value = new Date(calendarDate.value.setMonth(calendarDate.value.getMonth() + offset))
const isToday = (day) => {
  const t = new Date(); 
  return t.getDate() === day && t.getMonth() === calendarDate.value.getMonth() && t.getFullYear() === calendarDate.value.getFullYear()
}
const getEventsForDay = (day) => {
  const m = calendarDate.value.getMonth() + 1
  const dateStr = `${currentYear.value}-${String(m).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  return orders.value.filter(order => order.date === dateStr)
}
const openDayModal = (day) => {
  selectedDayEvents.value = getEventsForDay(day)
  selectedDateString.value = `${day} ${currentMonthName.value}`
  isModalOpen.value = true
}
const closeModal = () => { isModalOpen.value = false }

const updatePassword = () => { securitySuccess.value = "Password updated (demo)." }
const handleLogout = () => { localStorage.removeItem("user"); router.push("/login") }
// --- CANCEL LOGIC ADDITION ---
const showCancelModal = ref(false)
const tripToCancel = ref(null)

const promptCancel = (order) => {
  tripToCancel.value = order
  showCancelModal.value = true
}

const confirmCancel = async () => {
  if (!tripToCancel.value) return

  try {
    // Make sure your backend is running!
    const res = await fetch(`http://localhost:3000/api/cancel-booking/${tripToCancel.value.id}`, {
      method: 'POST'
    })

    if (res.ok) {
      // Find the trip in the list and mark it as cancelled instantly
      const index = orders.value.findIndex(o => o.id === tripToCancel.value.id)
      if (index !== -1) {
        orders.value[index].status = 'cancelled'
        orders.value[index].statusLabel = 'Cancelled'
      }
      showCancelModal.value = false
    } else {
      alert("Could not cancel. Please try again.")
    }
  } catch (err) {
    console.error(err)
  }
}
// --- FETCH ---
onMounted(async () => {
  const storedUser = localStorage.getItem("user")
  if (!storedUser) {
    router.push("/login")
    return
  }
  user.value = JSON.parse(storedUser)

  try {
    const itemsData = await api.getAllItems()
    allItems.value = itemsData

    const res = await fetch(`http://localhost:3000/api/my-bookings/${user.value.id}`)
    if (res.ok) {
      const data = await res.json()
      
      orders.value = data.map(b => ({
        id: b.order_id,
        title: b.product_name,
        // Map image safely
        image: b.product_image || 'https://via.placeholder.com/400x250?text=No+Image', 
        category: b.category,
        date: b.booking_date ? b.booking_date.split('T')[0] : '',
        time: b.booking_time,
        guests: b.guests,
        status: b.status,
        statusLabel: b.status ? b.status.charAt(0).toUpperCase() + b.status.slice(1) : 'Pending',
        // Total calculation
        total: b.product_price ? (b.guests * b.product_price) + ' €' : `${b.guests} Guests`
      }))
    }
  } catch (error) { console.error("Error:", error) }
})
</script>

<style scoped>
*{
  color : black;
}
/* BASE */
.account-shell { min-height: 100vh; background: radial-gradient(circle at top left, #f6f1dd 0, #fdfdfb 40%, #ffffff 100%); padding: 40px 0; }
.account-bg-blob { position: fixed; inset: 0; pointer-events: none; background: radial-gradient(circle at 10% 20%, rgba(212, 175, 55, 0.18) 0, transparent 45%), radial-gradient(circle at 90% 80%, rgba(104, 120, 93, 0.18) 0, transparent 45%); z-index: 0; }
.account-layout { position: relative; z-index: 1; max-width: 1180px; margin: 0 auto; display: grid; grid-template-columns: 280px minmax(0, 1fr); gap: 32px; padding-top: 1.43%; }

/* SIDEBAR */
.account-sidebar { background-color: rgba(255, 255, 255, 0.9); border-radius: 26px; box-shadow: 0 18px 45px rgba(0, 0, 0, 0.06); padding: 22px 20px 20px; display: flex; flex-direction: column; gap: 24px; border: 1px solid rgba(225, 219, 196, 0.9); height: fit-content; }
.account-profile-card { display: flex; flex-direction: column; gap: 14px; }
.avatar-wrapper { display: flex; align-items: flex-end; gap: 10px; }
.avatar-circle { width: 64px; height: 64px; border-radius: 50%; background: linear-gradient(135deg, #d4af37, #b1b18e); display: flex; align-items: center; justify-content: center; color: #fff; font-weight: 700; font-size: 22px; }
.avatar-hello { background: #fff; color: #b36b00; font-size: 12px; padding: 4px 10px; border-radius: 999px; box-shadow: 0 6px 14px rgba(0, 0, 0, 0.08); }
.profile-text { display: flex; flex-direction: column; gap: 2px; }
.profile-name { margin: 0; font-size: 20px; font-weight: 700; color: #2c2c2c; }
.profile-email { margin: 0; font-size: 13px; color: #7b7b7b; }
.profile-tagline { margin: 6px 0 0; font-size: 13px; color: #5c5c5c; }
.profile-badges { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 4px; }
.badge-chip { font-size: 11px; padding: 5px 10px; border-radius: 999px; background: #f0f3e9; color: #556056; }
.badge-chip-gold { background: #fff6dd; color: #8c6a18; }
.badge-chip-admin { background: #324c3f; color: #fff; font-weight: bold; }
.sidebar-nav { display: flex; flex-direction: column; gap: 6px; }
.sidebar-link { border: none; outline: none; background: transparent; cursor: pointer; display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 12px; font-size: 14px; color: #444; transition: all 0.2s ease; }
.sidebar-icon { width: 28px; height: 28px; border-radius: 999px; background: #f3f4f6; display: flex; align-items: center; justify-content: center; }
.sidebar-link.active { background: linear-gradient(135deg, #d4af37, #b1b18e); color: #fff; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.12); }
.sidebar-link.active .sidebar-icon { background: rgba(255, 255, 255, 0.3); }

/* CONTENT */
.account-main { background-color: rgba(255, 255, 255, 0.9); border-radius: 26px; box-shadow: 0 18px 45px rgba(0, 0, 0, 0.05); border: 1px solid rgba(231, 225, 205, 0.9); padding: 26px 26px 30px; display: flex; flex-direction: column; gap: 22px; min-height: 600px; }
.top-cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; }
.top-card { background: #f9f6ec; border-radius: 20px; padding: 14px 16px; display: flex; align-items: flex-start; gap: 10px; }
.top-card-icon { width: 36px; height: 36px; border-radius: 12px; background: linear-gradient(135deg, #d4af37, #b1b18e); display: flex; align-items: center; justify-content: center; color: #fff; }
.top-card h3 { margin: 0; font-size: 15px; color: #333; } .top-card p { margin: 3px 0 0; font-size: 13px; color: #666; }
.panel { background: #ffffff; border-radius: 22px; padding: 20px 20px 24px; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.03); animation: fadeIn 0.3s ease; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
.panel-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 16px; }
.panel-header h2 { margin: 0; font-size: 20px; color: #222; } .panel-header p { margin: 4px 0 0; font-size: 13px; color: #777; }

/* === CARD GRID STYLE (THE BEAUTIFUL PART) === */
.transparent-panel { background: transparent !important; box-shadow: none !important; padding: 0 !important; }
.orders-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 24px; margin-top: 20px; }
.trip-card { background: white; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.05); transition: transform 0.3s ease, box-shadow 0.3s ease; border: 1px solid #f0f0f0; display: flex; flex-direction: column; }
.trip-card:hover { transform: translateY(-5px); box-shadow: 0 15px 35px rgba(0,0,0,0.1); }
.trip-image { height: 160px; background-size: cover; background-position: center; position: relative; }
.trip-overlay { position: absolute; top: 12px; left: 12px; right: 12px; display: flex; justify-content: space-between; }
.trip-category { background: rgba(0, 0, 0, 0.6); backdrop-filter: blur(4px); color: white; font-size: 10px; text-transform: uppercase; letter-spacing: 1px; padding: 4px 10px; border-radius: 20px; font-weight: 700; }
.trip-status { font-size: 11px; padding: 4px 10px; border-radius: 20px; font-weight: 600; text-transform: capitalize; }
.status-pending { background: #fff8e1; color: #f39c12; border: 1px solid #f39c12; }
.status-confirmed { background: #e8f5e9; color: #27ae60; border: 1px solid #27ae60; }
.trip-details { padding: 20px; display: flex; flex-direction: column; flex-grow: 1; }
.trip-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px; }
.trip-header h3 { margin: 0; font-size: 18px; font-weight: 700; color: #2c3e50; line-height: 1.3; }
.trip-id { font-size: 11px; color: #999; margin-top: 2px; }
.trip-info-row { display: flex; gap: 15px; margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px dashed #eee; }
.info-item { display: flex; align-items: center; gap: 6px; font-size: 13px; color: #555; }
.trip-footer { margin-top: auto; display: flex; justify-content: space-between; align-items: center; }
.trip-guests { font-size: 13px; color: #666; font-weight: 500; }
.trip-price { font-size: 16px; font-weight: 700; color: #324c3f; }

/* CALENDAR & OTHER STYLES */
.info-grid { display: grid; grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr); gap: 18px; }
.info-card { background: #fdfdfd; border-radius: 18px; padding: 16px; border: 1px solid #ece7d6; }
.info-row { display: flex; justify-content: space-between; padding: 7px 0; border-bottom: 1px dashed #eee4ce; font-size: 13px; }
.info-row:last-child { border-bottom: none; }
.info-label { color: #777; } .info-value { font-weight: 600; color: #333; }
.soft-card { background: #fbfaf5; }
.stats-row { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 8px; }
.stat-pill { padding: 8px 10px; border-radius: 14px; background: #ffffff; border: 1px solid #eee1c9; min-width: 90px; }
.stat-label { display: block; font-size: 11px; color: #8b7a53; } .stat-value { font-size: 15px; font-weight: 600; color: #3b3b2a; }
.info-note { margin-top: 10px; font-size: 12px; color: #7d7d7d; }
.calendar-container { margin-top: 24px; background: #fffdf7; border: 1px solid #efe3c8; border-radius: 18px; padding: 16px; }
.calendar-header-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; }
.calendar-controls { display: flex; align-items: center; gap: 12px; font-size: 14px; font-weight: 600; }
.calendar-controls button { background: transparent; border: 1px solid #d4af37; color: #d4af37; width: 24px; height: 24px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; }
.calendar-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 6px; }
.cal-weekday { text-align: center; font-size: 11px; font-weight: 600; color: #999; padding-bottom: 4px; }
.cal-day { background: #fff; border: 1px solid #f2edd9; border-radius: 8px; min-height: 60px; padding: 4px; display: flex; flex-direction: column; align-items: flex-start; position: relative; transition: transform 0.1s ease; }
.clickable-day:hover { border-color: #d4af37; transform: translateY(-2px); box-shadow: 0 4px 8px rgba(212, 175, 55, 0.15); z-index: 2; }
.cal-date-num { font-size: 11px; font-weight: 600; color: #555; }
.is-today { background: #fff9e6; border-color: #d4af37; }
.cal-events { width: 100%; display: flex; flex-direction: column; gap: 2px; }
.cal-event-pill { font-size: 9px; padding: 2px 4px; border-radius: 4px; width: 100%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-weight: 600; }
.pill-pending { background: #fff4d6; color: #94621b; }
.favorites-grid { margin-top: 6px; display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 18px; }
.empty-state { text-align: center; padding: 30px 16px 10px; }
.empty-btn { display: inline-block; padding: 9px 22px; border-radius: 999px; background: linear-gradient(135deg, #d4af37, #b1b18e); color: #fff; text-decoration: none; font-size: 13px; font-weight: 600; box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15); }
.security-layout { display: grid; grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr); gap: 18px; }
.form { display: flex; flex-direction: column; gap: 10px; margin-top: 8px; }
.form-group { display: flex; flex-direction: column; gap: 4px; }
.input { padding: 9px 10px; border-radius: 10px; border: 1px solid #e0d5bf; font-size: 13px; background: #fffdf7; }
.input:focus { outline: none; border-color: #c7a44b; box-shadow: 0 0 0 2px rgba(212, 175, 55, 0.18); }
.primary-btn { align-self: flex-start; margin-top: 6px; padding: 9px 26px; border-radius: 999px; border: none; cursor: pointer; background: linear-gradient(135deg, #3b4a3f, #1f2622); color: #fff; font-size: 13px; font-weight: 600; box-shadow: 0 13px 24px rgba(0, 0, 0, 0.2); }
.tips-list { margin: 8px 0 0; padding-left: 18px; font-size: 12px; color: #6a6a6a; }
.modal-backdrop { position: fixed; inset: 0; background: rgba(0, 0, 0, 0.4); backdrop-filter: blur(2px); z-index: 100; display: flex; align-items: center; justify-content: center; animation: fadeIn 0.2s ease; }
.modal-card { background: #fff; border-radius: 20px; padding: 20px; width: 90%; max-width: 400px; box-shadow: 0 15px 40px rgba(0,0,0,0.15); transform: scale(0.95); animation: popIn 0.2s ease forwards; }
.modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; border-bottom: 1px solid #eee; padding-bottom: 10px; }
.modal-close-btn { background: transparent; border: none; font-size: 18px; cursor: pointer; color: #888; }
.modal-event-item { display: flex; gap: 12px; padding: 10px 0; border-bottom: 1px dashed #eee; }
.event-time { font-size: 12px; font-weight: 600; color: #d4af37; min-width: 60px; }
.event-details { display: flex; flex-direction: column; gap: 4px; }
.event-title { font-weight: 600; font-size: 14px; color: #222; }
.modal-empty { text-align: center; padding: 20px 0; color: #777; font-size: 14px; }
.empty-btn-small { display: inline-block; margin-top: 10px; font-size: 12px; color: #d4af37; text-decoration: none; font-weight: 600; }

/* RESPONSIVE */
@media (max-width: 950px) { .account-layout { grid-template-columns: 1fr; } .account-sidebar { flex-direction: row; align-items: center; justify-content: space-between; padding: 16px 18px; } .account-profile-card { flex: 1; } .sidebar-nav { flex-direction: row; flex-wrap: wrap; justify-content: flex-end; gap: 8px; max-width: 260px; } }
@media (max-width: 720px) { .info-grid, .security-layout { grid-template-columns: 1fr; } .account-main { padding: 20px 16px 22px; } }
@media (max-width: 520px) { .account-shell { padding: 20px 10px 24px; } .account-sidebar { flex-direction: column; align-items: flex-start; } .sidebar-nav { width: 100%; justify-content: flex-start; } .logout-btn-red { width: 100%; margin-top: 20px; } }
/* --- CANCEL BUTTON & MODAL STYLES --- */
.btn-cancel-trip {
  width: 100%;
  background: transparent;
  border: 1px solid #e74c3c;
  color: #e74c3c;
  padding: 8px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s;
  margin-top: 10px;
}
.btn-cancel-trip:hover {
  background: #e74c3c;
  color: white;
}

.cute-modal {
  text-align: center;
  max-width: 320px !important;
}
.cute-icon {
  font-size: 40px;
  margin-bottom: 10px;
}
.cute-actions {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-top: 20px;
}
.btn-keep {
  background: #eee;
  border: none;
  padding: 10px 20px;
  border-radius: 20px;
  cursor: pointer;
  font-weight: 600;
  color: #555;
}
.btn-confirm-cancel {
  background: #e74c3c;
  border: none;
  padding: 10px 20px;
  border-radius: 20px;
  cursor: pointer;
  font-weight: 600;
  color: white;
}
</style>