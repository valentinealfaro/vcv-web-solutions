import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { cn } from "@/lib/utils";

export interface MarkerHighlightProps {
  before?: string;
  highlight: string;
  after?: string;
  /** Any valid CSS color or gradient string. */
  markerColor?: string;
  className?: string;
  /** Seconds to wait before the stroke starts. */
  delay?: number;
  /** Fire once (default) or every time element re-enters view. */
  once?: boolean;
}

export function MarkerHighlight({
  before = "",
  highlight,
  after = "",
  markerColor = "rgba(37, 99, 235, 0.88)",
  className,
  delay = 0,
  once = true,
}: MarkerHighlightProps) {
  const ref = useRef<HTMLSpanElement>(null);

  // 50 % of element must be visible before animating — ensures it only fires
  // when the user has actually scrolled the section into view.
  const inView = useInView(ref, { once, amount: 0.5 });

  return (
    <span ref={ref} className={cn("whitespace-nowrap", className)}>
      {before && <>{before}</>}

      {/*
        The wrapper is skewed like a real pen stroke.
        The inner text is counter-skewed so letters stay upright.
      */}
      <span
        style={{
          position: "relative",
          display: "inline-block",
          transform: "skewX(-4deg)",
          padding: "0 0.08em",
        }}
      >
        {/* ── Marker fill ────────────────────────────── */}
        <motion.span
          aria-hidden
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{
            duration: 0.42,
            ease: [0.22, 1, 0.36, 1],   // fast start, gentle settle
            delay,
          }}
          style={{
            position: "absolute",
            inset: "-0.08em 0",
            background: markerColor,
            transformOrigin: "left center",
            zIndex: 0,
            borderRadius: "1px 3px 3px 1px",
          }}
        />

        {/* ── Shine strip (top 30 %) ──────────────────── */}
        <motion.span
          aria-hidden
          initial={{ scaleX: 0, opacity: 0 }}
          animate={
            inView
              ? { scaleX: 1, opacity: 0.22 }
              : { scaleX: 0, opacity: 0 }
          }
          transition={{
            duration: 0.38,
            ease: [0.22, 1, 0.36, 1],
            delay: delay + 0.04,
          }}
          style={{
            position: "absolute",
            top: "0.06em",
            left: 0,
            right: 0,
            height: "28%",
            background: "rgba(255,255,255,0.9)",
            transformOrigin: "left center",
            zIndex: 1,
            borderRadius: "1px 3px 0 0",
          }}
        />

        {/* ── Text (counter-skewed so it reads straight) */}
        <span
          style={{
            position: "relative",
            zIndex: 2,
            display: "inline-block",
            transform: "skewX(4deg)",
          }}
        >
          {highlight}
        </span>
      </span>

      {after && <>{after}</>}
    </span>
  );
}
