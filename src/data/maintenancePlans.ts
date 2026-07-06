import { calculateNextDueDate } from "../lib/dates";
import type { AssetMaintenancePlan, AssetMaintenanceTask, PriorityLevel } from "../types/inventory";

const checked = "2026-07-06";

export const starterMaintenancePlans: AssetMaintenancePlan[] = [
  {
    id: "asset-2014-silverado",
    name: "2014 Silverado",
    assetType: "Truck",
    year: 2014,
    make: "Chevrolet",
    model: "Silverado",
    notes: "Baseline family readiness plan. Confirm exact service intervals against the owner's manual and actual engine/drivetrain.",
    tasks: [
      task("asset-2014-silverado", "Oil and filter service", 6, "High", "Track mileage and use the owner's manual interval for the exact engine.", 5000),
      task("asset-2014-silverado", "Tire pressure and tread check", 1, "High", "Check spare tire too, especially before evacuation travel."),
      task("asset-2014-silverado", "Rotate tires", 6, "Medium", "Use mileage interval if preferred.", 7500),
      task("asset-2014-silverado", "Battery and terminals inspection", 6, "High", "Clean corrosion and verify strong starts before storm season."),
      task("asset-2014-silverado", "Brake inspection", 6, "High", "Pads, rotors, fluid level, and pedal feel."),
      task("asset-2014-silverado", "Wipers, lights, and washer fluid", 1, "Medium", "Storm travel visibility check."),
      task("asset-2014-silverado", "Belts, hoses, coolant, and leaks", 6, "High", "Seasonal under-hood inspection."),
      task("asset-2014-silverado", "4WD operation check", 6, "Medium", "Exercise controls briefly in a safe location."),
      task("asset-2014-silverado", "Trailer hitch, safety chains, and wiring", 6, "High", "Confirm receiver, ball mount, chains, and 7-pin/lighting before towing."),
      task("asset-2014-silverado", "Fuel level and evacuation readiness", 1, "Critical", "Keep above 3/4 tank when storms threaten.")
    ]
  },
  {
    id: "asset-2015-jayco-whitehawk-28dsbh",
    name: "2015 Jayco Whitehawk 28DSBH",
    assetType: "Trailer",
    year: 2015,
    make: "Jayco",
    model: "Whitehawk 28DSBH",
    notes: "Baseline trailer readiness plan. Confirm intervals against Jayco/component manuals, especially brakes, bearings, tires, propane, and roof sealants.",
    tasks: [
      task("asset-2015-jayco-whitehawk-28dsbh", "Trailer tire pressure, age, and sidewalls", 1, "Critical", "Check before every trip; include spare tire."),
      task("asset-2015-jayco-whitehawk-28dsbh", "Wheel bearings inspection/repack", 12, "Critical", "Follow axle manufacturer guidance; important before long evacuation towing."),
      task("asset-2015-jayco-whitehawk-28dsbh", "Trailer brakes and breakaway battery", 6, "Critical", "Test breakaway switch and braking response safely."),
      task("asset-2015-jayco-whitehawk-28dsbh", "7-pin connector, running lights, brake lights, and signals", 1, "High", "Check before towing."),
      task("asset-2015-jayco-whitehawk-28dsbh", "Roof, seams, windows, and sealant inspection", 6, "High", "Look for cracks, gaps, soft spots, or water intrusion."),
      task("asset-2015-jayco-whitehawk-28dsbh", "Propane system, hoses, and detector", 12, "Critical", "Use qualified service for leaks or component issues."),
      task("asset-2015-jayco-whitehawk-28dsbh", "House battery charge and terminals", 1, "High", "Charge monthly and inspect terminals."),
      task("asset-2015-jayco-whitehawk-28dsbh", "Fresh water system sanitize/flush", 6, "High", "Seasonal water readiness."),
      task("asset-2015-jayco-whitehawk-28dsbh", "Awning, stabilizers, steps, and latches", 6, "Medium", "Inspect, clean, and lubricate per manual."),
      task("asset-2015-jayco-whitehawk-28dsbh", "Fire extinguisher, smoke alarm, and CO alarm", 1, "Critical", "Check dates, charge indicators, and test buttons.")
    ]
  }
];

function task(assetId: string, label: string, intervalMonths: number, priority: PriorityLevel, notes: string, intervalMiles?: number): AssetMaintenanceTask {
  const slug = label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return {
    id: `${assetId}-${slug}`,
    assetId,
    task: label,
    intervalMonths,
    intervalMiles,
    lastCompletedDate: checked,
    nextDueDate: calculateNextDueDate(checked, intervalMonths * 30),
    priority,
    notes
  };
}
