# Configuration Supabase WHTL

1. Exécuter `schema.sql` dans le SQL Editor Supabase.
2. Créer le premier administrateur dans Authentication > Users avec **Auto Confirm User** activé.
3. Déployer la fonction :

```bash
supabase functions deploy create-admin --project-ref nrifrzycijiexgrutgam
```

4. Ajouter la clé publique `anon` / `publishable` dans le secret GitHub :

```text
VITE_SUPABASE_ANON_KEY
```

La fonction `create-admin` reçoit automatiquement `SUPABASE_URL`,
`SUPABASE_ANON_KEY` et `SUPABASE_SERVICE_ROLE_KEY` dans l'environnement
Supabase. La clé `service_role` ne doit jamais être ajoutée au site ou à GitHub Pages.
