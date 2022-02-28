export const charOccuranceInLine = (char: string, line: string) => {
  return [...line.matchAll(new RegExp(char, "g"))];
};
