import { useEffect, useMemo, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import {
  CalendarDays,
  Download,
  FileText,
  Gauge,
  GraduationCap,
  Layers,
  PackageCheck,
  Printer,
  QrCode,
  Settings,
  ShieldAlert,
  Wrench,
} from "lucide-react";
import { calculateNextDueDate, dueStatus, expirationStatus, todayIso } from "./lib/dates";
import { downloadText } from "./lib/download";
import { createIcs } from "./lib/ics";
import { loadBackup, makeBackup, saveBackup, starterFamilyBackup, validateBackup } from "./lib/storage";
import { generatorBasics } from "./data/trainingProgram";
import { starterBackup } from "./data/starterInventory";
import {
  type BackupFile,
  categories,
  conditions,
  InventoryItem,
  KitAsset,
  kitTypes,
  packedStatuses,
  priorities,
  type GearCategory,
  type GearCondition,
  type AssetMaintenancePlan,
  type AssetMaintenanceTask,
  type KitType,
  type PackedStatus,
  type PriorityLevel,
  type SkillRecord,
  type TrainingProgram,
} from "./types/inventory";

const APP_VERSION = (import.meta.env.VITE_BUILD_ID ?? "dev").slice(0, 7);

type View = "dashboard" | "kits" | "inventory" | "detail" | "qr" | "maintenance" | "expirations" | "storm" | "training" | "reports" | "settings";
type FormState = Omit<InventoryItem, "createdAt" | "updatedAt">;
type KitFormState = KitAsset;

const blankForm = (): FormState => ({
  id: `item-${crypto.randomUUID()}`,
  kitId: "kit-dad-go-bag",
  itemName: "",
  category: "Other",
  ownerLocation: "",
  quantity: 1,
  packedStatus: "Unpacked",
  condition: "Good",
  expirationDate: "",
  maintenanceIntervalDays: 30,
  lastCheckedDate: todayIso(),
  nextDueDate: calculateNextDueDate(todayIso(), 30),
  notes: "",
  qrCodeId: `QR-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
  replacementCost: 0,
  priorityLevel: "Medium",
});

const navItems: Array<{ view: View; label: string; icon: typeof Gauge }> = [
  { view: "dashboard", label: "Dashboard", icon: Gauge },
  { view: "kits", label: "Kit Assets", icon: Layers },
  { view: "inventory", label: "Inventory", icon: PackageCheck },
  { view: "maintenance", label: "Maintenance", icon: Wrench },
  { view: "expirations", label: "Expirations", icon: CalendarDays },
  { view: "storm", label: "Storm Mode", icon: ShieldAlert },
  { view: "training", label: "Training", icon: GraduationCap },
  { view: "qr", label: "QR Labels", icon: QrCode },
  { view: "reports", label: "Reports", icon: FileText },
  { view: "settings", label: "Settings", icon: Settings },
];

export default function App() {
  const [backup, setBackup] = useState(() => loadBackup());
  const [view, setView] = useState<View>("dashboard");
  const [selectedId, setSelectedId] = useState(backup.items[0]?.id ?? "");
  const [editingId, setEditingId] = useState<string | "new" | null>(null);
  const [form, setForm] = useState<FormState>(blankForm());
  const [kitForm, setKitForm] = useState<KitFormState | null>(null);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const [notice, setNotice] = useState("");
  const [isOnline, setIsOnline] = useState(() => (typeof navigator === "undefined" ? true : navigator.onLine));

  const items = backup.items;
  const settings = backup.settings;
  const kits = backup.kits;
  const training = backup.training;
  const maintenancePlans = backup.maintenancePlans;
  const selected = items.find((item) => item.id === selectedId) ?? items[0];

  useEffect(() => {
    saveBackup(backup);
  }, [backup]);

  useEffect(() => {
    const updateNetworkStatus = () => setIsOnline(navigator.onLine);
    window.addEventListener("online", updateNetworkStatus);
    window.addEventListener("offline", updateNetworkStatus);
    return () => {
      window.removeEventListener("online", updateNetworkStatus);
      window.removeEventListener("offline", updateNetworkStatus);
    };
  }, []);

  useEffect(() => {
    const openHashItem = () => {
      const match = window.location.hash.match(/^#\/items\/(.+)$/);
      if (match?.[1]) {
        setSelectedId(decodeURIComponent(match[1]));
        setEditingId(null);
        setView("detail");
      }
    };
    openHashItem();
    window.addEventListener("hashchange", openHashItem);
    return () => window.removeEventListener("hashchange", openHashItem);
  }, []);

  const summary = useMemo(() => {
    const overdue = items.filter((item) => dueStatus(item.nextDueDate, settings.maintenanceDueSoonDays) === "Overdue");
    const dueSoon = items.filter((item) => dueStatus(item.nextDueDate, settings.maintenanceDueSoonDays) === "Due Soon");
    const expiring = items.filter((item) => expirationStatus(item.expirationDate, settings.expiringSoonDays) === "Expiring Soon");
    const expired = items.filter((item) => expirationStatus(item.expirationDate, settings.expiringSoonDays) === "Expired");
    const unpacked = items.filter((item) => item.packedStatus === "Unpacked" || item.packedStatus === "Missing");
    const critical = items.filter((item) => item.priorityLevel === "Critical" || item.priorityLevel === "High");
    const replacement = items.reduce((total, item) => total + (item.replacementCost ?? 0), 0);
    return { overdue, dueSoon, expiring, expired, unpacked, critical, replacement };
  }, [items, settings]);

  const filteredItems = useMemo(() => {
    return items
      .filter((item) => {
        const kit = kits.find((candidate) => candidate.id === item.kitId);
        const text = `${item.itemName} ${item.ownerLocation} ${kit?.name} ${item.notes} ${item.qrCodeId}`.toLowerCase();
        const matchesQuery = text.includes(query.toLowerCase());
        const matchesFilter =
          filter === "All" ||
          item.kitId === filter ||
          item.category === filter ||
          item.ownerLocation === filter ||
          item.packedStatus === filter ||
          item.condition === filter ||
          item.priorityLevel === filter;
        return matchesQuery && matchesFilter;
      })
      .sort((a, b) => priorityRank(a.priorityLevel) - priorityRank(b.priorityLevel) || a.itemName.localeCompare(b.itemName));
  }, [items, kits, query, filter]);

  function persistItems(nextItems: InventoryItem[]) {
    setBackup((current) => makeBackup(nextItems, current.settings, current.kits, current.training, current.maintenancePlans));
  }

  function persistTraining(nextTraining: TrainingProgram) {
    setBackup((current) => makeBackup(current.items, current.settings, current.kits, nextTraining, current.maintenancePlans));
  }

  function persistKits(nextKits: KitAsset[]) {
    setBackup((current) => makeBackup(current.items, current.settings, nextKits, current.training, current.maintenancePlans));
  }

  function persistMaintenancePlans(nextPlans: AssetMaintenancePlan[]) {
    setBackup((current) => makeBackup(current.items, current.settings, current.kits, current.training, nextPlans));
  }

  function saveKit(kit: KitAsset) {
    const exists = kits.some((candidate) => candidate.id === kit.id);
    persistKits(exists ? kits.map((candidate) => (candidate.id === kit.id ? kit : candidate)) : [...kits, kit]);
    setKitForm(null);
    setNotice("Kit asset saved.");
  }

  function deleteKit(kitId: string) {
    if (items.some((item) => item.kitId === kitId)) {
      setNotice("Move or delete this kit's items before deleting the kit asset.");
      return;
    }
    if (!window.confirm("Delete this empty kit asset?")) return;
    persistKits(kits.filter((kit) => kit.id !== kitId));
  }

  function startCreate() {
    setEditingId("new");
    setForm(blankForm());
    setView("detail");
  }

  function startEdit(item: InventoryItem) {
    setEditingId(item.id);
    setSelectedId(item.id);
    setForm({
      ...item,
      expirationDate: item.expirationDate ?? "",
      maintenanceIntervalDays: item.maintenanceIntervalDays ?? 30,
      lastCheckedDate: item.lastCheckedDate ?? todayIso(),
      nextDueDate: item.nextDueDate ?? "",
      notes: item.notes ?? "",
      replacementCost: item.replacementCost ?? 0,
    });
    setView("detail");
  }

  function saveForm() {
    if (!form.itemName.trim() || !form.ownerLocation.trim()) {
      setNotice("Item name and owner/location are required.");
      return;
    }

    const now = new Date().toISOString();
    const item: InventoryItem = {
      ...form,
      expirationDate: form.expirationDate || undefined,
      maintenanceIntervalDays: Number(form.maintenanceIntervalDays) || undefined,
      lastCheckedDate: form.lastCheckedDate || undefined,
      nextDueDate: calculateNextDueDate(form.lastCheckedDate, Number(form.maintenanceIntervalDays)) ?? form.nextDueDate,
      notes: form.notes || undefined,
      replacementCost: Number(form.replacementCost) || 0,
      createdAt: editingId && editingId !== "new" ? items.find((existing) => existing.id === editingId)?.createdAt ?? now : now,
      updatedAt: now,
    };

    const nextItems = editingId && editingId !== "new" ? items.map((existing) => (existing.id === editingId ? item : existing)) : [...items, item];
    persistItems(nextItems);
    setSelectedId(item.id);
    setEditingId(null);
    setNotice("Inventory saved.");
    setView("inventory");
  }

  function deleteItem(id: string) {
    if (!window.confirm("Delete this inventory item?")) return;
    const next = items.filter((item) => item.id !== id);
    persistItems(next);
    setSelectedId(next[0]?.id ?? "");
    setView("inventory");
  }

  function duplicateItem(item: InventoryItem) {
    const now = new Date().toISOString();
    const copy: InventoryItem = {
      ...item,
      id: `item-${crypto.randomUUID()}`,
      itemName: `${item.itemName} Copy`,
      qrCodeId: `QR-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
      createdAt: now,
      updatedAt: now,
    };
    persistItems([...items, copy]);
    setSelectedId(copy.id);
    setNotice("Item duplicated.");
    setView("detail");
  }

  function markChecked(item: InventoryItem) {
    const today = todayIso();
    persistItems(
      items.map((candidate) =>
        candidate.id === item.id
          ? {
              ...candidate,
              lastCheckedDate: today,
              nextDueDate: calculateNextDueDate(today, candidate.maintenanceIntervalDays),
              updatedAt: new Date().toISOString(),
            }
          : candidate
      )
    );
  }

  function updatePacked(item: InventoryItem, packedStatus: PackedStatus) {
    persistItems(items.map((candidate) => (candidate.id === item.id ? { ...candidate, packedStatus, updatedAt: new Date().toISOString() } : candidate)));
  }

  function exportBackup() {
    downloadText(`emergency-gear-backup-${todayIso()}.json`, JSON.stringify(makeBackup(items, settings, kits, training, maintenancePlans), null, 2), "application/json");
  }

  async function importBackup(file: File) {
    try {
      const text = await file.text();
      const imported = validateBackup(JSON.parse(text));
      setBackup(imported);
      setSelectedId(imported.items[0]?.id ?? "");
      setNotice("Backup restored.");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Could not import backup.");
    }
  }

  function itemUrl(item: InventoryItem) {
    return `${window.location.origin}${window.location.pathname}#/items/${item.id}`;
  }

  return (
    <div className="min-h-screen bg-[#f3f5ef]">
      <header className="no-print border-b border-black/10 bg-[#061522] text-white shadow-sm">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <img
              src="./baldwin-emergency-tracker-logo.png"
              alt="Baldwin Emergency Equipment Tracker logo"
              className="h-16 w-16 shrink-0 rounded-full border border-white/30 bg-white object-cover shadow-sm sm:h-20 sm:w-20"
            />
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#d9442f]">Prepare - Equip - Track - Protect</p>
              <h1 className="text-2xl font-bold text-white">Baldwin Family Preparedness Tracker</h1>
              <p className="text-sm font-medium text-slate-300">For your family. For anything. Cape Cod.</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`rounded-md px-3 py-2 text-sm font-semibold ring-1 ${
                isOnline ? "bg-white/10 text-slate-100 ring-white/20" : "bg-readiness-amber text-readiness-ink ring-readiness-amber"
              }`}
              title={isOnline ? "Online. Your data is still saved locally in this browser." : "Offline. The app shell and local data are available on this device."}
            >
              {isOnline ? "Online" : "Offline Mode"}
            </span>
            <button className="rounded-md bg-readiness-signal px-4 py-2 font-semibold text-white shadow-sm ring-1 ring-white/20" onClick={() => setView("storm")}>
              Storm Mode
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-5 px-4 py-5 lg:grid-cols-[230px_1fr]">
        <nav className="no-print flex gap-2 overflow-x-auto lg:block lg:space-y-2">
          {navItems.map(({ view: target, label, icon: Icon }) => (
            <button
              key={target}
              onClick={() => setView(target)}
              className={`flex min-h-11 shrink-0 items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold lg:w-full ${
                view === target ? "bg-readiness-pine text-white" : "bg-white text-readiness-ink shadow-sm"
              }`}
              title={label}
            >
              <Icon size={18} />
              <span>{label}</span>
            </button>
          ))}
        </nav>

        <main className="print-surface rounded-md bg-white p-4 shadow-sm sm:p-6">
          {notice && (
            <div className="no-print mb-4 flex items-center justify-between rounded-md border border-readiness-amber/30 bg-readiness-amber/10 px-3 py-2 text-sm">
              <span>{notice}</span>
              <button className="font-semibold" onClick={() => setNotice("")}>
                Clear
              </button>
            </div>
          )}

          {view === "dashboard" && <Dashboard summary={summary} items={items} kits={kits} setView={setView} />}
          {view === "kits" && <KitAssetsPage kits={kits} items={items} kitForm={kitForm} setKitForm={setKitForm} saveKit={saveKit} deleteKit={deleteKit} />}
          {view === "inventory" && (
            <InventoryList
              items={filteredItems}
              kits={kits}
              query={query}
              filter={filter}
              setQuery={setQuery}
              setFilter={setFilter}
              startCreate={startCreate}
              startEdit={startEdit}
              setSelected={(id) => {
                setSelectedId(id);
                setView("detail");
              }}
              updatePacked={updatePacked}
            />
          )}
          {view === "detail" && (
            <ItemDetail
              item={selected}
              kits={kits}
              form={form}
              editingId={editingId}
              setForm={setForm}
              saveForm={saveForm}
              startCreate={startCreate}
              startEdit={startEdit}
              deleteItem={deleteItem}
              duplicateItem={duplicateItem}
              markChecked={markChecked}
              itemUrl={itemUrl}
            />
          )}
          {view === "maintenance" && <Maintenance items={items} kits={kits} plans={maintenancePlans} settings={settings} markChecked={markChecked} markAssetTaskComplete={(planId, taskId) => persistMaintenancePlans(markMaintenanceTaskComplete(maintenancePlans, planId, taskId))} />}
          {view === "expirations" && <Expirations items={items} kits={kits} settings={settings} />}
          {view === "storm" && <StormMode items={items} kits={kits} updatePacked={updatePacked} resetStorm={() => persistItems(items.map(resetStormItem))} />}
          {view === "qr" && <QrLabels items={items} kits={kits} itemUrl={itemUrl} />}
          {view === "training" && <TrainingDashboard training={training} onChangeRecord={(record) => persistTraining(upsertSkillRecord(training, record))} />}
          {view === "reports" && <Reports items={items} kits={kits} settings={settings} />}
          {view === "settings" && (
            <SettingsPage
              exportBackup={exportBackup}
              importBackup={importBackup}
              exportCalendar={() => downloadText(`emergency-gear-calendar-${todayIso()}.ics`, createIcs(items), "text/calendar")}
              resetStarter={() => {
                if (window.confirm("Replace local data with the Baldwin hurricane kit starter plan? Export a backup first if you want to keep current changes.")) {
                  const starter = starterFamilyBackup();
                  setBackup(starter);
                  setSelectedId(starter.items[0]?.id ?? "");
                  setNotice("Loaded Baldwin hurricane kit starter plan.");
                }
              }}
              mergeStarter={() => {
                setBackup((current) => mergeMissingStarterData(current));
                setNotice("Merged any missing Baldwin starter kits, items, training, and maintenance plans.");
              }}
              itemCount={items.length}
              kitCount={kits.length}
            />
          )}
        </main>
      </div>
      <footer className="no-print pb-4 text-center text-xs text-slate-400">Version {APP_VERSION}</footer>
    </div>
  );
}

function Dashboard({ summary, items, kits, setView }: { summary: ReturnType<typeof useDashboardSummary>; items: InventoryItem[]; kits: KitAsset[]; setView: (view: View) => void }) {
  const cards = [
    ["Total Items", items.length, "Inventory records"],
    ["Overdue", summary.overdue.length, "Maintenance needs action"],
    ["Expiring", summary.expiring.length + summary.expired.length, "Rotate or replace soon"],
    ["Unpacked", summary.unpacked.length, "Not ready to deploy"],
    ["Priority", summary.critical.length, "Critical or high priority"],
    ["Replacement", `$${summary.replacement.toFixed(0)}`, "Estimated cost"],
  ];

  return (
    <section className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold">Readiness Dashboard</h2>
          <p className="text-sm text-slate-600">Current family emergency inventory status.</p>
        </div>
        <button className="no-print rounded-md bg-readiness-pine px-4 py-2 font-semibold text-white" onClick={() => setView("inventory")}>
          Open Inventory
        </button>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map(([label, value, help]) => (
          <div key={label} className="rounded-md border border-black/10 bg-readiness-panel p-4">
            <div className="text-sm font-semibold text-slate-600">{label}</div>
            <div className="mt-1 text-3xl font-bold">{value}</div>
            <div className="mt-1 text-sm text-slate-600">{help}</div>
          </div>
        ))}
      </div>
      <div>
        <h3 className="mb-3 text-lg font-bold">Kit Assets</h3>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {kits
            .slice()
            .sort((a, b) => a.deploymentPriority - b.deploymentPriority)
            .map((kit) => {
              const kitItems = items.filter((item) => item.kitId === kit.id);
              const ready = kitItems.filter((item) => item.packedStatus === "Packed").length;
              const attention = kitItems.filter((item) => item.packedStatus === "Missing" || item.condition === "Damaged" || item.condition === "Expired").length;
              return (
                <button key={kit.id} className="rounded-md border border-black/10 bg-white p-4 text-left shadow-sm" onClick={() => setView("inventory")}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold text-readiness-signal">Priority {kit.deploymentPriority}</div>
                      <div className="font-bold">{kit.name}</div>
                      <div className="text-sm text-slate-600">{kit.type}</div>
                    </div>
                    <Badge label={`${ready}/${kitItems.length}`} />
                  </div>
                  <p className="mt-2 text-sm text-slate-600">{kit.description}</p>
                  {attention > 0 && <p className="mt-2 text-sm font-semibold text-readiness-signal">{attention} need attention</p>}
                </button>
              );
            })}
        </div>
      </div>
      <ActionList title="Needs Attention" items={[...summary.overdue, ...summary.expired, ...summary.unpacked].slice(0, 8)} />
    </section>
  );
}

function useDashboardSummary() {
  return {
    overdue: [] as InventoryItem[],
    dueSoon: [] as InventoryItem[],
    expiring: [] as InventoryItem[],
    expired: [] as InventoryItem[],
    unpacked: [] as InventoryItem[],
    critical: [] as InventoryItem[],
    replacement: 0,
  };
}

function KitAssetsPage({
  kits,
  items,
  kitForm,
  setKitForm,
  saveKit,
  deleteKit
}: {
  kits: KitAsset[];
  items: InventoryItem[];
  kitForm: KitFormState | null;
  setKitForm: (kit: KitFormState | null) => void;
  saveKit: (kit: KitAsset) => void;
  deleteKit: (kitId: string) => void;
}) {
  const sortedKits = kits.slice().sort((a, b) => a.deploymentPriority - b.deploymentPriority || a.name.localeCompare(b.name));

  function newKit() {
    setKitForm({
      id: `kit-${crypto.randomUUID()}`,
      name: "",
      type: "Go-Bag",
      ownerLocation: "",
      deploymentPriority: 4,
      description: ""
    });
  }

  return (
    <section className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold">Kit Assets</h2>
          <p className="text-sm text-slate-600">Manage bags, vehicle kits, trailer kits, loading lists, and other preparedness assets.</p>
        </div>
        <button className="no-print rounded-md bg-readiness-pine px-4 py-2 font-semibold text-white" onClick={newKit}>Add Kit Asset</button>
      </div>

      {kitForm && <KitAssetForm kit={kitForm} setKit={setKitForm} saveKit={saveKit} cancel={() => setKitForm(null)} />}

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {sortedKits.map((kit) => {
          const kitItems = items.filter((item) => item.kitId === kit.id);
          const packed = kitItems.filter((item) => item.packedStatus === "Packed").length;
          return (
            <article key={kit.id} className="rounded-md border border-black/10 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-readiness-signal">Priority {kit.deploymentPriority}</div>
                  <h3 className="font-bold">{kit.name}</h3>
                  <p className="text-sm text-slate-600">{kit.type} - {kit.ownerLocation}</p>
                </div>
                <Badge label={`${packed}/${kitItems.length}`} />
              </div>
              <p className="mt-2 text-sm text-slate-600">{kit.description || "No description yet."}</p>
              <div className="no-print mt-3 flex flex-wrap gap-2">
                <button className="rounded-md border px-3 py-2 text-sm font-semibold" onClick={() => setKitForm(kit)}>Edit</button>
                <button className="rounded-md border px-3 py-2 text-sm font-semibold" onClick={() => deleteKit(kit.id)}>Delete</button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function KitAssetForm({ kit, setKit, saveKit, cancel }: { kit: KitFormState; setKit: (kit: KitFormState) => void; saveKit: (kit: KitAsset) => void; cancel: () => void }) {
  function update<K extends keyof KitFormState>(key: K, value: KitFormState[K]) {
    setKit({ ...kit, [key]: value });
  }

  return (
    <div className="rounded-md border border-readiness-pine/30 bg-readiness-panel p-4">
      <h3 className="mb-3 font-bold">Kit Asset Details</h3>
      <div className="grid gap-3 sm:grid-cols-2">
        <Input label="Kit name" value={kit.name} onChange={(value) => update("name", value)} />
        <Input label="Owner/location" value={kit.ownerLocation} onChange={(value) => update("ownerLocation", value)} />
        <Select label="Kit type" value={kit.type} options={kitTypes} onChange={(value) => update("type", value as KitType)} />
        <Select label="Deployment priority" value={String(kit.deploymentPriority)} options={["1", "2", "3", "4"]} onChange={(value) => update("deploymentPriority", Number(value) as KitAsset["deploymentPriority"])} />
        <label className="sm:col-span-2">
          <span className="mb-1 block text-sm font-semibold">Description</span>
          <textarea className="min-h-20 w-full rounded-md border px-3 py-2" value={kit.description} onChange={(event) => update("description", event.target.value)} />
        </label>
      </div>
      <div className="mt-3 flex gap-2">
        <button className="rounded-md bg-readiness-pine px-4 py-2 font-semibold text-white" onClick={() => saveKit({ ...kit, name: kit.name.trim() || "Untitled Kit", ownerLocation: kit.ownerLocation.trim() || "Unassigned" })}>Save Kit</button>
        <button className="rounded-md border px-4 py-2 font-semibold" onClick={cancel}>Cancel</button>
      </div>
    </div>
  );
}

function InventoryList(props: {
  items: InventoryItem[];
  kits: KitAsset[];
  query: string;
  filter: string;
  setQuery: (value: string) => void;
  setFilter: (value: string) => void;
  startCreate: () => void;
  startEdit: (item: InventoryItem) => void;
  setSelected: (id: string) => void;
  updatePacked: (item: InventoryItem, status: PackedStatus) => void;
}) {
  const filters = ["All", ...props.kits.map((kit) => kit.id), ...categories, ...packedStatuses, ...conditions, ...priorities];
  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-bold">Inventory List</h2>
          <p className="text-sm text-slate-600">Search, filter, and update gear status.</p>
        </div>
        <button className="no-print rounded-md bg-readiness-pine px-4 py-2 font-semibold text-white" onClick={props.startCreate}>
          Add Item
        </button>
      </div>
      <div className="no-print grid gap-3 sm:grid-cols-[1fr_220px]">
        <input className="rounded-md border px-3 py-2" placeholder="Search inventory" value={props.query} onChange={(event) => props.setQuery(event.target.value)} />
        <select className="rounded-md border px-3 py-2" value={props.filter} onChange={(event) => props.setFilter(event.target.value)}>
          {filters.map((item) => (
            <option key={item} value={item}>
              {props.kits.find((kit) => kit.id === item)?.name ?? item}
            </option>
          ))}
        </select>
      </div>
      <div className="text-sm font-semibold text-slate-600">Showing {props.items.length} inventory items</div>
      <div className="grid gap-3">
        {props.items.map((item) => (
          <article key={item.id} className="print-break rounded-md border border-black/10 p-3">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <button className="text-left" onClick={() => props.setSelected(item.id)}>
                <h3 className="font-bold">{item.itemName}</h3>
                <p className="text-sm text-slate-600">{kitName(props.kits, item.kitId)} - {item.ownerLocation} - {item.category}</p>
                <p className="text-sm">Qty {item.quantity} - {item.priorityLevel} - {item.condition}</p>
              </button>
              <div className="no-print flex flex-wrap gap-2">
                <select className="rounded-md border px-2 py-2 text-sm" value={item.packedStatus} onChange={(event) => props.updatePacked(item, event.target.value as PackedStatus)}>
                  {packedStatuses.map((status) => (
                    <option key={status}>{status}</option>
                  ))}
                </select>
                <button className="rounded-md border px-3 py-2 text-sm font-semibold" onClick={() => props.startEdit(item)}>
                  Edit
                </button>
              </div>
            </div>
          </article>
        ))}
        {props.items.length === 0 && (
          <div className="rounded-md border border-dashed p-6 text-center">
            <h3 className="font-bold">No items match this view</h3>
            <p className="mt-1 text-sm text-slate-600">Clear search or set the filter back to All to see the full inventory.</p>
            <button className="mt-3 rounded-md border px-4 py-2 font-semibold" onClick={() => { props.setQuery(""); props.setFilter("All"); }}>Clear Filters</button>
          </div>
        )}
      </div>
    </section>
  );
}

function ItemDetail(props: {
  item?: InventoryItem;
  kits: KitAsset[];
  form: FormState;
  editingId: string | "new" | null;
  setForm: (form: FormState) => void;
  saveForm: () => void;
  startCreate: () => void;
  startEdit: (item: InventoryItem) => void;
  deleteItem: (id: string) => void;
  duplicateItem: (item: InventoryItem) => void;
  markChecked: (item: InventoryItem) => void;
  itemUrl: (item: InventoryItem) => string;
}) {
  const item = props.item;
  const isForm = props.editingId !== null || !item;
  if (isForm || !item) {
    return <ItemForm form={props.form} kits={props.kits} setForm={props.setForm} saveForm={props.saveForm} />;
  }
  return (
    <section className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-xl font-bold">{item.itemName}</h2>
          <p className="text-sm text-slate-600">{kitName(props.kits, item.kitId)} - {item.ownerLocation}</p>
        </div>
        <div className="no-print flex flex-wrap gap-2">
          <button className="rounded-md border px-3 py-2 font-semibold" onClick={() => props.markChecked(item)}>Mark Checked</button>
          <button className="rounded-md border px-3 py-2 font-semibold" onClick={() => props.duplicateItem(item)}>Duplicate</button>
          <button className="rounded-md border px-3 py-2 font-semibold" onClick={() => props.startEdit(item)}>Edit</button>
          <button className="rounded-md bg-readiness-signal px-3 py-2 font-semibold text-white" onClick={() => props.deleteItem(item.id)}>Delete</button>
        </div>
      </div>
      <div className="grid gap-4 lg:grid-cols-[1fr_220px]">
        <div className="grid gap-2 rounded-md border p-4 sm:grid-cols-2">
          <Field label="Kit Asset" value={kitName(props.kits, item.kitId)} />
          <Field label="Category" value={item.category} />
          <Field label="Quantity" value={item.quantity} />
          <Field label="Packed Status" value={item.packedStatus} />
          <Field label="Condition" value={item.condition} />
          <Field label="Priority" value={item.priorityLevel} />
          <Field label="Expiration" value={item.expirationDate ?? "None"} />
          <Field label="Last Checked" value={item.lastCheckedDate ?? "None"} />
          <Field label="Next Due" value={item.nextDueDate ?? "None"} />
          <Field label="Replacement Cost" value={`$${(item.replacementCost ?? 0).toFixed(0)}`} />
          <Field label="QR Code ID" value={item.qrCodeId} />
          <div className="sm:col-span-2">
            <Field label="Notes" value={item.notes ?? "None"} />
          </div>
        </div>
        <div className="print-break rounded-md border p-4 text-center">
          <QRCodeSVG value={props.itemUrl(item)} size={168} />
          <p className="mt-2 text-sm font-semibold">{item.qrCodeId}</p>
          <p className="break-all text-xs text-slate-500">{props.itemUrl(item)}</p>
        </div>
      </div>
    </section>
  );
}

function ItemForm({ form, kits, setForm, saveForm }: { form: FormState; kits: KitAsset[]; setForm: (form: FormState) => void; saveForm: () => void }) {
  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    const next = { ...form, [key]: value };
    if (key === "lastCheckedDate" || key === "maintenanceIntervalDays") {
      next.nextDueDate = calculateNextDueDate(next.lastCheckedDate, Number(next.maintenanceIntervalDays));
    }
    setForm(next);
  }

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-bold">Inventory Item</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        <Select label="Kit asset" value={form.kitId} options={kits.map((kit) => kit.id)} optionLabels={Object.fromEntries(kits.map((kit) => [kit.id, kit.name]))} onChange={(value) => update("kitId", value)} />
        <Input label="Item name" value={form.itemName} onChange={(value) => update("itemName", value)} />
        <Input label="Owner/location" value={form.ownerLocation} onChange={(value) => update("ownerLocation", value)} />
        <Select label="Category" value={form.category} options={categories} onChange={(value) => update("category", value as GearCategory)} />
        <Input label="Quantity" type="number" value={form.quantity} onChange={(value) => update("quantity", Number(value))} />
        <Select label="Packed status" value={form.packedStatus} options={packedStatuses} onChange={(value) => update("packedStatus", value as PackedStatus)} />
        <Select label="Condition" value={form.condition} options={conditions} onChange={(value) => update("condition", value as GearCondition)} />
        <Select label="Priority" value={form.priorityLevel} options={priorities} onChange={(value) => update("priorityLevel", value as PriorityLevel)} />
        <Input label="Expiration date" type="date" value={form.expirationDate ?? ""} onChange={(value) => update("expirationDate", value)} />
        <Input label="Maintenance interval days" type="number" value={form.maintenanceIntervalDays ?? 0} onChange={(value) => update("maintenanceIntervalDays", Number(value))} />
        <Input label="Last checked date" type="date" value={form.lastCheckedDate ?? ""} onChange={(value) => update("lastCheckedDate", value)} />
        <Input label="Replacement cost" type="number" value={form.replacementCost ?? 0} onChange={(value) => update("replacementCost", Number(value))} />
        <Input label="QR code ID" value={form.qrCodeId} onChange={(value) => update("qrCodeId", value)} />
        <label className="sm:col-span-2">
          <span className="mb-1 block text-sm font-semibold">Notes</span>
          <textarea className="min-h-24 w-full rounded-md border px-3 py-2" value={form.notes ?? ""} onChange={(event) => update("notes", event.target.value)} />
        </label>
      </div>
      <button className="rounded-md bg-readiness-pine px-4 py-2 font-semibold text-white" onClick={saveForm}>Save Item</button>
    </section>
  );
}

function Maintenance({
  items,
  kits,
  plans,
  settings,
  markChecked,
  markAssetTaskComplete
}: {
  items: InventoryItem[];
  kits: KitAsset[];
  plans: AssetMaintenancePlan[];
  settings: { maintenanceDueSoonDays: number };
  markChecked: (item: InventoryItem) => void;
  markAssetTaskComplete: (planId: string, taskId: string) => void;
}) {
  return (
    <section className="space-y-6">
      <AssetMaintenancePlans plans={plans} settings={settings} markComplete={markAssetTaskComplete} />
      <StatusTable
        title="Gear Maintenance Scheduler"
        kits={kits}
        items={items}
        status={(item) => dueStatus(item.nextDueDate, settings.maintenanceDueSoonDays)}
        date={(item) => item.nextDueDate}
        action={(item) => (
          <button className="no-print rounded-md border px-3 py-2 text-sm font-semibold" onClick={() => markChecked(item)}>Mark Checked</button>
        )}
      />
    </section>
  );
}

function AssetMaintenancePlans({ plans, settings, markComplete }: { plans: AssetMaintenancePlan[]; settings: { maintenanceDueSoonDays: number }; markComplete: (planId: string, taskId: string) => void }) {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-xl font-bold">Truck & Trailer Maintenance Plans</h2>
        <p className="text-sm text-slate-600">Baseline readiness plans for the 2014 Silverado and 2015 Jayco Whitehawk 28DSBH. Confirm exact service intervals with owner and component manuals.</p>
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        {plans.map((plan) => {
          const overdue = plan.tasks.filter((task) => dueStatus(task.nextDueDate, settings.maintenanceDueSoonDays) === "Overdue").length;
          const dueSoon = plan.tasks.filter((task) => dueStatus(task.nextDueDate, settings.maintenanceDueSoonDays) === "Due Soon").length;
          return (
            <article key={plan.id} className="rounded-md border border-black/10 p-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="text-sm font-semibold text-readiness-signal">{plan.assetType}</div>
                  <h3 className="text-lg font-bold">{plan.name}</h3>
                  <p className="text-sm text-slate-600">{plan.year} {plan.make} {plan.model}</p>
                  <p className="mt-1 text-sm text-slate-600">{plan.notes}</p>
                </div>
                <div className="flex gap-2">
                  <Badge label={`${overdue} overdue`} />
                  <Badge label={`${dueSoon} soon`} />
                </div>
              </div>
              <div className="mt-4 grid gap-2">
                {plan.tasks
                  .slice()
                  .sort((a, b) => priorityRank(a.priority) - priorityRank(b.priority) || (a.nextDueDate ?? "9999").localeCompare(b.nextDueDate ?? "9999"))
                  .map((task) => (
                    <div key={task.id} className="rounded-md border p-3">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <h4 className="font-bold">{task.task}</h4>
                          <p className="text-sm text-slate-600">
                            {task.intervalMonths ? `Every ${task.intervalMonths} month${task.intervalMonths === 1 ? "" : "s"}` : "As needed"}
                            {task.intervalMiles ? ` or ${task.intervalMiles.toLocaleString()} miles` : ""} - Due {task.nextDueDate ?? "unscheduled"}
                          </p>
                          <p className="text-sm text-slate-600">{task.notes}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge label={dueStatus(task.nextDueDate, settings.maintenanceDueSoonDays)} />
                          <button className="no-print rounded-md border px-3 py-2 text-sm font-semibold" onClick={() => markComplete(plan.id, task.id)}>Done</button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function Expirations({ items, kits, settings }: { items: InventoryItem[]; kits: KitAsset[]; settings: { expiringSoonDays: number } }) {
  return <StatusTable title="Expiration Tracker" kits={kits} items={items} status={(item) => expirationStatus(item.expirationDate, settings.expiringSoonDays)} date={(item) => item.expirationDate} />;
}

function StormMode({ items, kits, updatePacked, resetStorm }: { items: InventoryItem[]; kits: KitAsset[]; updatePacked: (item: InventoryItem, status: PackedStatus) => void; resetStorm: () => void }) {
  const sortedKits = kits.slice().sort((a, b) => a.deploymentPriority - b.deploymentPriority || a.name.localeCompare(b.name));
  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-readiness-signal">Storm Mode Checklist</h2>
          <p className="text-sm text-slate-600">Priority 1: backpacks. Priority 2: truck. Priority 3: trailer only if safe and time permits.</p>
        </div>
        <div className="no-print flex flex-wrap gap-2">
          <button className="rounded-md border px-4 py-2 font-semibold" onClick={resetStorm}>Reset</button>
          <button className="rounded-md border px-4 py-2 font-semibold" onClick={() => window.print()}>Print</button>
        </div>
      </div>
      <div className="space-y-5">
        {sortedKits.map((kit) => {
          const kitItems = items.filter((item) => item.kitId === kit.id).sort((a, b) => priorityRank(a.priorityLevel) - priorityRank(b.priorityLevel) || a.itemName.localeCompare(b.itemName));
          return (
            <div key={kit.id} className="print-break rounded-md border border-black/10 p-3">
              <div className="mb-3">
                <div className="text-sm font-semibold text-readiness-signal">Priority {kit.deploymentPriority}</div>
                <h3 className="text-lg font-bold">{kit.name}</h3>
                <p className="text-sm text-slate-600">{kit.description}</p>
              </div>
              <div className="grid gap-2">
                {kitItems.map((item) => (
                  <article key={item.id} className="rounded-md border p-3">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h4 className="font-bold">{item.itemName}</h4>
                        <p className="text-sm text-slate-600">{item.category} - {item.priorityLevel} - {item.packedStatus}</p>
                      </div>
                      <div className="no-print flex flex-wrap gap-2">
                        {(["Packed", "Unpacked", "Deployed", "Missing"] as PackedStatus[]).map((status) => (
                          <button
                            key={status}
                            className={`rounded-md border px-3 py-2 text-sm font-semibold ${
                              item.packedStatus === status ? "border-readiness-signal bg-readiness-signal text-white" : ""
                            }`}
                            onClick={() => updatePacked(item, status)}
                          >
                            {status}
                          </button>
                        ))}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function QrLabels({ items, kits, itemUrl }: { items: InventoryItem[]; kits: KitAsset[]; itemUrl: (item: InventoryItem) => string }) {
  const [selectedIds, setSelectedIds] = useState(() => new Set(items.map((item) => item.id)));
  const printableItems = items.filter((item) => selectedIds.has(item.id));
  function toggle(id: string) {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  }

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-bold">QR Code Labels</h2>
        <div className="no-print flex flex-wrap gap-2">
          <button className="rounded-md border px-4 py-2 font-semibold" onClick={() => setSelectedIds(new Set(items.map((item) => item.id)))}>Select All</button>
          <button className="rounded-md border px-4 py-2 font-semibold" onClick={() => setSelectedIds(new Set())}>Clear</button>
          <button className="rounded-md border px-4 py-2 font-semibold" onClick={() => window.print()}>Print Labels</button>
        </div>
      </div>
      <div className="no-print grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <label key={item.id} className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm">
            <input type="checkbox" checked={selectedIds.has(item.id)} onChange={() => toggle(item.id)} />
            <span>{item.itemName}</span>
          </label>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {printableItems.map((item) => (
          <div key={item.id} className="print-break rounded-md border p-3 text-center">
            <QRCodeSVG value={itemUrl(item)} size={120} />
            <p className="mt-2 text-sm font-bold">{item.itemName}</p>
            <p className="text-xs text-slate-500">{kitName(kits, item.kitId)}</p>
            <p className="text-xs font-semibold">{item.qrCodeId}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function resetStormItem(item: InventoryItem): InventoryItem {
  if (item.packedStatus !== "Deployed" && item.packedStatus !== "Missing") return item;
  return { ...item, packedStatus: "Packed", updatedAt: new Date().toISOString() };
}

function TrainingDashboard({ training, onChangeRecord }: { training: TrainingProgram; onChangeRecord: (record: SkillRecord) => void }) {
  const [memberId, setMemberId] = useState(training.members[0]?.id ?? "");
  const activeMember = training.members.find((member) => member.id === memberId) ?? training.members[0];
  const currentMonth = new Date().getMonth() + 1;
  const challenge = training.challenges.find((item) => item.month === currentMonth) ?? training.challenges[0];
  const memberRecords = training.records.filter((record) => record.memberId === activeMember?.id);
  const completed = memberRecords.filter((record) => record.demonstrated).length;
  const score = training.skills.length ? Math.round((completed / training.skills.length) * 100) : 0;
  const dueRefresh = training.skills.filter((skill) => {
    const record = memberRecords.find((candidate) => candidate.skillId === skill.id);
    if (!record?.date || !record.demonstrated) return false;
    const practiced = new Date(record.date);
    const refresh = new Date(practiced);
    refresh.setMonth(refresh.getMonth() + skill.refreshMonths);
    return refresh < new Date();
  });

  if (!activeMember) {
    return <p className="text-sm text-slate-600">No family members are configured.</p>;
  }

  return (
    <section className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-xl font-bold">BFPP Training Dashboard</h2>
          <p className="text-sm text-slate-600">Baldwin Family Preparedness Program: practical skills, practiced calmly over time.</p>
        </div>
        <select className="rounded-md border px-3 py-2" value={activeMember.id} onChange={(event) => setMemberId(event.target.value)}>
          {training.members.map((member) => (
            <option key={member.id} value={member.id}>{member.name}</option>
          ))}
        </select>
      </div>

      <div className="grid gap-3 md:grid-cols-4">
        <div className="rounded-md border bg-readiness-panel p-4">
          <div className="text-sm font-semibold text-slate-600">Preparedness Score</div>
          <div className="mt-1 text-3xl font-bold">{score}%</div>
          <div className="text-sm text-slate-600">{completed}/{training.skills.length} skills demonstrated</div>
        </div>
        <div className="rounded-md border bg-white p-4 md:col-span-2">
          <div className="text-sm font-semibold text-readiness-signal">This Month</div>
          <div className="mt-1 font-bold">{challenge?.title}</div>
          <p className="text-sm text-slate-600">{challenge?.focus}</p>
        </div>
        <div className="rounded-md border bg-white p-4">
          <div className="text-sm font-semibold text-slate-600">Due For Refresh</div>
          <div className="mt-1 text-3xl font-bold">{dueRefresh.length}</div>
          <div className="text-sm text-slate-600">Previously demonstrated skills</div>
        </div>
      </div>

      <Certificates training={training} memberId={activeMember.id} />

      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((level) => {
          const skills = training.skills.filter((skill) => skill.level === level);
          const levelName = skills[0]?.levelName;
          return (
            <div key={level} className="rounded-md border border-black/10 p-3">
              <h3 className="text-lg font-bold">Level {level} - {levelName}</h3>
              <div className="mt-3 grid gap-2">
                {skills.map((skill) => {
                  const record = getSkillRecord(training, activeMember.id, skill.id);
                  return (
                    <div key={skill.id} className="rounded-md border p-3">
                      <div className="grid gap-3 lg:grid-cols-[1fr_110px_150px_150px_1fr]">
                        <div>
                          <div className="font-semibold">{skill.skill}</div>
                          <div className="text-xs text-slate-500">Refresh every {skill.refreshMonths} months</div>
                        </div>
                        <label className="flex items-center gap-2 text-sm font-semibold">
                          <input type="checkbox" checked={record.taught} onChange={(event) => onChangeRecord({ ...record, taught: event.target.checked, updatedAt: new Date().toISOString() })} />
                          Taught
                        </label>
                        <label className="flex items-center gap-2 text-sm font-semibold">
                          <input
                            type="checkbox"
                            checked={record.demonstrated}
                            onChange={(event) => onChangeRecord({ ...record, demonstrated: event.target.checked, date: event.target.checked ? record.date || todayIso() : record.date, updatedAt: new Date().toISOString() })}
                          />
                          Demonstrated
                        </label>
                        <input className="rounded-md border px-2 py-2 text-sm" type="date" value={record.date ?? ""} onChange={(event) => onChangeRecord({ ...record, date: event.target.value, updatedAt: new Date().toISOString() })} />
                        <div className="grid gap-2 sm:grid-cols-2">
                          <input className="rounded-md border px-2 py-2 text-sm" placeholder="Instructor" value={record.instructor ?? ""} onChange={(event) => onChangeRecord({ ...record, instructor: event.target.value, updatedAt: new Date().toISOString() })} />
                          <input className="rounded-md border px-2 py-2 text-sm" placeholder="Notes" value={record.notes ?? ""} onChange={(event) => onChangeRecord({ ...record, notes: event.target.value, updatedAt: new Date().toISOString() })} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="rounded-md border border-black/10 p-4">
        <h3 className="font-bold">Suggested Paracord Lessons</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {[
            "Wrap a tool handle",
            "Make a clothesline",
            "Replace a broken shoelace",
            "Secure a tarp",
            "Build a tripod",
            "Hang a bear bag",
            "Lash two poles together",
            "Make a zipper pull",
            "Make a survival bracelet",
            "Practice basic knots"
          ].map((lesson) => (
            <span key={lesson} className="rounded-md bg-slate-100 px-2 py-1 text-sm font-semibold">{lesson}</span>
          ))}
        </div>
      </div>

      <div className="rounded-md border border-readiness-amber/40 bg-readiness-amber/10 p-4">
        <h3 className="font-bold">Generator Basics</h3>
        <p className="mt-1 text-sm text-slate-600">Adult-operated skill set with kid-friendly awareness: where it can run, what to stay away from, and why carbon monoxide matters.</p>
        <div className="mt-3 grid gap-2 md:grid-cols-2">
          {generatorBasics.map((lesson) => (
            <div key={lesson} className="rounded-md bg-white px-3 py-2 text-sm font-medium shadow-sm">{lesson}</div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Certificates({ training, memberId }: { training: TrainingProgram; memberId: string }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
      {[1, 2, 3, 4, 5].map((level) => {
        const skills = training.skills.filter((skill) => skill.level === level);
        const complete = skills.length > 0 && skills.every((skill) => getSkillRecord(training, memberId, skill.id).demonstrated);
        return (
          <div key={level} className={`rounded-md border p-3 ${complete ? "border-readiness-pine bg-readiness-pine text-white" : "bg-white"}`}>
            <div className="text-sm font-semibold">Level {level}</div>
            <div className="font-bold">{skills[0]?.levelName}</div>
            <div className="mt-1 text-sm">{complete ? "Certificate earned" : "In progress"}</div>
          </div>
        );
      })}
    </div>
  );
}

function Reports({ items, kits, settings }: { items: InventoryItem[]; kits: KitAsset[]; settings: { expiringSoonDays: number; maintenanceDueSoonDays: number } }) {
  return (
    <section className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Printable Reports</h2>
        <button className="no-print flex items-center gap-2 rounded-md border px-4 py-2 font-semibold" onClick={() => window.print()}>
          <Printer size={18} /> Print
        </button>
      </div>
      <KitReport kits={kits} items={items} />
      <ReportBlock title="Full Inventory" items={items} detail={(item) => `${kitName(kits, item.kitId)} - ${item.category} - Qty ${item.quantity} - ${item.packedStatus}`} />
      <ReportBlock title="Maintenance Due" items={items.filter((item) => ["Overdue", "Due Soon"].includes(dueStatus(item.nextDueDate, settings.maintenanceDueSoonDays)))} detail={(item) => `${kitName(kits, item.kitId)} - ${dueStatus(item.nextDueDate, settings.maintenanceDueSoonDays)} - ${item.nextDueDate ?? "No date"}`} />
      <ReportBlock title="Expiration Watch" items={items.filter((item) => ["Expired", "Expiring Soon"].includes(expirationStatus(item.expirationDate, settings.expiringSoonDays)))} detail={(item) => `${kitName(kits, item.kitId)} - ${expirationStatus(item.expirationDate, settings.expiringSoonDays)} - ${item.expirationDate ?? "No date"}`} />
    </section>
  );
}

function SettingsPage(props: { exportBackup: () => void; importBackup: (file: File) => void; exportCalendar: () => void; resetStarter: () => void; mergeStarter: () => void; itemCount: number; kitCount: number }) {
  return (
    <section className="space-y-5">
      <div>
        <h2 className="text-xl font-bold">Settings / Backup & Restore</h2>
        <p className="text-sm text-slate-600">{props.kitCount} kits and {props.itemCount} items stored locally in this browser. Once opened, this app can keep loading on this device during an internet outage.</p>
      </div>
      <div className="rounded-md border border-readiness-pine/20 bg-readiness-pine/5 p-3 text-sm text-slate-700">
        Export a JSON backup after meaningful changes and keep a copy in Google Drive. GitHub Pages serves the app; this browser stores the live family data.
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <button className="flex items-center justify-center gap-2 rounded-md bg-readiness-pine px-4 py-3 font-semibold text-white" onClick={props.exportBackup}>
          <Download size={18} /> Export JSON
        </button>
        <label className="flex cursor-pointer items-center justify-center rounded-md border px-4 py-3 font-semibold">
          Import JSON
          <input className="sr-only" type="file" accept="application/json" onChange={(event) => event.target.files?.[0] && props.importBackup(event.target.files[0])} />
        </label>
        <button className="flex items-center justify-center gap-2 rounded-md border px-4 py-3 font-semibold" onClick={props.exportCalendar}>
          <CalendarDays size={18} /> Export .ics
        </button>
        <button className="rounded-md border px-4 py-3 font-semibold" onClick={props.resetStarter}>
          Load Baldwin Starter
        </button>
        <button className="rounded-md border px-4 py-3 font-semibold" onClick={props.mergeStarter}>
          Merge Missing Starter Data
        </button>
      </div>
    </section>
  );
}

function StatusTable(props: {
  title: string;
  kits: KitAsset[];
  items: InventoryItem[];
  status: (item: InventoryItem) => string;
  date: (item: InventoryItem) => string | undefined;
  action?: (item: InventoryItem) => JSX.Element;
}) {
  const sorted = [...props.items].sort((a, b) => (props.date(a) ?? "9999").localeCompare(props.date(b) ?? "9999"));
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-bold">{props.title}</h2>
      <div className="grid gap-3">
        {sorted.map((item) => (
          <article key={item.id} className="print-break rounded-md border p-3">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="font-bold">{item.itemName}</h3>
                <p className="text-sm text-slate-600">{kitName(props.kits, item.kitId)} - {props.date(item) ?? "No date"}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge label={props.status(item)} />
                {props.action?.(item)}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function ReportBlock({ title, items, detail }: { title: string; items: InventoryItem[]; detail: (item: InventoryItem) => string }) {
  return (
    <div className="print-break">
      <h3 className="mb-2 text-lg font-bold">{title}</h3>
      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.id} className="rounded-md border p-2">
            <strong>{item.itemName}</strong>
            <span className="ml-2 text-sm text-slate-600">{detail(item)}</span>
          </div>
        ))}
        {items.length === 0 && <p className="text-sm text-slate-600">No items in this report.</p>}
      </div>
    </div>
  );
}

function KitReport({ kits, items }: { kits: KitAsset[]; items: InventoryItem[] }) {
  return (
    <div className="print-break">
      <h3 className="mb-2 text-lg font-bold">Kit Asset Summary</h3>
      <div className="grid gap-2">
        {kits
          .slice()
          .sort((a, b) => a.deploymentPriority - b.deploymentPriority)
          .map((kit) => {
            const kitItems = items.filter((item) => item.kitId === kit.id);
            const ready = kitItems.filter((item) => item.packedStatus === "Packed").length;
            return (
              <div key={kit.id} className="rounded-md border p-2">
                <strong>{kit.name}</strong>
                <span className="ml-2 text-sm text-slate-600">
                  Priority {kit.deploymentPriority} - {ready}/{kitItems.length} packed - {kit.description}
                </span>
              </div>
            );
          })}
      </div>
    </div>
  );
}

function ActionList({ title, items }: { title: string; items: InventoryItem[] }) {
  return (
    <div className="rounded-md border border-black/10 p-4">
      <h3 className="font-bold">{title}</h3>
      <div className="mt-3 space-y-2">
        {items.map((item) => (
          <div key={item.id} className="flex justify-between gap-3 border-t pt-2 text-sm">
            <span>{item.itemName}</span>
            <span className="text-slate-600">{item.ownerLocation}</span>
          </div>
        ))}
        {items.length === 0 && <p className="text-sm text-slate-600">No urgent items right now.</p>}
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      <div className="text-xs font-semibold uppercase text-slate-500">{label}</div>
      <div className="font-medium">{value}</div>
    </div>
  );
}

function Input({ label, value, onChange, type = "text" }: { label: string; value: string | number; onChange: (value: string) => void; type?: string }) {
  return (
    <label>
      <span className="mb-1 block text-sm font-semibold">{label}</span>
      <input className="w-full rounded-md border px-3 py-2" type={type} value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function Select({ label, value, options, optionLabels = {}, onChange }: { label: string; value: string; options: string[]; optionLabels?: Record<string, string>; onChange: (value: string) => void }) {
  return (
    <label>
      <span className="mb-1 block text-sm font-semibold">{label}</span>
      <select className="w-full rounded-md border px-3 py-2" value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => (
          <option key={option} value={option}>
            {optionLabels[option] ?? option}
          </option>
        ))}
      </select>
    </label>
  );
}

function Badge({ label }: { label: string }) {
  const tone = label.includes("Overdue") || label.includes("Expired") ? "bg-readiness-signal text-white" : label.includes("Soon") ? "bg-readiness-amber text-white" : "bg-slate-100";
  return <span className={`rounded-md px-2 py-1 text-xs font-bold ${tone}`}>{label}</span>;
}

function kitName(kits: KitAsset[], kitId: string) {
  return kits.find((kit) => kit.id === kitId)?.name ?? "Unassigned Kit";
}

function getSkillRecord(training: TrainingProgram, memberId: string, skillId: string): SkillRecord {
  return training.records.find((record) => record.memberId === memberId && record.skillId === skillId) ?? {
    memberId,
    skillId,
    taught: false,
    demonstrated: false,
    updatedAt: new Date().toISOString()
  };
}

function upsertSkillRecord(training: TrainingProgram, record: SkillRecord): TrainingProgram {
  const exists = training.records.some((candidate) => candidate.memberId === record.memberId && candidate.skillId === record.skillId);
  return {
    ...training,
    records: exists
      ? training.records.map((candidate) => (candidate.memberId === record.memberId && candidate.skillId === record.skillId ? record : candidate))
      : [...training.records, record]
  };
}

function markMaintenanceTaskComplete(plans: AssetMaintenancePlan[], planId: string, taskId: string): AssetMaintenancePlan[] {
  const today = todayIso();
  return plans.map((plan) => {
    if (plan.id !== planId) return plan;
    return {
      ...plan,
      tasks: plan.tasks.map((task) => {
        if (task.id !== taskId) return task;
        return {
          ...task,
          lastCompletedDate: today,
          nextDueDate: task.intervalMonths ? calculateNextDueDate(today, task.intervalMonths * 30) : task.nextDueDate
        };
      })
    };
  });
}

function mergeMissingStarterData(current: BackupFile): BackupFile {
  return {
    ...current,
    exportedAt: new Date().toISOString(),
    kits: mergeById(current.kits, starterBackup.kits),
    items: mergeById(current.items, starterBackup.items),
    training: {
      members: mergeById(current.training.members, starterBackup.training.members),
      skills: mergeById(current.training.skills, starterBackup.training.skills),
      records: current.training.records,
      challenges: mergeById(current.training.challenges, starterBackup.training.challenges, "month")
    },
    maintenancePlans: mergeById(current.maintenancePlans, starterBackup.maintenancePlans).map((plan) => {
      const starterPlan = starterBackup.maintenancePlans.find((candidate) => candidate.id === plan.id);
      return starterPlan ? { ...plan, tasks: mergeById(plan.tasks, starterPlan.tasks) } : plan;
    })
  };
}

function mergeById<T, K extends keyof T = "id" & keyof T>(current: T[], starter: T[], key: K = "id" as K): T[] {
  const currentKeys = new Set(current.map((item) => item[key]));
  return [...current, ...starter.filter((item) => !currentKeys.has(item[key]))];
}

function priorityRank(priority: PriorityLevel) {
  return { Critical: 0, High: 1, Medium: 2, Low: 3 }[priority];
}
