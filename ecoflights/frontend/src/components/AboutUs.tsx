import React from 'react';
import './AboutUs.css';

const AboutUs: React.FC = () => {
  return (
    <div className="about-container">
      <div className="hero">
              <div className="hero-background" style={{backgroundImage: "url('greenair.jpg')"}}></div>
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
            Nearly 2.5% of all carbon emissions in 2023 were attributed to air travel. 
            As the popularity of air travel ever increases, the need for environmentally friendly
            solutions for air travel is apparent. In light of this, our goal was to reate a solution
            that didn't require building new airplanes. 
          </p>
        </section>

        <section className="about-section">
          <div className="section-icon">✈️</div>
          <h2>Who We Are</h2>
          <p>
            We are four students new to hackathons, hailing from the University of Kansas.
            Our platform uses SerpAPI to provide extensive information about flights
            with lesser carbon emissions. We also utilize blockchain to offer rewards to those who
            choose flights that benefit the environment. 
          </p>
        </section>

        <section className="about-section">
          <div className="section-icon">🌱</div>
          <h2>Our Journey</h2>
          <p>
            Founded at the 2025 Mizzou Hackathon, our four members had little experience going to 
            hackathons, let alone coding in languages we had never used and using unfamiliar programs 
            like Solana, Auth0, and React. Despite this, we were able to create a product we were proud 
            of through our mentor, Paul, and the many resources provided by MLH. We have no plans of 
            stopping here, and aim to further improve our platform beyond the scope of today.
          </p>
        </section>

        <section className="about-section">
          <div className="section-icon">💚</div>
          <h2>Our Links</h2>
          <ul className="values-list">
            <li><strong>Devpost:</strong> https://devpost.com/software/ecoflights </li>
            <li><strong>Github:</strong> https://github.com/J3onS3o/tigerhacks </li>
            <li><strong>Presentation:</strong> https://docs.google.com/presentation/d/1GvfVsuPJfuZgVxUx2qRPkq8kI9og0dem5XIbNhferpo/edit?usp=sharing </li>
            <li><strong>Contact Us!</strong> Email: HackKU@ku.edu </li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default AboutUs;