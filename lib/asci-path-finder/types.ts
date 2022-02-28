import { Logger } from "./modules/chalkLogger/types";
import { Executor } from "./modules/executor/types";
import { Loader } from "./modules/fileLoader/types";
import { Parser } from "./modules/parser/types";

export type AsciPathFinderArgs<InitialProps> = {
  loader: Loader<InitialProps>;
  parser: Parser;
  executor: Executor;
  logger?: Logger;
};
