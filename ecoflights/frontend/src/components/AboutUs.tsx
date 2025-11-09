import React from 'react';
import './AboutUs.css';

const AboutUs: React.FC = () => {
  return (
    <div className="about-container">
      <div className="about-hero">
        <h1>About EcoFlights</h1>
        <p className="about-tagline">
          Making sustainable travel accessible to everyone
        </p>
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
          <h2>What We Do</h2>
          <p>
            We provide transparent carbon emission data for flights, making it easy 
            to compare and choose lower-emission travel options. Our platform exclusively 
            shows flights with reduced carbon footprints compared to average routes.
          </p>
        </section>

        <section className="about-section">
          <div className="section-icon">🌱</div>
          <h2>Our Impact</h2>
          <p>
            Through blockchain technology and carbon credits, we're creating a transparent 
            ecosystem where every flight choice contributes to a more sustainable future. 
            Track your carbon footprint and offset emissions with verifiable carbon credits.
          </p>
        </section>

        <section className="about-section">
          <div className="section-icon">💚</div>
          <h2>Our Values</h2>
          <ul className="values-list">
            <li><strong>Transparency:</strong> Clear, honest carbon emission data</li>
            <li><strong>Sustainability:</strong> Prioritizing eco-friendly travel options</li>
            <li><strong>Innovation:</strong> Leveraging blockchain for environmental impact</li>
            <li><strong>Accessibility:</strong> Making green travel easy for everyone</li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default AboutUs;