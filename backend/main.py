from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from ai_service import analyze_plant

app = FastAPI(title="Plant Health Analysis API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class PlantAnalysisRequest(BaseModel):
    plant_name: str = Field(min_length=1, max_length=100)
    plant_type: str = Field(min_length=1, max_length=100)
    location: str = Field(default="", max_length=120)
    symptoms: str = Field(min_length=1, max_length=2000)


class PlantAnalysisResponse(BaseModel):
    analysis: str


@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.post("/analyze", response_model=PlantAnalysisResponse)
def analyze(request: PlantAnalysisRequest):
    analysis = analyze_plant(
        plant_name=request.plant_name,
        plant_type=request.plant_type,
        location=request.location,
        symptoms=request.symptoms,
    )
    return {"analysis": analysis}
