from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import requests
import os
from dotenv import load_dotenv

load_dotenv()

app=FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],

)
GROQ_API_KEY=os.getenv("GROQ_API_KEY")
GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"

headers={
    "Authorization": f"Bearer {GROQ_API_KEY}",
    "Content-Type": "application/json",
}

class Query(BaseModel):
    prompt: str

@app.post("/generate")
async def generate_text(query: Query):
    payload={
        "model":"llama3-8b-8192",
        "messages":[{"role":"user","content":query.prompt}],
        "temperature":0.7,
    }
    try:
        response=requests.post(GROQ_API_URL,headers=headers,json=payload)
        data= response.json()
        return {"response":data["choices"][0]["message"]["content"]}

    except Exception as e:
        return {"error":str(e)}
 
  



