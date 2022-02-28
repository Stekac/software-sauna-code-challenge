import { charOccuranceInLine } from "../../helpers";
import { Char, Parser, Point } from "./types";

const parser: Parser = async (matrix) => {
  let startingPoint: Point | undefined;

  const hasStartingPoint = matrix.some((row, rowIndex) => {
    const occurancies = charOccuranceInLine(Char.Start, row.join(""));

    if (occurancies.length > 1 || (occurancies.length > 0 && startingPoint)) {
      throw new Error("Too many starting points");
    }

    if (occurancies[0]?.index !== undefined) {
      startingPoint = { x: occurancies[0].index, y: rowIndex };
      return true;
    }
    return false;
  });

  if (!hasStartingPoint) {
    throw new Error("No starting point");
  }

  return { startingPoint, matrix };
};

export default parser;
