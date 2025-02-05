import { useEffect, useCallback } from "react";

const useInterval = (
  callback: (id: NodeJS.Timeout) => void,
  delay: number | null
) => {
  const savedCallback = useCallback(callback, [callback]);

  useEffect(() => {
    if (delay !== null) {
      const id = setInterval(() => {
        savedCallback(id);
      }, delay);
      return () => clearInterval(id);
    }
  }, [delay, savedCallback]);
};

export default useInterval;
