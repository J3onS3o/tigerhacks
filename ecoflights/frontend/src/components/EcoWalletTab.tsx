import React, { useState } from 'react';

const EcoWalletTab: React.FC = () => {
  // Mock Data for Wallet
  const [walletName] = useState('j3ons-Solana-Wallet');
  const [ecoTokens] = useState(5340);
  const [co2Saved] = useState(123.4);
  const [pnrCode, setPnrCode] = useState('');

  // Mock NFT data (Should match data used in FlightSearch for impact tab)
  const nfts = [
    { name: 'Seedling NFT 🌱', unlocked: true, benefit: '5% OFF American Airlines' },
    { name: 'Sapling NFT 🌳', unlocked: true, benefit: 'Free Lounge Pass' },
    { name: 'Great Tree NFT 🌲', unlocked: false, benefit: '10% Lifetime Discount' },
  ];

  // Simple mock handler for token redemption
  const handleRedeemTokens = () => {
    if (pnrCode.length < 6) {
      alert('Please enter a valid PNR/e-Ticket code (at least 6 characters).');
      return;
    }
    // Mock success feedback
    alert(`PNR ${pnrCode} submitted! Tokens and CO₂e savings are being verified on the blockchain. Check back soon!`);
    setPnrCode('');
  };

  return (
    <div className="tab-content wallet-content">
      <h2 className="wallet-title">EcoWallet 🌳</h2>
      <p className="wallet-status">Wallet: **{walletName}** | Status: <span className="status-dot"></span> **Connected**</p>
      
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
        </div>
        <p className="rate-info">*1 kg CO₂e Saved ≈ 43 ECO Tokens</p>
      </div>

      <div className="nft-section">
        <h3>Your Eco-Warrior Collection ✈️</h3>
        <div className="nft-grid">
          {nfts.map((nft) => (
            <div key={nft.name} className={`nft-card ${nft.unlocked ? 'unlocked' : 'locked'}`}>
              <div className="nft-icon">{nft.unlocked ? '✅' : '🔒'}</div>
              <h4>{nft.name}</h4>
              <p className="nft-benefit">{nft.benefit}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="redemption-section">
        <h3>Redeem EcoFlight Benefits 🎁</h3>
        <p>After booking an eco-friendly flight, enter your e-Ticket or **PNR Code** below to verify and claim your **ECO Tokens!**</p>
        
        <div className="redemption-form">
          <input
            type="text"
            className="input"
            placeholder="Enter PNR or e-Ticket Code"
            value={pnrCode}
            onChange={(e) => setPnrCode(e.target.value)}
            maxLength={10}
          />
          <button className="submit-button redeem-button" onClick={handleRedeemTokens}>
            Claim Tokens
          </button>
        </div>

      </div>
    </div>
  );
};

export default EcoWalletTab;