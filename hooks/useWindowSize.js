import React from 'react';
import { useState, useEffect } from 'react';

export default function useWindowSize() {
  const isSSR = typeof window == 'undefined';
  const [windowSize, setWindowSize] = useState({
    width: isSSR ? 1200 : window.innerWidth,
    height: isSSR ? 800 : window.innerHeight,
  });

  useEffect(() => {
    function changeWindowSize() {
      console.log('Set window height to', window.innerHeight);
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    }
    window.addEventListener('resize', changeWindowSize);

    return () => {
      window.removeEventListener('resize', changeWindowSize);
    };
  }, []);

  return windowSize;
}
