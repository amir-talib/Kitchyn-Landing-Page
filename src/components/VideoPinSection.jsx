import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger, SplitText } from "gsap/all";
import { useMediaQuery } from "react-responsive";
import { Link } from "react-router-dom";

const VideoPinSection = () => {
  const isMobile = useMediaQuery({
    query: "(max-width: 768px)",
  });

  useGSAP(() => {
    if (!isMobile) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ".vd-pin-section",
          start: "-15% top",
          end: "200% top",
          scrub: 1.5,
          pin: true,
        },
      });

      tl.to(".video-box", {
        clipPath: "circle(100% at 50% 50%)",
        ease: "power1.inOut",
      });
    }

    const setupTitleReveal = () => {
      const titleEl = document.querySelector(".video-title");
      if (!titleEl) return;

      const titleSplit = SplitText.create(titleEl, { type: "chars,words" });

      ScrollTrigger.create({
        trigger: ".vd-pin-section",
        start: "top 85%",
        once: true,
        onEnter: () => {
          gsap.fromTo(
            titleSplit.chars,
            { yPercent: 120, opacity: 0 },
            {
              yPercent: 0,
              opacity: 1,
              stagger: 0.025,
              duration: 0.9,
              ease: "power3.out",
            }
          );
        },
      });

      ScrollTrigger.refresh();
    };

    if (document.fonts?.status === "loaded") {
      setupTitleReveal();
    } else {
      document.fonts.ready.then(setupTitleReveal);
    }
  });

  return (
    <section className="vd-pin-section">
      <div
        style={{
          clipPath: isMobile
            ? "circle(100% at 50% 50%)"
            : "circle(6% at 50% 50%)",
        }}
        className="size-full video-box"
      >
        <video src="/videos/pin-video.mp4" playsInline muted loop autoPlay />

        <Link to="/blog" className="abs-center md:scale-100 scale-200">
          <img src="/images/circle-text.svg" alt="" className="spin-circle" />
          <div className="play-btn">
            <img
              src="/images/arrow.svg"
              alt=""
              className="size-[3vw] -rotate-45"
            />
          </div>
        </Link>
      </div>
    </section>
  );
};

export default VideoPinSection;
