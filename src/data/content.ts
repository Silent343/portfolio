export type Lang = "es" | "en";

export const CONFIG = {
  github: "https://github.com/Silent343",
  email: "gabrielfgs2004@gmail.com",
  linkedin: "https://linkedin.com/in/gabriel-gordon-salas-358020386",
};

export const DEVICON = "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/";

// Spline robot scene from the integration prompt
export const SPLINE_SCENE = "https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode";

export const PROJECTS = [
  { name: "Amora", tags: ["Spring Boot", "Three.js", "DDD"] },
  { name: "Guardian", tags: ["Spring Boot", "WebSocket", "Angular"] },
  { name: "FinancePE", tags: ["Java", "Finanzas", "Newton-Raphson"] },
  { name: "DocFlow", tags: ["FastAPI", "IA", "SUNAT"] },
  { name: "AuditFlow", tags: ["Spring Boot", "Claude API", "Angular"] },
  { name: "MineGuard", tags: ["ESP32", "FreeRTOS", "IoT"] },
  { name: "PixelRoom", tags: ["WebSocket", "STOMP", "Angular"] },
  { name: "SmartDrive", tags: ["Spring Boot", "Angular", "IA"] },
];

export const TOOLGROUPS: { cat: "c1" | "c2" | "c3" | "c4"; items: [string, string, boolean?][] }[] = [
  { cat: "c1", items: [["HTML5","html5/html5-original.svg"],["CSS3","css3/css3-original.svg"],["JavaScript","javascript/javascript-original.svg"],["TypeScript","typescript/typescript-original.svg"],["Python","python/python-original.svg"],["C++","cplusplus/cplusplus-original.svg"]] },
  { cat: "c2", items: [["Node.js","nodejs/nodejs-original.svg"],["Angular","angular/angular-original.svg"],["Vue","vuejs/vuejs-original.svg"],["React","react/react-original.svg"],["Flutter","flutter/flutter-original.svg"],[".NET","dot-net/dot-net-original.svg"],["Spring","spring/spring-original.svg"]] },
  { cat: "c3", items: [["MongoDB","mongodb/mongodb-original.svg"],["PostgreSQL","postgresql/postgresql-original.svg"],["SQLite","sqlite/sqlite-original.svg"]] },
  { cat: "c4", items: [["Git","git/git-original.svg"],["GitHub","github/github-original.svg",true],["Figma","figma/figma-original.svg"],["Firebase","firebase/firebase-plain.svg"],["Windows","windows8/windows8-original.svg"],["VS Code","vscode/vscode-original.svg"],["Visual Studio","visualstudio/visualstudio-plain.svg"]] },
];

export const PALETTES: Record<string, Record<string, string>> = {
  "Charcoal + Emerald": { "--accent":"#10b981","--accent2":"#5eead4","--on-accent":"#05221a","--glow-a":"rgba(16,185,129,.30)","--glow-b":"rgba(16,185,129,.45)","--focus":"rgba(16,185,129,.28)","--accent-border":"rgba(16,185,129,.38)","--accent2-border":"rgba(94,234,212,.4)","--tint2":"rgba(94,234,212,.07)","--bg-glow1":"rgba(16,185,129,.10)","--bg-glow2":"rgba(94,234,212,.07)" },
  "Slate + Azure": { "--accent":"#3b82f6","--accent2":"#38bdf8","--on-accent":"#06122b","--glow-a":"rgba(59,130,246,.30)","--glow-b":"rgba(59,130,246,.45)","--focus":"rgba(59,130,246,.28)","--accent-border":"rgba(59,130,246,.38)","--accent2-border":"rgba(56,189,248,.4)","--tint2":"rgba(56,189,248,.07)","--bg-glow1":"rgba(59,130,246,.10)","--bg-glow2":"rgba(56,189,248,.07)" },
  "Ink + Violet": { "--accent":"#8b7cf6","--accent2":"#c4b5fd","--on-accent":"#120b2b","--glow-a":"rgba(139,124,246,.30)","--glow-b":"rgba(139,124,246,.45)","--focus":"rgba(139,124,246,.28)","--accent-border":"rgba(139,124,246,.38)","--accent2-border":"rgba(196,181,253,.4)","--tint2":"rgba(196,181,253,.08)","--bg-glow1":"rgba(139,124,246,.10)","--bg-glow2":"rgba(196,181,253,.07)" },
  "Graphite + Copper": { "--accent":"#c8794b","--accent2":"#6b9bc3","--on-accent":"#1a0f08","--glow-a":"rgba(200,121,75,.30)","--glow-b":"rgba(200,121,75,.45)","--focus":"rgba(200,121,75,.28)","--accent-border":"rgba(200,121,75,.38)","--accent2-border":"rgba(107,155,195,.4)","--tint2":"rgba(107,155,195,.07)","--bg-glow1":"rgba(200,121,75,.10)","--bg-glow2":"rgba(107,155,195,.07)" },
  "Ámbar (original)": { "--accent":"#f4934e","--accent2":"#56d0c0","--on-accent":"#0c0f17","--glow-a":"rgba(244,147,78,.28)","--glow-b":"rgba(244,147,78,.4)","--focus":"rgba(244,147,78,.25)","--accent-border":"rgba(244,147,78,.35)","--accent2-border":"rgba(86,208,192,.4)","--tint2":"rgba(86,208,192,.06)","--bg-glow1":"rgba(244,147,78,.12)","--bg-glow2":"rgba(86,208,192,.08)" },
};
export const PALETTE_NAMES = Object.keys(PALETTES);
