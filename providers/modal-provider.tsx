'use client';

import { StoreModal } from "@/components/modals/store-modal";
import { useEffect, useState } from "react";

/**
 * This provider is included in app/layout.tsx
 * The provider is a client component which can't be added to RootLayout - a server component.
 * This prevents hydration errors caused by desynchronisation between server and client side rendering
 */
export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Until the client component has completed a life cycle, we cannot render it as we are still in
  // server-side rendering
  if (!isMounted) {
    return null;
  }

  return (
    <>
      <StoreModal />
    </>
  );
}