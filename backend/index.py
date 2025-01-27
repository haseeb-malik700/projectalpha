from fastapi import FastAPI
import os
import google.generativeai as genai
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

# Allow CORS for all origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

@app.get("/")
def read_root():
    return {"message": "Welcome to the Resume Review Assistant!"}

# Model for incoming request data
class PromptData(BaseModel):
    text: str

@app.post("/gemini")
async def gemini_endpoint(data: PromptData):
    # Define the CV structure as a raw string
    cv_template = """
[Your Name]
[Your Address (optional)]
[City, State, Zip (optional)]
[Your Phone Number]
[Your Email]
[LinkedIn URL] | [GitHub URL] (optional links)

SUMMARY
Highly motivated DevOps Engineer with 5 years of experience in cloud infrastructure at Siemens Healthineers. Skilled in CI/CD, automation, and Bash scripting, with a Master's degree in Data Science from Florida Atlantic University (FAU). Adept at streamlining processes, driving efficiency, and collaborating with cross-functional teams to deliver high-quality solutions.

SKILLS
• DevOps & Cloud Technologies: CI/CD (e.g., Jenkins, GitLab CI), IaC (Terraform, Ansible), Containerization (Docker, Kubernetes), Monitoring (Prometheus, Grafana), AWS/Azure/GCP
• Programming & Scripting: Bash, Python, [Additional languages if relevant]
• Data Science (if relevant): Data analysis, Machine Learning, Statistical modeling
• Additional: [Any other relevant skills or tools]

EXPERIENCE
[Siemens Healthineers] | DevOps/Cloud Engineer | [Start Date] – [End Date]
• Implemented a new CI/CD pipeline (Jenkins + Docker), reducing deployment time by 20%.
• Automated infrastructure provisioning via Terraform, cutting operational costs by 15%.
• Enhanced system reliability by setting up Prometheus and Grafana monitoring, improving uptime by 10%.
• Collaborated with cross-functional teams to optimize build processes and maintain high-quality standards.

[Previous Company Name] | [Position Title] | [Start Date] – [End Date]
• [Achievement 1] (Use the STAR method: Situation, Task, Action, Result)
• [Achievement 2]
• [Achievement 3]

EDUCATION
Florida Atlantic University (FAU) | Master of Science in Data Science | [Graduation Date]
• Relevant Coursework: [List key courses]

[Undergraduate Institution] | [Degree] in [Major] | [Graduation Date]
• Relevant Coursework: [List key courses if they support your current role]

PROJECTS (Optional)
[Project Name]
• Description: [Brief description and the problem it solves]
• Technologies: [List key technologies used]
• Achievements: [Any notable metrics or outcomes]

CERTIFICATIONS (Optional)
• [Certification Name], [Issuing Organization], [Year of Completion]

REFERENCES (Optional)
Available upon request.

ADDITIONAL INFORMATION (Optional)
• [Language proficiencies, volunteer experiences, published articles/papers, or any other relevant detail you want to highlight]
"""

    # Append the CV template to the user's input
    updated_prompt = f"{data.text.strip()}\n\n{cv_template.strip()}\n\nPlease format this CV in string format and refine the content for clarity and professionalism."

    # Configure the GENAI model
    genai.configure(api_key=GEMINI_API_KEY)
    model = genai.GenerativeModel("gemini-1.5-flash")

    # Generate response
    response = model.generate_content(updated_prompt)

    # Return the generated content
    return {"text": response.text.strip()}

    