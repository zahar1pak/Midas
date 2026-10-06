import logging
import time
from telegram.ext import ApplicationBuilder, CommandHandler, MessageHandler, filters
from telegram.request import HTTPXRequest
from bot.config import settings
from bot.handlers.start import start_command
from bot.handlers.voice import voice_handler
from bot.handlers.stats import text_handler
from bot.handlers.webapp import webapp_command
from bot.handlers.admin import id_command, admin_command, support_command

logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.INFO
)

def run_bot():
    if settings.TELEGRAM_BOT_TOKEN == "TEST_TOKEN":
        logging.warning("Using TEST_TOKEN. Please set TELEGRAM_BOT_TOKEN in .env")

    request = HTTPXRequest(
        connect_timeout=30.0,
        read_timeout=30.0,
        write_timeout=30.0,
        pool_timeout=30.0,
        proxy=settings.TELEGRAM_PROXY_URL,
    )

    application = (
        ApplicationBuilder()
        .token(settings.TELEGRAM_BOT_TOKEN)
        .request(request)
        .get_updates_request(request)
        .build()
    )

    application.add_handler(CommandHandler("start", start_command))
    application.add_handler(CommandHandler("app", webapp_command))
    application.add_handler(CommandHandler("id", id_command))
    application.add_handler(CommandHandler("admin", admin_command))
    application.add_handler(CommandHandler("support", support_command))
    
    application.add_handler(MessageHandler(filters.VOICE, voice_handler))
    application.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, text_handler))

    logging.info("[MIDAS BOT] Starting polling with auto-reconnect...")
    application.run_polling(
        drop_pending_updates=True,
        allowed_updates=["message", "callback_query"],
        bootstrap_retries=-1,
        poll_interval=1.0,
    )

def start_support_bot():
    try:
        import sys, subprocess, os
        bot_dir = os.path.dirname(os.path.abspath(__file__))
        parent_dir = os.path.dirname(bot_dir)
        subprocess.Popen([sys.executable, "-m", "bot.support_bot"], cwd=parent_dir)
        logging.info("[MIDAS] Launched Support Bot (@GoldMidaasHelp_bot) background process")
    except Exception as e:
        logging.warning(f"Could not launch support bot: {e}")

def main():
    start_support_bot()
    while True:
        try:
            run_bot()
        except KeyboardInterrupt:
            break
        except Exception as e:
            logging.error(f"[MIDAS BOT] Connection dropped: {e}. Reconnecting in 3s...")
            time.sleep(3)

if __name__ == '__main__':
    main()
