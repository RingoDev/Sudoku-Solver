import React, { useEffect } from "react";
import assertIsNode from "../utils/nodeAssert";

function useOnClickOutside(
  ref: React.RefObject<HTMLDivElement>,
  callback: () => any
) {
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event: MouseEvent) {
      // needed because mousetarget could be something different than a node
      assertIsNode(event.target);
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, callback]);
}

export default useOnClickOutside;
