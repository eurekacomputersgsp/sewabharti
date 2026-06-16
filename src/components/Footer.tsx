export function Footer() {
  return (
    <footer className="bg-black border-t border-white/[0.08] px-6 py-12 sm:py-10 text-center">
      <div className="mx-auto flex max-w-[480px] flex-col items-center">
        <img
          src="/images/mashoorbano-logo.png"
          alt="MashoorBano Digital Agency logo"
          className="mb-[18px] h-[72px] w-[72px] rounded-full sm:h-[60px] sm:w-[60px]"
        />

        <p className="mb-2 text-[15px] font-medium text-[#E8E8EA]">
          Developed by <strong className="font-bold text-[#DB431A]">MashoorBano</strong>
        </p>

        <p className="mb-3.5 text-[13px] text-[#B8B8BD]">
          <a href="tel:+917814718340" className="hover:text-white">
            Atharv Aryan
          </a>
          <span className="mx-2 text-[#6E6E76]">•</span>
          <a href="tel:+917814718340" className="hover:text-white">
            7814718340
          </a>
        </p>

        <a
          href="https://mashoorbano.com"
          target="_blank"
          rel="noopener noreferrer"
          className="border-b border-transparent text-[13px] font-semibold text-[#DB431A] transition-colors hover:border-[#FF5C2E] hover:text-[#FF5C2E]"
        >
          Mashoorbano.com
        </a>
      </div>
    </footer>
  );
}
