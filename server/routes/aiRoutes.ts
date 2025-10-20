import express from "express";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();
const router = express.Router();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// ✅ Route 1: Simple text prompt (already existing)
router.post("/", async (req, res) => {
  const { prompt } = req.body;
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    res.json({ insight: result.response.text() });
  } catch (err: any) {
    console.error("Gemini prompt error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Route 2: Analyze Google Calendar events
router.post("/analyze", async (req, res) => {
  try {
    const { events } = req.body;

    if (!events || !Array.isArray(events)) {
      return res.status(400).json({ error: "Invalid events data" });
    }

    // Format the events into readable text for Gemini
    const eventSummary = events
      .map(
        (e: any) =>
          `• ${e.summary || "Untitled event"} on ${
            e.start?.dateTime
              ? new Date(e.start.dateTime).toLocaleString()
              : e.start?.date || "Unknown date"
          }`
      )
      .join("\n");

    const prompt = `
You are an assistant that analyzes a user's Google Calendar schedule and gives helpful, friendly insights.
Here are the upcoming events:
${eventSummary}

Please summarize their day, highlight busy periods, and suggest productivity or planning tips.
    `;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const insight = result.response.text();

    res.json({ insight });
  } catch (err: any) {
    console.error("Gemini event analysis error:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;

