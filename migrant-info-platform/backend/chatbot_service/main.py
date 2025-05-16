from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from rag_engine.retriever import get_answer  # returns dummy code for now

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # or ["http://localhost:3000"] for React
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/query")
async def query(request: Request):
    '''
    For now chatbot is accessible only though terminal.
    Example prompt:
    curl -X POST http://localhost:5000/query -H "Content-Type: application/json" -d '{"question": "What is TRP?"}'
    
    curl -X POST http://localhost:5000/query \
     -H "Content-Type: application/json" \
     -d '{"question": "Hellloo"}'

    
    '''
    body = await request.json()
    question = body.get("question")
    answer = get_answer(question)
    return {"answer": answer}
