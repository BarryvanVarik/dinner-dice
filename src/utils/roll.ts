import type { Category, DishType } from "../data/dishTypes";
import {
  getUiText,
  type LanguageCode,
  translateCategory,
  translateDish,
  translateIngredient
} from "../data/i18n";

export type RolledCategory = {
  categoryId: string;
  label: string;
  item: string;
  items: string[];
};

export type RollResult = {
  dishTypeId: DishType["id"];
  dishTypeLabel: string;
  dishName: string;
  rolls: RolledCategory[];
  instruction: string;
  kidFriendlyTweak: string;
  upgradeIdea: string;
};

type RollMap = Record<string, RolledCategory>;
type CompatibilityRule = {
  categoryId: string;
  blockedItems: string[];
  when: (rolls: RolledCategory[]) => boolean;
};

function pickRandomItems(options: string[], count: number) {
  const availableOptions = [...options];
  const picks: string[] = [];
  const safeCount = Math.max(1, Math.min(count, availableOptions.length));

  while (picks.length < safeCount) {
    const index = Math.floor(Math.random() * availableOptions.length);
    const [pickedItem] = availableOptions.splice(index, 1);
    picks.push(pickedItem);
  }

  return picks;
}

function toRollMap(result: RollResult | null): RollMap {
  if (!result) {
    return {};
  }

  return Object.fromEntries(result.rolls.map((roll) => [roll.categoryId, roll]));
}

function getRoll(rolls: RolledCategory[], categoryId: string) {
  return rolls.find((roll) => roll.categoryId === categoryId)?.item ?? "";
}

function getRollItems(rolls: RolledCategory[], categoryId: string) {
  const roll = rolls.find((rolledCategory) => rolledCategory.categoryId === categoryId);

  if (!roll) {
    return [];
  }

  return roll.items?.length ? roll.items : [roll.item];
}

function lowercase(value: string) {
  return value.toLowerCase();
}

function capitalizeFirst(value: string) {
  return value ? `${value[0].toUpperCase()}${value.slice(1)}` : value;
}

function formatList(items: string[], language: LanguageCode = "en") {
  if (items.length <= 1) {
    return items[0] ?? "";
  }

  const joinWord = language === "da" ? "og" : language === "nl" ? "en" : "and";

  if (items.length === 2) {
    return `${items[0]} ${joinWord} ${items[1]}`;
  }

  return `${items.slice(0, -1).join(", ")} ${joinWord} ${items[items.length - 1]}`;
}

function lowerList(items: string[]) {
  return formatList(items.map(lowercase));
}

function lowerTranslatedList(items: string[], language: LanguageCode) {
  return formatList(items.map((item) => translateIngredient(item, language).toLowerCase()), language);
}

function displayList(items: string[]) {
  return items.length <= 1 ? items[0] ?? "" : capitalizeFirst(lowerList(items));
}

function displayTranslatedList(items: string[], language: LanguageCode) {
  const translatedItems = items.map((item) => translateIngredient(item, language));
  return translatedItems.length <= 1 ? translatedItems[0] ?? "" : capitalizeFirst(formatList(translatedItems, language));
}

function singularFood(value: string) {
  const replacements: Record<string, string> = {
    "Cherry tomatoes": "cherry tomato",
    Mushrooms: "mushroom",
    Potatoes: "potato",
    Carrots: "carrot",
    Beans: "bean",
    Tomatoes: "tomato",
    Radishes: "radish",
    "Green beans": "green bean",
    "Sugar snaps": "sugar snap",
    "Boiled eggs": "egg",
    "Toasted nuts": "nut",
    "Pumpkin seeds": "seed",
    "Crispy onions": "crunch",
    "Sunflower seeds": "seed",
    "Rye croutons": "rye crunch",
    "White cabbage": "cabbage",
    "Red cabbage": "cabbage",
    "Bean sprouts": "bean sprout",
    "Cod pieces": "cod",
    "Beef strips": "beef",
    "Pork strips": "pork",
    Celeriac: "celeriac",
    Celery: "celery"
  };

  return replacements[value] ?? lowercase(value);
}

function singularFoodList(items: string[]) {
  return formatList(items.map(singularFood));
}

function pastaSauceName(value: string) {
  const names: Record<string, string> = {
    Tomato: "Tomato",
    "Cream cheese": "Creamy",
    "Garlic butter": "Garlic butter",
    "Green pesto": "Green pesto",
    "Red pesto": "Red pesto",
    "Lemon butter": "Lemon butter",
    "Mushroom cream": "Mushroom cream",
    "Mustard cream": "Mustard cream",
    "Tomato mascarpone": "Tomato mascarpone",
    "Herb olive oil": "Herby"
  };

  return names[value] ?? value;
}

function riceSauceName(value: string) {
  return value.replace(/ /g, "-");
}

function saladProteinName(value: string) {
  return value === "Feta plus seeds" ? "Feta and seed" : value;
}

function translatedRoll(rolls: RolledCategory[], categoryId: string, language: LanguageCode) {
  return translateIngredient(getRoll(rolls, categoryId), language);
}

function translatedRollLower(rolls: RolledCategory[], categoryId: string, language: LanguageCode) {
  return translatedRoll(rolls, categoryId, language).toLowerCase();
}

function translatedRollItems(rolls: RolledCategory[], categoryId: string, language: LanguageCode) {
  return getRollItems(rolls, categoryId).map((item) => translateIngredient(item, language));
}

export function displayRollItem(roll: RolledCategory, language: LanguageCode) {
  return displayTranslatedList(roll.items?.length ? roll.items : [roll.item], language);
}

function rollCategory(category: Category): RolledCategory {
  const items = pickRandomItems(category.options, category.pickCount ?? 1);

  return {
    categoryId: category.id,
    label: category.label,
    item: displayList(items),
    items
  };
}

function rerollCategory(category: Category, blockedItems: string[]) {
  const availableOptions = category.options.filter((option) => !blockedItems.includes(option));
  const options = availableOptions.length > 0 ? availableOptions : category.options;

  return rollCategory({
    ...category,
    options
  });
}

export function rollDish(
  dishType: DishType,
  previousResult: RollResult | null,
  lockedCategories: Set<string>,
  language: LanguageCode = "en"
): RollResult {
  const previousRolls = toRollMap(previousResult);
  let rolls = dishType.categories.map((category) => {
    const lockedRoll = previousRolls[category.id];

    if (lockedCategories.has(category.id) && lockedRoll) {
      return lockedRoll;
    }

    return rollCategory(category);
  });

  rolls = improveCompatibility(dishType, rolls, lockedCategories);

  return {
    dishTypeId: dishType.id,
    dishTypeLabel: translateDish(dishType.id, language).label,
    dishName: createDishName(dishType, rolls, language),
    rolls,
    instruction: createInstruction(dishType, rolls, language),
    kidFriendlyTweak: createKidFriendlyTweak(dishType, rolls, language),
    upgradeIdea: createUpgradeIdea(dishType, rolls, language)
  };
}

export function createAndreasResult(dishType: DishType, language: LanguageCode = "en"): RollResult {
  const presetItems: Record<string, string[]> = {
    "pasta-shape": ["Spaghetti"],
    "sauce-base": ["Cream cheese"],
    protein: ["Shrimp"],
    vegetables: ["Red onion", "Peas"],
    "cheese-finish": ["Aged cheese"],
    extra: ["Parsley"]
  };

  const rolls = dishType.categories.map((category) => {
    const items = presetItems[category.id] ?? [category.options[0]];

    return {
      categoryId: category.id,
      label: category.label,
      item: displayList(items),
      items
    };
  });

  return {
    dishTypeId: dishType.id,
    dishTypeLabel: translateDish(dishType.id, language).label,
    dishName: createDishName(dishType, rolls, language),
    rolls,
    instruction: createInstruction(dishType, rolls, language),
    kidFriendlyTweak: createKidFriendlyTweak(dishType, rolls, language),
    upgradeIdea: createUpgradeIdea(dishType, rolls, language)
  };
}

export function localizeResult(result: RollResult, dishType: DishType, language: LanguageCode): RollResult {
  return {
    ...result,
    dishTypeLabel: translateDish(dishType.id, language).label,
    dishName: createDishName(dishType, result.rolls, language),
    instruction: createInstruction(dishType, result.rolls, language),
    kidFriendlyTweak: createKidFriendlyTweak(dishType, result.rolls, language),
    upgradeIdea: createUpgradeIdea(dishType, result.rolls, language)
  };
}

export function createCopyText(result: RollResult, language: LanguageCode = "en") {
  const text = getUiText(language);
  const rolls = result.rolls
    .map((roll) => `- ${translateCategory(roll.categoryId, roll.label, language)}: ${displayRollItem(roll, language)}`)
    .join("\n");

  return [
    `${text.copyTitle}: ${result.dishName}`,
    "",
    `${text.dishType}: ${result.dishTypeLabel}`,
    "",
    `${text.rolls}:`,
    rolls,
    "",
    `${text.howToMakeIt}:`,
    result.instruction,
    "",
    `${text.kidFriendlyTweak}:`,
    result.kidFriendlyTweak,
    "",
    `${text.upgradeIdea}:`,
    result.upgradeIdea
  ].join("\n");
}

export function createShoppingListText(result: RollResult, language: LanguageCode = "en") {
  const ingredients = result.rolls.flatMap((roll) => roll.items?.length ? roll.items : [roll.item]);
  const uniqueIngredients = Array.from(new Set(ingredients))
    .map((ingredient) => translateIngredient(ingredient, language));
  const text = getUiText(language);

  return [
    `${text.shoppingTitle}: ${result.dishName}`,
    "",
    ...uniqueIngredients.map((ingredient) => `- ${ingredient}`)
  ].join("\n");
}

function improveCompatibility(
  dishType: DishType,
  rolls: RolledCategory[],
  lockedCategories: Set<string>
) {
  const rules = getCompatibilityRules(dishType);

  return rules.reduce((currentRolls, rule) => {
    if (!rule.when(currentRolls) || lockedCategories.has(rule.categoryId)) {
      return currentRolls;
    }

    const category = dishType.categories.find((dishCategory) => dishCategory.id === rule.categoryId);

    if (!category) {
      return currentRolls;
    }

    return currentRolls.map((roll) =>
      roll.categoryId === rule.categoryId ? rerollCategory(category, rule.blockedItems) : roll
    );
  }, rolls);
}

function getCompatibilityRules(dishType: DishType): CompatibilityRule[] {
  switch (dishType.id) {
    case "pasta":
      return [
        {
          categoryId: "sauce-base",
          blockedItems: ["Cream cheese", "Mushroom cream", "Mustard cream", "Tomato mascarpone"],
          when: (rolls) => ["Tuna", "Smoked salmon"].includes(getRoll(rolls, "protein"))
        }
      ];
    case "rice-wok":
      return [
        {
          categoryId: "sauce",
          blockedItems: ["Oyster-style", "Gochujang"],
          when: (rolls) => ["Apple", "Pineapple"].includes(getRoll(rolls, "extra"))
        }
      ];
    case "stew":
      return [
        {
          categoryId: "base",
          blockedItems: ["Beef broth", "Dark beer", "Brown gravy"],
          when: (rolls) => ["Cod pieces"].includes(getRoll(rolls, "main-protein"))
        }
      ];
    case "soup":
      return [
        {
          categoryId: "soup-base",
          blockedItems: ["Beef broth", "Split pea base"],
          when: (rolls) => ["Shrimp", "Cod pieces"].includes(getRoll(rolls, "protein"))
        },
        {
          categoryId: "soup-base",
          blockedItems: ["Coconut milk", "Carrot ginger"],
          when: (rolls) => ["Smoked sausage", "Bacon"].includes(getRoll(rolls, "protein"))
        }
      ];
    case "salad":
      return [
        {
          categoryId: "dressing",
          blockedItems: ["Soy sesame", "Creamy curry"],
          when: (rolls) => ["Mackerel", "Smoked salmon"].includes(getRoll(rolls, "protein"))
        }
      ];
  }
}

function createDishName(dishType: DishType, rolls: RolledCategory[], language: LanguageCode) {
  if (language === "nl") {
    return createDutchDishName(dishType, rolls, language);
  }

  if (language === "da") {
    return createDanishDishName(dishType, rolls, language);
  }

  switch (dishType.id) {
    case "pasta": {
      const sauce = pastaSauceName(getRoll(rolls, "sauce-base"));
      const protein = lowercase(getRoll(rolls, "protein"));
      const vegetables = singularFoodList(getRollItems(rolls, "vegetables"));
      const pasta = lowercase(getRoll(rolls, "pasta-shape"));
      return `${sauce} ${protein} with ${vegetables} ${pasta}`;
    }

    case "rice-wok": {
      const sauce = riceSauceName(getRoll(rolls, "sauce"));
      const protein = lowercase(getRoll(rolls, "protein"));
      const vegetables = singularFoodList(getRollItems(rolls, "vegetables"));
      const base = lowercase(getRoll(rolls, "base"));
      return `${sauce} ${protein} with ${vegetables} ${base} bowl`;
    }

    case "stew": {
      const base = getRoll(rolls, "base");
      const protein = lowercase(getRoll(rolls, "main-protein"));
      const vegetables = singularFoodList(getRollItems(rolls, "vegetables"));
      return `${base} ${protein} with ${vegetables} stew`;
    }

    case "soup": {
      const base = getRoll(rolls, "soup-base");
      const protein = singularFood(getRoll(rolls, "protein"));
      const vegetables = singularFoodList(getRollItems(rolls, "vegetables"));
      return `${base} ${protein} soup with ${vegetables}`;
    }

    case "salad": {
      const protein = saladProteinName(getRoll(rolls, "protein"));
      const vegetables = singularFoodList(getRollItems(rolls, "vegetables"));
      const crunch = singularFood(getRoll(rolls, "crunch"));
      return `${protein} ${vegetables} salad with ${crunch}`;
    }
  }
}

function createDutchDishName(dishType: DishType, rolls: RolledCategory[], language: LanguageCode) {
  switch (dishType.id) {
    case "pasta":
      return `${translateIngredient(pastaSauceName(getRoll(rolls, "sauce-base")), language)} ${translatedRollLower(rolls, "protein", language)} met ${lowerTranslatedList(getRollItems(rolls, "vegetables"), language)} ${translatedRollLower(rolls, "pasta-shape", language)}`;
    case "rice-wok":
      return `${translatedRoll(rolls, "sauce", language)} ${translatedRollLower(rolls, "protein", language)} bowl met ${lowerTranslatedList(getRollItems(rolls, "vegetables"), language)} en ${translatedRollLower(rolls, "base", language)}`;
    case "stew":
      return `${translatedRoll(rolls, "base", language)} stoof met ${translatedRollLower(rolls, "main-protein", language)}, ${lowerTranslatedList(getRollItems(rolls, "vegetables"), language)}`;
    case "soup":
      return `${translatedRoll(rolls, "soup-base", language)} soep met ${translatedRollLower(rolls, "protein", language)}, ${lowerTranslatedList(getRollItems(rolls, "vegetables"), language)}`;
    case "salad":
      return `${translateIngredient(saladProteinName(getRoll(rolls, "protein")), language)} salade met ${lowerTranslatedList(getRollItems(rolls, "vegetables"), language)} en ${translatedRollLower(rolls, "crunch", language)}`;
  }
}

function createDanishDishName(dishType: DishType, rolls: RolledCategory[], language: LanguageCode) {
  switch (dishType.id) {
    case "pasta":
      return `${translateIngredient(pastaSauceName(getRoll(rolls, "sauce-base")), language)} ${translatedRollLower(rolls, "protein", language)} med ${lowerTranslatedList(getRollItems(rolls, "vegetables"), language)} ${translatedRollLower(rolls, "pasta-shape", language)}`;
    case "rice-wok":
      return `${translatedRoll(rolls, "sauce", language)} ${translatedRollLower(rolls, "protein", language)} bowl med ${lowerTranslatedList(getRollItems(rolls, "vegetables"), language)} og ${translatedRollLower(rolls, "base", language)}`;
    case "stew":
      return `${translatedRoll(rolls, "base", language)} gryderet med ${translatedRollLower(rolls, "main-protein", language)}, ${lowerTranslatedList(getRollItems(rolls, "vegetables"), language)}`;
    case "soup":
      return `${translatedRoll(rolls, "soup-base", language)} suppe med ${translatedRollLower(rolls, "protein", language)}, ${lowerTranslatedList(getRollItems(rolls, "vegetables"), language)}`;
    case "salad":
      return `${translateIngredient(saladProteinName(getRoll(rolls, "protein")), language)} salat med ${lowerTranslatedList(getRollItems(rolls, "vegetables"), language)} og ${translatedRollLower(rolls, "crunch", language)}`;
  }
}

function createInstruction(dishType: DishType, rolls: RolledCategory[], language: LanguageCode) {
  if (language === "nl") {
    switch (dishType.id) {
      case "pasta":
        return `Kook de ${translatedRollLower(rolls, "pasta-shape", language)}, maak een saus van ${translatedRollLower(rolls, "sauce-base", language)} met ${translatedRollLower(rolls, "protein", language)} en schep ${lowerTranslatedList(getRollItems(rolls, "vegetables"), language)} erdoor. Werk af met ${translatedRollLower(rolls, "cheese-finish", language)} en ${translatedRollLower(rolls, "extra", language)}.`;
      case "rice-wok":
        return `Roerbak ${translatedRollLower(rolls, "protein", language)} met ${lowerTranslatedList(getRollItems(rolls, "vegetables"), language)}, meng met ${translatedRollLower(rolls, "sauce", language)}, serveer op ${translatedRollLower(rolls, "base", language)} en maak af met ${translatedRollLower(rolls, "crunch-topping", language)} plus ${translatedRollLower(rolls, "extra", language)}.`;
      case "stew":
        return `Bak of fruit ${translatedRollLower(rolls, "main-protein", language)}, voeg ${lowerTranslatedList(getRollItems(rolls, "vegetables"), language)}, ${translatedRollLower(rolls, "base", language)} en ${translatedRollLower(rolls, "flavor-direction", language)} toe en laat pruttelen. Geef body met ${translatedRollLower(rolls, "thickener-body", language)} en werk af met ${translatedRollLower(rolls, "finish", language)}.`;
      case "soup":
        return `Fruit ${lowerTranslatedList(getRollItems(rolls, "vegetables"), language)}, voeg ${translatedRollLower(rolls, "protein", language)}, ${translatedRollLower(rolls, "soup-base", language)} en ${translatedRollLower(rolls, "flavor-direction", language)} toe en laat zacht koken. Maak voller met ${translatedRollLower(rolls, "body", language)} en werk af met ${translatedRollLower(rolls, "finish", language)}.`;
      case "salad":
        return `Begin met ${translatedRollLower(rolls, "base", language)}, voeg ${translatedRollLower(rolls, "carb-body", language)}, ${translatedRollLower(rolls, "protein", language)}, ${lowerTranslatedList(getRollItems(rolls, "vegetables"), language)} en ${translatedRollLower(rolls, "crunch", language)} toe. Maak af met ${translatedRollLower(rolls, "dressing", language)} en ${translatedRollLower(rolls, "extra", language)}.`;
    }
  }

  if (language === "da") {
    switch (dishType.id) {
      case "pasta":
        return `Kog ${translatedRollLower(rolls, "pasta-shape", language)}, lav en sauce med ${translatedRollLower(rolls, "sauce-base", language)} og ${translatedRollLower(rolls, "protein", language)}, og vend ${lowerTranslatedList(getRollItems(rolls, "vegetables"), language)} i. Top med ${translatedRollLower(rolls, "cheese-finish", language)} og ${translatedRollLower(rolls, "extra", language)}.`;
      case "rice-wok":
        return `Steg ${translatedRollLower(rolls, "protein", language)} med ${lowerTranslatedList(getRollItems(rolls, "vegetables"), language)}, vend med ${translatedRollLower(rolls, "sauce", language)}, server over ${translatedRollLower(rolls, "base", language)}, og top med ${translatedRollLower(rolls, "crunch-topping", language)} plus ${translatedRollLower(rolls, "extra", language)}.`;
      case "stew":
        return `Brun eller blødgør ${translatedRollLower(rolls, "main-protein", language)}, tilsæt ${lowerTranslatedList(getRollItems(rolls, "vegetables"), language)}, ${translatedRollLower(rolls, "base", language)} og ${translatedRollLower(rolls, "flavor-direction", language)}, og lad det simre. Giv fylde med ${translatedRollLower(rolls, "thickener-body", language)} og afslut med ${translatedRollLower(rolls, "finish", language)}.`;
      case "soup":
        return `Svits ${lowerTranslatedList(getRollItems(rolls, "vegetables"), language)}, tilsæt ${translatedRollLower(rolls, "protein", language)}, ${translatedRollLower(rolls, "soup-base", language)} og ${translatedRollLower(rolls, "flavor-direction", language)}, og lad det simre. Giv fylde med ${translatedRollLower(rolls, "body", language)} og afslut med ${translatedRollLower(rolls, "finish", language)}.`;
      case "salad":
        return `Start med ${translatedRollLower(rolls, "base", language)}, tilsæt ${translatedRollLower(rolls, "carb-body", language)}, ${translatedRollLower(rolls, "protein", language)}, ${lowerTranslatedList(getRollItems(rolls, "vegetables"), language)} og ${translatedRollLower(rolls, "crunch", language)}. Vend med ${translatedRollLower(rolls, "dressing", language)} og slut med ${translatedRollLower(rolls, "extra", language)}.`;
    }
  }

  switch (dishType.id) {
    case "pasta":
      return `Cook the ${lowercase(getRoll(rolls, "pasta-shape"))}, build a ${lowercase(getRoll(rolls, "sauce-base"))} sauce with ${lowercase(getRoll(rolls, "protein"))}, then fold in ${lowerList(getRollItems(rolls, "vegetables"))}. Finish with ${lowercase(getRoll(rolls, "cheese-finish"))} and ${lowercase(getRoll(rolls, "extra"))}.`;

    case "rice-wok":
      return `Stir-fry ${lowercase(getRoll(rolls, "protein"))} with ${lowerList(getRollItems(rolls, "vegetables"))}, toss with ${lowercase(getRoll(rolls, "sauce"))}, serve over ${lowercase(getRoll(rolls, "base"))}, and top with ${lowercase(getRoll(rolls, "crunch-topping"))} plus ${lowercase(getRoll(rolls, "extra"))}.`;

    case "stew":
      return `Brown or soften the ${lowercase(getRoll(rolls, "main-protein"))}, add ${lowerList(getRollItems(rolls, "vegetables"))}, ${lowercase(getRoll(rolls, "base"))}, and ${lowercase(getRoll(rolls, "flavor-direction"))}, then simmer until cozy with ${lowercase(getRoll(rolls, "thickener-body"))} for body. Finish with ${lowercase(getRoll(rolls, "finish"))}.`;

    case "soup":
      return `Soften ${lowerList(getRollItems(rolls, "vegetables"))}, add ${lowercase(getRoll(rolls, "protein"))}, ${lowercase(getRoll(rolls, "soup-base"))}, and ${lowercase(getRoll(rolls, "flavor-direction"))}, then simmer until everything is tender. Add ${lowercase(getRoll(rolls, "body"))} for body and finish with ${lowercase(getRoll(rolls, "finish"))}.`;

    case "salad":
      return `Start with ${lowercase(getRoll(rolls, "base"))}, add ${lowercase(getRoll(rolls, "carb-body"))}, ${lowercase(getRoll(rolls, "protein"))}, ${lowerList(getRollItems(rolls, "vegetables"))}, and ${lowercase(getRoll(rolls, "crunch"))}, then dress with ${lowercase(getRoll(rolls, "dressing"))} and finish with ${lowercase(getRoll(rolls, "extra"))}.`;
  }
}

function createKidFriendlyTweak(dishType: DishType, rolls: RolledCategory[], language: LanguageCode) {
  if (language === "nl") {
    switch (dishType.id) {
      case "pasta":
        return `Zet de ${translatedRollLower(rolls, "extra", language)} apart en maak de saus extra glad.`;
      case "rice-wok":
        return "Serveer de saus apart en houd pittige toppings los.";
      case "stew":
        return "Prak een paar groenten door de stoof om hem zachter en dikker te maken.";
      case "soup":
        return "Pureer een deel van de soep en zet sterkere toppings apart.";
      case "salad":
        return "Serveer als bouw-je-eigen bowl met de dressing apart.";
    }
  }

  if (language === "da") {
    switch (dishType.id) {
      case "pasta":
        return `Server ${translatedRollLower(rolls, "extra", language)} ved siden af, og gør saucen ekstra glat.`;
      case "rice-wok":
        return "Server saucen ved siden af, og hold stærke toppings separat.";
      case "stew":
        return "Mos et par grøntsager i retten for at gøre den mildere og tykkere.";
      case "soup":
        return "Blend en del af suppen glat, og server kraftige toppings ved siden af.";
      case "salad":
        return "Server som en byg-selv bowl med dressingen ved siden af.";
    }
  }

  switch (dishType.id) {
    case "pasta":
      return `Keep the ${getRoll(rolls, "extra").toLowerCase()} on the side and make the sauce extra smooth.`;
    case "rice-wok":
      return `Serve the sauce on the side and keep any spicy toppings separate.`;
    case "stew":
      return `Mash a few vegetables into the stew to thicken it and soften stronger flavors.`;
    case "soup":
      return `Blend part of the soup smooth and keep stronger toppings on the side.`;
    case "salad":
      return `Serve it as a build-your-own bowl with the dressing on the side.`;
  }
}

function createUpgradeIdea(dishType: DishType, rolls: RolledCategory[], language: LanguageCode) {
  if (language === "nl") {
    switch (dishType.id) {
      case "pasta":
        return `Rooster de ${translatedRollLower(rolls, "extra", language)} kort voor een betere afwerking.`;
      case "rice-wok":
        return "Voeg een zachtgekookt ei of snelle ingelegde komkommer toe voor contrast.";
      case "stew":
        return `Maak hem een dag eerder zodat ${translatedRollLower(rolls, "flavor-direction", language)} dieper smaakt.`;
      case "soup":
        return "Voeg geroosterde roggekruimels of een lepel zure room toe vlak voor serveren.";
      case "salad":
        return "Rooster of grill een ingredient voor een warmere maaltijdsalade.";
    }
  }

  if (language === "da") {
    switch (dishType.id) {
      case "pasta":
        return `Rist ${translatedRollLower(rolls, "extra", language)} kort for en bedre finish.`;
      case "rice-wok":
        return "Tilføj et blødkogt æg eller hurtigsyltet agurk for kontrast.";
      case "stew":
        return `Lav den dagen før, så ${translatedRollLower(rolls, "flavor-direction", language)} smagen bliver dybere.`;
      case "soup":
        return "Tilføj ristede rugbrødskrummer eller en skefuld cremefraiche lige før servering.";
      case "salad":
        return "Grill eller rist en ingrediens for en lunere aftenssalat.";
    }
  }

  switch (dishType.id) {
    case "pasta":
      return `Toast the ${getRoll(rolls, "extra").toLowerCase()} briefly for a restaurant-style finish.`;
    case "rice-wok":
      return `Add a jammy egg or quick-pickled cucumber for contrast.`;
    case "stew":
      return `Make it a day ahead so the ${getRoll(rolls, "flavor-direction").toLowerCase()} flavor gets deeper.`;
    case "soup":
      return `Add toasted rye crumbs or a swirl of sour cream right before serving.`;
    case "salad":
      return `Char or roast one ingredient before tossing for a warmer dinner salad.`;
  }
}
