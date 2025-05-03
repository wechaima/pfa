from fastapi import FastAPI
from pydantic import BaseModel
from chatbot import get_answer

app = FastAPI()

class ChatRequest(BaseModel):
    question: str

@app.post("/chat")
async def chat_endpoint(data: ChatRequest):
    return get_answer(data.question)
