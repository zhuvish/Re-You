from sqlalchemy import Column, Integer, String, DateTime, Boolean
from sqlalchemy.sql import func
from database import Base


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    github_id = Column(Integer, unique=True, index=True)
    github_username = Column(String, index=True)
    github_avatar = Column(String)
    github_access_token = Column(String)
    needs_setup = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
