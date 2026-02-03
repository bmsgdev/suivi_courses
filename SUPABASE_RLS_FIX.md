# Configuration RLS pour Supabase

## Étape 1 : Activer RLS sur les tables
Exécutez ce SQL dans le SQL Editor de Supabase :

```sql
-- Activer Row Level Security
alter table products enable row level security;
alter table purchases enable row level security;
```

## Étape 2 : Créer les policies d'accès public
```sql
-- Policies complètes pour products
create policy "Lecture publique products" 
on products for select 
using (true);

create policy "Insertion publique products" 
on products for insert 
with check (true);

create policy "Modification publique products" 
on products for update 
using (true) with check (true);

create policy "Suppression publique products" 
on products for delete 
using (true);

-- Policies complètes pour purchases
create policy "Lecture publique purchases" 
on purchases for select 
using (true);

create policy "Insertion publique purchases" 
on purchases for insert 
with check (true);

create policy "Modification publique purchases" 
on purchases for update 
using (true) with check (true);

create policy "Suppression publique purchases" 
on purchases for delete 
using (true);
```

## Étape 3 : Vérifier les policies
```sql
-- Vérifier que les policies sont actives
select schemaname, tablename, policyname, permissive, roles, cmd 
from pg_policies 
where schemaname = 'public';
```

## Note importante
Ces policies permettent un accès public total (mode démo/dev). 

Pour production, remplacez `using (true)` et `with check (true)` par des conditions basées sur l'authentification, par exemple :
```sql
using (auth.uid() is not null)
with check (auth.uid() is not null)
```

## Troubleshooting 406 Not Acceptable
Si vous recevez toujours une erreur 406, vérifiez que :
1. RLS est bien activé sur toutes les tables
2. Les policies permettent les opérations SELECT et INSERT
3. L'anon key utilisée dans .env est correcte
4. Les tables sont bien dans le schéma `public`
