<template>
    <div>
        <div v-if="!place">
            <p>Place not found. </p>
        </div>
        <div v-else>
            <section class="baalbek-hero">
                <div class="baalbek-overlay"></div>
                <div class="baalbek-text fade-in" id="baalbekText">
                    <h1 class="hero-title">{{ place.title }}</h1>
                <p>{{place.longDesc}}</p>
                </div>
            </section>
        </div>    
    </div>
</template>

<script setup>

import { computed, onMounted, onUnmounted} from 'vue';
import { useRoute } from 'vue-router';
import { allItems } from '@/data/database.js';
console.log(allItems);

// --- Données ---
// IMPORTANT : Pour que cela fonctionne, nous avons besoin de la même liste de lieux que dans PlacesView.vue.
// Plus tard, nous centraliserons ces données.
// const allPlaces = [
//   // Beirut
//   { id: 1, name: '📍 Raouche Rock', shortDesc: 'Iconic coastal landmark, perfect for sunset views.', longDesc: 'Les rochers de Raouché sont un repère naturel emblématique de Beyrouth. Ces formations rocheuses majestueuses, situées au large de la côte, offrent des vues spectaculaires, surtout au coucher du soleil.', imageUrl: '/images/raouche.jpg', region: 'beirut' },
//   { id: 2, name: 'Zaitunay Bay: Beirut’s Modern Seaside Escape', shortDesc: 'A serene coastal destination for a tranquil escape.', longDesc: "Nestled along the glistening coastline of Beirut’s central district, Zaitunay Bay is a contemporary waterfront promenade that brings together luxury, leisure, and stunning sea views. Developed as part of the city's post-war regeneration, it stretches gracefully along the Marina, adjacent to the historic Saint George Bay. Once a quiet stretch of docklands, Zaitunay Bay is now a vibrant destination lined with elegant restaurants, chic cafés, boutiques, and a boardwalk perfect for seaside strolls. As yachts gently sway in the harbor and the sun dips below the horizon, locals and tourists alike gather here to dine al fresco, sip Lebanese wine, and enjoy the cosmopolitan spirit of Beirut. With its blend of modern architecture, relaxed ambiance, and coastal charm, Zaitunay Bay has become a symbol of Beirut’s dynamic urban life and its enduring connection to the Mediterranean Sea." , imageUrl: '/images/zeytuna.jpeg', region: 'beirut' },
//   { id: 14, name: '📍 Baalbek Temples', shortDesc: 'Massive Roman temples with grand columns in the heart of the Bekaa.', longDesc: 'Le complexe de temples de Baalbek est l\'un des vestiges romains les plus spectaculaires et les mieux conservés au monde. Ses colonnes monumentales et ses temples dédiés à Jupiter, Bacchus et Vénus sont un témoignage de la grandeur de l\'Empire romain.', imageUrl: '/images/baalbek.jpg', region: 'bekaa' },
// ];

const route = useRoute(); // Permet d'accéder aux informations de la route actuelle

// On récupère l'ID depuis l'URL et on trouve le lieu correspondant.
const place = computed(() => {
  // route.params.id vient de la route dynamique /places/:id
  // On convertit l'ID de l'URL (qui est une chaîne de caractères) en nombre.
  const placeId = Number(route.params.id);
  return allItems.find(p => p.id === placeId);

});
console.log(place);

function updateBodyBackground() {
  if (place.value) {
    document.body.style.backgroundImage = `url(${place.value.imageUrl})`;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';
    document.body.style.backgroundAttachment = 'fixed';
  }
}

// 3. Quand le composant est monté (apparaît à l'écran)
onMounted(() => {
  updateBodyBackground();
});

// 4. TRÈS IMPORTANT : Quand le composant est démonté (disparaît)
onUnmounted(() => {
  // On nettoie le style pour que les autres pages soient normales
  document.body.style.backgroundImage = '';
  document.body.style.backgroundSize = '';
  document.body.style.backgroundPosition = '';
  document.body.style.backgroundAttachment = '';
});


</script>