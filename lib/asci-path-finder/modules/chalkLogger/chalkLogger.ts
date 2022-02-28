import chalk from "chalk";
import { ExecutorData } from "../executor/types";

const chalkLogger = (data: ExecutorData | Error) => {
  const log = console.log;

  if (data instanceof Error) {
    log(chalk.redBright(data.message));
  } else {
    log(chalk.bgBlackBright(chalk.white("----------Result:----------")));
    log(chalk.cyanBright(data.path));
    log(chalk.magentaBright(data.letters));
  }
};

export default chalkLogger;
