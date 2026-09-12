-- DOROPO DRAPEAU — Migration 0003 : contenu de départ (membres, partenaires, activités)
-- À exécuter une seule fois dans Supabase → SQL Editor → New snippet → Run,
-- APRÈS 0001_init.sql et 0002_news_storage.sql.
-- Les photos/logos ne sont pas migrés ici (photo_url/cover_image_url restent vides) :
-- le site public continue d'afficher les photos déjà en place via l'ancien système tant
-- que l'admin n'en téléverse pas une nouvelle depuis le nouvel espace d'administration.

-- Membres
insert into public.members (full_name, role, description, display_order) values ('KAMBIRE SIE', 'Président Fondateur', 'Fondateur et figure de référence de l’association.', 1);
insert into public.members (full_name, role, description, display_order) values ('LANTA LEZO ANNE', '1re Vice-Présidente', 'Membre de la direction associative et du bureau.', 2);
insert into public.members (full_name, role, description, display_order) values ('KAMBIRE DISSOURTE', '2e Vice-Président', 'Participe à la direction du bureau et à la mise en œuvre des orientations de l’Assemblée Générale.', 3);
insert into public.members (full_name, role, description, display_order) values ('KAMBOU TOHO PHILIPPE', 'Secrétaire Général', 'Assure les correspondances, convocations, procès-verbaux et dossiers administratifs.', 4);
insert into public.members (full_name, role, description, display_order) values ('SIB SAMI', 'Secrétaire Général Adjoint', 'Seconde le Secrétaire Général et le supplée en cas d’empêchement.', 5);
insert into public.members (full_name, role, description, display_order) values ('KAMBOU SIE FRANCK', 'Trésorier Général', 'Participe au suivi des cotisations, recettes, dépenses et documents comptables.', 6);
insert into public.members (full_name, role, description, display_order) values ('DIBLONI ROCK ELVIS', 'Trésorier Général Adjoint', 'Assiste le Trésorier Général et le supplée en cas d’empêchement.', 7);
insert into public.members (full_name, role, description, display_order) values ('PALE DOMINIQUE', 'Commissaire aux comptes', 'Participe au contrôle de la gestion financière du Bureau Exécutif.', 8);
insert into public.members (full_name, role, description, display_order) values ('KAMBIRE ABOUDRAMANE', 'Commissaire aux comptes adjoint', 'Participe au dispositif de contrôle des comptes et à la surveillance de la gestion financière.', 9);
insert into public.members (full_name, role, description, display_order) values ('KAMBOU KPEKPE ERIC', 'Chargé de Communication', 'Contribue à la communication de l’association et à la diffusion de ses activités.', 10);
insert into public.members (full_name, role, description, display_order) values ('SIB OLLO JEAN LUC', 'Chargé de Communication', 'Participe aux actions de communication et à la valorisation des initiatives.', 11);
insert into public.members (full_name, role, description, display_order) values ('NOUFE INI JULIENNE', 'Chargée de Communication', 'Participe aux activités de communication et à la circulation des informations associatives.', 12);
insert into public.members (full_name, role, description, display_order) values ('SORO ERNEST', 'Comité chargé des Activités et de la Logistique', 'Participe à l’organisation matérielle et logistique des activités.', 13);
insert into public.members (full_name, role, description, display_order) values ('DJANE ESTHER', 'Comité chargé des Activités et de la Logistique', 'Contribue à la préparation et au suivi logistique des manifestations.', 14);
insert into public.members (full_name, role, description, display_order) values ('NOUFE NESTOR', 'Comité chargé à l’Organisation', 'Participe à la préparation, à la coordination et au déroulement des activités.', 15);
insert into public.members (full_name, role, description, display_order) values ('HIEN MATHIEU', 'Comité chargé à l’Organisation', 'Contribue à la coordination opérationnelle des activités associatives.', 16);
insert into public.members (full_name, role, description, display_order) values ('NOUFE OLO MARCELIN', 'Comité chargé aux Affaires Extérieures et aux Partenariats', 'Participe aux relations extérieures et au développement des partenariats.', 17);
insert into public.members (full_name, role, description, display_order) values ('TRAORE AWA', 'Comité chargé aux Affaires Extérieures et aux Partenariats', 'Contribue aux relations avec les partenaires et interlocuteurs extérieurs.', 18);
insert into public.members (full_name, role, description, display_order) values ('COULIBALY IBRAHIM', 'Comité chargé à la Mobilisation', 'Participe à la mobilisation des membres et du public autour des activités.', 19);
insert into public.members (full_name, role, description, display_order) values ('KAMBOU DAVID', 'Comité chargé à la Mobilisation', 'Contribue à la mobilisation et à la participation effective aux activités.', 20);
insert into public.members (full_name, role, description, display_order) values ('KAMBOU LAZARE', 'Comité chargé à la Mobilisation', 'Participe aux actions de mobilisation et de sensibilisation des membres.', 21);
insert into public.members (full_name, role, description, display_order) values ('SIB OLLO ARNAUD', 'Consultant des Projets', 'Apporte son concours à la réflexion et à l’accompagnement des projets.', 22);
insert into public.members (full_name, role, description, display_order) values ('DAH HOHO SABINE', 'Membre artistique', 'Participe à la dimension artistique et culturelle des activités.', 23);

-- Partenaires
insert into public.partners (name, description, responsible_name, display_order) values ('E.O.S Station', 'Station-service implantée à Doropo. Le propriétaire est connu sous le surnom de Saoudien.', null, 1);
insert into public.partners (name, description, responsible_name, display_order) values ('TEEKONTEEN', 'Marque de vêtement du fondateur de DOROPO DRAPEAU, M. Kambiré Sié.', null, 2);
insert into public.partners (name, description, responsible_name, display_order) values ('EMPIRE D’OR', 'Entreprise de communication dont le responsable est M. Kambiré Aboudramane.', 'M. Kambiré Aboudramane', 3);
insert into public.partners (name, description, responsible_name, display_order) values ('RALLY CLUB VIP', 'Lieu de divertissement à Doropo dont le responsable est M. Kambou Franck.', 'M. Kambou Franck', 4);
insert into public.partners (name, description, responsible_name, display_order) values ('INDIGO Côte d’Ivoire', 'ONG engagée pour la paix et la cohésion sociale en Côte d’Ivoire. Facilitateur à Doropo : M. Kaleb, dit KALJO.', 'M. Kaleb (KALJO)', 5);
insert into public.partners (name, description, responsible_name, display_order) values ('Cercle Artistique et Culturel Le Soleil de Doropo', 'Association artistique sœur qui entretient une relation de partenariat et d’accompagnement réciproque avec DOROPO DRAPEAU. Président : M. Aguedissou Koffi Guaetan.', 'M. Aguedissou Koffi Guaetan', 6);

-- Activités
insert into public.activities (slug, title, status, event_date, event_time, location, description, display_order) values ('formation-bureau', 'Formation des membres du bureau', 'past', '2025-11-23', null, 'Espace du 20 Août', 'Formation destinée à permettre à chaque membre du bureau de mieux connaître son rôle, ses engagements, ses pouvoirs et ses limites.', 1);
insert into public.activities (slug, title, status, event_date, event_time, location, description, display_order) values ('ag-n1', 'Assemblée Générale N1', 'past', '2025-11-30', null, 'Foyer des jeunes de Doropo', 'Rencontre de fin d’année consacrée au bilan des activités et à la préparation de l’année suivante.', 2);
insert into public.activities (slug, title, status, event_date, event_time, location, description, display_order) values ('sensibilisation-elections', 'Sensibilisation pour des élections législatives apaisées', 'past', '2025-12-11', null, 'Gare de Bouaké de Doropo', 'Action destinée à sensibiliser la jeunesse contre les violences en période électorale et à promouvoir une participation citoyenne responsable.', 3);
insert into public.activities (slug, title, status, event_date, event_time, location, description, display_order) values ('formation-excellia', 'Formation des élèves — EXCELLIA 1re édition', 'past', null, null, 'Différents établissements secondaires de Doropo', 'Séances de préparation et de coaching liées à la première édition du concours d’art oratoire EXCELLIA (mars à mai 2026).', 4);
insert into public.activities (slug, title, status, event_date, event_time, location, description, display_order) values ('preselection-excellia', 'Présélection du concours EXCELLIA', 'past', '2026-04-25', null, 'Lycée moderne de Doropo', 'Première étape de sélection du concours EXCELLIA avant la finale.', 5);
insert into public.activities (slug, title, status, event_date, event_time, location, description, display_order) values ('final-excellia', 'Finale du concours EXCELLIA', 'past', '2026-05-19', null, 'Foyer des jeunes de Doropo', 'Finale de la première édition d’EXCELLIA, avec présentation des prestations finales et récompense des meilleurs participants.', 6);
insert into public.activities (slug, title, status, event_date, event_time, location, description, display_order) values ('ag-n2', 'Assemblée Générale N2', 'past', '2026-06-08', null, 'Espace du 20 Août', 'Assemblée Générale de l’année 2026 de DOROPO DRAPEAU.', 7);
insert into public.activities (slug, title, status, event_date, event_time, location, description, display_order) values ('nuit-retro', 'Nuit Rétro', 'announced', null, null, null, 'Soirée destinée à mettre en valeur la mode et l’ambiance d’une époque autour du thème : « L’âge d’or du coupé-décalé ». Date et lieu à venir.', 8);
insert into public.activities (slug, title, status, event_date, event_time, location, description, display_order) values ('excellia-2', 'EXCELLIA — 2e édition', 'announced', null, null, null, 'Annonce de la deuxième édition du concours d’art oratoire EXCELLIA. Les informations pratiques seront communiquées ultérieurement.', 9);
