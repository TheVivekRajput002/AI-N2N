// components/ClarityProvider.tsx
"use client";

import { useEffect } from "react";
import Clarity from "@microsoft/clarity";

export default function ClarityProvider() {
  useEffect(() => {
    Clarity.init(process.env.MICROSOFT_CLARITY_PROJECT_ID!);
  }, []);

  return null;
}
