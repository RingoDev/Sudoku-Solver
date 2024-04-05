import { createContext } from "react";

const imageContext = createContext<{
  imageUrl?: string;
  setImageUrl: (_: string | undefined) => void;
}>({
  imageUrl: undefined,
  setImageUrl: (_: string | undefined) => {},
});

export const ImageContext = imageContext;
export const ImageContextProvider = imageContext.Provider;
export const ImageContextConsumer = imageContext.Consumer;
