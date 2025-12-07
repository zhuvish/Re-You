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
