// src/data/items.js
export const allItems = [
  // --- Hôtels ---
  { id: 201, category: 'hotels', subCategory: 'luxury', name: "Kempinski Summerland", /* ... */ },
  { id: 202, category: 'hotels', subCategory: 'luxury', name: "Phoenicia Beirut", /* ... */ },
  { id: 203, category: 'hotels', subCategory: 'boutique', name: "Albergo Hotel", /* ... */ },
  { id: 204, category: 'hotels', subCategory: 'budget', name: "Princessa Hotel", /* ... */ },
  // ... ajoutez tous vos hôtels avec leur subCategory ('luxury', 'boutique', 'budget')

  // --- Restaurants ---
  { id: 301, category: 'restaurants', subCategory: 'lebanese', name: "Em Sherif", /* ... */ },
  { id: 302, category: 'restaurants', subCategory: 'italian', name: "Portofino", /* ... */ },
  { id: 303, category: 'restaurants', subCategory: 'a', name: "Roadster Diner", /* ... */ },
  // ... ajoutez tous vos restaurants avec leur subCategory ('lebanese', 'french', 'italian', 'fast')

  // --- Activités ---
  // Les activités n'ont pas de sous-catégories dans votre HTML, on peut leur en donner une par défaut
  { id: 401, category: 'activities', subCategory: 'all', name: "Batroun Beach Day", /* ... */ },
  { id: 402, category: 'activities', subCategory: 'all', name: "Jounieh Téléférique Ride", /* ... */ },
  // ...
];