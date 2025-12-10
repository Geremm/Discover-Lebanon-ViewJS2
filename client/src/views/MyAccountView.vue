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
            <div v-if="!isEditingName" class="name-display">
              <h2 class="profile-name">{{ user && user.name ? user.name : 'Traveler' }}<button class="edit-btn"
                  title="Edit name" @click="isEditingName = true"> 🖍 </button></h2>
            </div>
            <div v-else class="name-edit">
              <input ref="nameInput" v-model="tempName" type="text" class="edit-input" @keyup.enter="saveName"
                @keyup.esc="cancelEdit" />
              <button class="action-btn-small" @click="saveName">✔</button>
              <button class="action-btn-small-rmv" @click="isEditingName = false">✕</button>
            </div>
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
          <button v-for="item in sidebarItems" :key="item.key" class="sidebar-link"
            :class="{ active: activeTab === item.key }" @click="activeTab = item.key">
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
            <div class="top-card-icon">❤️</div>
            <div>
              <h3>Favorites</h3>
              <p>{{ favoritedItems.length }} place{{ favoritedItems.length !== 1 ? 's' : '' }} saved.</p>
            </div>
          </div>

          <div class="top-card">
            <div class="top-card-icon">🧳</div>
            <div>
              <h3>Reservations</h3>
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
                  <span class="stat-label">Reservation</span>
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

              <div v-for="pad in paddingDays" :key="'pad-' + pad" class="cal-day cal-day-empty"></div>

              <div v-for="day in daysInMonth" :key="day" class="cal-day clickable-day"
                :class="{ 'is-today': isToday(day) }" @click="openDayModal(day)">
                <span class="cal-date-num">{{ day }}</span>

                <div class="cal-events">
                  <div v-for="event in getEventsForDay(day)" :key="event.id" class="cal-event-pill"
                    :class="'pill-' + event.status">
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
            <ItemCard v-for="item in favoritedItems" :key="item.id" :id="item.id" :category="item.category"
              :title="item.name" :description="item.shortDesc" :image="item.imageUrl" />
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
              <h2>Your Reservation</h2>
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
                <button v-if="order.status !== 'cancelled'" @click="promptCancel(order)" class="btn-cancel-trip">Cancel
                  Booking</button>
              </div>

            </div>
          </div>

          <div v-else class="empty-state">
            <div class="empty-illustration">🧳</div>
            <h3>No reservation yet</h3>
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
            <div>
              <h2>Admin Dashboard</h2>
              <p>Manage system.</p>
            </div>
          </header>
          <div class="info-grid">
            <div class="admin-group" style="border: 1px solid black">
              <div class="info-card QA-section">
                <h3>Quick Actions</h3>
                <div class="info-row">
                  <div class="edit-buttons">
                    <button class="quick-action-btn" @click="showAddModal = true">
                      ➕ Add new place
                    </button>
                    <button class="quick-action-btn btn-remove" @click="showDeleteListModal = true">
                      ➖ Remove a place
                    </button>
                  </div>
                  <div class="stat-pill">
                    <span class="stat-label">Total Items</span>
                    <span class="stat-value">{{ nbItems }}</span>
                  </div>
                </div>
              </div>
              <div class="info-card cancel-card">
                <h3>Cancel Reservations</h3>
                <div class="info-row">
                  <div v-for="res in canceledReservations" :key="res.id" class="res-item-card">
                    <div class="res-content">
                      <div class="res-top">
                        <span class="res-id">Reservation n°{{ res.id }}</span>
                        <span class="res-date">{{ res.date + " " + res.hour }}</span>
                      </div>
                      <div class="res-main">
                        <span class="res-user">{{ res.user }}</span>
                        <span class="res-product">{{ res.item }}</span>
                      </div>
                    </div>
                    <button class="action-btn-del" @click="delFromBookingsDatabase(res.id)" title="Delete cancelled booking">
                      X
                    </button>
                  </div>
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
                          <span class="res-id">Reservation n°{{ res.id }}</span>
                          <span class="res-date">{{ res.date + " " + res.hour }}</span>
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
                          <span class="res-id">Reservation n°{{ res.id }}</span>
                          <span class="res-date">{{ res.date + " " + res.hour }}</span>
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
          <div v-if="showAddModal" class="modal-backdrop" @click="closeAddModal">
            <div class="modal-card add-place-modal" @click.stop>

              <div class="modal-header-row">
                <div class="cute-icon">✨</div>
                <h3>Add a New Gem</h3>
              </div>

              <form @submit.prevent="submitNewPlace" class="add-place-form">

                <div class="form-row">
                  <div class="form-group half">
                    <label>Category</label>
                    <select v-model="newPlace.category" required @change="newPlace.subCategory = ''">
                      <option disabled value="">Select...</option>
                      <option value="places">Places</option>
                      <option value="hotels">Hotels</option>
                      <option value="restaurants">Restaurants</option>
                      <option value="activities">Activities</option>
                    </select>
                  </div>

                  <div class="form-group half">
                    <label>Sub-Category</label>
                    <select v-model="newPlace.subCategory" required :disabled="!newPlace.category">
                      <option disabled value="">Select...</option>
                      <option v-for="sub in availableSubCategories" :key="sub" :value="sub">
                        {{ sub }}
                      </option>
                    </select>
                  </div>
                </div>

                <div class="form-row">
                  <div class="form-group half">
                    <label>Name (Short)</label>
                    <input v-model="newPlace.name" type="text" placeholder="e.g. 📍 Raouche" required />
                  </div>
                  <div class="form-group half">
                    <label>Full Title</label>
                    <input v-model="newPlace.title" type="text" placeholder="e.g. The Majestic Raouche Rock" required />
                  </div>
                </div>

                <div class="form-group">
                  <label>Short Description</label>
                  <input v-model="newPlace.shortDesc" type="text" placeholder="One line summary..." required />
                </div>

                <div class="form-group">
                  <label>Long Description</label>
                  <textarea v-model="newPlace.longDesc" rows="3" placeholder="Detailed story..." required></textarea>
                </div>

                <div class="form-row">
                  <div class="form-group half">
                    <label>Image Path</label>
                    <input v-model="newPlace.imageUrl" type="text" placeholder="/images/example.jpg" required />
                  </div>
                  <div class="form-group half">
                    <label>Price (Optional)</label>
                    <input v-model="newPlace.price" type="number" placeholder="€" />
                  </div>
                </div>

                <div class="form-row three-cols">
                  <div class="form-group">
                    <label>Lat</label>
                    <input v-model="newPlace.lat" type="number" step="any" placeholder="33.8..." />
                  </div>
                  <div class="form-group">
                    <label>Lng</label>
                    <input v-model="newPlace.lng" type="number" step="any" placeholder="35.5..." />
                  </div>
                  <div class="form-group">
                    <label>Phone</label>
                    <input v-model="newPlace.phone" type="text" placeholder="+961..." />
                  </div>
                </div>

                <div class="cute-actions">
                  <button type="button" class="btn-keep" @click="closeAddModal">Cancel</button>
                  <button type="submit" class="btn-confirm-add">Save Place</button>
                </div>

              </form>
            </div>            
          </div>

                        <div v-if="showDeleteListModal" class="modal-backdrop" @click="showDeleteListModal = false">
                <div class="modal-card delete-list-modal" @click.stop>
                  <div class="modal-header-row">
                    <div class="cute-icon">🗑️</div>
                    <h3>Manage Inventory</h3>
                  </div>
                  <p class="modal-subtitle">Select an item to remove it permanently.</p>

                  <div class="delete-list-container">
                    <div class="list-header">
                      <span>ID</span>
                      <span>Name</span>
                      <span>Category</span>
                      <span>Action</span>
                    </div>

                    <div class="scrollable-list">
                      <div v-for="item in allItems" :key="item.id" class="list-row">
                        <span class="row-id">#{{ item.id }}</span>
                        <span class="row-name">{{ item.name }}</span>
                        <span class="row-cat badge-chip">{{ item.category }}</span>
                        <button class="btn-icon-delete" @click="confirmDeletion(item)">✕</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div v-if="itemToDelete" class="modal-backdrop z-high" @click="cancelDeletion">
                <div class="modal-card cute-modal" @click.stop>
                  <div class="cute-icon">⚠️</div>
                  <h3>Are you sure?</h3>
                  <p>
                    You are about to delete <strong>{{ itemToDelete.name }}</strong>.
                    This will also delete all related reservations and favorites.
                  </p>
                  <div class="cute-actions">
                    <button class="btn-keep" @click="cancelDeletion">Cancel</button>
                    <button class="btn-confirm-cancel" @click="executeDelete">Yes, Delete it</button>
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
import { logout } from "@/store/auth.js"

const router = useRouter()
const { favoriteItems, initFavorites } = useFavorites()


const activeTab = ref("info")
const allItems = ref([])
const orders = ref([])
const securityError = ref("")
const securitySuccess = ref("")
const adminReservations = ref([])

const calendarDate = ref(new Date())
const isModalOpen = ref(false)
const selectedDayEvents = ref([])
const selectedDateString = ref("")

const user = ref({ id: "", name: "", email: "", role: "" })
const securityForm = ref({ currentPassword: "", newPassword: "", confirmPassword: "" })

const isEditingName = ref(false);
const tempName = ref("");

const showAddModal = ref(false);
const showDeleteListModal = ref(false);
const itemToDelete = ref(null);

const confirmDeletion = (item) => {
  itemToDelete.value = item;
};

const cancelDeletion = () => {
  itemToDelete.value = null;
};

const executeDelete = async () => {
  if (!itemToDelete.value) return;

  try {
    await api.deleteProduct(itemToDelete.value.id);
    console.log("Item deleted:", itemToDelete.value.id);
    
    allItems.value = allItems.value.filter(i => i.id !== itemToDelete.value.id);
    favoriteItems.value = favoriteItems.value.filter(i => i.id !== itemToDelete.value.id);

    adminReservations.value = adminReservations.value.filter(r => r.itemId !== itemToDelete.value.id);
    console.log("Orders before deletion:", orders.value);
    orders.value = orders.value.filter(o => o.itemId !== itemToDelete.value.id);
    itemToDelete.value = null; 
    
  } catch (error) {
    console.error("Erreur suppression:", error);
    alert("Could not delete item.");
  }
};

const initialFormState = {
  category: '',
  subCategory: '',
  name: '',
  title: '',
  shortDesc: '',
  longDesc: '',
  imageUrl: '',
  price: null,
  lat: null,
  lng: null,
  phone: null
};

const categoriesData = {
  places: ['Beirut', 'North', 'South', 'Bekaa'],
  restaurants: ['Lebanese', 'Italian', 'French', 'Street', 'Fast'],
  hotels: ['Luxury', 'Boutique', 'Budget'],
  activities: ['Outdoor', 'Cultural']
};

const newPlace = ref({ ...initialFormState });

const availableSubCategories = computed(() => {
  return newPlace.value.category ? categoriesData[newPlace.value.category] : [];
});

const closeAddModal = () => {
  showAddModal.value = false;
  newPlace.value = { ...initialFormState };
};

const submitNewPlace = async () => {
  try {
    await api.createProduct(newPlace.value);
    alert("New place added successfully! 🎉");
    closeAddModal();
    let itemsData = await api.getAllItems()
    allItems.value = itemsData 
  } catch (e) {
    alert("Error saving place: " + e.message);
  }
};




const saveName = async () => {
  if (tempName.value.trim() === "") return;
  const newName = tempName.value.trim();
  const oldName = user.value.name;
  user.value.name = newName;
  localStorage.setItem("user", JSON.stringify(user.value));
  isEditingName.value = false;

if (adminReservations.value.length > 0) {
    adminReservations.value.forEach(res => {
      if (res.user === oldName) {
        res.user = newName;
      }
    });
  }

  try {
    await api.updateProfileName(user.value.id, newName);
  } catch (error) {
    console.error("Erreur sauvegarde :", error);
    user.value.name = oldName;
    localStorage.setItem("user", JSON.stringify(user.value));
    alert("Error updating name : " + error.message);
  }
};

// --- COMPUTED ---
const nbItems = computed(() => {
  return allItems.value.length;
});
const sidebarItems = computed(() => {
  const items = [
    { key: "info", label: "Overview", icon: "🏠" },
    { key: "favourites", label: "Favorites", icon: "❤️" },
    { key: "orders", label: "Reservation", icon: "🧳" },
    { key: "security", label: "Security", icon: "🔐" }
  ]
  if (user.value.role === 'admin') items.push({ key: "admin", label: "Admin Panel", icon: "⚙️" })
  return items
})
const favoritedItems = computed(() => {
  return favoriteItems.value || [];
});

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

const canceledReservations = computed(() => {
  return adminReservations.value.filter(r => r.status === 'cancelled');
});

const delFromBookingsDatabase = async (id) => {
  const order_backup = orders.value.find(o => o.id === id);
  orders.value = orders.value.filter(o => o.id !== id);
  try {
    api.deleteBooking(id);
    adminReservations.value = adminReservations.value.filter(r => r.id !== id);
  } catch (e) {
    orders.value.push(order_backup);
    console.error("Erreur suppression:", e);
  }
};

const fetchAdminBookings = async () => {
  try {
    const data = await api.getAdminBookings();

    adminReservations.value = data.map(row => ({
      id: row.id,
      itemId: row.product_id,
      userId: row.user_id,
      user: row.user_name,     
      item: row.product_name,  
      date: row.booking_date,
      hour: row.booking_time,
      status: row.status
    }));
  } catch (e) {
    console.error("Erreur chargement admin:", e);
  }
};

const markAsProcessed = async (id) => {
  try {
    await api.completeBooking(id);

    const reservation = adminReservations.value.find(r => r.id === id);
    if (reservation) {
      reservation.status = 'completed';
      orders.value.forEach(order => {
        if (order.id === id) {
          order.status = 'completed';
          order.statusLabel = 'Completed';
        }
      });
    }
  } catch (e) {
    console.error("Erreur validation:", e);
  }
};

const markAsUnprocessed = async (id) => {
  try {
    await api.pendingBooking(id);

    const reservation = adminReservations.value.find(r => r.id === id);
    if (reservation) {
      reservation.status = 'pending';
      orders.value.forEach(order => {
        if (order.id === id) {
          order.status = 'pending';
          order.statusLabel = 'Pending';
        }
      });
    }
  } catch (e) {
    console.error("Erreur validation:", e);
  }
};



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

const handleLogout = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
  logout();
  initFavorites(user);
  router.push("/login")
}

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
    await api.cancelBooking(tripToCancel.value.id)

    const index = orders.value.findIndex(o => o.id === tripToCancel.value.id)
    if (index !== -1) {
      orders.value[index].status = 'cancelled'
      orders.value[index].statusLabel = 'Cancelled'
    }
    adminReservations.value.forEach(r => {
      if (r.id === tripToCancel.value.id) {
        r.status = 'cancelled';
      }
    })
    showCancelModal.value = false
  } catch (err) {
    console.error(err)
    alert("Cancel impossible : " + err.message)
  }
}


const updatePassword = async () => {
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

  try {
    securityError.value = "";
    securitySuccess.value = "";

    const payload = {
        currentPassword: securityForm.value.currentPassword,
        newPassword: securityForm.value.newPassword
    };
    await api.updatePassword(user.value.id, payload);

    securitySuccess.value = "Password updated successfully!";

    securityForm.value.currentPassword = "";
    securityForm.value.newPassword = "";
    securityForm.value.confirmPassword = "";

} catch (err) {
    console.error(err);
    securityError.value = err.message; 
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

  // Admin check
  if (user.value && user.value.role === 'admin') {
      fetchAdminBookings();
  }

  try {
    const itemsData = await api.getAllItems()
    allItems.value = itemsData

    const bookingsData = await api.getMyBookings(user.value.id);
    
    orders.value = bookingsData.map(b => {
      let displayTitle = b.product_name;
      let displayImage = b.product_image;

      if (!displayTitle && b.notes && b.notes.includes('Custom Trip:')) {
          displayTitle = b.notes.split('Custom Trip:')[1]; 
          displayImage = ''; 
      }

      return {
        id: b.order_id,
        title: displayTitle || 'Custom Trip', 
        image: displayImage || 'https://via.placeholder.com/400x250?text=No+Image',
        category: b.category || 'Trip', 
        date: b.booking_date ? b.booking_date.split('T')[0] : '',
        time: b.booking_time,
        guests: b.guests,
        status: b.status,
        statusLabel: b.status ? b.status.charAt(0).toUpperCase() + b.status.slice(1) : 'Pending',
        total: b.product_price ? (b.guests * b.product_price) + ' €' : `${b.guests} Guests`
      };
    })
  } catch (error) {
    console.error("Error fetching account data:", error)
  }
})
</script>

<style scoped>
* {
  color: black;
}

.account-shell {
  min-height: 100vh;
  background: linear-gradient(to bottom, #c3a52d 0, #fff8dc 15%, #ffffff 100%);
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
  color: black;
  font-size: 34px;
  font-family :serif;
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
  from {
    opacity: 0;
    transform: translateY(5px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
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

.info-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr);
  gap: 18px;
}

.admin-group {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: 4fr 6fr;
  gap: 20px;
  width: 100%;
  margin-bottom: 25px;
  border: none !important;
}

.info-card {
  background: #fdfdfd;
  border-radius: 18px;
  padding: 16px 16px 18px;
  border: 1px solid #ece7d6;
}

.cancel-card .info-row {
  display: flex;
  flex-direction: column;
  gap: 10px;
  height: 100%;
  max-height: 125px;
  overflow-y: auto;
  width: 100%;
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
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
  transform: scale(0.95);
  animation: popIn 0.2s ease forwards;
}

@keyframes popIn {
  to {
    transform: scale(1);
  }
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

.tips-list li+li {
  margin-top: 4px;
}

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
.res-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 350px;
  overflow-y: auto;
  padding-right: 5px;
}

.res-item-card {
  width: 100%;
  box-sizing: border-box;
  background: white;
  padding: 12px;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.04);
  border-left: 4px solid #d97706;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: transform 0.2s;
}

.res-item-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
}

.done-item {
  border-left: 4px solid #10b981;
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

.res-id {
  font-weight: bold;
}

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
  color: #960505;
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


.action-btn-small {
  background: #ecfdf5;
  color: #059669;
  border: 1px solid #d1fae5;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  transition: all 0.2s;
}

.action-btn-small:hover {
  background: #10b981;
  color: white;
  transform: scale(1.1);
}

.action-btn-small-rmv {
  background: #fdecec;
  color: #960505;
  border: 1px solid #fad1d1;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  transition: all 0.2s;
}

.action-btn-small-rmv:hover {
  background: #b91010;
  color: white;
  transform: scale(1.1);
}

.action-btn-del {
  background: #d7d3d3;
  color: #7a7a7a;
  border: 1px solid #c6c6c6;
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

.action-btn-del:hover {
  background: #bdbebe;
  color: white;
  transform: scale(1.1);
}

.name-edit {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-direction: row;
}

.edit-input {
  border: 1px solid #d8b723;
  border-radius: 8px;
  padding: 4px 8px;
  font-size: 0.85rem;
  width: 120px;
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

.edit-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
  color: #9ca3af;
  padding: 5px;
  transition: all 0.2s ease;
  vertical-align: middle;
}

.edit-btn:hover {
  color: #333;
  transform: scale(1.2) rotate(15deg);
}

.transparent-panel {
  background: transparent !important;
  box-shadow: none !important;
  padding: 0 !important;
}

.orders-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
  margin-top: 20px;
}

.trip-card {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: 1px solid #f0f0f0;
  display: flex;
  flex-direction: column;
}

.trip-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
}

.trip-image {
  height: 160px;
  background-size: cover;
  background-position: center;
  position: relative;
}

.trip-overlay {
  position: absolute;
  top: 12px;
  left: 12px;
  right: 12px;
  display: flex;
  justify-content: space-between;
}

.trip-category {
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  color: white;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 1px;
  padding: 4px 10px;
  border-radius: 20px;
  font-weight: 700;
}

.trip-status {
  font-size: 11px;
  padding: 4px 10px;
  border-radius: 20px;
  font-weight: 600;
  text-transform: capitalize;
}

.status-pending {
  background: #fff8e1;
  color: #f39c12;
  border: 1px solid #f39c12;
}

.status-confirmed {
  background: #e8f5e9;
  color: #27ae60;
  border: 1px solid #27ae60;
}

.trip-details {
  padding: 20px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.trip-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.trip-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: #2c3e50;
  line-height: 1.3;
}

.trip-id {
  font-size: 11px;
  color: #999;
  margin-top: 2px;
}

.trip-info-row {
  display: flex;
  gap: 15px;
  margin-bottom: 15px;
  padding-bottom: 15px;
  border-bottom: 1px dashed #eee;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #555;
}

.trip-footer {
  margin-top: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.trip-guests {
  font-size: 13px;
  color: #666;
  font-weight: 500;
}

.trip-price {
  font-size: 16px;
  font-weight: 700;
  color: #324c3f;
}

@media (max-width: 768px) {
  .reservation-grid {
    grid-template-columns: 1fr;
  }

  .reservation-card {
    grid-column: span 1;
  }
}

@media (max-width: 950px) {
  .account-layout {
    grid-template-columns: 1fr;
  }

  .calendar-grid{
    gap:0px;
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

  .cal-event-pill{
    white-space: normal;
  }

  .account-shell{
    padding-top: 20%;
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
    padding: 20% 10px 24px;
  }

  .account-sidebar {
    flex-direction: column;
    align-items: flex-start;
  }

  .sidebar-nav {
    width: 100%;
    justify-content: flex-start;
  }
}


@media (max-width: 992px) {
  .admin-group {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .info-card {
    height: auto;
    min-height: 200px;
  }
  .cancel-card .info-row {
    max-height: 350px;
  }
}

@media (max-width: 480px) {
  .res-item-card {
    padding: 10px;
  }

  .res-main {
    flex-direction: column;
    align-items: flex-start;
  }

  .res-user {
    font-size: 0.95rem;
    margin-bottom: 2px;
  }

  .res-product {
    font-size: 0.8rem;
  }

  .res-top {
    font-size: 0.7rem;
  }
}

.logout-btn-red {
  width: 100%;
  margin-top: 20px;
  padding: 14px;
  border: none;

  border-radius: 50px;

  background: linear-gradient(135deg, #ff9a9e 0%, #ff6b6b 100%);

  color: white;
  font-weight: 700;
  font-size: 14px;
  letter-spacing: 0.5px;
  cursor: pointer;

  box-shadow: 0 10px 20px rgba(255, 107, 107, 0.3);

  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);

  display: flex;
  align-items: center;
  justify-content: center;
}

.logout-btn-red:hover {
  transform: translateY(-3px) scale(1.02);
  box-shadow: 0 15px 30px rgba(255, 107, 107, 0.4);
}

.logout-btn-red:active {
  transform: scale(0.95);
  box-shadow: 0 5px 15px rgba(255, 107, 107, 0.2);
}

.add-place-modal {
  width: 600px;
  max-width: 95%;
  max-height: 90vh;
  overflow-y: auto;
  padding: 25px;
  background: #fff;
  border-radius: 16px;
  margin-top:2%;
}

.modal-header-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 10px;
}

.add-place-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.form-row {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.half {
  flex: 1;
}

.form-group {
  flex: 1;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.form-group label {
  font-size: 0.85rem;
  font-weight: 600;
  color: #64748b;
}

.form-group input,
.form-group select,
.form-group textarea {
  padding: 10px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.95rem;
  transition: border-color 0.2s;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  border-color: #D4AF37;
  outline: none;
}

.btn-confirm-add {
  background: #10b981;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  transition: transform 0.1s;
}

.btn-confirm-add:hover {
  background: #059669;
  transform: scale(1.02);
}

.quick-action-btn {
  background: none;
  border: none;
  color: #0f172a;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1rem;
  padding: 0;
}

.quick-action-btn:hover {
  color: #2563eb;
}

.btn-remove {
  color: #e11d48;
  margin-top: 5px;
}
.btn-remove:hover {
  color: #be123c;
  background-color: #fff1f2;
  border-radius: 5px;
}

.delete-list-modal {
  width: 500px;
  max-width: 95%;
  padding: 25px;
  background: #fff;
  border-radius: 16px;
}

.modal-subtitle {
  color: #64748b;
  margin-bottom: 15px;
  font-size: 0.9rem;
}

.delete-list-container {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
}

.list-header {
  display: grid;
  grid-template-columns: 50px 1fr 100px 50px;
  background: #f8fafc;
  padding: 10px;
  font-weight: bold;
  font-size: 0.85rem;
  color: #475569;
  border-bottom: 1px solid #e2e8f0;
}

.scrollable-list {
  max-height: 300px;
  overflow-y: auto;
}

.list-row {
  display: grid;
  grid-template-columns: 50px 1fr 100px 50px;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #f1f5f9;
  font-size: 0.9rem;
  transition: background 0.1s;
}

.list-row:hover {
  background: #fef2f2; 
}

.row-id { color: #94a3b8; font-size: 0.8rem; }
.row-name { font-weight: 600; color: #334155; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.row-cat { font-size: 0.7rem; text-align: center; }
.btn-icon-delete {
  background: none;
  border: none;
  color: #ef4444;
  font-weight: bold;
  cursor: pointer;
  font-size: 1rem;
}
.btn-icon-delete:hover {
  transform: scale(1.2);
}

.z-high {
  z-index: 10000 !important;
}

.edit-buttons{
  display: flex;
  gap: 10px;
  margin-top: 10px;
  flex-direction: column;
}
</style>