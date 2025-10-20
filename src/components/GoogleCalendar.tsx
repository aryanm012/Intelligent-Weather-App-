import { useEffect, useState } from "react";

interface GoogleCalendarProps {
  onEventsFetched: (events: any[]) => void;
}

export default function GoogleCalendar({ onEventsFetched }: GoogleCalendarProps) {
  const [authUrl, setAuthUrl] = useState<string | null>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const success = params.get("success");
    if (success === "true") {
      fetchEvents();
    } else {
      fetchAuthUrl();
    }
  }, []);

  const fetchAuthUrl = async () => {
    try {
      const currentPath = window.location.pathname;
      const res = await fetch(
        `http://localhost:5000/api/calendar/auth?redirect=${encodeURIComponent(currentPath)}`,
        { credentials: "include" }
      );
      const data = await res.json();
      setAuthUrl(data.url);
    } catch (error) {
      console.error("Error fetching auth URL:", error);
    }
  };

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/calendar/events", {
        credentials: "include",
      });
      const data = await res.json();
      setEvents(data || []);
      onEventsFetched(data || []);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white/10 backdrop-blur-lg rounded-2xl text-white mt-8 border border-white/20 shadow-2xl">
      <h2 className="text-2xl font-bold mb-4">Google Calendar Integration</h2>

      {!events.length && !loading && (
        <div>
          {authUrl ? (
            <a
              href={authUrl}
              className="px-6 py-3 bg-blue-600 rounded-xl hover:bg-blue-700 transition font-semibold"
            >
              Sign in with Google
            </a>
          ) : (
            <p>No Events Scheduled</p>
          )}
        </div>
      )}

      {loading && <p>Loading events...</p>}

      {events.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold mb-4">Today’s Events</h3>
          <ul className="space-y-2">
            {events.map((event, i) => (
              <li
                key={i}
                className="bg-white/5 p-3 rounded-xl border border-white/10"
              >
                <strong>{event.summary}</strong>
                <div className="text-sm text-white/70">
                  {event.start?.dateTime
                    ? new Date(event.start.dateTime).toLocaleString()
                    : "All day"}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
