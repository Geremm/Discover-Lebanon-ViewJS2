<template>
  <div class="contact-shell">
    <div class="contact-overlay"></div>
    
    <div class="glass-container">
      
      <div class="text-center mb-4">
        <h5 class="brand-subtitle">We'd love to hear from you</h5>
        <h1 class="brand-title">Contact Us</h1>
      </div>

      <div class="content-grid">
        
        <div class="form-section">
          <form @submit.prevent="sendMessage">
            
            <div class="input-row">
              <div class="floating-label-group">
                <input type="text" v-model="form.name" id="name" required placeholder=" " />
                <label for="name">Your Name</label>
              </div>
              
              <div class="floating-label-group">
                <input type="email" v-model="form.email" id="email" required placeholder=" " />
                <label for="email">Email Address</label>
              </div>
            </div>

            <div class="floating-label-group">
              <select v-model="form.subject" id="subject" required>
                <option value="" disabled selected></option>
                <option>General Inquiry</option>
                <option>Booking Help</option>
                <option>Partnerships</option>
              </select>
              <label for="subject" class="select-label">Subject</label>
              <i class="bi bi-chevron-down select-arrow"></i>
            </div>

            <div class="floating-label-group">
              <textarea v-model="form.message" id="message" rows="4" required placeholder=" "></textarea>
              <label for="message">How can we help?</label>
            </div>

            <button type="submit" class="submit-btn">
              <span>Send Message</span>
              <i class="bi bi-paperplane-fill"></i>
            </button>
          </form>
        </div>

        <div class="info-section">
          <div class="info-card">
            <div class="icon-wrapper"><i class="bi bi-geo-alt"></i></div>
            <div>
              <h4>Visit Us</h4>
              <p>Beirut Souks, Downtown<br>Beirut, Lebanon</p>
            </div>
          </div>

          <div class="info-card">
            <div class="icon-wrapper"><i class="bi bi-telephone"></i></div>
            <div>
              <h4>Call Us</h4>
              <p>+961 03 123 456<br>+961 01 987 654</p>
            </div>
          </div>

          <div class="info-card">
            <div class="icon-wrapper"><i class="bi bi-envelope"></i></div>
            <div>
              <h4>Email Us</h4>
              <p>hello@discoverlebanon.com<br>support@discoverlebanon.com</p>
            </div>
          </div>

          <div class="social-area">
            <p>Follow our journey:</p>
            <div class="social-icons">
              <a href="#"><i class="bi bi-instagram"></i></a>
              <a href="#"><i class="bi bi-facebook"></i></a>
              <a href="#"><i class="bi bi-twitter"></i></a>
              <a href="#"><i class="bi bi-whatsapp"></i></a>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const form = ref({
  name: '',
  email: '',
  subject: 'General Inquiry',
  message: ''
});

const sendMessage = () => {
  console.log("Message sent:", form.value);
  alert(`Thanks ${form.value.name}! We will be in touch soon.`);
  form.value.name = '';
  form.value.email = '';
  form.value.message = '';
};
</script>

<style scoped>
@import 'bootstrap-icons/font/bootstrap-icons.css';

.contact-shell {
  min-height: 100vh;
  background-image: url('https://images.unsplash.com/photo-1566839624466-396274eb7833?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px 20px 40px;
  position: relative;
}

.contact-overlay {
  position: absolute;
  inset: 0;
  background-image: url('../assets/images/oldd.jpeg');
    background-size: cover;
    background-position: center;

    backdrop-filter: blur(3px);
}

.glass-container {
  position: relative;
  z-index: 2;
  background: rgba(255, 255, 255, 0.85); 
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 30px;
  padding: 50px;
  width: 100%;
  max-width: 950px;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.2);
  animation: floatUp 0.8s cubic-bezier(0.2, 0.8, 0.2, 1);
}

@keyframes floatUp {
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
}


.brand-subtitle {
  color: #d4af37; 
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 2px;
  font-weight: 700;
  margin-bottom: 5px;
  text-align: center;
}

.brand-title {
  font-family: 'Playfair Display', serif;
  font-size: 3rem;
  color: #886c19;  
  margin-bottom: 40px;
  text-align: center;
}

 
.content-grid {
  display: grid;
  grid-template-columns: 1.5fr 1fr;  
  gap: 50px;
  align-items: start;
}

 
.form-section {
  padding-right: 30px;
  border-right: 1px solid rgba(0,0,0,0.05);
}

.input-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}


.floating-label-group {
  position: relative;
  margin-bottom: 25px;
}

.floating-label-group input,
.floating-label-group textarea,
.floating-label-group select {
  width: 100%;
  padding: 15px 0;
  font-size: 16px;
  color: #333;
  background: transparent;
  border: none;
  border-bottom: 2px solid #ccc;
  outline: none;
  transition: all 0.3s ease;
  font-family: inherit;
}

.floating-label-group label {
  position: absolute;
  top: 15px;
  left: 0;
  font-size: 15px;
  color: #888;
  pointer-events: none;
  transition: all 0.3s ease;
}


.floating-label-group input:focus,
.floating-label-group input:not(:placeholder-shown),
.floating-label-group textarea:focus,
.floating-label-group textarea:not(:placeholder-shown),
.floating-label-group select:focus,
.floating-label-group select:valid {
  border-bottom-color: #977b29;  
}

.floating-label-group input:focus ~ label,
.floating-label-group input:not(:placeholder-shown) ~ label,
.floating-label-group textarea:focus ~ label,
.floating-label-group textarea:not(:placeholder-shown) ~ label,
.floating-label-group select:focus ~ label,
.floating-label-group select:valid ~ .select-label {
  top: -10px;
  font-size: 12px;
  color: #977b29;
  font-weight: 600;
}

.select-arrow {
  position: absolute;
  right: 0;
  top: 15px;
  color: #888;
  pointer-events: none;
}

 
.submit-btn {
  background: linear-gradient(135deg, #977b29 0%,#977b29 100%);
  color: white;
  border: none;
  padding: 15px 35px;
  border-radius: 50px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.3s ease;
  box-shadow: 0 10px 20px #977b29;
  margin-top: 10px;
}

.submit-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 30px #977b29;
  background: linear-gradient(135deg, #977b29 0%,#977b29 100%);
}

 
.info-section {
  padding-left: 20px;
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.info-card {
  display: flex;
  align-items: flex-start;
  gap: 15px;
}

.icon-wrapper {
  width: 45px;
  height: 45px;
  background: #f4f1ea;  
  color: #d4af37;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  flex-shrink: 0;
}

.info-card h4 {
  font-size: 16px;
  font-weight: 700;
  color: #333;
  margin: 0 0 5px 0;
}

.info-card p {
  font-size: 14px;
  color: #666;
  margin: 0;
  line-height: 1.5;
}

 
.social-area {
  margin-top: 20px;
  border-top: 1px dashed #ddd;
  padding-top: 20px;
}

.social-area p {
  font-size: 14px;
  font-weight: 600;
  color: #977b29;
  margin-bottom: 15px;
}

.social-icons {
  display: flex;
  gap: 15px;
}

.social-icons a {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid #ddd;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #555;
  transition: 0.3s;
  font-size: 18px;
}

.social-icons a:hover {
  background: #977b29;
  color: white;
  border-color:#977b29;
  transform: translateY(-3px);
}

@media (max-width: 850px) {
  .contact-shell {
    padding: 80px 15px 30px;
  }
  .glass-container {
    padding: 30px;
  }
  
  .content-grid {
    grid-template-columns: 1fr;
    gap: 40px;
  }
  
  .form-section {
    border-right: none;
    border-bottom: 1px solid rgba(0,0,0,0.05);
    padding-right: 0;
    padding-bottom: 40px;
  }

  .info-section {
    padding-left: 0;
  }
  
  .input-row {
    grid-template-columns: 1fr;
    gap: 0;
  }
}
</style>