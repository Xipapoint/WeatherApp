import { useCallback, useRef } from 'react';

const useThrottle = <T extends (...args: unknown[]) => void>(callback: T, delay: number): T => {
  const lastCall = useRef<number>(0)

  return useCallback((...args: Parameters<T>) => {
    const now = Date.now()
    if (now - lastCall.current >= delay) {
      lastCall.current = now
      callback(...args)
    }
  }, [callback, delay]) as T
}
export default useThrottle