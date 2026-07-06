import type { InventoryItem } from "../types/inventory";

function event(id: string, summary: string, date: string, description: string) {
  const compactDate = date.replaceAll("-", "");
  return [
    "BEGIN:VEVENT",
    `UID:${id}@emergency-gear-tracker`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "")}`,
    `DTSTART;VALUE=DATE:${compactDate}`,
    `SUMMARY:${escapeIcs(summary)}`,
    `DESCRIPTION:${escapeIcs(description)}`,
    "END:VEVENT"
  ].join("\r\n");
}

function escapeIcs(value: string) {
  return value.replaceAll("\\", "\\\\").replaceAll(",", "\\,").replaceAll(";", "\\;").replaceAll("\n", "\\n");
}

export function createIcs(items: InventoryItem[]) {
  const events = items.flatMap((item) => {
    const rows: string[] = [];
    if (item.nextDueDate) {
      rows.push(event(`${item.id}-maintenance`, `Maintenance due: ${item.itemName}`, item.nextDueDate, `${item.ownerLocation}. ${item.notes ?? ""}`));
    }
    if (item.expirationDate) {
      rows.push(event(`${item.id}-expiration`, `Expiration: ${item.itemName}`, item.expirationDate, `${item.ownerLocation}. Replace or rotate item.`));
    }
    return rows;
  });

  return ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Emergency Gear Tracker//EN", ...events, "END:VCALENDAR"].join("\r\n");
}
