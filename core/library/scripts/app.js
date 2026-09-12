const OS_VERSION = "v1.0.3";
const ANNOUNCEMENT_TEXT = "This link will be disabled and CheddarOS will go back into private access on 5/1/2026";

document.getElementById("logo-ver").textContent = OS_VERSION;
document.getElementById("home-ver").textContent = OS_VERSION;
document.getElementById("info-ver").textContent = OS_VERSION;
document.getElementById("welcome-ver").textContent = OS_VERSION;

if (ANNOUNCEMENT_TEXT.trim()) {
  const nb = document.getElementById("notice-bar");
  nb.style.display = "block";
  nb.textContent = "[NOTICE] " + ANNOUNCEMENT_TEXT;
}

let LATEST_SHA = "main";
const REPO_BASE = "https://cdn.jsdelivr.net/gh/FailedRifle/hamburger";

function getGameDir() { return `${REPO_BASE}@${LATEST_SHA}/games`; }
function getToolDir() { return `${REPO_BASE}@${LATEST_SHA}/core/library/tools`; }

const sites = {
  "snow rider":         { name: "Snow Rider 3D",              enabled: true,  src: "snow-rider3d" },
  "retro bowl":         { name: "Retro Bowl",                  enabled: true,  src: "retro-bowl" },
  "wrestle bros":       { name: "Wrestle Bros",                enabled: false, src: "wrestle-bros" },
  "potato":             { name: "Throw a Potato",              enabled: true,  src: "throw-a-potato" },
  "drift hunters":      { name: "Drift Hunters",               enabled: true,  src: "drift-hunters" },
  "basketball legends": { name: "Basketball Legends 2020",     enabled: false, src: "basketball-legends" },
  "cheddar clicker":    { name: "Cheddar Clicker",             enabled: true,  src: "cheddar-clicker" },
  "bloons td4":         { name: "Bloons Tower Defense 4",      enabled: true,  src: "bloons-td4" },
  "geometry dash":      { name: "Geometry Dash Lite",          enabled: true,  src: "geometry-dash" },
  "minecraft":          { name: "Minecraft v1.12.2",           enabled: true,  src: "minecraft" },
  "zombies":            { name: "CoD Zombies",                  enabled: true,  src: "nz-zombies" },
  "sm64":               { name: "Super Mario 64",              enabled: true,  src: "sm64" },
  "buckshot":           { name: "Buckshot Roulette",           enabled: true,  src: "buckshot-roulette" },
  "fnaf":               { name: "Five Nights at Freddy's",     enabled: true,  src: "fnaf1" },
  "fnaf2":              { name: "Five Nights at Freddy's 2",   enabled: true,  src: "fnaf2" },
  "fnaf3":              { name: "Five Nights at Freddy's 3",   enabled: true,  src: "fnaf3" },
  "fnaf4":              { name: "Five Nights at Freddy's 4",   enabled: true,  src: "fnaf4" },
  "cheese rolling":     { name: "Cheese Rolling",              enabled: true,  src: "cheeserolling" },
};

const tools = {
  "html ide":      { name: "CheddarOS IDE",          enabled: true, src: "cheddar-ide" },
  "form cracker":  { name: "Google Form Cracker",    enabled: true, src: "form-cracker" },
  "gpt":           { name: "CheddarGPT",             enabled: true, src: "gpt" },
};

const changelogData = [
  { ver: "v1.0.3",        date: "4/13/2026", items: ["Added Cheese Rolling","Added a search bar to help find all games and tools","Added descritptions to the games now with recommendations and controls"] },
  { ver: "v1.0.2",        date: "4/2/2026",  items: ["Added a little welcome message every time you open the app","Added a pre-load so everything can load smoothly without lag and or delay"] },
  { ver: "v1.0.1",        date: "3/31/2026", items: ["Offically went public!","Added FNaF 1-4","CheddarGPT is undermaintaince while I fix the API"] },
  { ver: "v1.0.0",        date: "3/30/2026", items: ["CheddarOS officially released","CheddarOS whitelist is now working","Revamped UI","Removed the console commands entirely","Added CheddarGPT","Added Cheddar Form Cracker (instructions inside)"] },
  { ver: "vBETA-1.0.0",   date: "3/17/2026", items: ["Finally out of alpha and into open beta","Revamped UI again to be more unique","Console, games, and the password are now under 1 tab","Welcoming new testers to CheddarOS"] },
  { ver: "vALPHA-2.1.3",  date: "3/14/2026", items: ["Fixed Bloons TD4"] },
  { ver: "vALPHA-2.1.2",  date: "3/13/2026", items: ["Added Bloons TD4","Fixed formatting","Minor bug fixes"] },
  { ver: "vALPHA-2.1.1",  date: "3/11/2026", items: ["Added Basketball Legends","Basketball Legends offline while looking for GoGuardian bypass"] },
  { ver: "vALPHA-2.1.0",  date: "3/9/2026",  items: ["Completely changed how games load","Games load faster than ever","Reduced lag in every game and inside CheddarOS","Fixed GoGuardian bypass for Buckshot Roulette","Shell Shockers removed"] },
  { ver: "vALPHA-2.0.3",  date: "3/8/2026",  items: ["Added Drift Hunters"] },
  { ver: "vALPHA-2.0.2",  date: "3/7/2026",  items: ["Added an info command to see more information about CheddarOS"] },
  { ver: "vALPHA-2.0.1",  date: "3/7/2026",  items: ["Formatted the games and the help list to look more professional","Added an announcement text","Minor bug fixes"] },
  { ver: "vALPHA-2.0.0",  date: "3/4/2026",  items: ["Completely revamped the UI","Changed tab name and icon"] },
  { ver: "vALPHA-1.1.0",  date: "2/27/2026", items: ["Massive Code Cleanup"] },
  { ver: "vALPHA-1.0.10", date: "2/27/2026", items: ["Added Buckshot Roulette"] },
  { ver: "vALPHA-1.0.9",  date: "2/27/2026", items: ["Added Wrestle Bros"] },
  { ver: "vALPHA-1.0.8",  date: "2/27/2026", items: ["Formatted the credits screen"] },
  { ver: "vALPHA-1.0.7",  date: "2/26/2026", items: ["Added Shell Shockers"] },
  { ver: "vALPHA-1.0.6",  date: "2/26/2026", items: ["Added Retro Bowl"] },
  { ver: "vALPHA-1.0.5b", date: "2/26/2026", items: ["Minor bug fixes","Cut the loading speed in half"] },
  { ver: "vALPHA-1.0.5",  date: "2/25/2026", items: ["Throw a Potato fixed","Removed ads","FNaE revamp","Fixed Snow Rider 3D black screen"] },
  { ver: "vALPHA-1.0.4",  date: "2/25/2026", items: ["FNaE back online"] },
  { ver: "vALPHA-1.0.3",  date: "2/25/2026", items: ["FNaE taken offline","Throw a Potato offline (GoGuardian)"] },
  { ver: "vALPHA-1.0.2",  date: "2/23/2026", items: ["Minor fixes","Throw a Potato playable","Added Snow Rider 3D (WIP)"] },
  { ver: "vALPHA-1.0.1",  date: "2/23/2026", items: ["Throw a Potato maintenance"] },
  { ver: "vALPHA-1.0.0",  date: "2/23/2026", items: ["CheddarOS early private access release."] },
];

const creditsData = [
  { role: "LEAD PROGRAMMER", people: ["Cheddar Hobbs"] },
  { role: "CONTRIBUTORS",    people: ["Matt Marakovits","Joey Lombardo (Joronster)","Alex Falana"] },
  { role: "TESTERS",         people: ["Jadell Vargas (Jelly)","Vinnie Nucci (Vinchenzo)","Max Dankies","Tyler Hartman","Juan Sosa","Dean Albanese (DJ)","Stephen Schall (Steve Diggs)"] },
];
const creditsDisclaimer = "All Testers and Contributors are not affiliated in any way with the development of CheddarOS.";

function buildSidebar() {
  const gEl = document.getElementById("games-sidebar");
  const oEl = document.getElementById("offline-sidebar");
  const tEl = document.getElementById("tools-sidebar");

  Object.entries(sites).sort((a,b) => a[0].localeCompare(b[0])).forEach(([key, s]) => {
    const btn = document.createElement("button");
    btn.className = "sidebar-item" + (!s.enabled ? " offline" : "");
    btn.textContent = key;
    btn.dataset.key = key;
    btn.onclick = () => showGame(key);
    (s.enabled ? gEl : oEl).appendChild(btn);
  });

  Object.entries(tools).sort((a,b) => a[0].localeCompare(b[0])).forEach(([key, t]) => {
    const btn = document.createElement("button");
    btn.className = "sidebar-item" + (!t.enabled ? " offline" : "");
    btn.textContent = key;
    btn.dataset.key = key;
    btn.onclick = () => showTool(key);
    tEl.appendChild(btn);
  });
}

const CF_WORKER_URL = "https://hamburger-extra-cheddar-no-pickles.fauilting.workers.dev";

async function updateCloudflareStats() {
  try {
    fetch(`${CF_WORKER_URL}/increment`);
    const response = await fetch(`${CF_WORKER_URL}/api/stats`);
    const data = await response.json();
    document.getElementById('stats-total').textContent = data.total.toLocaleString();
    document.getElementById('stats-active').textContent = data.active;
    document.getElementById('stats-avg').textContent = data.average;
  } catch (err) {
    console.warn("CheddarOS: Could not load live stats.");
    document.getElementById('stats-total').textContent = "Offline";
    document.getElementById('stats-active').textContent = "Offline";
    document.getElementById('stats-avg').textContent = "Offline";
  }
}
updateCloudflareStats();

function buildPopularGrid() {
  const popularKeys = ["zombies", "drift hunters", "cheese rolling", "potato"];
  const grid = document.getElementById("popular-grid");
  if (!grid) return;
  grid.innerHTML = "";

  popularKeys.forEach(key => {
    const s = sites[key];
    if (!s || !s.enabled) return;
    const card = document.createElement("div");
    card.className = "popular-card";
    card.innerHTML = `
      <div class="card-img">
        <img src="${getGameDir()}/${s.src}/icon.png" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
        <div class="no-img" style="display:none;width:100%;height:100%;align-items:center;justify-content:center;"><span style="font-size:10px;color:#555">No image</span></div>
      </div>
      <div class="card-label">${s.name}</div>
    `;
    card.onclick = () => showGame(key);
    grid.appendChild(card);
  });
}

const searchInput = document.getElementById('game-search');
const searchDropdown = document.getElementById('search-dropdown');
let selectedIndex = -1;
let currentResults = [];

searchInput.addEventListener('input', () => {
  const query = searchInput.value.toLowerCase().trim();
  renderDropdown(query);
});

function renderDropdown(query) {
  searchDropdown.innerHTML = "";
  currentResults = [];
  selectedIndex = -1;

  if (!query) {
    searchDropdown.style.display = "none";
    return;
  }

  const gameResults   = Object.keys(sites).filter(k =>  sites[k].enabled && k.toLowerCase().includes(query)).sort();
  const offlineResults = Object.keys(sites).filter(k => !sites[k].enabled && k.toLowerCase().includes(query)).sort();
  const toolResults   = Object.keys(tools).filter(k => k.toLowerCase().includes(query)).sort();

  if (gameResults.length === 0 && offlineResults.length === 0 && toolResults.length === 0) {
    searchDropdown.style.display = "block";
    searchDropdown.innerHTML = `<div style="padding: 12px; color: var(--red); font-size: 13px; text-align: center;">No results found for "${query}"</div>`;
    return;
  }

  searchDropdown.style.display = "block";

  const addSection = (title, keys, type) => {
    if (keys.length === 0) return;
    const sectionHeader = document.createElement("div");
    sectionHeader.style.cssText = "padding: 8px 12px; background: #000; color: var(--accent); font-size: 11px; font-weight: 800; border-bottom: 1px solid var(--border);";
    sectionHeader.textContent = title;
    searchDropdown.appendChild(sectionHeader);

    keys.forEach(key => {
      const item = document.createElement("div");
      item.className = "sidebar-item" + (type === 'offline' ? " offline" : "");
      item.textContent = key;
      item.style.paddingLeft = "24px";
      const resultIndex = currentResults.length;
      currentResults.push({ key, type });
      item.onclick = () => {
        type === 'tool' ? showTool(key) : showGame(key);
        closeSearch();
      };
      searchDropdown.appendChild(item);
    });
  };

  addSection("GAMES",   gameResults,    'game');
  addSection("TOOLS",   toolResults,    'tool');
  addSection("OFFLINE", offlineResults, 'offline');
}

function updateSelection() {
  const items = searchDropdown.querySelectorAll('.sidebar-item');
  items.forEach((item, i) => item.classList.toggle('active', i === selectedIndex));
}

function closeSearch() {
  searchInput.value = "";
  searchDropdown.style.display = "none";
  selectedIndex = -1;
}

searchInput.addEventListener('keydown', (e) => {
  const items = searchDropdown.querySelectorAll('.sidebar-item');
  if (e.key === "ArrowDown") {
    e.preventDefault();
    selectedIndex = Math.min(selectedIndex + 1, items.length - 1);
    updateSelection();
    items[selectedIndex]?.scrollIntoView({ block: 'nearest' });
  } else if (e.key === "ArrowUp") {
    e.preventDefault();
    selectedIndex = Math.max(selectedIndex - 1, 0);
    updateSelection();
    items[selectedIndex]?.scrollIntoView({ block: 'nearest' });
  } else if (e.key === "Enter" && selectedIndex > -1) {
    items[selectedIndex].click();
  } else if (e.key === "Tab" && selectedIndex > -1) {
    e.preventDefault();
    searchInput.value = currentResults[selectedIndex].key;
    renderDropdown(searchInput.value);
  } else if (e.key === "Escape") {
    closeSearch();
  }
});

document.addEventListener('click', (e) => {
  if (!e.target.closest('#sidebar')) closeSearch();
});

function buildChangelogs() {
  const el = document.getElementById("changelog-list");
  changelogData.forEach(entry => {
    const div = document.createElement("div");
    div.className = "cl-entry";
    div.innerHTML = `
      <span class="cl-ver">${entry.ver}</span><span class="cl-date">${entry.date}</span>
      <ul class="cl-items">${entry.items.map(i => `<li>${i}</li>`).join('')}</ul>
    `;
    el.appendChild(div);
  });
}

const terminalContent = document.getElementById("terminal-content");

function addLine(text, type = "") {
  const line = document.createElement("div");
  line.className = "term-line " + type;
  line.innerHTML = text;
  terminalContent.appendChild(line);
  document.getElementById("terminal-loader").scrollTop = terminalContent.scrollHeight;
}

async function runTerminalLoader() {
  addLine("CheddarOS Terminal [" + OS_VERSION + "]");
  addLine("(c) CheddarOS. All rights reserved.<br>");
  await new Promise(r => setTimeout(r, 400));

  addLine("C:\\Users\\Cheddar> <span class='term-blue'>cheddaros --prepare --assets</span>");
  await new Promise(r => setTimeout(r, 300));

  addLine("Initializing Asset Pre-fetcher...");

  const gameKeys = Object.keys(sites);
  addLine(`<br><span class='term-yellow'>[SYSTEM] Pre-loading ${gameKeys.length} Game Manifests...</span>`);

  for (const key of gameKeys) {
    const s = sites[key];
    const iconUrl   = `${getGameDir()}/${s.src}/icon.png`;
    const bannerUrl = `${getGameDir()}/${s.src}/banner.png`;
    try {
      await Promise.all([
        fetch(iconUrl,   { mode: 'no-cors' }),
        fetch(bannerUrl, { mode: 'no-cors' })
      ]);
      addLine(`FETCHED [${key}] -> <span class='term-green'>READY</span>`);
    } catch (e) {
      addLine(`FETCHED [${key}] -> <span class='term-red'>FAILED</span>`);
    }
    await new Promise(r => setTimeout(r, 50));
  }

  addLine("<br><span class='term-yellow'>[SYSTEM] Verifying Tool Modules...</span>");
  for (const tKey in tools) {
    addLine(`MOUNTING /bin/tools/${tools[tKey].src} ... <span class='term-green'>SUCCESS</span>`);
    await new Promise(r => setTimeout(r, 100));
  }

  addLine("<br>Finalizing system environment...");
  await new Promise(r => setTimeout(r, 500));

  addLine("<br><span class='term-green'>All assets fetched. Starting CheddarOS...</span>");
  await new Promise(r => setTimeout(r, 1250));

  document.getElementById("terminal-loader").style.display = "none";
  document.getElementById("app").style.display = "flex";
}

function buildHomePreview() {
  const el = document.getElementById("home-changelog-preview");
  const recent = changelogData.slice(0, 1);
  el.innerHTML = "";
  recent.forEach(entry => {
    const div = document.createElement("div");
    div.className = "changelog-entry";
    div.innerHTML = `
      <span class="entry-ver">${entry.ver}</span><span class="entry-date">${entry.date}</span>
      <ul>${entry.items.map(i => `<li>${i}</li>`).join('')}</ul>
    `;
    el.appendChild(div);
  });
}

function buildCredits() {
  const el = document.getElementById("credits-content");
  creditsData.forEach(section => {
    const div = document.createElement("div");
    div.className = "credits-section";
    div.innerHTML = `
      <div class="credits-role">${section.role}</div>
      <ul class="credits-people">${section.people.map(p => `<li>${p}</li>`).join('')}</ul>
    `;
    el.appendChild(div);
  });
  const disc = document.createElement("div");
  disc.className = "credits-disclaimer";
  disc.textContent = creditsDisclaimer;
  el.appendChild(disc);
}

let currentTab = "home";
let currentSidebarKey = null;

function showTab(tab) {
  currentTab = tab;
  currentSidebarKey = null;
  document.querySelectorAll(".nav-btn").forEach(b => b.classList.toggle("active", b.dataset.tab === tab));
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.getElementById("game-page").classList.remove("active");
  document.getElementById("tool-page").classList.remove("active");
  document.getElementById(`page-${tab}`)?.classList.add("active");
  document.querySelectorAll(".sidebar-item").forEach(b => b.classList.remove("active"));
}

document.querySelectorAll(".nav-btn").forEach(btn => {
  btn.onclick = () => showTab(btn.dataset.tab);
});

async function showGame(key) {
  const s = sites[key];
  currentSidebarKey = key;

  document.querySelectorAll(".nav-btn").forEach(b => b.classList.remove("active"));
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.getElementById("tool-page").classList.remove("active");
  document.getElementById("game-page").classList.add("active");
  document.querySelectorAll(".sidebar-item").forEach(b => b.classList.toggle("active", b.dataset.key === key));

  const bannerEl = document.getElementById("game-banner");
  bannerEl.innerHTML = `
    <img src="${getGameDir()}/${s.src}/banner.png" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'" alt="">
    <div class="no-banner" style="display:none">No image</div>
  `;

  document.getElementById("game-name-bar").textContent = s.name;
  const descArea = document.getElementById("game-desc-area");

  if (!s.enabled) {
    descArea.innerHTML = `<div class="game-offline-notice">
      '${s.name}' is not currently available.<br>
      This game has been taken offline. Please check back next update.
    </div>`;
    document.getElementById("game-play-btn").disabled = true;
    document.getElementById("game-play-btn").style.opacity = "0.4";
  } else {
    descArea.innerHTML = `<div class="game-desc-box">Loading description...</div>`;
    try {
      const descResponse = await fetch(`${getGameDir()}/${s.src}/desc.txt`);
      if (descResponse.ok) {
        const customDesc = await descResponse.text();
        descArea.innerHTML = `<div class="game-desc-box">${customDesc}</div>`;
      } else {
        descArea.innerHTML = `<div class="game-desc-box">${s.desc}</div>`;
      }
    } catch (err) {
      descArea.innerHTML = `<div class="game-desc-box">${s.desc}</div>`;
    }
    document.getElementById("game-play-btn").disabled = false;
    document.getElementById("game-play-btn").style.opacity = "1";
  }

  document.getElementById("game-play-btn").onclick = s.enabled ? () => launchGame(key) : null;
}

function showTool(key) {
  const t = tools[key];
  currentSidebarKey = key;

  document.querySelectorAll(".nav-btn").forEach(b => b.classList.remove("active"));
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.getElementById("game-page").classList.remove("active");
  document.getElementById("tool-page").classList.add("active");
  document.querySelectorAll(".sidebar-item").forEach(b => b.classList.toggle("active", b.dataset.key === key));

  document.getElementById("tool-header").style.display = "none";

  const wrap = document.querySelector(".tool-frame-wrap");
  wrap.innerHTML = `<div class="tool-placeholder">Loading ${t.name}...</div>`;

  if (!t.enabled) {
    wrap.innerHTML = `<div class="tool-placeholder" style="color:#cc3333">${t.name} is currently disabled.</div>`;
    return;
  }

  const toolBase = `${getToolDir()}/${t.src}/`;
  fetch(`${toolBase}index.html`)
    .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.text(); })
    .then(html => {
      const processedHtml = `<head><base href="${toolBase}"></head>` + html;
      const blob = new Blob([processedHtml], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const frame = document.createElement("iframe");
      frame.style.cssText = "width:100%; height:100%; border:none; background:#1a1a1a;";
      frame.src = url;
      wrap.innerHTML = "";
      wrap.appendChild(frame);
    })
    .catch(err => {
      wrap.innerHTML = `<div class="tool-placeholder" style="color:#cc3333">Error loading tool: ${err.message}</div>`;
    });
}

function launchGame(key) {
  const s = sites[key];
  const gameUrl = `${getGameDir()}/${s.src}/index.html`;

  const win = window.open('about:blank', '_blank');
  if (!win) {
    alert("Pop-up blocked! Please allow pop-ups to launch games.");
    return;
  }

  const injection = `
<!DOCTYPE html>
<html>
<head>
    <title>injecting the cheddar</title>
    <style>body,html{margin:0;padding:0;height:100%;overflow:hidden;background:#000;}</style>
</head>
<body>
    <script>
        const link = '${gameUrl}';
        fetch(link)
            .then(r => {
                if(!r.ok) throw new Error('Network response was not ok');
                return r.text();
            })
            .then(d => {
                document.open();
                document.write(d);
                document.close();
            })
            .catch(err => {
                document.body.innerHTML = '<div style="color:white;text-align:center;padding-top:20px;font-family:sans-serif;">Failed to load game data.</div>';
            });
    <\/script>
</body>
</html>`;

  win.document.open();
  win.document.write(injection);
  win.document.close();
}

async function fetchGitHubStats() {
  try {
    const res = await fetch('https://api.github.com/repos/FailedRifle/hamburger/commits/main');
    if (!res.ok) throw new Error();
    const data = await res.json();

    LATEST_SHA = data.sha;

    const fmt = new Intl.DateTimeFormat('en-US', {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: 'numeric', minute: '2-digit', hour12: true,
      timeZone: 'America/New_York', timeZoneName: 'short'
    });
    document.getElementById("ic-updated").textContent = fmt.format(new Date(data.commit.committer.date)).replace(',', ' ');

    const countRes = await fetch('https://api.github.com/repos/FailedRifle/hamburger/commits?sha=main&per_page=1');
    const linkHeader = countRes.headers.get("Link");

    let totalCommits = "Unavailable";
    if (linkHeader) {
      const match = linkHeader.match(/page=(\d+)>; rel="last"/);
      if (match) totalCommits = match[1];
    } else {
      const singlePage = await countRes.json();
      totalCommits = Array.isArray(singlePage) ? singlePage.length : 0;
    }
    document.getElementById("ic-commits").textContent = totalCommits;

    const grid = document.getElementById("popular-grid");
    if (grid) { grid.innerHTML = ""; buildPopularGrid(); }

  } catch (err) {
    console.warn("CheddarOS: GitHub API limit reached or error.");
    document.getElementById("ic-updated").textContent = "Unavailable";
    document.getElementById("ic-commits").textContent = "Unavailable";
  }
}

buildSidebar();
buildPopularGrid();
buildChangelogs();
buildHomePreview();
buildCredits();
fetchGitHubStats();
runTerminalLoader();
