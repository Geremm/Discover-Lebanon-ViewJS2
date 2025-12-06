<template>
  <footer class="custom-footer">
    <div class="footer-left">
      <h3>DISCOVER LEBANON</h3>
      <p>Your curated guide to explore, eat, and stay in Lebanon.</p>
    </div>
    <div class="footer-right">
      <ul>
        <li><router-link to="/plan-your-trip">Plan</router-link></li>
        <li><router-link to="/contact">Contact</router-link></li>
      </ul>
      <div class="social-icons">
        <a href="#"><img src="/images/facebook.jpg" alt="Facebook" /></a>
        <a href="#"><img src="/images/instagram.jpg" alt="Instagram" /></a>
        <a href="#"><img src="/images/mail.jpg" alt="Mail" /></a>
      </div>
    </div>
  </footer>
</template>

<style scoped>

.custom-footer {
  background: #e0e0b6;
  padding: 60px 10% 40px;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  color: black;
  font-size: 0.95rem;
}
.footer-left h3 {
  font-family: 'Playfair Display', serif;
  font-size: 1.3rem;
  margin-bottom: 10px;
}
.footer-right ul {
  list-style: none;
  padding: 0;
  margin: 0 0 10px 0;
  text-align: right;
}
.footer-right ul li {
  margin-bottom: 6px;
}
.footer-right ul a {
  color: black;
  text-decoration: underline;
}
.social-icons {
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  margin-top: 10px;
}
.social-icons img {
  width: 22px;
  height: 22px;
  filter: grayscale(100%);
  transition: filter 0.3s ease;
}
.social-icons img:hover {
  filter: grayscale(0%);
}

</style>