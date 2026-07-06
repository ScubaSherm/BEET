import { calculateNextDueDate } from "../lib/dates";
import { starterMaintenancePlans } from "./maintenancePlans";
import { starterTraining } from "./trainingProgram";
import type { BackupFile, GearCategory, InventoryItem, KitAsset, PriorityLevel } from "../types/inventory";

const checked = "2026-07-06";
const now = "2026-07-06T00:00:00.000Z";

export const starterKits: KitAsset[] = [
  {
    id: "kit-dad-go-bag",
    name: "Dad Go-Bag",
    type: "Go-Bag",
    ownerLocation: "Sherman's backpack",
    deploymentPriority: 1,
    description: "Priority 1 personal backpack for immediate evacuation."
  },
  {
    id: "kit-mom-go-bag",
    name: "Mom Go-Bag",
    type: "Go-Bag",
    ownerLocation: "Jillian's backpack",
    deploymentPriority: 1,
    description: "Priority 1 personal backpack plus family medical information."
  },
  {
    id: "kit-clara-go-bag",
    name: "Clara Go-Bag",
    type: "Go-Bag",
    ownerLocation: "Clara's backpack",
    deploymentPriority: 1,
    description: "Priority 1 child comfort and clothing backpack."
  },
  {
    id: "kit-grant-go-bag",
    name: "Grant Go-Bag",
    type: "Go-Bag",
    ownerLocation: "Grant's backpack",
    deploymentPriority: 1,
    description: "Priority 1 child comfort, clothing, and activity backpack."
  },
  {
    id: "kit-elise-go-bag",
    name: "Elise Go-Bag",
    type: "Go-Bag",
    ownerLocation: "Elise's backpack",
    deploymentPriority: 1,
    description: "Priority 1 small child comfort and clothing backpack."
  },
  {
    id: "kit-family-medical",
    name: "Family Medical Bag",
    type: "Medical Bag",
    ownerLocation: "Family medical bag",
    deploymentPriority: 1,
    description: "Shared first aid, trauma, medicine, and electrolyte supplies."
  },
  {
    id: "kit-truck",
    name: "Truck Kit",
    type: "Vehicle Kit",
    ownerLocation: "Truck",
    deploymentPriority: 2,
    description: "Priority 2 vehicle support, water, food, tools, and storm cleanup gear."
  },
  {
    id: "kit-trailer",
    name: "Trailer Kit",
    type: "Trailer Kit",
    ownerLocation: "Trailer",
    deploymentPriority: 3,
    description: "Priority 3 extended water, food, power, shelter, and tool reserve if safe and time permits."
  },
  {
    id: "kit-last-minute",
    name: "Last-Minute Loading List",
    type: "Load List",
    ownerLocation: "Home staging area",
    deploymentPriority: 4,
    description: "Items not stored in bags but worth loading when there is warning time."
  },
  {
    id: "kit-departure",
    name: "Departure Checklist",
    type: "Departure Checklist",
    ownerLocation: "Before leaving home",
    deploymentPriority: 4,
    description: "Final household and travel checks before evacuation."
  }
];

type SeedItem = {
  kitId: string;
  name: string;
  qty: number | string;
  category: GearCategory;
  priority?: PriorityLevel;
  notes?: string;
  interval?: number;
};

const seedItems: SeedItem[] = [
  ...dadItems("kit-dad-go-bag"),
  ...dadItems("kit-mom-go-bag"),
  item("kit-mom-go-bag", "Hygiene Kit", "1", "Other", "High", "Travel size"),
  item("kit-mom-go-bag", "Feminine Supplies", "1 set", "Medical", "High", "3-5 day supply"),
  item("kit-mom-go-bag", "Kids' Medical Info", "1", "Document", "Critical", "Allergies and medications"),
  item("kit-mom-go-bag", "Spare Glasses", "1", "Medical", "Medium", "If applicable"),
  item("kit-mom-go-bag", "Lip Balm", "1", "Other", "Low", "Prevents cracking"),
  item("kit-mom-go-bag", "Sunscreen", "1", "Medical", "Medium", "Storm cleanup often means long days outside"),
  ...childItems("kit-clara-go-bag", ["Stuffed Animal", "Coloring Book", "Crayons", "Playing Cards"]),
  ...childItems("kit-grant-go-bag", ["Notebook", "Pencil", "Pocket Magnifier", "Science Book", "Playing Cards"]),
  ...childItems("kit-elise-go-bag", ["Stuffed Animal", "Coloring Book", "Crayons"]),
  ...medicalItems(),
  ...truckItems(),
  ...trailerItems(),
  ...lastMinuteItems(),
  ...departureItems()
];

export const starterBackup: BackupFile = {
  appName: "Emergency Gear Inventory and Maintenance Tracker",
  schemaVersion: 1,
  exportedAt: now,
  settings: {
    expiringSoonDays: 30,
    maintenanceDueSoonDays: 14,
    currency: "USD"
  },
  kits: starterKits,
  items: seedItems.map(toInventoryItem),
  training: starterTraining,
  maintenancePlans: starterMaintenancePlans
};

function dadItems(kitId: string): SeedItem[] {
  return [
    item(kitId, "Driver's License / ID Copies", "1", "Document", "Critical", "Waterproof pouch"),
    item(kitId, "Cash", "$300", "Document", "Critical", "Small bills; card readers often fail after storms"),
    item(kitId, "Headlamp", "1", "Power", "High", "Keep hands free", 30),
    item(kitId, "Extra Batteries", "1 set", "Power", "High", "Replace yearly", 365),
    item(kitId, "Rechargeable Flashlight", "1", "Power", "High", "Backup light", 30),
    item(kitId, "Multi-Tool", "1", "Tool", "High", "Everyday repairs"),
    item(kitId, "Folding Knife", "1", "Tool", "Medium", "General utility"),
    item(kitId, "Bic Lighter", "2", "Tool", "Medium", "Waterproof bag"),
    item(kitId, "Waterproof Matches", "1", "Tool", "Medium", "Backup ignition"),
    item(kitId, "25 ft Paracord", "1", "Tool", "Medium", "Shelter and repairs"),
    item(kitId, "Work Gloves", "1 pair", "Tool", "High", "Debris cleanup"),
    item(kitId, "N95 Masks", "4", "Medical", "High", "Mold and insulation"),
    item(kitId, "Rain Jacket", "1", "Backpack", "High", "Lightweight shell"),
    item(kitId, "Change of Clothes", "1", "Backpack", "Medium", "Quick dry preferred"),
    item(kitId, "Wool Socks", "2 pair", "Backpack", "Medium", "Avoid cotton"),
    item(kitId, "Water", "2 bottles", "Water", "Critical", "2L total; rotate every 6 months", 180),
    item(kitId, "Sawyer Mini Filter", "1", "Water", "Critical", "Emergency water"),
    item(kitId, "Electrolyte Packets", "6", "Food", "High", "Prevent dehydration"),
    item(kitId, "Protein Bars", "6", "Food", "High", "Rotate yearly", 365),
    item(kitId, "Beef Jerky", "2 bags", "Food", "Medium", "Long shelf life", 365),
    item(kitId, "Trail Mix", "1 bag", "Food", "Medium", "High calories", 180),
    item(kitId, "First Aid Kit", "1", "Medical", "High", "Personal medications inside"),
    item(kitId, "Prescription Meds", "7 days", "Medical", "Critical", "Rotate monthly", 30),
    item(kitId, "Phone Charger", "1", "Power", "High", "USB-C"),
    item(kitId, "20,000mAh Battery Pack", "1", "Power", "High", "Recharge monthly", 30),
    item(kitId, "Printed Maps", "1", "Document", "High", "GPS may fail"),
    item(kitId, "NOAA Weather Radio", "1", "Radio", "Critical", "Critical during outages", 30),
    item(kitId, "Notebook and Sharpie", "1", "Document", "Medium", "Leave notes if needed")
  ];
}

function childItems(kitId: string, extras: string[]): SeedItem[] {
  const base = [
    item(kitId, "Water Bottle", "1", "Water", "Critical", "Lightweight"),
    item(kitId, "Flashlight", "1", "Power", "High", "Simple and familiar", 30),
    item(kitId, "Rain Jacket", "1", "Backpack", "High"),
    item(kitId, "Hoodie", "1", "Backpack", "Medium"),
    item(kitId, "Clothes", "1 set", "Backpack", "Medium"),
    item(kitId, "Blanket", "1", "Backpack", "Medium", "Comfort item"),
    item(kitId, "Snacks", "Several", "Food", "High", "Rotate often", 90),
    item(kitId, "Toothbrush", "1", "Other", "Medium"),
    item(kitId, "Toothpaste", "1", "Other", "Medium")
  ];
  return [...base, ...extras.map((name) => item(kitId, name, name === "Pencil" ? "2" : "1", "Other", "Low", "Comfort or activity item"))];
}

function medicalItems(): SeedItem[] {
  return [
    item("kit-family-medical", "CAT Tourniquet", "2", "Medical", "Critical", "Adults know use"),
    item("kit-family-medical", "Israeli Bandage", "2", "Medical", "Critical", "Severe bleeding"),
    item("kit-family-medical", "Trauma Shears", "1", "Medical", "High"),
    item("kit-family-medical", "Gauze Rolls", "6", "Medical", "High"),
    item("kit-family-medical", "Compression Bandages", "4", "Medical", "High"),
    item("kit-family-medical", "Bandaids", "Assorted", "Medical", "Medium"),
    item("kit-family-medical", "Antibiotic Ointment", "1", "Medical", "Medium"),
    item("kit-family-medical", "Burn Gel", "2", "Medical", "Medium"),
    item("kit-family-medical", "Tweezers", "1", "Medical", "Medium", "Splinters"),
    item("kit-family-medical", "Digital Thermometer", "1", "Medical", "High"),
    item("kit-family-medical", "Acetaminophen", "1 bottle", "Medical", "High"),
    item("kit-family-medical", "Ibuprofen", "1 bottle", "Medical", "High"),
    item("kit-family-medical", "Benadryl", "1 bottle", "Medical", "High", "Allergic reactions"),
    item("kit-family-medical", "Imodium", "1 box", "Medical", "Medium", "GI illness"),
    item("kit-family-medical", "Electrolytes", "20 packets", "Medical", "High"),
    item("kit-family-medical", "Prescription Meds", "Family", "Medical", "Critical", "Rotate monthly", 30)
  ];
}

function truckItems(): SeedItem[] {
  return [
    item("kit-truck", "Jump Pack", "1", "Truck Kit", "High", "Recharge monthly", 30),
    item("kit-truck", "Tire Inflator", "1", "Truck Kit", "High"),
    item("kit-truck", "Tire Plug Kit", "1", "Truck Kit", "High"),
    item("kit-truck", "Tow Strap", "1", "Truck Kit", "High", "Rated for truck weight"),
    item("kit-truck", "Shackles", "2", "Truck Kit", "High"),
    item("kit-truck", "Folding Shovel", "1", "Tool", "Medium"),
    item("kit-truck", "Axe", "1", "Tool", "Medium", "Downed limbs"),
    item("kit-truck", "Folding Saw", "1", "Tool", "Medium"),
    item("kit-truck", "Battery Chainsaw", "1", "Tool", "High", "Storm cleanup", 30),
    item("kit-truck", "Ratchet Straps", "4", "Truck Kit", "Medium", "Secure cargo"),
    item("kit-truck", "Duct Tape", "2", "Tool", "Medium"),
    item("kit-truck", "Zip Ties", "1 pack", "Tool", "Medium"),
    item("kit-truck", "Tool Kit", "1", "Tool", "High"),
    item("kit-truck", "5 Gallons Water", "1", "Water", "Critical", "Rotate every 6 months", 180),
    item("kit-truck", "Case of Bottled Water", "1", "Water", "Critical"),
    item("kit-truck", "Protein Bars", "1 box", "Food", "High"),
    item("kit-truck", "MREs", "6", "Food", "High"),
    item("kit-truck", "Blankets", "4", "Backpack", "Medium"),
    item("kit-truck", "Tarp", "1", "Tool", "Medium", "Shelter or cargo cover"),
    item("kit-truck", "Lantern", "1", "Power", "High", "Rechargeable", 30),
    item("kit-truck", "NOAA Radio", "1", "Radio", "Critical")
  ];
}

function trailerItems(): SeedItem[] {
  return [
    item("kit-trailer", "20-40 Gallons Potable Water", "1", "Water", "Critical", "Rotate every 6 months", 180),
    item("kit-trailer", "Water Treatment Tablets", "1", "Water", "High"),
    item("kit-trailer", "Gravity Water Filter", "1", "Water", "High"),
    ...["Rice", "Pasta", "Canned Chicken", "Tuna", "Soup", "Peanut Butter", "Oatmeal", "Coffee", "Protein Powder", "Kids Snacks", "Electrolytes"].map((name) => item("kit-trailer", name, "1", "Food", "High", "14-day trailer food reserve", 180)),
    item("kit-trailer", "Generator", "1", "Power", "Critical", "Run monthly", 30),
    item("kit-trailer", "Fuel Cans", "1 set", "Power", "Critical", "Rotate every 6 months", 180),
    item("kit-trailer", "Extension Cords", "1 set", "Power", "High"),
    item("kit-trailer", "Battery Bank", "1", "Power", "High", "Recharge monthly", 30),
    item("kit-trailer", "Solar Panel", "1", "Power", "Medium"),
    item("kit-trailer", "Lanterns", "1 set", "Power", "High"),
    item("kit-trailer", "Spare Batteries", "1 set", "Power", "High"),
    ...["Sleeping Bags", "Pillows", "Blankets", "Towels", "Extra Clothing", "Rain Gear"].map((name) => item("kit-trailer", name, "1 set", "Backpack", "Medium", "Trailer shelter reserve")),
    ...["Drill", "Impact Driver", "Extra Batteries", "Chainsaw", "Chain Oil", "Fuel", "Tarps", "Plastic Sheeting", "Roof Repair Tape", "Hammer", "Nails", "Screws"].map((name) => item("kit-trailer", name, "1", "Tool", "Medium", "Trailer tool reserve"))
  ];
}

function lastMinuteItems(): SeedItem[] {
  return [
    "Family Photo Albums",
    "Laptops and Tablets",
    "Hard Drives / Backups",
    "Chargers",
    "Prescription Medications",
    "Dog Food and Leash",
    "Pet Records",
    "Children's Favorite Comfort Items",
    "Important Legal Documents",
    "Fireproof Document Safe",
    "Firearms Secured for Transport",
    "Extra Fuel if Transported Safely",
    "Cooler with Refrigerated Food",
    "Ice",
    "Cash from Home Safe"
  ].map((name) => item("kit-last-minute", name, "1", name.includes("Document") || name.includes("Records") || name.includes("Cash") ? "Document" : "Other", "Medium", "Load only if there is enough warning time"));
}

function departureItems(): SeedItem[] {
  return [
    "Everyone Has Backpack",
    "Phones Charging",
    "Battery Banks Full",
    "Vehicle Fuel Above 3/4 Tank",
    "Trailer Connected if Taking",
    "Water Loaded",
    "House Water Turned Off if Needed",
    "Refrigerator Emptied of Perishables",
    "Windows Secured",
    "Outdoor Furniture Secured",
    "Generator Secured",
    "Family Meeting Point Confirmed"
  ].map((name) => item("kit-departure", name, "1", "Other", name.includes("Backpack") || name.includes("Fuel") || name.includes("Meeting") ? "Critical" : "High", "Final departure task"));
}

function item(kitId: string, name: string, qty: number | string, category: GearCategory, priority: PriorityLevel = "Medium", notes = "", interval?: number): SeedItem {
  return { kitId, name, qty, category, priority, notes, interval };
}

function toInventoryItem(seed: SeedItem, index: number): InventoryItem {
  const slug = seed.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const id = `${seed.kitId}-${slug}-${String(index + 1).padStart(3, "0")}`;
  const quantity = typeof seed.qty === "number" ? seed.qty : Number.parseFloat(String(seed.qty)) || 1;
  const nextDueDate = calculateNextDueDate(checked, seed.interval);

  return {
    id,
    kitId: seed.kitId,
    itemName: seed.name,
    category: seed.category,
    ownerLocation: starterKits.find((kit) => kit.id === seed.kitId)?.ownerLocation ?? "Unassigned",
    quantity,
    packedStatus: "Unpacked",
    condition: "Good",
    maintenanceIntervalDays: seed.interval,
    lastCheckedDate: checked,
    nextDueDate,
    notes: `${seed.qty}${seed.notes ? ` - ${seed.notes}` : ""}`,
    qrCodeId: `QR-${String(index + 1).padStart(4, "0")}`,
    replacementCost: 0,
    priorityLevel: seed.priority ?? "Medium",
    createdAt: now,
    updatedAt: now
  };
}
