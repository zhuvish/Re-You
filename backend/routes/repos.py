import requests
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from auth.jwt import get_current_user
from database import get_db
from repositories.service import toggle_repository_selection
from repositories.model import Repository

router = APIRouter(prefix="/repos", tags=["repos"])

class RepoToggleRequest(BaseModel):
    repository_id: int
    selected: bool

@router.get("/github")
def list_github_repos(user = Depends(get_current_user)):
    res = requests.get(
        "https://api.github.com/user/repos",
        headers={
            "Authorization": f"Bearer {user.github_access_token}"
        },
        params={"per_page": 100}
    )
    return res.json()



@router.post("/select")
def select_repos(
    repo_ids: list[int],
    user = Depends(get_current_user),
    db = Depends(get_db)
):
    # Remove old selections
    db.query(Repository).filter(
        Repository.user_id == user.id
    ).delete()

    # Save new selections
    for repo in repo_ids:
        db.add(
            Repository(
                user_id=user.id,
                github_repo_id=repo["id"],
                name=repo["name"],
                full_name=repo["full_name"],
                private=repo["private"],
                selected=True
            )
        )

    db.commit()
    return {"status": "ok"}

@router.post("/toggle")
def toggle_repo(
    payload: RepoToggleRequest,
    user = Depends(get_current_user),
    db = Depends(get_db),
):
    repo = toggle_repository_selection(
        db=db,
        user_id=user.id,
        repository_id=payload.repository_id,
        selected=payload.selected,
    )

    if not repo:
        raise HTTPException(status_code=404, detail="Repository not found")

    # (later) trigger indexing here if selected=True

    return {
        "id": repo.id,
        "selected": repo.selected,
        "indexed": repo.indexed,
        "full_name": repo.full_name,
    }
