import "../styles/globals.css";
import { SudokuContextProvider } from "../src/contexts/sudoku-context";
import { SudokuListType } from "../src/lib/utils/sudoku";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { ImageContextProvider } from "../src/contexts/uploaded-image-context";
import { AppProps } from "next/app";

function MyApp({ Component, pageProps }: AppProps) {
  const [sudoku, setSudoku] = useState<SudokuListType>();
  const [imageUrl, setImageUrl] = useState<string>();

  const router = useRouter();

  return (
    <ImageContextProvider value={{ imageUrl, setImageUrl }}>
      <SudokuContextProvider value={{ sudoku, setSudoku }}>
        <div className={"flex"}>
          <Link
            className={"p-2" + (router.pathname == "/" ? " font-bold" : "")}
            href={"/"}
          >
            Upload
          </Link>
          <Link
            className={"p-2" + (router.pathname == "/scan" ? " font-bold" : "")}
            href={"/scan"}
          >
            Scanner
          </Link>
          <Link
            className={
              "p-2" + (router.pathname == "/solve" ? " font-bold" : "")
            }
            href={"/solve"}
          >
            Solver
          </Link>
        </div>
        <Component {...pageProps} />
      </SudokuContextProvider>
    </ImageContextProvider>
  );
}

export default MyApp;
