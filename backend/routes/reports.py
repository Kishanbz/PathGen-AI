from typing import List
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from core.database import get_db
from core.security import get_current_user
from core.config import settings
from models.db_models import User, Report, Progress, Topic
from schemas.pydantic_schemas import ReportOut

router = APIRouter(prefix="/api/reports", tags=["Reports"])


def _generate_pdf_report(student: User, progress_list, period: str) -> bytes:
    """Generate a simple PDF performance report using ReportLab."""
    try:
        from reportlab.lib.pagesizes import A4
        from reportlab.lib import colors
        from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
        from reportlab.lib.styles import getSampleStyleSheet
        import io

        buffer = io.BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=A4)
        styles = getSampleStyleSheet()
        elements = []

        # Title
        elements.append(Paragraph(f"PathGen AI — Performance Report", styles["Title"]))
        elements.append(Paragraph(f"Student: {student.name} | Period: {period}", styles["Normal"]))
        elements.append(Spacer(1, 20))

        # Progress Table
        data = [["Topic ID", "Score (%)", "Time Spent (min)", "Completed At"]]
        for p in progress_list:
            data.append([
                str(p.topic_id),
                f"{p.score:.1f}",
                str(p.time_spent),
                p.completed_at.strftime("%Y-%m-%d") if p.completed_at else "—",
            ])

        table = Table(data, colWidths=[80, 100, 140, 150])
        table.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#4F46E5")),
            ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
            ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
            ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.whitesmoke, colors.white]),
            ("GRID", (0, 0), (-1, -1), 0.5, colors.grey),
            ("ALIGN", (0, 0), (-1, -1), "CENTER"),
        ]))
        elements.append(table)

        avg = sum(p.score for p in progress_list) / len(progress_list) if progress_list else 0
        elements.append(Spacer(1, 20))
        elements.append(Paragraph(f"Average Score: {avg:.1f}%", styles["Normal"]))
        elements.append(Paragraph(f"Report generated: {datetime.utcnow().strftime('%Y-%m-%d %H:%M')} UTC", styles["Normal"]))

        doc.build(elements)
        return buffer.getvalue()
    except ImportError:
        return b""  # ReportLab not installed — skip PDF


@router.get("/{student_id}", response_model=List[ReportOut])
def list_reports(
    student_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """List all reports for a student."""
    if current_user.role == "student" and current_user.id != student_id:
        raise HTTPException(status_code=403, detail="Access denied")

    return db.query(Report).filter(Report.student_id == student_id).order_by(Report.generated_at.desc()).all()


@router.post("/generate/{student_id}", response_model=ReportOut, status_code=201)
def generate_report(
    student_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Generate a PDF performance report for a student and save it."""
    if current_user.role == "student" and current_user.id != student_id:
        raise HTTPException(status_code=403, detail="Access denied")

    student = db.query(User).filter(User.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    progress_list = db.query(Progress).filter(Progress.student_id == student_id).all()
    period = f"Report - {datetime.utcnow().strftime('%B %Y')}"

    # Generate PDF
    pdf_bytes = _generate_pdf_report(student, progress_list, period)

    # Save to MinIO if available
    minio_key = f"reports/student_{student_id}_{datetime.utcnow().strftime('%Y%m%d%H%M%S')}.pdf"
    try:
        from minio import Minio
        import io
        client = Minio(
            settings.MINIO_ENDPOINT,
            access_key=settings.MINIO_ACCESS_KEY,
            secret_key=settings.MINIO_SECRET_KEY,
            secure=settings.MINIO_SECURE,
        )
        bucket = settings.MINIO_BUCKET_REPORTS
        if not client.bucket_exists(bucket):
            client.make_bucket(bucket)
        if pdf_bytes:
            client.put_object(bucket, minio_key, io.BytesIO(pdf_bytes), len(pdf_bytes))
    except Exception:
        minio_key = f"local/{minio_key}"  # dev fallback

    report = Report(
        student_id=student_id,
        period=period,
        minio_key=minio_key,
    )
    db.add(report)
    db.commit()
    db.refresh(report)
    return report
