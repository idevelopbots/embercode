/* ===========================================================
   Canvas server catalog
   (Canvas Support is written directly in servers.html and always shows first.)
   To add a server: copy one block below, paste it at the end of
   the list (before the closing ]), and fill in your details.
   It will appear in the catalog automatically.
   Fields:
     name         server name (required)
     invite       invite link (required)
     description  what the server offers
     category     short label, e.g. "Gaming"
     icon         emoji shown on the banner
     iconUrl      image URL for the round server icon (optional; first letter if empty)
     tags         list of short tags
     members      member count (number, optional)
     online       online count (number, optional)
     banner       image URL for the banner (optional; gradient if empty)
   =========================================================== */
const SERVERS = [
  {
    name: "Los Angeles Roleplay",
    invite: "https://discord.gg/JCDAk8wMZh",
    description: "Welcome to Los Angeles Roleplay! Established in 2026, we are an Emergency Response: Liberty County community based in Los Angeles.",
    category: "Gaming",
    icon: "🎮",
    tags: ["Roblox", "Roleplay", "ER:LC"],
    iconUrl: "https://i.ibb.co/B5Dx6ypn/32bcc6e9ad21c8d844c808a916cd536a.webp",
    banner: "https://i.ibb.co/hx8KHyTj/Screenshot-2026-10-06-205903.webp"
  },
  {
    name: "Lofi Lounge",
    invite: "https://discord.gg/GQ58Nk2hKD",
    description: "24/7 chill music, listening parties and a friendly producer community.",
    category: "Music",
    icon: "🎧",
    tags: ["Music", "Chill", "Feedback"],
    iconUrl: "",
    banner: ""
  },
  {
    name: "Studio Nine",
    invite: "https://discord.gg/GQ58Nk2hKD",
    description: "Share your art, join challenges and get constructive critiques.",
    category: "Art",
    icon: "🖌️",
    tags: ["Art", "Challenges", "Commissions"],
    iconUrl: "",
    banner: ""
  },
  {
    name: "Dev Den",
    invite: "https://discord.gg/GQ58Nk2hKD",
    description: "Help channels, code reviews and project showcases for all skill levels.",
    category: "Coding",
    icon: "💻",
    tags: ["Help", "Projects", "Jobs"],
    iconUrl: "",
    banner: ""
  }
];

/* ---------- Rendering (no need to edit below) ---------- */
(function () {
  const grid = document.getElementById("g");
  const loader = document.getElementById("ld");
  const BATCH = 8;
  let shown = 0;

  const esc = (v) => String(v == null ? "" : v).replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const safeUrl = (u) => (/^https?:\/\//i.test(u) ? u : "#");
  const hue = (str) => [...str].reduce((a, c) => (a * 31 + c.charCodeAt(0)) % 360, 7);

  function card(s) {
    const h = hue(s.name || "x");
    const bg = s.banner
      ? `url('${esc(safeUrl(s.banner))}') center/cover`
      : `linear-gradient(135deg,hsl(${h} 70% 38%),hsl(${(h + 50) % 360} 70% 22%))`;
    const stats = [];
    if (s.members) stats.push(Number(s.members).toLocaleString() + " members");
    if (s.online) stats.push(Number(s.online).toLocaleString() + " online");
    const meta = [s.category, ...stats].filter(Boolean).map(esc).join(" &middot; ");
    const tags = (s.tags || []).map((t) => `<span class="badge">${esc(t)}</span>`).join("");
    const avatar = s.iconUrl
      ? `<div class="av" style="background:url('${esc(safeUrl(s.iconUrl))}') center/cover #1a1a22"></div>`
      : `<div class="av" style="background:hsl(${h} 60% 45%)">${esc((s.name || "?")[0])}</div>`;
    const el = document.createElement("article");
    el.className = "sc";
    el.innerHTML =
      `<div class="bn" style="background:${bg}">${s.banner ? "" : esc(s.icon || "")}</div>` +
      `<div class="sb">${avatar}` +
      `<h3>${esc(s.name)}</h3><small>${meta}</small>` +
      `<p>${esc(s.description)}</p><div class="tg">${tags}</div>` +
      `<a class="btn p" href="${esc(safeUrl(s.invite))}" target="_blank" rel="noopener">Join server</a></div>`;
    return el;
  }

  function more() {
    SERVERS.slice(shown, shown + BATCH).forEach((s) => grid.appendChild(card(s)));
    shown = Math.min(shown + BATCH, SERVERS.length);
    loader.hidden = shown >= SERVERS.length;
    loader.textContent = "Loading more servers...";
  }

  if (!SERVERS.length) {
    if (grid.children.length) { loader.hidden = true; return; }
    loader.hidden = false;
    loader.textContent = "No servers listed yet. Add one in servers.js.";
    return;
  }
  more();
  if ("IntersectionObserver" in window) {
    new IntersectionObserver((e) => { if (e[0].isIntersecting && shown < SERVERS.length) more(); },
      { rootMargin: "600px" }).observe(loader);
  } else { while (shown < SERVERS.length) more(); }
})();
