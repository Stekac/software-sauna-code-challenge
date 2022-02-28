import { ExecutorData } from "../executor/types";
import chalkLogger from "./chalkLogger";

describe("chalkLogger", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should print executor data", () => {
    const logSpy = jest.spyOn(console, "log");
    const data: ExecutorData = { path: "some-path", letters: "some-letters" };
    chalkLogger(data);

    expect(logSpy).toBeCalledTimes(3);
    expect(logSpy.mock.calls[0][0]).toContain("Result");
    expect(logSpy.mock.calls[1][0]).toContain(data.path);
    expect(logSpy.mock.calls[2][0]).toContain(data.letters);
  });

  test("should print error", () => {
    const logSpy = jest.spyOn(console, "log");
    const error = new Error("OH NO!");
    chalkLogger(error);

    expect(logSpy).toBeCalledTimes(1);
    expect(logSpy.mock.calls[0][0]).toContain(error.message);
  });
});
