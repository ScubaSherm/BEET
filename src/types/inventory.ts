export type GearCategory =
  | "Backpack"
  | "Truck Kit"
  | "Trailer Kit"
  | "Medical"
  | "Power"
  | "Radio"
  | "Food"
  | "Water"
  | "Tool"
  | "Document"
  | "Other";

export type GearCondition = "New" | "Good" | "Needs Service" | "Damaged" | "Expired";
export type PackedStatus = "Packed" | "Unpacked" | "Deployed" | "Missing";
export type PriorityLevel = "Critical" | "High" | "Medium" | "Low";
export type KitType = "Go-Bag" | "Medical Bag" | "Vehicle Kit" | "Trailer Kit" | "Load List" | "Departure Checklist";
export type PreparednessLevelName = "Ready" | "Explorer" | "Outdoors" | "Emergency Ready" | "Advanced";
export type MaintenanceAssetType = "Truck" | "Trailer";

export interface KitAsset {
  id: string;
  name: string;
  type: KitType;
  ownerLocation: string;
  deploymentPriority: 1 | 2 | 3 | 4;
  description: string;
}

export interface InventoryItem {
  id: string;
  kitId: string;
  itemName: string;
  category: GearCategory;
  ownerLocation: string;
  quantity: number;
  packedStatus: PackedStatus;
  condition: GearCondition;
  expirationDate?: string;
  maintenanceIntervalDays?: number;
  lastCheckedDate?: string;
  nextDueDate?: string;
  notes?: string;
  qrCodeId: string;
  replacementCost?: number;
  priorityLevel: PriorityLevel;
  createdAt: string;
  updatedAt: string;
}

export interface AppSettings {
  expiringSoonDays: number;
  maintenanceDueSoonDays: number;
  currency: "USD";
}

export interface PreparednessSkill {
  id: string;
  level: number;
  levelName: PreparednessLevelName;
  skill: string;
  refreshMonths: number;
}

export interface FamilyMember {
  id: string;
  name: string;
  role: "Adult" | "Kid";
}

export interface SkillRecord {
  memberId: string;
  skillId: string;
  taught: boolean;
  demonstrated: boolean;
  date?: string;
  instructor?: string;
  notes?: string;
  updatedAt: string;
}

export interface MonthlyChallenge {
  month: number;
  title: string;
  focus: string;
}

export interface TrainingProgram {
  members: FamilyMember[];
  skills: PreparednessSkill[];
  records: SkillRecord[];
  challenges: MonthlyChallenge[];
}

export interface AssetMaintenanceTask {
  id: string;
  assetId: string;
  task: string;
  intervalMonths?: number;
  intervalMiles?: number;
  lastCompletedDate?: string;
  nextDueDate?: string;
  priority: PriorityLevel;
  notes: string;
}

export interface AssetMaintenancePlan {
  id: string;
  name: string;
  assetType: MaintenanceAssetType;
  year: number;
  make: string;
  model: string;
  notes: string;
  tasks: AssetMaintenanceTask[];
}

export interface BackupFile {
  appName: "Emergency Gear Inventory and Maintenance Tracker";
  schemaVersion: 1;
  exportedAt: string;
  settings: AppSettings;
  kits: KitAsset[];
  items: InventoryItem[];
  training: TrainingProgram;
  maintenancePlans: AssetMaintenancePlan[];
}

export const categories: GearCategory[] = [
  "Backpack",
  "Truck Kit",
  "Trailer Kit",
  "Medical",
  "Power",
  "Radio",
  "Food",
  "Water",
  "Tool",
  "Document",
  "Other",
];

export const conditions: GearCondition[] = ["New", "Good", "Needs Service", "Damaged", "Expired"];
export const packedStatuses: PackedStatus[] = ["Packed", "Unpacked", "Deployed", "Missing"];
export const priorities: PriorityLevel[] = ["Critical", "High", "Medium", "Low"];
export const kitTypes: KitType[] = ["Go-Bag", "Medical Bag", "Vehicle Kit", "Trailer Kit", "Load List", "Departure Checklist"];
