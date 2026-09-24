import { useEffect } from 'react';

/** Adds `.in` to every `.reveal` element as it enters the viewport. */
export function useReveal() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in');
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.08 },
    );
    const watch = (root: ParentNode) => {
      root.querySelectorAll('.reveal:not(.in)').forEach((el) => io.observe(el));
    };
    watch(document);
    const mo = new MutationObserver((muts) => {
      muts.forEach((m) => {
        m.addedNodes.forEach((n) => {
          if (n instanceof Element) {
            if (n.classList.contains('reveal') && !n.classList.contains('in')) io.observe(n);
            watch(n);
          }
        });
      });
    });
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);
}

/** Deep-link support: /features, /security … scroll to the matching section. */
export function useSectionScroll(section?: string) {
  useEffect(() => {
    if (!section) {
      window.scrollTo(0, 0);
      return;
    }
    const t = setTimeout(() => {
      document.getElementById(section)?.scrollIntoView({ behavior: 'auto', block: 'start' });
    }, 60);
    return () => clearTimeout(t);
  }, [section]);
}
