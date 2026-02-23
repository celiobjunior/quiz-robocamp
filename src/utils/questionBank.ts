import rawHardQuestions from "../data/questions-hard.pt-BR.json";
import rawQuestions from "../data/questions.pt-BR.json";
import type { QuizQuestion } from "../types/quiz";
import { shuffleArray } from "./shuffle";
import { validateHardQuestionBank, validateMainQuestionBank } from "./validation";

const validatedMainQuestionBank = validateMainQuestionBank(rawQuestions);
const validatedHardQuestionBank = validateHardQuestionBank(rawHardQuestions);

const hardMediumQuestions = validatedHardQuestionBank.filter((question) => question.difficulty === "media");
const hardDifficultQuestions = validatedHardQuestionBank.filter((question) => question.difficulty === "dificil");

function pickRandomQuestions(questions: QuizQuestion[], count: number, label: string): QuizQuestion[] {
  if (questions.length < count) {
    throw new Error(`Banco de perguntas insuficiente para selecionar ${count} questões ${label}.`);
  }

  return shuffleArray(questions).slice(0, count);
}

function cloneAndShuffleOptions(questions: QuizQuestion[]): QuizQuestion[] {
  return shuffleArray(questions).map((question) => ({
    ...question,
    options: shuffleArray(question.options),
    image: question.image ? { ...question.image } : undefined
  }));
}

export function getMainQuestionSet(): QuizQuestion[] {
  const selectedQuestions = pickRandomQuestions(validatedMainQuestionBank, 10, "do quiz principal");
  return cloneAndShuffleOptions(selectedQuestions);
}

export function getChallengeQuestionSet(): QuizQuestion[] {
  const selectedMedium = pickRandomQuestions(hardMediumQuestions, 4, "médias do desafio");
  const selectedHard = pickRandomQuestions(hardDifficultQuestions, 1, "difíceis do desafio");

  return cloneAndShuffleOptions([...selectedMedium, ...selectedHard]);
}
