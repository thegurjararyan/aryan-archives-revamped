import React, { useEffect, useRef } from 'react';

export default function InkCursor() {
  const canvasRef = useRef(null);
  const drops = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrame;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    const addDrop = (x, y) => {
      drops.current.push({
        x, y,
        radius: Math.random() * 2 + 1, // Random size
        alpha: 1,
        color: document.documentElement.classList.contains('dark') ? '255, 255, 255' : '166, 42, 42' // White in dark mode, Red in light
      });
    };

    const handleMouseMove = (e) => addDrop(e.clientX, e.clientY);
    window.addEventListener('mousemove', handleMouseMove);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      drops.current.forEach((drop, i) => {
        ctx.beginPath();
        ctx.arc(drop.x, drop.y, drop.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${drop.color}, ${drop.alpha})`;
        ctx.fill();

        // Physics: Ink spreads and fades
        drop.radius += 0.02; 
        drop.alpha -= 0.015;

        if (drop.alpha <= 0) drops.current.splice(i, 1);
      });

      animationFrame = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-[9999]" />;
}