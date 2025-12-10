<template>
  <div>
    <section class="about-hero-photo">
      <img src="/images/flagL.png" alt="Lebanon" class="about-hero-img">
      <div class="about-hero-text">
        <h1>We’re passionate about sharing the beauty of Lebanon</h1>
        <p>From breathtaking landscapes to rich culture — discover it all.</p>
      </div>
    </section>

    <section class="about-story-section">
      <div class="story-block">
        <img src="/images/batroun.jpeg" alt="Nature">
        <div class="story-text">
          <h2>Discover Breathtaking Landscapes</h2>
          <p>From the towering cedars of the Chouf to the blue shores of Batroun, Lebanon’s natural beauty is unmatched.</p>
        </div>
      </div>
      <div class="story-block" style="margin-top:120px">
        <div class="story-text">
          <h2>A Taste of Lebanese Cuisine</h2>
          <p>Tabbouleh, kibbeh, hummus — Lebanese food is a vibrant blend of freshness, flavor, and love.</p>
        </div>
        <img src="/images/ahwe.jpg" alt="Cuisine">
      </div>
    </section>

    <section class="about-help-section">
      <h2>We can help.</h2>
      <div class="help-columns">
        <div class="help-block">
          <h3>Discover hidden gems</h3>
          <p>We’ll guide you to Lebanon’s most breathtaking spots — from secret mountain trails to ancient coastal towns.</p>
        </div>
        <div class="help-block">
          <h3>Live like a local</h3>
          <p>Find authentic experiences, local restaurants, and cultural traditions that bring Lebanon to life.</p>
        </div>
        <div class="help-block">
          <h3>Plan with ease</h3>
          <p>Use our trip planner to create the perfect itinerary — whether for a weekend or a full adventure.</p>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>

.about-hero-photo {
  position: relative;
  width: 100%;
  height: 90vh;
  overflow: hidden;
}
.about-hero-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.about-hero-text {
  position: absolute;
  bottom: 60px;
  left: 60px;
  color: white;
  max-width: 700px;
  z-index: 2;
}
.about-hero-text h1 {
  font-family: 'Playfair Display', serif;
  font-size: 3.2rem;
  line-height: 1.2;
  margin-bottom: 20px;
  text-shadow: 0 4px 10px rgba(0, 0, 0, 0.4);
}
.about-hero-text p {
  font-size: 1.2rem;
  color: #f5f5f5;
  text-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
}

.about-story-section {
  background: #f9f9f9;
  z-index:10;
  padding: 80px 10%;
  position:relative;
}
.story-block {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 40px;
  margin-bottom: 60px;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
}

.story-block.reverse {
  flex-direction: row-reverse;
}

.story-block.reverse .story-text {
  direction: ltr;
}
@media (max-width: 992px) {
  .story-block,
  .story-block.reverse {
    flex-direction: column;
    text-align: center;
    gap: 30px;
    padding: 0 5px;
  }

  .story-block.reverse {
    flex-direction: column;
  }

  .story-text {
    max-width: 90%;
  }
}

.story-block img {
  width: 45%;
  max-width: 460px;
  border-radius: 10px;
  box-shadow: 0 6px 20px rgba(0,0,0,0.1);

}


.story-block img:hover {
  transform: rotate(0deg) scale(1.02);
}

.story-text {
  width: 50%;
}

.story-text h2 {
  font-family: 'Playfair Display', serif;
  font-size: 2.2rem;
  color: #111;
  margin-bottom: 20px;
}

.story-text p {
  font-size: 1.05rem;
  line-height: 1.7;
  color: #333;
}

.about-help-section {
  background: #9d7e23;
  color: white;
  padding: 100px 10% 80px;
  text-align: center;
}
.about-help-section h2 {
  font-size: 3rem;
  margin-bottom: 60px;
  font-family: 'Playfair Display', serif;
}
.help-columns {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 40px;
}
.help-block {
  flex: 1;
  min-width: 260px;
  max-width: 320px;
}
.help-block h3 {
  font-size: 1.4rem;
  margin-bottom: 12px;
  font-weight: 600;
}
.help-block p {
  font-size: 1rem;
  color: #f3f3f3;
  line-height: 1.6;
}

</style>