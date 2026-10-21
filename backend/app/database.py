import os

from sqlalchemy import create_engine
from sqlalchemy.engine import URL
from sqlalchemy.orm import DeclarativeBase, sessionmaker

# DATABASE_URL reste disponible pour les tests et le développement local.
# Les variables séparées évitent les problèmes d'encodage des caractères spéciaux
# dans les mots de passe PostgreSQL.
DATABASE_URL = os.environ.get("DATABASE_URL")
if DATABASE_URL is None:
    password = os.environ.get("DB_PASSWORD")
    if not password:
        raise RuntimeError("La variable d'environnement DB_PASSWORD est obligatoire.")
    DATABASE_URL = URL.create(
        "postgresql+psycopg",
        username=os.environ.get("DB_USER", "fsd"),
        password=password,
        host=os.environ.get("DB_HOST", "db"),
        port=int(os.environ.get("DB_PORT", "5432")),
        database=os.environ.get("DB_NAME", "fsd_maintenance"),
    )

engine = create_engine(DATABASE_URL, pool_pre_ping=True)
SessionLocal = sessionmaker(bind=engine, autoflush=False, expire_on_commit=False)


class Base(DeclarativeBase):
    pass


def get_db():
    with SessionLocal() as session:
        yield session
