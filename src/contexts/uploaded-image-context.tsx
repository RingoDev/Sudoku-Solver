import { createContext } from "react";

const imageContext = createContext({
  image: undefined,
  setImage: (_: undefined) => {},
});



export const ImageContext = imageContext;
export const ImageContextProvider = imageContext.Provider;
export const ImageContextConsumer = imageContext.Consumer;
