import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import session from "express-session";

import calendarRoutes from "./routes/calendarRoutes";
import aiRoutes from "./routes/aiRoutes";
import weatherRoutes from "./routes/weatherRoutes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true, // allow cookies!
  })
);



app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET || "supersecretkey",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // true only if using HTTPS
      sameSite: "lax",
    },
  })
);

// ✅ Route setup
app.use("/api/calendar", calendarRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/weather", weatherRoutes);

app.get("/", (req, res) => {
  res.send("✅ Google Calendar + Weather backend running!");
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

