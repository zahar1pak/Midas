import os
import re
import json
import httpx
import logging
from typing import Dict, Any, List, Optional
from datetime import datetime

logger = logging.getLogger(__name__)

SYSTEM_PROMPT = """Ты финансовый советник для подростков (используй молодежный сленг, например "бро", "кайф", "запара", "рофл", но без перебора). 
Будь дружелюбным, кратким и полезным. Пиши в стиле нео-брутализма: четко, по делу, с эмодзи."""

class AIService:
    def __init__(self, mock_mode: Optional[bool] = None):
        self.api_key = os.getenv("OPENROUTER_API_KEY", "")
        if mock_mode is not None:
            self.mock_mode = mock_mode
        else:
            self.mock_mode = os.getenv("MOCK_MODE", "false").lower() == "true" and not bool(self.api_key)
        self.api_url = "https://openrouter.ai/api/v1/chat/completions"
        self.model = "meta-llama/llama-3.1-8b-instruct:free"

    async def _call_llm(self, messages: List[Dict[str, str]], response_format: str = "text") -> str:
        if self.mock_mode or not self.api_key:
            return ""

        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "model": self.model,
            "messages": messages,
        }
        
        if response_format == "json":
            payload["response_format"] = {"type": "json_object"}

        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(self.api_url, headers=headers, json=payload, timeout=30.0)
                response.raise_for_status()
                data = response.json()
                return data["choices"][0]["message"]["content"]
        except Exception as e:
            logger.error(f"LLM API Error: {e}")
            return ""

    def _rule_based_parse(self, text: str) -> Dict[str, Any]:
        """Локальный парсер на правилах и регулярках для мгновенного и надежного распознавания"""
        t = text.lower()
        
        # Определяем дату (вчера, позавчера, дни недели)
        days_offset = 0
        if "позавчера" in t:
            days_offset = 2
        elif "вчера" in t:
            days_offset = 1
        elif "3 дня назад" in t or "три дня назад" in t:
            days_offset = 3

        # Определяем тип (доход, расход или копилка)
        is_saving = any(w in t for w in ["отложил", "в копилку", "копилк", "заначк", "накопил", "сберег", "в кубышку", "на инвест"])
        is_income = any(w in t for w in ["зп", "зарплат", "степух", "стипенди", "доход", "получил", "заработал", "перевели", "пришло", "капнул", "подарил"])
        
        if is_saving:
            tx_type = "saving"
        elif is_income:
            tx_type = "income"
        else:
            tx_type = "expense"
        
        # Определяем сумму
        # Ищем паттерны: 50к, 1.5к, 200, 200р, 200 руб, 30$
        amount = 0.0
        match_k = re.search(r'(\d+(?:[.,]\d+)?)\s*(?:к|k)\b', t)
        if match_k:
            raw_val = float(match_k.group(1).replace(',', '.'))
            amount = raw_val * 1000.0
        else:
            match_num = re.search(r'(\d+(?:[.,]\d+)?)', t)
            if match_num:
                amount = float(match_num.group(1).replace(',', '.'))
        
        # Определение валюты
        currency = "RUB"
        if any(w in t for w in ["$", "usd", "бакс", "доллар"]):
            currency = "USD"
        elif any(w in t for w in ["€", "eur", "евро"]):
            currency = "EUR"
        elif any(w in t for w in ["₴", "uah", "грн", "грив"]):
            currency = "UAH"
        elif any(w in t for w in ["¥", "cny", "юан"]):
            currency = "CNY"
        elif any(w in t for w in ["ton", "тон"]):
            currency = "TON"
        elif any(w in t for w in ["btc", "биткоин", "биток"]):
            currency = "BTC"
        elif any(w in t for w in ["eth", "эфир", "эфириум"]):
            currency = "ETH"
        elif any(w in t for w in ["usdt", "тезер"]):
            currency = "USDT"
        elif any(w in t for w in ["sol", "солана"]):
            currency = "SOL"

        # Категория и теги
        category = "Прочее"
        tags = []
        
        if tx_type == "saving":
            category = "Копилка"
            tags.append("копилка")
            tags.append("накопления")
        elif tx_type == "income":
            if any(w in t for w in ["зп", "зарплат", "степух", "стипенди"]):
                category = "Зарплата"
                tags.append("степуха" if "степух" in t or "стипенди" in t else "зп")
            elif any(w in t for w in ["фриланс", "шабашк", "заказ", "проект"]):
                category = "Фриланс"
                tags.append("фриланс")
            elif any(w in t for w in ["подарок", "подарил", "др"]):
                category = "Подарки"
                tags.append("подарок")
            elif any(w in t for w in ["кэшбэк", "кешбек", "бонус"]):
                category = "Кэшбэк"
                tags.append("кэшбэк")
            else:
                category = "Зарплата"
        else:
            if any(w in t for w in ["пятерочк", "магнит", "перекрест", "вкусвилл", "лента", "ашан", "супермаркет", "продукты", "булк", "хлеб"]):
                category = "Супермаркеты"
                tags.append("еда")
            elif any(w in t for w in ["кофе", "пицц", "бургер", "кафе", "ресторан", "мак", "вкусно и точка", "ростикс", "шаурм", "додо", "обед"]):
                category = "Еда и кафе"
                tags.append("еда")
            elif any(w in t for w in ["такси", "яндекс го", "метро", "автобус", "проезд", "бензин", "самокат", "шеринг", "каршеринг"]):
                category = "Транспорт"
                tags.append("транспорт")
            elif any(w in t for w in ["игра", "steam", "стим", "донат", "playstation", "xbox", "кино", "концерт"]):
                category = "Развлечения"
                tags.append("игры")
            elif any(w in t for w in ["подписк", "музыка", "яндекс плюс", "спотифай", "телеграм премиум", "youtube"]):
                category = "Подписки"
                tags.append("подписки")
            elif any(w in t for w in ["одежд", "кроссовки", "шмот", "куртка", "худи", "футболка"]):
                category = "Одежда"
                tags.append("шмот")
            elif any(w in t for w in ["аптека", "лекарств", "врач", "здоровь"]):
                category = "Здоровье"
                tags.append("здоровье")
            elif any(w in t for w in ["курс", "книга", "учеба", "репетитор"]):
                category = "Образование"
                tags.append("учеба")

        return {
            "type": tx_type,
            "amount": amount if amount > 0 else 100.0,
            "currency": currency,
            "category": category,
            "tags": tags,
            "description": text,
            "days_offset": days_offset
        }

    async def analyze_spending(self, transactions: List[Dict[str, Any]]) -> str:
        if not self.api_key:
            return "💡 Бро, судя по всему, ты тратишь больше всего на еду и кафе. Попробуй готовить дома — сэкономишь кучу кэша! 🍳"
            
        transactions_text = json.dumps(transactions[:50], ensure_ascii=False)
        messages = [
            {"role": "system", "content": SYSTEM_PROMPT + " Проанализируй траты и найди утечки денег или дай совет."},
            {"role": "user", "content": f"Мои последние транзакции:\n{transactions_text}"}
        ]
        
        res = await self._call_llm(messages)
        return res if res else "💡 Бро, держи баланс под контролем: откладывай хотя бы 10% с каждого дохода! 💰"

    async def get_saving_tips(self, user_data: Dict[str, Any]) -> List[str]:
        if not self.api_key:
            return [
                "💡 Откладывай 10% с любой пришедшей суммы — правило 'заплати сначала себе' 💰",
                "💡 Перед покупкой дороже 1000₽ подожди 24 часа — это спасает от 80% импульсивных трат ⏳",
                "💡 Проверь свои платные подписки: точно ли всеми пользуешься? 📱"
            ]
            
        messages = [
            {"role": "system", "content": SYSTEM_PROMPT + " Дай 2-3 коротких персонализированных совета по экономии. Верни результат как JSON массив строк: [\"совет 1\", \"совет 2\"]"},
            {"role": "user", "content": f"Мои данные: {json.dumps(user_data, ensure_ascii=False)}"}
        ]
        
        res = await self._call_llm(messages, response_format="json")
        try:
            tips = json.loads(res)
            if isinstance(tips, list):
                return tips
            elif isinstance(tips, dict) and "tips" in tips:
                return tips["tips"]
            return [res]
        except:
            return [
                "💡 Откладывай 10% с каждого дохода, бро!",
                "💡 Следи за мелкими тратами — кофе и перекусы съедают до 30% бюджета!"
            ]

    async def parse_transaction_text(self, text: str) -> Dict[str, Any]:
        """
        Парсит текст "Купил булку за 200р в пятерочке" -> структурированная транзакция.
        Сначала пробует умный быстрый локальный разбор, при наличии LLM уточняет.
        """
        local_result = self._rule_based_parse(text)
        
        if not self.api_key:
            return local_result

        prompt = f"""
Проанализируй текст транзакции: "{text}"
Верни строго JSON объект с полями:
- type (строка: "income" или "expense")
- amount (число)
- currency (строка: "RUB", "USD", "EUR", "UAH", "CNY", "TON", "BTC", "ETH", "USDT", "SOL")
- category (строка: Супермаркеты, Еда и кафе, Транспорт, Жильё, Одежда, Развлечения, Подписки, Здоровье, Образование, Подарки, Зарплата, Фриланс, Прочее)
- tags (массив строк)
- description (краткое описание)

Учитывай молодежный сленг: зп/степуха=зарплата, баксы=USD, 50к=50000.
"""
        messages = [
            {"role": "system", "content": "Ты точный парсер транзакций. Выводи только валидный JSON."},
            {"role": "user", "content": prompt}
        ]

        try:
            res = await self._call_llm(messages, response_format="json")
            cleaned = res.strip().removeprefix('```json').removesuffix('```').strip()
            data = json.loads(cleaned)
            if "amount" in data and float(data["amount"]) > 0:
                return data
        except Exception as e:
            logger.warning(f"LLM parsing fallback to rules: {e}")

        return local_result

    async def get_financial_insight(self, stats: Dict[str, Any]) -> str:
        if not self.api_key:
            return "🔥 Твой баланс на этой неделе стабилен, кайф! Так держать, бро."
            
        messages = [
            {"role": "system", "content": SYSTEM_PROMPT + " Напиши короткий финансовый инсайт по статистике пользователя."},
            {"role": "user", "content": f"Статистика: {json.dumps(stats, ensure_ascii=False)}"}
        ]
        
        res = await self._call_llm(messages)
        return res if res else "Всё отлично, держи финансовую планку! 🚀"

ai_service = AIService()
