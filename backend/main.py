from fastapi import FastAPI
from auth.github import router as github_router
from database import Base, engine
from users.model import User
from routes.me import router as me_router
from fastapi.middleware.cors import CORSMiddleware
from debug import router as debug_router

Base.metadata.create_all(bind=engine)
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(me_router)
app.include_router(github_router)
app.include_router(debug_router)

@app.get("/")
def root():
    return {"message": "DevMemory backend is running"}
