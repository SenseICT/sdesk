import { describe, it, expect } from "vitest";
import {
  analyzeText,
  getDifficultyLevel,
  formatReadingTime,
  extractKeywords,
  type TextStats,
} from "./textAnalysis";

describe("textAnalysis", () => {
  describe("analyzeText", () => {
    it("returns zero stats for empty string", () => {
      const result = analyzeText("");
      expect(result.wordCount).toBe(0);
      expect(result.characterCount).toBe(0);
      expect(result.paragraphCount).toBe(0);
      expect(result.readingTime).toBe(0);
    });

    it("returns zero stats for null/undefined", () => {
      expect(analyzeText(null as any)).toEqual<TextStats>({
        wordCount: 0,
        characterCount: 0,
        characterCountNoSpaces: 0,
        paragraphCount: 0,
        readingTime: 0,
        difficultyScore: 0,
      });
    });

    it("counts words correctly", () => {
      const result = analyzeText("Hello world this is a test");
      expect(result.wordCount).toBe(6);
    });

    it("counts characters correctly", () => {
      const result = analyzeText("Hello world");
      expect(result.characterCount).toBe(11);
    });

    it("counts characters without spaces", () => {
      const result = analyzeText("Hello world");
      expect(result.characterCountNoSpaces).toBe(10);
    });

    it("counts paragraphs correctly", () => {
      const result = analyzeText("First paragraph.\n\nSecond paragraph.\n\nThird paragraph.");
      expect(result.paragraphCount).toBe(3);
    });

    it("calculates reading time based on 200 wpm", () => {
      const longText = Array(201).fill("word").join(" ");
      const result = analyzeText(longText);
      expect(result.readingTime).toBe(2);
    });

    it("strips HTML tags", () => {
      const result = analyzeText("<p>Hello world</p>");
      expect(result.wordCount).toBe(2);
    });

    it("strips markdown formatting", () => {
      const result = analyzeText("**bold** and *italic*");
      expect(result.wordCount).toBe(3);
    });

    it("calculates difficulty score", () => {
      const result = analyzeText("Simple text");
      expect(result.difficultyScore).toBeGreaterThanOrEqual(0);
      expect(result.difficultyScore).toBeLessThanOrEqual(100);
    });
  });

  describe("getDifficultyLevel", () => {
    it("returns beginner for low scores", () => {
      expect(getDifficultyLevel(0)).toBe("beginner");
      expect(getDifficultyLevel(39)).toBe("beginner");
    });

    it("returns intermediate for medium scores", () => {
      expect(getDifficultyLevel(40)).toBe("intermediate");
      expect(getDifficultyLevel(69)).toBe("intermediate");
    });

    it("returns advanced for high scores", () => {
      expect(getDifficultyLevel(70)).toBe("advanced");
      expect(getDifficultyLevel(100)).toBe("advanced");
    });
  });

  describe("formatReadingTime", () => {
    it("returns 'Less than 1 min' for zero", () => {
      expect(formatReadingTime(0)).toBe("Less than 1 min");
    });

    it("returns '1 min' for single minute", () => {
      expect(formatReadingTime(1)).toBe("1 min");
    });

    it("returns plural for multiple minutes", () => {
      expect(formatReadingTime(5)).toBe("5 mins");
    });
  });

  describe("extractKeywords", () => {
    it("returns empty array for empty text", () => {
      expect(extractKeywords("")).toEqual([]);
    });

    it("extracts keywords from text", () => {
      const text = "programming software development code programming";
      const keywords = extractKeywords(text, 3);
      expect(keywords).toContain("programming");
      expect(keywords.length).toBeLessThanOrEqual(3);
    });

    it("filters out stop words", () => {
      const text = "the quick brown fox and the lazy dog";
      const keywords = extractKeywords(text);
      expect(keywords).not.toContain("the");
      expect(keywords).not.toContain("and");
    });

    it("respects maxKeywords parameter", () => {
      const text = "word1 word2 word3 word4 word5";
      const keywords = extractKeywords(text, 2);
      expect(keywords.length).toBeLessThanOrEqual(2);
    });

    it("filters short words", () => {
      const text = "a an the big small";
      const keywords = extractKeywords(text);
      expect(keywords).not.toContain("a");
      expect(keywords).not.toContain("an");
    });

    it("handles null input", () => {
      expect(extractKeywords(null as any)).toEqual([]);
    });
  });
});
