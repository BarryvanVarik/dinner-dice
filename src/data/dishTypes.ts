export type DishId = "pasta" | "rice-wok" | "stew" | "salad";

export type Category = {
  id: string;
  label: string;
  options: string[];
  pickCount?: number;
};

export type DishType = {
  id: DishId;
  label: string;
  shortLabel: string;
  description: string;
  categories: Category[];
};

export const dishTypes: DishType[] = [
  {
    id: "pasta",
    label: "Pasta",
    shortLabel: "Pasta",
    description: "Saucy, cozy, weeknight pasta combinations.",
    categories: [
      {
        id: "pasta-shape",
        label: "Pasta shape",
        options: [
          "Spaghetti",
          "Penne",
          "Fusilli",
          "Tagliatelle",
          "Rigatoni",
          "Macaroni",
          "Farfalle",
          "Orzo",
          "Whole wheat penne",
          "Fresh tortellini"
        ]
      },
      {
        id: "sauce-base",
        label: "Sauce base",
        options: [
          "Tomato",
          "Cream cheese",
          "Garlic butter",
          "Green pesto",
          "Red pesto",
          "Lemon butter",
          "Mushroom cream",
          "Mustard cream",
          "Tomato mascarpone",
          "Herb olive oil"
        ]
      },
      {
        id: "protein",
        label: "Protein",
        options: [
          "Chicken",
          "Shrimp",
          "Bacon",
          "Tuna",
          "Meatballs",
          "Smoked salmon",
          "Chickpeas",
          "Lentils",
          "Pork mince",
          "White beans"
        ]
      },
      {
        id: "vegetables",
        label: "Vegetables",
        pickCount: 2,
        options: [
          "Mushrooms",
          "Spinach",
          "Cherry tomatoes",
          "Courgette",
          "Peas",
          "Bell pepper",
          "Leek",
          "Broccoli",
          "Kale",
          "Cauliflower",
          "Carrot",
          "Red onion"
        ]
      },
      {
        id: "cheese-finish",
        label: "Cheese / finish",
        options: [
          "Parmesan",
          "Pecorino",
          "Mozzarella",
          "Feta",
          "Ricotta",
          "Cream cheese",
          "Goat cheese",
          "Aged cheese",
          "Blue cheese",
          "No cheese, herbs only"
        ]
      },
      {
        id: "extra",
        label: "Extra",
        options: [
          "Chili flakes",
          "Lemon zest",
          "Basil",
          "Parsley",
          "Dill",
          "Chives",
          "Breadcrumbs",
          "Capers",
          "Roasted pine nuts",
          "Crispy onions"
        ]
      }
    ]
  },
  {
    id: "rice-wok",
    label: "Rice / wok",
    shortLabel: "Rice/Wok",
    description: "Fast bowls and stir-fries with punchy toppings.",
    categories: [
      {
        id: "base",
        label: "Base",
        options: [
          "Jasmine rice",
          "Basmati rice",
          "Brown rice",
          "Egg noodles",
          "Rice noodles",
          "Wheat noodles",
          "Fried rice",
          "Cauliflower rice",
          "Pearl barley",
          "Bulgur"
        ]
      },
      {
        id: "sauce",
        label: "Sauce",
        options: [
          "Soy sesame",
          "Teriyaki",
          "Sweet chili",
          "Garlic ginger",
          "Peanut lime",
          "Mild curry coconut",
          "Honey soy",
          "Oyster-style",
          "Gochujang",
          "Mustard soy"
        ]
      },
      {
        id: "protein",
        label: "Protein",
        options: [
          "Chicken",
          "Beef strips",
          "Pork strips",
          "Shrimp",
          "Egg",
          "Tofu",
          "Tempeh",
          "Salmon",
          "Meatballs",
          "Chickpeas"
        ]
      },
      {
        id: "vegetables",
        label: "Vegetables",
        pickCount: 2,
        options: [
          "Broccoli",
          "Carrot",
          "Bell pepper",
          "Mushrooms",
          "Sugar snaps",
          "Pak choi",
          "White cabbage",
          "Red cabbage",
          "Leek",
          "Green beans",
          "Peas",
          "Bean sprouts",
          "Courgette"
        ]
      },
      {
        id: "crunch-topping",
        label: "Crunch / topping",
        options: [
          "Sesame seeds",
          "Fried onions",
          "Peanuts",
          "Spring onions",
          "Coriander",
          "Chili oil",
          "Cashews",
          "Pickled cucumber",
          "Crispy garlic",
          "Lime wedges"
        ]
      },
      {
        id: "extra",
        label: "Extra",
        options: [
          "Lime",
          "Kimchi",
          "Cucumber",
          "Edamame",
          "Pineapple",
          "Cashews",
          "Apple",
          "Radishes",
          "Pickled red onion",
          "Boiled egg"
        ]
      }
    ]
  },
  {
    id: "stew",
    label: "Stew",
    shortLabel: "Stew",
    description: "One-pot dinners with a proper simmered feel.",
    categories: [
      {
        id: "base",
        label: "Base",
        options: [
          "Tomato",
          "Chicken broth",
          "Beef broth",
          "Vegetable broth",
          "Dark beer",
          "White wine",
          "Coconut milk",
          "Brown gravy",
          "Mustard cream",
          "Split pea base"
        ]
      },
      {
        id: "main-protein",
        label: "Main protein",
        options: [
          "Chicken thighs",
          "Beef chunks",
          "Pork shoulder",
          "Sausage",
          "Smoked sausage",
          "Meatballs",
          "Lentils",
          "Chickpeas",
          "White beans",
          "Cod pieces"
        ]
      },
      {
        id: "vegetables",
        label: "Vegetables",
        pickCount: 2,
        options: [
          "Potatoes",
          "Carrots",
          "Celery",
          "Mushrooms",
          "Sweet potato",
          "Green beans",
          "Leek",
          "Cabbage",
          "Celeriac",
          "Parsnip",
          "Peas",
          "Cauliflower"
        ]
      },
      {
        id: "flavor-direction",
        label: "Flavor direction",
        options: [
          "Bay and thyme",
          "Smoked paprika",
          "Mild curry",
          "Mustard dill",
          "Garlic rosemary",
          "Chili cumin",
          "Caraway",
          "Juniper and pepper",
          "Tomato herbs",
          "Parsley garlic"
        ]
      },
      {
        id: "thickener-body",
        label: "Thickener / body",
        options: [
          "Potatoes",
          "Lentils",
          "White beans",
          "Cream",
          "Pearl barley",
          "Rye bread on the side",
          "Mashed potato topping",
          "Split peas",
          "Root vegetables",
          "Flour butter roux"
        ]
      },
      {
        id: "finish",
        label: "Finish",
        options: [
          "Parsley",
          "Lemon juice",
          "Yoghurt",
          "Sour cream",
          "Grated cheese",
          "Chili oil",
          "Fresh dill",
          "Chives",
          "Pickled cucumber",
          "Crispy bacon"
        ]
      }
    ]
  },
  {
    id: "salad",
    label: "Salad",
    shortLabel: "Salad",
    description: "Big bowl salads that can carry dinner.",
    categories: [
      {
        id: "base",
        label: "Base",
        options: [
          "Romaine",
          "Mixed greens",
          "Baby spinach",
          "Rocket",
          "Kale",
          "Cabbage slaw",
          "Little gem",
          "Butter lettuce",
          "Endive",
          "Iceberg"
        ]
      },
      {
        id: "carb-body",
        label: "Carb / body",
        options: [
          "Croutons",
          "Couscous",
          "Bulgur",
          "Pasta",
          "Roasted potatoes",
          "Quinoa",
          "Rye bread croutons",
          "Pearl barley",
          "Boiled potatoes",
          "Lentils"
        ]
      },
      {
        id: "protein",
        label: "Protein",
        options: [
          "Chicken",
          "Tuna",
          "Boiled eggs",
          "Chickpeas",
          "Smoked salmon",
          "Feta plus seeds",
          "Mackerel",
          "Shrimp",
          "White beans",
          "Goat cheese"
        ]
      },
      {
        id: "crunch",
        label: "Crunch",
        options: [
          "Cucumber",
          "Carrot",
          "Red cabbage",
          "Toasted nuts",
          "Pumpkin seeds",
          "Crispy onions",
          "Radishes",
          "Apple",
          "Sunflower seeds",
          "Rye croutons"
        ]
      },
      {
        id: "vegetables",
        label: "Vegetables",
        pickCount: 2,
        options: [
          "Tomatoes",
          "Bell pepper",
          "Corn",
          "Radishes",
          "Avocado",
          "Green beans",
          "Cucumber",
          "Beetroot",
          "Pickled cucumber",
          "Red onion",
          "Peas",
          "Carrot"
        ]
      },
      {
        id: "dressing",
        label: "Dressing",
        options: [
          "Classic vinaigrette",
          "Honey mustard",
          "Dill yoghurt",
          "Yoghurt herb",
          "Tahini lemon",
          "Soy sesame",
          "Mustard vinaigrette",
          "Sour cream herb",
          "Lemon olive oil",
          "Creamy curry"
        ]
      },
      {
        id: "extra",
        label: "Extra",
        options: [
          "Pickled red onion",
          "Olives",
          "Capers",
          "Fresh herbs",
          "Lemon zest",
          "Dill",
          "Chives",
          "Pickled cucumber",
          "Roasted seeds",
          "Crispy bacon"
        ]
      }
    ]
  }
];
