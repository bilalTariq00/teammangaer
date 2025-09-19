"use client";

import { useChunkErrorHandler } from "@/hooks/useChunkErrorHandler";

export default function ChunkErrorHandler({ children }) {
  useChunkErrorHandler();
  return children;
}
