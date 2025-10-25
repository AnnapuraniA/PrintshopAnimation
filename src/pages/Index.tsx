import { useState } from "react";
import { Header } from "@/components/Header";
import { PrintingScene3D } from "@/components/PrintingScene3D";
import { LoadingIntro } from "@/components/LoadingIntro";

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);

  const handleLoadingComplete = () => {
    setIsLoading(false);
    // Delay showing full content slightly to ensure smooth transition
    setTimeout(() => setShowContent(true), 100);
  };

  return (
    <>
      {isLoading && <LoadingIntro onComplete={handleLoadingComplete} />}
      <div className="relative">
        {/* Header is visible during zoom transition */}
        <Header />
        {/* Scene content fades in after loading */}
        <div className={`pt-[72px] transition-opacity duration-1000 ${showContent ? "opacity-100" : "opacity-0"}`}>
          <PrintingScene3D />
        </div>
      </div>
    </>
  );
};

export default Index;
