import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { cn } from "@/lib/utils";

export interface MarkerHighlightProps {
  before?: string;
  highlight: string;
  after?: string;
  /** CSS color or gradient for the marker. Defaults to the site's blue. */
  markerColor?: string;
  className?: string;
  /** Extra delay in seconds before the sweep starts. */
  delay?: number;
  /** Run animation only once (default true). */
  once?: boolean;
}

export function MarkerHighlight({
  before = "",
  highlight,
  after = "",
  markerColor = "rgba(37, 99, 235, 0.85)",
  className,
  delay = 0,
  once = true,
}: MarkerHighlightProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once, margin: "-15%" });

  return (
    <span ref={ref} className={cn(className)}>
      {before}
      <span style={{ position: "relative", display: "inline-block" }}>
        {/* The sweeping marker */}
        <motion.span
          aria-hidden
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{
            duration: 0.55,
            ease: [0.16, 1, 0.3, 1],
            delay,
          }}
          style={{
            position: "absolute",
            inset: "-0.08em -0.1em",
            background: markerColor,
            transformOrigin: "left center",
            zIndex: 0,
            borderRadius: "3px",
          }}
        />
        {/* Text sits on top of the marker */}
        <span style={{ position: "relative", zIndex: 1 }}>{highlight}</span>
      </span>
      {after}
    </span>
  );
}
