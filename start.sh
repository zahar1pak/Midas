#!/bin/sh
set -e

echo "[MIDAS] Starting Telegram Bot in background..."
export PYTHONPATH="/app/api:/app/bot:$PYTHONPATH"
python -m bot.main &

echo "[MIDAS] Starting FastAPI Server on port 7860..."
exec uvicorn app.main:app --app-dir /app/api --host 0.0.0.0 --port ${PORT:-7860}
