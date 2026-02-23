import { Link, useNavigate } from "react-router-dom";
import { FooterPartners } from "../components/FooterPartners";
import { useQuiz } from "../context/QuizContext";
import type { QuizAttempt, QuizResult } from "../types/quiz";

function summaryMessage(result: QuizResult): string {
  if (result.mode === "principal") {
    if (result.passed) {
      return "Parabéns. Você ganhou 1 adesivo no quiz principal.";
    }

    return "No quiz principal, são necessários 7 acertos para ganhar 1 adesivo.";
  }

  if (result.passed) {
    return "Desafio concluído. Você garantiu o adesivo extra (2o adesivo).";
  }

  return "No desafio extra, acerte 4 de 5 para ganhar o adesivo extra.";
}

function AttemptPanel({ attempt }: { attempt: QuizAttempt }) {
  const answersByQuestion = new Map(attempt.answers.map((answer) => [answer.questionId, answer]));
  const title = attempt.mode === "principal" ? "Resultado do Quiz Principal" : "Resultado do Desafio Extra";

  return (
    <section className="space-y-3">
      <div className="brut-card space-y-3 p-5 sm:p-6">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-brandWine">{title}</p>
        <h2 className="font-display text-3xl uppercase text-brandBlack sm:text-4xl">
          {attempt.result.correctCount}/{attempt.result.totalQuestions} acertos ({attempt.result.percentage}%)
        </h2>
        <p className="text-sm font-semibold text-brandBlack">{summaryMessage(attempt.result)}</p>
      </div>

      {attempt.questions.map((question, index) => {
        const answer = answersByQuestion.get(question.id);
        const selectedOption = question.options.find((option) => option.id === answer?.selectedOptionId);
        const correctOption = question.options.find((option) => option.id === question.correctOptionId);
        const wasCorrect = Boolean(answer?.isCorrect);

        return (
          <article key={`${attempt.mode}-${question.id}`} className={`brut-card p-4 sm:p-5 ${wasCorrect ? "bg-lime-100" : "bg-rose-50"}`}>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <h3 className="max-w-3xl font-display text-lg uppercase leading-snug text-brandBlack">
                {index + 1}. {question.prompt}
              </h3>
              <span
                className={`w-fit border-2 border-brandBlack px-2 py-1 text-xs font-bold uppercase tracking-wide ${
                  wasCorrect ? "bg-lime-300" : "bg-rose-400 text-brandWhite"
                }`}
              >
                {wasCorrect ? "Acertou" : answer?.timedOut ? "Errou (tempo)" : "Errou"}
              </span>
            </div>
            <p className="mt-2 text-sm font-medium text-brandBlack">
              Sua resposta: {selectedOption ? selectedOption.label : "Sem resposta (tempo esgotado)"}
            </p>
            <p className="text-sm font-bold text-brandBlack">Correta: {correctOption?.label ?? "N/A"}</p>
          </article>
        );
      })}
    </section>
  );
}

export function ResultPage() {
  const navigate = useNavigate();
  const { canStartChallengeQuiz, challengeAttempt, mainAttempt, startChallengeQuiz, totalStickers } = useQuiz();

  const attempts: QuizAttempt[] = [mainAttempt, challengeAttempt].filter((attempt): attempt is QuizAttempt => Boolean(attempt));

  if (attempts.length === 0) {
    return (
      <main className="page-shell">
        <section className="mx-auto w-full max-w-3xl space-y-6">
          <div className="brut-card p-6 text-center sm:p-8">
            <h1 className="font-display text-3xl uppercase text-brandBlack">Sem resultado disponível</h1>
            <p className="mt-2 text-sm font-semibold text-brandBlack">
              Finalize uma tentativa para liberar o relatório de acertos e erros.
            </p>
            <Link to="/" className="brut-button mt-5 inline-flex">
              Voltar ao Início
            </Link>
          </div>
          <FooterPartners />
        </section>
      </main>
    );
  }

  return (
    <main className="page-shell">
      <section className="mx-auto w-full max-w-5xl space-y-6">
        <div className="brut-card space-y-4 p-6 sm:p-8">
          <h1 className="font-display text-4xl uppercase text-brandBlack sm:text-5xl">Resultados da Sessão</h1>
          <p className="w-fit border-2 border-brandBlack bg-[#fff6fa] px-3 py-2 text-xs font-bold uppercase tracking-wide text-brandBlack">
            Adesivos acumulados nesta sessão: {totalStickers}
          </p>
          <p className="border-2 border-brandBlack bg-zinc-100 px-3 py-2 text-xs font-bold uppercase tracking-wide text-brandBlack">
            Teste finalizado.
          </p>

          <div className="flex flex-wrap gap-3">
            {canStartChallengeQuiz ? (
              <button
                type="button"
                className="brut-button"
                onClick={() => {
                  const started = startChallengeQuiz();
                  navigate(started ? "/quiz" : "/resultado", { replace: true });
                }}
              >
                Iniciar Desafio Extra
              </button>
            ) : null}
            <Link to="/" className="brut-button-secondary inline-flex">
              Ir para Início
            </Link>
          </div>
        </div>

        <div className="space-y-6">
          {attempts.map((attempt) => (
            <AttemptPanel key={attempt.mode} attempt={attempt} />
          ))}
        </div>

        <FooterPartners />
      </section>
    </main>
  );
}
