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

from huggingface_hub import login
login(os.environ["HUGGINGFACE_HUB_TOKEN"])

# Run these in the environment:
# pip install transformers accelerate
# pip install --upgrade bitsandbytes

from .constants import (
    MAX_TOKENS, 
    OVERLAP,
    TOKENIZING_MODEL,
    FAISS_INDEX_PATH,
    FAISS_METADATA_PATH,
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

# def get_answer(query: str) -> str:
#     query_embedding = embedding_model.encode([query])

#     # Search top k results
#     D, I = index.search(query_embedding, k=3)
#     context = "\n\n".join(f"[Source: {metadata[i]['source']}]\n{metadata[i]['text']}" for i in I[0])
    
#     prompt = f"""
#     You are a helpful assistant. Use the following context to answer the question:
    
#     {context}
    
#     Question: {query}
#     Answer:"""

        
#     # response = llm(prompt, max_new_tokens=200)
#     response = llm(prompt.strip(), max_new_tokens=150, do_sample=True, temperature=0.7)

#     # print(response[0]["generated_text"])
#     # return f"You asked: {query}"
#     return response[0]["generated_text"]

def get_answer(query: str) -> str:
    query_embedding = embedding_model.encode([query])

    D, I = index.search(query_embedding, k=3)


    chunks = []
    for idx, i in enumerate(I[0], start=1):
        src = metadata[i]['source']
        txt = metadata[i]['text']
        chunks.append(f"[{idx}] [Source: {src}]\n{txt}")
    
    # context = "\n\n".join(f"[Source: {metadata[i]['source']}]\n{metadata[i]['text']}" for i in I[0])
    context = "\n\n".join(chunks)


#     prompt = f"""System: You are an AI assistant for migrants in Lithuania. Use the context below to answer questions. Follow these rules exactly:
# 📑 After each discrete fact or information block (whether in a bullet, numbered step, paragraph, etc.), append the exact source tag in square brackets (e.g. “[Source: https://micenter.lt/en/tax-refund]”).
# ✅ Answer only from the given context. You may quote or lightly rephrase for clarity.
# 📚 Provide in-depth, detailed answers when the context allows. Don’t truncate or summarize unless the user asks you to.
# 🗂️ For longer answers, organize using Markdown headings (`##`), numbered steps, or bullet lists for clarity.
# ❌ If the answer is not in context, respond with “Sorry, I don’t have enough information to answer your question. Feel free to ask something else!”
# 🚫 Do not invent facts or add information not in the context. If asked for disallowed or out-of-scope content, refuse politely per policy.
# 🔗 When including links, convert any `[ url _ 32 ]` markers to `[URL_32]`. Always format as `[URL_<number>]`.
# 🙅‍♂️ Do not say “the context” or “I saw in the docs.” Just give the answer.
# ⚠️ When giving legal or procedural advice, prepend: “I’m not a lawyer, but based on the context…”
# 🌐 Always respond in the language the user asked in.
# 🔍 If the question is ambiguous, ask for clarification rather than guessing.
# 🚫 Do **not** start your response with interjections or filler phrases—begin immediately with the substantive answer.
# 🙏 Be polite and professional.

# Context:
# {context}

# User Question:
# {query}

# Assistant:
# """

#     prompt = f"""System: You are an AI assistant for migrants in Lithuania. Use **only** the context below to answer questions. Follow these rules exactly:
# 📑 After each discrete fact or information block (whether a sentence, bullet, step or paragraph), append the exact source tag in square brackets (e.g. “[Source: https://micenter.lt/en/tax-refund]”).
# ✅ Answer only from the given context. You may quote or lightly rephrase for clarity.
# 📚 Provide in-depth, detailed answers when the context allows. Don’t truncate or summarize unless the user asks you to.
# 🗂️ For longer answers, organize with Markdown headings (`##`), numbered steps, or bullet lists.
# ❌ If the answer is not in context, respond with “Sorry, I don’t have enough information to answer your question. Feel free to ask something else!”
# 🚫 Do not invent facts or add information not in the context.
# 🔗 When including links, convert any `[ url _ 32 ]` markers to `[URL_32]`. Always format as `[URL_<number>]`.
# 🙅‍♂️ Do not say “the context” or “I saw in the docs.” Just give the answer.
# 🚫 Do **not** start your response with interjections or filler phrases (e.g. “Sure,” “Here’s,” “Okay,” “Alright”)—begin immediately with the substantive answer.
# 🔍 If the question is ambiguous, politely ask the user to clarify rather than guessing.
# 🌐 Always respond in the language the user asked in.
# 🙏 Be polite and professional.

# Context:
# {context}

# User Question:
# {query}

# Assistant:
# """

    prompt = f"""System: You are an AI assistant for migrants in Lithuania. Use **only** the numbered context below. Follow these rules exactly:
1. Whenever you use a fact from source [n], source “[n]” immediately after that fact.
2. After your answer, under “Sources:”, list each source number you cited, one per line (e.g. “- [2]”).
3. ✅ Answer only from the given context. You may quote or lightly rephrase.
4. ❌ If the answer is not in context, respond with “Sorry, I don’t have enough information to answer your question.”
5. 🚫 Do not invent facts or start with filler (“Sure,” “Here’s,” etc.)—jump straight into the answer.
6. 🙏 Be polite and professional.

Context:
{context}

User Question:
{query}

Assistant:
"""



    response = llm(prompt.strip(), 
                   max_new_tokens=1024,
                   do_sample=True, 
                   temperature=0.5,
                   # return_full_text=False
                  )   # <— only give us the generated part)
    
    print(response[0]["generated_text"])
    return response[0]["generated_text"]
