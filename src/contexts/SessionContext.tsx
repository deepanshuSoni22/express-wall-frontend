import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { SessionData, SessionContextType } from '@/types';

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

interface SessionData {
  expressChoice?: ExpressChoice;
  expressContent?: string;
  releaseChoice?: ReleaseChoice;
  rebuildChoice?: RebuildChoice;
  rebuildContent?: string;
  startTime?: Date;
  endTime?: Date;
  user?: {
    id: number;
    name: string;
    mobile_number: string;
  };
}