import React from 'react';
import { LeafIcon, PlaneIcon, ArrowTrendingUpIcon } from './icons/Icons';
import './AboutEmissions.css';

const AboutEmissions: React.FC = () => {
  const features = [
    {
      icon: PlaneIcon,
      title: 'Fly on Newer Aircraft',
      description: 'Modern planes are more fuel-efficient, significantly reducing the carbon footprint per passenger.'
    },
    {
      icon: ArrowTrendingUpIcon,
      title: 'Choose Direct Routes',
      description: 'Non-stop flights are generally more carbon-efficient as takeoffs and landings consume the most fuel.'
    },
    {
      icon: LeafIcon,
      title: 'Support Sustainable Fuels',
      description: 'Airlines are increasingly using Sustainable Aviation Fuel (SAF) to cut down on lifecycle emissions.'
    }
  ];

  return (
    <div className="about-section">
      <div className="container">
        <div className="header">
          <h2 className="kicker">Fly Responsibly</h2>
          <p className="title">Understanding Low-Emission Flights</p>
          <p className="description">
            By choosing flights with lower emissions, you are directly contributing to the decarbonization of the aviation industry. Factors like newer, more efficient aircraft, direct routes, and the growing adoption of Sustainable Aviation Fuel (SAF) all help protect our planet for future generations.
          </p>
        </div>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-item">
              <div className="icon-wrapper">
                <feature.icon className="icon" aria-hidden="true" />
              </div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AboutEmissions;
