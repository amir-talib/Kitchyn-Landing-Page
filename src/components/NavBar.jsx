import { Link } from "react-router-dom";

const NavBar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 md:px-9 px-4 md:py-7 py-3 flex items-center justify-between pointer-events-none">
      <Link to="/" className="pointer-events-auto" aria-label="Kitchyn home">
        <img
          src="/images/logokitchyn.png"
          alt="Kitchyn"
          className="md:w-36 w-24"
          fetchpriority="high"
          decoding="async"
        />
      </Link>

      <Link
        to="/blog"
        className="pointer-events-auto group flex items-center md:gap-2.5 gap-2 bg-[#240046] hover:bg-[#3c096c] text-milk font-paragraph font-semibold md:text-sm text-xs uppercase tracking-[0.15em] rounded-full md:px-5 px-3.5 md:py-2.5 py-2 transition-all hover:scale-105 shadow-lg shadow-[#10002b]/20 border border-milk/15 backdrop-blur-md"
        aria-label="Read the blog"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#c77dff] opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#c77dff]" />
        </span>
        <span>Stories</span>
        <span className="transition-transform group-hover:translate-x-0.5">
          →
        </span>
      </Link>
    </nav>
  );
};

export default NavBar;
