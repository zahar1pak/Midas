import os
import sys
import subprocess
import threading
import time

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(BASE_DIR, "api"))
sys.path.insert(0, os.path.join(BASE_DIR, "bot"))

# Launch telegram bot in background process
def start_bot():
    time.sleep(2)
    try:
        print("[MIDAS] Launching Telegram Bot in cloud background...")
        subprocess.Popen([sys.executable, "-m", "bot.main"], cwd=BASE_DIR)
    except Exception as e:
        print(f"[MIDAS BOT ERROR] {e}")

bot_thread = threading.Thread(target=start_bot, daemon=True)
bot_thread.start()

# Load FastAPI app and Gradio
from app.main import app as fastapi_app
import gradio as gr

with gr.Blocks(title="Midas API & Bot") as demo:
    gr.Markdown("# 👑 Midas Fintech API & Telegram Bot")
    gr.Markdown("🟢 Сервер и Telegram-бот успешно запущены и работают 24/7!")
    gr.Markdown("API эндпоинты: `/transactions/sync`, `/stats/summary`, `/currency/crypto`")

# Mount Gradio onto FastAPI
app = gr.mount_gradio_app(fastapi_app, demo, path="/gradio")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=7860)
