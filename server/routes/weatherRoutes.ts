import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;

// GET /api/weather?city=Toronto
// GET /api/weather?lat=40.7128&lon=-74.0060
router.get("/", async (req, res) => {
  const { city, lat, lon } = req.query;

  if (!city && (lat === undefined || lon === undefined)) {
    return res.status(400).json({ error: "City or coordinates required" });
  }

  try {
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?appid=${OPENWEATHER_API_KEY}&units=imperial`;

    if (city) {
      apiUrl += `&q=${encodeURIComponent(city as string)}`;
    } else if (lat && lon) {
      apiUrl += `&lat=${lat}&lon=${lon}`;
    }

    const response = await axios.get(apiUrl);
    res.json(response.data);
  } catch (error: any) {
    if (error.response) {
      // If OpenWeather returned an error
      res.status(error.response.status).json({ error: error.response.data.message });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

export default router;
