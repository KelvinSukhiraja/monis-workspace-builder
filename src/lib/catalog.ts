export type Category = "desks" | "chairs" | "tech" | "extras";
export type Slot =
  | "desk"
  | "chair"
  | "monitor"
  | "stand"
  | "keyboard"
  | "mouse"
  | "lamp"
  | "plant"
  | "rug"
  | "power";
export type Period = "weekly" | "monthly";
export type Product = {
  id: string;
  name: string;
  detail: string;
  description: string;
  category: Category;
  slot: Slot;
  weekly: number;
  monthly: number;
  color: string;
  badge?: string;
};

export const products: Product[] = [
  {
    id: "desk-oak",
    name: "Standing Desk",
    detail: "Natural oak · 120 × 60 cm",
    description:
      "An electric standing desk with a warm oak finish. A little room to think, and plenty of room to work.",
    category: "desks",
    slot: "desk",
    weekly: 150000,
    monthly: 510000,
    color: "#b99265",
    badge: "THE EVERYDAY FAVORITE",
  },
  {
    id: "desk-walnut",
    name: "Studio Desk",
    detail: "Dark walnut · 140 × 70 cm",
    description:
      "A generous fixed-height desk in deep walnut. Made for spreading out your next big idea.",
    category: "desks",
    slot: "desk",
    weekly: 200000,
    monthly: 680000,
    color: "#72503b",
  },
  {
    id: "chair-ergo",
    name: "Ergo Chair",
    detail: "Graphite · Adjustable mesh",
    description:
      "Breathable mesh, adjustable arms and lumbar support for comfortably getting into your flow.",
    category: "chairs",
    slot: "chair",
    weekly: 125000,
    monthly: 425000,
    color: "#383c38",
  },
  {
    id: "chair-studio",
    name: "Studio Chair",
    detail: "Oat · Upholstered comfort",
    description:
      "A soft upholstered desk chair with a sculptural silhouette. An illustrative alternative for this demo.",
    category: "chairs",
    slot: "chair",
    weekly: 150000,
    monthly: 510000,
    color: "#c7bbaa",
    badge: "DEMO OPTION",
  },
  {
    id: "monitor-27",
    name: "27″ 4K Monitor",
    detail: "4K UHD · USB-C",
    description:
      "A sharp, spacious screen for everyday deep work. Includes its own desk stand.",
    category: "tech",
    slot: "monitor",
    weekly: 175000,
    monthly: 595000,
    color: "#424641",
  },
  {
    id: "monitor-dual",
    name: "Dual 27″ Monitors",
    detail: "Two screens · One clear view",
    description:
      "A pair of monitors for charts, code and everything you want to keep in sight. Priced as one set.",
    category: "tech",
    slot: "monitor",
    weekly: 300000,
    monthly: 1020000,
    color: "#424641",
  },
  {
    id: "monitor-studio",
    name: "27″ Studio Display",
    detail: "5K · Silver aluminum",
    description:
      "A beautifully detailed display with a clean aluminum finish for your creative workspace.",
    category: "tech",
    slot: "monitor",
    weekly: 350000,
    monthly: 1190000,
    color: "#bbc0ba",
  },
  {
    id: "stand",
    name: "Laptop Stand",
    detail: "Aluminum · Elevated view",
    description:
      "An aluminum stand that brings your own laptop up to eye level. Laptop not included.",
    category: "tech",
    slot: "stand",
    weekly: 35000,
    monthly: 119000,
    color: "#a9ada8",
  },
  {
    id: "keyboard",
    name: "Wireless Keyboard",
    detail: "Compact · Graphite",
    description:
      "A compact wireless keyboard to give your desk a little breathing room.",
    category: "tech",
    slot: "keyboard",
    weekly: 40000,
    monthly: 136000,
    color: "#454945",
  },
  {
    id: "mouse",
    name: "Wireless Mouse",
    detail: "Ergonomic · Graphite",
    description:
      "An ergonomic wireless mouse for comfortable, precise navigation.",
    category: "tech",
    slot: "mouse",
    weekly: 30000,
    monthly: 102000,
    color: "#454945",
  },
  {
    id: "lamp",
    name: "Task Lamp",
    detail: "Olive · Warm light",
    description: "A pool of warm light for late ideas and early starts.",
    category: "extras",
    slot: "lamp",
    weekly: 35000,
    monthly: 119000,
    color: "#566044",
  },
  {
    id: "plant",
    name: "A Little Green",
    detail: "Leafy plant · Ceramic pot",
    description:
      "A little company for your desk, in a natural ceramic planter.",
    category: "extras",
    slot: "plant",
    weekly: 25000,
    monthly: 85000,
    color: "#5b7044",
  },
  {
    id: "rug",
    name: "Woven Rug",
    detail: "Natural fiber · 160 × 120 cm",
    description:
      "A warm woven layer that makes your workspace feel settled in.",
    category: "extras",
    slot: "rug",
    weekly: 45000,
    monthly: 153000,
    color: "#baa07b",
  },
  {
    id: "power",
    name: "Power Strip",
    detail: "3 outlets · USB charging",
    description: "A tidy home for the cables and chargers behind your setup.",
    category: "extras",
    slot: "power",
    weekly: 15000,
    monthly: 51000,
    color: "#e4e0d6",
  },
];

export type Configuration = Partial<Record<Slot, string>>;
export type Template = {
  id: string;
  name: string;
  note: string;
  ids: string[];
};
export const templates: Template[] = [
  {
    id: "essentials",
    name: "Essentials",
    note: "A fresh start.",
    ids: ["desk-oak", "chair-ergo"],
  },
  {
    id: "trading",
    name: "Trading",
    note: "See the bigger picture.",
    ids: [
      "desk-walnut",
      "chair-ergo",
      "monitor-dual",
      "keyboard",
      "mouse",
      "power",
    ],
  },
  {
    id: "founder",
    name: "Founder",
    note: "Build your next thing.",
    ids: [
      "desk-oak",
      "chair-ergo",
      "monitor-27",
      "stand",
      "keyboard",
      "mouse",
      "lamp",
      "plant",
    ],
  },
  {
    id: "studio",
    name: "Studio",
    note: "Space to create.",
    ids: [
      "desk-walnut",
      "chair-studio",
      "monitor-studio",
      "keyboard",
      "mouse",
      "lamp",
      "plant",
      "rug",
    ],
  },
];
export const categories: { id: Category; label: string }[] = [
  { id: "desks", label: "Desks" },
  { id: "chairs", label: "Chairs" },
  { id: "tech", label: "Tech" },
  { id: "extras", label: "Extras" },
];
export const productById = (id?: string) => products.find((p) => p.id === id);
export const selectedProducts = (config: Configuration) =>
  products.filter((p) => config[p.slot] === p.id);
export const totalPrice = (config: Configuration, period: Period) =>
  selectedProducts(config).reduce((sum, p) => sum + p[period], 0);
export const formatPrice = (amount: number) =>
  `Rp ${new Intl.NumberFormat("id-ID").format(amount)}`;
export const shortPrice = (amount: number) =>
  `Rp ${new Intl.NumberFormat("en-US", { maximumFractionDigits: 1 }).format(amount / 1000)}k`;
export const periodLabel = (period: Period) =>
  period === "weekly" ? "week" : "month";
export const configFromIds = (ids: string[]): Configuration =>
  Object.fromEntries(
    ids.flatMap((id) => {
      const product = productById(id);
      return product ? [[product.slot, product.id]] : [];
    }),
  );
export const matchingTemplate = (config: Configuration) =>
  templates.find((t) => {
    const ids = selectedProducts(config).map((p) => p.id);
    return ids.length === t.ids.length && t.ids.every((id) => ids.includes(id));
  });

export type BuilderState = {
  config: Configuration;
  period: Period;
  undo: Configuration | null;
};
export const initialState: BuilderState = {
  config: {},
  period: "weekly",
  undo: null,
};
export type Action =
  | { type: "select"; id: string }
  | { type: "remove"; slot: Slot }
  | { type: "template"; id: string }
  | { type: "period"; period: Period }
  | { type: "reset" }
  | { type: "undo" }
  | { type: "restore"; value: unknown };

export function sanitizeSaved(
  value: unknown,
): Pick<BuilderState, "config" | "period"> {
  if (!value || typeof value !== "object")
    return { config: {}, period: "weekly" };
  const saved = value as Record<string, unknown>;
  const config: Configuration = {};
  if (saved.config && typeof saved.config === "object") {
    for (const product of products) {
      if (
        (saved.config as Record<string, unknown>)[product.slot] === product.id
      )
        config[product.slot] = product.id;
    }
  }
  return { config, period: saved.period === "monthly" ? "monthly" : "weekly" };
}

export function builderReducer(
  state: BuilderState,
  action: Action,
): BuilderState {
  switch (action.type) {
    case "select": {
      const product = productById(action.id);
      if (!product || state.config[product.slot] === product.id) return state;
      return {
        ...state,
        config: { ...state.config, [product.slot]: product.id },
        undo: state.config,
      };
    }
    case "remove": {
      const config = { ...state.config };
      delete config[action.slot];
      return { ...state, config, undo: state.config };
    }
    case "template": {
      const template = templates.find((t) => t.id === action.id);
      return template
        ? { ...state, config: configFromIds(template.ids), undo: state.config }
        : state;
    }
    case "reset":
      return { ...state, config: {}, undo: state.config };
    case "undo":
      return state.undo ? { ...state, config: state.undo, undo: null } : state;
    case "period":
      return { ...state, period: action.period };
    case "restore":
      return { ...state, ...sanitizeSaved(action.value), undo: null };
  }
}
