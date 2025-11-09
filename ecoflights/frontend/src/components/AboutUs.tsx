import React from 'react';
import './AboutUs.css';

const AboutUs: React.FC = () => {
  return (
    <div className="about-container">
      <div className="hero">
              <div className="hero-background" style={{backgroundImage: "url('https://picsum.photos/1920/1080?grayscale&blur=2')"}}></div>
              <div className="hero-overlay"></div>
              <div className="container hero-content">
                  <h1 className="hero-title">Fly Green With US</h1>
                  <p className="hero-subtitle">
                    Discover flights with lower-than-average emissions and reduce your carbon footprint. Your journey to a sustainable future starts here.
                  </p>
              </div>
            </div>

      <div className="about-content">
        <section className="about-section">
          <div className="section-icon">🌍</div>
          <h2>Our Mission</h2>
          <p>
            EcoFlights is dedicated to revolutionizing air travel by helping travelers 
            make environmentally conscious choices. We believe that sustainability and 
            convenience can go hand in hand.
          </p>
        </section>

        <section className="about-section">
          <div className="section-icon">✈️</div>
          <h2>Who We Are</h2>
          <p>
            We provide transparent carbon emission data for flights, making it easy 
            to compare and choose lower-emission travel options. Our platform exclusively 
            shows flights with reduced carbon footprints compared to average routes.
          </p>
        </section>

        <section className="about-section">
          <div className="section-icon">🌱</div>
          <h2>Our Journey</h2>
          <p>
            Through blockchain technology and carbon credits, we're creating a transparent 
            ecosystem where every flight choice contributes to a more sustainable future. 
            Track your carbon footprint and offset emissions with verifiable carbon credits.
          </p>
        </section>

        <section className="about-section">
          <div className="section-icon">💚</div>
          <h2>Our Links</h2>
          <ul className="values-list">
            <li><strong>Devpost:</strong> Clear, honest carbon emission data</li>
            <li><strong>Github:</strong> Prioritizing eco-friendly travel options</li>
            <li><strong>Presentation:</strong> Leveraging blockchain for environmental impact</li>
            <li><strong>Contact Us!:</strong> Making green travel easy for everyone</li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default AboutUs;