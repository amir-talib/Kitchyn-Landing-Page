import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/all";
import { useMediaQuery } from "react-responsive";

const HeroSection = () => {
  const videoRef = useRef(null);
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

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
    <section className="bg-main-bg">
      <div className="hero-container">
        {isMobile ? (
          <div
            className="absolute inset-0 w-full h-full"
            style={{
              background: `
                radial-gradient(ellipse at 15% 85%, #9d4edd55 0%, transparent 55%),
                radial-gradient(ellipse at 85% 15%, #7b2cbf44 0%, transparent 50%),
                radial-gradient(ellipse at 50% 50%, #3c096c 0%, #240046 50%, #10002b 100%)
              `,
            }}
          />
        ) : (
          <video
            ref={videoRef}
            src="/videos/hero-bg.mp4"
            autoPlay
            muted
            playsInline
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

          <div className="hero-button">
            <p>Book a Demo</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
