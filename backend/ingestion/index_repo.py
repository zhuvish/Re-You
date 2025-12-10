from database import SessionLocal
from repositories.model import Repository
from ingestion.clone_repo import clone_specific_repo
from embeddings.store_embeddings import create_vector_store

def index_repository(repo_id: int):
    """
    SINGLE SOURCE OF TRUTH FOR INDEXING
    Safe to call from anywhere.
    """

    db = SessionLocal()

    try:
        repo = db.query(Repository).filter(Repository.id == repo_id).first()
        if not repo:
            return

        local_path = f"data/repos/{repo.id}"

        clone_specific_repo(repo.full_name, local_path)
        create_vector_store(repo_id=repo.id, repo_path=local_path)

        repo.indexed = True
        db.commit()

    except Exception as e:
        print(f"❌ Indexing failed: {e}")
        db.rollback()

    finally:
        db.close()
