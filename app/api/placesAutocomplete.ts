import type { NextApiRequest, NextApiResponse } from "next";

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY; // Store your API key in .env.local

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { input, locationBias } = req.body;

  if (!input) {
    return res.status(400).json({ error: "Input is required" });
  }

  const url = "https://places.googleapis.com/v1/places:autocomplete";

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": GOOGLE_API_KEY!,
      },
      body: JSON.stringify({
        input,
        locationBias,
      }),
    });

    if (!response.ok) {
      throw new Error(`Google API error: ${response.status}`);
    }

    const data = await response.json();
    res.status(200).json(data); // Send the autocomplete results back to the frontend
  } catch (error) {
    console.error("Error querying Google Places API:", error);
    res.status(500).json({ error: "Failed to fetch autocomplete results" });
  }
}