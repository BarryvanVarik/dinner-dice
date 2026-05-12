export type DishId = "pasta" | "rice-wok" | "stew" | "salad";

export type Category = {
  id: string;
  label: string;
  options: string[];
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
        options: ["Spaghetti", "Penne", "Fusilli", "Tagliatelle", "Rigatoni", "Orzo"]
      },
      {
        id: "sauce-base",
        label: "Sauce base",
        options: ["Tomato", "Cream", "Garlic olive oil", "Pesto", "Lemon butter", "White wine"]
      },
      {
        id: "protein",
        label: "Protein",
        options: ["Chicken", "Shrimp", "Bacon", "Tuna", "Meatballs", "Chickpeas"]
      },
      {
        id: "vegetables",
        label: "Vegetables",
        options: ["Mushrooms", "Spinach", "Cherry tomatoes", "Courgette", "Peas", "Bell pepper"]
      },
      {
        id: "cheese-finish",
        label: "Cheese / finish",
        options: ["Parmesan", "Pecorino", "Mozzarella", "Feta", "Ricotta", "No cheese, herbs only"]
      },
      {
        id: "extra",
        label: "Extra",
        options: ["Chili flakes", "Lemon zest", "Basil", "Breadcrumbs", "Capers", "Pine nuts"]
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
        options: ["Jasmine rice", "Basmati rice", "Egg noodles", "Rice noodles", "Fried rice", "Cauliflower rice"]
      },
      {
        id: "sauce",
        label: "Sauce",
        options: ["Soy sesame", "Teriyaki", "Sweet chili", "Garlic ginger", "Peanut lime", "Gochujang"]
      },
      {
        id: "protein",
        label: "Protein",
        options: ["Chicken", "Beef", "Pork", "Shrimp", "Egg", "Tofu"]
      },
      {
        id: "vegetables",
        label: "Vegetables",
        options: ["Broccoli", "Carrot", "Bell pepper", "Mushrooms", "Sugar snaps", "Pak choi"]
      },
      {
        id: "crunch-topping",
        label: "Crunch / topping",
        options: ["Sesame seeds", "Fried onions", "Peanuts", "Spring onions", "Coriander", "Chili oil"]
      },
      {
        id: "extra",
        label: "Extra",
        options: ["Lime", "Kimchi", "Cucumber", "Edamame", "Pineapple", "Cashews"]
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
        options: ["Tomato", "Coconut milk", "Chicken broth", "Beef broth", "White wine", "Beer"]
      },
      {
        id: "main-protein",
        label: "Main protein",
        options: ["Chicken thighs", "Beef chunks", "Pork shoulder", "Sausage", "Lentils", "Chickpeas"]
      },
      {
        id: "vegetables",
        label: "Vegetables",
        options: ["Potatoes", "Carrots", "Celery", "Mushrooms", "Sweet potato", "Beans"]
      },
      {
        id: "flavor-direction",
        label: "Flavor direction",
        options: ["Italian herbs", "Smoked paprika", "Curry", "Moroccan spices", "Garlic rosemary", "Chili cumin"]
      },
      {
        id: "thickener-body",
        label: "Thickener / body",
        options: ["Potatoes", "Lentils", "Beans", "Cream", "Pearl barley", "Bread on the side"]
      },
      {
        id: "finish",
        label: "Finish",
        options: ["Parsley", "Lemon juice", "Yoghurt", "Parmesan", "Chili oil", "Fresh herbs"]
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
        options: ["Romaine", "Mixed greens", "Baby spinach", "Rocket", "Kale", "Cabbage slaw"]
      },
      {
        id: "carb-body",
        label: "Carb / body",
        options: ["Croutons", "Couscous", "Bulgur", "Pasta", "Roasted potatoes", "Quinoa"]
      },
      {
        id: "protein",
        label: "Protein",
        options: ["Chicken", "Tuna", "Boiled eggs", "Chickpeas", "Salmon", "Feta plus seeds"]
      },
      {
        id: "crunch",
        label: "Crunch",
        options: ["Cucumber", "Carrot", "Red cabbage", "Toasted nuts", "Pumpkin seeds", "Crispy onions"]
      },
      {
        id: "vegetables",
        label: "Vegetables",
        options: ["Tomatoes", "Bell pepper", "Corn", "Radishes", "Avocado", "Green beans"]
      },
      {
        id: "dressing",
        label: "Dressing",
        options: ["Classic vinaigrette", "Honey mustard", "Caesar-style", "Yoghurt herb", "Tahini lemon", "Soy sesame"]
      },
      {
        id: "extra",
        label: "Extra",
        options: ["Pickled red onion", "Olives", "Capers", "Jalapenos", "Fresh herbs", "Lemon zest"]
      }
    ]
  }
];
