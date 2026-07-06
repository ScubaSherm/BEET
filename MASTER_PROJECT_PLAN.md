# Emergency Gear Inventory and Maintenance Tracker - Master Project Plan

Version: 1.0  
Date: 2026-07-06  
Prepared for: Family emergency preparedness web app build  
Primary delivery method: React + TypeScript + Vite + Tailwind CSS deployed to GitHub Pages

## 1. Project Charter

### Project Purpose

Build a mobile-friendly web application that tracks family hurricane and emergency gear across backpacks, truck kits, trailer kits, medical bags, power gear, radios, food, water, and tools, plus family preparedness training. The system will help the family know what is packed, where it is stored, when it expires, when it needs maintenance, what must be deployed during storm preparation, and which skills each family member has learned and practiced.

### Project Goal

Deliver a static web app that runs in the browser, stores data locally first, supports JSON backup and restore, generates QR codes for inventory labels, exports calendar reminders, prints checklists, and provides a storm-mode workflow for rapid deployment.

### Business Case

Emergency gear loses value if items are expired, misplaced, unpacked, uncharged, damaged, or forgotten. A lightweight family-owned app reduces readiness gaps, improves accountability, and avoids dependency on a hosted database during storm season.

### Success Criteria

- Family inventory can be created, edited, checked, filtered, printed, exported, and restored.
- App works well on phones, tablets, and desktop browsers.
- Inventory persists in LocalStorage and can be backed up as JSON.
- QR labels identify items and open item detail views.
- Maintenance and expiration dates are visible on dashboard and reports.
- Storm Mode provides a focused deployment checklist.
- Calendar reminders export as `.ics` files compatible with Google Calendar.
- Site is deployed successfully to GitHub Pages.

### Constraints

- Static frontend only for initial release.
- LocalStorage-first persistence.
- No login or cloud sync in v1.
- Must be usable offline after first load where browser caching permits.
- GitHub Pages deployment path must be accounted for in Vite config.

### Assumptions

- Family users will use one primary browser/device for active management and JSON exports for backup.
- QR codes will encode stable item IDs or app URLs with item query/hash routes.
- Initial data can be loaded from a starter JSON file.
- Calendar exports will be generated client-side.

## 2. Scope Statement

### In Scope

- React + TypeScript + Vite app setup.
- Tailwind CSS styling.
- LocalStorage data service.
- JSON import/export backup.
- Inventory CRUD.
- Dashboard status summaries.
- Item detail pages.
- QR code generation and printable QR labels.
- Maintenance scheduler.
- Expiration tracker.
- Storm Mode checklist.
- Printable checklist and report views.
- `.ics` calendar export.
- Settings and backup/restore view.
- BFPP Training Dashboard with progressive skill levels and monthly challenges.
- GitHub Pages deployment.
- Mobile responsiveness and basic accessibility.

### Out of Scope for v1

- Multi-user accounts.
- Server database.
- Push notifications.
- Native mobile app.
- Barcode product lookup.
- Cloud file storage.
- Role-based permissions.
- Real-time sync.

### Acceptance Criteria

- All required modules are implemented and accessible from navigation.
- Every required inventory field is represented in the data model and UI.
- Data remains after browser refresh.
- Backup export downloads a valid JSON file.
- Backup restore validates imported data before replacing local data.
- QR codes can be printed and scanned back to the correct item.
- Printable views use print-friendly CSS.
- Calendar export produces valid `.ics` events for upcoming expiration and maintenance dates.
- App builds with `npm run build` and deploys from GitHub Pages.

## 3. Stakeholders

| Stakeholder | Role | Interest | Acceptance Focus |
|---|---|---|---|
| Family preparedness lead | Product owner | Complete inventory readiness | Accurate data, simple workflows |
| Adult family members | Primary users | Fast checks and storm deployment | Mobile usability, printouts |
| Drivers/truck kit owners | Inventory owners | Vehicle-specific supplies | Location filters, maintenance status |
| Medical bag owner | Inventory owner | Medication and first aid readiness | Expiration alerts, condition notes |
| Technical builder/Codex | Implementation agent | Step-by-step delivery | Clear requirements and tests |
| Future maintainer | Support role | Keep app usable over time | README, backups, upgrade notes |

## 4. Requirements

### Functional Requirements

| ID | Requirement | Priority |
|---|---|---|
| FR-001 | Create, read, update, and delete inventory items. | Must |
| FR-002 | Store inventory in LocalStorage. | Must |
| FR-003 | Export full inventory and settings to JSON. | Must |
| FR-004 | Import inventory from JSON with validation. | Must |
| FR-005 | Generate QR codes for each inventory item. | Must |
| FR-006 | Scan or open QR URLs to item detail pages where browser support allows. | Should |
| FR-007 | Track item expiration dates. | Must |
| FR-008 | Calculate next maintenance due date from last checked date and interval. | Must |
| FR-009 | Show dashboard counts for overdue, expiring soon, unpacked, damaged, and high-priority items. | Must |
| FR-010 | Provide Storm Mode checklist grouped by location/category/priority. | Must |
| FR-011 | Provide printable inventory, maintenance, expiration, storm, and QR label reports. | Must |
| FR-012 | Export `.ics` calendar file for maintenance and expiration reminders. | Must |
| FR-013 | Support mobile-friendly navigation and forms. | Must |
| FR-014 | Support filtering and search by category, owner/location, packed status, condition, priority, and due status. | Must |
| FR-015 | Include sample starter inventory import file. | Must |

### Nonfunctional Requirements

| ID | Requirement | Priority |
|---|---|---|
| NFR-001 | App must build as a static site for GitHub Pages. | Must |
| NFR-002 | UI must remain usable on 375px wide mobile screens. | Must |
| NFR-003 | Data operations must avoid silent destructive overwrites during restore. | Must |
| NFR-004 | App should load quickly with no backend dependency. | Must |
| NFR-005 | Core workflows should be keyboard accessible. | Should |
| NFR-006 | Print layouts should avoid clipped text and excessive ink usage. | Must |
| NFR-007 | Code should use TypeScript types for inventory, settings, backups, and calendar events. | Must |

### Inventory Data Fields

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

## 5. Work Breakdown Structure

### 1. Project Setup

- Initialize Vite React TypeScript project.
- Install Tailwind CSS.
- Add routing, icon library, QR code library, date utilities, and test tools.
- Configure GitHub Pages base path.
- Establish folder structure.
- Add README and sample data.

### 2. Data Model and Persistence

- Define TypeScript inventory item type.
- Define enums/unions for category, condition, priority, packed status, maintenance interval.
- Define backup file schema.
- Implement LocalStorage repository.
- Implement validation and migration helpers.
- Seed app from starter JSON if no local data exists.

### 3. Inventory CRUD

- Build inventory list view.
- Build add/edit item form.
- Build item detail page.
- Implement delete confirmation.
- Add filters, sorting, and search.
- Add packed/checked quick actions.

### 4. Dashboard

- Add readiness summary cards.
- Add overdue maintenance panel.
- Add expiring soon panel.
- Add unpacked/high-priority panel.
- Add replacement cost summary.
- Add quick links to Storm Mode and reports.

### 5. QR Code System

- Generate stable QR code IDs.
- Render per-item QR code.
- Create printable QR label page.
- Support QR route/query/hash resolution to item detail.
- Document label printing workflow.

### 6. Maintenance and Expiration Logic

- Calculate next due date.
- Flag overdue, due soon, and no schedule.
- Track last checked date.
- Add maintenance scheduler page.
- Add expiration tracker page.
- Add calendar event generation data.

### 7. Printable Checklists and Reports

- Build print route/layout.
- Create all-inventory checklist.
- Create storm checklist.
- Create maintenance report.
- Create expiration report.
- Create QR label sheet.
- Add print CSS.

### 8. Storm Mode

- Create deployment checklist view.
- Group by location, category, and priority.
- Show packed/unpacked/needs action status.
- Add "mark packed", "mark deployed", and "reset storm check" actions.
- Include offline-friendly instructions in README, not in app UI.

### 9. Calendar Export

- Generate `.ics` text from upcoming dates.
- Include maintenance due reminders.
- Include expiration reminders.
- Add download action.
- Test import into Google Calendar.

### 10. Mobile Testing and Polish

- Test major views at mobile/tablet/desktop sizes.
- Fix touch target sizes.
- Verify forms and tables on small screens.
- Verify print views from desktop browser.
- Verify backup/restore on mobile browser where possible.

### 11. GitHub Pages Deployment

- Configure repository.
- Configure deployment script or GitHub Actions.
- Build production app.
- Deploy to GitHub Pages.
- Verify live URL and routing.

### 12. Final Family Inventory Load

- Convert family inventory to JSON.
- Import initial inventory.
- Print QR labels.
- Attach labels to gear.
- Walk family through dashboard, Storm Mode, reports, and backup routine.

## 6. Milestones / Landmarks

| Milestone | Name | Exit Criteria |
|---|---|---|
| 1 | Project setup | Vite app runs locally, Tailwind works, repository initialized. |
| 2 | Data model complete | Inventory types, sample JSON, LocalStorage repository, and validation exist. |
| 3 | Inventory CRUD complete | User can add, edit, view, delete, filter, and persist inventory items. |
| 4 | Dashboard complete | Readiness summaries and action lists reflect current data. |
| 5 | QR code system complete | Item QR codes render, print, and route to correct detail page. |
| 6 | Maintenance and expiration logic complete | Due dates, overdue states, and expiration statuses are calculated correctly. |
| 7 | Printable checklists complete | Inventory, storm, maintenance, expiration, and QR reports print cleanly. |
| 8 | Storm Mode complete | Deployment workflow is usable on mobile and supports status updates. |
| 9 | Calendar export complete | `.ics` export imports correctly into Google Calendar. |
| 10 | Mobile testing complete | Core flows pass on mobile, tablet, and desktop widths. |
| 11 | GitHub Pages deployment complete | Production site is live and verified. |
| 12 | Final family inventory data loaded | Real inventory is imported, labels printed, and family walkthrough complete. |

## 7. Testing Plan

Each milestone must include the applicable test categories below. Mark "N/A" only when a category truly does not apply.

| Milestone | Feature Tests | Mobile Tests | Persistence Tests | QR Tests | Print Tests | Calendar Tests | Backup Tests | UAT |
|---|---|---|---|---|---|---|---|---|
| 1 | App boots and routes load. | Shell fits mobile viewport. | N/A | N/A | N/A | N/A | N/A | Product owner confirms setup. |
| 2 | Types and date utilities behave correctly. | N/A | Seed/save/load works. | ID format exists. | N/A | Event source data exists. | Sample JSON validates. | Data fields approved. |
| 3 | CRUD, search, filters, sorting. | Forms usable on phone width. | Refresh preserves CRUD changes. | Item has QR ID. | Basic list printable. | N/A | Export includes CRUD changes. | Add/edit workflow approved. |
| 4 | Dashboard counts are correct. | Cards and panels fit. | Counts survive refresh. | QR link from item unaffected. | Dashboard hidden/nonprint elements behave. | N/A | Restored data updates dashboard. | Readiness summary approved. |
| 5 | QR generation per item. | QR detail page works on phone. | QR IDs persist. | Print and scan each sample QR. | QR labels print. | N/A | Restore preserves QR IDs. | Label process approved. |
| 6 | Due/overdue/expiring calculations. | Scheduler usable on phone. | Last checked updates persist. | Scanned item shows due status. | Maintenance/expiration reports print. | Event data matches due dates. | Restored due dates match. | Maintenance workflow approved. |
| 7 | Report filters and grouping. | Report controls fit mobile. | Report uses stored data. | QR labels included. | All reports print without clipping. | N/A | Export after report actions works. | Printed checklist approved. |
| 8 | Storm status actions. | Storm Mode works one-handed. | Storm statuses persist or reset intentionally. | Scanned item can be checked during storm prep. | Storm checklist prints. | N/A | Backup preserves baseline inventory. | Family can complete mock storm run. |
| 9 | ICS generator creates expected events. | Download action accessible. | Calendar settings persist if added. | QR unaffected. | N/A | Import `.ics` into Google Calendar. | Export backup after calendar settings. | Calendar reminders approved. |
| 10 | Regression pass on all modules. | 375px, 768px, desktop checks. | Refresh and reopen pass. | Scan real printed labels. | Desktop print preview pass. | Calendar re-import pass. | Import/export round trip pass. | Product owner signs mobile readiness. |
| 11 | Production build loads. | Live site mobile check. | LocalStorage works on live URL. | Live URL QR codes resolve. | Live print views pass. | Live calendar export pass. | Live backup/restore pass. | Deployment accepted. |
| 12 | Real data loaded correctly. | Family devices spot-check. | Backup created after import. | Real labels scan. | Final checklists print. | Real reminders exported. | Backup file stored safely. | Family walkthrough complete. |

## 8. Progression Notes

Use this log format after every work session.

```md
## YYYY-MM-DD - Milestone X: Name

- Date:
- Milestone:
- Work completed:
- Bugs found:
- Fixes applied:
- Decisions made:
- Next action:
```

### Initial Log Entry

```md
## 2026-07-06 - Milestone 0: Planning

- Date: 2026-07-06
- Milestone: Planning
- Work completed: Created PMP-style master project plan, requirements, checklists, README draft, sample data, and folder structure guidance.
- Bugs found: None.
- Fixes applied: None.
- Decisions made: Use React, TypeScript, Vite, Tailwind CSS, LocalStorage-first persistence, JSON backup/restore, QR generation, print reports, ICS export, and GitHub Pages.
- Next action: Begin Milestone 1 project setup.
```

## 9. Risk Register

| ID | Risk | Probability | Impact | Mitigation | Owner |
|---|---|---|---|---|---|
| R-001 | LocalStorage data is cleared by browser/user. | Medium | High | Provide frequent JSON backup workflow and README instructions. | Product owner |
| R-002 | QR URLs break after GitHub Pages path changes. | Medium | Medium | Centralize route/base path generation and test live QR labels before printing all. | Developer |
| R-003 | Printed QR labels are too small to scan. | Medium | Medium | Use minimum QR size and run real phone scan test. | Developer |
| R-004 | Date calculations produce wrong due dates. | Low | High | Unit test maintenance and expiration utilities. | Developer |
| R-005 | Mobile forms become hard to use with many fields. | Medium | Medium | Use grouped form sections and compact controls. | Developer |
| R-006 | Calendar export format is rejected by Google Calendar. | Medium | Medium | Validate `.ics` structure and test import before completion. | Developer |
| R-007 | Family inventory data is incomplete or inconsistent. | Medium | High | Use starter JSON schema and walkthrough checklist. | Product owner |
| R-008 | GitHub Pages routing causes 404 on item detail links. | Medium | Medium | Use hash routing or configure SPA fallback appropriate for GitHub Pages. | Developer |
| R-009 | App has no server-side privacy protections. | Low | Medium | Keep data local; avoid committing real family inventory to public repo. | Product owner |
| R-010 | Replacement cost totals become outdated. | Medium | Low | Treat costs as planning estimates and review quarterly. | Product owner |

## 10. Final Deployment Plan

### GitHub Repository Setup

- Create repository, preferably private if real family inventory or location details may be committed.
- Add `.gitignore` for dependencies and build output.
- Commit source code, sample data, docs, and README.
- Do not commit real private inventory unless repository visibility and privacy are acceptable.

### Production Build Command

```bash
npm run build
```

### GitHub Pages Deployment

- Configure Vite `base` to match the repository path if deployed under `https://USER.github.io/REPO/`.
- Use GitHub Actions or `gh-pages` package to publish `dist/`.
- Verify live site loads on desktop and mobile.
- Verify refresh behavior and item detail routing.

### QR Code Print/Export Process

- Import or create inventory items.
- Open Printable Reports > QR Labels.
- Print one test page.
- Scan several labels with a phone.
- Confirm each QR opens the expected item detail page.
- Print final labels.
- Attach labels to bins, kits, bags, and high-value individual items.

### Initial Inventory Import

- Prepare JSON using the schema in `data/sample-starter-inventory.json`.
- Open Settings / Backup & Restore.
- Import JSON.
- Review dashboard totals and item counts.
- Correct missing category, location, priority, expiration, or maintenance fields.
- Export a post-import backup.

### Family Walkthrough Checklist

- Open Dashboard and explain readiness counts.
- Show Inventory List search and filters.
- Open one item detail page.
- Scan one QR label.
- Review Maintenance Scheduler.
- Review Expiration Tracker.
- Run a mock Storm Mode checklist.
- Print a storm checklist.
- Export calendar reminders.
- Export JSON backup and store it safely.

### Monthly Maintenance Routine

- Open Dashboard.
- Review overdue and due-soon maintenance.
- Review expiring items.
- Inspect high-priority gear.
- Update condition, quantity, packed status, and last checked date.
- Replace expired or damaged items.
- Export fresh backup.
- Print updated checklists or QR labels as needed.

## 11. Post-Deployment Maintenance Plan

### Monthly

- Run Maintenance Scheduler.
- Check expiration report.
- Verify packed status for emergency bags and vehicle kits.
- Export JSON backup.

### Quarterly

- Test QR labels for scan reliability.
- Review replacement cost estimates.
- Update family locations/owners if gear moved.
- Review README and operating instructions.

### Before Hurricane Season

- Perform full inventory audit.
- Replace expired food, water, medication, and batteries.
- Charge power gear and radios.
- Print fresh storm checklist.
- Confirm calendar reminders.
- Create and safely store a new backup.

### After Storm Use

- Reset Storm Mode.
- Mark consumed or damaged items.
- Add replacement tasks.
- Update notes and condition.
- Export post-event backup.

## Deliverables Index

- PMP-style project plan: `MASTER_PROJECT_PLAN.md`
- Technical requirements document: `docs/TECHNICAL_REQUIREMENTS.md`
- Development checklist: `docs/DEVELOPMENT_CHECKLIST.md`
- Testing checklist: `docs/TESTING_CHECKLIST.md`
- Deployment checklist: `docs/DEPLOYMENT_CHECKLIST.md`
- Sample starter inventory JSON: `data/sample-starter-inventory.json`
- README draft: `README.md`
- Suggested folder structure: `docs/SUGGESTED_FOLDER_STRUCTURE.md`
