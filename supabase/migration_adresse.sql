-- Sépare adresse en rue + numero pour cohérence avec ProHeat
ALTER TABLE clients RENAME COLUMN adresse TO rue;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS numero text;

ALTER TABLE reservations RENAME COLUMN adresse TO rue;
ALTER TABLE reservations ADD COLUMN IF NOT EXISTS numero text;
