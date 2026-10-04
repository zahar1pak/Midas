FROM python:3.11-slim

WORKDIR /app

ENV PYTHONUNBUFFERED=1 \
    PYTHONIOENCODING=utf-8 \
    PORT=7860 \
    PYTHONPATH=/app/api:/app/bot

RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

COPY api/requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r /app/requirements.txt

COPY api /app/api
COPY bot /app/bot
COPY start.sh /app/start.sh
RUN chmod +x /app/start.sh

EXPOSE 7860

CMD ["/app/start.sh"]
