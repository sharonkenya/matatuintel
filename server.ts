import "dotenv/config";
import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import fs from "fs";

// Baseline knowledge base
const baselineData = JSON.parse(fs.readFileSync("./src/api/baseline.json", "utf-8"));

// Real-time "Friction & Availability Matrix" (In-memory for MVP)
let frictionMatrix: any[] = [
  {
    origin_stage: "Kawangware",
    destination_stage: "CBD",
    route_number: "46",
    status: "long_queue",
    fare_amount: 50,
    confidence: "High",
    notes: "Manyanga zimejaa stage, queue ni ndefu sana sai.",
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    sender: "Commuter_88"
  },
  {
    origin_stage: "CBD (Kencom)",
    destination_stage: "Ngong",
    route_number: "111",
    status: "smooth",
    fare_amount: 80,
    confidence: "High",
    notes: "Supa inasonga chapchap, hakuna jam kuelekea Karen.",
    timestamp: new Date(Date.now() - 1000 * 60 * 12),
    sender: "Touter_Vibe"
  },
  {
    origin_stage: "Ngara",
    destination_stage: "Thika Road",
    route_number: "44",
    status: "heavy_traffic",
    fare_amount: 60,
    confidence: "Medium",
    notes: "Jam kali kuelekea pangani, better use forest road shortcuts.",
    timestamp: new Date(Date.now() - 1000 * 60 * 20),
    sender: "Rider_X"
  },
  {
    origin_stage: "Commercial",
    destination_stage: "Ruai",
    route_number: "120",
    status: "fare_hike",
    fare_amount: 120,
    confidence: "High",
    notes: "Fare imepanda mbao juu ya mvua imeanza.",
    timestamp: new Date(Date.now() - 1000 * 60 * 35),
    sender: "Mama_Njeru"
  },
  {
    origin_stage: "Westlands",
    destination_stage: "CBD",
    route_number: "105",
    status: "no_cars",
    fare_amount: 70,
    confidence: "High",
    notes: "No mats at the stage, commuters waiting since 3pm.",
    timestamp: new Date(Date.now() - 1000 * 60 * 45),
    sender: "JohnS"
  }
];

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY as string,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// --- GOOGLE AI STUDIO: GEMINI MODULES ---

/**
 * MODULE: Crowdsource Parser
 * Takes raw SMS and extracts structured transit telemetry.
 */
async function parseCrowdsourcedSMS(sms: string) {
  const prompt = `
    You are the Real-Time Ingestion Module for the Nairobi Matatu Intelligence Agent.
    Your job is to take unstructured, slang-heavy, messy SMS updates from commuters and touts, and extract structured transit telemetry.

    Analyze the incoming text and output a JSON object with the following fields:
    - "origin_stage": (String or null)
    - "destination_stage": (String or null)
    - "route_number": (String or null, e.g., "46", "102")
    - "fare_amount": (Number or null, e.g., 50, 100)
    - "status": ("smooth", "heavy_traffic", "long_queue", "no_cars", "fare_hike")
    - "confidence": (High/Medium/Low based on how clear the SMS is)
    - "notes": (Brief summary of any specific hyper-local advice. Use natural Kenyan phrasing if possible, like "jam kali hapa" or "fare imepanda")

    Examples:
    - "Manyanga zimejaa stage" -> status: long_queue / no_cars
    - "Supa ya Thika inasonga chapchap" -> status: smooth
    - "Fare imeongezwa mbao" -> status: fare_hike
    - "Town iko na fujo, epuka CBD" -> status: heavy_traffic / avoid area
    - "Jam ni mob kwa Kencom" -> status: heavy_traffic

    Incoming SMS: "${sms}"
    Output valid JSON only.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const result = JSON.parse(response.text || "{}");
    return result;
  } catch (error) {
    console.error("Gemini Parsing Error:", error);
    return null;
  }
}

/**
 * MODULE: Route Inference Engine
 * Reasons through optimal path based on Baseline + Real-time Friction.
 */
async function inferRoute(query: string) {
  const prompt = `
    You are the Nairobi Matatu Route Intelligence Agent, an expert digital conductor. You are a proactive Nairobi commuter companion.
    You know the local informal transit network better than anyone and reason using a baseline map and real-time crowdsourced reports.

    PERSONALITY:
    - Friendly like a local guide, street-smart, practical.
    - Blend Kenyan English, Sheng (light, natural), and Nairobi commuter slang.
    - Sound like someone who actually uses matatus daily (e.g., "Uko wapi sai?", "Jam kali", "Nganya", "Mat").

    PROACTIVITY:
    - Do NOT wait only for questions.
    - Anticipate needs: Warn about traffic before asked, suggest shortcuts or faster routes.
    - Ask clarifying questions if vague: "Nipee starting point nikupange vizuri."
    - Adapt to time/context: Rush hour urgency, night safety, rain delays.

    Current Real-Time Crowd Updates:
    '''
    ${JSON.stringify(frictionMatrix, null, 2)}
    '''

    Baseline Network Rules (Typical Fares Included):
    '''
    ${JSON.stringify(baselineData.routes, null, 2)}
    '''
    - Kawangware to CBD usually uses Route 46 or 56. Major drop-off is Ambassadeur or Kencom.
    - CBD to Ruai usually requires walking across town to Commercial, Accra Road, or Ronald Ngala to board Route 120, 121, or Country Bus matatus heading via Outering/Jogoo Road.
    - Alternative bypasses: Northern Bypass, Outering Road hubs (Allsops/Pipeline).

    User Query: "${query}"

    Task:
    1. Reason Through the optimal path considering real-time updates.
    2. Proactively warn if preferred stages are tight and suggest alternatives ("unaweza cheza hii route ingine...").
    3. Include FARE ESTIMATES in the travel plan based on Baseline + Real-time signals.
    4. LANGUAGE MATCHING: Detect the language and tone of the User Query (English, Swahili, or Sheng). Respond using the same linguistic style and balance. If they use heavy Sheng, respond with heavy Sheng. If they are formal, be helpful but slightly more structured, while still keeping the Nairobi street-smart persona.
    5. Output in an authentic Kenyan tone matching the user.

    Output Format:
    [Route] Step 1 (Fare X) -> Step 2 (Fare Y) -> Step 3
    [Alerts] (Any real-time issues, proactive warnings)
    [Advice] (Short hyper-local tip, "Uko wapi sai?" if starting point is missing)
    [Total Fare] Estimated total cost in KES
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Inference Error:", error);
    return "Pole sana, my brain is a bit jammed right now. Try again in a few!";
  }
}

// --- API ENDPOINTS ---

// Africa's Talking Webhook (Mocked or real)
app.post("/api/sms/webhook", async (req, res) => {
  const { from, text } = req.body; // text is the message body

  if (!text) {
    return res.status(400).json({ error: "Missing text" });
  }

  // Orchestrator Logic:
  // Is it a report (e.g., has "stage", "fare", "traffic") or a query (e.g., "how to", "to")?
  // We'll use a simple keyword check or let Gemini decide.
  // For simplicity: if it has "to" and is short, it's likely a query.
  const isQuery = text.toLowerCase().includes("how") || text.toLowerCase().includes("to") && text.split(" ").length < 8;

  if (!isQuery) {
    // REPORT
    const parsed = await parseCrowdsourcedSMS(text);
    if (parsed) {
      parsed.timestamp = new Date();
      parsed.sender = from || "Anonymous";
      frictionMatrix.unshift(parsed);
      // Keep only last 50 reports
      if (frictionMatrix.length > 50) frictionMatrix.pop();

      return res.json({ response: "Asante for the update! Unaokoa ma-commuter wengine. Stay safe hapo stage!" });
    }
  } else {
    // QUERY
    const reply = await inferRoute(text);
    return res.json({ response: reply });
  }

  res.json({ response: "Nimekusikia, but boss, sijaguza hapo. Use 'to' for routes or just report what's happening at your stage." });
});

// Get current friction matrix for the dashboard
app.get("/api/reports", (req, res) => {
  res.json(frictionMatrix);
});

async function startServer() {
  const PORT = 3000;

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Matatu Intelligence Server running on http://localhost:${PORT}`);
  });
}

startServer();
