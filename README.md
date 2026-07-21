# Life Admin

**Turn life's messy messages into your next actions.** Paste a travel itinerary, school email, bill notice, or personal note and receive an organized summary, dates, prioritized checklist, and useful next step.

## Run locally

Requires Node.js 18+.

```bash
npm.cmd run dev
```

Open http://localhost:3000. The app has no dependencies and works in local demo mode without a key.

## Features

- Deterministic travel, school, and bill examples
- Graceful generic action plan for arbitrary pasted text
- Important dates, urgency, categorized checklist, and copy action
- Recent analyses saved locally in browser localStorage
- Responsive and keyboard-friendly design

## Architecture

`index.html` defines the UI; `styles.css` provides responsive styling; `app.js` contains local demo analysis and interactions; `server.js` is a zero-dependency Node static server.

## AI for arbitrary messages (recommended)

To analyze arbitrary messages intelligently—not just the built-in examples—copy `.env.example` to `.env`, then add an OpenAI API key:

```text
OPENAI_API_KEY=your_key_here
```

Restart the server. The browser sends text only to this app’s server, and the server calls the OpenAI Responses API; the key is never exposed in browser code. Without a key, the app falls back to local bill recognition and a general action-plan fallback.

## Built with Codex and GPT-5.6

Codex and GPT-5.6 accelerated MVP scoping, the responsive interface, reliable demo data, interactive state handling, server setup, checking, and documentation. The project prioritizes a clear problem and polished live demo over unnecessary integrations.
