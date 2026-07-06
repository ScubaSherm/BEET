# Testing Checklist

## Global Regression Tests

- [ ] App loads without console errors.
- [ ] Navigation works for all modules.
- [ ] Refresh preserves data.
- [ ] Search and filters return expected items.
- [ ] Forms validate required fields.
- [ ] Delete requires confirmation.
- [ ] Backup export downloads valid JSON.
- [ ] Backup import validates before restore.
- [ ] Production build succeeds.

## Feature Tests by Milestone

### Milestone 1

- [ ] Vite dev server starts.
- [ ] Tailwind styles render.
- [ ] App shell fits mobile and desktop.

### Milestone 2

- [ ] Sample inventory validates.
- [ ] LocalStorage save/load works.
- [ ] Date utility calculates next due date.
- [ ] Invalid backup data is rejected.

### Milestone 3

- [ ] Add item.
- [ ] Edit item.
- [ ] Delete item.
- [ ] Duplicate item.
- [ ] Search by name and notes.
- [ ] Filter by category, location, status, condition, and priority.

### Milestone 4

- [ ] Dashboard total count is correct.
- [ ] Overdue maintenance count is correct.
- [ ] Expiring soon count is correct.
- [ ] Unpacked/missing count is correct.
- [ ] Replacement cost total is correct.

### Milestone 5

- [ ] Every item has stable QR code ID.
- [ ] QR code renders on item detail.
- [ ] QR label sheet prints.
- [ ] Scanned QR opens correct item.
- [ ] Backup/restore preserves QR IDs.

### Milestone 6

- [ ] Expired item appears in expired list.
- [ ] Expiring-soon item appears in warning list.
- [ ] Overdue maintenance item appears in overdue list.
- [ ] Mark checked updates last checked date.
- [ ] Next due date updates correctly.

### Milestone 7

- [ ] Inventory checklist print preview is readable.
- [ ] Storm checklist print preview is readable.
- [ ] Maintenance report print preview is readable.
- [ ] Expiration report print preview is readable.
- [ ] QR labels do not clip.

### Milestone 8

- [ ] Storm Mode groups items correctly.
- [ ] Critical items appear prominently.
- [ ] Status changes work on mobile.
- [ ] Reset storm state works intentionally.
- [ ] Printed storm checklist matches on-screen data.

### Milestone 9

- [ ] ICS file downloads.
- [ ] ICS contains maintenance events.
- [ ] ICS contains expiration events.
- [ ] ICS imports into Google Calendar.
- [ ] Event titles and dates are correct.

### Milestone 10

- [ ] 375px mobile viewport passes.
- [ ] 768px tablet viewport passes.
- [ ] Desktop viewport passes.
- [ ] No text overlaps or clipped controls.
- [ ] Main workflows work with touch input.

### Milestone 11

- [ ] Production build passes.
- [ ] GitHub Pages site loads.
- [ ] Live route navigation works.
- [ ] Live QR links work.
- [ ] Live backup/restore works.

### Milestone 12

- [ ] Real inventory item count is correct.
- [ ] Real QR labels scan.
- [ ] Final backup exported.
- [ ] Family walkthrough completed.

## User Acceptance Test Script

1. Open the app on a phone.
2. Add a new emergency item.
3. Edit its quantity and condition.
4. Assign category, location, priority, expiration date, and maintenance interval.
5. Confirm it appears on the dashboard if due, expiring, unpacked, or high priority.
6. Open the item detail page.
7. Print or view its QR code.
8. Scan the QR code and confirm it returns to the item.
9. Mark the item checked.
10. Export a JSON backup.
11. Restore from that backup.
12. Print a storm checklist.
13. Export calendar reminders.
14. Confirm the family can explain how to do monthly maintenance.
