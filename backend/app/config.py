from pydantic_settings import BaseSettings  # ✅ NEW import

class Settings(BaseSettings):
    DATABASE_URL: str = "sqlite:///./test.db"
    LLM_PROVIDER: str = "openai"
    OPENAI_API_KEY: str | None = None
    CACHE_TTL_SECONDS: int = 3600

    class Config:
        env_file = ".env"

settings = Settings()
