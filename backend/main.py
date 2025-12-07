from fastapi import FastAPI
from auth.github import router as github_router
from database import Base, engine
from routes.user import router as user_router
from routes.repos import router as repos_router
from routes.setup import router as setup_router
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

app.include_router(user_router)
app.include_router(github_router)
app.include_router(debug_router)
app.include_router(repos_router)
app.include_router(setup_router)

@app.get("/")
def root():
    return {"message": "DevMemory backend is running"}
