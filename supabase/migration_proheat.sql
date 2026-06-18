-- Ajouter l'identifiant ProHeat pour le lien avec l'API Testo/ProHeat
ALTER TABLE clients ADD COLUMN IF NOT EXISTS proheat_id text;
CREATE UNIQUE INDEX IF NOT EXISTS clients_proheat_id_idx ON clients(proheat_id) WHERE proheat_id IS NOT NULL;
