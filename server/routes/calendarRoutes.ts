import express from "express";
import { google } from "googleapis";
import dotenv from "dotenv";
import session from "express-session";

dotenv.config();
const router = express.Router();

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);


router.get("/auth", (req, res) => {
  const redirect = req.query.redirect as string | undefined;

  const scopes = ["https://www.googleapis.com/auth/calendar.readonly"];
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: scopes,
    state: redirect || "/", 
  });

  res.json({ url });
});


router.get("/oauth2callback", async (req, res) => {
  const code = req.query.code as string;

  // Handle `state` safely (TypeScript)
  let redirectPath = "/";
  const state = req.query.state;
  if (state) {
    if (typeof state === "string") redirectPath = state;
    else if (Array.isArray(state) && typeof state[0] === "string") {
    redirectPath = state[0];
  }
 
  }

  try {
    const { tokens } = await oauth2Client.getToken(code);
    req.session.tokens = tokens; // fix this pls :) or ask chat
    oauth2Client.setCredentials(tokens);

    res.redirect(`http://localhost:5173${redirectPath}?success=true`);
  } catch (error) {
    console.error("Error exchanging code for token:", error);
    res.status(500).json({ error: "OAuth2 authentication failed" });
  }
});


router.get("/events", async (req, res) => {
  try {
    if (!req.session.tokens) {
      return res.status(401).json({ error: "Not logged in" });
    }

    oauth2Client.setCredentials(req.session.tokens);
    const calendar = google.calendar({ version: "v3", auth: oauth2Client });

    const today = new Date();
    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999);

    const response = await calendar.events.list({
      calendarId: "primary",
      timeMin: today.toISOString(),
      timeMax: endOfDay.toISOString(),
      singleEvents: true,
      orderBy: "startTime",
    });

    res.json(response.data.items || []);
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ error: "Failed to fetch calendar events" });
  }
});

export default router;
