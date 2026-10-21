"""Tests HTTP de l'API avec une base SQLite temporaire (aucun Docker requis)."""
import os
import tempfile
from pathlib import Path

# Definir avant l'import de app.main (moteur cree au moment de l'import).
_tmp = tempfile.TemporaryDirectory()
os.environ["DATABASE_URL"] = f"sqlite+pysqlite:///{Path(_tmp.name) / 'test.sqlite'}"

from fastapi.testclient import TestClient  # noqa: E402
from app.main import app  # noqa: E402


def test_crud_et_historique():
    with TestClient(app) as client:
        assert client.get('/api/health').status_code == 200
        response = client.post('/api/demandes', json={
            'designation': 'Roulement SKF',
            'quantite': 2,
            'statut': 'À demander',
            'dateDemande': '2026-10-22',
            'dateBesoin': None,
            'dateLivraison': None,
        })
        assert response.status_code == 201
        record = response.json()
        demande_id = record['id']
        assert record['dateDemande'] == '2026-10-22'

        assert len(client.get('/api/demandes').json()) == 1
        response = client.patch(f'/api/demandes/{demande_id}/statut', json={'statut': 'Commandée'})
        assert response.status_code == 200
        assert response.json()['statut'] == 'Commandée'

        response = client.get(f'/api/demandes/{demande_id}/historique')
        assert [e['nouveauStatut'] for e in response.json()] == ['À demander', 'Commandée']

        payload = {key: value for key, value in record.items() if key not in ('id', 'createdAt', 'updatedAt')}
        payload['designation'] = 'Roulement 6205'
        response = client.put(f'/api/demandes/{demande_id}', json=payload)
        assert response.status_code == 200
        assert response.json()['designation'] == 'Roulement 6205'

        assert client.delete(f'/api/demandes/{demande_id}').status_code == 204
        assert client.get('/api/demandes').json() == []


def test_validation():
    with TestClient(app) as client:
        assert client.post('/api/demandes', json={'designation': '', 'quantite': 0}).status_code == 422
        assert client.post('/api/demandes', json={'designation': 'x', 'lien': 'file:///etc/passwd'}).status_code == 422
        assert client.patch('/api/demandes/00000000-0000-0000-0000-000000000001/statut', json={'statut': 'N/A'}).status_code == 422
