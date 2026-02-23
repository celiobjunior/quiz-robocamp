import type { QuizAttempt, QuizMode, QuizQuestion, QuizResult, UserAnswer } from "../types/quiz";

const STORAGE_KEY = "robocamp_quiz_session_v1";

type QuizSessionSnapshot = {
  mode: QuizMode | null;
  questions: QuizQuestion[];
  answers: UserAnswer[];
  currentIndex: number;
  mainResult: QuizResult | null;
  challengeResult: QuizResult | null;
  mainAttempt: QuizAttempt | null;
  challengeAttempt: QuizAttempt | null;
  lastCompletedMode: QuizMode | null;
};

function isMode(value: unknown): value is QuizMode {
  return value === "principal" || value === "desafio";
}

function isResult(value: unknown): value is QuizResult {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<QuizResult>;
  return (
    (candidate.mode === "principal" || candidate.mode === "desafio") &&
    typeof candidate.totalQuestions === "number" &&
    typeof candidate.correctCount === "number" &&
    typeof candidate.wrongCount === "number" &&
    typeof candidate.percentage === "number" &&
    typeof candidate.passingScore === "number" &&
    typeof candidate.passed === "boolean" &&
    (candidate.reward === "nenhuma" || candidate.reward === "1_adesivo")
  );
}

function isAttempt(value: unknown): value is QuizAttempt {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<QuizAttempt>;
  return (
    (candidate.mode === "principal" || candidate.mode === "desafio") &&
    Array.isArray(candidate.questions) &&
    Array.isArray(candidate.answers) &&
    isResult(candidate.result)
  );
}

export function loadSessionSnapshot(): QuizSessionSnapshot | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as Partial<QuizSessionSnapshot>;
    if (!parsed || typeof parsed !== "object") {
      return null;
    }

    const mode = parsed.mode === null ? null : isMode(parsed.mode) ? parsed.mode : null;
    const lastCompletedMode =
      parsed.lastCompletedMode === null
        ? null
        : isMode(parsed.lastCompletedMode)
          ? parsed.lastCompletedMode
          : null;

    if (!Array.isArray(parsed.questions) || !Array.isArray(parsed.answers)) {
      return null;
    }

    if (typeof parsed.currentIndex !== "number" || parsed.currentIndex < 0) {
      return null;
    }

    const mainResult = parsed.mainResult === null ? null : isResult(parsed.mainResult) ? parsed.mainResult : null;
    const challengeResult =
      parsed.challengeResult === null ? null : isResult(parsed.challengeResult) ? parsed.challengeResult : null;

    const mainAttempt = parsed.mainAttempt === null ? null : isAttempt(parsed.mainAttempt) ? parsed.mainAttempt : null;
    const challengeAttempt =
      parsed.challengeAttempt === null
        ? null
        : isAttempt(parsed.challengeAttempt)
          ? parsed.challengeAttempt
          : null;

    return {
      mode,
      questions: parsed.questions,
      answers: parsed.answers,
      currentIndex: parsed.currentIndex,
      mainResult,
      challengeResult,
      mainAttempt,
      challengeAttempt,
      lastCompletedMode
    };
  } catch {
    return null;
  }
}

export function saveSessionSnapshot(snapshot: QuizSessionSnapshot): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
}
