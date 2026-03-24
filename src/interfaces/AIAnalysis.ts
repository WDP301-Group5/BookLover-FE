// src/interfaces/AIAnalysis.ts
/**
 * Frontend interface for AI analysis results
 * Matches the backend IAIAnalysis interface
 */
export interface AIDecisionScores {
  toxicity?: number;
  sexual?: number;
  violence?: number;
  political?: number;
  inappropriateName?: number;
  inappropriateDescription?: number;
  inappropriateGenre?: number;
  overallRisk?: number;
}

export interface AIGeminiDecision {
  decision: "APPROVE" | "FLAG" | "REJECT";
  scores: AIDecisionScores;
  reasons: string[];
  warnings?: string[];
}

export interface AIAnalysis {
  _id: string;
  chapterId?: string;
  storyId?: string;
  perspectiveScores?: {
    toxicity?: number;
    sexuallyExplicit?: number;
    violence?: number;
    identityAttack?: number;
    insult?: number;
    threat?: number;
  };
  geminiDecision?: AIGeminiDecision;
  finalDecision:
    | "auto-approved"
    | "flagged"
    | "auto-rejected"
    | "hard-filter-rejected";
  reasons: string[];
  processedAt: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Story with AI analysis results
 * Extends the base Story interface with optional AI fields
 */
export interface StoryWithAI extends Story {
  aiAnalysis?: AIAnalysis;
  aiDecision?: "auto-approved" | "flagged" | "auto-rejected";
}

// Re-export Story for convenience
import type { Story } from "./Story";
export type { Story };
