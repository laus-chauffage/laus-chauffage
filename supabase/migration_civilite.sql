-- Ajout civilité client
ALTER TABLE clients ADD COLUMN IF NOT EXISTS civilite text default 'M' check (civilite in ('M', 'Mme'));
