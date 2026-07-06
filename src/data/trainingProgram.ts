import type { FamilyMember, MonthlyChallenge, PreparednessSkill, TrainingProgram } from "../types/inventory";

export const starterMembers: FamilyMember[] = [
  { id: "member-sherman", name: "Sherman", role: "Adult" },
  { id: "member-jillian", name: "Jillian", role: "Adult" },
  { id: "member-clara", name: "Clara", role: "Kid" },
  { id: "member-grant", name: "Grant", role: "Kid" },
  { id: "member-elise", name: "Elise", role: "Kid" }
];

export const starterSkills: PreparednessSkill[] = [
  ...level(1, "Ready", 12, [
    "Know 911 and when to call",
    "Know home address",
    "Identify Mom & Dad's phone numbers",
    "Pack own bug-out bag",
    "Find flashlight in the dark",
    "Turn on weather radio",
    "Know family meeting place",
    "Basic first aid (Band-Aid)"
  ]),
  ...level(2, "Explorer", 12, [
    "Tie square knot",
    "Tie bowline",
    "Coil rope correctly",
    "Fill water bottle safely",
    "Use flashlight signaling",
    "Read a simple map",
    "Use a compass",
    "Identify poison ivy"
  ]),
  ...level(3, "Outdoors", 12, [
    "Build a fire safely (with supervision)",
    "Fire safety and extinguishing",
    "Use a ferro rod",
    "Pitch a tarp shelter",
    "Five uses for paracord",
    "Filter drinking water",
    "Cook on camp stove",
    "Leave No Trace basics"
  ]),
  ...level(4, "Emergency Ready", 12, [
    "Basic CPR awareness (age appropriate)",
    "Treat a minor cut",
    "Use emergency whistle",
    "Change flashlight batteries",
    "Operate NOAA weather radio",
    "Locate shutoffs (water/electric, as appropriate)",
    "Help load evacuation vehicle"
  ]),
  ...level(5, "Advanced", 12, [
    "Operate portable generator safely",
    "Place generator outdoors away from doors, windows, and vents",
    "Keep generator dry and protected from rain without enclosing it",
    "Let generator cool before refueling",
    "Use outdoor-rated extension cords safely",
    "Manage generator load and avoid overload",
    "Recognize carbon monoxide warning signs",
    "Change flat tire",
    "Jump-start a vehicle",
    "Use a chainsaw safely (appropriate age/training)",
    "Create a family evacuation plan",
    "Inventory emergency gear",
    "Use handheld radios properly"
  ])
];

export const paracordLessons = [
  "Wrap a tool handle",
  "Make a clothesline",
  "Replace a broken shoelace",
  "Secure a tarp",
  "Build a tripod",
  "Hang a bear bag (camping context)",
  "Lash two poles together",
  "Make a zipper pull",
  "Make a survival bracelet",
  "Practice basic knots"
];

export const generatorBasics = [
  "Run outdoors only; never in a garage, shed, basement, breezeway, or enclosed porch.",
  "Place far away from doors, windows, vents, and AC intakes.",
  "Keep it dry under a safe open-sided cover; do not run it in rain without protection.",
  "Let the engine cool before refueling.",
  "Store fuel safely and away from living areas, flame, and heat.",
  "Use heavy-duty outdoor-rated extension cords in good condition.",
  "Avoid overloading; start with critical loads only.",
  "Use carbon monoxide alarms and know CO symptoms: headache, dizziness, nausea, confusion.",
  "Know where the fire extinguisher is before starting.",
  "Adults handle operation; kids learn awareness and safe distance."
];

export const starterChallenges: MonthlyChallenge[] = [
  { month: 1, title: "First aid night", focus: "Practice simple household first aid and medical bag familiarity." },
  { month: 2, title: "Knot tying", focus: "Practice square knot, bowline, coiling rope, and paracord uses." },
  { month: 3, title: "Emergency communications", focus: "Practice phone numbers, weather radio, whistle, and radios." },
  { month: 4, title: "Shelter building", focus: "Practice tarp shelter basics and rain gear checks." },
  { month: 5, title: "Water purification", focus: "Practice filters, tablets, water rotation, and safe filling." },
  { month: 6, title: "Camp cooking", focus: "Practice camp stove safety and simple meals." },
  { month: 7, title: "Hurricane preparation", focus: "Review bags, truck kit, trailer kit, and evacuation order." },
  { month: 8, title: "Navigation", focus: "Practice maps, compass, and family meeting points." },
  { month: 9, title: "Home emergency drill", focus: "Run a calm home readiness and departure checklist drill." },
  { month: 10, title: "Fire safety", focus: "Practice fire safety, extinguishing, and safe tool boundaries." },
  { month: 11, title: "Power outage simulation", focus: "Practice lights, battery banks, generator basics, carbon monoxide awareness, and radios." },
  { month: 12, title: "Gear inspection and repacking", focus: "Inspect, repack, rotate food/water, and export a backup." }
];

export const starterTraining: TrainingProgram = {
  members: starterMembers,
  skills: starterSkills,
  records: [],
  challenges: starterChallenges
};

function level(levelNumber: number, levelName: PreparednessSkill["levelName"], refreshMonths: number, skills: string[]): PreparednessSkill[] {
  return skills.map((skill, index) => ({
    id: `bfpp-l${levelNumber}-${String(index + 1).padStart(2, "0")}`,
    level: levelNumber,
    levelName,
    skill,
    refreshMonths
  }));
}
