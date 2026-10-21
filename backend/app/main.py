from contextlib import asynccontextmanager
from uuid import UUID

from fastapi import Depends, FastAPI, HTTPException, Response, status
from sqlalchemy import select, text
from sqlalchemy.orm import Session

from .database import Base, engine, get_db
from .models import DemandeAchat, HistoriqueStatut
from .schemas import DemandeCreate, DemandeRead, HistoriqueRead, StatutChange


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialisation adaptée à un prototype local ; utiliser Alembic pour les futures migrations.
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(
    title="FSD Maintenance — API Achats",
    description="API locale pour les demandes d'achat de maintenance.",
    version="1.0.0",
    lifespan=lifespan,
)


@app.get("/api/health")
def health(db: Session = Depends(get_db)):
    db.execute(text("SELECT 1"))
    return {"status": "ok"}


@app.get("/api/demandes", response_model=list[DemandeRead])
def list_demandes(db: Session = Depends(get_db)):
    return db.scalars(
        select(DemandeAchat).order_by(DemandeAchat.created_at.desc(), DemandeAchat.id.desc())
    ).all()


@app.get("/api/demandes/{demande_id}", response_model=DemandeRead)
def get_demande(demande_id: UUID, db: Session = Depends(get_db)):
    return require_demande(db, demande_id)


def require_demande(db: Session, demande_id: UUID) -> DemandeAchat:
    demande = db.get(DemandeAchat, demande_id)
    if demande is None:
        raise HTTPException(status_code=404, detail="Demande introuvable")
    return demande


def record_change(db: Session, demande: DemandeAchat, previous_status: str | None):
    db.add(
        HistoriqueStatut(
            demande_id=demande.id,
            ancien_statut=previous_status,
            nouveau_statut=demande.statut,
        )
    )


@app.post("/api/demandes", response_model=DemandeRead, status_code=status.HTTP_201_CREATED)
def create_demande(payload: DemandeCreate, db: Session = Depends(get_db)):
    demande = DemandeAchat(**payload.model_dump())
    db.add(demande)
    db.flush()
    record_change(db, demande, previous_status=None)
    db.commit()
    db.refresh(demande)
    return demande


@app.put("/api/demandes/{demande_id}", response_model=DemandeRead)
def update_demande(demande_id: UUID, payload: DemandeCreate, db: Session = Depends(get_db)):
    demande = require_demande(db, demande_id)
    ancien_statut = demande.statut
    for field, value in payload.model_dump().items():
        setattr(demande, field, value)
    if demande.statut != ancien_statut:
        record_change(db, demande, previous_status=ancien_statut)
    db.commit()
    db.refresh(demande)
    return demande


@app.patch("/api/demandes/{demande_id}/statut", response_model=DemandeRead)
def change_statut(demande_id: UUID, payload: StatutChange, db: Session = Depends(get_db)):
    demande = require_demande(db, demande_id)
    if demande.statut != payload.statut:
        previous = demande.statut
        demande.statut = payload.statut
        record_change(db, demande, previous_status=previous)
        db.commit()
        db.refresh(demande)
    return demande


@app.get("/api/demandes/{demande_id}/historique", response_model=list[HistoriqueRead])
def get_historique(demande_id: UUID, db: Session = Depends(get_db)):
    require_demande(db, demande_id)
    return db.scalars(
        select(HistoriqueStatut)
        .where(HistoriqueStatut.demande_id == demande_id)
        .order_by(HistoriqueStatut.date_changement.asc(), HistoriqueStatut.id.asc())
    ).all()


@app.delete("/api/demandes/{demande_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_demande(demande_id: UUID, db: Session = Depends(get_db)):
    demande = require_demande(db, demande_id)
    db.delete(demande)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)
