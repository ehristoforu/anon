import { useEffect, useRef } from 'react';

export const useAdaptivePolling = (
  callback: () => Promise<void>,
  minInterval: number,
  maxInterval: number,
  active: boolean
): void => {
  const intervalRef = useRef(minInterval);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (!active) {
      return;
    }
    let disposed = false;

    const tick = async (): Promise<void> => {
      if (disposed) {
        return;
      }
      try {
        await callback();
        intervalRef.current = Math.max(minInterval, Math.floor(intervalRef.current * 0.9));
      } catch {
        intervalRef.current = Math.min(maxInterval, Math.floor(intervalRef.current * 1.4));
      }
      timeoutRef.current = window.setTimeout(tick, intervalRef.current);
    };

    timeoutRef.current = window.setTimeout(tick, intervalRef.current);

    return () => {
      disposed = true;
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, [active, callback, minInterval, maxInterval]);
};
