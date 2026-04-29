'use client';
import { useEffect, useRef } from 'react';

/* ─── Rainbow wave canvas — full-width / full-height background ── */
export const RainbowWavesCanvas = () => {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    const ctx = canvas.getContext('2d'); if (!ctx) return;
    let animId: number;
    const PALETTE = [
      '#ef4444','#f97316','#eab308','#22c55e','#06b6d4','#3b82f6','#8b5cf6','#ec4899',
      '#ef4444','#f97316','#eab308','#22c55e','#06b6d4','#3b82f6','#8b5cf6','#ec4899',
      '#ef4444','#f97316',
    ];
    const N = 18; // more waves
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    let t = 0;
    const draw = () => {
      animId = requestAnimationFrame(draw);
      const w = canvas.width, h = canvas.height;
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < N; i++) {
        const baseY = (h / (N + 1)) * (i + 1);
        const freq  = 0.0038 + i * 0.00045;          // lower freq = wider waves
        const amp   = 35 + i * 4.5;                  // bigger amplitude
        const speed = 0.013 + i * 0.0032;
        const phase = i * ((Math.PI * 2) / N);
        const drift = Math.sin(t * 0.006 + i * 0.9) * 28; // bigger vertical drift
        const color = PALETTE[i % PALETTE.length];
        ctx.beginPath();
        for (let x = 0; x <= w; x += 2) {
          const y = baseY + drift + amp * Math.sin(x * freq + t * speed + phase)
                  + (amp * 0.35) * Math.sin(x * freq * 1.7 + t * speed * 0.6 + phase); // second harmonic
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.strokeStyle = color; ctx.lineWidth = 3.5;
        ctx.globalAlpha = 0.60; ctx.shadowColor = color; ctx.shadowBlur = 26; ctx.stroke();
        ctx.lineWidth = 1.4; ctx.globalAlpha = 0.90; ctx.shadowBlur = 10; ctx.stroke();
        ctx.shadowBlur = 0; ctx.globalAlpha = 1;
      }
      t++;
    };
    resize(); draw();
    window.addEventListener('resize', resize);
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={ref} className="absolute inset-0 w-full h-full pointer-events-none" />;
};

/* ─── Bouncing color-changing ball (kept for back-compat) ───── */
export const BouncingBall = () => null;

/* ─── Combined pricing bg: waves + bouncing balls that erase lines ── */
export const PricingBgCanvas = () => {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    const ctx = canvas.getContext('2d'); if (!ctx) return;
    let animId: number;

    const P = ['#ef4444','#f97316','#eab308','#22c55e','#06b6d4','#3b82f6','#8b5cf6','#ec4899',
               '#ef4444','#f97316','#eab308','#22c55e','#06b6d4','#3b82f6','#8b5cf6','#ec4899','#ef4444','#f97316'];
    const N  = 18;
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();

    interface Ball { x:number; y:number; vx:number; vy:number; r:number; ci:number; cd:number; }

    const mkBall = (i:number): Ball => {
      const spd = 10 + i * 1.8;
      const ang = (i / 3) * Math.PI * 2 + Math.random() * 0.8;
      return { x: canvas.width*(0.15+i*0.3), y: canvas.height*(0.25+i*0.25),
               vx: Math.cos(ang)*spd, vy: Math.sin(ang)*spd,
               r: 16+i*5, ci: i*4, cd: 0 };
    };
    const balls: Ball[] = [mkBall(0), mkBall(1), mkBall(2)];

    const waveY = (x:number, i:number, w:number, h:number, t:number) => {
      const base  = (h/(N+1))*(i+1);
      const freq  = 0.0038+i*0.00045, amp = 35+i*4.5;
      const spd   = 0.013+i*0.0032,   ph  = i*((Math.PI*2)/N);
      const drift = Math.sin(t*0.006+i*0.9)*28;
      return base+drift + amp*Math.sin(x*freq+t*spd+ph) + (amp*0.35)*Math.sin(x*freq*1.7+t*spd*0.6+ph);
    };

    let t = 0;
    const MAX_SPD = 18;

    const draw = () => {
      animId = requestAnimationFrame(draw);
      const w = canvas.width, h = canvas.height;
      ctx.clearRect(0,0,w,h);

      // ── Waves with ball-erased gaps ──
      for (let i = 0; i < N; i++) {
        const col = P[i%P.length];
        ctx.strokeStyle = col; ctx.shadowColor = col;

        // Two passes: thick glow + thin core
        for (let pass = 0; pass < 2; pass++) {
          ctx.lineWidth   = pass===0 ? 3.5 : 1.4;
          ctx.globalAlpha = pass===0 ? 0.60 : 0.90;
          ctx.shadowBlur  = pass===0 ? 26   : 10;

          let drawing = false;
          ctx.beginPath();
          for (let x = 0; x <= w; x += 3) {
            const wy  = waveY(x, i, w, h, t);
            const gap = balls.some(b => Math.hypot(b.x-x, b.y-wy) < b.r+20);
            if (!gap) {
              if (!drawing) { ctx.moveTo(x,wy); drawing=true; } else ctx.lineTo(x,wy);
            } else {
              if (drawing) { ctx.stroke(); ctx.beginPath(); drawing=false; }
            }
          }
          if (drawing) ctx.stroke();
        }
        ctx.shadowBlur=0; ctx.globalAlpha=1;
      }

      // ── Balls ──
      balls.forEach(b => {
        // Wave-line bounce (with cooldown to prevent multi-triggers)
        if (b.cd <= 0) {
          for (let i = 0; i < N; i++) {
            const wy = waveY(b.x, i, w, h, t);
            if (Math.abs(b.y-wy) < b.r+6) {
              b.vy  *= -(0.95+Math.random()*0.2);         // reverse + slight random
              b.vx  += (Math.random()-0.5)*4;             // random horizontal kick
              b.ci   = (b.ci+1)%P.length;
              b.cd   = 12;                                  // cooldown frames
              break;
            }
          }
        }
        if (b.cd > 0) b.cd--;

        // Wall bounces
        if (b.x-b.r<=0)  { b.vx= Math.abs(b.vx); b.ci=(b.ci+1)%P.length; }
        if (b.x+b.r>=w)  { b.vx=-Math.abs(b.vx); b.ci=(b.ci+1)%P.length; }
        if (b.y-b.r<=0)  { b.vy= Math.abs(b.vy); b.ci=(b.ci+1)%P.length; }
        if (b.y+b.r>=h)  { b.vy=-Math.abs(b.vy); b.ci=(b.ci+1)%P.length; }

        // Speed cap
        const spd = Math.hypot(b.vx,b.vy);
        if (spd>MAX_SPD) { b.vx*=MAX_SPD/spd; b.vy*=MAX_SPD/spd; }
        // Keep minimum speed
        if (spd<7) { const s=7/Math.max(spd,0.01); b.vx*=s; b.vy*=s; }

        b.x+=b.vx; b.y+=b.vy;

        const col = P[b.ci%P.length];

        // Glow halo
        const g = ctx.createRadialGradient(b.x,b.y,b.r*0.1,b.x,b.y,b.r*3);
        g.addColorStop(0,col+'cc'); g.addColorStop(0.4,col+'44'); g.addColorStop(1,col+'00');
        ctx.globalAlpha=0.42; ctx.beginPath(); ctx.arc(b.x,b.y,b.r*3,0,Math.PI*2);
        ctx.fillStyle=g; ctx.fill();

        // Core
        ctx.globalAlpha=0.90; ctx.shadowColor=col; ctx.shadowBlur=22;
        ctx.beginPath(); ctx.arc(b.x,b.y,b.r,0,Math.PI*2);
        ctx.fillStyle=col; ctx.fill();

        // Specular
        ctx.globalAlpha=0.5; ctx.shadowBlur=0;
        ctx.beginPath(); ctx.arc(b.x-b.r*0.28,b.y-b.r*0.28,b.r*0.36,0,Math.PI*2);
        ctx.fillStyle='white'; ctx.fill();

        ctx.globalAlpha=1; ctx.shadowBlur=0;
      });

      t++;
    };

    draw();
    const ro = new ResizeObserver(resize);
    if (canvas.parentElement) ro.observe(canvas.parentElement);
    return () => { cancelAnimationFrame(animId); ro.disconnect(); };
  },[]);
  return <canvas ref={ref} className="absolute inset-0 w-full h-full pointer-events-none"/>;
};

/* ─── Color-cycling particle canvas (exact home page version) ─ */
export const ParticleCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d'); if (!ctx) return;
    let animId: number; let frame = 0;
    const mouse = { x: -1000, y: -1000 };
    const COLORS: [number,number,number][] = [[37,99,235],[6,182,212],[124,58,237],[34,197,94],[236,72,153],[245,158,11]];
    const lerp = (t: number): [number,number,number] => {
      const s=((t%1)+1)%1,n=COLORS.length,idx=s*n,i=Math.floor(idx)%n,j=(i+1)%n,f=idx-Math.floor(idx);
      return [Math.round(COLORS[i][0]*(1-f)+COLORS[j][0]*f),Math.round(COLORS[i][1]*(1-f)+COLORS[j][1]*f),Math.round(COLORS[i][2]*(1-f)+COLORS[j][2]*f)];
    };
    interface P{x:number;y:number;vx:number;vy:number;size:number;alpha:number;hue:number}
    let pts:P[]=[];
    const resize=()=>{canvas.width=canvas.offsetWidth;canvas.height=canvas.offsetHeight;};
    const spawn=()=>{pts=[];const n=Math.min(110,Math.floor(canvas.width*canvas.height/11000));for(let i=0;i<n;i++)pts.push({x:Math.random()*canvas.width,y:Math.random()*canvas.height,vx:(Math.random()-.5)*.55,vy:(Math.random()-.5)*.55,size:Math.random()*2.8+1,alpha:Math.random()*.6+.35,hue:Math.random()});};
    const draw=()=>{
      frame++;ctx.clearRect(0,0,canvas.width,canvas.height);const gt=frame/600;
      pts.forEach((p,i)=>{
        if(p.x<0||p.x>canvas.width)p.vx*=-1;if(p.y<0||p.y>canvas.height)p.vy*=-1;p.x+=p.vx;p.y+=p.vy;
        const[r,g,b]=lerp(gt+p.hue);ctx.beginPath();ctx.arc(p.x,p.y,p.size,0,Math.PI*2);ctx.fillStyle=`rgba(${r},${g},${b},${p.alpha})`;ctx.fill();
        for(let j=i+1;j<pts.length;j++){const dx=pts[j].x-p.x,dy=pts[j].y-p.y,d=Math.hypot(dx,dy);if(d<150){const[r2,g2,b2]=lerp(gt+pts[j].hue);ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(pts[j].x,pts[j].y);ctx.strokeStyle=`rgba(${Math.round((r+r2)/2)},${Math.round((g+g2)/2)},${Math.round((b+b2)/2)},${.55*(1-d/150)})`;ctx.lineWidth=1.8;ctx.stroke();}}
        const md=Math.hypot(mouse.x-p.x,mouse.y-p.y);if(md<180){ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(mouse.x,mouse.y);ctx.strokeStyle=`rgba(${r},${g},${b},${.7*(1-md/180)})`;ctx.lineWidth=2.2;ctx.stroke();}
      });animId=requestAnimationFrame(draw);
    };
    const onMouse=(e:MouseEvent)=>{const r=canvas.getBoundingClientRect();mouse.x=e.clientX-r.left;mouse.y=e.clientY-r.top;};
    const onResize=()=>{resize();spawn();};
    resize();spawn();draw();window.addEventListener('mousemove',onMouse);window.addEventListener('resize',onResize);
    return()=>{cancelAnimationFrame(animId);window.removeEventListener('mousemove',onMouse);window.removeEventListener('resize',onResize);};
  },[]);
  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{willChange:'transform'}}/>;
};

/* ─── Static electricity canvas (exact home page version) ───── */
export const StaticElectricity = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d'); if (!ctx) return;
    let animId: number;
    const COLORS = ['#2563eb','#7c3aed','#06b6d4','#a855f7','#93c5fd','#c4b5fd','#e0e7ff'];
    const resize=()=>{canvas.width=canvas.offsetWidth;canvas.height=canvas.offsetHeight;};
    const drawArc=(x1:number,y1:number,x2:number,y2:number,segs:number,alpha:number,color:string,lw:number)=>{
      const dx=x2-x1,dy=y2-y1;ctx.beginPath();ctx.moveTo(x1,y1);
      for(let i=1;i<segs;i++){const t=i/segs,spread=30+Math.hypot(dx,dy)*.25;ctx.lineTo(x1+dx*t+(Math.random()-.5)*spread,y1+dy*t+(Math.random()-.5)*spread);}
      ctx.lineTo(x2,y2);ctx.globalAlpha=alpha;ctx.strokeStyle=color;ctx.lineWidth=lw;ctx.shadowBlur=18;ctx.shadowColor=color;ctx.stroke();ctx.shadowBlur=0;
    };
    const animate=()=>{
      ctx.globalAlpha=.22;ctx.fillStyle='#030712';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.globalAlpha=1;
      const W=canvas.width,H=canvas.height;const attempts=4+Math.floor(Math.random()*6);
      for(let i=0;i<attempts;i++){if(Math.random()>.55)continue;const color=COLORS[Math.floor(Math.random()*COLORS.length)];const alpha=.25+Math.random()*.75;const x1=Math.random()*W,y1=Math.random()*H;const isBolt=Math.random()<.25;const reach=isBolt?120+Math.random()*220:18+Math.random()*75;const angle=Math.random()*Math.PI*2;const x2=x1+Math.cos(angle)*reach,y2=y1+Math.sin(angle)*reach;drawArc(x1,y1,x2,y2,isBolt?7:3,alpha,color,isBolt?1.4:.6);if(isBolt&&Math.random()<.65){const mx=(x1+x2)/2+(Math.random()-.5)*20,my=(y1+y2)/2+(Math.random()-.5)*20;const bx=mx+(Math.random()-.5)*100,by=my+(Math.random()-.5)*100;drawArc(mx,my,bx,by,4,alpha*.55,color,.55);if(Math.random()<.3){drawArc(mx,my,mx+(Math.random()-.5)*70,my+(Math.random()-.5)*70,3,alpha*.35,color,.4);}}}
      animId=requestAnimationFrame(animate);
    };
    resize();window.addEventListener('resize',resize);animate();
    return()=>{cancelAnimationFrame(animId);window.removeEventListener('resize',resize);};
  },[]);
  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" style={{mixBlendMode:'screen',opacity:.9}}/>;
};

/* ─── Scrolling marquee ticker (exact home page version) ──────── */
export const MarqueeBand = () => (
  <div className="marquee-band">
    <div className="marquee-inner">
      {['From $147/mo','Built in 3-7 Days','SEO Optimized','Mobile Friendly','Lead Generation Focused','30-Day Results Guarantee','Google Ads Ready','You Own Your Site',
        'From $147/mo','Built in 3-7 Days','SEO Optimized','Mobile Friendly','Lead Generation Focused','30-Day Results Guarantee','Google Ads Ready','You Own Your Site']
        .map((t,i)=><span key={i} className="marquee-item">{t}</span>)}
    </div>
  </div>
);

/* ─── Animated background orbs ────────────────────────────────── */
export const HeroOrbs = () => (
  <>
    <div className="absolute top-[-5%] left-[-5%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none animate-orb"/>
    <div className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] bg-purple-600/8 rounded-full blur-[140px] pointer-events-none animate-orb-delay"/>
    <div className="absolute top-[40%] left-[50%] w-[300px] h-[300px] bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none animate-orb-slow"/>
  </>
);

export const SectionOrbs = ({ variant = 'blue' }: { variant?: 'blue'|'purple'|'cyan'|'green'|'mixed' }) => {
  const configs: Record<string,React.ReactNode> = {
    blue:   <><div className="absolute top-[-8%] left-[5%]   w-[420px] h-[420px] bg-blue-600/10   rounded-full blur-[120px] pointer-events-none animate-orb"/><div className="absolute bottom-[-8%] right-[5%]  w-[380px] h-[380px] bg-blue-700/8    rounded-full blur-[110px] pointer-events-none animate-orb-delay"/></>,
    purple: <><div className="absolute top-[-8%] right-[5%]  w-[440px] h-[440px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none animate-orb-delay"/><div className="absolute bottom-[-8%] left-[5%]   w-[360px] h-[360px] bg-purple-700/8  rounded-full blur-[110px] pointer-events-none animate-orb"/></>,
    cyan:   <><div className="absolute top-[-8%] left-[20%]  w-[400px] h-[400px] bg-cyan-500/9    rounded-full blur-[120px] pointer-events-none animate-orb-slow"/><div className="absolute bottom-[-8%] right-[20%] w-[360px] h-[360px] bg-teal-500/7    rounded-full blur-[110px] pointer-events-none animate-orb"/></>,
    green:  <><div className="absolute top-[-8%] right-[10%] w-[420px] h-[420px] bg-green-600/8   rounded-full blur-[120px] pointer-events-none animate-orb"/><div className="absolute bottom-[-8%] left-[10%]  w-[380px] h-[380px] bg-emerald-500/7 rounded-full blur-[110px] pointer-events-none animate-orb-slow"/></>,
    mixed:  <><div className="absolute top-[-5%]  left-[5%]  w-[420px] h-[420px] bg-blue-600/10   rounded-full blur-[120px] pointer-events-none animate-orb"/><div className="absolute top-[20%]   right-[-5%] w-[380px] h-[380px] bg-purple-600/9  rounded-full blur-[110px] pointer-events-none animate-orb-delay"/><div className="absolute bottom-[-8%] left-[35%]  w-[320px] h-[320px] bg-cyan-500/7    rounded-full blur-[100px] pointer-events-none animate-orb-slow"/><div className="absolute bottom-[10%] right-[10%] w-[260px] h-[260px] bg-pink-500/6    rounded-full blur-[90px]  pointer-events-none animate-orb"/></>,
  };
  return <>{configs[variant]}</>;
};

/* ─── Grid + dot overlay ────────────────────────────────────── */
export const GridOverlay = ({ gridOp = 0.35, dotOp = 0.18 }: { gridOp?: number; dotOp?: number }) => (
  <>
    <div className="absolute inset-0 bg-grid pointer-events-none" style={{opacity:gridOp}}/>
    <div className="absolute inset-0 bg-dot  pointer-events-none" style={{opacity:dotOp}}/>
  </>
);
