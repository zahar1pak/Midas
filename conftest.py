import sys
from pathlib import Path

root = Path(__file__).resolve().parent
api_dir = str(root / "api")
bot_dir = str(root / "bot")
bot_nested = str(root / "bot" / "bot")

for p in [bot_nested, bot_dir, api_dir]:
    while p in sys.path:
        sys.path.remove(p)
    sys.path.insert(0, p)
