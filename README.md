This project now demonstrates a one-shot OpenUI analytics flow:

- a frontend button triggers analytics generation
- the backend owns the prompt and OpenAI key
- the frontend progressively renders streamed OpenUI output as a dashboard

## Frontend

Install dependencies and run the Next.js frontend:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

To point the frontend at FastAPI instead of the local Next route, create a root `.env.local` file:

```bash
cp .env.example .env.local
```

Then set `NEXT_PUBLIC_ANALYTICS_API_URL` to your FastAPI endpoint, for example:

```bash
NEXT_PUBLIC_ANALYTICS_API_URL=http://localhost:8000/api/analytics/generate
```

## FastAPI Backend

A reference FastAPI implementation lives in `fastapi-backend/`.

Create a virtual environment, install dependencies, and run it:

```bash
cd fastapi-backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload --port 8000
```

Available endpoints:

- `GET /health`
- `POST /api/analytics/generate`

The FastAPI app includes:

- backend-owned analytics prompt generation
- streamed OpenAI execution with the server-side API key
- CORS configuration for local frontend origins
- SSE delivery so the frontend can progressively render the dashboard
- deterministic fallback OpenUI output if the final model response is malformed

## Learn More

To learn more about OpenUI, take a look at the following resources:

- [OpenUI Documentation](https://openui.com/docs) - learn about OpenUI features and API.
- [OpenUI GitHub repository](https://github.com/thesysdev/openui) - your feedback and contributions are welcome!
