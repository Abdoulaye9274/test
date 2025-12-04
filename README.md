# 🏢 ClientFlow - Système CRM Intelligent  
## Projet RNCP Concepteur Développeur d'Applications

[![Node.js](https://img.shields.io/badge/Node.js-18.x-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19.x-blue.svg)](https://reactjs.org/)
[![Python](https://img.shields.io/badge/Python-3.9%2B-yellow.svg)](https://python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-Latest-teal.svg)](https://fastapi.tiangolo.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue.svg)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-Compose-blue.svg)](https://www.docker.com/)

---

## 📋 Description du Projet

**ClientFlow** est une application CRM (Customer Relationship Management) moderne développée dans le cadre du titre RNCP Niveau 6 - Concepteur Développeur d'Applications. Elle combine une architecture micro-services classique avec une **intelligence artificielle locale** pour offrir une expérience utilisateur innovante.

### 🎯 Objectifs

- Gérer efficacement les clients et leurs informations
- Suivre les contrats et leur cycle de vie
- Assigner des services personnalisés aux clients
- Analyser les données avec un tableau de bord interactif
- **🤖 Intégrer une IA conversationnelle** pour interroger les données en langage naturel
- **📊 Prédire** le renouvellement des contrats avec du Machine Learning
- **✉️ Notifier automatiquement** par email lors de la création de clients/contrats

---

## 🏗️ Architecture du Projet

### Architecture Globale (Micro-services)

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (React 19)                       │
│              Material-UI + React Router Dom                  │
│          http://localhost:3001 (Port 80 en container)       │
└───────────────────────────┬─────────────────────────────────┘
                            │ HTTP/REST
┌───────────────────────────▼─────────────────────────────────┐
│                  BACKEND (Node.js + Express)                 │
│    JWT Auth + CORS + Routes API + Email Notifications       │
│                  http://localhost:5000                       │
└───────────────┬─────────────────────┬───────────────────────┘
                │                     │ HTTP
                │ PostgreSQL          │
                │ (Port 5432)         │
┌───────────────▼───────────┐  ┌──────▼──────────────────────┐
│    DATABASE (Postgres 16)  │  │   AI SERVICE (FastAPI)      │
│  - clients                 │  │  🧠 Ollama LLM (Llama 3.2)  │
│  - contracts               │  │  📊 Scikit-learn (ML)       │
│  - services                │  │  🤖 Chatbot contextuel      │
│  - users                   │  │  📈 Prédiction renouvellement│
│  - client_dossiers         │  │  http://localhost:8000      │
└────────────────────────────┘  └─────────────────────────────┘
```

---

## 🤖 Service IA - Innovation Majeure du Projet

### Pourquoi un Micro-service Séparé ?

Le service IA est **complètement découplé** du backend principal pour plusieurs raisons :

1. **Performance** : Python est le standard pour l'IA, mais Node.js est plus performant pour les I/O (API Web)
2. **Scalabilité** : Peut être redémarré ou mis à l'échelle indépendamment du reste
3. **Confidentialité** : LLM local (Ollama), **aucune donnée client n'est envoyée à OpenAI/Google**
4. **Spécialisation** : Chaque service utilise le meilleur outil pour sa tâche

### Technologies IA Utilisées

| Technologie | Rôle | Pourquoi ? |
|-------------|------|-----------|
| **FastAPI** | Framework API async | Ultra-rapide, gestion native de l'asynchrone |
| **Ollama (Llama 3.2)** | LLM open-source | Tourne en local, zéro envoi de données externes |
| **Scikit-learn** | ML (Random Forest) | Algorithme éprouvé pour la classification |
| **Pandas/Numpy** | Analyse de données | Manipulation efficace des features ML |
| **Requests** | Communication backend | Récupération des données CRM en temps réel |

### 🤖 Fonctionnalité 1 : Chatbot Conversationnel (RAG-lite)

Le chatbot ne se contente pas de répondre génériquement. Il est **contextualisé avec les données du CRM**.

**Workflow :**
1. L'utilisateur pose une question : _"Quel est le CA ce mois-ci ?"_
2. Le backend Node.js envoie la question + un résumé des données (JSON) au service Python
3. Le service Python construit un **Prompt Système dynamique** :
   ```
   "Tu es un assistant CRM. Voici les données actuelles : 
   {CA: 12k€, Clients: 45, Contrats actifs: 23...}. 
   Réponds à la question de l'utilisateur."
   ```
4. Ollama génère la réponse en langage naturel
5. La réponse est renvoyée au frontend

**Intérêt :** Permet d'interroger les données structurées en langage naturel (approche RAG simplifiée).

### 📊 Fonctionnalité 2 : Prédiction ML de Renouvellement

Un module prédictif estime la **probabilité qu'un client renouvelle son contrat**.

**Algorithme** : `Random Forest Classifier` (Forêt Aléatoire)  
**Features (données d'entrée)** :
- Durée du contrat
- Montant du contrat
- Secteur d'activité du client
- Historique des paiements

**Sortie** :
- Score de probabilité : `0-100%`
- Étiquette : `"Risque élevé"` / `"Fidèle"` / `"Incertain"`

**Entraînement** : Le modèle peut être entraîné sur les données réelles du CRM via l'endpoint `/train`.

---

## ✉️ Système de Notifications Email Automatiques

### Fonctionnement

Le backend utilise **Nodemailer** pour envoyer des emails automatiquement lors de certaines actions.

### Événements déclencheurs

1. **Création d'un client** → Email envoyé à l'administrateur  
   - Contenu : Nom, email, téléphone du nouveau client
   - Template HTML personnalisé

2. **Création d'un contrat** → Email envoyé à l'administrateur  
   - Contenu : Titre du contrat, montant, client associé, date de début
   - Template HTML personnalisé

### Configuration Email

Le système supporte **deux modes** :

#### Mode Production (Gmail SMTP)
```env
# backend/.env
GMAIL_USER=votre.email@gmail.com
GMAIL_PASS=votre_mot_de_passe_application
```

**Important** : Utilisez un "Mot de passe d'application" Gmail, pas votre mot de passe principal.

#### Mode Développement (Ethereal Email)
Si aucun identifiant Gmail n'est fourni, le système bascule automatiquement sur **Ethereal** :
- SMTP fake pour le développement
- Génère une URL de preview pour visualiser l'email
- Aucun email réel n'est envoyé

### Architecture du Service Email

```javascript
// backend/utils/emailService.js
export const sendNewClientEmail = async (client) => {
  const subject = `🎉 Nouveau Client : ${client.name}`;
  const html = `
    <h1>Nouveau Client Ajouté</h1>
    <p>Un nouveau client a été ajouté au CRM.</p>
    <ul>
      <li><strong>Nom :</strong> ${client.name}</li>
      <li><strong>Email :</strong> ${client.email}</li>
      <li><strong>Téléphone :</strong> ${client.phone}</li>
    </ul>
  `;
  return sendEmail('admin@clientflow.com', subject, html);
};
```

**Appel dans la route clients** :
```javascript
// backend/routes/clients.js
router.post("/", authenticateToken, async (req, res) => {
  const result = await pool.query(/* INSERT client */);
  const newClient = result.rows[0];
  
  // 📧 Envoi asynchrone (n'attend pas la réponse pour garder l'API rapide)
  sendNewClientEmail(newClient);
  
  res.json(newClient);
});
```

---

## 🛠️ Stack Technique Complète

### Frontend
| Technologie | Version | Usage |
|-------------|---------|-------|
| React | 19.1.1 | Framework principal |
| Material-UI | 7.3.2 | Design system |
| React Router Dom | 7.8.2 | Navigation SPA |
| Axios | 1.12.0 | Client HTTP |
| Recharts | 3.2.1 | Graphiques interactifs |
| Framer Motion | 12.23.12 | Animations |
| jsPDF | 3.0.4 | Export PDF |

### Backend  
| Technologie | Version | Usage |
|-------------|---------|-------|
| Node.js | 18.x | Runtime JavaScript |
| Express.js | 4.19.2 | Framework web |
| PostgreSQL | 16 | Base de données |
| bcryptjs | 3.0.2 | Hashage mots de passe |
| jsonwebtoken | 9.0.2 | Authentification JWT |
| **Nodemailer** | **7.0.11** | **Envoi emails automatiques** |
| CORS | 2.8.5 | Cross-Origin Resource Sharing |

### AI Service (Python)
| Technologie | Version | Usage |
|-------------|---------|-------|
| **FastAPI** | Latest | Framework API async |
| **Ollama** | - | LLM local (Llama 3.2) |
| **Scikit-learn** | - | ML (Random Forest) |
| Pandas/Numpy | - | Analyse de données |
| Requests | - | Communication backend |

### DevOps
| Technologie | Version | Usage |
|-------------|---------|-------|
| Docker | Latest | Containerisation |
| Docker Compose | 3.8 | Orchestration |
| Jest | 30.1.3 | Tests unitaires |
| Supertest | 7.1.4 | Tests API |

---

## 📂 Structure du Projet

```
crm/
├── frontend/                         # Application React
│   ├── public/
│   │   ├── index.html
│   │   └── logo192.png
│   ├── src/
│   │   ├── assets/                   # Images, logos
│   │   │   └── logo.png
│   │   ├── components/               # Composants réutilisables
│   │   │   ├── DashboardLayout.jsx   # Layout principal
│   │   │   ├── ClientForm.jsx        # Formulaire client
│   │   │   ├── ServiceForm.jsx       # Formulaire service
│   │   │   ├── ServiceAssignDialog.jsx
│   │   │   └── AIAssistant.js        # 🤖 Chatbot IA
│   │   ├── pages/                    # Pages de l'application
│   │   │   ├── Login.jsx             # Page connexion
│   │   │   ├── Dashboard.jsx         # Tableau de bord
│   │   │   ├── Clients.jsx           # Gestion clients
│   │   │   ├── ClientDetail.jsx      # Détail client
│   │   │   ├── Contracts.jsx         # Gestion contrats
│   │   │   ├── Services.jsx          # Gestion services
│   │   │   ├── Dossiers.jsx          # Gestion dossiers
│   │   │   └── Settings.jsx          # Paramètres
│   │   ├── context/
│   │   │   └── AuthContext.jsx       # Gestion auth globale
│   │   ├── api.js                    # Configuration Axios
│   │   ├── App.js                    # Point d'entrée
│   │   └── index.js                  # Rendu React
│   ├── Dockerfile                    # Build multi-stage
│   └── package.json
│
├── backend/                          # API Node.js Express
│   ├── routes/
│   │   ├── auth.js                   # Login/Register
│   │   ├── clients.js                # CRUD clients + 📧 emails
│   │   ├── contracts.js              # CRUD contrats + 📧 emails
│   │   ├── services.js               # CRUD services
│   │   ├── dossiers.js               # CRUD dossiers clients
│   │   ├── activities.js             # Activités récentes
│   │   └── users.js                  # Profil utilisateur
│   ├── middleware/
│   │   ├── auth.js                   # Vérification JWT
│   │   └── roles.js                  # RBAC (admin/user)
│   ├── utils/
│   │   └── emailService.js           # 📧 Nodemailer (Gmail/Ethereal)
│   ├── tests/
│   │   └── auth.test.js              # Tests API
│   ├── db.js                         # Pool PostgreSQL
│   ├── server.js                     # Serveur Express
│   ├── seedAdmin.js                  # Script seed admin
│   ├── seedJury.js                   # Script seed jury
│   ├── Dockerfile
│   └── package.json
│
├── ai-service/                       # 🧠 Service IA Python
│   ├── __pycache__/                  # (Python cache)
│   ├── app.py                        # FastAPI main
│   ├── chatbot.py                    # FreeChatbot (Ollama)
│   ├── predictor.py                  # SimplePredictor (ML)
│   └── requirements.txt              # Dépendances Python
│
├── .github/                          # CI/CD
│   └── workflows/
│       └── ci.yml                    # GitHub Actions
│
├── init.sql                          # Schéma DB initial
├── docker-compose.yml                # Orchestration 3 services
├── .env.example                      # Variables d'environnement
├── .gitignore
└── README.md
```

---

## 🚀 Installation et Déploiement

### Prérequis
- **Docker Desktop** (recommandé) OU :
  - Node.js 18+
  - PostgreSQL 16+
  - Python 3.9+ (pour le service IA)
  - Ollama installé localement (pour l'IA)
- Git
- 8 GB RAM minimum

### Installation Docker (Recommandé)

```bash
# 1. Cloner le dépôt
git clone https://github.com/Abdoulaye9274/ClientFlow.git
cd crm

# 2. Configurer les variables d'environnement
cp backend/.env.example backend/.env
# Éditer backend/.env avec vos valeurs

# 3. Démarrer tous les services
docker-compose up -d

# 4. Vérifier les logs
docker-compose logs -f

# 5. Accéder à l'application
# Frontend: http://localhost:3001
# Backend: http://localhost:5000
# Database: localhost:5432
```

### Pour utiliser le Service IA

Le service IA nécessite **Ollama** installé localement :

```bash
# 1. Installer Ollama
# Télécharger depuis : https://ollama.ai/

# 2. Télécharger le modèle Llama 3.2
ollama pull llama3.2

# 3. Installer les dépendances Python
cd ai-service
pip install -r requirements.txt

# 4. Démarrer le service IA
uvicorn app:app --host 0.0.0.0 --port 8000

# Le service sera accessible sur : http://localhost:8000
```

---

## 🔐 Authentification

### Identifiants de Test

| Utilisateur | Login | Mot de passe | Rôle |
|-------------|--------|---------------|------|
| Administrateur | `abdoulaye` | `abdoulaye123!` | admin |
| Jury/Évaluateur | `jury` | `jury123!` | user |

### Sécurité Implémentée
- ✅ **JWT** avec signature secrète
- ✅ **Bcrypt** pour les mots de passe (salt rounds: 10)
- ✅ **Middleware** d'authentification sur toutes les routes protégées
- ✅ **RBAC** : Certaines routes réservées aux admins
- ✅ **CORS** configuré
- ✅ **Validation** des données côté serveur

---

## 🎨 Fonctionnalités Principales

### 1. **Gestion des Clients**
- ✅ CRUD complet (Create, Read, Update, Delete)
- ✅ Recherche et tri
- ✅ Vue détail client avec historique
- ✅ **📧 Notification email automatique à la création**

### 2. **Gestion des Contrats**
- ✅ Liaison client-contrat
- ✅ Statuts multiples (draft, actif, expiré, annulé)
- ✅ Calcul automatique du CA
- ✅ Dates de début/fin de contrat
- ✅ **📧 Notification email automatique à la création**

### 3. **Gestion des Services**
- ✅ Catalogue de services
- ✅ Attribution aux clients via contrats
- ✅ Suivi des services actifs/inactifs
- ✅ Pricing flexible

### 4. **Dossiers Clients**
- ✅ Création de dossiers (support, commercial, technique)
- ✅ Priorités (basse, normale, haute)
- ✅ Statuts (nouveau, en_cours, résolu, fermé)
- ✅ Filtrage par client

### 5. **Tableau de Bord Analytique**
- ✅ Métriques en temps réel :
  - Nombre de clients
  - Nombre de contrats actifs
  - Chiffre d'affaires total
  - Tendance (graphique)
- ✅ Graphique d'évolution des contrats (Recharts)
- ✅ Activités récentes

### 6. **Assistant IA** 🤖 (Innovation)

#### Interface Chatbot
- ✅ Interface de chat moderne et responsive
- ✅ **Accès aux données CRM** en temps réel
- ✅ Réponses générées par **Ollama (Llama 3.2)**
- ✅ Exemples de questions :
  - _"Quel est le chiffre d'affaires ce mois-ci ?"_
  - _"Combien de clients actifs avons-nous ?"_
  - _"Liste-moi les contrats qui expirent bientôt"_

#### Prédiction ML (optionnel)
- ✅ **Random Forest Classifier** pour prédire le renouvellement
- ✅ Endpoint `/predict-renewal` disponible
- ✅ Entraînement sur les données réelles via `/train`

---

## 📊 Compétences RNCP Démontrées

### BLOC 1 : Développer une application sécurisée
✅ Environnement de développement moderne (VS Code, Docker)  
✅ Interfaces utilisateur React avec Material-UI  
✅ Composants métier réutilisables  
✅ Gestion de projet (Git, README, documentation)

### BLOC 2 : Concevoir et développer une application organisée en couches
✅ Analyse des besoins et maquettage  
✅ **Architecture micro-services** (3-tiers + service IA découplé)  
✅ Base de données PostgreSQL normalisée  
✅ Repository pattern pour l'accès aux données  

### BLOC 3 : Préparer le déploiement
✅ Plan de tests (Jest, tests E2E)  
✅ Documentation de déploiement (Docker)  
✅ CI/CD avec GitHub Actions  
✅ Sécurité (JWT, bcrypt, validation)

---

## 🐛 Dépannage

### Le service IA ne démarre pas
**Cause** : Ollama non installé ou modèle non téléchargé  
**Solution** :
```bash
# Installer Ollama : https://ollama.ai/
ollama pull llama3.2
```

### Les emails ne sont pas envoyés
**Cause** : Variables Gmail non configurées  
**Solution** : En développement, les emails sont visibles via Ethereal (URL dans les logs). En production, configurez `GMAIL_USER` et `GMAIL_PASS` dans `.env`.

### Erreur de connexion base de données
**Solution** :
```bash
docker-compose logs db
# Vérifier que PostgreSQL a démarré correctement
```

---

## 📞 Contact

**Candidat** : Abdoulaye  
**Formation** : RNCP Niveau 6 - Concepteur Développeur d'Applications  
**Email** : abdouladoumbia309@gmail.com  
**GitHub** : [Abdoulaye9274/ClientFlow](https://github.com/Abdoulaye9274/ClientFlow)

---

## 📄 License

MIT License - Libre d'utilisation pour des fins pédagogiques.

---

## 🙏 Remerciements

- **Formateurs** pour leur accompagnement
- **Ollama** pour le LLM open-source
- **Material-UI** pour le design system
- **FastAPI** pour le framework IA rapide
