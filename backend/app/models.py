import uuid
from datetime import date, datetime, timezone

from sqlalchemy import Date, DateTime, ForeignKey, Integer, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.types import Uuid

from .database import Base


class DemandeAchat(Base):
    __tablename__ = "demandes_achat"

    id: Mapped[uuid.UUID] = mapped_column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    designation: Mapped[str] = mapped_column(String(250), nullable=False)
    reference: Mapped[str] = mapped_column(String(150), default="", nullable=False)
    fournisseur: Mapped[str] = mapped_column(String(150), default="", nullable=False)
    acheteur: Mapped[str] = mapped_column(String(150), default="", nullable=False)
    quantite: Mapped[int] = mapped_column(Integer, default=1, nullable=False)
    priorite: Mapped[str] = mapped_column(String(20), default="Normale", nullable=False)
    statut: Mapped[str] = mapped_column(String(30), default="À demander", nullable=False)
    date_demande: Mapped[date] = mapped_column(Date, default=date.today, nullable=False)
    date_besoin: Mapped[date | None] = mapped_column(Date, nullable=True)
    date_livraison: Mapped[date | None] = mapped_column(Date, nullable=True)
    numero_commande: Mapped[str] = mapped_column(String(150), default="", nullable=False)
    commentaire: Mapped[str] = mapped_column(Text, default="", nullable=False)
    lien: Mapped[str] = mapped_column(Text, default="", nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    historique: Mapped[list["HistoriqueStatut"]] = relationship(
        back_populates="demande", cascade="all, delete-orphan"
    )


class HistoriqueStatut(Base):
    __tablename__ = "historique_statuts"

    id: Mapped[uuid.UUID] = mapped_column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    demande_id: Mapped[uuid.UUID] = mapped_column(
        Uuid(as_uuid=True), ForeignKey("demandes_achat.id", ondelete="CASCADE"), nullable=False
    )
    ancien_statut: Mapped[str | None] = mapped_column(String(30), nullable=True)
    nouveau_statut: Mapped[str] = mapped_column(String(30), nullable=False)
    date_changement: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), server_default=func.now(), nullable=False
    )

    demande: Mapped[DemandeAchat] = relationship(back_populates="historique")
