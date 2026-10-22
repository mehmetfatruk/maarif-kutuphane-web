"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "./icons";

/** Kitap kapaklarını yatay kaydırır; oklarla bir ekran ileri/geri gider. */
export function BookSlider({ label, children }: { label: string; children: React.ReactNode }) {
  const track = useRef<HTMLUListElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });

  const update = () => {
    const el = track.current;
    if (!el) return;
    setEdges({ start: el.scrollLeft < 8, end: el.scrollLeft + el.clientWidth > el.scrollWidth - 8 });
  };

  useEffect(() => {
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const go = (dir: 1 | -1) => {
    const el = track.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: "smooth" });
  };

  const button =
    "inline-flex size-11 items-center justify-center rounded-full border-2 border-navy-900 text-navy-900 transition-colors hover:bg-navy-900 hover:text-white disabled:cursor-default disabled:border-line disabled:text-line disabled:hover:bg-transparent";

  return (
    <div>
      <div className="mb-6 flex justify-end gap-2">
        <button type="button" className={button} onClick={() => go(-1)} disabled={edges.start} aria-label={`${label}: önceki`}>
          <ArrowRight className="size-5 rotate-180" />
        </button>
        <button type="button" className={button} onClick={() => go(1)} disabled={edges.end} aria-label={`${label}: sonraki`}>
          <ArrowRight className="size-5" />
        </button>
      </div>
      <ul
        ref={track}
        onScroll={update}
        aria-label={label}
        className="-mx-4 flex snap-x snap-mandatory scroll-px-4 gap-7 overflow-x-auto px-4 pb-4 [scrollbar-width:none] sm:-mx-6 sm:scroll-px-6 sm:px-6 [&::-webkit-scrollbar]:hidden"
      >
        {children}
      </ul>
    </div>
  );
}
