import type { Lang } from "./content";

export interface Dict {
  nav: { about: string; projects: string; langs: string; services: string; contact: string };
  hero: { eyebrow: string; hiPre: string; role: string; tagline: string; cta1: string; cta2: string; catcap: string; scroll: string };
  about: { tag: string; title: string; p1: string; p2: string; facts: { k: string; v: string }[] };
  langs: { tag: string; title: string; sub: string; cats: { c1: string; c2: string; c3: string; c4: string } };
  services: { tag: string; title: string; sub: string; items: { title: string; desc: string }[] };
  projects: { tag: string; title: string; sub: string; featuredLabel: string; viewLabel: string; descs: string[] };
  contact: { tag: string; title: string; intro: string; robotKicker: string; robotTitle: string; robotDesc: string };
  footer: { made: string; and: string; catcredit: string };
}

export const I18N: Record<Lang, Dict> = {
  es: {
    nav: { about: "Sobre mí", projects: "Proyectos", langs: "Stack", services: "Servicios", contact: "Contacto" },
    hero: {
      eyebrow: "Lima, Perú · Disponible para proyectos",
      hiPre: "Hola, soy ",
      role: "Ingeniero de Software · Backend & Full-Stack",
      tagline: "Construyo productos SaaS con arquitectura limpia — Spring Boot, Angular y FastAPI — desde Lima para toda LATAM.",
      cta1: "Ver proyectos", cta2: "Contáctame",
      catcap: "psst… mira al gato. A veces se aburre, se baja de la laptop y se va a dar una vuelta.",
      scroll: "scroll",
    },
    about: {
      tag: "Sobre mí",
      title: "Ingeniería con criterio, no solo código",
      p1: "Soy estudiante de Ingeniería de Software en la UPC (Lima, Perú) y desarrollador freelance. Diseño y construyo productos SaaS aplicando DDD, Clean Architecture y principios SOLID sobre un monolito modular.",
      p2: "Mi terreno favorito es el backend robusto — Spring Boot / Java 21 y FastAPI — conectado a frontends modernos en Angular 21 y Flutter. Le tengo cariño especial a los gráficos 3D con Three.js y a la matemática financiera aplicada al mercado peruano (SUNAT, SBS, valorización de bonos).",
      facts: [{ k: "Ubicación", v: "Lima, Perú" }, { k: "Enfoque", v: "Backend & Full-Stack + IA" }, { k: "Arquitectura", v: "DDD · Clean · SOLID" }],
    },
    langs: {
      tag: "Stack", title: "Lenguajes y herramientas",
      sub: "Mi stack del día a día — del backend fuertemente tipado a la UI móvil.",
      cats: { c1: "Lenguajes", c2: "Frameworks & runtimes", c3: "Bases de datos", c4: "Herramientas" },
    },
    services: {
      tag: "Servicios", title: "En qué puedo ayudarte",
      sub: "Del backend a la IA, construyo el producto completo — no solo una parte.",
      items: [
        { title: "Backend robusto", desc: "APIs escalables con Spring Boot / Java 21 y FastAPI: seguras, testeadas y listas para producción." },
        { title: "Aplicaciones full-stack", desc: "Productos de punta a punta con Angular y Flutter sobre una base de datos bien modelada." },
        { title: "Arquitectura de software", desc: "Diseño con DDD, Clean Architecture y SOLID sobre monolitos modulares que crecen sin dolor." },
        { title: "Integración de IA", desc: "Funciones inteligentes con Claude API: análisis, extracción de documentos y automatización real." },
      ],
    },
    projects: {
      tag: "Proyectos", title: "Trabajo seleccionado",
      sub: "Una selección de productos y prototipos, del backend al IoT.",
      featuredLabel: "Destacado", viewLabel: "Ver proyecto",
      descs: [
        "Aplicación web y mobile para conectar recuerdos con tu pareja.",
        "Proyecto web experimental con una experiencia visual interactiva en base a pixel art.",
        "Herramienta para crear y visualizar diagramas de arquitectura.",
        "Extractor inteligente de documentos con reglas SUNAT (RUC módulo-11, IGV 18%), validado con facturas reales.",
        "Motor de amortización francesa con TCEA/TIR vía Newton-Raphson, ajustado a las reglas del mercado peruano.",
        "Visualización interactiva de un ecosistema de commits.",
        "Aplicación web para centralizar el seguimiento de bodas y visualizar el avance de su planificación.",
        "Aplicación de Retrieval-Augmented Generation para consultar documentos con respuestas basadas en contexto relevante.",
      ],
    },
    contact: {
      tag: "Contacto", title: "Trabajemos juntos",
      intro: "¿Tienes una idea de producto o un proyecto que necesita arquitectura seria? Escríbeme y conversamos. Respondo rápido.",
      robotKicker: "Hablemos",
      robotTitle: "¿Construimos algo juntos?",
      robotDesc: "Escríbeme por el canal que prefieras. Traigo tus ideas a la vida con backend sólido, buen diseño y un toque de 3D.",
    },
    footer: { made: "Hecho con", and: "y", catcredit: "Gato 3D: “Toon Cat FREE” de" },
  },
  en: {
    nav: { about: "About", projects: "Projects", langs: "Stack", services: "Services", contact: "Contact" },
    hero: {
      eyebrow: "Lima, Peru · Available for projects",
      hiPre: "Hi, I'm ",
      role: "Software Engineer · Backend & Full-Stack",
      tagline: "I build SaaS products with clean architecture — Spring Boot, Angular and FastAPI — from Lima for all of LATAM.",
      cta1: "View projects", cta2: "Get in touch",
      catcap: "psst… watch the cat. Sometimes it gets bored, hops off the laptop and wanders off.",
      scroll: "scroll",
    },
    about: {
      tag: "About",
      title: "Engineering with judgment, not just code",
      p1: "I'm a Software Engineering student at UPC (Lima, Peru) and a freelance developer. I design and build SaaS products applying DDD, Clean Architecture and SOLID principles on a modular monolith.",
      p2: "My favorite ground is the robust backend — Spring Boot / Java 21 and FastAPI — wired to modern frontends in Angular 21 and Flutter. I have a soft spot for 3D graphics with Three.js and financial math for the Peruvian market (SUNAT, SBS, bond valuation).",
      facts: [{ k: "Location", v: "Lima, Peru" }, { k: "Focus", v: "Backend & Full-Stack + AI" }, { k: "Architecture", v: "DDD · Clean · SOLID" }],
    },
    langs: {
      tag: "Stack", title: "Languages & tools",
      sub: "My day-to-day stack — from strongly-typed backend to mobile UI.",
      cats: { c1: "Languages", c2: "Frameworks & runtimes", c3: "Databases", c4: "Tools" },
    },
    services: {
      tag: "Services", title: "How I can help",
      sub: "From backend to AI, I build the whole product — not just one slice.",
      items: [
        { title: "Robust backend", desc: "Scalable APIs with Spring Boot / Java 21 and FastAPI: secure, tested and production-ready." },
        { title: "Full-stack apps", desc: "End-to-end products with Angular and Flutter on a well-modeled database." },
        { title: "Software architecture", desc: "Design with DDD, Clean Architecture and SOLID on modular monoliths that grow painlessly." },
        { title: "AI integration", desc: "Smart features with the Claude API: analysis, document extraction and real automation." },
      ],
    },
    projects: {
      tag: "Projects", title: "Selected work",
      sub: "A selection of products and prototypes, from backend to IoT.",
      featuredLabel: "Featured", viewLabel: "View project",
      descs: [
        "Web and mobile application for connecting memories with your partner.",
        "Experimental web project with an interactive visual experience based on pixel art.",
        "A tool for creating and visualizing software architecture diagrams.",
        "Intelligent document extractor with SUNAT rules (RUC mod-11, 18% IGV), validated on real invoices.",
        "French amortization engine with TCEA/IRR via Newton-Raphson, adapted to Peruvian market rules.",
        "Interactive visualization of a commit ecosystem.",
        "Web application for centralizing wedding tracking and visualizing planning progress.",
        "Retrieval-Augmented Generation application for querying documents with context-grounded answers.",
      ],
    },
    contact: {
      tag: "Contact", title: "Let's work together",
      intro: "Got a product idea or a project that needs serious architecture? Drop me a line and let's talk. I reply fast.",
      robotKicker: "Say hi",
      robotTitle: "Shall we build something?",
      robotDesc: "Reach out on whichever channel you like. I bring ideas to life with solid backend, good design and a touch of 3D.",
    },
    footer: { made: "Made with", and: "and", catcredit: "3D cat: “Toon Cat FREE” by" },
  },
};
