import { ExecutorData } from "../executor/types";

export type Logger = (data: ExecutorData | Error) => void;
