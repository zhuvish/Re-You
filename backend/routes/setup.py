from fastapi import APIRouter, Depends, BackgroundTasks
from pydantic import BaseModel
from sqlalchemy.orm import Session
from auth.jwt import get_current_user
from database import get_db
from repositories.model import Repository
from ingestion.index_repo import index_repository

router = APIRouter(prefix="/setup", tags=["setup"])


class SetupPayload(BaseModel):
    repositories: list[str]
    

@router.post("/complete")
def complete_setup(
    payload: SetupPayload,
    background_tasks: BackgroundTasks,
    user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    for full_name in payload.repositories:
        owner, repo_name = full_name.split("/")

        repo = Repository(
            user_id=user.id,
            name=repo_name,
            full_name=full_name,
            selected=True,
            indexed=False,
        )

        db.add(repo)
        db.commit()
        db.refresh(repo)

        background_tasks.add_task(index_repository, repo.id)

    user.needs_setup = False
    db.commit()
    return {"success": True}