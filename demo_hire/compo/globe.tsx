import { Globe } from "@/components/ui/globe"
import { useEffect, useState } from "react";

export function GlobeSection() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-visible">
      
      {/* GLOBE WRAPPER (IMPORTANT FIX) */}
      <div className="relative w-[650px] h-[650px] z-20">
        <Globe className="w-full h-full" />
      </div>

      {/* TEXT */}
      <div className="absolute z-30 text-white/80 text-4xl font-semibold">
        Global
      </div>

      {/* BACKGROUND GLOW (KEEP BEHIND EVERYTHING) */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_50%_50%,rgba(163,230,53,0.12),transparent_60%)]" />

    </div>
  );
}
