# Suggested Folder Structure

```text
emergency-gear-tracker/
  README.md
  MASTER_PROJECT_PLAN.md
  package.json
  vite.config.ts
  tsconfig.json
  index.html
  data/
    sample-starter-inventory.json
  docs/
    TECHNICAL_REQUIREMENTS.md
    DEVELOPMENT_CHECKLIST.md
    TESTING_CHECKLIST.md
    DEPLOYMENT_CHECKLIST.md
    SUGGESTED_FOLDER_STRUCTURE.md
  public/
    icons/
  src/
    main.tsx
    App.tsx
    index.css
    assets/
    components/
      AppShell.tsx
      DashboardCard.tsx
      EmptyState.tsx
      FormField.tsx
      Navigation.tsx
      PrintHeader.tsx
      QRCodeLabel.tsx
      StatusBadge.tsx
    data/
      starterInventory.ts
    features/
      dashboard/
        DashboardPage.tsx
      inventory/
        InventoryListPage.tsx
        InventoryFormPage.tsx
        ItemDetailPage.tsx
        inventoryFilters.ts
      qr/
        QRCodeGeneratorPage.tsx
        qrUtils.ts
      maintenance/
        MaintenanceSchedulerPage.tsx
        maintenanceUtils.ts
      expirations/
        ExpirationTrackerPage.tsx
        expirationUtils.ts
      storm/
        StormModePage.tsx
        stormUtils.ts
      reports/
        PrintableReportsPage.tsx
        ReportPrintLayout.tsx
      settings/
        SettingsPage.tsx
        backupRestore.ts
    hooks/
      useInventory.ts
      useLocalStorage.ts
      usePrint.ts
    lib/
      calendarIcs.ts
      dates.ts
      ids.ts
      storage.ts
      validation.ts
    routes/
      router.tsx
    styles/
      print.css
    types/
      inventory.ts
      backup.ts
      settings.ts
    test/
      fixtures/
      setup.ts
```

## Structure Notes

- Keep domain utilities close to each feature when they are feature-specific.
- Put shared date, storage, validation, calendar, and ID helpers in `src/lib`.
- Keep all TypeScript interfaces in `src/types` unless a type is private to one feature.
- Use `src/features/*` for page-level modules and workflows.
- Use `src/components` for reusable presentation components.
- Keep starter data separate from real family data.
