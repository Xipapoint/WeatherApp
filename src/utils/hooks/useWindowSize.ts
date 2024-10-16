import { useState, useEffect } from 'react';
import useThrottle from './useThrottleFunction';

const useWindowSize = (throttleDelay: number) => {
  const [size, setSize] = useState({ width: window.innerWidth });

  const handleResize = useThrottle(() => {
    setSize({ width: window.innerWidth });
  }, throttleDelay);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  return size;
};

export default useWindowSize;