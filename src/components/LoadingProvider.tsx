"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";

type Ctx = {
  loading: boolean;
  start: () => void;
  end: () => void;
};

const LoadingCtx = createContext<Ctx>({
  loading: false,
  start: () => {},
  end: () => {},
});

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(false);
  const start = useCallback(() => setLoading(true), []);
  const end = useCallback(() => setLoading(false), []);
  return (
    <LoadingCtx.Provider value={{ loading, start, end }}>
      {children}
    </LoadingCtx.Provider>
  );
}

export const useLoading = () => useContext(LoadingCtx);
