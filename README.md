# DOROPO DRAPEAU — Frontend dynamique sans backend

Version volontairement limitée au frontend : aucun Supabase, aucun compte administrateur et aucune API backend dans cette version.

## Stack
- Next.js 16.3.3
- React 19.2
- TypeScript
- Lucide React
- Export statique (`output: export`) compatible avec un déploiement Vercel sans serveur applicatif.

## Fonctionnalités incluses
- Design responsive mobile/tablette/desktop.
- Écran d’entrée animé avec Logos 1 et 2.
- Formulaire visiteur facultatif stocké localement dans le navigateur (aucune donnée envoyée à un serveur).
- Animation 👍 à la validation.
- Navigation mobile.
- Activités passées et annonces à venir.
- Recherche et filtres côté client dans les activités.
- Pages individuelles d’activités générées à partir des données du catalogue.
- Page EXCELLIA.
- Galerie interactive avec aperçu plein écran.
- Rubriques membres, partenaires, domaines, présentation, soutien, rejoindre, bilans et contacts.
- Métadonnées SEO, sitemap et robots.
- Footer avec le crédit développeur et numéro de contact.

## Développement
```bash
npm install
npm run dev
```

## Vérification de production
```bash
npm run lint
npm run build
```

Le dossier `out/` généré par le build est déployable directement sur Vercel.

## Évolution future
Supabase PostgreSQL, Auth, Storage et l’espace administrateur pourront être ajoutés ultérieurement sans devoir refaire le design des pages publiques : les contenus sont déjà centralisés dans `lib/content.ts` et `lib/members.ts`.
