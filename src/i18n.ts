import { useEffect, useRef } from "react";
import type { Language } from "./supabase";

const en: Record<string, string> = {
  "Navigation principale": "Main navigation",
  "Ouvrir le menu": "Open menu",
  "Menu mobile": "Mobile menu",
  "A propos": "About",
  Equipements: "Equipment",
  Ressources: "Resources",
  Solutions: "Solutions",
  Contact: "Contact",
  Devis: "Quote",
  "Choisir un secteur": "Choose an industry",
  "Solutions par industrie, service et equipement.": "Solutions by industry, service and equipment.",
  "Freight Forwarding & Ship Agency Services": "Freight Forwarding & Ship Agency Services",
  "La logistique des projets les plus complexes.": "Logistics for the most complex projects.",
  "WHTL gère vos opérations logistiques, portuaires et de transport exceptionnel en Algérie, depuis l'étude technique jusqu'à la réalisation sur le terrain.":
    "WHTL manages your logistics, port and special transport operations in Algeria, from technical studies to field execution.",
  Explorer: "Explore",
  "Voir l'approche": "See our approach",
  "lignes THP/SL": "THP/SL axle lines",
  "par ligne d'essieux": "per axle line",
  "système de skidding": "skidding system",
  Scroll: "Scroll",
  "Nos domaines": "Our industries",
  "Une expertise coordonnée sur terre, au port et sur site.":
    "Coordinated expertise on the road, at the port and on site.",
  Énergie: "Energy",
  "Maritime & ports": "Maritime & ports",
  Infrastructure: "Infrastructure",
  Industrie: "Industry",
  "Transformateurs, centrales, réseaux": "Transformers, power plants and grids",
  "Transport de transformateurs": "Transformer transport",
  "Montage industriel": "Industrial installation",
  "Transport, levage et installation d'équipements lourds pour les projets énergétiques.":
    "Transport, lifting and installation of heavy equipment for energy projects.",
  "Navires, Ro-Ro, breakbulk": "Vessels, Ro-Ro and breakbulk",
  "Consignation des navires": "Ship agency",
  "Opérations portuaires": "Port operations",
  "Fret Heavy Lift": "Heavy lift freight",
  "Organisation des escales, coordination portuaire et suivi des cargaisons conventionnelles ou hors gabarit.":
    "Port call organization, port coordination and cargo monitoring for conventional and oversized freight.",
  "Routes, ouvrages, plateformes": "Roads, structures and platforms",
  "Route survey": "Route survey",
  "Aménagement routier": "Road improvements",
  "Renforcement d'ouvrages": "Structural reinforcement",
  "Préparation et sécurisation des itinéraires nécessaires au passage des convois exceptionnels.":
    "Preparation and securing of routes required for abnormal-load convoys.",
  "Usines, équipements, projets complexes": "Plants, equipment and complex projects",
  "Manutention lourde": "Heavy handling",
  Skidding: "Skidding",
  "Coordination de projet": "Project coordination",
  "Des méthodes complètes, de l'étude technique à l'installation finale sur site.":
    "Complete methods, from technical studies to final on-site installation.",
  "De l'organisation logistique à l'exécution terrain.": "From logistics planning to field execution.",
  "Transport multimodal": "Multimodal transport",
  "Organisation du transport maritime, terrestre et multimodal, avec coordination logistique, douanière et suivi opérationnel des cargaisons.":
    "Organization of sea, road and multimodal transport, with logistics and customs coordination and operational cargo tracking.",
  "Voir la page": "View service",
  "Consignation maritime": "Ship agency",
  "Gestion des opérations portuaires, consignation des navires et coordination de tous les intervenants pendant l'escale.":
    "Management of port operations, ship agency services and coordination of all parties during the port call.",
  "Transport spécial": "Special transport",
  "Études de transport, route survey, autorisations, aménagement des itinéraires et supervision complète des convois exceptionnels.":
    "Transport studies, route surveys, permits, route improvements and complete supervision of abnormal-load convoys.",
  "Heavy Lift & industrie": "Heavy Lift & industry",
  "Levage et manutention lourde": "Heavy lifting and handling",
  "Levage, manutention lourde, montage d'équipements industriels et transformateurs, skidding et distribution jusqu'au site final.":
    "Heavy lifting, handling, installation of industrial equipment and transformers, skidding and final-site delivery.",
  "Une flotte dédiée au Heavy Transport & Heavy Lifting.":
    "A fleet dedicated to Heavy Transport & Heavy Lifting.",
  "Remorques THP/SL, tracteurs Heavy Haul, portiques SBL, vérins hydrauliques et systèmes de skidding pour les opérations les plus complexes.":
    "THP/SL trailers, heavy haul tractors, SBL gantries, hydraulic jacks and skidding systems for the most complex operations.",
  "Voir les equipements": "View equipment",
  "Capacités opérationnelles": "Operational capabilities",
  "Des moyens dimensionnés pour les projets hors norme.": "Resources built for exceptional projects.",
  "Découvrir toute la flotte": "Explore the full fleet",
  "lignes modulaires THP/SL": "THP/SL modular axle lines",
  "45 tonnes par ligne d'essieux": "45 tonnes per axle line",
  "remorques extensibles": "extendable trailers",
  "60 à 90 T, extension jusqu'à 34 m": "60 to 90 T, extendable up to 34 m",
  "avec turntable de 100 T": "with a 100 T turntable",
  "portique SBL": "SBL gantry",
  "complété par un portique SBL 1000 T": "supported by an SBL 1000 T gantry",
  "Coordination institutionnelle": "Institutional coordination",
  "Un seul pilote pour tous les intervenants.": "One lead partner for every stakeholder.",
  "WHTL assure les démarches, autorisations et coordinations nécessaires au passage des convois exceptionnels et à la réalisation des opérations sur le terrain.":
    "WHTL manages the procedures, permits and coordination required for abnormal-load convoys and field operations.",
  "Chemins de fer": "Railways",
  Hydraulique: "Water authorities",
  "PTT / Télécommunications": "PTT / Telecommunications",
  "Autorités locales et administratives": "Local and administrative authorities",
  "Filiales & partenaires": "Subsidiaries & partners",
  "Des compétences complémentaires réunies autour de chaque projet.":
    "Complementary expertise brought together for every project.",
  "Filiale opérationnelle": "Operations subsidiary",
  "Transport conventionnel et exceptionnel, levage, manutention lourde, montage industriel, stockage et livraison sur site.":
    "Conventional and special transport, lifting, heavy handling, industrial installation, storage and site delivery.",
  "Filiale technique": "Technical subsidiary",
  "Aménagement routier, renforcement des routes et ouvrages, études techniques et préparation des itinéraires.":
    "Road improvements, reinforcement of roads and structures, technical studies and route preparation.",
  "Partenaire maritime": "Maritime partner",
  "Fret maritime de colis exceptionnels, navires Ro-Ro et breakbulk, avec coordination portuaire des projets industriels.":
    "Sea freight for oversized cargo, Ro-Ro and breakbulk vessels, with port coordination for industrial projects.",
  "Transit & fret": "Forwarding & freight",
  "Fret conventionnel, conteneurs, transit local et international, formalités douanières et coordination import-export.":
    "Conventional freight, containers, local and international forwarding, customs formalities and import-export coordination.",
  "Parlons aujourd'hui": "Talk to us today",
  "De quoi avez-vous besoin ?": "What do you need help with?",
  "Un nouveau projet ou un projet en cours": "A new or existing project",
  "Dimension, poids, acces, planning: on t'aide a cadrer la methode.":
    "Dimensions, weight, access and schedule: we help define the right method.",
  "Une demande generale": "A general inquiry",
  "Question commerciale, disponibilite, documentation ou rendez-vous.":
    "Commercial question, availability, documentation or meeting request.",
  "Trouver l'agence la plus proche": "Find the nearest team",
  "Equipe locale, zone d'intervention et point de contact projet.":
    "Local team, operating area and project contact.",
  "Travailler avec WHTL": "Work with WHTL",
  "Opérations, ingénierie, coordination portuaire et supervision terrain.":
    "Operations, engineering, port coordination and field supervision.",
  "Notre flotte": "Our fleet",
  "Vous cherchez une solution de transport ou de levage ?":
    "Looking for a transport or lifting solution?",
  "Notre groupe mobilise des remorques modulaires, des tracteurs Heavy Haul, des portiques, des vérins et des accessoires spécialisés.":
    "Our group mobilizes modular trailers, heavy haul tractors, gantries, hydraulic jacks and specialized accessories.",
  "Chaque configuration est étudiée selon la charge, l'itinéraire, les contraintes portuaires et les conditions d'installation sur site.":
    "Each configuration is engineered around the load, route, port constraints and on-site installation conditions.",
  "WHTL sur le terrain": "WHTL in the field",
  "Photos et vidéos de nos opérations.": "Photos and videos from our operations.",
  "Voir les médias précédents": "View previous media",
  "Voir les médias suivants": "View next media",
  Photo: "Photo",
  Vidéo: "Video",
  "Etudes de cas": "Case studies",
  "Operations recentes, presentees en cartes visuelles.": "Recent operations presented as visual case studies.",
  "Tous les projets": "All projects",
  "Transition industrielle": "Industrial transition",
  "Faire avancer les grands projets sans ralentir le terrain.":
    "Move major projects forward without slowing field operations.",
  "Nos equipes combinent calculs d'ingenierie, simulations d'itineraire, planning de levage et execution chantier pour reduire les risques et garder le projet en mouvement.":
    "Our teams combine engineering calculations, route simulations, lifting schedules and site execution to reduce risk and keep projects moving.",
  "Construire la methode": "Build the method",
  "Solutions par secteur": "Solutions by industry",
  "Logistique de projet intégrée": "Integrated project logistics",
  "WHTL coordonne les études, les autorisations, le transport, les opérations portuaires et l'exécution sur site.":
    "WHTL coordinates studies, permits, transport, port operations and on-site execution.",
  "De l'ingénierie à l'exécution": "From engineering to execution",
  "Équipements et moyens mobilisés": "Equipment and resources deployed",
  Équipements: "Equipment",
  "Flotte et équipements": "Fleet and equipment",
  "Une flotte spécialisée pour le transport exceptionnel, la manutention lourde et le montage industriel.":
    "A specialized fleet for abnormal transport, heavy handling and industrial installation.",
  Tous: "All",
  "Voir le detail": "View details",
  "Selection technique selon charge, portee, sol et contraintes d'acces.":
    "Technical selection based on load, reach, ground conditions and access constraints.",
  "Preparation transport, mobilisation, assemblage et verification HSE.":
    "Transport preparation, mobilization, assembly and HSE verification.",
  "Execution controlee avec superviseur, riggers et instrumentation.":
    "Controlled execution with supervisors, riggers and instrumentation.",
  "References projet": "Project references",
  "Quelques exemples des opérations que nos équipes peuvent étudier, coordonner et réaliser.":
    "Examples of operations our teams can engineer, coordinate and execute.",
  "Étude, préparation, autorisations, mobilisation des équipements et supervision opérationnelle.":
    "Engineering, preparation, permits, equipment mobilization and operational supervision.",
  "Demander une methode similaire": "Request a similar method",
  "Expertise et méthodes": "Expertise and methods",
  "Notes techniques sur le transport exceptionnel, la consignation maritime et l'ingénierie Heavy Lift.":
    "Technical insights on abnormal transport, ship agency and Heavy Lift engineering.",
  "Articles, methodes, videos et notes techniques": "Articles, methods, videos and technical notes",
  Article: "Article",
  "A lire": "Read",
  "Lire / demander": "Read / inquire",
  "Un groupe logistique ancré sur le terrain.": "A logistics group grounded in field operations.",
  "WHTL accompagne les projets industriels complexes grâce à ses équipes, ses filiales et son réseau de partenaires.":
    "WHTL supports complex industrial projects through its teams, subsidiaries and partner network.",
  Fiabilité: "Reliability",
  Sécurité: "Safety",
  Coordination: "Coordination",
  "Expertise terrain, préparation technique, transparence client et maîtrise opérationnelle.":
    "Field expertise, technical preparation, client transparency and operational control.",
  "Parlons de votre prochain projet.": "Let's discuss your next project.",
  "Décrivez votre cargaison, votre escale, votre itinéraire ou votre besoin de transport et de manutention.":
    "Tell us about your cargo, port call, route or transport and handling requirements.",
  Nom: "Name",
  Entreprise: "Company",
  Téléphone: "Phone",
  Email: "Email",
  "Type de service": "Service type",
  Message: "Message",
  "Votre nom complet": "Your full name",
  "Nom de votre entreprise": "Company name",
  "Décrivez la cargaison, les dimensions, le lieu, le délai et les contraintes du projet...":
    "Describe the cargo, dimensions, location, schedule and project constraints...",
  "Envoyer sur WhatsApp": "Send via WhatsApp",
  "Votre partenaire logistique": "Your logistics partner",
  "Équipe projet WHTL": "WHTL project team",
  "Notre équipe vous accompagne pour vos opérations en Algérie et à l'international.":
    "Our team supports your operations in Algeria and internationally.",
  Appeler: "Call",
  "Écrire à WHTL": "Message WHTL",
  Horaires: "Opening hours",
  "Dimanche à jeudi · 8h00 à 16h00": "Sunday to Thursday · 8:00 AM to 4:00 PM",
  "Freight forwarding, consignation maritime, transport exceptionnel et Heavy Lift.":
    "Freight forwarding, ship agency, abnormal transport and Heavy Lift.",
  Groupe: "Group",
  "Services principaux": "Core services",
  "Solutions de transport maritime, terrestre et multimodal": "Sea, road and multimodal transport solutions",
  "Remorques THP/SL": "THP/SL trailers",
  "Remorques extensibles": "Extendable trailers",
  "Remorques tramway": "Tramway trailers",
  "Semi-remorques conventionnelles": "Conventional semi-trailers",
  "Accessoires techniques": "Technical accessories",
  "Skidding & manutention": "Skidding & handling",
  "Portiques SBL": "SBL gantries",
  "Équipements hydrauliques": "Hydraulic equipment",
  "Tracteurs Heavy Haul": "Heavy haul tractors",
  Levage: "Lifting",
  Ingénierie: "Engineering",
  Manutention: "Handling",
  Tracteurs: "Tractors",
  "40 lignes · 45 T par ligne": "40 axle lines · 45 T per line",
  "8 unités · 60 à 90 T · jusqu'à 34 m": "8 units · 60 to 90 T · up to 34 m",
  "2 semi-remorques hydrauliques": "2 hydraulic semi-trailers",
  "5 porte-chars 54 T · 5 plateaux 30 T": "5 low loaders at 54 T · 5 flatbeds at 30 T",
  "Plaque tournante 250 T": "250 T turntable",
  "Skidding 400 T · turntable 100 T": "400 T skidding · 100 T turntable",
  "SBL 1100 T et SBL 1000 T": "SBL 1100 T and SBL 1000 T",
  "2 centrales 700 bars · vérins 20 à 100 T": "2 hydraulic power units at 700 bar · 20 to 100 T jacks",
  "10 tracteurs · jusqu'à 250 PTRA": "10 tractors · up to 250 T GCW",
  "Remorques modulaires hydrauliques configurables pour les colis lourds et hors gabarit.":
    "Configurable hydraulic modular trailers for heavy and oversized cargo.",
  "Remorques extra surbaissées pour les pièces longues, industrielles et exceptionnelles.":
    "Extra-low extendable trailers for long, industrial and oversized loads.",
  "Équipements spécialisés dédiés au transport sécurisé de tramways.":
    "Specialized equipment for the safe transport of tramways.",
  "Une flotte conventionnelle pour le transport industriel et la distribution sur site.":
    "A conventional fleet for industrial transport and on-site delivery.",
  "Plateau visselle de 9 m, plateaux de 3 m et 6 m, et splites pour configurations à 3 files.":
    "9 m extendable vessel deck, 3 m and 6 m decks, and split units for three-file configurations.",
  "20 quais marteaux avec poutres et pieds d'éléphant, jusqu'à 100 T par kit.":
    "20 heavy handling stools with beams and elephant feet, up to 100 T per kit.",
  "Portiques disponibles en partenariat avec SBL pour les opérations industrielles lourdes.":
    "Gantry systems available with SBL for heavy industrial operations.",
  "Centrales hydrauliques à vérins et vérins double effet pour levage et positionnement contrôlés.":
    "Hydraulic power units and double-acting jacks for controlled lifting and positioning.",
  "Astra 8x6 et 6x4, Scania 6x4 et Volvo 6x4 pour les convois exceptionnels.":
    "Astra 8x6 and 6x4, Scania 6x4 and Volvo 6x4 tractors for abnormal-load convoys.",
  "Étude logistique": "Logistics study",
  "Coordination douanière": "Customs coordination",
  "Suivi des cargaisons": "Cargo tracking",
  "Préparation d'escale": "Port call preparation",
  "Consignation navire": "Ship agency",
  "Coordination portuaire": "Port coordination",
  "Suivi documentaire": "Document tracking",
  "Calculs de stabilité": "Stability calculations",
  "Autorisations de circulation": "Traffic permits",
  "Escorte technique": "Technical escort",
  "Plans de levage": "Lifting plans",
  "Livraison sur site": "On-site delivery",
  Conteneurs: "Containers",
  "Remorques conventionnelles": "Conventional trailers",
  "Porte-chars": "Low loaders",
  "Solutions Ro-Ro": "Ro-Ro solutions",
  "Navires Ro-Ro": "Ro-Ro vessels",
  "Navires breakbulk": "Breakbulk vessels",
  "Moyens portuaires": "Port equipment",
  "Zones de stockage": "Storage areas",
  "40 lignes THP/SL": "40 THP/SL axle lines",
  "Tracteurs lourds": "Heavy haul tractors",
  "Portiques SBL 1100 T et 1000 T": "SBL 1100 T and 1000 T gantries",
  "Skidding 400 T": "400 T skidding system",
  "Vérins 20 T à 100 T": "20 T to 100 T jacks",
  "Quais marteaux": "Heavy handling stools",
  "Transport exceptionnel de transformateur": "Special transformer transport",
  "Coordination portuaire d'un colis hors gabarit": "Port coordination for oversized cargo",
  "Préparation d'itinéraire pour convoi exceptionnel": "Route preparation for an abnormal-load convoy",
  "Montage et manutention d'un équipement industriel": "Industrial equipment installation and handling",
  "Transformateur transporté sur une remorque modulaire WHTL":
    "Transformer transported on a WHTL modular trailer",
  "Pourquoi le route survey décide la réussite d'un transport exceptionnel":
    "Why route surveys determine the success of abnormal transport",
  "Préparer les autorisations et arrêtés de circulation": "Preparing permits and traffic orders",
  "Calculs de stabilité et conception des lashing plans": "Stability calculations and lashing plan design",
  "Coordination portuaire des navires Ro-Ro et breakbulk": "Port coordination for Ro-Ro and breakbulk vessels",
  "Skidding: déplacer une charge industrielle en sécurité": "Skidding: moving an industrial load safely",
  "Coordonner Sonelgaz, chemins de fer, APC, hydraulique et télécommunications":
    "Coordinating utilities, railways, municipalities, water and telecommunications authorities",
};

const textSources = new WeakMap<Text, string>();
const attributeSources = new WeakMap<Element, Map<string, string>>();

function translated(source: string, language: Language) {
  return language === "en" ? en[source] ?? source : source;
}

function translateRoot(root: ParentNode, language: Language) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let node = walker.nextNode() as Text | null;

  while (node) {
    const parent = node.parentElement;
    if (
      parent &&
      !parent.closest("[data-no-translate]") &&
      !["SCRIPT", "STYLE", "TEXTAREA"].includes(parent.tagName)
    ) {
      const original = textSources.get(node) ?? node.nodeValue ?? "";
      textSources.set(node, original);
      const trimmed = original.trim();
      if (trimmed) {
        node.nodeValue = original.replace(trimmed, translated(trimmed, language));
      }
    }
    node = walker.nextNode() as Text | null;
  }

  root.querySelectorAll?.("[placeholder], [aria-label], [title], img[alt]").forEach((element) => {
    if (element.closest("[data-no-translate]")) return;
    const stored = attributeSources.get(element) ?? new Map<string, string>();
    ["placeholder", "aria-label", "title", "alt"].forEach((attribute) => {
      const value = element.getAttribute(attribute);
      if (value !== null && !stored.has(attribute)) stored.set(attribute, value);
      const original = stored.get(attribute);
      if (original) element.setAttribute(attribute, translated(original, language));
    });
    attributeSources.set(element, stored);
  });
}

export function useSiteLanguage(language: Language, disabled = false) {
  const languageRef = useRef(language);
  languageRef.current = language;

  useEffect(() => {
    document.documentElement.lang = language;
    document.title =
      language === "fr"
        ? "WHTL | Freight Forwarding & Consignation maritime"
        : "WHTL | Freight Forwarding & Ship Agency Services";
    const description = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (description) {
      description.content =
        language === "fr"
          ? "WHTL, freight forwarding, consignation maritime, transport exceptionnel et Heavy Lift en Algérie."
          : "WHTL provides freight forwarding, ship agency, abnormal transport and Heavy Lift services in Algeria.";
    }

    if (disabled) return;

    let applying = false;
    const apply = (root: ParentNode = document.body) => {
      applying = true;
      translateRoot(root, languageRef.current);
      applying = false;
    };

    apply();
    const observer = new MutationObserver((mutations) => {
      if (applying) return;
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.TEXT_NODE) {
            apply(node.parentNode ?? document.body);
          } else if (node instanceof Element) {
            apply(node);
          }
        });
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [disabled, language]);
}
