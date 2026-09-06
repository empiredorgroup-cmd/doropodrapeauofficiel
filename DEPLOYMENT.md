# Déploiement Vercel — version frontend

1. Décompresser le ZIP.
2. Créer/importer un dépôt GitHub avec le contenu du dossier.
3. Dans Vercel, importer le dépôt GitHub.
4. Framework preset : Next.js.
5. Aucun variable d'environnement n'est nécessaire pour cette version.
6. Lancer le déploiement.

Cette version utilise `output: export` : elle est générée comme site statique par Next.js. Aucun serveur backend, Supabase ou compte administrateur n'est requis.

Après déploiement, l'URL réelle devra remplacer l'URL de démonstration utilisée pour le sitemap dans `app/sitemap.ts` et `metadataBase` dans `app/layout.tsx` si l'URL Vercel attribuée est différente.
