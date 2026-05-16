# Matatu Intel Agent 🚌 🇰🇪

A proactive, Nairobi-native transit intelligence agent built with Google Gemini. It crowdsources real-time transit reports (slang, lingo, and all) and reasons through the best routes to keep you moving through the city.

![Matatu Intel Preview](https://images.unsplash.com/photo-1549421263-549433994784?q=80&w=1200&auto=format&fit=crop)

## 🌟 Key Features

- **Real-Time Ingestion Module**: Gemini-powered parser that turns messy SMS/Sheng updates into structured transit telemetry (traffic status, fare hikes, stage queues).
- **Proactive Commuter Companion**: An interactive chatbot that doesn't just answer—it anticipates. It warns you about rain delays, traffic spikes, and suggests "cheza kama wewe" bypasses.
- **Authentic Nairobi Lingo**: Communicates in a natural blend of Kenyan English and Sheng. No robotic GPS tones here.
- **Friction & Availability Matrix**: A live, high-fidelity dashboard of active crowd signals across the Nairobi network.
- **Dynamic Fare Estimates**: Real-time fare tracking based on baseline data and live "fare hike" reports due to rain or rush hour.

## 🛠️ Tech Stack

- **Frontend**: React 19, Tailwind CSS (V4), Motion (for fluid animations), Lucide React.
- **Backend**: Node.js, Express, tsx.
- **AI/LLM**: Google Generative AI (Gemini 2.0 Flash) for semantic parsing and pathfinding reasoning.
- **Infrastructure**: Vite (Frontend Dev), Esbuild (Server Bundling).

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- A Google AI Studio API Key (for Gemini)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/matatu-intel-agent.git
   cd matatu-intel-agent
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Configure Environment Variables:
   Create a `.env` file in the root directory:
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```

### Running the App

**Development Mode** (Hot Reloading for frontend & backend):

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

**Production Build**:

```bash
npm run build
npm start
```

## 🧠 How it Works

1. **Crowdsourcing**: Users send updates like _"Jam ni mob kwa Kencom"_ or _"Fare imeweza mbao hapa Ngara"_.
2. **Telemetric Extraction**: Gemini parses this into structured data (Location: Kencom, Status: heavy_traffic).
3. **Reasoning Engine**: When a user asks for a route, the agent combines a baseline network map with the live "Friction Matrix" to infer the fastest or safest path.
4. **Lingo Mapping**: The agent matches the user's tone. Speak Sheng? It speaks Sheng back. Formal? It stays smart but polite.

## 🤝 Contributing

Nairobi transit is complex! Feel free to open an issue or submit a PR if you have ideas for better route mappings, more lingo support, or UI improvements.

## 📄 License

Apache-2.0
