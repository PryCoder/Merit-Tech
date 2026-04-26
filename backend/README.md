# Merit Loop Backend

## Local development

### Option A: Local MongoDB via Docker (recommended)

1. Start MongoDB:

```bash
docker compose -f docker/docker-compose.dev.yml up -d mongo
```

2. Ensure your `.env` uses a local URI:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/merit_loop
```

3. Run the API:

```bash
npm run dev
```

### Option B: MongoDB Atlas

- Set `MONGODB_URI` in `.env` to your Atlas connection string.
- If you see `Authentication failed`, verify the Atlas DB user/password.
- If you see connection timeouts, check Atlas **Network Access** (IP allowlist).

## Tests

```bash
npm test
```
