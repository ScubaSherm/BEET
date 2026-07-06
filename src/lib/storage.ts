import { starterBackup, starterKits } from "../data/starterInventory";
import { starterMaintenancePlans } from "../data/maintenancePlans";
import { starterTraining } from "../data/trainingProgram";
import type { AssetMaintenancePlan, BackupFile, InventoryItem, KitAsset, TrainingProgram } from "../types/inventory";

const STORAGE_KEY = "egimt:v1";

export function loadBackup(): BackupFile {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    saveBackup(starterBackup);
    return starterBackup;
  }
  try {
    const parsed = JSON.parse(raw);
    return validateBackup(parsed);
  } catch {
    saveBackup(starterBackup);
    return starterBackup;
  }
}

export function saveBackup(backup: BackupFile) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(backup));
}

export function validateBackup(value: unknown): BackupFile {
  const backup = value as BackupFile;
  if (
    !backup ||
    backup.appName !== "Emergency Gear Inventory and Maintenance Tracker" ||
    backup.schemaVersion !== 1 ||
    !Array.isArray(backup.items)
  ) {
    throw new Error("Invalid backup file.");
  }

  if (!Array.isArray(backup.kits)) {
    backup.kits = starterKits;
    backup.items = backup.items.map((item) => ({ ...item, kitId: item.kitId ?? inferKitId(item) }));
  }

  if (!backup.training || !Array.isArray(backup.training.skills) || !Array.isArray(backup.training.members)) {
    backup.training = starterTraining;
  }

  if (!Array.isArray(backup.maintenancePlans)) {
    backup.maintenancePlans = starterMaintenancePlans;
  }

  if (isLegacyFourItemStarter(backup.items)) {
    const migrated = starterFamilyBackup();
    saveBackup(migrated);
    return migrated;
  }

  backup.items.forEach(validateItem);
  return backup;
}

function validateItem(item: InventoryItem) {
  if (!item.id || !item.kitId || !item.itemName || !item.category || !item.ownerLocation || !item.qrCodeId) {
    throw new Error("Invalid inventory item.");
  }
}

export function makeBackup(
  items: InventoryItem[],
  settings = starterBackup.settings,
  kits: KitAsset[] = starterKits,
  training: TrainingProgram = starterTraining,
  maintenancePlans: AssetMaintenancePlan[] = starterMaintenancePlans
): BackupFile {
  return {
    appName: "Emergency Gear Inventory and Maintenance Tracker",
    schemaVersion: 1,
    exportedAt: new Date().toISOString(),
    settings,
    kits,
    items,
    training,
    maintenancePlans
  };
}

export function starterFamilyBackup(): BackupFile {
  return makeBackup(starterBackup.items, starterBackup.settings, starterBackup.kits, starterBackup.training, starterBackup.maintenancePlans);
}

function inferKitId(item: InventoryItem) {
  const text = `${item.ownerLocation} ${item.category}`.toLowerCase();
  if (text.includes("truck")) return "kit-truck";
  if (text.includes("trailer")) return "kit-trailer";
  if (text.includes("medical")) return "kit-family-medical";
  if (text.includes("backpack")) return "kit-dad-go-bag";
  return "kit-last-minute";
}

function isLegacyFourItemStarter(items: InventoryItem[]) {
  if (items.length !== 4) return false;
  const legacyIds = new Set([
    "item-water-family-case-001",
    "item-first-aid-bag-001",
    "item-weather-radio-001",
    "item-power-bank-001"
  ]);
  return items.every((item) => legacyIds.has(item.id));
}
