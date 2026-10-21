from datetime import date, datetime
from typing import Literal
from uuid import UUID
from urllib.parse import urlparse

from pydantic import BaseModel, ConfigDict, Field, field_validator
from pydantic.alias_generators import to_camel

Statut = Literal["À demander", "Envoyée", "En attente de devis", "Commandée", "Reçue", "Annulée"]
Priorite = Literal["Normale", "Haute", "Urgente"]


class CamelModel(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, from_attributes=True)


class DemandeFields(CamelModel):
    designation: str = Field(min_length=1, max_length=250)
    reference: str = Field(default="", max_length=150)
    fournisseur: str = Field(default="", max_length=150)
    acheteur: str = Field(default="", max_length=150)
    quantite: int = Field(default=1, ge=1, le=1_000_000)
    priorite: Priorite = "Normale"
    statut: Statut = "À demander"
    date_demande: date = Field(default_factory=date.today)
    date_besoin: date | None = None
    date_livraison: date | None = None
    numero_commande: str = Field(default="", max_length=150)
    commentaire: str = Field(default="", max_length=10000)
    lien: str = Field(default="", max_length=2000)

    @field_validator("designation")
    @classmethod
    def clean_designation(cls, value: str) -> str:
        if not value.strip():
            raise ValueError("La désignation ne peut pas être vide")
        return value.strip()

    @field_validator("lien")
    @classmethod
    def validate_link(cls, value: str) -> str:
        value = value.strip()
        if not value:
            return ""
        p = urlparse(value)
        if p.scheme not in {"http", "https"} or not p.netloc:
            raise ValueError("Le lien doit être une adresse HTTP(S) valide")
        return value


class DemandeCreate(DemandeFields):
    pass


class DemandeRead(DemandeFields):
    id: UUID
    created_at: datetime
    updated_at: datetime


class StatutChange(CamelModel):
    statut: Statut


class HistoriqueRead(CamelModel):
    id: UUID
    demande_id: UUID
    ancien_statut: str | None
    nouveau_statut: str
    date_changement: datetime
