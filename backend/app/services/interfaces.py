from abc import ABC, abstractmethod


class STTProvider(ABC):
    @abstractmethod
    async def transcribe(self, audio_bytes: bytes) -> str:
        raise NotImplementedError


class LLMProvider(ABC):
    @abstractmethod
    async def generate(self, messages: list[dict]) -> str:
        raise NotImplementedError

    @abstractmethod
    async def stream_generate(self, messages: list[dict]):
        raise NotImplementedError


class TTSProvider(ABC):
    @abstractmethod
    async def synthesize(self, text: str) -> bytes:
        raise NotImplementedError
