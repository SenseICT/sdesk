import { describe, it, expect } from "vitest";
import { cn } from "./cn";

describe("cn utility", () => {
  it("should combine class names", () => {
    const result = cn("foo", "bar");
    expect(result).toBe("foo bar");
  });

  it("should handle conditional classes", () => {
    const result = cn("foo", false && "bar", "baz");
    expect(result).toBe("foo baz");
  });

  it("should handle undefined values", () => {
    const result = cn("foo", undefined, "bar");
    expect(result).toBe("foo bar");
  });

  it("should handle null values", () => {
    const result = cn("foo", null, "bar");
    expect(result).toBe("foo bar");
  });

  it("should return empty string for no inputs", () => {
    const result = cn();
    expect(result).toBe("");
  });

  it("should handle array notation", () => {
    const result = cn(["foo", "bar"]);
    expect(result).toBe("foo bar");
  });

  it("should handle object notation", () => {
    const result = cn({ foo: true, bar: false, baz: true });
    expect(result).toBe("foo baz");
  });

  it("should handle mixed inputs", () => {
    const result = cn("foo", { bar: true }, ["baz", "qux"]);
    expect(result).toContain("foo");
    expect(result).toContain("bar");
    expect(result).toContain("baz");
  });
});
