/* ============================================
   LA TERRASSE – script.js
   Charge le menu depuis Google Sheets (CSV publié)
   et génère les catégories accordéon.
   ============================================
   
   CONFIGURATION :
   1. Dans Google Sheets, allez dans :
      Fichier → Partager → Publier sur le Web
      → Sélectionnez votre feuille → Format : CSV
      → Cliquer "Publier" et copiez l'URL.
   2. Collez cette URL dans SHEET_CSV_URL ci-dessous.
   3. Votre feuille doit avoir ces colonnes (ligne 1 = en-têtes) :
      Catégorie | Catégorie_EN | Icône | Nom | Description | Prix
   ============================================ */

const SHEET_CSV_URL = "VOTRE_URL_GOOGLE_SHEETS_CSV_ICI";

/* Catégories par défaut si le Google Sheet n'est pas encore configuré */
const DEFAULT_MENU = [
  {
    category: "Petit Déjeuner", categoryEN: "Breakfast", icon: "☕",
    items: [
      { name: "Formule Complète", desc: "Pain grillé, confiture, beurre, jus d'orange, café", price: "8.500 DT" },
      { name: "Croque-Monsieur", desc: "Pain de mie, jambon, fromage fondu", price: "5.500 DT" },
      { name: "Croissant Beurre", desc: "Croissant pur beurre, confiture maison", price: "2.500 DT" },
      { name: "Avocado Toast", desc: "Pain complet, avocat, œuf poché, graines", price: "7.000 DT" },
    ]
  },
  {
    category: "Cafés", categoryEN: "Coffee", icon: "☕",
    items: [
      { name: "Espresso", desc: "Café court et intense", price: "1.500 DT" },
      { name: "Cappuccino", desc: "Espresso, lait vapeur, mousse de lait", price: "2.500 DT" },
      { name: "Café Latte", desc: "Double espresso, lait velouté", price: "3.000 DT" },
      { name: "Café Glacé", desc: "Espresso froid, lait, glaçons", price: "3.500 DT" },
    ]
  },
  {
    category: "Boissons Chaudes", categoryEN: "Hot Drinks", icon: "🫖",
    items: [
      { name: "Thé à la Menthe", desc: "Thé vert, menthe fraîche", price: "2.000 DT" },
      { name: "Chocolat Chaud", desc: "Chocolat belge, lait entier", price: "3.000 DT" },
      { name: "Infusion Hibiscus", desc: "Fleurs d'hibiscus, cannelle", price: "2.500 DT" },
    ]
  },
  {
    category: "Jus & Cocktails", categoryEN: "Fresh Juices & Cocktails", icon: "🍹",
    items: [
      { name: "Jus d'Orange Frais", desc: "Pressé à la commande", price: "3.500 DT" },
      { name: "Smoothie Tropical", desc: "Mangue, ananas, banane, lait de coco", price: "5.000 DT" },
      { name: "Mojito Virgin", desc: "Citron vert, menthe, sucre de canne, pétillant", price: "4.500 DT" },
      { name: "Limonade Maison", desc: "Citrons frais, sirop, eau gazeuse", price: "3.500 DT" },
    ]
  },
  {
    category: "Crêpes & Gaufres", categoryEN: "Crepes & Waffles", icon: "🧇",
    items: [
      { name: "Crêpe Nutella", desc: "Crêpe fine, Nutella, noisettes concassées", price: "4.500 DT" },
      { name: "Crêpe Salée", desc: "Jambon, fromage, œuf", price: "5.500 DT" },
      { name: "Gaufre Fruits Rouges", desc: "Gaufre croustillante, coulis framboise, crème", price: "6.000 DT" },
    ]
  },
  {
    category: "Sandwichs & Paninis", categoryEN: "Sandwiches & Paninis", icon: "🥪",
    items: [
      { name: "Panini Poulet Pesto", desc: "Poulet grillé, pesto, tomate, mozzarella", price: "7.000 DT" },
      { name: "Club Sandwich", desc: "Dinde, bacon, laitue, tomate, mayonnaise", price: "8.000 DT" },
      { name: "Panini Végétarien", desc: "Légumes grillés, hummus, roquette", price: "6.500 DT" },
    ]
  },
  {
    category: "Burgers", categoryEN: "Burgers", icon: "🍔",
    items: [
      { name: "Classic Burger", desc: "Bœuf 150g, cheddar, salade, tomate, sauce maison", price: "12.000 DT" },
      { name: "Crispy Chicken Burger", desc: "Poulet pané croustillant, coleslaw, pickles", price: "11.000 DT" },
      { name: "Double Smash", desc: "Double galette smashée, double cheddar, oignons caramélisés", price: "15.000 DT" },
    ]
  },
  {
    category: "Salades", categoryEN: "Salads", icon: "🥗",
    items: [
      { name: "Salade César", desc: "Romaine, poulet grillé, parmesan, croûtons, sauce César", price: "9.000 DT" },
      { name: "Salade Grecque", desc: "Tomate, concombre, feta, olives, oignons rouges", price: "7.500 DT" },
      { name: "Salade Quinoa", desc: "Quinoa, avocat, feta, épinards, vinaigrette au citron", price: "9.500 DT" },
    ]
  },
  {
    category: "Desserts", categoryEN: "Desserts", icon: "🍰",
    items: [
      { name: "Moelleux au Chocolat", desc: "Cœur fondant, glace vanille", price: "5.500 DT" },
      { name: "Cheesecake Fraise", desc: "Base biscuit, crème, coulis de fraise", price: "5.000 DT" },
      { name: "Tiramisu Maison", desc: "Mascarpone, café, biscuits, cacao", price: "5.000 DT" },
    ]
  },
  {
    category: "Glaces", categoryEN: "Ice Cream", icon: "🍦",
    items: [
      { name: "Coupe 2 boules", desc: "Au choix : vanille, chocolat, fraise, pistache", price: "3.500 DT" },
      { name: "Banana Split", desc: "Banane, 3 boules, chantilly, coulis, amandes", price: "6.500 DT" },
      { name: "Sundae Caramel", desc: "Vanille, caramel beurre salé, chantilly", price: "5.000 DT" },
    ]
  },
];

/* ============================================
   PARSING CSV FROM GOOGLE SHEETS
   Colonnes attendues :
   Catégorie | Catégorie_EN | Icône | Nom | Description | Prix
   ============================================ */
function parseCSV(text) {
  const lines = text.trim().split("\n").map(l => l.trim()).filter(Boolean);
  if (lines.length < 2) return null;

  // Skip header row
  const rows = lines.slice(1).map(line => {
    // Handle quoted fields properly
    const cols = [];
    let current = "";
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        inQuotes = !inQuotes;
      } else if (ch === "," && !inQuotes) {
        cols.push(current.trim());
        current = "";
      } else {
        current += ch;
      }
    }
    cols.push(current.trim());
    return cols;
  });

  // Group by category
  const catMap = new Map();
  for (const row of rows) {
    const [cat, catEN, icon, name, desc, price] = row;
    if (!cat || !name) continue;
    const key = cat;
    if (!catMap.has(key)) {
      catMap.set(key, { category: cat, categoryEN: catEN || "", icon: icon || "🍽️", items: [] });
    }
    catMap.get(key).items.push({ name, desc: desc || "", price: price || "" });
  }
  return catMap.size > 0 ? [...catMap.values()] : null;
}

/* ============================================
   RENDER
   ============================================ */
function renderMenu(data) {
  const container = document.getElementById("menu-container");
  container.innerHTML = "";

  data.forEach((cat, idx) => {
    const block = document.createElement("div");
    block.className = "category-block";
    block.dataset.index = idx;

    const itemsHTML = cat.items.map(item => `
      <div class="menu-item">
        <div class="item-info">
          <div class="item-name">${escHtml(item.name)}</div>
          ${item.desc ? `<div class="item-desc">${escHtml(item.desc)}</div>` : ""}
        </div>
        ${item.price ? `<div class="item-price">${escHtml(item.price)}</div>` : ""}
      </div>
    `).join("");

    block.innerHTML = `
      <button class="category-header" aria-expanded="false" aria-controls="panel-${idx}">
        <div class="cat-icon-wrap">${escHtml(cat.icon)}</div>
        <div class="cat-titles">
          <div class="cat-name-fr">${escHtml(cat.category)}</div>
          ${cat.categoryEN ? `<div class="cat-name-en">${escHtml(cat.categoryEN)}</div>` : ""}
        </div>
        <div class="cat-dotted" aria-hidden="true"></div>
        <span class="cat-chevron" aria-hidden="true">▼</span>
      </button>
      <div class="category-panel" id="panel-${idx}" role="region">
        <div class="panel-inner">${itemsHTML}</div>
      </div>
    `;

    // Toggle accordion
    block.querySelector(".category-header").addEventListener("click", () => {
      const isOpen = block.classList.contains("open");
      // Optionally close all others for single-open behaviour:
      // document.querySelectorAll(".category-block.open").forEach(b => closeBlock(b));
      isOpen ? closeBlock(block) : openBlock(block);
    });

    container.appendChild(block);
  });

  document.getElementById("menu-loading").classList.add("hidden");
  container.classList.remove("hidden");
}

function openBlock(block) {
  block.classList.add("open");
  block.querySelector(".category-header").setAttribute("aria-expanded", "true");
}

function closeBlock(block) {
  block.classList.remove("open");
  block.querySelector(".category-header").setAttribute("aria-expanded", "false");
}

function escHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/* ============================================
   LOAD MENU
   Essaie Google Sheets CSV → fallback données locales
   ============================================ */
async function loadMenu() {
  document.getElementById("menu-loading").classList.remove("hidden");
  document.getElementById("menu-error").classList.add("hidden");
  document.getElementById("menu-container").classList.add("hidden");

  // If no URL configured, use default data immediately
  if (!SHEET_CSV_URL || SHEET_CSV_URL.includes("VOTRE_URL")) {
    renderMenu(DEFAULT_MENU);
    return;
  }

  try {
    const res = await fetch(SHEET_CSV_URL, { cache: "no-cache" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const text = await res.text();
    const parsed = parseCSV(text);
    if (!parsed) throw new Error("CSV vide ou mal formaté");
    renderMenu(parsed);
  } catch (err) {
    console.warn("Google Sheets indisponible, utilisation des données locales.", err);
    // Fallback to default data silently
    renderMenu(DEFAULT_MENU);
  }
}

/* Start */
document.addEventListener("DOMContentLoaded", loadMenu);
