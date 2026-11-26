import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Global harakat effektlari:
 *  - orqa fondagi aurora nurlari
 *  - kursor ortidan yuruvchi glow
 *  - yuqoridagi scroll progress chizig'i
 *  - .reveal elementlarini scroll bo'yicha ko'rsatish
 *  - .spotlight kartalarda kursor koordinatalarini (--mx, --my) uzatish
 */
const MotionFX: React.FC = () => {
  const glowRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  // Kursor glow + spotlight
  useEffect(() => {
    let x = window.innerWidth / 2, y = window.innerHeight / 2;
    let cx = x, cy = y, raf = 0;

    const onMove = (e: PointerEvent) => {
      x = e.clientX; y = e.clientY;
      glowRef.current?.classList.add('is-active');
      const card = (e.target as HTMLElement | null)?.closest?.('.spotlight') as HTMLElement | null;
      if (card) {
        const r = card.getBoundingClientRect();
        card.style.setProperty('--mx', `${e.clientX - r.left}px`);
        card.style.setProperty('--my', `${e.clientY - r.top}px`);
      }
    };
    const onLeave = () => glowRef.current?.classList.remove('is-active');
    const loop = () => {
      cx += (x - cx) * 0.12;
      cy += (y - cy) * 0.12;
      if (glowRef.current) glowRef.current.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerleave', onLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  // Scroll progress
  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? window.scrollY / max : 0;
      if (progressRef.current) progressRef.current.style.transform = `scaleX(${p})`;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  // Reveal on scroll (yangi qo'shilgan elementlarni ham kuzatadi)
  useEffect(() => {
    const io = new IntersectionObserver(
      entries => entries.forEach(en => {
        if (en.isIntersecting) {
          en.target.classList.add('is-visible');
          io.unobserve(en.target);
        }
      }),
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    const scan = () => document.querySelectorAll('.reveal:not(.is-visible)').forEach(el => io.observe(el));
    scan();
    const mo = new MutationObserver(scan);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => { io.disconnect(); mo.disconnect(); };
  }, []);

  // Sahifa almashganda tepaga qaytish
  useEffect(() => {
    if (!location.hash) window.scrollTo({ top: 0, behavior: 'auto' });
  }, [location.pathname]);

  return (
    <>
      <div className="aurora" aria-hidden="true"><span /><span /><span /></div>
      <div ref={glowRef} className="cursor-glow" aria-hidden="true" />
      <div ref={progressRef} className="scroll-progress" aria-hidden="true" />
    </>
  );
};

export default MotionFX;
