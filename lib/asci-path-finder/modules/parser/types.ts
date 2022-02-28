import { Matrix } from "../fileLoader/types";

export enum Char {
  Start = "@",
  End = "x",
  Crossroad = "+",
  Vertical = "|",
  Horizontal = "-",
  Empty = " ",
}

export type Point = { x: number; y: number };

export type ParserData = {
  startingPoint: Point | undefined;
  matrix: Matrix;
};

export type Parser = (matrix: Matrix) => Promise<ParserData>;
