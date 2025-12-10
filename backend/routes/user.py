# routes/me.py
from fastapi import APIRouter, Depends
from auth.jwt import get_current_user
from database import get_db
from fastapi import Depends
from repositories.model import Repository

router = APIRouter()

# backend/routes/me.py
@router.get("/me")
def get_user(user=Depends(get_current_user), db=Depends(get_db)):
    # Get user's repos
    repos = db.query(Repository).filter(
        Repository.user_id == user.id,
        Repository.selected == True
    ).all()
    
    return {
        "id": user.id,
        "username": user.github_username,
        "avatar": user.github_avatar,
        "needs_setup": user.needs_setup,
        "repositories": [
            {
                "id": repo.id,
                "github_repo_id": repo.github_repo_id,
                "name": repo.name,
                "full_name": repo.full_name,
                "indexed": repo.indexed,
                "selected": repo.selected,
                "last_indexed": None  # Add this field to your model if needed
            }
            for repo in repos
        ]
    }