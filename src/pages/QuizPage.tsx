import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FooterPartners } from "../components/FooterPartners";
import { QuestionCard } from "../components/QuestionCard";
import { useQuiz } from "../context/QuizContext";

const QUESTION_TIME_LIMIT_SECONDS = 30;

export function QuizPage() {
  const navigate = useNavigate();
  const {
    canStartMainQuiz,
    currentQuestion,
    currentIndex,
    hasStarted,
    isFinished,
    questions,
    startMainQuiz,
    submitAnswer,
    mode
  } = useQuiz();

  const [remainingSeconds, setRemainingSeconds] = useState(QUESTION_TIME_LIMIT_SECONDS);
  const lockRef = useRef(false);

  useEffect(() => {
    if (isFinished) {
      navigate("/resultado", { replace: true });
    }
  }, [isFinished, navigate]);

  useEffect(() => {
    if (!currentQuestion) {
      return;
    }

    lockRef.current = false;
    const deadline = Date.now() + QUESTION_TIME_LIMIT_SECONDS * 1000;
    setRemainingSeconds(QUESTION_TIME_LIMIT_SECONDS);

    const intervalId = window.setInterval(() => {
      const remainingMs = deadline - Date.now();
      const nextRemaining = Math.max(0, remainingMs / 1000);
      setRemainingSeconds(nextRemaining);

      if (remainingMs <= 0 && !lockRef.current) {
        lockRef.current = true;
        submitAnswer({
          selectedOptionId: undefined,
          isCorrect: false,
          timedOut: true,
          timeSpentSec: QUESTION_TIME_LIMIT_SECONDS
        });
      }
    }, 100);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [currentQuestion, submitAnswer]);

  const handleSelectOption = (optionId: string) => {
    if (!currentQuestion || lockRef.current) {
      return;
    }

    lockRef.current = true;
    const elapsed = Math.min(
      QUESTION_TIME_LIMIT_SECONDS,
      Math.max(0, Number((QUESTION_TIME_LIMIT_SECONDS - remainingSeconds).toFixed(1)))
    );

    submitAnswer({
      selectedOptionId: optionId,
      isCorrect: optionId === currentQuestion.correctOptionId,
      timedOut: false,
      timeSpentSec: elapsed
    });
  };

  if (isFinished) {
    return null;
  }

  if (!hasStarted || !currentQuestion) {
    return (
      <main className="page-shell">
        <section className="mx-auto w-full max-w-3xl space-y-6">
          <div className="brut-card p-6 text-center sm:p-8">
            <h1 className="font-display text-3xl uppercase text-brandBlack">Nenhuma tentativa ativa</h1>
            {canStartMainQuiz ? (
              <p className="mt-2 text-sm font-semibold text-brandBlack">
                Inicie sua tentativa para começar o quiz principal da ROBOCAMP.
              </p>
            ) : (
              <p className="mt-2 text-sm font-semibold text-brandBlack">
                Quiz principal finalizado. Veja o resultado.
              </p>
            )}
            <div className="mt-5 flex flex-col items-center justify-center gap-3 sm:flex-row">
              {canStartMainQuiz ? (
                <button
                  type="button"
                  className="brut-button"
                  onClick={() => {
                    const started = startMainQuiz();
                    navigate(started ? "/quiz" : "/resultado", { replace: true });
                  }}
                >
                  Iniciar Quiz Principal
                </button>
              ) : null}
              <Link to="/resultado" className="brut-button-secondary">
                Ver Resultado
              </Link>
            </div>
          </div>
          <FooterPartners />
        </section>
      </main>
    );
  }

  const modeLabel = mode === "desafio" ? "Desafio Extra" : "Quiz Principal";
  const modeDescription =
    mode === "desafio"
      ? "4 perguntas médias + 1 pergunta difícil"
      : "10 perguntas com foco em fundamentos básicos";

  return (
    <main className="page-shell">
      <section className="mx-auto w-full max-w-5xl space-y-6">
        <div className="brut-card mx-auto w-full max-w-2xl p-4 sm:p-5">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-brandWine">{modeLabel}</p>
          <p className="mt-1 text-sm font-semibold uppercase tracking-wide text-brandBlack">{modeDescription}</p>
        </div>

        <QuestionCard
          question={currentQuestion}
          questionIndex={currentIndex}
          totalQuestions={questions.length}
          remainingSeconds={remainingSeconds}
          totalSeconds={QUESTION_TIME_LIMIT_SECONDS}
          disabled={lockRef.current}
          onSelect={handleSelectOption}
        />
        <FooterPartners />
      </section>
    </main>
  );
}
