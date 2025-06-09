import { useEffect, useRef, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

gsap.registerPlugin(ScrollToPlugin);

const MIN_NOTES_FOR_AUTOSCROLL = 4; // Lowered for better testing
const USER_INTERACTION_PAUSE_DURATION = 7000;
const DELAY_AT_ENDS_OF_SCROLL = 3000;
const SCROLL_SPEED_FACTOR = 0.02;

export const useAutoScroll = (noteCount: number, enabled: boolean) => {
  const autoScrollAnimation = useRef<gsap.core.Tween | null>(null);
  const resumeScrollTimeout = useRef<number | null>(null);

  const initiateAutoScroll = useCallback(() => {
    if (autoScrollAnimation.current) autoScrollAnimation.current.kill();

    const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (scrollableHeight <= 0) return;

    const isAtBottom = window.scrollY >= scrollableHeight - 1;
    const targetY: number | string = isAtBottom ? 0 : 'max';
    let duration = Math.abs((targetY === 'max' ? scrollableHeight : 0) - window.scrollY) * SCROLL_SPEED_FACTOR;
    if (duration < 5) duration = 5;

    autoScrollAnimation.current = gsap.to(window, {
      scrollTo: { y: targetY, autoKill: false },
      duration: duration,
      ease: 'power1.inOut',
      onComplete: () => {
        setTimeout(initiateAutoScroll, DELAY_AT_ENDS_OF_SCROLL);
      },
    });
  }, []);

  const handleUserInteraction = useCallback(() => {
    if (autoScrollAnimation.current && autoScrollAnimation.current.isActive()) {
      autoScrollAnimation.current.pause();
    }
    if (resumeScrollTimeout.current) {
      clearTimeout(resumeScrollTimeout.current);
    }
    resumeScrollTimeout.current = window.setTimeout(() => {
      if (autoScrollAnimation.current && !autoScrollAnimation.current.isActive()) {
        initiateAutoScroll();
      }
    }, USER_INTERACTION_PAUSE_DURATION);
  }, [initiateAutoScroll]);

  useEffect(() => {
    if (enabled && noteCount >= MIN_NOTES_FOR_AUTOSCROLL) {
      const startTimeout = setTimeout(initiateAutoScroll, 500);
      
      window.addEventListener('scroll', handleUserInteraction, { passive: true });
      window.addEventListener('wheel', handleUserInteraction, { passive: true });
      window.addEventListener('touchstart', handleUserInteraction, { passive: true });
      window.addEventListener('mousedown', handleUserInteraction);

      return () => {
        clearTimeout(startTimeout);
        if (autoScrollAnimation.current) autoScrollAnimation.current.kill();
        if (resumeScrollTimeout.current) clearTimeout(resumeScrollTimeout.current);
        window.removeEventListener('scroll', handleUserInteraction);
        window.removeEventListener('wheel', handleUserInteraction);
        window.removeEventListener('touchstart', handleUserInteraction);
        window.removeEventListener('mousedown', handleUserInteraction);
      };
    } else {
        if (autoScrollAnimation.current) autoScrollAnimation.current.kill();
    }
  }, [noteCount, enabled, initiateAutoScroll, handleUserInteraction]);
};