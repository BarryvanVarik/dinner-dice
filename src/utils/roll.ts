import type { Category, DishType } from "../data/dishTypes";

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

function formatList(items: string[]) {
  if (items.length <= 1) {
    return items[0] ?? "";
  }

  if (items.length === 2) {
    return `${items[0]} and ${items[1]}`;
  }

  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

function lowerList(items: string[]) {
  return formatList(items.map(lowercase));
}

function displayList(items: string[]) {
  return items.length <= 1 ? items[0] ?? "" : capitalizeFirst(lowerList(items));
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

function rollCategory(category: Category): RolledCategory {
  const items = pickRandomItems(category.options, category.pickCount ?? 1);

  return {
    categoryId: category.id,
    label: category.label,
    item: displayList(items),
    items
  };
}

export function rollDish(
  dishType: DishType,
  previousResult: RollResult | null,
  lockedCategories: Set<string>
): RollResult {
  const previousRolls = toRollMap(previousResult);
  const rolls = dishType.categories.map((category) => {
    const lockedRoll = previousRolls[category.id];

    if (lockedCategories.has(category.id) && lockedRoll) {
      return lockedRoll;
    }

    return rollCategory(category);
  });

  return {
    dishTypeId: dishType.id,
    dishTypeLabel: dishType.label,
    dishName: createDishName(dishType, rolls),
    rolls,
    instruction: createInstruction(dishType, rolls),
    kidFriendlyTweak: createKidFriendlyTweak(dishType, rolls),
    upgradeIdea: createUpgradeIdea(dishType, rolls)
  };
}

export function createCopyText(result: RollResult) {
  const rolls = result.rolls.map((roll) => `- ${roll.label}: ${roll.item}`).join("\n");

  return [
    `Dinner Dice result: ${result.dishName}`,
    "",
    `Dish type: ${result.dishTypeLabel}`,
    "",
    "Rolls:",
    rolls,
    "",
    "How to make it:",
    result.instruction,
    "",
    "Kid-friendly tweak:",
    result.kidFriendlyTweak,
    "",
    "Upgrade idea:",
    result.upgradeIdea
  ].join("\n");
}

function createDishName(dishType: DishType, rolls: RolledCategory[]) {
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

function createInstruction(dishType: DishType, rolls: RolledCategory[]) {
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

function createKidFriendlyTweak(dishType: DishType, rolls: RolledCategory[]) {
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

function createUpgradeIdea(dishType: DishType, rolls: RolledCategory[]) {
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
