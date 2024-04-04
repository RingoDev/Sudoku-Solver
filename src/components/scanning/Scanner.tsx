import React from "react";

import dynamic from "next/dynamic";

const Picture = dynamic(() => import("./uploaded-image"), {
  ssr: false,
});

interface ScannerProps {
  // solveSudoku: (val: SudokuGridType) => void;
}

const Scanner: React.FC<ScannerProps> = () => {
  return <Picture />;
};

export default Scanner;
