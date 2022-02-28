import { Matrix } from "../fileLoader/types";
import parser from "./parser";
import { Char, Point } from "./types";

describe("parser", () => {
  test("should throw error if no starting point", async () => {
    try {
      const matrix: Matrix = [];
      await parser(matrix);
    } catch (error) {
      expect((error as Error).message).toBe("No starting point");
    }
  });

  test("should throw error if too many starting points", async () => {
    try {
      const matrix: Matrix = [[Char.Start, Char.Crossroad, Char.Start]];
      await parser(matrix);
    } catch (error) {
      expect((error as Error).message).toBe("Too many starting points");
    }
  });

  test("should return starting point if start character is found", async () => {
    const startingPoint: Point = { x: 0, y: 2 };
    const matrix: Matrix = [
      [Char.Crossroad, Char.Crossroad, Char.Empty],
      [Char.End, Char.Vertical, Char.Horizontal],
      [Char.Empty, Char.Crossroad],
    ];

    matrix[startingPoint.y][startingPoint.x] = Char.Start;

    const result = await parser(matrix);

    expect(result.startingPoint).toBeDefined();
    expect(result.startingPoint).toEqual(startingPoint);
  });
});
