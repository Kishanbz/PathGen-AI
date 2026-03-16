from typing import List
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session

from core.database import get_db
from core.security import get_current_user, require_role
from core.config import settings
from models.db_models import User, ContentFile
from schemas.pydantic_schemas import ContentFileOut

router = APIRouter(prefix="/api/content", tags=["Content"])


def _get_minio_client():
    """Return a MinIO client. Returns None if MinIO is not configured."""
    try:
        from minio import Minio
        return Minio(
            settings.MINIO_ENDPOINT,
            access_key=settings.MINIO_ACCESS_KEY,
            secret_key=settings.MINIO_SECRET_KEY,
            secure=settings.MINIO_SECURE,
        )
    except Exception:
        return None


@router.post("/upload", response_model=ContentFileOut, status_code=201)
def upload_content(
    topic_id: int = Form(...),
    file_type: str = Form(...),       # pdf / video / quiz
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("teacher", "admin")),
):
    """Upload a content file to MinIO and record it in the database (Teacher/Admin only)."""
    minio_key = f"topic_{topic_id}/{file.filename}"
    client = _get_minio_client()

    if client:
        bucket = settings.MINIO_BUCKET_CONTENT
        # Ensure bucket exists
        if not client.bucket_exists(bucket):
            client.make_bucket(bucket)
        client.put_object(
            bucket, minio_key, file.file,
            length=-1, part_size=10 * 1024 * 1024,
            content_type=file.content_type,
        )
    else:
        # MinIO not available — store key only (dev mode)
        minio_key = f"local/{minio_key}"

    record = ContentFile(
        topic_id=topic_id,
        file_type=file_type,
        minio_key=minio_key,
        file_metadata={"filename": file.filename, "content_type": file.content_type},
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    return record


@router.get("/{topic_id}", response_model=List[ContentFileOut])
def get_content(
    topic_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get all content files for a topic."""
    return db.query(ContentFile).filter(ContentFile.topic_id == topic_id).all()


@router.delete("/{file_id}", status_code=200)
def delete_content(
    file_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("teacher", "admin")),
):
    """Delete a content file from DB (and MinIO if available)."""
    record = db.query(ContentFile).filter(ContentFile.id == file_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Content file not found")

    client = _get_minio_client()
    if client:
        try:
            client.remove_object(settings.MINIO_BUCKET_CONTENT, record.minio_key)
        except Exception:
            pass  # ignore if already deleted from MinIO

    db.delete(record)
    db.commit()
    return {"message": f"Content file {file_id} deleted"}
