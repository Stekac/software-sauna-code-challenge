import chalkLogger from "lib/asci-path-finder/modules/chalkLogger/chalkLogger";
import fileLoader from "./lib/asci-path-finder/modules/fileLoader/fileLoader";
import parser from "./lib/asci-path-finder/modules/parser/parser";
import executor from "./lib/asci-path-finder/modules/executor/executor";
import createAsciPathFinder from "./lib/asci-path-finder";

/**
 * @abstract Configurable ASCII path finder
 *
 * Some things to notice:
 *
 * 1. Type of params for Loader dictate what type is acceptable for the execute function
 * if you have UrlLoader(params: {url: string}) for example, you can call .execute({url: 'http..'})
 * 2. Logger is optional, default logger is console.log
 */
const asciPathFinder = createAsciPathFinder({
  loader: fileLoader,
  parser,
  executor,
  logger: chalkLogger,
});

asciPathFinder.execute({ fileName: "example1.txt" });
asciPathFinder.execute({ fileName: "example2.txt" });
asciPathFinder.execute({ fileName: "example3.txt" });
asciPathFinder.execute({ fileName: "example4.txt" });
asciPathFinder.execute({ fileName: "example5.txt" });
