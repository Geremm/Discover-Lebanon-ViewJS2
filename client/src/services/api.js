const BASE_URL = 'http://localhost:3000/api';

export default {
  async _fetchData(endpoint, option={}) {
    const response = await fetch(`${BASE_URL}${endpoint}`, option);
    console.log("Baha")

    if (!response.ok) {
      throw new Error(`Erreur HTTP ! statut : ${response.status}`);
    }

    return await response.json();
  },

  async getItemsByCategory(category) {
    return this._fetchData(`/items?category=${category}`);
  },

  // CORRECTION ICI : J'ai retiré le "a" qui trainait après {
  async getItemById(id) { 
    return this._fetchData(`/item/${id}`);
  },

  async getAllItems() {
    return this._fetchData('/items');
  },

  async deleteProduct(id) {
    return this._fetchData(`/products/${id}`, {
      method: 'DELETE'
    });
  },
};