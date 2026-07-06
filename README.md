# Baldwin Family Preparedness Tracker

Mobile-friendly web app for tracking family hurricane gear, evacuation kits, maintenance, QR labels, and preparedness training.

Brand logo asset: `public/baldwin-emergency-tracker-logo.png`

## Project Goal

Build a static React app that tracks inventory, QR labels, expiration dates, maintenance schedules, printable checklists, storm deployment status, family preparedness training, JSON backups, and calendar reminders.

## Planned Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- LocalStorage-first data storage
- JSON import/export backup
- QR code generation
- Printable reports
- `.ics` calendar export
- GitHub Pages deployment

## Required App Modules

- Dashboard
- Kit Assets
- Inventory List
- Item Detail Page
- QR Code Generator
- Maintenance Scheduler
- Expiration Tracker
- Storm Mode Checklist
- BFPP Training Dashboard
- Printable Reports
- Settings / Backup & Restore

## Baldwin Family Preparedness Program

The app includes a Training Dashboard for BFPP. Each family member can track progressive preparedness skills across five levels:

- Level 1: Ready
- Level 2: Explorer
- Level 3: Outdoors
- Level 4: Emergency Ready
- Level 5: Advanced

Training records track taught, demonstrated, date, instructor, notes, refresh status, certificates, paracord lesson ideas, and the current monthly family challenge.

Generator basics are included as an adult-operated Advanced skill set, with kid-friendly awareness around safe distance, outdoor-only operation, carbon monoxide, refueling, extension cords, and avoiding overload.

## Kit Asset Model

Inventory is organized around kit assets first, then individual tracked items inside each kit. The starter plan includes 10 kit assets and 204 tracked checklist items from the Baldwin hurricane bug-out and evacuation checklist:

- Dad Go-Bag
- Mom Go-Bag
- Clara Go-Bag
- Grant Go-Bag
- Elise Go-Bag
- Family Medical Bag
- Truck Kit
- Trailer Kit
- Last-Minute Loading List
- Departure Checklist

Storm Mode follows the practical evacuation order: Priority 1 grab backpacks and medical bag, Priority 2 load truck, Priority 3 hook up trailer only if safe and time permits.

The Kit Assets screen can add or edit additional assets such as a dog bag, boat bag, generator tote, basement pump kit, or extra vehicle kit.

## Truck And Trailer Maintenance

The Maintenance page includes dedicated baseline plans for:

- 2014 Chevrolet Silverado
- 2015 Jayco Whitehawk 28DSBH

These plans cover readiness tasks such as tires, brakes, batteries, fluids, hitch/wiring, trailer bearings, roof/sealant checks, propane safety, alarms, and water-system prep. Exact service intervals should be confirmed against the owner and component manuals.

## Inventory Fields

- Item name
- Category
- Owner/location
- Quantity
- Packed status
- Condition
- Expiration date
- Maintenance interval
- Last checked date
- Next due date
- Notes
- QR code ID
- Replacement cost
- Priority level

## Project Documents

- Master plan: `MASTER_PROJECT_PLAN.md`
- Technical requirements: `docs/TECHNICAL_REQUIREMENTS.md`
- Development checklist: `docs/DEVELOPMENT_CHECKLIST.md`
- Testing checklist: `docs/TESTING_CHECKLIST.md`
- Deployment checklist: `docs/DEPLOYMENT_CHECKLIST.md`
- Suggested folder structure: `docs/SUGGESTED_FOLDER_STRUCTURE.md`
- Sample starter inventory: `data/sample-starter-inventory.json`

## Development Commands

These commands apply after the Vite project is initialized.

```bash
npm install
npm run dev
npm run build
npm run preview
```

## GitHub Pages Notes

Use hash routing or configure an SPA fallback so QR links resolve correctly on GitHub Pages. A QR URL should safely open the item detail page, for example:

```text
https://USER.github.io/REPO/#/items/item-first-aid-bag-001
```

## Backup and Restore

The app should store data in LocalStorage first and provide JSON export/import through Settings / Backup & Restore. Store real family backups privately and avoid committing sensitive inventory or location details to a public repository.

## Offline Access

The deployed GitHub Pages app registers a browser service worker and includes a web app manifest. After the app has been opened once on a phone, tablet, or laptop, the app shell can load again from that device during an internet outage.

Important operating model:

- GitHub Pages hosts the app files.
- The browser stores the live family inventory, training, and maintenance data in LocalStorage.
- JSON export/import is the backup and device-transfer path.
- Keep recent JSON exports in Google Drive or another private folder so another device can be restored quickly.

## Monthly Maintenance Routine

1. Open Dashboard.
2. Review overdue maintenance.
3. Review expiring items.
4. Check critical and high-priority gear.
5. Update condition, quantity, packed status, and last checked date.
6. Replace expired or damaged items.
7. Export a fresh JSON backup.

## Build Roadmap

1. Project setup.
2. Data model complete.
3. Inventory CRUD complete.
4. Dashboard complete.
5. QR code system complete.
6. Maintenance and expiration logic complete.
7. Printable checklists complete.
8. Storm Mode complete.
9. Calendar export complete.
10. Mobile testing complete.
11. GitHub Pages deployment complete.
12. Final family inventory data loaded.
