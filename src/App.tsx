import {
  ArrowRight,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Factory,
  Mail,
  Menu,
  MoveRight,
  Play,
  Search,
  ShieldCheck,
  Ship,
  TowerControl,
  Truck,
  X,
  Zap,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

type NavPage =
  | "home"
  | "solutions"
  | "case-studies"
  | "equipment"
  | "resources"
  | "about"
  | "contact"
  | "service"
  | "equipment-detail";

type SectorKey = "energy" | "maritime" | "infrastructure" | "industry";

type Sector = {
  key: SectorKey;
  label: string;
  eyebrow: string;
  icon: React.ElementType;
  image: string;
  links: string[];
  summary: string;
};

type Service = {
  slug: string;
  title: string;
  kicker: string;
  image: string;
  hero: string;
  intro: string;
  bullets: string[];
  equipment: string[];
};

type Equipment = {
  slug: string;
  title: string;
  category: string;
  image: string;
  capacity: string;
  body: string;
};

type MediaItem = {
  src: string;
  type: "image" | "video";
  label: string;
};

const mediaPath = (file: string) => `${import.meta.env.BASE_URL}media/whtl/${file}`;

const sectors: Sector[] = [
  {
    key: "energy",
    label: "Énergie",
    eyebrow: "Transformateurs, centrales, réseaux",
    icon: Factory,
    image: mediaPath("received_1386292979996984.jpeg"),
    links: ["Transport de transformateurs", "Montage industriel", "Livraison sur site"],
    summary:
      "Transport, levage et installation d'équipements lourds pour les projets énergétiques.",
  },
  {
    key: "maritime",
    label: "Maritime & ports",
    eyebrow: "Navires, Ro-Ro, breakbulk",
    icon: Ship,
    image: mediaPath("received_866480676022580.jpeg"),
    links: ["Consignation des navires", "Opérations portuaires", "Fret Heavy Lift"],
    summary:
      "Organisation des escales, coordination portuaire et suivi des cargaisons conventionnelles ou hors gabarit.",
  },
  {
    key: "infrastructure",
    label: "Infrastructure",
    eyebrow: "Routes, ouvrages, plateformes",
    icon: TowerControl,
    image: mediaPath("received_1198032315753716.jpeg"),
    links: ["Route survey", "Aménagement routier", "Renforcement d'ouvrages"],
    summary:
      "Préparation et sécurisation des itinéraires nécessaires au passage des convois exceptionnels.",
  },
  {
    key: "industry",
    label: "Industrie",
    eyebrow: "Usines, équipements, projets complexes",
    icon: Zap,
    image: mediaPath("received_1371596501494574.jpeg"),
    links: ["Manutention lourde", "Skidding", "Coordination de projet"],
    summary:
      "Des méthodes complètes, de l'étude technique à l'installation finale sur site.",
  },
];

const services: Service[] = [
  {
    slug: "freight-forwarding",
    title: "Freight Forwarding",
    kicker: "Transport multimodal",
    image: mediaPath("received_802329992847985.jpeg"),
    hero: mediaPath("received_866480676022580.jpeg"),
    intro:
      "Organisation du transport maritime, terrestre et multimodal, avec coordination logistique, douanière et suivi opérationnel des cargaisons.",
    bullets: ["Étude logistique", "Transport multimodal", "Coordination douanière", "Suivi des cargaisons"],
    equipment: ["Conteneurs", "Remorques conventionnelles", "Porte-chars", "Solutions Ro-Ro"],
  },
  {
    slug: "ship-agency",
    title: "Consignation maritime",
    kicker: "Ship Agency Services",
    image: mediaPath("received_866480676022580.jpeg"),
    hero: mediaPath("received_802329992847985.jpeg"),
    intro:
      "Gestion des opérations portuaires, consignation des navires et coordination de tous les intervenants pendant l'escale.",
    bullets: ["Préparation d'escale", "Consignation navire", "Coordination portuaire", "Suivi documentaire"],
    equipment: ["Navires Ro-Ro", "Navires breakbulk", "Moyens portuaires", "Zones de stockage"],
  },
  {
    slug: "special-transport",
    title: "Transport spécial",
    kicker: "Heavy Transport Engineering",
    image: mediaPath("received_1386292979996984.jpeg"),
    hero: mediaPath("received_1045389137822869.jpeg"),
    intro:
      "Études de transport, route survey, autorisations, aménagement des itinéraires et supervision complète des convois exceptionnels.",
    bullets: ["Route survey", "Calculs de stabilité", "Autorisations de circulation", "Escorte technique"],
    equipment: ["40 lignes THP/SL", "Remorques extensibles", "Tracteurs Heavy Haul", "Plaque tournante 250 T"],
  },
  {
    slug: "heavy-lift",
    title: "Heavy Lift & industrie",
    kicker: "Levage et manutention lourde",
    image: mediaPath("received_1371596501494574.jpeg"),
    hero: mediaPath("received_1356612209698063.jpeg"),
    intro:
      "Levage, manutention lourde, montage d'équipements industriels et transformateurs, skidding et distribution jusqu'au site final.",
    bullets: ["Plans de levage", "Montage industriel", "Skidding", "Livraison sur site"],
    equipment: ["Portiques SBL 1100 T et 1000 T", "Skidding 400 T", "Vérins 20 T à 100 T", "Quais marteaux"],
  },
];

const equipment: Equipment[] = [
  {
    slug: "thp-sl",
    title: "Remorques THP/SL",
    category: "Transport",
    image: mediaPath("received_1003047622117156.jpeg"),
    capacity: "40 lignes · 45 T par ligne",
    body: "Remorques modulaires hydrauliques configurables pour les colis lourds et hors gabarit.",
  },
  {
    slug: "extendable-trailers",
    title: "Remorques extensibles",
    category: "Transport",
    image: mediaPath("received_1386292979996984.jpeg"),
    capacity: "8 unités · 60 à 90 T · jusqu'à 34 m",
    body: "Remorques extra surbaissées pour les pièces longues, industrielles et exceptionnelles.",
  },
  {
    slug: "tramway-trailers",
    title: "Remorques tramway",
    category: "Transport",
    image: mediaPath("received_955162737508959.jpeg"),
    capacity: "2 semi-remorques hydrauliques",
    body: "Équipements spécialisés dédiés au transport sécurisé de tramways.",
  },
  {
    slug: "conventional-trailers",
    title: "Semi-remorques conventionnelles",
    category: "Transport",
    image: mediaPath("received_999301006187703.jpeg"),
    capacity: "5 porte-chars 54 T · 5 plateaux 30 T",
    body: "Une flotte conventionnelle pour le transport industriel et la distribution sur site.",
  },
  {
    slug: "transport-accessories",
    title: "Accessoires techniques",
    category: "Ingénierie",
    image: mediaPath("received_1444943581007746.jpeg"),
    capacity: "Plaque tournante 250 T",
    body: "Plateau visselle de 9 m, plateaux de 3 m et 6 m, et splites pour configurations à 3 files.",
  },
  {
    slug: "skidding",
    title: "Skidding & manutention",
    category: "Manutention",
    image: mediaPath("received_1331889581640544.jpeg"),
    capacity: "Skidding 400 T · turntable 100 T",
    body: "20 quais marteaux avec poutres et pieds d'éléphant, jusqu'à 100 T par kit.",
  },
  {
    slug: "sbl-gantries",
    title: "Portiques SBL",
    category: "Levage",
    image: mediaPath("received_1371596501494574.jpeg"),
    capacity: "SBL 1100 T et SBL 1000 T",
    body: "Portiques disponibles en partenariat avec SBL pour les opérations industrielles lourdes.",
  },
  {
    slug: "hydraulic-equipment",
    title: "Équipements hydrauliques",
    category: "Levage",
    image: mediaPath("received_1208302758027984.jpeg"),
    capacity: "2 centrales 700 bars · vérins 20 à 100 T",
    body: "Centrales hydrauliques à vérins et vérins double effet pour levage et positionnement contrôlés.",
  },
  {
    slug: "heavy-haul-tractors",
    title: "Tracteurs Heavy Haul",
    category: "Tracteurs",
    image: mediaPath("received_1394859562701361.jpeg"),
    capacity: "10 tracteurs · jusqu'à 250 PTRA",
    body: "Astra 8x6 et 6x4, Scania 6x4 et Volvo 6x4 pour les convois exceptionnels.",
  },
];

const cases = [
  {
    title: "Transport exceptionnel de transformateur",
    sector: "Énergie",
    image: mediaPath("Messenger_creation_1937362816978940.jpeg"),
  },
  {
    title: "Coordination portuaire d'un colis hors gabarit",
    sector: "Maritime",
    image: mediaPath("received_866480676022580.jpeg"),
  },
  {
    title: "Préparation d'itinéraire pour convoi exceptionnel",
    sector: "Infrastructure",
    image: mediaPath("received_1198032315753716.jpeg"),
  },
  {
    title: "Montage et manutention d'un équipement industriel",
    sector: "Industrie",
    image: mediaPath("received_1371596501494574.jpeg"),
  },
];

const resources = [
  "Pourquoi le route survey décide la réussite d'un transport exceptionnel",
  "Préparer les autorisations et arrêtés de circulation",
  "Calculs de stabilité et conception des lashing plans",
  "Coordination portuaire des navires Ro-Ro et breakbulk",
  "Skidding: déplacer une charge industrielle en sécurité",
  "Coordonner Sonelgaz, chemins de fer, APC, hydraulique et télécommunications",
];

const partners = [
  {
    title: "WHTL Service",
    label: "Filiale opérationnelle",
    body: "Transport conventionnel et exceptionnel, levage, manutention lourde, montage industriel, stockage et livraison sur site.",
  },
  {
    title: "Mamiabat",
    label: "Filiale technique",
    body: "Aménagement routier, renforcement des routes et ouvrages, études techniques et préparation des itinéraires.",
  },
  {
    title: "Partenaire maritime",
    label: "Heavy Lift & Ro-Ro",
    body: "Fret maritime de colis exceptionnels, navires Ro-Ro et breakbulk, avec coordination portuaire des projets industriels.",
  },
  {
    title: "CMN",
    label: "Transit & fret",
    body: "Fret conventionnel, conteneurs, transit local et international, formalités douanières et coordination import-export.",
  },
];

const authorities = [
  "Sonelgaz",
  "Chemins de fer",
  "APC",
  "Hydraulique",
  "PTT / Télécommunications",
  "Autorités locales et administratives",
];

const mediaLibrary: MediaItem[] = [
  ...[
    "Messenger_creation_1937362816978940.jpeg",
    "received_802329992847985.jpeg",
    "received_866480676022580.jpeg",
    "received_887420564401378.jpeg",
    "received_890155810071081.jpeg",
    "received_936903929268456.jpeg",
    "received_955162737508959.jpeg",
    "received_956251707447890.jpeg",
    "received_966870903022210.jpeg",
    "received_977450534914970.jpeg",
    "received_988411333817139.jpeg",
    "received_988487630841753.jpeg",
    "received_988493003968586.jpeg",
    "received_989742480481622.jpeg",
    "received_996973289743168.jpeg",
    "received_998725409750150.jpeg",
    "received_999301006187703.jpeg",
    "received_1000214875965913.jpeg",
    "received_1000858432538810.jpeg",
    "received_1003047622117156.jpeg",
    "received_1008281338413737.jpeg",
    "received_1010971521555953.jpeg",
    "received_1027466850223507.jpeg",
    "received_1044548101257624.jpeg",
    "received_1045389137822869.jpeg",
    "received_1073536042006820.jpeg",
    "received_1198032315753716.jpeg",
    "received_1208302758027984.jpeg",
    "received_1216452338212553.jpeg",
    "received_1266084618934500.jpeg",
    "received_1297286879157233.jpeg",
    "received_1323509056561372.jpeg",
    "received_1330716475154330.jpeg",
    "received_1331889581640544.jpeg",
    "received_1356612209698063.jpeg",
    "received_1363241306006412.jpeg",
    "received_1371596501494574.jpeg",
    "received_1386292979996984.jpeg",
    "received_1391580972780442.jpeg",
    "received_1394859562701361.jpeg",
    "received_1436136948389622.jpeg",
    "received_1444943581007746.jpeg",
    "received_1478619903572628.jpeg",
    "received_1479769170126303.jpeg",
  ].map((file, index) => ({
    src: mediaPath(file),
    type: "image" as const,
    label: `Opération terrain WHTL ${String(index + 1).padStart(2, "0")}`,
  })),
  ...[
    "Messenger_creation_1146001201340227.mp4",
    "Messenger_creation_1229799505801135.mp4",
    "Messenger_creation_1272455534966625.mp4",
    "Messenger_creation_2468311783684212.mp4",
    "Messenger_creation_3074525309411973.mp4",
    "Messenger_creation_3467957750034993.mp4",
  ].map((file, index) => ({
    src: mediaPath(file),
    type: "video" as const,
    label: `Vidéo opération WHTL ${String(index + 1).padStart(2, "0")}`,
  })),
];

function pathToPage(pathname: string): NavPage {
  if (pathname.startsWith("/services/")) return "service";
  if (pathname.startsWith("/equipment/") && pathname !== "/equipment") return "equipment-detail";
  if (pathname === "/how-we-help") return "solutions";
  if (pathname === "/case-studies") return "case-studies";
  if (pathname === "/equipment") return "equipment";
  if (pathname === "/resources") return "resources";
  if (pathname === "/about") return "about";
  if (pathname === "/contact") return "contact";
  return "home";
}

function useRoute() {
  const [pathname, setPathname] = useState(window.location.pathname);

  useEffect(() => {
    const update = () => setPathname(window.location.pathname);
    window.addEventListener("popstate", update);
    return () => window.removeEventListener("popstate", update);
  }, []);

  const navigate = (path: string) => {
    window.history.pushState({}, "", path);
    setPathname(path);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return { page: pathToPage(pathname), pathname, navigate };
}

function useScrollY() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const update = () => setScrollY(window.scrollY);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return scrollY;
}

function LinkButton({
  to,
  navigate,
  children,
  className,
}: {
  to: string;
  navigate: (path: string) => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <a
      className={className}
      href={to}
      onClick={(event) => {
        event.preventDefault();
        navigate(to);
      }}
    >
      {children}
    </a>
  );
}

function App() {
  const { page, pathname, navigate } = useRoute();
  const [menuOpen, setMenuOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const scrollY = useScrollY();
  const serviceSlug = pathname.split("/services/")[1];
  const equipmentSlug = pathname.split("/equipment/")[1];

  useEffect(() => {
    const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (canonical) {
      canonical.href = `https://whtl-dz.com${pathname === "/" ? "/" : pathname}`;
    }
  }, [pathname]);

  return (
    <div className="site-shell">
      <Header
        navigate={navigate}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        megaOpen={megaOpen}
        setMegaOpen={setMegaOpen}
        solid={scrollY > 36 || page !== "home"}
      />
      {megaOpen && <MegaMenu navigate={navigate} />}
      {menuOpen && <MobileMenu navigate={navigate} close={() => setMenuOpen(false)} />}

      <main>
        {page === "home" && <HomePage navigate={navigate} />}
        {page === "solutions" && <SolutionsPage navigate={navigate} />}
        {page === "case-studies" && <CaseStudiesPage navigate={navigate} />}
        {page === "equipment" && <EquipmentPage navigate={navigate} />}
        {page === "equipment-detail" && (
          <EquipmentDetailPage slug={equipmentSlug} navigate={navigate} />
        )}
        {page === "resources" && <ResourcesPage navigate={navigate} />}
        {page === "about" && <AboutPage navigate={navigate} />}
        {page === "contact" && <ContactPage />}
        {page === "service" && <ServicePage slug={serviceSlug} navigate={navigate} />}
      </main>

      <Footer navigate={navigate} />
    </div>
  );
}

function Header({
  navigate,
  menuOpen,
  setMenuOpen,
  megaOpen,
  setMegaOpen,
  solid,
}: {
  navigate: (path: string) => void;
  menuOpen: boolean;
  setMenuOpen: (value: boolean) => void;
  megaOpen: boolean;
  setMegaOpen: (value: boolean) => void;
  solid: boolean;
}) {
  return (
    <header className={`topbar ${solid ? "topbar--solid" : ""}`}>
      <LinkButton className="brand" to="/" navigate={navigate}>
        <span className="brand-mark">W</span>
        <span className="brand-name">WHTL</span>
      </LinkButton>

      <nav className="desktop-nav" aria-label="Navigation principale">
        <button className="nav-link nav-button" onClick={() => setMegaOpen(!megaOpen)}>
          Solutions
          <ChevronDown size={16} />
        </button>
        <LinkButton className="nav-link" to="/case-studies" navigate={navigate}>
          Etudes de cas
        </LinkButton>
        <LinkButton className="nav-link" to="/equipment" navigate={navigate}>
          Equipements
        </LinkButton>
        <LinkButton className="nav-link" to="/resources" navigate={navigate}>
          Ressources
        </LinkButton>
        <LinkButton className="nav-link" to="/about" navigate={navigate}>
          A propos
        </LinkButton>
      </nav>

      <div className="topbar-actions">
        <button className="language-button">FR</button>
        <LinkButton className="contact-button" to="/contact" navigate={navigate}>
          Contact
        </LinkButton>
        <button
          className="icon-button mobile-only"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Ouvrir le menu"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
    </header>
  );
}

function MegaMenu({ navigate }: { navigate: (path: string) => void }) {
  return (
    <div className="mega-menu">
      <div className="mega-grid">
        <div>
          <p className="section-kicker">Choisir un secteur</p>
          <h2>Solutions par industrie, service et equipement.</h2>
          <div className="mega-actions">
            {services.map((service) => (
              <LinkButton key={service.slug} to={`/services/${service.slug}`} navigate={navigate}>
                {service.title}
              </LinkButton>
            ))}
          </div>
        </div>
        {sectors.map((sector) => {
          const Icon = sector.icon;
          return (
            <LinkButton
              key={sector.key}
              className="mega-sector"
              to="/how-we-help"
              navigate={navigate}
            >
              <Icon size={22} />
              <span>
                <strong>{sector.label}</strong>
                <small>{sector.eyebrow}</small>
              </span>
            </LinkButton>
          );
        })}
      </div>
    </div>
  );
}

function MobileMenu({
  navigate,
  close,
}: {
  navigate: (path: string) => void;
  close: () => void;
}) {
  const go = (path: string) => {
    close();
    navigate(path);
  };

  return (
    <nav className="mobile-menu" aria-label="Menu mobile">
      <button onClick={() => go("/how-we-help")}>Solutions</button>
      <button onClick={() => go("/case-studies")}>Etudes de cas</button>
      <button onClick={() => go("/equipment")}>Equipements</button>
      <button onClick={() => go("/resources")}>Ressources</button>
      <button onClick={() => go("/about")}>A propos</button>
      <button onClick={() => go("/contact")}>Contact</button>
    </nav>
  );
}

function HomePage({ navigate }: { navigate: (path: string) => void }) {
  const [activeSector, setActiveSector] = useState<SectorKey>("energy");
  const active = useMemo(
    () => sectors.find((sector) => sector.key === activeSector) ?? sectors[0],
    [activeSector],
  );

  return (
    <>
      <section className="hero hero--home">
        <div className="hero-media" />
        <div className="hero-scrim" />
        <div className="hero-content">
          <p className="hero-kicker">Freight Forwarding & Ship Agency Services</p>
          <h1>La logistique des projets les plus complexes.</h1>
          <p className="hero-copy">
            WHTL gère vos opérations logistiques, portuaires et de transport exceptionnel en
            Algérie, depuis l'étude technique jusqu'à la réalisation sur le terrain.
          </p>
          <div className="hero-actions">
            <LinkButton className="primary-action" to="/how-we-help" navigate={navigate}>
              Explorer
              <ArrowRight size={18} />
            </LinkButton>
            <button className="play-action">
              <Play size={18} fill="currentColor" />
              Voir l'approche
            </button>
          </div>
        </div>
        <div className="hero-metrics">
          <span>
            <strong>40</strong>
            lignes THP/SL
          </span>
          <span>
            <strong>45 T</strong>
            par ligne d'essieux
          </span>
          <span>
            <strong>400 T</strong>
            système de skidding
          </span>
        </div>
        <a className="scroll-cue" href="#sectors">
          Scroll
        </a>
      </section>

      <section className="sector-band" id="sectors">
        <SectionTitle kicker="Nos domaines" title="Une expertise coordonnée sur terre, au port et sur site." />
        <div className="sector-layout">
          <div className="sector-tabs">
            {sectors.map((sector) => {
              const Icon = sector.icon;
              return (
                <button
                  key={sector.key}
                  className={`sector-tab ${activeSector === sector.key ? "is-active" : ""}`}
                  onClick={() => setActiveSector(sector.key)}
                >
                  <Icon size={23} />
                  <span>{sector.label}</span>
                </button>
              );
            })}
          </div>
          <article className="sector-detail photo-panel">
            <img src={active.image} alt={active.label} />
            <div>
              <p>{active.eyebrow}</p>
              <h3>{active.label}</h3>
              <span>{active.summary}</span>
              <div className="link-list">
                {active.links.map((link) => (
                  <LinkButton key={link} to="/how-we-help" navigate={navigate}>
                    {link}
                    <ArrowRight size={16} />
                  </LinkButton>
                ))}
              </div>
            </div>
          </article>
        </div>
      </section>

      <ServiceGrid navigate={navigate} />
      <EquipmentPreview navigate={navigate} />
      <FleetFactsBlock navigate={navigate} />
      <AuthoritiesBlock />
      <PartnersBlock />
      <TalkToUsBlock navigate={navigate} />
      <UsedEquipmentBlock navigate={navigate} />
      <MediaGallery />
      <CasesPreview navigate={navigate} />
      <TransitionBlock navigate={navigate} />
    </>
  );
}

function PageHero({
  kicker,
  title,
  body,
  image,
}: {
  kicker: string;
  title: string;
  body: string;
  image: string;
}) {
  return (
    <section className="page-hero">
      <img src={image} alt="" />
      <div className="page-hero__overlay" />
      <div className="page-hero__content">
        <p className="hero-kicker">{kicker}</p>
        <h1>{title}</h1>
        <p>{body}</p>
      </div>
    </section>
  );
}

function SectionTitle({ kicker, title }: { kicker: string; title: string }) {
  return (
    <div className="section-heading section-heading--wide">
      <p className="section-kicker">{kicker}</p>
      <h2>{title}</h2>
    </div>
  );
}

function ServiceGrid({ navigate }: { navigate: (path: string) => void }) {
  return (
    <section className="services">
      <SectionTitle kicker="Services principaux" title="De l'organisation logistique à l'exécution terrain." />
      <div className="service-grid image-grid">
        {services.map((service) => (
          <article className="service-card image-card" key={service.slug}>
            <img src={service.image} alt={service.title} />
            <div>
              <p>{service.kicker}</p>
              <h3>{service.title}</h3>
              <span>{service.intro}</span>
              <LinkButton to={`/services/${service.slug}`} navigate={navigate}>
                Voir la page
                <ArrowRight size={16} />
              </LinkButton>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function EquipmentPreview({ navigate }: { navigate: (path: string) => void }) {
  return (
    <section className="split-showcase">
      <div>
        <p className="section-kicker">Equipements</p>
        <h2>Une flotte dédiée au Heavy Transport & Heavy Lifting.</h2>
        <p>
          Remorques THP/SL, tracteurs Heavy Haul, portiques SBL, vérins hydrauliques et systèmes
          de skidding pour les opérations les plus complexes.
        </p>
        <LinkButton className="primary-action" to="/equipment" navigate={navigate}>
          Voir les equipements
          <ArrowRight size={18} />
        </LinkButton>
      </div>
      <img
        src={mediaPath("received_1386292979996984.jpeg")}
        alt="Transformateur transporté sur une remorque modulaire WHTL"
      />
    </section>
  );
}

function FleetFactsBlock({ navigate }: { navigate: (path: string) => void }) {
  const facts = [
    { value: "40", label: "lignes modulaires THP/SL", detail: "45 tonnes par ligne d'essieux" },
    { value: "8", label: "remorques extensibles", detail: "60 à 90 T, extension jusqu'à 34 m" },
    { value: "400 T", label: "système de skidding", detail: "avec turntable de 100 T" },
    { value: "1100 T", label: "portique SBL", detail: "complété par un portique SBL 1000 T" },
  ];

  return (
    <section className="fleet-facts">
      <div className="fleet-facts__heading">
        <p className="section-kicker">Capacités opérationnelles</p>
        <h2>Des moyens dimensionnés pour les projets hors norme.</h2>
        <LinkButton className="text-action" to="/equipment" navigate={navigate}>
          Découvrir toute la flotte
          <ArrowRight size={18} />
        </LinkButton>
      </div>
      <div className="fleet-facts__grid">
        {facts.map((fact) => (
          <article key={fact.label}>
            <strong>{fact.value}</strong>
            <h3>{fact.label}</h3>
            <p>{fact.detail}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function AuthoritiesBlock() {
  return (
    <section className="authorities-block">
      <div className="authorities-copy">
        <p className="section-kicker">Coordination institutionnelle</p>
        <h2>Un seul pilote pour tous les intervenants.</h2>
        <p>
          WHTL assure les démarches, autorisations et coordinations nécessaires au passage des
          convois exceptionnels et à la réalisation des opérations sur le terrain.
        </p>
      </div>
      <div className="authority-list">
        {authorities.map((authority, index) => (
          <div key={authority}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <strong>{authority}</strong>
          </div>
        ))}
      </div>
    </section>
  );
}

function PartnersBlock() {
  return (
    <section className="partners-block">
      <SectionTitle
        kicker="Filiales & partenaires"
        title="Des compétences complémentaires réunies autour de chaque projet."
      />
      <div className="partner-grid">
        {partners.map((partner) => (
          <article className="partner-card" key={partner.title}>
            <span>{partner.label}</span>
            <h2>{partner.title}</h2>
            <p>{partner.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function TalkToUsBlock({ navigate }: { navigate: (path: string) => void }) {
  const options = [
    {
      title: "Un nouveau projet ou un projet en cours",
      body: "Dimension, poids, acces, planning: on t'aide a cadrer la methode.",
      to: "/contact",
    },
    {
      title: "Une demande generale",
      body: "Question commerciale, disponibilite, documentation ou rendez-vous.",
      to: "/contact",
    },
    {
      title: "Trouver l'agence la plus proche",
      body: "Equipe locale, zone d'intervention et point de contact projet.",
      to: "/about",
    },
    {
      title: "Travailler avec WHTL",
      body: "Opérations, ingénierie, coordination portuaire et supervision terrain.",
      to: "/about",
    },
  ];

  return (
    <section className="talk-block">
      <div className="talk-heading">
        <p className="section-kicker">Parlons aujourd'hui</p>
        <h2>De quoi avez-vous besoin ?</h2>
      </div>
      <div className="talk-grid">
        {options.map((option) => (
          <LinkButton className="talk-card" key={option.title} to={option.to} navigate={navigate}>
            <span>
              <strong>{option.title}</strong>
              <small>{option.body}</small>
            </span>
            <ArrowRight size={22} />
          </LinkButton>
        ))}
      </div>
    </section>
  );
}

function UsedEquipmentBlock({ navigate }: { navigate: (path: string) => void }) {
  const collage = [
    equipment[1],
    equipment[2],
    equipment[0],
    equipment[5],
  ];

  return (
    <section className="used-equipment">
      <div className="used-copy">
        <p className="section-kicker">Notre flotte</p>
        <h2>Vous cherchez une solution de transport ou de levage ?</h2>
        <p>
          Notre groupe mobilise des remorques modulaires, des tracteurs Heavy Haul, des portiques,
          des vérins et des accessoires spécialisés.
        </p>
        <p>
          Chaque configuration est étudiée selon la charge, l'itinéraire, les contraintes
          portuaires et les conditions d'installation sur site.
        </p>
        <LinkButton className="primary-action" to="/equipment" navigate={navigate}>
          Voir les equipements
          <ArrowRight size={18} />
        </LinkButton>
      </div>
      <div className="used-collage">
        {collage.map((item) => (
          <img key={item.slug} src={item.image} alt={item.title} />
        ))}
      </div>
    </section>
  );
}

function MediaGallery() {
  const railRef = useRef<HTMLDivElement>(null);

  const scrollRail = (direction: -1 | 1) => {
    railRef.current?.scrollBy({
      left: direction * Math.min(window.innerWidth * 0.82, 980),
      behavior: "smooth",
    });
  };

  return (
    <section className="media-library">
      <div className="media-library__heading">
        <div>
          <p className="section-kicker">WHTL sur le terrain</p>
          <h2>Photos et vidéos de nos opérations.</h2>
        </div>
        <div className="media-controls" aria-label="Contrôles de la galerie">
          <button onClick={() => scrollRail(-1)} aria-label="Voir les médias précédents">
            <ChevronLeft size={24} />
          </button>
          <button onClick={() => scrollRail(1)} aria-label="Voir les médias suivants">
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
      <div className="media-rail" ref={railRef}>
        {mediaLibrary.map((item, index) => (
          <figure className="media-slide" key={item.src}>
            {item.type === "video" ? (
              <video
                controls
                playsInline
                preload="metadata"
                poster={mediaPath("received_1386292979996984.jpeg")}
              >
                <source src={item.src} type="video/mp4" />
              </video>
            ) : (
              <img src={item.src} alt={item.label} loading={index > 3 ? "lazy" : "eager"} />
            )}
            <figcaption>
              <span>{item.type === "video" ? "Vidéo" : "Photo"}</span>
              <strong>{item.label}</strong>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

function CasesPreview({ navigate }: { navigate: (path: string) => void }) {
  return (
    <section className="projects">
      <SectionTitle kicker="Etudes de cas" title="Operations recentes, presentees en cartes visuelles." />
      <div className="case-grid">
        {cases.slice(0, 3).map((item) => (
          <article className="case-card" key={item.title}>
            <img src={item.image} alt={item.title} />
            <div>
              <span>{item.sector}</span>
              <h3>{item.title}</h3>
            </div>
          </article>
        ))}
      </div>
      <LinkButton className="text-action" to="/case-studies" navigate={navigate}>
        Tous les projets
        <ArrowRight size={18} />
      </LinkButton>
    </section>
  );
}

function TransitionBlock({ navigate }: { navigate: (path: string) => void }) {
  return (
    <section className="transition">
      <div>
        <p className="section-kicker">Transition industrielle</p>
        <h2>Faire avancer les grands projets sans ralentir le terrain.</h2>
      </div>
      <p>
        Nos equipes combinent calculs d'ingenierie, simulations d'itineraire, planning de levage et
        execution chantier pour reduire les risques et garder le projet en mouvement.
      </p>
      <LinkButton className="text-action" to="/contact" navigate={navigate}>
        Construire la methode
        <ArrowRight size={18} />
      </LinkButton>
    </section>
  );
}

function SolutionsPage({ navigate }: { navigate: (path: string) => void }) {
  return (
    <>
      <PageHero
        kicker="Solutions"
        title="Logistique de projet intégrée"
        body="WHTL coordonne les études, les autorisations, le transport, les opérations portuaires et l'exécution sur site."
        image={mediaPath("received_1386292979996984.jpeg")}
      />
      <section className="listing-section">
        <div className="sector-card-grid">
          {sectors.map((sector) => (
            <article className="sector-card" key={sector.key}>
              <img src={sector.image} alt={sector.label} />
              <div>
                <p>{sector.eyebrow}</p>
                <h2>{sector.label}</h2>
                <span>{sector.summary}</span>
                {sector.links.map((link) => (
                  <LinkButton key={link} to="/contact" navigate={navigate}>
                    {link}
                    <MoveRight size={16} />
                  </LinkButton>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>
      <ServiceGrid navigate={navigate} />
    </>
  );
}

function ServicePage({
  slug,
  navigate,
}: {
  slug: string;
  navigate: (path: string) => void;
}) {
  const service = services.find((item) => item.slug === slug) ?? services[0];

  return (
    <>
      <PageHero
        kicker={service.kicker}
        title={service.title}
        body={service.intro}
        image={service.hero}
      />
      <section className="detail-layout">
        <aside>
          <p className="section-kicker">Services principaux</p>
          {services.map((item) => (
            <LinkButton
              key={item.slug}
              className={item.slug === service.slug ? "side-link is-active" : "side-link"}
              to={`/services/${item.slug}`}
              navigate={navigate}
            >
              {item.title}
            </LinkButton>
          ))}
        </aside>
        <article className="detail-body">
          <h2>De l'ingénierie à l'exécution</h2>
          <p>{service.intro}</p>
          <div className="process-grid">
            {service.bullets.map((bullet, index) => (
              <div key={bullet}>
                <strong>{String(index + 1).padStart(2, "0")}</strong>
                <span>{bullet}</span>
              </div>
            ))}
          </div>
          <h3>Équipements et moyens mobilisés</h3>
          <div className="tag-grid">
            {service.equipment.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </article>
      </section>
      <EquipmentPreview navigate={navigate} />
    </>
  );
}

function EquipmentPage({ navigate }: { navigate: (path: string) => void }) {
  const [category, setCategory] = useState("Tous");
  const categories = ["Tous", ...Array.from(new Set(equipment.map((item) => item.category)))];
  const filtered = category === "Tous" ? equipment : equipment.filter((item) => item.category === category);

  return (
    <>
      <PageHero
        kicker="Equipements"
        title="Flotte et équipements"
        body="Une flotte spécialisée pour le transport exceptionnel, la manutention lourde et le montage industriel."
        image={mediaPath("received_1003047622117156.jpeg")}
      />
      <section className="listing-section">
        <div className="filter-row">
          {categories.map((item) => (
            <button
              key={item}
              className={category === item ? "filter-pill is-active" : "filter-pill"}
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>
        <div className="equipment-grid">
          {filtered.map((item) => (
            <article className="equipment-card" key={item.slug}>
              <img src={item.image} alt={item.title} />
              <div>
                <span>{item.category}</span>
                <h2>{item.title}</h2>
                <p>{item.capacity}</p>
                <LinkButton to={`/equipment/${item.slug}`} navigate={navigate}>
                  Voir le detail
                  <ArrowRight size={16} />
                </LinkButton>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

function EquipmentDetailPage({
  slug,
  navigate,
}: {
  slug: string;
  navigate: (path: string) => void;
}) {
  const item = equipment.find((entry) => entry.slug === slug) ?? equipment[0];

  return (
    <>
      <PageHero kicker={item.category} title={item.title} body={item.body} image={item.image} />
      <section className="detail-layout">
        <aside>
          <p className="section-kicker">Equipements</p>
          {equipment.map((entry) => (
            <LinkButton
              key={entry.slug}
              className={entry.slug === item.slug ? "side-link is-active" : "side-link"}
              to={`/equipment/${entry.slug}`}
              navigate={navigate}
            >
              {entry.title}
            </LinkButton>
          ))}
        </aside>
        <article className="detail-body">
          <h2>{item.capacity}</h2>
          <p>{item.body}</p>
          <div className="process-grid">
            <div>
              <strong>01</strong>
              <span>Selection technique selon charge, portee, sol et contraintes d'acces.</span>
            </div>
            <div>
              <strong>02</strong>
              <span>Preparation transport, mobilisation, assemblage et verification HSE.</span>
            </div>
            <div>
              <strong>03</strong>
              <span>Execution controlee avec superviseur, riggers et instrumentation.</span>
            </div>
          </div>
        </article>
      </section>
    </>
  );
}

function CaseStudiesPage({ navigate }: { navigate: (path: string) => void }) {
  return (
    <>
      <PageHero
        kicker="Etudes de cas"
        title="References projet"
        body="Cartes detaillees avec grande image, secteur, probleme, methode et appel contact."
        image={mediaPath("Messenger_creation_1937362816978940.jpeg")}
      />
      <section className="listing-section">
        <div className="case-grid case-grid--large">
          {cases.map((item) => (
            <article className="case-card" key={item.title}>
              <img src={item.image} alt={item.title} />
              <div>
                <span>{item.sector}</span>
                <h3>{item.title}</h3>
                <p>Étude, préparation, autorisations, mobilisation des équipements et supervision opérationnelle.</p>
                <LinkButton to="/contact" navigate={navigate}>
                  Demander une methode similaire
                  <ArrowRight size={16} />
                </LinkButton>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

function ResourcesPage({ navigate }: { navigate: (path: string) => void }) {
  return (
    <>
      <PageHero
        kicker="Ressources"
        title="Expertise et méthodes"
        body="Notes techniques sur le transport exceptionnel, la consignation maritime et l'ingénierie Heavy Lift."
        image={mediaPath("received_1444943581007746.jpeg")}
      />
      <section className="listing-section">
        <div className="resource-toolbar">
          <Search size={20} />
          <span>Articles, methodes, videos et notes techniques</span>
        </div>
        <div className="resource-grid">
          {resources.map((title, index) => (
            <article className="resource-card" key={title}>
              <img src={cases[index % cases.length].image} alt={title} />
              <div>
                <span>{index % 2 === 0 ? "Article" : "A lire"}</span>
                <h2>{title}</h2>
                <LinkButton to="/contact" navigate={navigate}>
                  Lire / demander
                  <ArrowRight size={16} />
                </LinkButton>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

function AboutPage({ navigate }: { navigate: (path: string) => void }) {
  return (
    <>
      <PageHero
        kicker="A propos"
        title="Un groupe logistique ancré sur le terrain."
        body="WHTL accompagne les projets industriels complexes grâce à ses équipes, ses filiales et son réseau de partenaires."
        image={mediaPath("received_1371596501494574.jpeg")}
      />
      <ServiceGrid navigate={navigate} />
      <PartnersBlock />
      <AuthoritiesBlock />
      <section className="values-band">
        {["Fiabilité", "Sécurité", "Coordination"].map((item) => (
          <article key={item}>
            <ShieldCheck size={28} />
            <h2>{item}</h2>
            <p>Expertise terrain, préparation technique, transparence client et maîtrise opérationnelle.</p>
          </article>
        ))}
      </section>
    </>
  );
}

function ContactPage() {
  return (
    <>
      <PageHero
        kicker="Contact"
        title="Parlons de votre prochain projet."
        body="Décrivez votre cargaison, votre escale, votre itinéraire ou votre besoin de transport et de manutention."
        image={mediaPath("received_1478619903572628.jpeg")}
      />
      <section className="contact-page">
        <form>
          <label>
            Nom
            <input placeholder="Votre nom" />
          </label>
          <label>
            Email
            <input placeholder="email@entreprise.com" type="email" />
          </label>
          <label>
            Type de service
            <select>
              {services.map((service) => (
                <option key={service.slug}>{service.title}</option>
              ))}
            </select>
          </label>
          <label>
            Message
            <textarea placeholder="Charge, dimensions, ville, delai..." />
          </label>
          <button className="primary-action primary-action--dark" type="button">
            Envoyer la demande
            <Mail size={18} />
          </button>
        </form>
        <div className="contact-panel">
          <p className="section-kicker">Votre partenaire logistique</p>
          <h2>Équipe projet WHTL</h2>
          <span>Coordination en Algérie · Projets nationaux et internationaux</span>
        </div>
      </section>
    </>
  );
}

function Footer({ navigate }: { navigate: (path: string) => void }) {
  return (
    <footer className="footer">
      <div className="footer-brand">
        <span className="brand-mark">W</span>
        <strong>WHTL</strong>
        <p>Freight forwarding, consignation maritime, transport exceptionnel et Heavy Lift.</p>
      </div>
      <div className="footer-columns">
        <div>
          <h3>Solutions</h3>
          <LinkButton to="/how-we-help" navigate={navigate}>
            Solutions
          </LinkButton>
          <LinkButton to="/equipment" navigate={navigate}>
            Equipements
          </LinkButton>
          <LinkButton to="/case-studies" navigate={navigate}>
            Etudes de cas
          </LinkButton>
        </div>
        <div>
          <h3>Services principaux</h3>
          {services.map((service) => (
            <LinkButton key={service.slug} to={`/services/${service.slug}`} navigate={navigate}>
              {service.title}
            </LinkButton>
          ))}
        </div>
        <div>
          <h3>Groupe</h3>
          <LinkButton to="/about" navigate={navigate}>
            A propos
          </LinkButton>
          <LinkButton to="/resources" navigate={navigate}>
            Ressources
          </LinkButton>
          <LinkButton to="/contact" navigate={navigate}>
            Contact
          </LinkButton>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 WHTL</span>
        <span>Developed by SITEMAGIQUE</span>
      </div>
    </footer>
  );
}

export default App;
