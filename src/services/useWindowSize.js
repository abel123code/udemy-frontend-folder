// useWindowSize.js

import { useState, useEffect } from 'react';

function useWindowSize() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 500);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 500);
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Set the initial width

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isMobile;
}

export default useWindowSize;
