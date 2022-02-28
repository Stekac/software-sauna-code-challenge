import { Matrix, MatrixValue } from "./../fileLoader/types";
import { Char, Point } from "../parser/types";
import { Direction, Executor, ExecutorData } from "./types";

type Sides = {
  [direction in Direction]: MatrixValue;
};

export const getSides = (matrix: Matrix, currentPoint: Point): Sides => {
  const top = matrix[currentPoint.y - 1]?.[currentPoint.x];
  const bottom = matrix[currentPoint.y + 1]?.[currentPoint.x];
  const left = matrix[currentPoint.y]?.[currentPoint.x - 1];
  const right = matrix[currentPoint.y]?.[currentPoint.x + 1];

  return {
    [Direction.TOP]: top,
    [Direction.RIGHT]: right,
    [Direction.BOTTOM]: bottom,
    [Direction.LEFT]: left,
  };
};

const getDirection = (
  currentPoint: Point,
  lastVisited: Point
): Direction | null => {
  if (!currentPoint || !lastVisited) {
    return null;
  }

  if (currentPoint?.x > lastVisited?.x) {
    return Direction.LEFT;
  }
  if (currentPoint?.x < lastVisited?.x) {
    return Direction.RIGHT;
  }
  if (currentPoint?.y > lastVisited?.y) {
    return Direction.TOP;
  }
  if (currentPoint?.y < lastVisited?.y) {
    return Direction.BOTTOM;
  }

  return null;
};

const isLetter = (val: string) => val && Boolean(val.match(RegExp("[A-Z]")));

const isNextValid = (current: MatrixValue, next: MatrixValue) => {
  const isCurrentLetter = isLetter(current);
  const isNextLetter = isLetter(next);

  if (isCurrentLetter) {
    return (
      isNextLetter ||
      [Char.Crossroad, Char.Horizontal, Char.Vertical, Char.End].includes(next)
    );
  }

  switch (current) {
    case Char.Horizontal:
      return (
        isNextLetter ||
        [Char.Horizontal, Char.Vertical, Char.Crossroad, Char.End].includes(
          next
        )
      );
    case Char.Vertical:
      return (
        isNextLetter ||
        [Char.Vertical, Char.Horizontal, Char.Crossroad, Char.End].includes(
          next
        )
      );
    case Char.Start:
      return (
        isNextLetter ||
        [Char.Horizontal, Char.Vertical, Char.Crossroad, Char.End].includes(
          next
        )
      );
    case Char.Crossroad:
      return (
        isNextLetter ||
        [Char.Crossroad, Char.Horizontal, Char.Vertical, Char.End].includes(
          next
        )
      );
    case Char.End:
    case Char.Empty:
      return false;
    default:
      return false;
  }
};

const findDirection = (
  matrix: Matrix,
  currentPoint: Point,
  visitedPoints: Point[]
) => {
  const currentValue = matrix[currentPoint.y][currentPoint.x];
  const lastVisited = visitedPoints[visitedPoints.length - 1];
  const directionToPrev = getDirection(currentPoint, lastVisited);
  const sides = getSides(matrix, currentPoint);

  const isValidSide = ([sideName, value]: [string, MatrixValue]) => {
    return directionToPrev !== null
      ? sideName !== directionToPrev && isNextValid(currentValue, value)
      : isNextValid(currentValue, value);
  };

  const isValidDirection = ([sideName]: [string, MatrixValue]) => {
    if (currentValue === Char.Crossroad && directionToPrev !== null) {
      if ([Direction.BOTTOM, Direction.TOP].includes(directionToPrev)) {
        return sideName === Direction.LEFT || sideName === Direction.RIGHT;
      }
      if ([Direction.LEFT, Direction.RIGHT].includes(directionToPrev)) {
        return sideName === Direction.TOP || sideName === Direction.BOTTOM;
      }
    }
    return true;
  };

  const validSides = Object.entries(sides)
    .filter(isValidSide)
    .filter(isValidDirection)
    .map(([sideName]) => sideName);

  if (validSides.length > 1) {
    throw new Error("Multiple sides");
  }
  if (validSides.length < 0) {
    throw new Error("No side");
  }

  if (validSides.length === 1) {
    return validSides.at(0) as Direction;
  }

  return null;
};

const getNextPoint = (currentPoint: Point, direction: Direction) => {
  switch (direction) {
    case Direction.TOP:
      return { x: currentPoint.x, y: currentPoint.y - 1 };
    case Direction.BOTTOM:
      return { x: currentPoint.x, y: currentPoint.y + 1 };
    case Direction.LEFT:
      return { x: currentPoint.x - 1, y: currentPoint.y };
    case Direction.RIGHT:
      return { x: currentPoint.x + 1, y: currentPoint.y };

    default:
      return currentPoint;
  }
};

const extractPathAndLetters = (
  matrix: Matrix,
  visitedPoints: Point[]
): ExecutorData => {
  const mapPointToChar = (point: Point) => matrix[point.y][point.x];
  const removeDuplicates = (point: Point, index: number, array: Point[]) => {
    return index === array.findIndex((p) => p.x === point.x && p.y === point.y);
  };

  const path = visitedPoints.map(mapPointToChar).join("");
  const letters = visitedPoints
    .filter(removeDuplicates)
    .map(mapPointToChar)
    .filter(isLetter)
    .join("");

  return {
    path,
    letters,
  };
};

const executor: Executor = async ({ matrix, startingPoint }) => {
  if (!startingPoint) {
    throw new Error("No starting point provided");
  }

  if (!matrix) {
    throw new Error("No data provided");
  }

  if (matrix[startingPoint.y][startingPoint.x] !== Char.Start) {
    throw new Error("Invalid starting point");
  }

  let direction: Direction | null = null;
  let currentPoint = startingPoint;
  const visitedPoints: Point[] = [];

  let isDone = false;

  while (!isDone) {
    if (!direction) {
      const newDirection = findDirection(matrix, currentPoint, visitedPoints);

      if (newDirection) {
        direction = newDirection;
      } else {
        throw new Error("No direction");
      }
    } else if (direction) {
      const nextPoint = getNextPoint(currentPoint, direction);
      const currentValue = matrix[currentPoint.y][currentPoint.x];
      const nextValue = matrix[nextPoint.y]?.[nextPoint.x];

      const lastVisited = visitedPoints[visitedPoints.length - 1];
      const lastKnownDirection = getDirection(lastVisited, currentPoint);

      const isValid = isNextValid(currentValue, nextValue);

      if (
        !isValid ||
        (currentValue === Char.Crossroad && lastKnownDirection === direction)
      ) {
        direction = null;
      } else {
        visitedPoints.push(currentPoint);

        if (nextValue === Char.End) {
          visitedPoints.push(nextPoint);
          isDone = true;
        } else {
          currentPoint = nextPoint;
        }
      }
    }
  }

  const { path, letters } = extractPathAndLetters(matrix, visitedPoints);

  return { path, letters };
};

export default executor;
