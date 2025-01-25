import os
import requests
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

import google.generativeai as genai

genai.configure(api_key="AIzaSyBNW7a4pWwR6TbpKvcf5eOkh5v-ga2-AYg")
model = genai.GenerativeModel("gemini-1.5-flash")
response = model.generate_content("Explain how AI works")
print(response.text)
