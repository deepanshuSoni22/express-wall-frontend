import { createContext, useContext, useState, ReactNode } from 'react';

// Type definitions for the various user choices
type ExpressChoice = 'write' | 'speak' | 'draw';
type ReleaseChoice = 'relaxation' | 'focus' | 'stress-release' | 'energy';
type BalanceChoice = 'quote' | 'reflection' | 'music';

interface SessionData {
  expressChoice?: ExpressChoice;
  expressContent?: string;
  releaseChoice?: ReleaseChoice;
  balanceChoice?: BalanceChoice;
  balanceContent?: string;
  startTime?: Date;
  endTime?: Date;
}

interface SessionContextType {
  sessionData: SessionData;
  updateSession: (data: Partial<SessionData>) => void;
  resetSession: () => void;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};

export const SessionProvider = ({ children }: { children: ReactNode }) => {
  const [sessionData, setSessionData] = useState<SessionData>({});

  const updateSession = (data: Partial<SessionData>) => {
    setSessionData(prev => ({ ...prev, ...data }));
  };

  const resetSession = () => {
    setSessionData({});
  };

  return (
    <SessionContext.Provider value={{ sessionData, updateSession, resetSession }}>
      {children}
    </SessionContext.Provider>
  );
};