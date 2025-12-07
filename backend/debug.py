from fastapi import APIRouter
import jwt
import os

router = APIRouter()

@router.get("/debug/token")
def debug_token(token: str):
    secret = os.getenv("JWT_SECRET")
    if not secret:
        return {"valid": False, "error": "JWT_SECRET not set"}
    
    try:
        decoded = jwt.decode(token, secret, algorithms=["HS256"])
        decoded["sub"] = int(decoded["sub"])
        return {"valid": True, "decoded": decoded}
    except Exception as e:
        return {"valid": False, "error": str(e)}