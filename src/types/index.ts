// Common type definitions for the ExpressWall application
export type ExpressChoice = 'write' | 'speak' | 'draw';
export type ReleaseChoice = 'relaxation' | 'focus' | 'stress-release' | 'energy';
export type RebuildChoice = 'quote' | 'reflection' | 'music';

// Interface for common components
export interface WithContinueProps {
  onContinue: () => void;
}

// Express page types
export interface ExpressOption {
  id: ExpressChoice;
  title: string;
  description: string;
  icon: JSX.Element;
  gradient: string;
}

// Release page types
export interface BreathingPattern {
  inhale: number;
  hold: number;
  exhale: number;
}

export interface BreathingTechnique {
  id: ReleaseChoice;
  title: string;
  description: string;
  icon: JSX.Element;
  gradient: string;
  pattern: BreathingPattern;
}

// Rebuild page types (formerly Balance)
export interface RebuildOption {
  id: RebuildChoice;
  title: string;
  description: string;
  icon: JSX.Element;
  gradient: string;
}

// Session data types
export interface SessionData {
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

export interface SessionContextType {
  sessionData: SessionData;
  updateSession: (data: Partial<SessionData>) => void;
  resetSession: () => void;
}

// Backend API Types for Recommendations
export interface Course {
  id: number;
  course_name: string;
  course_description: string;
  created_at: string;
  updated_at: string;
}

export interface Module {
  id: number;
  module_name: string;
  module_description: string;
  course: Course;
  created_at: string;
  updated_at: string;
}

export interface Session {
  id: number;
  session_name: string;
  session_description: string;
  tags: string[];
  module: Module;
  created_at: string;
  updated_at: string;
}

export interface RecommendedSession {
  session: Session;
  match_score: number;
  reason: string;
}