import os
import logging
from typing import Optional

logger = logging.getLogger(__name__)

class VoiceService:
    def __init__(self):
        self._model = None

    def _get_model(self):
        if self._model is None:
            from faster_whisper import WhisperModel
            # Load tiny model with int8 quantization on CPU (blazing fast and accurate on Russian)
            self._model = WhisperModel("tiny", device="cpu", compute_type="int8")
        return self._model

    async def process_voice_message(self, file_path: str) -> Optional[str]:
        """
        Real Speech-To-Text transcription using faster-whisper.
        Decodes Telegram .ogg/.oga voice messages and transcribes speech into text.
        """
        try:
            model = self._get_model()
            segments, info = model.transcribe(
                file_path,
                language="ru",
                beam_size=5,
                vad_filter=True, # filter out non-speech silences
                vad_parameters=dict(min_silence_duration_ms=500)
            )
            text_parts = [segment.text.strip() for segment in segments]
            transcribed = " ".join(text_parts).strip()
            logger.info(f"Transcribed voice message: '{transcribed}' (language: {info.language})")
            return transcribed if transcribed else None
        except Exception as e:
            logger.error(f"Error transcribing voice with faster-whisper: {e}")
            return None

voice_service = VoiceService()
