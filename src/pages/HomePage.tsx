import { useNavigate } from "react-router-dom";
import robocampLogo from "../assets/brand/robocamp-logo.png";
import { FooterPartners } from "../components/FooterPartners";
import { useQuiz } from "../context/QuizContext";

export function HomePage() {
  const navigate = useNavigate();
  const {
    canStartChallengeQuiz,
    canStartMainQuiz,
    challengeResult,
    hasStarted,
    isFinished,
    isRunInProgress,
    mainResult,
    startChallengeQuiz,
    startMainQuiz
  } = useQuiz();

  const handleStartMain = () => {
    const started = startMainQuiz();
    navigate(started ? "/quiz" : "/resultado");
  };

  const handleStartChallenge = () => {
    const started = startChallengeQuiz();
    navigate(started ? "/quiz" : "/resultado");
  };

  const handleContinue = () => {
    navigate(isFinished ? "/resultado" : "/quiz");
  };

  return (
    <main className="page-shell">
      <section className="mx-auto w-full max-w-5xl space-y-6">
        <div className="brut-card overflow-hidden p-5 sm:p-8">
          <div className="mb-6 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-3">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-brandWine">ROBOCAMP Quiz Arena</p>
              <h1 className="font-display text-3xl uppercase leading-[1.05] text-brandBlack sm:text-5xl">
                Quiz Interativo de
                <br />
                Robótica Básica
              </h1>
            </div>
            <div className="mx-auto w-full max-w-[220px] border-brut border-brandBlack bg-brandWhite p-3 shadow-brut sm:mx-0">
              <img src={robocampLogo} alt="Logo da ROBOCAMP" className="w-full" />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="feature-tile">
              <strong>10 perguntas</strong>
              <span>quiz principal</span>
            </div>
            <div className="feature-tile">
              <strong>30 segundos</strong>
              <span>por pergunta</span>
            </div>
            <div className="feature-tile">
              <strong>Premiação</strong>
              <span>1 adesivo para 7+ acertos</span>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:flex-wrap">
            {canStartMainQuiz ? (
              <button type="button" className="brut-button" onClick={handleStartMain}>
                Começar Quiz
              </button>
            ) : null}

            {canStartChallengeQuiz ? (
              <button type="button" className="brut-button" onClick={handleStartChallenge}>
                Iniciar Desafio Extra
              </button>
            ) : null}

            {(hasStarted || mainResult) && (
              <button type="button" className="brut-button-secondary" onClick={handleContinue}>
                {isRunInProgress ? "Continuar Tentativa" : "Ver Resultado"}
              </button>
            )}
          </div>

          {mainResult ? (
            <p className="mt-4 border-2 border-brandBlack bg-[#fff6fa] px-3 py-2 text-xs font-bold uppercase tracking-wide text-brandBlack">
              Quiz principal finalizado ({mainResult.correctCount}/{mainResult.totalQuestions})
            </p>
          ) : null}

          {challengeResult ? (
            <p className="mt-3 border-2 border-brandBlack bg-zinc-100 px-3 py-2 text-xs font-bold uppercase tracking-wide text-brandBlack">
              Desafio extra finalizado ({challengeResult.correctCount}/{challengeResult.totalQuestions})
            </p>
          ) : null}

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <a
              href="https://linktr.ee/robocamp.ft"
              target="_blank"
              rel="noreferrer"
              className="social-link-tile"
            >
              <strong>Linktree</strong>
              <span>linktr.ee/robocamp.ft</span>
            </a>
            <a
              href="https://www.instagram.com/robocamp.ft/"
              target="_blank"
              rel="noreferrer"
              className="social-link-tile"
            >
              <strong>Instagram</strong>
              <span>@robocamp.ft</span>
            </a>
            <a href="mailto:robocamp@unicamp.br" className="social-link-tile">
              <strong>E-mail</strong>
              <span>robocamp@unicamp.br</span>
            </a>
          </div>
        </div>

        <FooterPartners />
      </section>
    </main>
  );
}
