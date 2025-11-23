const BASE_URL = 'http://localhost:3000/api';

export default {
  async _fetchData(endpoint) {
    const response = await fetch(`${BASE_URL}${endpoint}`);

    if (!response.ok) {
      throw new Error(`Erreur HTTP ! statut : ${response.status}`);
    }

    return await response.json();
  },

  async getItemsByCategory(category) {
    return this._fetchData(`/items?category=${category}`);
  },

  async getItemById(id) {
    return this._fetchData(`/item/${id}`);
  },

  async getAllItems() {
    return this._fetchData('/items'); // Appelle l'API pour avoir tout
  },
};