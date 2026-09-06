# Guide d'ajout des médias

Le code détecte désormais automatiquement tes fichiers **au moment du build**, sans exiger une orthographe
parfaite. Il suffit que le nom du fichier (sans l'extension) **contienne les mêmes lettres et chiffres**
que le nom attendu ci-dessous — l'espace, le tiret, l'underscore et la casse (majuscule/minuscule) n'ont
plus d'importance, et le format peut être `.jpg`, `.jpeg`, `.png`, `.webp` (image) ou `.mp4`, `.webm`, `.mov`
(vidéo). Exemples qui fonctionnent tous pour la même entrée "AG 1" : `AG 1.JPG`, `AG-1.jpg`, `ag_1.png`.

## public/images/activites/
- Formation des membres du bureau : "Format-bureau 1" → "Format-bureau 5"
- Assemblée Générale N1 : "AG 1" → "AG 9"
- Sensibilisation élections : "Sensibilisation 1" → "Sensibilisation 10"
- Formation EXCELLIA 1re édition : "Format-EXCELLIA 1" → "Format-EXCELLIA 10"
- Présélection EXCELLIA : "Présélection 1" → "Présélection 8"
- Finale EXCELLIA : "Final 1" → "Final 10"
- Assemblée Générale N2 : "AGA 1" → "AGA 10"
- Nuit Rétro (à venir) : "Rétro 1"
- EXCELLIA 2e édition (à venir) : "EXCELLIA 2 1"

## public/images/partenaires/
1. "Partenaire 1" → E.O.S Station
2. "Partenaire 2" → TEEKONTEEN
3. "Partenaire 3" → EMPIRE D'OR
4. "Partenaire 4" → RALLY CLUB VIP
5. "Partenaire 5" → INDIGO Côte d'Ivoire
6. "Partenaire 6" → Cercle Artistique et Culturel Le Soleil de Doropo

## public/images/membres/
"Fondateur" (KAMBIRE SIE), "Lanta" (LANTA LEZO ANNE), "Dissourté" (KAMBIRE DISSOURTE), "philippe",
"sami", "franck", "elvis", "dominique", "aboudramane", "Éric" (KAMBOU KPEKPE ERIC), "luc", "julienne",
"Soro" (SORO ERNEST), "esther", "nestor", "mathieu", "marcelin", "Awa traore" (TRAORE AWA), "ibrahim",
"david", "lazare", "arnaud", "sabine" — dans l'ordre de la liste des membres.

## Photos cliquables
Toutes les photos (partenaires, membres, couverture et galerie d'une activité, galerie générale) sont
désormais cliquables : un clic les agrandit seules en plein écran.

## Vidéos
La galerie et les pages détail d'activité savent afficher une vidéo (`<video controls>`) si le fichier
est en `.mp4`, `.webm` ou `.mov` — sinon c'est traité comme une image, même mécanisme de détection tolérante.

## Règles importantes
- Tant qu'un fichier n'est pas trouvé, l'emplacement affiche un bloc neutre discret (au lieu d'une icône
  cassée) — rien de gênant visuellement en attendant l'ajout complet.
- Cette détection se fait **au moment du build** (`next build`), donc à chaque nouvel ajout de fichier,
  il faut repousser sur GitHub pour que Vercel relance un build et les détecte.

