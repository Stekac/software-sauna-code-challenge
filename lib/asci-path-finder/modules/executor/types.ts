import { ParserData } from "./../parser/types";

export enum Direction {
  TOP = "top",
  RIGHT = "right",
  BOTTOM = "bottom",
  LEFT = "left",
}

export type ExecutorData = {
  path: string;
  letters: string;
};

export type Executor = (data: ParserData) => Promise<ExecutorData>;
