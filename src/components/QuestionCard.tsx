import type { QuizQuestion } from "../types/quiz";
import { resolveQuestionImage } from "../utils/images";
import { OptionButton } from "./OptionButton";
import { TimerBar } from "./TimerBar";

type QuestionCardProps = {
  question: QuizQuestion;
  questionIndex: number;
  totalQuestions: number;
  remainingSeconds: number;
  totalSeconds: number;
  disabled?: boolean;
  onSelect: (optionId: string) => void;
};

const difficultyMap: Record<QuizQuestion["difficulty"], { label: string; classes: string }> = {
  facil: {
    label: "Fácil",
    classes: "bg-lime-300"
  },
  media: {
    label: "Média",
    classes: "bg-amber-300"
  },
  dificil: {
    label: "Difícil",
    classes: "bg-rose-400 text-brandWhite"
  }
};

export function QuestionCard({
  question,
  questionIndex,
  totalQuestions,
  remainingSeconds,
  totalSeconds,
  disabled = false,
  onSelect
}: QuestionCardProps) {
  const difficulty = difficultyMap[question.difficulty];

  return (
    <article className="brut-card mx-auto w-full max-w-2xl animate-rise space-y-6 p-5 sm:p-7">
      <header className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="border-2 border-brandBlack bg-brandWhite px-2 py-1 text-xs font-bold uppercase tracking-wide">
            Pergunta {questionIndex + 1}/{totalQuestions}
          </span>
          <span
            className={`border-2 border-brandBlack px-2 py-1 text-xs font-bold uppercase tracking-wide ${difficulty.classes}`}
          >
            {difficulty.label}
          </span>
        </div>
        <TimerBar remainingSeconds={remainingSeconds} totalSeconds={totalSeconds} />
      </header>

      <div className="space-y-4">
        <h2 className="font-display text-xl uppercase leading-snug text-brandBlack sm:text-2xl">{question.prompt}</h2>
        {question.image ? (
          <figure className="overflow-hidden border-brut border-brandBlack bg-brandWhite shadow-brutSoft">
            <img
              src={resolveQuestionImage(question.image.src)}
              alt={question.image.alt}
              className="h-52 w-full object-cover"
              loading="lazy"
            />
            {question.image.placeholder ? (
              <figcaption className="border-t-2 border-brandBlack bg-zinc-100 px-3 py-2 text-xs font-semibold uppercase tracking-wide">
                Imagem de apoio da questão.
              </figcaption>
            ) : null}
          </figure>
        ) : null}
      </div>

      <div className="grid gap-3">
        {question.options.map((option, index) => (
          <OptionButton
            key={`${question.id}-${option.id}`}
            prefix={String.fromCharCode(65 + index)}
            label={option.label}
            disabled={disabled}
            onClick={() => onSelect(option.id)}
          />
        ))}
      </div>
    </article>
  );
}
