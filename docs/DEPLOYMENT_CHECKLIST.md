# Deployment Checklist

## Pre-Deployment

- [ ] Repository created.
- [ ] Repository visibility reviewed for privacy.
- [ ] `.gitignore` added.
- [ ] Real family inventory excluded from public commits unless approved.
- [ ] App name and GitHub Pages base path confirmed.
- [ ] README updated with setup, build, backup, and deployment instructions.
- [ ] Tests pass.
- [ ] Production build succeeds.

## GitHub Pages Setup

- [ ] Configure Vite `base` for repository path.
- [ ] Choose deployment method:
  - [ ] GitHub Actions publishing `dist/`.
  - [ ] `gh-pages` package.
- [ ] Configure Pages source in GitHub repository settings.
- [ ] Deploy production build.
- [ ] Open live URL.

## Production Verification

- [ ] Dashboard loads.
- [ ] Inventory list loads.
- [ ] Item detail route loads.
- [ ] LocalStorage persists after refresh.
- [ ] JSON export works.
- [ ] JSON import works.
- [ ] QR codes render.
- [ ] Printed QR labels scan to live item pages.
- [ ] Print reports render correctly.
- [ ] `.ics` calendar export downloads.
- [ ] `.ics` imports into Google Calendar.

## Initial Inventory Import

- [ ] Prepare inventory JSON.
- [ ] Validate required fields.
- [ ] Import JSON through Settings.
- [ ] Confirm item count.
- [ ] Review categories and locations.
- [ ] Review expiration and maintenance dates.
- [ ] Export post-import backup.

## QR Code Print and Label Process

- [ ] Print one test QR label page.
- [ ] Scan sample labels.
- [ ] Confirm correct item pages open.
- [ ] Adjust label sizing if needed.
- [ ] Print final QR labels.
- [ ] Attach labels to kits, bins, bags, and selected individual gear.

## Family Walkthrough

- [ ] Show Dashboard.
- [ ] Show Inventory List.
- [ ] Show one Item Detail page.
- [ ] Scan a QR label.
- [ ] Show Maintenance Scheduler.
- [ ] Show Expiration Tracker.
- [ ] Run Storm Mode demo.
- [ ] Print storm checklist.
- [ ] Export calendar reminders.
- [ ] Export backup.

## Go-Live Signoff

- [ ] Product owner approves app behavior.
- [ ] Family confirms workflow is understandable.
- [ ] Final backup stored privately.
- [ ] Monthly maintenance date scheduled.
