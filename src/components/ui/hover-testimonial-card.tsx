import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

export interface VCVTestimonial {
  id: string;
  quote: string;
  stars: number;
  stat: string;
  author: {
    name: string;
    title: string;
    avatar?: string;
    initials?: string;
  };
  company: {
    name: string;
    initials: string;
    color: string;        // accent color for logo badge
    industry: string;     // e.g. "Roofing"
  };
}

interface TestimonialShowcaseProps {
  testimonials: VCVTestimonial[];
  className?: string;
  defaultTestimonialId?: string;
  autoPlayInterval?: number;
}

const StarRating = ({ count }: { count: number }) => (
  <div className="flex gap-0.5">
    {[...Array(5)].map((_, i) => (
      <svg key={i} className={`w-4 h-4 ${i < count ? 'text-yellow-400' : 'text-gray-700'}`}
        fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))}
  </div>
);

const CompanyBadge = ({ company }: { company: VCVTestimonial['company'] }) => (
  <div className="flex items-center gap-2.5 opacity-90 hover:opacity-100 transition-opacity">
    <div style={{
      width: 42, height: 42, borderRadius: 10, flexShrink: 0,
      background: `${company.color}22`,
      border: `1.5px solid ${company.color}55`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: company.color, fontWeight: 800, fontSize: 13, letterSpacing: '0.05em',
    }}>
      {company.initials}
    </div>
    <div>
      <p style={{ color: '#f1f5f9', fontWeight: 700, fontSize: 13, lineHeight: 1.2, margin: 0 }}>
        {company.name}
      </p>
      <p style={{ color: company.color, fontSize: 10, fontWeight: 600,
        textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>
        {company.industry}
      </p>
    </div>
  </div>
);

export const TestimonialShowcase: React.FC<TestimonialShowcaseProps> = ({
  testimonials,
  className,
  defaultTestimonialId,
  autoPlayInterval = 5000,
}) => {
  const [activeIndex, setActiveIndex] = useState(
    testimonials.findIndex(t => t.id === defaultTestimonialId) || 0
  );
  const [isAnimating, setIsAnimating] = useState(false);
  const [mousePos,    setMousePos]    = useState({ x: 0, y: 0 });
  const [isHovered,   setIsHovered]   = useState(false);
  const cardRef  = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  const active = testimonials[activeIndex];

  // Auto-advance
  useEffect(() => {
    if (!isHovered) {
      timerRef.current = setInterval(() => {
        switchTo((activeIndex + 1) % testimonials.length);
      }, autoPlayInterval);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [activeIndex, isHovered, autoPlayInterval, testimonials.length]);

  const switchTo = (idx: number) => {
    if (idx === activeIndex || isAnimating) return;
    setIsAnimating(true);
    setTimeout(() => {
      setActiveIndex(idx);
      setTimeout(() => setIsAnimating(false), 120);
    }, 200);
  };

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (cardRef.current) {
      const r = cardRef.current.getBoundingClientRect();
      setMousePos({ x: e.clientX - r.left, y: e.clientY - r.top });
    }
  };

  return (
    <div className={cn('w-full select-none max-w-4xl mx-auto space-y-5', className)}>

      {/* ── Main card ──────────────────────────────────────── */}
      <div
        ref={cardRef}
        onMouseMove={onMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => switchTo((activeIndex + 1) % testimonials.length)}
        className="group relative overflow-hidden cursor-pointer"
        style={{
          borderRadius: 20,
          border: '1px solid rgba(255,255,255,0.07)',
          background: 'rgba(8,12,26,0.85)',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
          transition: 'border-color 0.3s, box-shadow 0.3s',
        }}
        onMouseOver={e => {
          (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(37,99,235,0.45)';
          (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 60px rgba(0,0,0,0.6), 0 0 40px rgba(37,99,235,0.08)';
        }}
        onMouseOut={e => {
          (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.07)';
          (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 40px rgba(0,0,0,0.5)';
        }}
      >
        {/* Dot texture on hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle, rgba(99,102,241,0.2) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

        {/* Mouse-following glow */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{ background: `radial-gradient(500px circle at ${mousePos.x}px ${mousePos.y}px, rgba(37,99,235,0.12), transparent 45%)` }} />

        <div className="relative z-10 p-8 md:p-10 flex flex-col gap-6">
          {/* Header row: stars + stat badge */}
          <div className={cn('flex items-center justify-between transition-all duration-500',
            isAnimating ? 'opacity-0 translate-y-3' : 'opacity-100 translate-y-0')}>
            <StarRating count={active.stars} />
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              background: 'rgba(37,99,235,0.14)', border: '1px solid rgba(37,99,235,0.35)',
              borderRadius: 999, padding: '4px 12px',
              color: '#93c5fd', fontSize: 11, fontWeight: 700,
              textTransform: 'uppercase', letterSpacing: '0.09em',
            }}>
              ↑ {active.stat}
            </span>
          </div>

          {/* Quote */}
          <blockquote className={cn(
            'text-xl md:text-2xl font-semibold leading-relaxed text-gray-100 transition-all duration-500',
            isAnimating ? 'blur-sm opacity-0 translate-y-4' : 'blur-0 opacity-100 translate-y-0'
          )} style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            "{active.quote}"
          </blockquote>

          {/* Author row */}
          <div className={cn('flex items-center justify-between transition-all duration-500',
            isAnimating ? 'blur-sm opacity-0 translate-y-4' : 'blur-0 opacity-100 translate-y-0')}>

            {/* Author */}
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12 border-2 rounded-xl" style={{ borderColor: `${active.company.color}50` }}>
                <AvatarImage src={active.author.avatar} alt={active.author.name} />
                <AvatarFallback style={{ background: `${active.company.color}22`, color: active.company.color,
                  fontWeight: 800, fontSize: 14, borderRadius: 10 }}>
                  {active.author.initials || active.author.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-white font-bold text-sm">{active.author.name}</p>
                <p className="text-gray-500 text-xs">{active.author.title}</p>
              </div>
            </div>

            {/* Company badge / logo */}
            <CompanyBadge company={active.company} />
          </div>
        </div>
      </div>

      {/* ── Avatar grid — basketball bounce entrance ──────── */}
      <div className="flex flex-wrap gap-2 justify-center">
        {testimonials.map((t, i) => {
          const isActive = i === activeIndex;
          return (
            <motion.div
              key={t.id}
              className="relative group/av"
              style={{ cursor: 'pointer' }}
              onClick={() => switchTo(i)}
              /* ── Basketball bounce keyframes ──────────────────────
                 y:      drop   hit1  rise1  hit2  rise2  hit3  tiny  settle
                 scaleX: normal squish normal squish normal squish      1
                 scaleY: normal squish normal squish normal squish      1
                 Stagger 65ms apart → wave effect across all 10 avatars  */
              initial={{ y: -130, opacity: 0, scaleX: 0.92, scaleY: 1.08 }}
              whileInView={{
                y:       [-130, 0,    -52,  0,    -22,  0,    -7,   0],
                opacity: [0,    1,    1,    1,    1,    1,    1,    1],
                scaleX:  [0.92, 1.28, 0.94, 1.18, 0.96, 1.08, 0.99, 1],
                scaleY:  [1.08, 0.78, 1.06, 0.86, 1.03, 0.93, 1.01, 1],
              }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{
                duration: 0.95,
                delay: i * 0.065,
                times: [0, 0.27, 0.44, 0.57, 0.68, 0.78, 0.88, 1],
                ease: 'easeInOut',
              }}
              whileHover={{ scale: isActive ? 1.15 : 1.12 }}>

              <Avatar
                className="h-10 w-10 rounded-xl border-2 transition-all duration-300"
                style={{
                  borderColor: isActive ? t.company.color : 'rgba(255,255,255,0.1)',
                  boxShadow:   isActive ? `0 0 16px ${t.company.color}70` : 'none',
                }}>
                <AvatarImage src={t.author.avatar} alt={t.author.name} />
                <AvatarFallback style={{
                  background: `${t.company.color}22`, color: t.company.color,
                  fontWeight: 800, fontSize: 11, borderRadius: 10,
                }}>
                  {t.author.initials || t.author.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>

              {/* Tooltip */}
              <div className="absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap
                bg-[#0a0f1e] text-white text-xs px-2 py-1 rounded border border-white/10
                opacity-0 group-hover/av:opacity-100 transition-opacity duration-200 pointer-events-none z-20">
                {t.author.name}
              </div>
            </motion.div>
          );
        })}
      </div>

    </div>
  );
};
