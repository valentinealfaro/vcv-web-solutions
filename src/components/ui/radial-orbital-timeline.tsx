import { useState, useEffect, useRef } from "react";
import { ArrowRight, Link, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TimelineItem {
  id: number;
  title: string;
  date: string;
  content: string;
  category: string;
  icon: React.ElementType;
  relatedIds: number[];
  status: "completed" | "in-progress" | "pending";
  energy: number;
}

interface RadialOrbitalTimelineProps {
  timelineData: TimelineItem[];
}

export default function RadialOrbitalTimeline({ timelineData }: RadialOrbitalTimelineProps) {
  const [expandedItems, setExpandedItems] = useState<Record<number, boolean>>({});
  const [rotationAngle, setRotationAngle] = useState<number>(0);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [pulseEffect, setPulseEffect] = useState<Record<number, boolean>>({});
  const [centerOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [activeNodeId, setActiveNodeId] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const orbitRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Record<number, HTMLDivElement | null>>({});

  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === containerRef.current || e.target === orbitRef.current) {
      setExpandedItems({});
      setActiveNodeId(null);
      setPulseEffect({});
      setAutoRotate(true);
    }
  };

  const getRelatedItems = (itemId: number): number[] => {
    const current = timelineData.find((i) => i.id === itemId);
    return current ? current.relatedIds : [];
  };

  const centerViewOnNode = (nodeId: number) => {
    const nodeIndex = timelineData.findIndex((i) => i.id === nodeId);
    const total = timelineData.length;
    const targetAngle = (nodeIndex / total) * 360;
    setRotationAngle(270 - targetAngle);
  };

  const toggleItem = (id: number) => {
    setExpandedItems((prev) => {
      const next: Record<number, boolean> = {};
      Object.keys(prev).forEach((k) => { next[+k] = false; });
      next[id] = !prev[id];

      if (!prev[id]) {
        setActiveNodeId(id);
        setAutoRotate(false);
        const pulse: Record<number, boolean> = {};
        getRelatedItems(id).forEach((r) => { pulse[r] = true; });
        setPulseEffect(pulse);
        centerViewOnNode(id);
      } else {
        setActiveNodeId(null);
        setAutoRotate(true);
        setPulseEffect({});
      }
      return next;
    });
  };

  useEffect(() => {
    if (!autoRotate) return;
    const id = setInterval(() => {
      setRotationAngle((p) => Number(((p + 1.2) % 360).toFixed(3)));
    }, 50);
    return () => clearInterval(id);
  }, [autoRotate]);

  const calculateNodePosition = (index: number, total: number) => {
    const angle = ((index / total) * 360 + rotationAngle) % 360;
    const radius = 190;
    const rad = (angle * Math.PI) / 180;
    return {
      x: radius * Math.cos(rad) + centerOffset.x,
      y: radius * Math.sin(rad) + centerOffset.y,
      zIndex: Math.round(100 + 50 * Math.cos(rad)),
      opacity: Math.max(0.35, Math.min(1, 0.35 + 0.65 * ((1 + Math.sin(rad)) / 2))),
    };
  };

  const isRelatedToActive = (id: number) =>
    activeNodeId ? getRelatedItems(activeNodeId).includes(id) : false;

  const getStatusStyles = (status: TimelineItem["status"]) => {
    switch (status) {
      case "completed":   return "text-white bg-blue-700 border-blue-500";
      case "in-progress": return "text-white bg-purple-700 border-purple-400";
      default:            return "text-gray-300 bg-[#030712] border-white/20";
    }
  };

  return (
    <div
      ref={containerRef}
      onClick={handleContainerClick}
      className="w-full flex flex-col items-center justify-center bg-[#030712] overflow-hidden"
      style={{ height: '520px' }}
    >
      <div className="relative w-full max-w-3xl h-full flex items-center justify-center">
        <div
          ref={orbitRef}
          className="absolute w-full h-full flex items-center justify-center"
          style={{
            perspective: "1000px",
            transform: `translate(${centerOffset.x}px, ${centerOffset.y}px)`,
          }}
        >
          {/* ── Orbit ring ── */}
          <div className="absolute w-[380px] h-[380px] rounded-full border border-blue-900/40" />
          <div className="absolute w-[340px] h-[340px] rounded-full border border-purple-900/20" />

          {/* ── Centre pulsing orb ── */}
          <div className="absolute w-14 h-14 rounded-full bg-gradient-to-br from-blue-600 via-purple-600 to-cyan-500 animate-pulse flex items-center justify-center z-10 shadow-[0_0_30px_rgba(37,99,235,0.5)]">
            <div className="absolute w-18 h-18 rounded-full border border-blue-500/20 animate-ping opacity-60" style={{ width: 72, height: 72 }} />
            <div className="absolute rounded-full border border-purple-500/15 animate-ping opacity-40" style={{ width: 90, height: 90, animationDelay: "0.6s" }} />
            <div className="w-7 h-7 rounded-full bg-white/85 backdrop-blur-md" />
          </div>

          {/* ── Nodes ── */}
          {timelineData.map((item, index) => {
            const pos = calculateNodePosition(index, timelineData.length);
            const isExpanded = !!expandedItems[item.id];
            const isRelated = isRelatedToActive(item.id);
            const isPulsing = !!pulseEffect[item.id];
            const Icon = item.icon;

            return (
              <div
                key={item.id}
                ref={(el) => { nodeRefs.current[item.id] = el; }}
                className="absolute transition-all duration-700 cursor-pointer"
                style={{
                  transform: `translate(${pos.x}px, ${pos.y}px)`,
                  zIndex: isExpanded ? 200 : pos.zIndex,
                  opacity: isExpanded ? 1 : pos.opacity,
                }}
                onClick={(e) => { e.stopPropagation(); toggleItem(item.id); }}
              >
                {/* Energy halo */}
                <div
                  className={`absolute rounded-full ${isPulsing ? "animate-pulse" : ""}`}
                  style={{
                    background: "radial-gradient(circle, rgba(37,99,235,0.25) 0%, transparent 70%)",
                    width:  `${item.energy * 0.45 + 36}px`,
                    height: `${item.energy * 0.45 + 36}px`,
                    left:   `-${(item.energy * 0.45 + 36 - 40) / 2}px`,
                    top:    `-${(item.energy * 0.45 + 36 - 40) / 2}px`,
                  }}
                />

                {/* Icon button */}
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300
                  ${isExpanded
                    ? "bg-blue-600 text-white border-blue-400 scale-150 shadow-[0_0_20px_rgba(37,99,235,0.6)]"
                    : isRelated
                    ? "bg-purple-600/50 text-white border-purple-400 animate-pulse"
                    : "bg-[#0a0f1e] text-blue-400 border-blue-900/50 hover:border-blue-500/60"
                  }
                `}>
                  <Icon size={15} />
                </div>

                {/* Label */}
                <div className={`
                  absolute top-11 left-1/2 -translate-x-1/2 whitespace-nowrap
                  text-[10px] font-bold tracking-widest uppercase transition-all duration-300
                  ${isExpanded ? "text-blue-300 scale-110" : "text-gray-400"}
                `}>
                  {item.title}
                </div>

                {/* Expanded card */}
                {isExpanded && (
                  <Card className="absolute top-16 left-1/2 -translate-x-1/2 w-60 bg-[#0a0f1e]/95 backdrop-blur-xl border-blue-800/40 shadow-[0_0_40px_rgba(37,99,235,0.2)] overflow-visible z-50">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-px h-3 bg-blue-500/60" />
                    <CardHeader className="pb-2 pt-4 px-4">
                      <div className="flex justify-between items-center mb-1">
                        <Badge className={`text-[10px] px-2 py-0.5 ${getStatusStyles(item.status)}`}>
                          {item.status === "completed" ? "DONE" : item.status === "in-progress" ? "ACTIVE" : "INCLUDED"}
                        </Badge>
                        <span className="text-[10px] font-mono text-blue-400/60">{item.date}</span>
                      </div>
                      <CardTitle className="text-xs text-white">{item.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-[11px] text-gray-300 px-4 pb-4">
                      <p>{item.content}</p>

                      {/* Energy bar — repurposed as "value bar" */}
                      <div className="mt-3 pt-3 border-t border-blue-900/30">
                        <div className="flex justify-between text-[10px] mb-1 text-gray-400">
                          <span className="flex items-center gap-1"><Zap size={9} className="text-blue-400" /> Value</span>
                          <span className="font-mono text-blue-300">{item.energy}%</span>
                        </div>
                        <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"
                            style={{ width: `${item.energy}%` }}
                          />
                        </div>
                      </div>

                      {item.relatedIds.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-blue-900/30">
                          <div className="flex items-center gap-1 mb-2">
                            <Link size={9} className="text-blue-400/60" />
                            <span className="text-[10px] uppercase tracking-wider text-gray-500">Also includes</span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {item.relatedIds.map((rid) => {
                              const rel = timelineData.find((i) => i.id === rid);
                              return (
                                <Button
                                  key={rid}
                                  variant="outline"
                                  size="sm"
                                  className="h-5 px-2 text-[10px] border-blue-900/40 bg-blue-600/10 hover:bg-blue-600/20 text-blue-300 hover:text-blue-200 rounded-md"
                                  onClick={(e) => { e.stopPropagation(); toggleItem(rid); }}
                                >
                                  {rel?.title}
                                  <ArrowRight size={7} className="ml-1 opacity-60" />
                                </Button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
