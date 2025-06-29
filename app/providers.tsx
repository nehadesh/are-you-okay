"use client";

import { SessionProvider } from "next-auth/react";
import { APIProvider } from '@vis.gl/react-google-maps';

export default function Providers({ children }: { children: React.ReactNode }) {
  return <SessionProvider><APIProvider apiKey={process.env.NEXTGOOGLE_MAPS_API_KEY ?? "AIzaSyAuSVYSkWYKT_xxMehq5gv5L5pML6TUD9s"}>{children}</APIProvider></SessionProvider>;
} 