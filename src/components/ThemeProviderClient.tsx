"use client";

import React from "react";
import { ThemeProvider } from "next-themes";

export function ThemeProviderClient({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider 
      attribute="class"
      defaultTheme="system"
      enableSystem
      enableColorScheme={false}
      storageKey="theme-preference"
      forcedTheme={undefined}
      disableTransitionOnChange={false}
    >
      {children}
    </ThemeProvider>
  );
}
