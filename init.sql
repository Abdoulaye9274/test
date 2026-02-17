-- Créer l'utilisateur PostgreSQL crmuser
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM pg_catalog.pg_roles WHERE rolname = 'crmuser'
  ) THEN
    CREATE USER crmuser WITH PASSWORD 'crmpass';
  END IF;
END
$$;
-- Accorder tous les privilèges sur la base de données crm à crmuser
GRANT ALL PRIVILEGES ON DATABASE crm TO crmuser;
GRANT ALL PRIVILEGES ON SCHEMA public TO crmuser;

-- Table des utilisateurs
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  login VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'user',
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  email VARCHAR(150)
);

ALTER TABLE users OWNER TO crmuser;

-- Insérer un utilisateur admin
INSERT INTO users (login, password, role, first_name, last_name, email)
VALUES ('admin', '$2b$10$KIXObJj9IfzEl6ZLzFfE7Oq6H.g83AONuwqV7kO7.XzR7iS0F6im6', 'admin', 'Admin', 'Global', 'admin@crm.com')
ON CONFLICT (login) DO NOTHING;

-- Insérer l'utilisateur abdoulaye
INSERT INTO users (login, password, role, first_name, last_name, email)
VALUES ('abdoulaye', '$2b$10$kSed/TrXPAm1m7NRJs3QX.7f4HTVhDoleJmaaUiwvtoEAs0DR4a76', 'admin', 'Abdoulaye', 'User', 'abdoulaye@crm.com')
ON CONFLICT (login) DO NOTHING;

-- Table des clients
CREATE TABLE IF NOT EXISTS clients (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100),
  phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE clients OWNER TO crmuser;

-- Table des contrats
CREATE TABLE IF NOT EXISTS contracts (
  id SERIAL PRIMARY KEY,
  client_id INT NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  title VARCHAR(100) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  status VARCHAR(20) DEFAULT 'actif'
);

ALTER TABLE contracts OWNER TO crmuser;

-- Table des services
CREATE TABLE IF NOT EXISTS services (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  duree_mois INTEGER,
  conditions TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  prix DECIMAL(10,2) -- Ajout colonne prix manquante dans votre script original
);

ALTER TABLE services OWNER TO crmuser;

-- Relation contrat-services (many-to-many)
CREATE TABLE IF NOT EXISTS contract_services (
  contract_id INT REFERENCES contracts(id) ON DELETE CASCADE,
  service_id INT REFERENCES services(id) ON DELETE CASCADE,
  PRIMARY KEY (contract_id, service_id)
);

ALTER TABLE contract_services OWNER TO crmuser;

-- Table des activités (pour le tableau de bord)
CREATE TABLE IF NOT EXISTS activities (
  id SERIAL PRIMARY KEY,
  type VARCHAR(50) NOT NULL,
  description TEXT,
  status VARCHAR(20) DEFAULT 'Succès',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE activities OWNER TO crmuser;

-- Table des dossiers clients (Création propre au lieu de ALTER)
CREATE TABLE IF NOT EXISTS client_dossiers (
  id SERIAL PRIMARY KEY,
  client_id INTEGER REFERENCES clients(id) ON DELETE CASCADE,
  id_dossier VARCHAR(50) UNIQUE,
  status VARCHAR(50) DEFAULT 'en_cours',
  type_dossier VARCHAR(100) DEFAULT 'support',
  priorite VARCHAR(20) DEFAULT 'normale',
  sujet VARCHAR(255),
  description TEXT,
  remarques TEXT,
  document_url TEXT,
  responsable_id INTEGER,
  date_ouverture TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  date_echeance TIMESTAMP,
  date_fermeture TIMESTAMP,
  temps_passe_heures DECIMAL(5,2) DEFAULT 0,
  cout_estime DECIMAL(10,2)
);

ALTER TABLE client_dossiers OWNER TO crmuser;

-- Table client_services pour la relation client-service
CREATE TABLE IF NOT EXISTS client_services (
  id SERIAL PRIMARY KEY,
  client_id INTEGER REFERENCES clients(id) ON DELETE CASCADE,
  service_id INTEGER REFERENCES services(id) ON DELETE CASCADE,
  date_debut DATE NOT NULL,
  date_fin DATE,
  status VARCHAR(50) DEFAULT 'actif',
  prix_convenu DECIMAL(10,2),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(client_id, service_id, date_debut)
);

ALTER TABLE client_services OWNER TO crmuser;


-- Données de démonstration pour les services
INSERT INTO services (name, description, prix, duree_mois, conditions, is_active) VALUES
('Hébergement Web Standard', 'Hébergement web avec 10GB d''espace et bande passante illimitée', 15.00, 12, 'Engagement 12 mois minimum', true),
('Maintenance Site Web', 'Maintenance mensuelle du site web, mises à jour et sauvegardes', 50.00, 1, 'Facturation mensuelle', true),
('Développement Custom', 'Développement d''applications sur mesure', 75.00, NULL, 'Facturation à l''heure', true),
('Conseil IT', 'Conseil en informatique et stratégie digitale', 100.00, NULL, 'Facturation à l''heure', true)
ON CONFLICT DO NOTHING; -- Note: conflict clause removed or adjusted as 'nom' isn't constrained unique explicitly here, but kept simple

-- Accorder tous les privilèges sur les tables et séquences existantes et futures
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO crmuser;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO crmuser;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO crmuser;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO crmuser;