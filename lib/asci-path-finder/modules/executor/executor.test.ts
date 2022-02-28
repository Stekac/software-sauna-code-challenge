import { Matrix } from "./../fileLoader/types";
import { Char, ParserData, Point } from "../parser/types";
import executor, { getSides } from "./executor";

describe("executor", () => {
  test("should be able to go through a straight line", async () => {
    const startingPoint: Point = { x: 0, y: 0 };
    const matrix: Matrix = [
      [Char.Start, Char.Horizontal, "A" as Char, Char.Horizontal, Char.End],
    ];
    const parserData: ParserData = { startingPoint, matrix };
    const result = await executor(parserData);

    expect(result.path).toBe("@-A-x");
    expect(result.letters).toBe("A");
  });

  test("should be able to make a turn on a crossroad", async () => {
    const startingPoint: Point = { x: 0, y: 0 };
    const matrix: Matrix = [
      [Char.Start, Char.Horizontal, Char.Crossroad],
      [Char.Empty, Char.Empty, Char.Vertical],
      [Char.End, Char.Horizontal, Char.Crossroad],
    ];
    const parserData: ParserData = { startingPoint, matrix };
    const result = await executor(parserData);

    expect(result.path).toBe("@-+|+-x");
    expect(result.letters).toBe("");
  });

  test("should be able to find path in tight spaces", async () => {
    const startingPoint: Point = { x: 0, y: 0 };
    const matrix: Matrix = [
      [Char.Start, Char.Crossroad],
      [Char.Empty, Char.Crossroad, Char.End],
    ];
    const parserData: ParserData = { startingPoint, matrix };
    const result = await executor(parserData);

    expect(result.path).toBe("@++x");
    expect(result.letters).toBe("");
  });

  test("should be able to cross path previously visited", async () => {
    const startingPoint: Point = { x: 0, y: 1 };
    const matrix: Matrix = [
      [Char.Empty, Char.Crossroad, Char.Crossroad],
      [Char.Start, Char.Horizontal, Char.Crossroad],
      [Char.Empty, Char.Vertical],
      [Char.Empty, Char.End],
    ];
    const parserData: ParserData = { startingPoint, matrix };
    const result = await executor(parserData);

    expect(result.path).toBe("@-+++-|x");
    expect(result.letters).toBe("");
  });

  test("should be able to turn if a letter is on crossroad", async () => {
    const startingPoint: Point = { x: 0, y: 0 };
    const matrix: Matrix = [
      [Char.Start, Char.Horizontal, "A" as Char],
      [Char.Empty, Char.Empty, Char.Vertical],
      [Char.Empty, Char.Empty, Char.End],
      [Char.Empty, Char.Empty],
    ];
    const parserData: ParserData = { startingPoint, matrix };
    const result = await executor(parserData);

    expect(result.path).toBe("@-A|x");
    expect(result.letters).toBe("A");
  });

  test("should NOT collect the same letter on the same position twice", async () => {
    const startingPoint: Point = { x: 0, y: 1 };
    const matrix: Matrix = [
      [Char.Empty, Char.Crossroad, Char.Crossroad],
      [Char.Start, "A" as Char, Char.Crossroad],
      [Char.Empty, Char.Vertical],
      [Char.Empty, Char.End],
    ];
    const parserData: ParserData = { startingPoint, matrix };
    const result = await executor(parserData);

    expect(result.path).toBe("@A+++A|x");
    expect(result.letters).toBe("A");
  });
});

describe("executor errors", () => {
  test("should throw error if no starting point provided", async () => {
    try {
      const startingPoint = undefined;
      const matrix: Matrix = [];
      const parserData: Partial<ParserData> = { startingPoint, matrix };
      await executor(parserData as ParserData);
    } catch (error) {
      expect((error as Error).message).toBe("No starting point provided");
    }
  });

  test("should throw error if no matrix provided", async () => {
    try {
      const startingPoint: Point = { x: 0, y: 0 };
      const matrix = undefined;
      const parserData: Partial<ParserData> = { startingPoint, matrix };
      await executor({ startingPoint } as ParserData);
    } catch (error) {
      expect((error as Error).message).toBe("No data provided");
    }
  });

  test("should throw error if there is no end character", async () => {
    try {
      const startingPoint: Point = { x: 0, y: 0 };
      const matrix: Matrix = [
        [Char.Start, Char.Crossroad],
        [Char.Empty, Char.Crossroad, Char.Empty],
      ];
      const parserData: ParserData = { startingPoint, matrix };
      await executor(parserData);
    } catch (error) {
      expect((error as Error).message).toBe("No direction");
    }
  });

  test("should throw error if there are multiple starts", async () => {
    try {
      const startingPoint: Point = { x: 0, y: 0 };
      const matrix: Matrix = [
        [Char.Start, Char.Crossroad],
        [Char.Empty, Char.Start, Char.Empty],
      ];
      const parserData: ParserData = { startingPoint, matrix };
      await executor(parserData);
    } catch (error) {
      expect((error as Error).message).toBe("No direction");
    }
  });

  test("should throw error on T forks", async () => {
    try {
      const startingPoint: Point = { x: 0, y: 1 };
      const matrix: Matrix = [
        [Char.Empty, Char.Empty, Char.Vertical],
        [Char.Start, Char.Horizontal, Char.Crossroad],
        [Char.Empty, Char.Empty, Char.Vertical],
      ];
      const parserData: ParserData = { startingPoint, matrix };
      await executor(parserData);
    } catch (error) {
      expect((error as Error).message).toBe("Multiple sides");
    }
  });

  test("should throw error on broken path", async () => {
    try {
      const startingPoint: Point = { x: 0, y: 1 };
      const matrix: Matrix = [
        [Char.Start, Char.Crossroad],
        [Char.Start, Char.Vertical],
        [Char.Empty, Char.Empty],
        [Char.Empty, Char.End],
      ];
      const parserData: ParserData = { startingPoint, matrix };
      await executor(parserData);
    } catch (error) {
      expect((error as Error).message).toBe("No direction");
    }
  });

  test("should throw error on fake turn", async () => {
    try {
      const startingPoint: Point = { x: 0, y: 0 };
      const matrix: Matrix = [
        [
          Char.Start,
          Char.Horizontal,
          Char.Crossroad,
          Char.Horizontal,
          Char.End,
        ],
      ];
      const parserData: ParserData = { startingPoint, matrix };
      await executor(parserData);
    } catch (error) {
      expect((error as Error).message).toBe("No direction");
    }
  });
});

describe("microtests example", () => {
  test("should get sides on matrix at a given point", () => {
    const currentPoint: Point = { x: 0, y: 1 };
    const matrix: Matrix = [
      [Char.Horizontal],
      [Char.Start, Char.Empty],
      [Char.Vertical],
    ];
    const result = getSides(matrix, currentPoint);

    expect(result.bottom).toBe(Char.Vertical);
    expect(result.top).toBe(Char.Horizontal);
    expect(result.left).toBe(undefined);
    expect(result.right).toBe(Char.Empty);
  });
});
