from repositories.model import Repository

def save_selected_repos(db, user_id: int, repos: list[dict]):

    db.query(Repository).filter(Repository.user_id == user_id).delete()

    objects = []
    for repo in repos:
        objects.append(
            Repository(
                user_id=user_id,
                github_repo_id=repo["id"],
                name=repo["name"],
                full_name=repo["full_name"],
                private=repo["private"],
                html_url=repo["html_url"],
            )
        )

    db.add_all(objects)
    db.commit()

def toggle_repository_selection(
    db,
    user_id: int,
    repository_id: int,
    selected: bool,
):
    repo = (
        db.query(Repository)
        .filter(
            Repository.id == repository_id,
            Repository.user_id == user_id,
        )
        .first()
    )

    if not repo:
        return None

    repo.selected = selected
    db.commit()
    db.refresh(repo)
    return repo

