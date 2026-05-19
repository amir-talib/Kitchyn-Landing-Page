import { Link } from "react-router-dom";
import { prefetchPosts } from "../lib/blogCache";

const NavBar = () => {
  const triggerPrefetch = () => {
    prefetchPosts().catch(() => {});
  };

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
        onMouseEnter={triggerPrefetch}
        onFocus={triggerPrefetch}
        onTouchStart={triggerPrefetch}
        className="pointer-events-auto group flex items-center md:gap-2.5 gap-2 bg-[#4B1F70] hover:bg-[#6A35A0] text-milk rounded-full md:p-3.5 p-3 transition-all hover:scale-105 shadow-lg shadow-[#10002b]/20 border border-milk/15 backdrop-blur-md"
        aria-label="Read the blog"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#BFA0E0] opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#BFA0E0]" />
        </span>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
        </svg>
      </Link>
    </nav>
  );
};

export default NavBar;
