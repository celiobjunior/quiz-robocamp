import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { QuizAttempt, QuizMode, QuizQuestion, QuizResult, UserAnswer } from "../types/quiz";
import { getChallengeQuestionSet, getMainQuestionSet } from "../utils/questionBank";
import { calculateResult } from "../utils/scoring";
import { loadSessionSnapshot, saveSessionSnapshot } from "../utils/sessionState";

type SubmitAnswerPayload = Omit<UserAnswer, "questionId">;

type QuizContextValue = {
  mode: QuizMode | null;
  questions: QuizQuestion[];
  answers: UserAnswer[];
  currentIndex: number;
  currentQuestion: QuizQuestion | null;
  hasStarted: boolean;
  isFinished: boolean;
  isRunInProgress: boolean;
  canStartMainQuiz: boolean;
  canStartChallengeQuiz: boolean;
  mainResult: QuizResult | null;
  challengeResult: QuizResult | null;
  mainAttempt: QuizAttempt | null;
  challengeAttempt: QuizAttempt | null;
  lastCompletedMode: QuizMode | null;
  totalStickers: number;
  startMainQuiz: () => boolean;
  startChallengeQuiz: () => boolean;
  submitAnswer: (payload: SubmitAnswerPayload) => void;
};

const QuizContext = createContext<QuizContextValue | undefined>(undefined);
const initialSnapshot = loadSessionSnapshot();

function getPassingScore(mode: QuizMode): number {
  return mode === "principal" ? 7 : 4;
}

function cloneQuestions(questions: QuizQuestion[]): QuizQuestion[] {
  return questions.map((question) => ({
    ...question,
    options: question.options.map((option) => ({ ...option })),
    image: question.image ? { ...question.image } : undefined
  }));
}

function cloneAnswers(answers: UserAnswer[]): UserAnswer[] {
  return answers.map((answer) => ({ ...answer }));
}

export function QuizProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<QuizMode | null>(initialSnapshot?.mode ?? null);
  const [questions, setQuestions] = useState<QuizQuestion[]>(initialSnapshot?.questions ?? []);
  const [answers, setAnswers] = useState<UserAnswer[]>(initialSnapshot?.answers ?? []);
  const [currentIndex, setCurrentIndex] = useState(initialSnapshot?.currentIndex ?? 0);
  const [mainResult, setMainResult] = useState<QuizResult | null>(initialSnapshot?.mainResult ?? null);
  const [challengeResult, setChallengeResult] = useState<QuizResult | null>(initialSnapshot?.challengeResult ?? null);
  const [mainAttempt, setMainAttempt] = useState<QuizAttempt | null>(initialSnapshot?.mainAttempt ?? null);
  const [challengeAttempt, setChallengeAttempt] = useState<QuizAttempt | null>(
    initialSnapshot?.challengeAttempt ?? null
  );
  const [lastCompletedMode, setLastCompletedMode] = useState<QuizMode | null>(
    initialSnapshot?.lastCompletedMode ?? null
  );

  const hasStarted = mode !== null && questions.length > 0;
  const currentQuestion = hasStarted ? questions[currentIndex] ?? null : null;
  const isFinished = hasStarted && currentIndex >= questions.length;
  const isRunInProgress = hasStarted && !isFinished;

  const canStartMainQuiz = !mainResult && !isRunInProgress;
  const canStartChallengeQuiz = Boolean(mainResult) && !challengeResult && !isRunInProgress;

  const totalStickers = useMemo(() => {
    let count = 0;
    if (mainResult?.passed) {
      count += 1;
    }
    if (challengeResult?.passed) {
      count += 1;
    }
    return count;
  }, [challengeResult, mainResult]);

  useEffect(() => {
    saveSessionSnapshot({
      mode,
      questions,
      answers,
      currentIndex,
      mainResult,
      challengeResult,
      mainAttempt,
      challengeAttempt,
      lastCompletedMode
    });
  }, [
    answers,
    challengeAttempt,
    challengeResult,
    currentIndex,
    lastCompletedMode,
    mainAttempt,
    mainResult,
    mode,
    questions
  ]);

  const loadRun = (nextMode: QuizMode, nextQuestions: QuizQuestion[]) => {
    setMode(nextMode);
    setQuestions(nextQuestions);
    setAnswers([]);
    setCurrentIndex(0);
    setLastCompletedMode(null);
  };

  const startMainQuiz = (): boolean => {
    if (!canStartMainQuiz) {
      return false;
    }

    loadRun("principal", getMainQuestionSet());
    return true;
  };

  const startChallengeQuiz = (): boolean => {
    if (!canStartChallengeQuiz) {
      return false;
    }

    loadRun("desafio", getChallengeQuestionSet());
    return true;
  };

  const submitAnswer = (payload: SubmitAnswerPayload) => {
    if (!mode || !hasStarted || !isRunInProgress) {
      return;
    }

    const activeQuestion = questions[currentIndex];
    if (!activeQuestion) {
      return;
    }

    const answer: UserAnswer = {
      questionId: activeQuestion.id,
      ...payload
    };

    const updatedAnswers = [...answers, answer];
    const nextIndex = currentIndex + 1;

    setAnswers(updatedAnswers);
    setCurrentIndex(nextIndex);

    if (nextIndex >= questions.length) {
      const result = calculateResult(questions, updatedAnswers, {
        mode,
        passingScore: getPassingScore(mode)
      });

      const attempt: QuizAttempt = {
        mode,
        questions: cloneQuestions(questions),
        answers: cloneAnswers(updatedAnswers),
        result
      };

      if (mode === "principal") {
        setMainResult(result);
        setMainAttempt(attempt);
      } else {
        setChallengeResult(result);
        setChallengeAttempt(attempt);
      }

      setLastCompletedMode(mode);
    }
  };

  return (
    <QuizContext.Provider
      value={{
        mode,
        questions,
        answers,
        currentIndex,
        currentQuestion,
        hasStarted,
        isFinished,
        isRunInProgress,
        canStartMainQuiz,
        canStartChallengeQuiz,
        mainResult,
        challengeResult,
        mainAttempt,
        challengeAttempt,
        lastCompletedMode,
        totalStickers,
        startMainQuiz,
        startChallengeQuiz,
        submitAnswer
      }}
    >
      {children}
    </QuizContext.Provider>
  );
}

export function useQuiz(): QuizContextValue {
  const context = useContext(QuizContext);

  if (!context) {
    throw new Error("useQuiz deve ser usado dentro de QuizProvider.");
  }

  return context;
}
