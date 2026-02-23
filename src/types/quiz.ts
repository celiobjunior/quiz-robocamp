export type Difficulty = "facil" | "media" | "dificil";
export type QuizMode = "principal" | "desafio";

export type QuizOption = {
  id: string;
  label: string;
};

export type QuizQuestionImage = {
  src: string;
  alt: string;
  placeholder: boolean;
};

export type QuizQuestion = {
  id: string;
  difficulty: Difficulty;
  topic: string;
  prompt: string;
  options: QuizOption[];
  correctOptionId: string;
  image?: QuizQuestionImage;
};

export type UserAnswer = {
  questionId: string;
  selectedOptionId?: string;
  isCorrect: boolean;
  timedOut: boolean;
  timeSpentSec: number;
};

export type QuizReward = "nenhuma" | "1_adesivo";

export type QuizResult = {
  mode: QuizMode;
  totalQuestions: number;
  correctCount: number;
  wrongCount: number;
  percentage: number;
  passingScore: number;
  passed: boolean;
  reward: QuizReward;
};

export type QuizAttempt = {
  mode: QuizMode;
  questions: QuizQuestion[];
  answers: UserAnswer[];
  result: QuizResult;
};
