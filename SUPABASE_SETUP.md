# Configuration Supabase

## Variables d'environnement
1. Copier `.env.example` vers `.env.local`
2. Renseigner :
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

## Schéma SQL (Supabase SQL Editor)
```sql
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  name text not null unique
);

create table if not exists purchases (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  price numeric(10,2) not null,
  date date not null,
  created_at timestamptz default now()
);

create index if not exists purchases_date_idx on purchases(date desc);
create index if not exists products_name_idx on products(name);
```

## RLS (Row Level Security) - OBLIGATOIRE
```sql
-- Activer RLS sur les tables
alter table products enable row level security;
alter table purchases enable row level security;

-- Policies pour accès public (mode dev/demo)
create policy "Lecture publique products" on products
  for select using (true);

create policy "Insertion publique products" on products
  for insert with check (true);

create policy "Lecture publique purchases" on purchases
  for select using (true);

create policy "Insertion publique purchases" on purchases
  for insert with check (true);
```

**Note :** Pour production, remplacer `true` par des conditions basées sur `auth.uid()` pour sécuriser l'accès par utilisateur.
