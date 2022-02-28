import { charOccuranceInLine } from "./helpers";

describe("helpers", () => {
  test("should return the occurances of a character in a string", () => {
    const result = charOccuranceInLine("a", "a--a--a");

    expect(result).toHaveLength(3);
  });

  test("should return empty array if the character doesn't exist", () => {
    const result = charOccuranceInLine("b", "a--a--a");

    expect(result).toEqual([]);
    expect(result).toHaveLength(0);
  });
});
