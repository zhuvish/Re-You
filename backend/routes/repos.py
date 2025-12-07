from fastapi import APIRouter, Depends
from auth.jwt import get_current_user
import requests
from repositories.service import save_selected_repos
from database import get_db
from fastapi import Depends
from repositories.model import Repository

router = APIRouter(prefix="/repos", tags=["repos"])

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

