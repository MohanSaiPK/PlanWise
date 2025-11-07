import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const AnimatedContent = ({
  children,
  distance = 100,
  direction = 'vertical',
  reverse = false,
  duration = 0.8,
  ease = 'power3.out',
  initialOpacity = 0,
  animateOpacity = true,
  scale = 1,
  threshold = 0.1,
  delay = 0,
  onComplete,
  animateOnMount = false
}) => {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const axis = direction === 'horizontal' ? 'x' : 'y';
    const offset = reverse ? -distance : distance;
    const startPct = (1 - threshold) * 100;
    let timer = null;

    // Set initial state
    gsap.set(el, {
      [axis]: offset,
      scale,
      opacity: animateOpacity ? initialOpacity : 1
    });

    // Animation function
    const animate = () => {
      return gsap.to(el, {
        [axis]: 0,
        scale: 1,
        opacity: 1,
        duration,
        ease,
        delay,
        onComplete
      });
    };

    // If animateOnMount is true, animate immediately on mount
    if (animateOnMount) {
      // Small timeout to ensure DOM is ready and initial state is set
      timer = setTimeout(() => {
        animate();
      }, 50);
    } else {
      // Otherwise, check if element is already visible and animate, or use ScrollTrigger
      const checkVisibility = () => {
        const rect = el.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        const windowWidth = window.innerWidth || document.documentElement.clientWidth;
        // Check if element is partially or fully visible
        return (
          rect.top < windowHeight &&
          rect.bottom > 0 &&
          rect.left < windowWidth &&
          rect.right > 0
        );
      };

      // If element is already visible, animate immediately
      if (checkVisibility()) {
        animate();
      } else {
        // Otherwise, use ScrollTrigger
        gsap.to(el, {
          [axis]: 0,
          scale: 1,
          opacity: 1,
          duration,
          ease,
          delay,
          onComplete,
          scrollTrigger: {
            trigger: el,
            start: `top ${startPct}%`,
            toggleActions: 'play none none none',
            once: true
          }
        });
      }
    }

    // Cleanup function
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
      ScrollTrigger.getAll().forEach(t => {
        if (t.trigger === el || (t.vars && t.vars.trigger === el)) {
          t.kill();
        }
      });
      gsap.killTweensOf(el);
    };
  }, [
    distance,
    direction,
    reverse,
    duration,
    ease,
    initialOpacity,
    animateOpacity,
    scale,
    threshold,
    delay,
    onComplete,
    animateOnMount
  ]);

  return <div ref={ref}>{children}</div>;
};

export default AnimatedContent;
