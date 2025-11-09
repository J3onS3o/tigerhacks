import React, { useState } from 'react';
import { useEcoWallet } from './EcoWalletContext';
import './EcoWalletTab.css';

const EcoWalletTab: React.FC = () => {
  const { 
    ecoTokens, 
    co2Saved, 
    ecoImpact, 
    bookedFlights, 
    nftBadges, 
    redeemPNR,
    getFlightByPNR 
  } = useEcoWallet();

  const [pnrCode, setPnrCode] = useState('');
  const [redemptionMessage, setRedemptionMessage] = useState<{
    type: 'success' | 'error' | 'info';
    text: string;
  } | null>(null);
  const [previewFlight, setPreviewFlight] = useState<any>(null);

  const walletName = 'j3ons-Solana-Wallet';

  // Calculate next badge progress
  const getNextBadge = () => {
    const locked = nftBadges.filter(b => !b.unlocked);
    return locked.length > 0 ? locked[0] : null;
  };

  const nextBadge = getNextBadge();

  // Handle PNR code input change with preview
  const handlePNRChange = (value: string) => {
    setPnrCode(value.toUpperCase());
    setRedemptionMessage(null);
    
    // Preview flight details if valid PNR
    if (value.length === 6) {
      const flight = getFlightByPNR(value.toUpperCase());
      setPreviewFlight(flight || null);
    } else {
      setPreviewFlight(null);
    }
  };

  // Handle token redemption
  const handleRedeemTokens = () => {
    if (pnrCode.length !== 6) {
      setRedemptionMessage({
        type: 'error',
        text: 'Please enter a valid 6-character PNR code.'
      });
      return;
    }

    const success = redeemPNR(pnrCode);
    
    if (success) {
      const flight = previewFlight;
      const tokensEarned = Math.round((flight.co2Saved / 1000) * 43);
      
      setRedemptionMessage({
        type: 'success',
        text: `🎉 Successfully claimed ${tokensEarned.toLocaleString()} ECO Tokens! Your environmental impact has been updated.`
      });
      setPnrCode('');
      setPreviewFlight(null);
    } else {
      setRedemptionMessage({
        type: 'error',
        text: 'Invalid or already redeemed PNR code. Please check and try again.'
      });
    }
  };

  return (
    <div className="tab-content wallet-content">
      <h2 className="wallet-title">EcoWallet 🌳</h2>
      <p className="wallet-status">
        Wallet: <strong>{walletName}</strong> | Status: <span className="status-dot"></span> <strong>Connected</strong>
      </p>
      
      {/* Balance Card */}
      <div className="balance-card">
        <h3>Your Impact & Earnings 💚</h3>
        <div className="balance-details">
          <div className="metric">
            <span className="value">{co2Saved.toFixed(1)}</span>
            <span className="label">kg CO₂e Saved</span>
          </div>
          <div className="metric primary">
            <span className="value token-value">{ecoTokens.toLocaleString()}</span>
            <span className="label">ECO Tokens 🪙</span>
          </div>
          <div className="metric">
            <span className="value">{ecoImpact.toFixed(1)}%</span>
            <span className="label">Emissions Reduced</span>
          </div>
        </div>
        <p className="rate-info">*1 kg CO₂e Saved ≈ 43 ECO Tokens</p>
      </div>

      {/* Pending Bookings */}
      {bookedFlights.length > 0 && (
        <div className="pending-bookings">
          <h3>Pending Redemptions ({bookedFlights.length})</h3>
          <div className="pending-list">
            {bookedFlights.map((flight) => (
              <div key={flight.pnrCode} className="pending-item">
                <div className="pending-details">
                  <span className="pending-flight">{flight.airline} {flight.flightNumber}</span>
                  <span className="pending-tokens">
                    +{Math.round((flight.co2Saved / 1000) * 43).toLocaleString()} 🪙
                  </span>
                </div>
                <span className="pending-pnr">PNR: {flight.pnrCode}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* NFT Section */}
      <div className="nft-section">
        <h3>Your Eco-Warrior Collection ✈️</h3>
        
        {nextBadge && (
          <div className="next-badge-progress">
            <h4>Next Badge: {nextBadge.name}</h4>
            <div className="progress-bars">
              <div className="progress-item">
                <label>Tokens: {ecoTokens.toLocaleString()} / {nextBadge.requiredTokens.toLocaleString()}</label>
                <div className="progress-bar">
                  <div 
                    className="progress-fill"
                    style={{ width: `${Math.min((ecoTokens / nextBadge.requiredTokens) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
              <div className="progress-item">
                <label>Impact: {ecoImpact.toFixed(1)}% / {nextBadge.requiredImpact}%</label>
                <div className="progress-bar">
                  <div 
                    className="progress-fill"
                    style={{ width: `${Math.min((ecoImpact / nextBadge.requiredImpact) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="nft-grid">
          {nftBadges.map((nft) => (
            <div key={nft.name} className={`nft-card ${nft.unlocked ? 'unlocked' : 'locked'}`}>
              <div className="nft-icon">{nft.unlocked ? '✅' : '🔒'}</div>
              <h4>{nft.name}</h4>
              <p className="nft-benefit">{nft.benefit}</p>
              {!nft.unlocked && (
                <p className="nft-requirement">
                  Requires: {nft.requiredTokens.toLocaleString()} tokens & {nft.requiredImpact}% impact
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Redemption Section */}
      <div className="redemption-section">
        <h3>Redeem EcoFlight Benefits 🎁</h3>
        <p>
          After booking an eco-friendly flight, enter your <strong>PNR Code</strong> below to claim your <strong>ECO Tokens!</strong>
        </p>
        
        {/* Preview Flight Details */}
        {previewFlight && (
          <div className="flight-preview">
            <h4>Flight Preview:</h4>
            <p className="preview-flight">{previewFlight.airline} {previewFlight.flightNumber}</p>
            <div className="preview-stats">
              <span>CO₂ Saved: {(previewFlight.co2Saved / 1000).toFixed(1)} kg</span>
              <span>Tokens to Earn: {Math.round((previewFlight.co2Saved / 1000) * 43).toLocaleString()} 🪙</span>
            </div>
          </div>
        )}

        <div className="redemption-form">
          <input
            type="text"
            className="input pnr-input"
            placeholder="Enter 6-character PNR Code"
            value={pnrCode}
            onChange={(e) => handlePNRChange(e.target.value)}
            maxLength={6}
          />
          <button 
            className="submit-button redeem-button" 
            onClick={handleRedeemTokens}
            disabled={pnrCode.length !== 6}
          >
            Claim Tokens
          </button>
        </div>

        {redemptionMessage && (
          <div className={`redemption-message ${redemptionMessage.type}`}>
            {redemptionMessage.text}
          </div>
        )}

        <div className="redemption-info">
          <h4>How it works:</h4>
          <ol>
            <li>Book an eco-friendly flight through our search</li>
            <li>Receive a unique PNR code</li>
            <li>Enter the PNR code here to claim your tokens</li>
            <li>Watch your impact grow and unlock NFT badges!</li>
          </ol>
        </div>
      </div>

      {/* Statistics */}
      <div className="stats-section">
        <h3>Your Environmental Impact 🌍</h3>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">🌳</div>
            <div className="stat-value">{Math.round(co2Saved / 21)}</div>
            <div className="stat-label">Trees Planted Equivalent</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🚗</div>
            <div className="stat-value">{Math.round(co2Saved / 0.404)}</div>
            <div className="stat-label">Miles Not Driven</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">💡</div>
            <div className="stat-value">{Math.round(co2Saved / 0.92)}</div>
            <div className="stat-label">LED Bulb Hours</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EcoWalletTab;