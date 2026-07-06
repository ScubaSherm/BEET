# Project Log

## 2026-07-06 - Milestones 1-9: Initial App Execution

- Date: 2026-07-06
- Milestone: 1 through partial 9
- Work completed: Created the Vite React TypeScript app, installed dependencies, added Tailwind CSS, implemented typed inventory data, LocalStorage persistence, JSON backup/restore, dashboard, inventory CRUD, duplicate item action, item detail, QR labels with selectable print batches, maintenance scheduler, expiration tracker, Storm Mode with reset, printable reports, `.ics` calendar export, and date utility tests.
- Bugs found: TypeScript flagged item detail nullability; Vite build required elevated execution because esbuild attempted to resolve paths outside the sandbox.
- Fixes applied: Tightened item detail narrowing, updated TypeScript library target to ES2021, verified TypeScript, ran Vitest, verified the production build with Vite, and completed a browser smoke test.
- Decisions made: Use hash-style QR item URLs for GitHub Pages compatibility and keep the first implementation LocalStorage-first with JSON backups.
- Next action: Complete remaining real-world validation items: scan a printed QR label, test Google Calendar import, perform mobile viewport testing, preview print layouts, configure GitHub Pages, deploy, and load the final family inventory.

## 2026-07-06 - Kit Asset Model Update

- Date: 2026-07-06
- Milestone: Data model and Storm Mode refinement
- Work completed: Added kit assets as first-class records, attached each inventory item to a kit, regenerated starter data from the Baldwin hurricane bug-out checklist, added 10 kit assets and 204 tracked items, updated dashboard kit cards, inventory filtering, item forms, QR labels, reports, Settings reset, and Storm Mode priority grouping.
- Bugs found: Existing LocalStorage data used the older flat inventory shape.
- Fixes applied: Added migration fallback for older backups and a Settings action to load the Baldwin hurricane kit starter plan.
- Decisions made: Model bags, the truck kit, the trailer kit, last-minute loading, and departure tasks as separate assets with nested tracked items. Keep the tone practical for hurricane-season readiness rather than survivalist/doomsday framing.
- Next action: Review quantities/owners with the family, then run real QR print/scan and mobile/print tests.

## 2026-07-06 - BFPP Training Dashboard

- Date: 2026-07-06
- Milestone: Family Preparedness Tracker expansion
- Work completed: Added the Baldwin Family Preparedness Program with five skill levels, five starter family members, 38 preparedness skills, taught/demonstrated tracking, date/instructor/notes fields, preparedness score, refresh count, digital level certificates, paracord lesson ideas, and 12 monthly family challenges.
- Bugs found: Existing backup schema only covered gear inventory.
- Fixes applied: Extended backup/export/import structure to include training data and added migration fallback for older LocalStorage backups.
- Decisions made: Keep training in the same app and backup file so family readiness includes both equipment and practiced skills.
- Next action: Complete launch run-through across mobile, QR labels, print views, backup/restore, calendar export, and GitHub Pages deployment.

## 2026-07-06 - Kit Asset Management

- Date: 2026-07-06
- Milestone: Launch readiness
- Work completed: Added Kit Assets navigation and management UI for creating, editing, and deleting empty kit assets.
- Bugs found: Kit assets existed in the data model but could not be managed through the app.
- Fixes applied: Added a Kit Assets screen with protected delete behavior so kits with existing items cannot be accidentally removed.
- Decisions made: Keep kit deletion conservative and require moving/deleting contained items first.
- Next action: Run full launch verification and deployment prep.

## 2026-07-06 - Generator Basics

- Date: 2026-07-06
- Milestone: Training safety refinement
- Work completed: Added generator-specific BFPP skills and a Generator Basics panel covering outdoor-only operation, carbon monoxide awareness, dry operation, refueling cooldown, fuel safety, extension cords, load management, fire extinguisher readiness, and adult-operation boundaries.
- Bugs found: Generator training was previously represented by one broad skill.
- Fixes applied: Split generator readiness into practical safety skills and regenerated the starter backup JSON.
- Decisions made: Treat generator use as adult-operated with kid-friendly awareness instead of a hands-on child skill.
- Next action: Include generator basics in the launch run-through and November power outage simulation.

## 2026-07-06 - Truck And Trailer Maintenance Plans

- Date: 2026-07-06
- Milestone: Maintenance readiness expansion
- Work completed: Added dedicated maintenance plans for the 2014 Chevrolet Silverado and 2015 Jayco Whitehawk 28DSBH with 20 baseline tasks across truck readiness, towing, trailer tires, bearings, brakes, roof/sealant, propane, batteries, water system, lights, and safety alarms.
- Bugs found: Maintenance previously only tracked gear inventory items.
- Fixes applied: Extended backup data with asset maintenance plans, added migration fallback, regenerated starter JSON, and added truck/trailer sections to the Maintenance page with Done actions.
- Decisions made: Use owner-manual-safe baseline intervals and include notes to verify exact intervals against the truck/trailer/component manuals.
- Next action: Tune task intervals from actual manuals/service records and complete mobile/print/QR launch run-through.

## 2026-07-06 - Inventory Recovery Controls

- Date: 2026-07-06
- Milestone: Launch readiness
- Work completed: Added visible inventory count on the Inventory screen, empty-filter guidance, and a Settings action to merge missing Baldwin starter kits, items, training, and maintenance plans without replacing user edits.
- Bugs found: Older LocalStorage data or active filters can make it look like inventory items disappeared.
- Fixes applied: Added "Merge Missing Starter Data" recovery action and clearer filtered inventory messaging.
- Decisions made: Prefer non-destructive merge recovery over forcing a full reset.
- Next action: Use merge recovery if local test data ever appears incomplete during launch testing.

## 2026-07-06 - Legacy Starter Migration

- Date: 2026-07-06
- Milestone: Launch readiness
- Work completed: Added automatic migration for the original four-item starter demo dataset so it is replaced by the full Baldwin starter plan on load.
- Bugs found: Browser LocalStorage could keep the old four-item demo inventory even after the app code had the full 204-item starter plan.
- Fixes applied: Added a narrow legacy detector for the original four known item IDs and verified the browser now renders 204 items.
- Decisions made: Only auto-replace the exact original demo set; other small user-created inventories are left alone.
- Next action: Continue launch run-through with the full starter dataset loaded.
