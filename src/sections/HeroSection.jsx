import { useGSAP } from "@gsap/react";
import { useRef, useState } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/all";
import { useMediaQuery } from "react-responsive";
import BookDemoModal from "../components/BookDemoModal";

const HeroSection = () => {
  const videoRef = useRef(null);
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const [demoOpen, setDemoOpen] = useState(false);

  useGSAP(() => {
    const titleSplit = SplitText.create(".hero-title", {
      type: "chars",
    });

    const tl = gsap.timeline({
      delay: 1,
    });

    tl.to(".hero-content", {
      opacity: 1,
      y: 0,
      ease: "power1.inOut",
    })
      .to(
        ".hero-text-scroll",
        {
          duration: 1,
          clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
          ease: "circ.out",
        },
        "-=0.5"
      )
      .from(
        titleSplit.chars,
        {
          yPercent: 200,
          stagger: 0.02,
          ease: "power2.out",
        },
        "-=0.5"
      )
      .to(
        ".hero-text-scroll",
        {
          rotation: -1.5,
          y: -8,
          duration: 2.4,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        },
        "+=0.2"
      );

    const heroTl = gsap.timeline({
      scrollTrigger: {
        trigger: ".hero-container",
        start: "1% top",
        end: "bottom top",
        scrub: true,
      },
    });
    heroTl.to(".hero-container", {
      rotate: 7,
      scale: 0.9,
      yPercent: 30,
      clipPath: "inset(0% 5% 0% 5% round 3vw)",
      ease: "power1.inOut",
    });

    const video = videoRef.current;
    if (video) {
      const startZoom = (duration) => {
        gsap.fromTo(
          video,
          { scale: 1 },
          { scale: 1.8, duration, ease: "none", transformOrigin: "center center" }
        );
      };

      if (video.readyState >= 1) {
        startZoom(video.duration);
      } else {
        video.addEventListener("loadedmetadata", () => startZoom(video.duration), { once: true });
      }
    }
  });

  return (
    <section className="bg-main-bg" data-nav-dark>
      <div className="hero-container">
        {isMobile ? null : (
          <video
            ref={videoRef}
            src="/videos/hero-bg.mp4"
            poster="/images/hero-poster.jpg"
            autoPlay
            muted
            playsInline
            preload="auto"
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        <div className="hero-content opacity-0">
          <div className="overflow-hidden">
            <h1 className="hero-title">Run Your Orders</h1>
          </div>
          <div
            style={{
              clipPath: "polygon(50% 0, 50% 0, 50% 100%, 50% 100%)",
            }}
            className="hero-text-scroll"
          >
            <div className="hero-subtitle">
              <h1>Own Your Kitchyn</h1>
            </div>
          </div>

          <h2>
            Launch your branded storefront in 24 hours. Take direct orders.
            Keep what you earn. We charge 1%.
          </h2>

          <button
            type="button"
            onClick={() => setDemoOpen(true)}
            className="hero-button cursor-pointer hover:scale-105 transition-transform"
          >
            <p>Book a Demo</p>
          </button>
        </div>
      </div>

      <BookDemoModal open={demoOpen} onClose={() => setDemoOpen(false)} />
    </section>
  );
};

export default HeroSection;
