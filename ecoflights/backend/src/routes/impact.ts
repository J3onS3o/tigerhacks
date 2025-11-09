import express from "express";
import { getImpactMessage } from "../services/geminiService";

const router = express.Router();

router.get("/impact", async (req, res) => {
  try {
    // Example: fetch wallet stats from backend or mock values
    const stats = {
      totalCO2Saved: 123.4,
      reductionPercent: 12.5,
      flightsOffset: 3,
    };

    const message = await getImpactMessage(stats);
    res.json({ message });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to generate impact message" });
  }
});

export default router;