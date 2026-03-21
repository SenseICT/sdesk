import { describe, it, expect } from "vitest";
import {
  getStatusColor,
  getPriorityColor,
  getSourceLabel,
  getStatusLabel,
  getPriorityLabel,
  formatDate,
  formatDateWithTime,
  formatShortDate,
  formatDateWithRelativeTime,
  SOURCE_OPTIONS,
  TASK_STATUS_OPTIONS,
} from "./displayHelpers";

describe("displayHelpers", () => {
  describe("getStatusColor", () => {
    it("returns correct color for open status", () => {
      expect(getStatusColor("open")).toContain("blue");
    });

    it("returns correct color for in_progress status", () => {
      expect(getStatusColor("in_progress")).toContain("indigo");
    });

    it("returns correct color for pending status", () => {
      expect(getStatusColor("pending")).toContain("yellow");
    });

    it("returns correct color for completed status", () => {
      expect(getStatusColor("completed")).toContain("green");
    });

    it("returns correct color for closed status", () => {
      expect(getStatusColor("closed")).toContain("gray");
    });

    it("handles case-insensitive status", () => {
      expect(getStatusColor("OPEN")).toContain("blue");
      expect(getStatusColor("In_Progress")).toContain("indigo");
    });

    it("returns default gray for unknown status", () => {
      expect(getStatusColor("unknown")).toContain("gray");
    });

    it("handles null/undefined status", () => {
      expect(getStatusColor(null as any)).toContain("gray");
      expect(getStatusColor(undefined as any)).toContain("gray");
    });
  });

  describe("getPriorityColor", () => {
    it("returns correct color for low priority", () => {
      expect(getPriorityColor("low")).toContain("green");
    });

    it("returns correct color for medium priority", () => {
      expect(getPriorityColor("medium")).toContain("yellow");
    });

    it("returns correct color for high priority", () => {
      expect(getPriorityColor("high")).toContain("orange");
    });

    it("returns correct color for critical priority", () => {
      expect(getPriorityColor("critical")).toContain("red");
    });

    it("returns correct color for urgent priority", () => {
      expect(getPriorityColor("urgent")).toContain("red");
    });

    it("handles null priority", () => {
      expect(getPriorityColor(null)).toContain("gray");
    });
  });

  describe("formatDate", () => {
    it("formats valid date string", () => {
      const result = formatDate("2024-06-15T10:30:00Z");
      expect(result).toContain("Jun");
      expect(result).toContain("15");
    });

    it("returns N/A for null date", () => {
      expect(formatDate(null)).toBe("N/A");
    });

  it("returns original string for invalid date", () => {
    const result = formatDate("invalid");
    expect(result).toBe("Invalid Date");
  });
  });

  describe("formatDateWithTime", () => {
    it("formats date with time", () => {
      const result = formatDateWithTime("2024-06-15T14:30:00Z");
      expect(result).toContain("Jun");
      expect(result).toContain("2024");
    });

    it("returns N/A for null date", () => {
      expect(formatDateWithTime(null)).toBe("N/A");
    });
  });

  describe("formatDateWithRelativeTime", () => {
    it("returns 'Just now' for recent dates", () => {
      const now = new Date().toISOString();
      expect(formatDateWithRelativeTime(now)).toBe("Just now");
    });

  it("returns minutes ago for dates within an hour", () => {
    const date = new Date(Date.now() - 30 * 60 * 1000).toISOString();
    expect(formatDateWithRelativeTime(date)).toContain("30 min ago");
  });

    it("returns hours ago for dates within a day", () => {
      const date = new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString();
      expect(formatDateWithRelativeTime(date)).toBe("5 hours ago");
    });

    it("returns days ago for dates within a week", () => {
      const date = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString();
      expect(formatDateWithRelativeTime(date)).toBe("3 days ago");
    });
  });

  describe("formatShortDate", () => {
    it("formats date in short format", () => {
      const result = formatShortDate("2024-06-15");
      expect(result).toContain("Jun");
      expect(result).toContain("15");
      expect(result).toContain("2024");
    });

    it("returns N/A for null date", () => {
      expect(formatShortDate(null)).toBe("N/A");
    });
  });

  describe("getSourceLabel", () => {
    it("returns correct label for email source", () => {
      expect(getSourceLabel("email")).toBe("Email");
    });

    it("returns correct label for phone source", () => {
      expect(getSourceLabel("phone")).toBe("Phone");
    });

    it("returns correct label for chat source", () => {
      expect(getSourceLabel("chat")).toBe("Live Chat");
    });

    it("returns correct label for api source", () => {
      expect(getSourceLabel("api")).toBe("API");
    });

    it("handles case-insensitive source", () => {
      expect(getSourceLabel("EMAIL")).toBe("Email");
    });

  it("returns unknown for undefined source", () => {
    expect(getSourceLabel(undefined)).toBe("Web/Portal");
  });
  });

  describe("getStatusLabel", () => {
    it("returns correct label for open status", () => {
      expect(getStatusLabel("open")).toBe("Open");
    });

    it("returns correct label for in_progress status", () => {
      expect(getStatusLabel("in_progress")).toBe("In Progress");
    });

    it("returns correct label for completed status", () => {
      expect(getStatusLabel("completed")).toBe("Completed");
    });

    it("handles case variations", () => {
      expect(getStatusLabel("IN_PROGRESS")).toBe("In Progress");
    });
  });

  describe("getPriorityLabel", () => {
    it("returns correct label for low priority", () => {
      expect(getPriorityLabel("low")).toBe("Low");
    });

    it("returns correct label for medium priority", () => {
      expect(getPriorityLabel("medium")).toBe("Medium");
    });

    it("returns correct label for high priority", () => {
      expect(getPriorityLabel("high")).toBe("High");
    });

    it("handles null priority", () => {
      expect(getPriorityLabel(null)).toBe("Unknown");
    });
  });

  describe("SOURCE_OPTIONS", () => {
    it("contains expected source options", () => {
      expect(SOURCE_OPTIONS).toContainEqual({ value: "email", label: "Email" });
      expect(SOURCE_OPTIONS).toContainEqual({ value: "phone", label: "Phone" });
    });
  });

  describe("TASK_STATUS_OPTIONS", () => {
    it("contains expected status options", () => {
      expect(TASK_STATUS_OPTIONS).toContainEqual({ value: "open", label: "Open" });
      expect(TASK_STATUS_OPTIONS).toContainEqual({ value: "completed", label: "Completed" });
    });
  });
});
