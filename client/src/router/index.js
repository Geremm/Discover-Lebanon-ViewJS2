import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  // VÉRIFIEZ ATTENTIVEMENT CE BLOC
  {
    path: '/places', // <-- Le chemin est-il correct ?
    name: 'places',
    // Le chemin vers le fichier de la vue est-il correct ?
    component: () => import('../views/PlacesView.vue')
  },
  {
    path: '/places/:id', // Correspond à des URLs comme /places/1, /places/2, etc.
    name: 'place-detail',
    component: () => import('../views/DetailView.vue')
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('../views/AboutView.vue')
  },
  {
    path: '/plan-your-trip',
    name: 'plan-your-trip',
    component: () => import('../views/PlanView.vue')
  },
  {
    path: '/chatbot',
    name:'chatbot',
    component: () => import('../views/ChatbotView.vue')
  },
  {
    path: '/reserve',
    name: 'reserve',
    component: () => import('../views/ReserveView.vue') 
  },
  {
    path: '/hotels',
    name: 'hotels',
    component: () => import('../views/CategoryView.vue'),
    props: { category: 'hotels' } // On dit au composant d'afficher les hôtels
  },
  {
    path: '/restaurants',
    name: 'restaurants',
    component: () => import('../views/CategoryView.vue'),
    props: { category: 'restaurants' } // On lui dit d'afficher les restaurants
  },
  {
    path: '/activities',
    name: 'activities',
    component: () => import('../views/CategoryView.vue'),
    props: { category: 'activities' } // On lui dit d'afficher les activités
  },
  {
    path: '/activities/:id',
    name: 'activity-detail',
    component: () => import('../views/DetailView.vue') 
  },
  
  // Pour Hotels et Restaurants (layout avec carte)
  {
    path: '/hotels/:id',
    name: 'hotel-detail',
    component: () => import('../views/DetailMapView.vue')
  },
  {
    path: '/restaurants/:id',
    name: 'restaurant-detail',
    component: () => import('../views/DetailMapView.vue')
  },
  {
    path: '/favorites',
    name: 'favorites',
    component: () => import('../views/FavoritesView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router