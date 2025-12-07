# backend/auth/github.py
import os
import requests
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import RedirectResponse
from users.service import get_or_create_user
from auth.jwt import create_jwt
from database import get_db
from dotenv import load_dotenv

load_dotenv()

router = APIRouter(prefix="/auth/github", tags=["auth"])

CLIENT_ID = os.getenv("GITHUB_CLIENT_ID")
CLIENT_SECRET = os.getenv("GITHUB_CLIENT_SECRET")
REDIRECT_URI = os.getenv("GITHUB_REDIRECT_URI")


@router.get("/login")
def github_login():
    github_auth_url = (
        "https://github.com/login/oauth/authorize"
        f"?client_id={CLIENT_ID}"
        f"&redirect_uri={REDIRECT_URI}"
        f"&scope=repo read:user"
    )
    return RedirectResponse(github_auth_url)


@router.get("/callback")
def github_callback(code: str, db=Depends(get_db)):
    token_res = requests.post(
        "https://github.com/login/oauth/access_token",
        headers={"Accept": "application/json"},
        data={
            "client_id": CLIENT_ID,
            "client_secret": CLIENT_SECRET,
            "code": code,
        },
    )

    token_json = token_res.json()
    access_token = token_json.get("access_token")

    if not access_token:
        # Debug: see what GitHub sent back
        print("GITHUB TOKEN ERROR:", token_json)
        raise HTTPException(
            status_code=400,
            detail=f"GitHub token exchange failed: {token_json}",
        )

    # 2) Fetch GitHub user
    user_res = requests.get(
        "https://api.github.com/user",
        headers={"Authorization": f"Bearer {access_token}"},
    )

    github_user = user_res.json()
    if "id" not in github_user:
        print("GITHUB USER ERROR:", github_user)
        raise HTTPException(
            status_code=400,
            detail=f"GitHub user fetch failed: {github_user}",
        )

    # 3) Create or fetch DevMemory user in DB
    user = get_or_create_user(db, github_user, access_token)

    # 4) Create DevMemory JWT
    jwt_token = create_jwt(user.id)

    # DEBUG: Print token info
    print(f"User ID: {user.id}")
    print(f"JWT Token created: {jwt_token}")
    print(f"Token type: {type(jwt_token)}")

    # 5) Redirect to frontend with JWT
    return RedirectResponse(
        f"http://localhost:3000/auth/callback?token={jwt_token}"
    )
