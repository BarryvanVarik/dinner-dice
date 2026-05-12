import type { Category, DishType } from "../data/dishTypes";

export type RolledCategory = {
  categoryId: string;
  label: string;
  item: string;
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

function pickRandom(options: string[]) {
  return options[Math.floor(Math.random() * options.length)];
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

function lowercase(value: string) {
  return value.toLowerCase();
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
    "Crispy onions": "crunch"
  };

  return replacements[value] ?? lowercase(value);
}

function pastaSauceName(value: string) {
  const names: Record<string, string> = {
    Tomato: "Tomato",
    Cream: "Creamy",
    "Garlic olive oil": "Garlicky",
    Pesto: "Pesto",
    "Lemon butter": "Lemon butter",
    "White wine": "White wine"
  };

  return names[value] ?? value;
}

function riceSauceName(value: string) {
  return value.replace(" ", "-");
}

function saladProteinName(value: string) {
  return value === "Feta plus seeds" ? "Feta and seed" : value;
}

function rollCategory(category: Category): RolledCategory {
  return {
    categoryId: category.id,
    label: category.label,
    item: pickRandom(category.options)
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
      const vegetable = singularFood(getRoll(rolls, "vegetables"));
      const pasta = lowercase(getRoll(rolls, "pasta-shape"));
      return `${sauce} ${protein} and ${vegetable} ${pasta}`;
    }

    case "rice-wok": {
      const sauce = riceSauceName(getRoll(rolls, "sauce"));
      const protein = lowercase(getRoll(rolls, "protein"));
      const base = lowercase(getRoll(rolls, "base"));
      return `${sauce} ${protein} ${base} bowl`;
    }

    case "stew": {
      const base = getRoll(rolls, "base");
      const protein = lowercase(getRoll(rolls, "main-protein"));
      const vegetable = singularFood(getRoll(rolls, "vegetables"));
      return `${base} ${protein} and ${vegetable} stew`;
    }

    case "salad": {
      const protein = saladProteinName(getRoll(rolls, "protein"));
      const vegetable = singularFood(getRoll(rolls, "vegetables"));
      const crunch = singularFood(getRoll(rolls, "crunch"));
      return `${protein} ${vegetable} ${crunch} salad`;
    }
  }
}

function createInstruction(dishType: DishType, rolls: RolledCategory[]) {
  switch (dishType.id) {
    case "pasta":
      return `Cook the ${getRoll(rolls, "pasta-shape").toLowerCase()}, build a ${getRoll(rolls, "sauce-base").toLowerCase()} sauce with ${getRoll(rolls, "protein").toLowerCase()} and ${getRoll(rolls, "vegetables").toLowerCase()}, then finish with ${getRoll(rolls, "cheese-finish").toLowerCase()} and ${getRoll(rolls, "extra").toLowerCase()}.`;

    case "rice-wok":
      return `Stir-fry ${getRoll(rolls, "protein").toLowerCase()} with ${getRoll(rolls, "vegetables").toLowerCase()}, toss with ${getRoll(rolls, "sauce").toLowerCase()}, serve over ${getRoll(rolls, "base").toLowerCase()}, and top with ${getRoll(rolls, "crunch-topping").toLowerCase()} plus ${getRoll(rolls, "extra").toLowerCase()}.`;

    case "stew":
      return `Brown or soften the ${getRoll(rolls, "main-protein").toLowerCase()}, add ${getRoll(rolls, "vegetables").toLowerCase()}, ${getRoll(rolls, "base").toLowerCase()}, and ${getRoll(rolls, "flavor-direction").toLowerCase()}, then simmer until cozy with ${getRoll(rolls, "thickener-body").toLowerCase()} for body. Finish with ${getRoll(rolls, "finish").toLowerCase()}.`;

    case "salad":
      return `Start with ${getRoll(rolls, "base").toLowerCase()}, add ${getRoll(rolls, "carb-body").toLowerCase()}, ${getRoll(rolls, "protein").toLowerCase()}, ${getRoll(rolls, "vegetables").toLowerCase()}, and ${getRoll(rolls, "crunch").toLowerCase()}, then dress with ${getRoll(rolls, "dressing").toLowerCase()} and finish with ${getRoll(rolls, "extra").toLowerCase()}.`;
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
    case "salad":
      return `Char or roast one ingredient before tossing for a warmer dinner salad.`;
  }
}
