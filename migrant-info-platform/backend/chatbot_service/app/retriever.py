from dotenv import load_dotenv
load_dotenv()

import os
os.environ["HUGGINGFACE_HUB_TOKEN"] = os.getenv("HUGGINGFACE_HUB_TOKEN")

# Python basics
from pprint import pprint
import json
import numpy as np
from transformers import pipeline, AutoTokenizer, AutoModelForCausalLM
from sentence_transformers import SentenceTransformer
import faiss
import pickle
import re

from huggingface_hub import login
login(os.environ["HUGGINGFACE_HUB_TOKEN"])


def clean_response(text):
    # Replace 2 or more \n with 1 \n
    text = re.sub(r'\n{2,}', '\n', text)
    return text.strip()


from .constants import (
    MAX_TOKENS, 
    OVERLAP,
    FAISS_INDEX_PATH,
    FAISS_METADATA_PATH,
    REPLACED_URL_MAP_PATH,
    EMBEDDING_MODEL,
    MAX_TOKENS_LLM,
    LLM_MODEL
)

tokenizer = AutoTokenizer.from_pretrained(LLM_MODEL, use_fast=True)
embedding_model = SentenceTransformer(EMBEDDING_MODEL, device="cuda")
llm_model = AutoModelForCausalLM.from_pretrained(
    LLM_MODEL,
    device_map="auto",
    torch_dtype="auto"
)
llm = pipeline("text-generation",
               model=llm_model, 
               tokenizer=tokenizer)

# Load everything
index = faiss.read_index(FAISS_INDEX_PATH)
with open(FAISS_METADATA_PATH, "rb") as f:
    metadata = pickle.load(f)

with open(REPLACED_URL_MAP_PATH, "r") as rf:
    replaced_url_map = json.load(rf)

def get_answer(query: str) -> str:
    try:
        print(f"Received query: {query}")
        query_embedding = embedding_model.encode([query])

        D, I = index.search(query_embedding, k=3)

        chunks = []
        sources = {}
        for idx, i in enumerate(I[0], start=1):
            src = metadata[i]['source']
            txt = metadata[i]['text']
            chunks.append(f"[{idx}] [Source: {src}]\n{txt}")
            sources[str(idx)] = src

        context = "\n\n".join(chunks)

        prompt = f"""System: You are an AI assistant for migrants in Lithuania. Follow these strict rules:
        1. If the user's message is exactly (case-insensitive) "hi", "hello", "hey", "good morning", "good afternoon", or "good evening"—you MUST immediately and ONLY respond with:
        How can I help you?
        2. Otherwise, use ONLY the numbered context below to answer questions.
        3. Whenever you use a fact from source [n], immediately write source “[n]” after that fact.
        4. After your answer, under “### Sources:”, list each source number you cited, one per line (e.g., “- [2]”).
        5. If the answer is not in the context, reply with exactly: “Sorry, I don’t have enough information to answer your question.”
        6. DO NOT invent facts. DO NOT start with words like "Sure", "Of course"—just answer directly.
        7. Always be polite and professional.
        8. VERY IMPORTANT: combine all related facts from the context into one detailed, complete explanation. DO NOT limit yourself to only the most obvious fact.
        9. Write a detailed, multi-paragraph answer whenever possible, even if the original question is short.
        10. Explain the meaning and relevance of numbers, percentages, and tax rates if they’re in the context.
        11. Convert any “[ url _ 32 ]” style link into “[URL_32]” (remove spaces/wrong chars).

        Context:
        {context}

        User Question:
        {query}

        Assistant:
        """

        response = llm(
            prompt.strip(),
            max_new_tokens=MAX_TOKENS_LLM,
            do_sample=True,
            temperature=0.5,
            return_full_text=False
        )

        if not response or "generated_text" not in response[0]:
            raise ValueError("No generated_text in model response.")

        response_text = response[0]["generated_text"]

        for num, link in sources.items():
            response_text = response_text.replace(f'[{num}]', f'<a href="{link}" target="_blank">{link}</a>')

        for placeholder, real_link in replaced_url_map.items():
            response_text = response_text.replace(
                placeholder,
                f'<a href="{real_link}" target="_blank" rel="noopener noreferrer">({real_link})</a>'
            )

        response_text = clean_response(response_text)
        print("Final response text:", repr(response_text[:300]))  # log first 300 chars
        return response_text

    except Exception as e:
        import traceback
        traceback.print_exc()
        return "An error occurred while processing your request. Please try again later."