import { createRouter, createWebHistory } from 'vue-router'
//import { nextTick } from 'vue'
import HomeView from '../views/HomeView.vue'
import ReservationView from '../views/ReservationView.vue' // <--- IMPORT THIS

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/reserve/:id',
    name: 'reservation',
    component: ReservationView
  },
  {
    path: '/places',
    name: 'places',
    component: () => import('../views/CategoryView.vue'),
    props: { category: 'places' }
  },
  {
    path: '/places/:id',
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
    props: { category: 'hotels' }
  },
  {
    path: '/restaurants',
    name: 'restaurants',
    component: () => import('../views/CategoryView.vue'),
    props: { category: 'restaurants' }
  },
  {
    path: '/activities',
    name: 'activities',
    component: () => import('../views/CategoryView.vue'),
    props: { category: 'activities' }
  },
  {
    path: '/activities/:id',
    name: 'activity-detail',
    component: () => import('../views/DetailView.vue') 
  },
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
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/LoginView.vue')
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('../views/RegisterView.vue')
  },
  {
    path: '/account',
    name: 'account',
    component: () => import('../views/MyAccountView.vue'),
    meta: { showLogout: true }
  },
  {
    path: '/contact',
    name: 'contact',
    component: () => import('../views/ContactView.vue')
  }
  

]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
//   scrollBehavior(to, from, savedPosition) {
//     // 1) retour arrière / avant : garder la position
//     if (savedPosition) {
//       return savedPosition
//     }

//     // 2) si on a un hash (#xxxx)
//     if (to.hash) {
//       // on attend que la page soit rendue avant de scroller
//       return new Promise((resolve) => {
//         nextTick(() => {
//           resolve({
//             el: to.hash,      // cible un élément avec id="xxxx"
//             behavior: 'smooth'
//           })
//         })
//       })
//     }

//     // 3) par défaut, remonter en haut
//     return { top: 0 }
//   }
})

export default router
