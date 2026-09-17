"use client";

import AuthGuard from "@/app/components/AuthGuard";

export default function Discoverlayout({ children }) {
  return <AuthGuard>{children}</AuthGuard>;
}