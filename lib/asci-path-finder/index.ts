import { Executor } from "./modules/executor/types";
import { AsciPathFinderArgs } from "./types";

const createAsciPathFinder = <InitialProps>({
  loader,
  parser,
  executor,
  logger = console.log,
}: AsciPathFinderArgs<InitialProps>) => {
  const execute = async (
    initialProps: InitialProps
  ): Promise<ReturnType<Executor> | unknown> => {
    try {
      const file = await loader(initialProps);
      const tokens = await parser(file);
      const result = await executor(tokens);

      logger(result);
    } catch (error) {
      if (error instanceof Error) {
        logger(error);
      }

      return error;
    }
  };

  return {
    execute,
  };
};

export default createAsciPathFinder;
