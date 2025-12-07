from users.model import User


def get_or_create_user(db, github_user, access_token):
    user = (
        db.query(User)
        .filter(User.github_id == github_user["id"])
        .first()
    )

    if user:
        return user

    user = User(
        github_id=github_user["id"],
        github_username=github_user["login"],
        github_avatar=github_user["avatar_url"],
        github_access_token=access_token,
    )

    db.add(user)
    db.commit()
    db.refresh(user)
    return user
