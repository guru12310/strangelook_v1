# StrangeLook frontend

Responsive HTML/CSS/vanilla JavaScript concept frontend.

## Run
1. Start the backend (`npm install`, configure `.env`, `npm run db:migrate`, `npm run dev`).
2. Serve this folder using a local static server, for example:
   `npx serve .` or VS Code Live Server.
3. Open the served URL. API base URL is `http://localhost:3000/api`.

The landing page includes a plan creation form connected to `POST /api/plans`. Public plan cards are sample design content only. Authentication, verified identity, requests, chat, voice upload and moderation UI are intentionally not faked as working features.
