import { getStore } from "@netlify/blobs";

export default async (req, context) => {
  // CORS headers
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Content-Type": "application/json",
  };

  // Handle preflight OPTIONS request
  if (req.method === "OPTIONS") {
    return new Response("", {
      status: 200,
      headers,
    });
  }

  try {
    // Get the blob store - Netlify automatically provides credentials in Functions v2
    const store = getStore("map-pins");

    // GET - Retrieve all pins
    if (req.method === "GET") {
      try {
        const pinsData = await store.get("pins", { type: "json" });
        const pins = pinsData || [];

        return new Response(JSON.stringify({ pins }), {
          status: 200,
          headers,
        });
      } catch (error) {
        console.log("No existing pins, returning empty array:", error.message);
        // If no pins exist yet, return empty array
        return new Response(JSON.stringify({ pins: [] }), {
          status: 200,
          headers,
        });
      }
    }

    // POST - Add a new pin
    if (req.method === "POST") {
      const newPin = await req.json();

      // Validate pin data
      if (!newPin.lat || !newPin.lng) {
        return new Response(
          JSON.stringify({
            error: "Invalid pin data: lat and lng are required",
          }),
          {
            status: 400,
            headers,
          }
        );
      }

      // Add unique ID and ensure timestamp
      newPin.id =
        Date.now().toString() + Math.random().toString(36).substr(2, 9);
      newPin.timestamp = newPin.timestamp || new Date().toISOString();

      // Sanitize message
      if (newPin.message) {
        newPin.message = newPin.message.substring(0, 500); // Limit message length
      }

      // Get existing pins
      let pins = [];
      try {
        const pinsData = await store.get("pins", { type: "json" });
        pins = Array.isArray(pinsData) ? pinsData : [];
      } catch (error) {
        console.log("Creating new pins array");
        // If no pins exist yet, start with empty array
        pins = [];
      }

      // Add new pin
      pins.push(newPin);

      // Keep only last 1000 pins to prevent unlimited growth
      if (pins.length > 1000) {
        pins = pins.slice(-1000);
      }

      // Save updated pins
      await store.setJSON("pins", pins);

      return new Response(
        JSON.stringify({
          message: "Pin added successfully",
          pin: newPin,
        }),
        {
          status: 201,
          headers,
        }
      );
    }

    // Method not allowed
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers,
    });
  } catch (error) {
    console.error("Error in pins function:", error);
    console.error("Error stack:", error.stack);
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        message: error.message,
        details: error.toString(),
      }),
      {
        status: 500,
        headers,
      }
    );
  }
};
