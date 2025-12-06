const BASE_URL = 'http://localhost:3000/api';

export default {
  async _fetchData(endpoint, options = {}) {
    const defaultHeaders = {
      'Content-Type': 'application/json',
    };

    const token = localStorage.getItem('token');
    if (token) {
      defaultHeaders['Authorization'] = `Bearer ${token}`;
    }

    const config = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, config)
      if (response.status === 401 || response.status === 403) {
        console.warn("Session expirée. Déconnexion...");
        localStorage.removeItem('token');
        localStorage.removeItem('user'); 
        window.location.href = '/login'; 
        throw new Error("Session expirée");
      }

      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Erreur ${response.status}`);
      }

      if (response.status === 204) return null;

      return await response.json();
    } catch (error) {
      console.error(`Erreur API sur ${endpoint}:`, error);
      throw error;
    }
  },

  async login(credentials) {
    // credentials = { email, password }
    return this._fetchData('/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
  },

  async register(userData) {
    // userData = { name, email, password }
    return this._fetchData('/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  },

  async updateProfileName(userId, name) {
    return this._fetchData(`/users/${userId}`, {
      method: 'POST',
      body: JSON.stringify({ name })
    });
  },

  async updatePassword(userId, passwordData) {
    // passwordData = { currentPassword, newPassword }
    return this._fetchData(`/users/${userId}/password`, {
      method: 'PUT',
      body: JSON.stringify(passwordData)
    });
  },

  async getAllItems() {
    return this._fetchData('/items');
  },

  async getItemsByCategory(category) {
    return this._fetchData(`/items?category=${category}`);
  },

  async getItemById(id) {
    return this._fetchData(`/item/${id}`);
  },

  async getMyFavorites(userId) {
    return this._fetchData(`/favorites/${userId}`);
  },

  async addFavorite(userId, productId) {
    return this._fetchData('/favorites', {
      method: 'POST',
      body: JSON.stringify({ userId, productId })
    });
  },

  async removeFavorite(userId, productId) {
    return this._fetchData(`/favorites/${userId}/${productId}`, {
      method: 'DELETE'
    });
  },

  async createBooking(bookingData) {
    // bookingData = { userId, productId, date, time, guests, notes }
    return this._fetchData('/reserve', {
      method: 'POST',
      body: JSON.stringify(bookingData)
    });
  },

  async getMyBookings(userId) {
    return this._fetchData(`/my-bookings/${userId}`);
  },

  async cancelBooking(bookingId) {
    return this._fetchData(`/cancel-booking/${bookingId}`, {
      method: 'POST'
    });
  },

  async getAdminBookings() {
    return this._fetchData('/admin/bookings');
  },

  async completeBooking(bookingId) {
    return this._fetchData(`/admin/bookings/${bookingId}/complete`, {
      method: 'PUT'
    });
  },

  async pendingBooking(bookingId) {
    return this._fetchData(`/admin/bookings/${bookingId}/pending`, {
      method: 'PUT'
    });
  },

  async deleteBooking(bookingId) {
    return this._fetchData(`/admin/bookings/delete/${bookingId}`, {
      method: 'DELETE'
    });
  },
  async createProduct(productData) {
    return this._fetchData('/admin/products', {
      method: 'POST',
      body: JSON.stringify(productData)
    });
  },

  async deleteProduct(productId) {
    return this._fetchData(`/admin/products/${productId}`, {
      method: 'DELETE'
    });
  },

  async reserve(bookingData) {
    return this._fetchData('/reserve', {
      method: 'POST',
      body: JSON.stringify(bookingData)
    });
  }

};