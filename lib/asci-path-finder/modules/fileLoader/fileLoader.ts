import { FileLoaderProps, Loader, Matrix } from "./types";
import fs from "fs";
import path from "path";
import readline from "readline";
import { Char } from "../parser/types";

const workingDir = path.resolve(__dirname);

const readFile: Loader<FileLoaderProps> = ({ fileName }) =>
  new Promise((resolve, reject) => {
    try {
      var row = 0;
      const matrix: Matrix = [];

      var rd = readline.createInterface({
        input: fs.createReadStream(
          path.resolve(workingDir, "../../../../examples", fileName)
        ),
      });

      rd.on("line", function (line) {
        const trimmedLine = line.trimEnd();

        matrix[row] = trimmedLine.split("") as Char[];
        row += 1;
      });

      rd.on("close", () => {
        return resolve(matrix);
      });
    } catch (error) {
      reject(error);
    }
  });

export default readFile;
