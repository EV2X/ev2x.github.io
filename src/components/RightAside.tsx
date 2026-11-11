import { useEffect, useState } from "react";
import { PageId, TocHeading } from "../data/pages";

interface RightAsideProps {
  activePage: PageId;
  headings: TocHeading[];
  onNavigate: (pageId: PageId, sectionId?: string) => void;
}

function RightAside({ activePage, headings, onNavigate }: RightAsideProps) {
  const [activeId, setActiveId] = useState(headings[0]?.id ?? "");

  useEffect(() => {
    setActiveId(headings[0]?.id ?? "");

    const sections = headings
      .map((heading) => document.getElementById(heading.id))
      .filter((section): section is HTMLElement => Boolean(section));

    if (sections.length === 0) {
      return undefined;
    }

    let frame = 0;
    const updateActiveFromScroll = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        if (window.scrollY > 0 && window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 4) {
          setActiveId(sections[sections.length - 1].id);
          return;
        }
        const current = sections
          .map((section) => ({
            id: section.id,
            top: section.getBoundingClientRect().top,
          }))
          .filter((section) => section.top <= 136)
          .pop();

        setActiveId(current?.id ?? sections[0].id);
      });
    };

    const observer = new IntersectionObserver(updateActiveFromScroll, {
      rootMargin: "-96px 0px -62% 0px",
      threshold: [0, 0.2, 0.6, 1],
    });

    sections.forEach((section) => observer.observe(section));
    window.addEventListener("scroll", updateActiveFromScroll, {
      passive: true,
    });
    updateActiveFromScroll();

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", updateActiveFromScroll);
      window.cancelAnimationFrame(frame);
    };
  }, [headings]);

  return (
    <aside className="right-aside" aria-label="Table of contents">
      <nav>
        <p className="toc-title">On this page</p>
        {headings.map((heading) => (
          <a
            key={heading.id}
            className={`toc-link${activeId === heading.id ? " active" : ""}`}
            href={`#/${activePage}/${heading.id}`}
            aria-current={activeId === heading.id ? "location" : undefined}
            onClick={(event) => {
              event.preventDefault();
              onNavigate(activePage, heading.id);
            }}
          >
            {heading.title}
          </a>
        ))}
      </nav>
    </aside>
  );
}

export default RightAside;
