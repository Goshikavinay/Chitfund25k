"use client";

import { ChitProvider } from "@/context/ChitContext";

export function Providers({ children }: { children: React.ReactNode }) {
    return <ChitProvider>{children}</ChitProvider>;
}
