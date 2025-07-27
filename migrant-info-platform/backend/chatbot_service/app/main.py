from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from retriever import get_answer 

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/query")
async def query(request: Request):
    '''
    For now chatbot is accessible only though terminal.
    Example prompt:
    curl -X POST http://localhost:5000/query -H "Content-Type: application/json" -d '{"question": "What is TRP?"}'
    '''
    body = await request.json()
    question = body.get("question")
    answer = get_answer(question)
    return {"answer": answer}
