from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime
from sqlalchemy.sql import func
from database import Base

class Repository(Base):
    __tablename__ = "repositories"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True)
    github_repo_id = Column(Integer, index=True)
    name = Column(String)
    full_name = Column(String)
    private = Column(Boolean)
    selected = Column(Boolean, default=True)
    indexed = Column(Boolean, default=False)
    html_url = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

