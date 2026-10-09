import { useEffect } from "react";

export default function RevealObserver() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const observed = new WeakSet();
    const observer = reduced ? null : new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    }, { rootMargin: "0px 0px -9%", threshold: 0.08 });

    const prepare = (scope) => {
      const items = scope.matches?.("[data-reveal]") ? [scope] : scope.querySelectorAll?.("[data-reveal]") || [];
      for (const item of items) {
        if (observed.has(item)) continue;
        observed.add(item);
        if (reduced || document.documentElement.dataset.motion === "paused") item.classList.add("is-visible");
        else observer.observe(item);
      }
    };

    const content = document.getElementById("conteudo");
    if (!content) return undefined;
    prepare(content);
    const mutations = new MutationObserver((entries) => {
      for (const entry of entries) for (const node of entry.addedNodes) if (node.nodeType === Node.ELEMENT_NODE) prepare(node);
    });
    mutations.observe(content, { childList: true, subtree: true });
    return () => {
      mutations.disconnect();
      observer?.disconnect();
    };
  }, []);

  return null;
}
