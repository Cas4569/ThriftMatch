"use client";

import AuthGuard from "@/app/components/AuthGuard";

export default function StylistLayout({ children }) {
  return <AuthGuard>{children}</AuthGuard>;
}