from fastapi import APIRouter, Depends
from pydantic import BaseModel
from auth.jwt import get_current_user
from database import get_db
from sqlalchemy.orm import Session
from repositories.model import Repository

router = APIRouter(prefix="/setup", tags=["setup"])

class SetupPayload(BaseModel):
    repositories: list[str]   # repo full names

@router.post("/complete")
def complete_setup(
    payload: SetupPayload,
    user = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    # For now, just create placeholder repository entries
    # In a real implementation, you'd fetch repo details from GitHub API
    for repo_full_name in payload.repositories:
        # Split full_name into owner/repo
        parts = repo_full_name.split("/")
        if len(parts) == 2:
            owner, repo_name = parts
            # Create a placeholder repository entry
            db_repo = Repository(
                user_id=user.id,
                github_repo_id=0,  # Placeholder - would need real ID
                name=repo_name,
                full_name=repo_full_name,
                private=False,  # Would need real data
                selected=True,
                html_url=f"https://github.com/{repo_full_name}"
            )
            db.add(db_repo)
    
    # Mark setup as complete
    user.needs_setup = False
    db.commit()

    return {"success": True}
