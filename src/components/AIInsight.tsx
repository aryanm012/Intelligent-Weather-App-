import { useEffect, useState } from "react";

interface AIInsightsProps {
  weather: any;
  events: any[];
}

export default function AIInsights({ weather, events }: AIInsightsProps) {
  const [insight, setInsight] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (weather && events.length > 0) {
      fetchAIInsight();
    }
  }, [weather, events]);

  const fetchAIInsight = async () => {
    setLoading(true);
    try {
      const prompt = `
        Based on the following data, give helpful daily insights:
        - Weather: ${JSON.stringify(weather, null, 2)}
        - Upcoming Calendar Events: ${JSON.stringify(events, null, 2)}

        Suggest how the user might plan their day — e.g., outdoor activities, reminders about rain, or scheduling tips.
        Keep it short, friendly, and relevant.
      `;

      const res = await fetch("http://localhost:5000/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();
      console.log(data.insight);
      setInsight(data.insight);
    } catch (error) {
      console.error("AI Insight Error:", error);
      setInsight("Failed to generate insights. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 shadow-2xl border border-white/20 mt-8 text-white">
      <h2 className="text-2xl font-bold mb-4">AI Insights</h2>
      {loading ? (
        <p>Generating insights...</p>
      ) : (
        <p className="whitespace-pre-line">{insight || "No insights yet."}</p>
      )}
    </div>
  );
}
