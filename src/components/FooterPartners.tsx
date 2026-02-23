import ftLogo from "../assets/brand/ft-logo.png";
import unicampLogo from "../assets/brand/unicamp-logo.png";

export function FooterPartners() {
  return (
    <footer className="mx-auto mt-8 w-full max-w-5xl border-brut border-brandBlack bg-brandWhite p-4 shadow-brut sm:p-5">
      <p className="mb-3 text-center text-xs font-bold uppercase tracking-widest text-brandBlack">
        ROBOCAMP | Liga de Robótica da Unicamp - Campus Limeira (FT)
      </p>
      <div className="flex items-center justify-center gap-5 sm:gap-8">
        <img src={unicampLogo} alt="Logo Unicamp" className="h-8 w-auto sm:h-10" loading="lazy" />
        <img src={ftLogo} alt="Logo FT Unicamp" className="h-8 w-auto sm:h-10" loading="lazy" />
      </div>
    </footer>
  );
}
