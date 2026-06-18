-- Réservations
create table if not exists reservations (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  prenom text not null,
  nom text not null,
  email text not null,
  telephone text not null,
  adresse text not null,
  commune text not null,
  service text not null,
  date date not null,
  creneau text not null,
  notes text,
  statut text default 'en_attente'
);

-- Clients (pour rappels)
create table if not exists clients (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  civilite text default 'M' check (civilite in ('M', 'Mme')),
  prenom text not null,
  nom text not null,
  email text,
  telephone text not null,
  adresse text not null,
  commune text not null,
  code_postal text,
  type_chaudiere text not null default 'mazout' check (type_chaudiere in ('mazout', 'gaz')),
  dernier_entretien date,
  prochain_entretien date,
  mode_contact text not null default 'email' check (mode_contact in ('email', 'courrier', 'sms'))
);

-- Historique des rappels envoyés
create table if not exists rappels (
  id uuid default gen_random_uuid() primary key,
  client_id uuid references clients(id) on delete cascade,
  type text not null check (type in ('email', 'courrier')),
  date_envoi timestamptz default now()
);
