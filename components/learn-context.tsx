"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { Choice, Course, Progress, SavedNote } from "@/lib/types";

export type LearnApi = {
  course: Course;
  progress: Progress;
  toggle: (id: string) => void;
  setAnswer: (key: string, value: string) => void;
  submit: (id: string, keys: string[]) => void;
  confirm: (id: string, value: boolean) => void;
  saveNote: (note: SavedNote) => void;
  setDraft: (id: string, draft: Record<string, string>) => void;
  setChoice: (id: string, choice: Choice) => void;
  setRisky: (id: string, value: boolean) => void;
  saveBrief: (body: string) => void;
};

const LearnContext = createContext<LearnApi | null>(null);

export function LearnProvider({ value, children }: { value: LearnApi; children: ReactNode }) {
  return <LearnContext.Provider value={value}>{children}</LearnContext.Provider>;
}

export function useLearn(): LearnApi {
  const value = useContext(LearnContext);
  if (!value) throw new Error("Learn context is missing");
  return value;
}
