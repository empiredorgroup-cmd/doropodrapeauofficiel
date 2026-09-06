export type ActivityStatus = 'past' | 'announced';
export type Activity = {
  id:string; title:string; status:ActivityStatus; dateLabel:string; place:string; tag:string; summary:string; image?:string; mediaPrefix?:string; mediaCount?:number;
};
export const activities: Activity[] = [
 {id:'formation-bureau',title:'Formation des membres du bureau',status:'past',dateLabel:'23 novembre 2025',place:'Espace du 20 Août',tag:'Formation',mediaPrefix:'Format-bureau',mediaCount:5,summary:'Formation destinée à permettre à chaque membre du bureau de mieux connaître son rôle, ses engagements, ses pouvoirs et ses limites.'},
 {id:'ag-n1',title:'Assemblée Générale N1',status:'past',dateLabel:'30 novembre 2025',place:'Foyer des jeunes de Doropo',tag:'Vie associative',mediaPrefix:'AG',mediaCount:9,summary:'Rencontre de fin d’année consacrée au bilan des activités et à la préparation de l’année suivante.'},
 {id:'sensibilisation-elections',title:'Sensibilisation pour des élections législatives apaisées',status:'past',dateLabel:'11 décembre 2025',place:'Gare de Bouaké de Doropo',tag:'Citoyenneté',mediaPrefix:'Sensibilisation',mediaCount:10,summary:'Action destinée à sensibiliser la jeunesse contre les violences en période électorale et à promouvoir une participation citoyenne responsable.'},
 {id:'formation-excellia',title:'Formation des élèves — EXCELLIA 1re édition',status:'past',dateLabel:'Mars à mai 2026',place:'Différents établissements secondaires de Doropo',tag:'Éducation',mediaPrefix:'Format-EXCELLIA',mediaCount:10,summary:'Séances de préparation et de coaching liées à la première édition du concours d’art oratoire EXCELLIA.'},
 {id:'preselection-excellia',title:'Présélection du concours EXCELLIA',status:'past',dateLabel:'25 avril 2026',place:'Lycée moderne de Doropo',tag:'EXCELLIA',mediaPrefix:'Présélection',mediaCount:8,summary:'Première étape de sélection du concours EXCELLIA avant la finale.'},
 {id:'final-excellia',title:'Finale du concours EXCELLIA',status:'past',dateLabel:'19 mai 2026',place:'Foyer des jeunes de Doropo',tag:'EXCELLIA',mediaPrefix:'Final',mediaCount:10,summary:'Finale de la première édition d’EXCELLIA, avec présentation des prestations finales et récompense des meilleurs participants.'},
 {id:'ag-n2',title:'Assemblée Générale N2',status:'past',dateLabel:'08 juin 2026',place:'Espace du 20 Août',tag:'Vie associative',mediaPrefix:'AGA',mediaCount:10,summary:'Assemblée Générale de l’année 2026 de DOROPO DRAPEAU.'},
 {id:'nuit-retro',title:'Nuit Rétro',status:'announced',dateLabel:'Date à venir',place:'Lieu à venir',tag:'Annonce',mediaPrefix:'Rétro',mediaCount:1,summary:'Soirée destinée à mettre en valeur la mode et l’ambiance d’une époque autour du thème : « L’âge d’or du coupé-décalé ». Date et lieu à venir.'},
 {id:'excellia-2',title:'EXCELLIA — 2e édition',status:'announced',dateLabel:'Date à venir',place:'Lieu à venir',tag:'Annonce',mediaPrefix:'EXCELLIA 2',mediaCount:1,summary:'Annonce de la deuxième édition du concours d’art oratoire EXCELLIA. Les informations pratiques seront communiquées ultérieurement.'}
];
export const partners = [
 {name:'E.O.S Station',description:'Station-service implantée à Doropo. Le propriétaire est connu sous le surnom de Saoudien.',file:'Partenaire 1'},
 {name:'TEEKONTEEN',description:'Marque de vêtement du fondateur de DOROPO DRAPEAU, M. Kambiré Sié.',file:'Partenaire 2'},
 {name:'EMPIRE D’OR',description:'Entreprise de communication dont le responsable est M. Kambiré Aboudramane.',file:'Partenaire 3'},
 {name:'RALLY CLUB VIP',description:'Lieu de divertissement à Doropo dont le responsable est M. Kambou Franck.',file:'Partenaire 4'},
 {name:'INDIGO Côte d’Ivoire',description:'ONG engagée pour la paix et la cohésion sociale en Côte d’Ivoire. Facilitateur à Doropo : M. Kaleb, dit KALJO.',file:'Partenaire 5'},
 {name:'Cercle Artistique et Culturel Le Soleil de Doropo',description:'Association artistique sœur qui entretient une relation de partenariat et d’accompagnement réciproque avec DOROPO DRAPEAU. Président : M. Aguedissou Koffi Guaetan.',file:'Partenaire 6'}
];
// --- Résolution des médias ---
// La correspondance réelle (fichier ↔ mediaPrefix/file/photo) se fait dans lib/media-resolver.ts,
// qui scanne public/images/... au moment du build et tolère espace/tiret, majuscule/minuscule et accents.
// ajoute les fichiers progressivement ; tant qu'un média n'est pas trouvé, un repli neutre s'affiche.
export const FALLBACK_IMAGE = '/images/Logo 2.jpeg';

export const domains = [
 ['Formation de la jeunesse','La formation et l’information de la jeunesse occupent une place centrale dans les objectifs de l’association.'],
 ['Éducation et citoyenneté','Sensibilisation à la scolarisation, à l’alphabétisation, à la responsabilité et à la participation citoyenne.'],
 ['Paix et cohésion sociale','Promotion de l’unité, de l’entraide, du respect mutuel et du vivre-ensemble à Doropo et dans le Bounkani.'],
 ['Culture et valeurs traditionnelles','Valorisation des valeurs traditionnelles essentielles des différentes communautés vivant à Doropo et aux alentours.'],
 ['Développement communautaire','Contribution à la création d’une communauté forte et à l’émergence de cadres et d’élites dans le Département de Doropo.']
] as const;
