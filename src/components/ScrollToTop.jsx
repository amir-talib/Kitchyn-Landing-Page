import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { ScrollSmoother } from "gsap/all";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // If ScrollSmoother is active (home page), use its API to reset scroll.
    // Otherwise fall back to native window scroll for blog pages.
    const smoother = ScrollSmoother.get?.();
    if (smoother) {
      smoother.scrollTo(0, false);
    }
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  return null;
};

export default ScrollToTop;
