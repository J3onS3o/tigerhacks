import React from 'react';
import './PlaceholderPage.css';

interface PlaceholderPageProps {
  title: string;
  message: string;
}

const PlaceholderPage: React.FC<PlaceholderPageProps> = ({ title, message }) => {
  return (
    <div className="placeholder-page">
      <h2 className="placeholder-title">{title}</h2>
      <p className="placeholder-message">{message}</p>
    </div>
  );
};

export default PlaceholderPage;
