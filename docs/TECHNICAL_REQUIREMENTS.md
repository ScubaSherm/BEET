# Technical Requirements - Emergency Gear Inventory and Maintenance Tracker

## Technology Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- LocalStorage-first persistence
- JSON import/export backup
- QR code generation
- Printable checklist views
- `.ics` calendar export for Google Calendar
- GitHub Pages deployment

## Recommended Libraries

- Routing: `react-router-dom` using hash routing for GitHub Pages simplicity.
- QR generation: `qrcode.react` or equivalent maintained QR component.
- Dates: `date-fns`.
- Icons: `lucide-react`.
- Testing: Vitest, React Testing Library, Playwright.
- Styling: Tailwind CSS with print utilities.

## Core Data Types

```ts
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
export type PriorityLevel = "Critical" | "High" | "Medium" | "Low";
export type PackedStatus = "Packed" | "Unpacked" | "Deployed" | "Missing";

export interface InventoryItem {
  id: string;
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

export interface BackupFile {
  appName: "Emergency Gear Inventory and Maintenance Tracker";
  schemaVersion: number;
  exportedAt: string;
  items: InventoryItem[];
  settings: AppSettings;
}
```

## Storage Requirements

- Store app data under a versioned LocalStorage key, such as `egimt:v1`.
- Save inventory items, app settings, and storm-mode status.
- Validate data before restore.
- Preserve existing data until restore validation succeeds.
- Include schema version to support future migrations.

## Routing Requirements

Recommended routes:

- `/` Dashboard
- `/inventory` Inventory List
- `/items/new` Create Item
- `/items/:id` Item Detail
- `/items/:id/edit` Edit Item
- `/qr` QR Code Generator / Label Sheet
- `/maintenance` Maintenance Scheduler
- `/expirations` Expiration Tracker
- `/storm` Storm Mode Checklist
- `/reports` Printable Reports
- `/settings` Settings / Backup & Restore

For GitHub Pages, prefer `HashRouter` so direct QR links resolve reliably:

```text
https://USER.github.io/REPO/#/items/ITEM_ID
```

## Module Requirements

### Dashboard

- Show total items.
- Show critical/high priority counts.
- Show overdue maintenance count.
- Show expiring soon count.
- Show unpacked/missing items.
- Show estimated replacement cost.
- Provide quick actions to inventory, storm mode, maintenance, reports, and backup.

### Inventory List

- Search by item name, notes, QR code ID.
- Filter by category, owner/location, packed status, condition, priority, expiration status, and maintenance status.
- Sort by name, priority, next due date, expiration date, location, and category.
- Provide quick packed status update.

### Item Detail Page

- Display all inventory fields.
- Display QR code.
- Display maintenance and expiration status.
- Provide edit, duplicate, delete, mark checked, and print label actions.

### QR Code Generator

- Generate stable QR code from `qrCodeId` or item detail URL.
- Print item labels.
- Export or print selected labels.
- Preserve QR IDs across backup/restore.

### Maintenance Scheduler

- Calculate next due date from `lastCheckedDate + maintenanceIntervalDays`.
- Display overdue, due soon, scheduled, and unscheduled items.
- Allow mark checked action.
- Update last checked and next due dates.

### Expiration Tracker

- Display expired, expiring soon, valid, and no-expiration items.
- Default expiring-soon threshold: 30 days.
- Allow threshold setting in future enhancement.

### Storm Mode Checklist

- Group by location and category.
- Prioritize critical and high-priority items.
- Support packed/deployed/missing actions.
- Provide reset storm state action.
- Print storm checklist.

### Printable Reports

- All inventory report.
- Storm checklist.
- Maintenance report.
- Expiration report.
- QR label sheet.
- Use print CSS to hide navigation and controls.

### Settings / Backup & Restore

- Export JSON backup.
- Import JSON backup.
- Validate schema before restore.
- Show last export/import date if available.
- Provide sample import guidance through README.

## Calendar Export Requirements

- Export `.ics` file containing maintenance and expiration reminders.
- Include event summary, date, item name, location, and notes.
- Use all-day events for due dates.
- Include unique event IDs.
- Test import into Google Calendar.

## Accessibility Requirements

- Buttons and form controls must have accessible labels.
- Touch targets should be at least 44px high where practical.
- Color must not be the only status indicator.
- Print views must remain readable in grayscale.

## Privacy Requirements

- Real family inventory and storage locations should not be committed to a public repository.
- Sample inventory must use non-sensitive example data.
- Backup files should be stored somewhere private.

## Build and Deployment Requirements

- `npm run dev` starts local development.
- `npm run build` creates production files.
- `npm run preview` verifies production build locally.
- GitHub Pages serves the built app.
