'use client';
import { cn } from '@/lib/utils';
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

// HSL (0-1 each) → RGB (0-1 each)
const hslToRgb = (h: number, s: number, l: number): [number, number, number] => {
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => { const k = (n + h * 12) % 12; return l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1)); };
  return [f(0), f(8), f(4)];
};

type DottedSurfaceProps = Omit<React.ComponentProps<'div'>, 'ref'> & {
  colorful?: boolean;
};

export function DottedSurface({ className, colorful = false, ...props }: DottedSurfaceProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const COLS = 30;
    const ROWS = 20;

    const getW = () => container.clientWidth  || 1;
    const getH = () => container.clientHeight || 1;

    // Orthographic camera — units == pixels, covers the container exactly
    const camera = new THREE.OrthographicCamera(
      -getW() / 2,  getW() / 2,
       getH() / 2, -getH() / 2,
      1, 1000,
    );
    camera.position.z = 100;

    const scene = new THREE.Scene();

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(getW(), getH());
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // Geometry — positions filled dynamically each frame
    const COUNT = COLS * ROWS;
    const geometry  = new THREE.BufferGeometry();
    const posArr    = new Float32Array(COUNT * 3);
    const colorArr  = new Float32Array(COUNT * 3);

    // initialise to white
    for (let i = 0; i < COUNT; i++) { colorArr[i * 3] = 0.75; colorArr[i * 3 + 1] = 0.75; colorArr[i * 3 + 2] = 0.75; }

    geometry.setAttribute('position', new THREE.BufferAttribute(posArr,   3));
    geometry.setAttribute('color',    new THREE.BufferAttribute(colorArr, 3));

    const material = new THREE.PointsMaterial({
      size: 4, vertexColors: true, transparent: true, opacity: 0.75, sizeAttenuation: false,
    });

    scene.add(new THREE.Points(geometry, material));

    let count   = 0;
    let animId: number;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const w = getW(), h = getH();
      const spacingX = w / (COLS - 1);
      const spacingY = h / (ROWS - 1);
      const ampY     = h * 0.04;

      let i = 0;
      for (let col = 0; col < COLS; col++) {
        for (let row = 0; row < ROWS; row++) {
          const idx = i * 3;
          posArr[idx]     = col * spacingX - w / 2;
          posArr[idx + 1] = row * spacingY - h / 2
            + Math.sin((col + count) * 0.5)        * ampY
            + Math.sin((row + count * 0.8) * 0.65) * ampY * 0.6;
          posArr[idx + 2] = 0;

          if (colorful) {
            const hue = ((col * 13 + row * 7 + count * 30) % 360) / 360;
            const [r, g, b] = hslToRgb(hue, 0.9, 0.65);
            colorArr[idx] = r; colorArr[idx + 1] = g; colorArr[idx + 2] = b;
          }
          i++;
        }
      }

      geometry.attributes.position.needsUpdate = true;
      if (colorful) geometry.attributes.color.needsUpdate = true;
      renderer.render(scene, camera);
      count += 0.045;
    };

    const handleResize = () => {
      const w = getW(), h = getH();
      camera.left   = -w / 2; camera.right  =  w / 2;
      camera.top    =  h / 2; camera.bottom = -h / 2;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    const ro = new ResizeObserver(handleResize);
    ro.observe(container);
    animate();

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
      scene.traverse(obj => {
        if (obj instanceof THREE.Points) {
          obj.geometry.dispose();
          (Array.isArray(obj.material) ? obj.material : [obj.material]).forEach(m => m.dispose());
        }
      });
      renderer.dispose();
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
    };
  }, [colorful]);

  return (
    <div
      ref={containerRef}
      className={cn('pointer-events-none absolute inset-0', className)}
      {...props}
    />
  );
}
