'use client';
import { useEffect, useRef } from 'react';

export const CustomCursor = () => {
  const outer = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: -100, y: -100 });
  const outerPos = useRef({ x: -100, y: -100 });

  useEffect(() => {
    const move = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
      if (inner.current) {
        inner.current.style.left = e.clientX + 'px';
        inner.current.style.top = e.clientY + 'px';
      }
    };

    let animId: number;
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const tick = () => {
      outerPos.current.x = lerp(outerPos.current.x, pos.current.x, 0.15);
      outerPos.current.y = lerp(outerPos.current.y, pos.current.y, 0.15);
      if (outer.current) {
        outer.current.style.left = outerPos.current.x + 'px';
        outer.current.style.top = outerPos.current.y + 'px';
      }
      animId = requestAnimationFrame(tick);
    };
    tick();

    const onEnter = () => {
      outer.current?.classList.add('hovering');
      inner.current?.classList.add('hovering');
    };
    const onLeave = () => {
      outer.current?.classList.remove('hovering');
      inner.current?.classList.remove('hovering');
    };

    window.addEventListener('mousemove', move);
    const attach = () => {
      document.querySelectorAll('a,button,[data-hover]').forEach(el => {
        el.addEventListener('mouseenter', onEnter);
        el.addEventListener('mouseleave', onLeave);
      });
    };
    attach();
    const observer = new MutationObserver(attach);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', move);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <div ref={outer} className="cursor-outer hidden md:block" />
      <div ref={inner} className="cursor-inner hidden md:block" />
    </>
  );
};
