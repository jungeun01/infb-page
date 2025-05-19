import React, { useEffect, useRef } from "react";

function FadeInSection({ children }) {
  const domRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
        }
      });
    });

    const { current } = domRef;
    observer.observe(current);

    return () => observer.unobserve(current);
  }, []);

  return (
    <div className="fade-in-section" ref={domRef}>
      {children}
    </div>
  );
}

export default FadeInSection;
