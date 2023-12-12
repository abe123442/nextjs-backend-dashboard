import { useState, useEffect } from "react";

// Used to access the window object in Next.
// Since a majority of Next is SSR, we need to wait until the window object exists
// on the client side.
export const useOrigin = () => {
  const [mounted, setMounted] = useState(false);
  const origin = typeof window !== 'undefined' && window.location.origin
                  ? window.location.origin
                  : '';
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return '';
  }

  return origin;
}