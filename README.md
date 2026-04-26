<<<<<<< HEAD
# Merit-Loop Engine

Merit-Loop Engine is an AI-powered platform for **skill-first technical hiring**:

- Real coding assessments
- AI mentorship (non-spoiler hints)
- Anonymous candidate evaluation
- Merit-based rankings + reveal thresholds

## Repo structure

- `backend/` — Express API (assessments, sessions, mentor hints, auth)
- `demo_hire/` — Next.js + Chakra UI frontend

## Quick start (local)

### 1) Start MongoDB (for auth)

```bash
cd backend
docker compose -f docker/docker-compose.dev.yml up -d mongo
```

### 2) Start backend API (port 8080)

```bash
cd backend
npm run dev
```

### 3) Start frontend (port 3000)

Create `demo_hire/.env.local`:

```env
API_BASE_URL=http://localhost:8080
```

Then:

```bash
cd demo_hire
npm run dev
```

Open:

- http://localhost:3000 (landing)
- http://localhost:3000/dashboard (assessments)

## Use cases

- Companies: reduce resume bias and improve screening signal
- Candidates: compete on proof-of-work (not pedigree)
- Students: interview practice with guidance, not answers
- Startups: faster hiring with rankings + session replay
- D&I programs: blind evaluation until merit threshold is met

## Notes

- The backend supports deterministic mentor hints without any API key.
- If you want Grok-powered mentoring, add `GROK_API_KEY` in `backend/.env`.
=======
# Merit-Tech
>>>>>>> 9e4de59cd185abf5f8f4a142a8878f8a05e4e8e7
