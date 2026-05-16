# Matatu Intel Agent 🚌 🇰🇪

A proactive, Nairobi-native transit intelligence agent built with Google Gemini. It crowdsources real-time transit reports (slang, lingo, and all) and reasons through the best routes to keep you moving through the city.

https://matatu-intelligence-agent-360087733493.europe-west2.run.app/

## 🛑 The Problem

Nairobi's transit system (Matatus) is the heartbeat of the city, but it's unpredictable. Commuters face three major "frictions" every day:

1. **The Information Gap**: You don't know if there's a huge queue at the stage until you get there.
2. **The "Fare Hike" Surprise**: Fares can double in minutes due to a sudden downpour or rush hour madness.
3. **The Static Trap**: Standard GPS apps don't know about informal shortcuts or "manyanga" routes that skip the jam.

**Matatu Intel** solves this by turning every commuter into a sensor, creating a live, street-smart "Pulse" of the city's movement.

## 🧠 Agent Architecture

Our system uses a multi-layered reasoning approach powered by **Gemini 2.0 Flash**:

1.  **The Ingestion Agent (The "Conductor")**:
    - **Role**: Listens to informal, high-context reports (Sheng/Slang).
    - **Tools**: Semantic Extraction. It parses a sentence like _"Jam ni mob sai"_ into structured JSON data.
2.  **The Routing Agent (The "Street-Smart Guide")**:
    - **Role**: Provides travel plans.
    - **Tools**: Baseline Network Map + Live Friction Matrix.
    - **Communication**: It "reasons" by comparing the user's intent with the latest crowd signals. It proactively warns about delays and suggests alternatives using local lingo.

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

## 🚀 Getting Started (Local)

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/your-username/matatu-intel-agent.git
    cd matatu-intel-agent
    ```
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Configure Environment Variables**:
    Create a `.env` file with your `GEMINI_API_KEY`.
4.  **Run Development Server**:
    ```bash
    npm run dev
    ```
    Access at `http://localhost:3000`.

## 🎮 How to Interact

### Deployed Version

You can access the live application here: [Matatu Intel Live Demo](https://ais-pre-mmzflosoojdeg5e36ogd5t-768022336494.europe-west2.run.app)

### Interaction Guide

1. **The Intelligence Terminal (Chat)**

   - **Report**: Type anything like _"Kuna jam kali hapa Kencom"_ or use the Quick Action buttons below the chat to report state changes.
   - **Ask**: Ask for directions like _"To Ruai from CBD"_ or _"Kuna mat za Kikuyu?"_.
   - **Proactivity**: Notice how the agent anticipates your needs—it might ask _"Uko wapi sai?"_ if you forget your starting point, or proactively warn you about fare hikes due to rain.

2. **The Nairobi Pulse (Dashboard)**
   - The right-hand panel shows the live **Friction & Availability Matrix**.
   - Watch updates flow in real-time as the **Ingestion Agent** processes crowd signals into structured alerts with confidence scores and fare updates.

## 🎥 Demo

![alt text](<Screenshot 2026-05-16 at 16.25.11.png>)
![alt text](<Screenshot 2026-05-16 at 16.26.10.png>)

## 👥 The Team

- **[Titus Kiprotich]** - Team lead
- **[Hillary Omondi]** - designer
- **[Lloyd Omondi]** - frontend developer
- **[Sharon Kamau]** - AI engineer
- **[Eric Kamau ]** - QA and testing

## ⚖️ Data & Neutrality Policy (Challenge 06)

- **Political Neutrality**: Matatu Intel is a strictly utilitarian transit tool. It does not prioritize any route based on political affiliation or commercial kickbacks.
- **Data Handling**: We do not store PII (Personally Identifiable Information). In this MVP, all traffic reports are session-based and handled anonymously to protect commuter privacy.
- **Accuracy**: Reports are weighted by a "Confidence" score assigned by the Ingestion Agent based on clarity and linguistic consistency.

## 🤝 Contributing

Nairobi transit is complex! Feel free to open an issue or submit a PR for better route mappings or more lingo support.

## 📄 License

Apache-2.0
