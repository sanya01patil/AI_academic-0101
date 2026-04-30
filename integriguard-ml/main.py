import uvicorn
from fastapi import FastAPI
from app.api.analyse import router as analyse_router
import spacy
from sentence_transformers import SentenceTransformer
from transformers import GPT2LMHeadModel, GPT2Tokenizer
import torch

app = FastAPI(title="IntegriGuard ML Pipeline Service")

@app.on_event("startup")
async def startup_event():
    print("Pre-loading models...")
    # Load spaCy
    try:
        spacy.load("en_core_web_sm")
    except:
        try:
            print("Downloading en_core_web_sm...")
            spacy.cli.download("en_core_web_sm")
        except:
            print("Warning: Could not download spaCy model.")
    
    # Load SentenceTransformer
    try:
        SentenceTransformer('all-MiniLM-L6-v2')
    except:
        print("Warning: Could not load SentenceTransformer.")
    
    # Load GPT-2
    try:
        GPT2Tokenizer.from_pretrained("gpt2")
        GPT2LMHeadModel.from_pretrained("gpt2")
    except:
        print("Warning: Could not load GPT-2.")
    print("Startup complete.")

# Include routers
app.include_router(analyse_router, prefix="/api/v1")

@app.get("/")
async def root():
    return {"message": "IntegriGuard ML Service is running", "port": 8001}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8001, reload=True)
