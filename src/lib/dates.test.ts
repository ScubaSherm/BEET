import { describe, expect, it } from "vitest";
import { calculateNextDueDate, dueStatus, expirationStatus } from "./dates";

describe("date utilities", () => {
  it("calculates next due dates from last checked date and interval", () => {
    expect(calculateNextDueDate("2026-07-01", 30)).toBe("2026-07-31");
    expect(calculateNextDueDate("2026-07-01", 90)).toBe("2026-09-29");
  });

  it("returns unscheduled states for missing dates", () => {
    expect(dueStatus(undefined, 14)).toBe("Unscheduled");
    expect(expirationStatus(undefined, 30)).toBe("No Expiration");
  });
});
