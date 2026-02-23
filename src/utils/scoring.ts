import type { QuizMode, QuizQuestion, QuizResult, UserAnswer } from "../types/quiz";

type ResultConfig = {
  mode: QuizMode;
  passingScore: number;
};

export function calculateResult(
  questions: QuizQuestion[],
  answers: UserAnswer[],
  config: ResultConfig
): QuizResult {
  const totalQuestions = questions.length;
  const correctCount = answers.filter((answer) => answer.isCorrect).length;
  const wrongCount = Math.max(totalQuestions - correctCount, 0);
  const percentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
  const passed = correctCount >= config.passingScore;

  return {
    mode: config.mode,
    totalQuestions,
    correctCount,
    wrongCount,
    percentage,
    passingScore: config.passingScore,
    passed,
    reward: passed ? "1_adesivo" : "nenhuma"
  };
}
