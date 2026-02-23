import type { Difficulty, QuizQuestion } from "../types/quiz";

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

type ValidationRules = {
  minTotal: number;
  minEasy?: number;
  minMedium?: number;
  minHard?: number;
};

function validateWithRules(input: unknown, rules: ValidationRules, label: string): QuizQuestion[] {
  if (!Array.isArray(input)) {
    throw new Error(`${label} inválido: deve ser um array.`);
  }

  const validated = input.map((item, index) => {
    if (!isObject(item)) {
      throw new Error(`${label} inválido no índice ${index}.`);
    }

    const question = item as QuizQuestion;

    if (!["facil", "media", "dificil"].includes(question.difficulty)) {
      throw new Error(`Dificuldade inválida na pergunta ${question.id ?? index} (${label}).`);
    }

    if (typeof question.id !== "string" || question.id.trim().length === 0) {
      throw new Error(`A pergunta no índice ${index} precisa de um id válido (${label}).`);
    }

    if (!Array.isArray(question.options) || question.options.length !== 4) {
      throw new Error(`A pergunta ${question.id} deve ter exatamente 4 opções (${label}).`);
    }

    const optionIds = new Set(question.options.map((option) => option.id));
    if (optionIds.size !== 4) {
      throw new Error(`A pergunta ${question.id} possui IDs de opções duplicados (${label}).`);
    }

    if (!optionIds.has(question.correctOptionId)) {
      throw new Error(`A pergunta ${question.id} não possui alternativa correta válida (${label}).`);
    }

    return question;
  });

  const ids = new Set(validated.map((question) => question.id));
  if (ids.size !== validated.length) {
    throw new Error(`${label} inválido: IDs de perguntas duplicados.`);
  }

  const counters: Record<Difficulty, number> = {
    facil: 0,
    media: 0,
    dificil: 0
  };

  validated.forEach((question) => {
    counters[question.difficulty] += 1;
  });

  if (validated.length < rules.minTotal) {
    throw new Error(`${label} inválido: mínimo de ${rules.minTotal} perguntas, recebido ${validated.length}.`);
  }

  if (rules.minEasy !== undefined && counters.facil < rules.minEasy) {
    throw new Error(`${label} inválido: mínimo de ${rules.minEasy} perguntas fáceis, recebido ${counters.facil}.`);
  }

  if (rules.minMedium !== undefined && counters.media < rules.minMedium) {
    throw new Error(`${label} inválido: mínimo de ${rules.minMedium} perguntas médias, recebido ${counters.media}.`);
  }

  if (rules.minHard !== undefined && counters.dificil < rules.minHard) {
    throw new Error(
      `${label} inválido: mínimo de ${rules.minHard} perguntas difíceis, recebido ${counters.dificil}.`
    );
  }

  return validated;
}

export function validateMainQuestionBank(input: unknown): QuizQuestion[] {
  return validateWithRules(input, { minTotal: 10 }, "Banco principal");
}

export function validateHardQuestionBank(input: unknown): QuizQuestion[] {
  return validateWithRules(input, { minTotal: 5, minMedium: 4, minHard: 1 }, "Banco desafio");
}
