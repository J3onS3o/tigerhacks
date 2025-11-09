import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express(); // ✅ now works properly
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

app.get("/", (req, res) => {
  res.send("Backend is running and connected to Gemini!");
});

app.post("/api/gemini", async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: "Prompt is required" });

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    res.json({ response: text });
  } catch (error: any) {
    console.error("Error calling Gemini:", error);
    res.status(500).json({ error: error.message || "Something went wrong" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
