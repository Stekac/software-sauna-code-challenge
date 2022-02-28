import loader from "./fileLoader";
import { Readable } from "stream";

const EXAMPLE_DATA = "@--A\n   +--x";
const EXAMPLE_RESULT = [
  ["@", "-", "-", "A"],
  [" ", " ", " ", "+", "-", "-", "x"],
];

const readable = new Readable();

jest.mock("fs", () => ({
  createReadStream: jest.fn(() => readable),
}));

beforeEach(() => {
  readable.push(EXAMPLE_DATA);
  readable.push(null);
});

describe("fileLoader", () => {
  test("should load a file give the name of the file", async () => {
    const fileName = "hello";
    const result = await loader({ fileName });

    expect(result).toEqual(EXAMPLE_RESULT);
  });
});
