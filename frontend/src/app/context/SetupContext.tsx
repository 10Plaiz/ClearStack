import React, { createContext, useContext, useState, useCallback } from "react";

export interface SetupData {
  startType: "new" | "existing" | null;
  projectTypes: string[];
  stage: string;
  experience: string;
  stack: string[];
  aiTools: string[];
  aiHelp: string[];
  aiAvoid: string[];
  learningSupport: string[];
  decisionTracking: string;
  progressHandoff: string;
  repoUrl: string;
  repoAnalysis: RepoAnalysis | null;
  isGenerated: boolean;
}

export interface RepoAnalysis {
  repoName: string;
  hasReadme: boolean;
  hasDocs: boolean;
  hasAIInstructions: boolean;
  hasDecisionLog: boolean;
  hasTestSetup: boolean;
  folderStructure: string[];
  warnings: string[];
}

const defaultData: SetupData = {
  startType: null,
  projectTypes: [],
  stage: "",
  experience: "",
  stack: [],
  aiTools: [],
  aiHelp: [],
  aiAvoid: [],
  learningSupport: [],
  decisionTracking: "",
  progressHandoff: "",
  repoUrl: "",
  repoAnalysis: null,
  isGenerated: false,
};

interface SetupContextType {
  data: SetupData;
  updateData: (updates: Partial<SetupData>) => void;
  resetData: () => void;
}

const SetupContext = createContext<SetupContextType | null>(null);

export function SetupProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<SetupData>(defaultData);

  const updateData = useCallback((updates: Partial<SetupData>) => {
    setData((prev) => ({ ...prev, ...updates }));
  }, []);

  const resetData = useCallback(() => {
    setData(defaultData);
  }, []);

  return (
    <SetupContext.Provider value={{ data, updateData, resetData }}>
      {children}
    </SetupContext.Provider>
  );
}

export function useSetup() {
  const ctx = useContext(SetupContext);
  if (!ctx) throw new Error("useSetup must be used within SetupProvider");
  return ctx;
}
