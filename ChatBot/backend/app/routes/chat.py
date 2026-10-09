from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.services.llm import generate_response

router = APIRouter()


class ChatRequest(BaseModel):
    message: str
    language: str = "English"


class ChatResponse(BaseModel):
    reply: str


@router.post("/chat")
async def chat(request: ChatRequest):
    try:
        reply = await generate_response(
            request.message,
            request.language
        )

        return {
            "reply": reply
        }

    except Exception as e:
        print("CHAT ERROR:", str(e), flush=True)

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )