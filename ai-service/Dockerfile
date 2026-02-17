FROM python:3.11-slim

WORKDIR /app

# Installer les dépendances système requises
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copier requirements et installer les dépendances Python
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copier le code de l'application
COPY . .

EXPOSE 8000

# Variables d'environnement par défaut
ENV BACKEND_URL=http://backend:5000
ENV FRONTEND_ORIGIN=http://localhost:3001

# Lancer avec uvicorn
CMD ["python", "-m", "uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
