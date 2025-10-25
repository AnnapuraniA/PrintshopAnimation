import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";

interface LoadingIntroProps {
  onComplete: () => void;
}

export const LoadingIntro = ({ onComplete }: LoadingIntroProps) => {
  const [stage, setStage] = useState<"loading" | "zooming" | "complete">("loading");

  useEffect(() => {
    // Stage 1: Show loading for 2 seconds
    const loadingTimer = setTimeout(() => {
      setStage("zooming");
    }, 2000);

    // Stage 2: Zoom out animation for 1.5 seconds
    const zoomTimer = setTimeout(() => {
      setStage("complete");
      setTimeout(onComplete, 500); // Small delay before removing component
    }, 3500);

    return () => {
      clearTimeout(loadingTimer);
      clearTimeout(zoomTimer);
    };
  }, [onComplete]);

  if (stage === "complete") return null;

  return (
    <div
      className={`fixed inset-0 z-[100] transition-all duration-1500 ${
        stage === "zooming"
          ? "bg-gradient-to-b from-[hsl(28,30%,18%)] to-[hsl(28,35%,15%)]"
          : "bg-gradient-to-br from-[hsl(186,85%,35%)] via-[hsl(186,80%,40%)] to-[hsl(186,75%,45%)]"
      }`}
      style={{
        transition: "all 1.5s cubic-bezier(0.4, 0, 0.2, 1)"
      }}
    >
      {/* Loading Content */}
      <div
        className="flex items-center gap-4 transition-all duration-1500 absolute"
        style={{
          transition: "all 1.5s cubic-bezier(0.4, 0, 0.2, 1)",
          ...(stage === "zooming"
            ? {
                top: "16px",
                left: "max(24px, calc((100vw - 1280px) / 2 + 24px))", // Container left padding
                transform: "translate(0, 0)"
              }
            : {
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)"
              })
        }}
      >
        {/* Logo */}
        <div
          className={`relative rounded-xl shadow-lg flex items-center justify-center overflow-hidden transition-all duration-1500 ${
            stage === "zooming"
              ? "bg-gradient-to-br from-[hsl(180,70%,45%)] to-[hsl(195,65%,55%)]"
              : "bg-gradient-to-br from-[hsl(25,85%,58%)] to-[hsl(35,90%,55%)]"
          }`}
          style={{
            transition: "all 1.5s cubic-bezier(0.4, 0, 0.2, 1)",
            width: stage === "zooming" ? "48px" : "128px",
            height: stage === "zooming" ? "48px" : "128px",
            boxShadow:
              stage === "zooming"
                ? "0 0 30px hsl(180 70% 45% / 0.5)"
                : "0 20px 50px rgba(0,0,0,0.3)"
          }}
        >
          {/* Animated glow effect - only during loading */}
          {stage === "loading" && (
            <div className="absolute inset-0 blur-2xl opacity-60 animate-pulse">
              <div className="w-full h-full bg-gradient-to-br from-[hsl(45,100%,70%)] to-[hsl(35,100%,60%)] rounded-full" />
            </div>
          )}

          <Sparkles
            className="text-white relative z-10 transition-all duration-1500"
            style={{
              width: stage === "zooming" ? "24px" : "64px",
              height: stage === "zooming" ? "24px" : "64px",
              transition: "all 1.5s cubic-bezier(0.4, 0, 0.2, 1)"
            }}
          />

          {/* Shimmer effect - matches header */}
          {stage === "zooming" && (
            <div
              className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent"
              style={{
                animation: "shimmer 2s linear infinite"
              }}
            />
          )}
        </div>

        {/* Company Name */}
        <h1
          className={`font-bold tracking-tight transition-all duration-1500 whitespace-nowrap ${
            stage === "zooming"
              ? "bg-gradient-to-r from-[hsl(180,70%,70%)] via-[hsl(195,65%,65%)] to-[hsl(180,70%,70%)] bg-clip-text text-transparent"
              : "text-white"
          }`}
          style={{
            fontSize: stage === "zooming" ? "1.5rem" : "3.75rem",
            lineHeight: stage === "zooming" ? "2rem" : "1",
            transition: "all 1.5s cubic-bezier(0.4, 0, 0.2, 1)"
          }}
        >
          {stage === "loading" ? (
            <span className="bg-gradient-to-r from-white via-[hsl(45,100%,90%)] to-white bg-clip-text text-transparent animate-pulse">
              CraftPrint
            </span>
          ) : (
            "CraftPrint"
          )}
        </h1>
      </div>

      {/* Tagline */}
      {stage === "loading" && (
        <div
          className="absolute transition-opacity duration-500"
          style={{
            top: "calc(50% + 100px)",
            left: "50%",
            transform: "translateX(-50%)"
          }}
        >
          <p className="text-2xl text-white/80 mb-8 tracking-wide text-center">
            Custom Printing Solutions
          </p>
        </div>
      )}

      {/* Loading Animation */}
      {stage === "loading" && (
        <div
          className="absolute transition-opacity duration-500"
          style={{
            top: "calc(50% + 180px)",
            left: "50%",
            transform: "translateX(-50%)"
          }}
        >
          <div className="flex items-center gap-3">
            <div className="flex gap-2">
              <div
                className="w-3 h-3 bg-white/90 rounded-full animate-bounce"
                style={{ animationDelay: "0ms", animationDuration: "1000ms" }}
              />
              <div
                className="w-3 h-3 bg-white/80 rounded-full animate-bounce"
                style={{ animationDelay: "150ms", animationDuration: "1000ms" }}
              />
              <div
                className="w-3 h-3 bg-white/70 rounded-full animate-bounce"
                style={{ animationDelay: "300ms", animationDuration: "1000ms" }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Shimmer Effect */}
      {stage === "loading" && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            className="absolute top-0 left-0 w-full h-full"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)",
              animation: "shimmer 3s infinite"
            }}
          />
        </div>
      )}

      <style>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
};
