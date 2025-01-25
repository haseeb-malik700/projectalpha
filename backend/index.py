from fastapi import FastAPI
import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Welcome to the Resume Review Assistant!"}


@app.get("/gemini")

def gemini(prompt):
    updated_prompt = prompt + "This is my resume, help me improve it by identifying any mistakes and look for improvements"
    genai.configure(api_key=GEMINI_API_KEY)
    model = genai.GenerativeModel("gemini-1.5-flash")
    response = model.generate_content(updated_prompt)
    return response.text