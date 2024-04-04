import type { AppProps } from "next/app";
import "../styles/globals.css";
import { SudokuContextProvider } from "../src/contexts/sudoku-context";
import { fromString } from "../src/lib/utils/sudoku";
import { samples } from "../src/lib/sampleSudokus";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

function MyApp({ Component, pageProps }: AppProps) {
  const [sudoku, setSudoku] = useState(fromString(samples[2]));
  const router = useRouter();

  return (
    <SudokuContextProvider value={{ sudoku, setSudoku }}>
      <div className={"flex justify-center"}>
        <Link
          className={"p-2" + (router.pathname == "/scan" ? " font-bold" : "")}
          href={"/scan"}
        >
          Scanner
        </Link>
        <Link
          className={"p-2" + (router.pathname == "/" ? " font-bold" : "")}
          href={"/"}
        >
          Solver
        </Link>
      </div>
      <Component {...pageProps} />
    </SudokuContextProvider>
  );
}

export default MyApp;
