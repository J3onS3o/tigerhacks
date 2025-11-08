import React from 'react';
import { LeafIcon, PlaneIcon, ArrowPathIcon } from './icons/Icons';
import './AboutSAF.css';

const AboutSAF: React.FC = () => {
  const benefits = [
    {
      icon: LeafIcon,
      title: 'Lower Carbon Emissions',
      description: 'SAF can reduce carbon emissions by up to 80% compared to conventional jet fuel over its lifecycle.'
    },
    {
      icon: PlaneIcon,
      title: 'Drop-in Replacement',
      description: 'SAF is a direct replacement for conventional jet fuel, requiring no modifications to existing aircraft or infrastructure.'
    },
    {
      icon: ArrowPathIcon,
      title: 'Circular Economy',
      description: 'Made from sustainable resources like waste oils and agricultural residues, supporting a circular economy.'
    }
  ];

  return (
    <div className="saf-section">
      <div className="container">
        <div className="header">
          <h2 className="kicker">Future of Flight</h2>
          <p className="title">Sustainable Aviation Fuel (SAF)</p>
          <p className="description">
            SAF represents a crucial step toward decarbonizing air travel. These advanced biofuels are chemically similar to conventional jet fuel but made from sustainable sources, significantly reducing the aviation industry's carbon footprint.
          </p>
        </div>
        <div className="benefits-grid">
          {benefits.map((benefit, index) => (
            <div key={index} className="benefit-item">
              <div className="icon-wrapper">
                <benefit.icon className="icon" aria-hidden="true" />
              </div>
              <h3 className="benefit-title">{benefit.title}</h3>
              <p className="benefit-description">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AboutSAF;
