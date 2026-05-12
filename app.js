const diceConfig = [
  {
    key: "protein",
    label: "Protein",
    hint: "The thing dinner is built around.",
    options: ["chicken thighs", "salmon", "eggs", "shrimp", "beef mince", "pork chops", "turkey meatballs", "halloumi"],
    vegetarian: ["tofu", "tempeh", "eggs", "halloumi", "lentils", "chickpeas", "black beans", "mushrooms"]
  },
  {
    key: "carb",
    label: "Carb",
    hint: "Something filling for the plate.",
    options: ["rice", "pasta", "potatoes", "noodles", "couscous", "flatbread", "tortillas", "gnocchi"],
    quick: ["rice", "pasta", "noodles", "couscous", "flatbread", "tortillas"]
  },
  {
    key: "veg",
    label: "Vegetable",
    hint: "A fresh or roasted sidekick.",
    options: ["broccoli", "spinach", "mushrooms", "zucchini", "carrots", "bell pepper", "green beans", "tomatoes"],
    quick: ["spinach", "mushrooms", "zucchini", "bell pepper", "green beans", "tomatoes"]
  },
  {
    key: "sauce",
    label: "Sauce",
    hint: "The flavor direction.",
    options: ["garlic butter", "soy ginger", "pesto", "curry sauce", "lemon herb", "tomato sauce", "chili crisp", "yogurt tahini"]
  },
  {
    key: "wildcard",
    label: "Wildcard",
    hint: "A small twist to make it fun.",
    options: ["fresh herbs", "fried egg", "pickled onions", "toasted nuts", "lime wedges", "feta", "crispy shallots", "sesame seeds"]
  }
];

const state = {
  locked: new Set(),
  roll: {},
  saved: JSON.parse(localStorage.getItem("dinnerDiceSaved") || "[]")
};

const diceGrid = document.querySelector("#diceGrid");
const savedList = document.querySelector("#savedList");
const rollButton = document.querySelector("#rollButton");
const saveButton = document.querySelector("#saveButton");
const clearLocksButton = document.querySelector("#clearLocksButton");
const clearSavedButton = document.querySelector("#clearSavedButton");
const vegetarianToggle = document.querySelector("#vegetarianToggle");
const quickToggle = document.querySelector("#quickToggle");

function getOptions(die) {
  if (vegetarianToggle.checked && die.vegetarian) {
    return die.vegetarian;
  }

  if (quickToggle.checked && die.quick) {
    return die.quick;
  }

  return die.options;
}

function pickRandom(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function rollDice() {
  diceConfig.forEach((die) => {
    if (!state.locked.has(die.key)) {
      state.roll[die.key] = pickRandom(getOptions(die));
    }
  });

  renderDice();
}

function renderDice() {
  diceGrid.innerHTML = diceConfig.map((die) => {
    const locked = state.locked.has(die.key);
    const ingredient = state.roll[die.key] || pickRandom(getOptions(die));
    state.roll[die.key] = ingredient;

    return `
      <article class="die-card">
        <div class="die-top">
          <span class="die-label">${die.label}</span>
          <button class="lock-button" type="button" data-lock="${die.key}" aria-pressed="${locked}" aria-label="${locked ? "Unlock" : "Lock"} ${die.label}">
            ${locked ? "Kept" : "Keep"}
          </button>
        </div>
        <div class="ingredient">${ingredient}</div>
        <p class="hint">${die.hint}</p>
      </article>
    `;
  }).join("");
}

function formatRoll(roll) {
  return diceConfig.map((die) => `${die.label}: ${roll[die.key]}`).join(" | ");
}

function saveCurrentRoll() {
  const combo = { ...state.roll };
  const formatted = formatRoll(combo);
  const alreadySaved = state.saved.some((item) => formatRoll(item) === formatted);

  if (!alreadySaved) {
    state.saved.unshift(combo);
    state.saved = state.saved.slice(0, 8);
    persistSaved();
    renderSaved();
  }
}

function persistSaved() {
  localStorage.setItem("dinnerDiceSaved", JSON.stringify(state.saved));
}

function renderSaved() {
  if (state.saved.length === 0) {
    savedList.innerHTML = `<li class="empty-state">No saved combos yet.</li>`;
    return;
  }

  savedList.innerHTML = state.saved.map((combo, index) => `
    <li class="saved-item">
      <span class="saved-combo">${formatRoll(combo)}</span>
      <button class="remove-button" type="button" data-remove="${index}" aria-label="Remove saved combo">X</button>
    </li>
  `).join("");
}

diceGrid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-lock]");

  if (!button) {
    return;
  }

  const key = button.dataset.lock;

  if (state.locked.has(key)) {
    state.locked.delete(key);
  } else {
    state.locked.add(key);
  }

  renderDice();
});

savedList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-remove]");

  if (!button) {
    return;
  }

  state.saved.splice(Number(button.dataset.remove), 1);
  persistSaved();
  renderSaved();
});

rollButton.addEventListener("click", rollDice);
saveButton.addEventListener("click", saveCurrentRoll);

clearLocksButton.addEventListener("click", () => {
  state.locked.clear();
  renderDice();
});

clearSavedButton.addEventListener("click", () => {
  state.saved = [];
  persistSaved();
  renderSaved();
});

vegetarianToggle.addEventListener("change", rollDice);
quickToggle.addEventListener("change", rollDice);

rollDice();
renderSaved();
