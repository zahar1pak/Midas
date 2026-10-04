import os
import logging
import httpx
from typing import Optional

logger = logging.getLogger(__name__)

class VoiceService:
    def __init__(self):
        self._model = None
        self.groq_key = os.getenv("GROQ_API_KEY", "")
        self.openai_key = os.getenv("OPENAI_API_KEY", "")

    def _get_model(self):
        if self._model is None:
            from faster_whisper import WhisperModel
            # Load model with int8 quantization on CPU
            # Using prompt helps tiny model achieve near-large accuracy on financial slang
            self._model = WhisperModel("tiny", device="cpu", compute_type="int8")
        return self._model

    async def _transcribe_with_cloud(self, file_path: str) -> Optional[str]:
        """Try Groq Whisper (blazing fast ~0.3s) or OpenAI Whisper if keys provided"""
        api_key = self.groq_key or self.openai_key
        if not api_key:
            return None

        url = "https://api.groq.com/openai/v1/audio/transcriptions" if self.groq_key else "https://api.openai.com/v1/audio/transcriptions"
        model_name = "whisper-large-v3-turbo" if self.groq_key else "whisper-1"

        try:
            async with httpx.AsyncClient(timeout=20.0) as client:
                with open(file_path, "rb") as f:
                    files = {"file": (os.path.basename(file_path), f, "audio/ogg")}
                    data = {
                        "model": model_name,
                        "language": "ru",
                        "prompt": "Финансы, расходы, доходы, рубли, косарь, пятихатка, сотка, в копилку, отложил, потратил, купил"
                    }
                    headers = {"Authorization": f"Bearer {api_key}"}
                    response = await client.post(url, headers=headers, files=files, data=data)
                    if response.status_code == 200:
                        text = response.json().get("text", "").strip()
                        if text:
                            logger.info(f"Cloud Whisper transcribed: '{text}'")
                            return text
        except Exception as e:
            logger.warning(f"Cloud Whisper failed, falling back to local: {e}")
        return None

    async def process_voice_message(self, file_path: str) -> Optional[str]:
        """
        Real Speech-To-Text transcription.
        Tries Cloud Whisper API first if key configured, otherwise faster-whisper with financial prompts.
        """
        # 1. Try cloud whisper if key configured
        cloud_result = await self._transcribe_with_cloud(file_path)
        if cloud_result:
            return cloud_result

        # 2. Local faster-whisper with specialized financial Russian prompt
        try:
            model = self._get_model()
            segments, info = model.transcribe(
                file_path,
                language="ru",
                beam_size=5,
                initial_prompt="Потратил 500 рублей на кофе, отложил косарь в копилку, получил зарплату 50 тысяч, купил шаурму за 250, такси 400",
                vad_filter=True,
                vad_parameters=dict(min_silence_duration_ms=400)
            )
            text_parts = [segment.text.strip() for segment in segments]
            transcribed = " ".join(text_parts).strip()
            logger.info(f"Local transcribed voice message: '{transcribed}' (language: {info.language})")
            return transcribed if transcribed else None
        except Exception as e:
            logger.error(f"Error transcribing voice with faster-whisper: {e}")
            return None

voice_service = VoiceService()
