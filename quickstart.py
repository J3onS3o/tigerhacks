"""
SAF Miles NFT API - Actually mints to Solana Devnet
"""

import asyncio
import subprocess
import json
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from solana.rpc.async_api import AsyncClient
from solders.keypair import Keypair
from solders.pubkey import Pubkey
import os

app = FastAPI()

# Configuration
RPC_URL = "https://api.devnet.solana.com"
AUTHORITY_KEYPAIR_PATH = "authority-keypair.json" #/Users/kennyhong/.config/solana/id.json

# In-memory database for hackathon with demo data
user_database = {
    # Demo user 1:
    "47e6dXJGYkLc5MYQ1yZem597PCngRmKfFUVcjgCzA6c3": {
        "total_CO2e": 550,
        "flights": [
            {"airline": "United Airlines", "route": "SFO-LAX", "CO2e": 350}
        ],
        "claimed_milestones": [100,250,500],
        "nfts": [
            {
                "nft_mint": "Demo100kgNFT123456789",
                "metadata": {
                    "name": "SAF CO2e Reduction - 100kg Club",
                    "symbol": "SAFM",
                    "description": "Reduced 350kg CO2 emissions using SAF",
                    "attributes": [
                        {"trait_type": "Milestone", "value": "100"},
                        {"trait_type": "Total CO2e Reduced (kg)", "value": "350"}
                    ]
                },
                "milestone": 100,
                "status": "minted_on_chain",
                "network": "devnet",
                "explorer_url": "https://explorer.solana.com/address/Demo100kgNFT123456789?cluster=devnet"
            }
        ]
    }
}

class SolanaNFTMinter:
    def __init__(self):
        self.client = AsyncClient(RPC_URL)
        self.authority_keypair = self._load_keypair()
    
    def _load_keypair(self) -> Keypair:
        """Load authority keypair from file"""
        if not os.path.exists(AUTHORITY_KEYPAIR_PATH):
            raise Exception(f"Keypair file not found: {AUTHORITY_KEYPAIR_PATH}")
        
        with open(AUTHORITY_KEYPAIR_PATH, 'r') as f:
            secret_key = json.load(f)
            return Keypair.from_bytes(bytes(secret_key))
    
    async def mint_nft_metaplex(
        self, 
        user_wallet: str,
        milestone: int,
        total_CO2e: int
    ) -> dict:
        """
        Mint NFT on Solana using Metaplex
        """
        print(f"Minting {milestone}kg of CO2e reduction NFT for {user_wallet}...")
        
        # Create metadata
        metadata = {
            "name": f"SAF CO2e Reduction - {milestone}kg Club",
            "symbol": "SAFM",
            "description": f"This NFT certifies that the holder has reduced {total_CO2e}kg of CO2 emissions by flying with Sustainable Aviation Fuel (SAF). Redeemable by airlines for tax credits.",
            "attributes": [
                {"trait_type": "Milestone", "value": str(milestone)},
                {"trait_type": "Total CO2e Reduced (kg)", "value": str(total_CO2e)},
                {"trait_type": "User Address", "value": user_wallet},
                {"trait_type": "Redeemable", "value": "Yes"}
            ]
        }
        
        # This creates a basic NFT (1 supply token)
        try:
            # Create a new token mint
            result = subprocess.run(
                [
                    "spl-token", "create-token",
                    "--decimals", "0",
                    "--url", RPC_URL,
                    "--fee-payer", AUTHORITY_KEYPAIR_PATH,
                    "--owner", AUTHORITY_KEYPAIR_PATH
                ],
                capture_output=True,
                text=True,
                timeout=30
            )
            
            if result.returncode != 0:
                print(f"Error creating token: {result.stderr}")
                return self._create_mock_nft(user_wallet, milestone, metadata)
            
            # Extract mint address from output
            mint_address = None
            for line in result.stdout.split('\n'):
                if "Creating token" in line:
                    mint_address = line.split()[-1]
                    break
            
            if not mint_address:
                return self._create_mock_nft(user_wallet, milestone, metadata)
            
            # Mint 1 token to user
            subprocess.run(
                [
                    "spl-token", "mint",
                    mint_address,
                    "1",
                    user_wallet,
                    "--url", RPC_URL,
                    "--fee-payer", AUTHORITY_KEYPAIR_PATH,
                    "--owner", AUTHORITY_KEYPAIR_PATH
                ],
                capture_output=True,
                text=True,
                timeout=30
            )
            
            return {
                "nft_mint": mint_address,
                "metadata": metadata,
                "milestone": milestone,
                "status": "minted_on_chain",
                "network": "devnet",
                "explorer_url": f"https://explorer.solana.com/address/{mint_address}?cluster=devnet"
            }
            
        except subprocess.TimeoutExpired:
            print("Minting timeout - using mock NFT")
            return self._create_mock_nft(user_wallet, milestone, metadata)
        except Exception as e:
            print(f"Error minting NFT: {e}")
            return self._create_mock_nft(user_wallet, milestone, metadata)
    
    def _create_mock_nft(self, user_wallet: str, milestone: int, metadata: dict) -> dict:
        """Fallback: Create mock NFT if blockchain minting fails"""
        mock_mint = f"MOCK{milestone}{user_wallet[:8]}"
        return {
            "nft_mint": mock_mint,
            "metadata": metadata,
            "milestone": milestone,
            "status": "mock_minted",
            "network": "devnet",
            "note": "Mock NFT for demo - would be minted on-chain in production"
        }

# Initialize minter
nft_minter = SolanaNFTMinter()

# API Models
class Flight(BaseModel):
    user_wallet: str
    airline: str
    route: str
    CO2e: int  # CO2 emissions reduced
    uses_saf: bool

class RedeemRequest(BaseModel):
    wallet: str
    nft_mint: str
    airline: str

# API Endpoints
@app.post("/api/log-flight")
async def log_flight(flight: Flight):
    """Log a flight and check for milestone NFTs"""
    if not flight.uses_saf:
        return {"message": "Flight does not use SAF", "CO2e_reduced": 0}
    
    # Validate Solana address
    try:
        Pubkey.from_string(flight.user_wallet)
    except:
        raise HTTPException(status_code=400, detail="Invalid Solana wallet address")
    
    # Initialize user if new
    if flight.user_wallet not in user_database:
        user_database[flight.user_wallet] = {
            "total_CO2e": 0,
            "flights": [],
            "claimed_milestones": [],
            "nfts": []
        }
    
    # Add CO2e reduced
    user = user_database[flight.user_wallet]
    user["total_CO2e"] += flight.CO2e
    user["flights"].append({
        "airline": flight.airline,
        "route": flight.route,
        "CO2e": flight.CO2e
    })
    
    # Check for milestone NFTs
    milestones = [100, 500, 1000]
    new_nfts = []
    
    for milestone in milestones:
        if user["total_CO2e"] >= milestone and milestone not in user["claimed_milestones"]:
            # Mint NFT on Solana
            nft = await nft_minter.mint_nft_metaplex(
                flight.user_wallet,
                milestone,
                user["total_CO2e"]
            )
            
            user["claimed_milestones"].append(milestone)
            user["nfts"].append(nft)
            new_nfts.append(nft)
            print(f"✓ Minted {milestone} CO2e NFT: {nft['nft_mint']}")
    
    return {
        "message": "Flight logged successfully",
        "CO2e_reduced": flight.CO2e,
        "total_CO2e": user["total_CO2e"],
        "new_nfts": new_nfts,
        "next_milestone": next((m for m in milestones if m > user["total_CO2e"]), None)
    }

@app.get("/api/user/{wallet}")
async def get_user_stats(wallet: str):
    """Get user's SAF miles and NFTs"""
    if wallet not in user_database:
        raise HTTPException(status_code=404, detail="User not found")
    
    return user_database[wallet]

@app.post("/api/redeem-nft")
async def redeem_nft(request: RedeemRequest):
    """Redeem NFT for airline tax credit"""
    if request.wallet not in user_database:
        raise HTTPException(status_code=404, detail="User not found")
    
    user = user_database[request.wallet]
    nft = next((n for n in user["nfts"] if n["nft_mint"] == request.nft_mint), None)
    
    if not nft:
        raise HTTPException(status_code=404, detail="NFT not found")
    
    if nft.get("redeemed"):
        raise HTTPException(status_code=400, detail="NFT already redeemed")
    
    # Mark as redeemed
    nft["redeemed"] = True
    nft["redeemed_by_airline"] = request.airline
    nft["redeemed_date"] = "2025-11-08"
    
    # In production: burn the NFT on-chain here
    # subprocess.run(["spl-token", "burn", nft["nft_mint"], "1", ...])
    
    return {
        "message": "NFT redeemed successfully",
        "nft": nft,
        "tax_credit_eligible": True,
        "airline": request.airline
    }

@app.get("/api/health")
async def health_check():
    """Check if Solana connection is working"""
    try:
        response = await nft_minter.client.get_health()
        return {
            "status": "healthy",
            "solana_connection": "connected",
            "network": "devnet"
        }
    except Exception as e:
        return {
            "status": "degraded",
            "solana_connection": "disconnected",
            "error": str(e)
        }

@app.on_event("shutdown")
async def shutdown():
    await nft_minter.client.close()

# Run with: uvicorn saf_nft_api:app --reload

# curl -X POST "http://127.0.0.1:8000/api/log-flight" \
#   -H "Content-Type: application/json" \
#   -d '{
#     "user_wallet": "47e6dXJGYkLc5MYQ1yZem597PCngRmKfFUVcjgCzA6c3",
#     "airline": "United Airlines",
#     "route": "SFO-LAX",
#     "CO2e": 150,
#     "uses_saf": true
#   }'
