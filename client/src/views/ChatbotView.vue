<template>
  <div class="chat-container">
    <div class="chat-log" ref="chatLogContainer">
      <div v-for="(message, index) in chatLog" :key="index" class="chat-bubble" :class="message.sender">
        <div v-html="message.text"></div>
      </div>
    </div>
    <div class="chat-input">
      <input 
        type="text" 
        v-model="userInput" 
        @keyup.enter="sendMessage"
        placeholder="Ask for suggestions..." 
      />
      <button @click="sendMessage">Send</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import { useRouter } from 'vue-router'; // Import the router

// --- Lifecycle Hooks for Body Style ---
onMounted(() => {
  document.body.classList.add('bodychat');
});
onUnmounted(() => {
  document.body.classList.remove('bodychat');
});

// --- Reactive State ---
const router = useRouter(); // Initialize the router for navigation
const userInput = ref('');
const chatLogContainer = ref(null);
const chatLog = ref([
  { sender: 'bot', text: "Hello! How can I help you plan your trip? Type 'suggest' to get trip ideas." }
]);

// --- Data ---
const plans = [
  { name: "Ehden Nature Hike", price: 17 },
  { name: "Tyre Beach & Ruins", price: 22 },
  { name: "Qadisha Valley Trek", price: 19 },
  { name: "Tripoli Old City Tour", price: 14 },
  { name: "Shouf Tasting Tour", price: 16 },
  { name: "Byblos Old Souks Walk", price: 12 },
  { name: "Jeita Grotto Adventure", price: 15 }
];

// --- Chat Logic ---
async function sendMessage() {
  const userText = userInput.value.trim();
  if (!userText) return;

  // Add user message to the reactive chat log array
  chatLog.value.push({ sender: 'user', text: userText });
  userInput.value = '';
  await scrollToBottom();

  // Simulate bot thinking time
  setTimeout(() => {
    handleBotReply(userText.toLowerCase());
  }, 500);
}

async function handleBotReply(text) {
  if (text.includes("suggest")) {
    chatLog.value.push({ sender: 'bot', text: "Here are some trip ideas in Lebanon:" });
    
    // Create a single message with line breaks for better formatting
    const suggestions = plans.map(plan => `📍 ${plan.name} – €${plan.price}`).join('<br>');
    chatLog.value.push({ sender: 'bot', text: suggestions });

    chatLog.value.push({ sender: 'bot', text: "Would you like to reserve one? Just type its name." });

  } else {
    // Find a plan where the user's text includes the first word of the plan name
    const matched = plans.find(p => text.includes(p.name.toLowerCase().split(" ")[0]));
    
    if (matched) {
      chatLog.value.push({ sender: 'bot', text: `Great! Redirecting you to reserve **${matched.name}**...` });
      
      // Use the router to navigate to the reserve page without a full page reload
      setTimeout(() => {
        router.push({
          path: '/reserve',
          query: {
            trip: matched.name,
            price: matched.price
          }
        });
      }, 1500);

    } else {
      chatLog.value.push({ sender: 'bot', text: "I'm here to help you plan your trip. Type 'suggest' to get trip ideas." });
    }
  }
  await scrollToBottom();
}

// Utility to automatically scroll to the bottom of the chat
async function scrollToBottom() {
  await nextTick();
  if (chatLogContainer.value) {
    chatLogContainer.value.scrollTop = chatLogContainer.value.scrollHeight;
  }
}
</script>

<style scoped>

    .chat-container {
        max-width: 600px;
        margin: 180px auto 50px; 
        background: #f9f9f9;
        border-radius: 12px;
        padding: 20px;
        box-shadow: 0 0 12px rgba(0,0,0,0.1);
    }
    

</style>