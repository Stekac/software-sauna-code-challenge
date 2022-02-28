import { Char } from "../parser/types";

export type MatrixValue = Char;
export type Matrix = MatrixValue[][];

export type Loader<InitialProps> = (props: InitialProps) => Promise<Matrix>;

export type FileLoaderProps = { fileName: string };
