import { useEffect, useMemo, useRef, useState } from "react";
import { PageId, ThemeMode, searchIndex } from "../data/pages";
import { datasetLinks } from "../data/cyberEv2xDataset";

interface TopNavbarProps {
  theme: ThemeMode;
  onToggleTheme: () => void;
  onToggleSidebar: () => void;
  onNavigate: (pageId: PageId, sectionId?: string) => void;
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m21 21-4.35-4.35" />
      <circle cx="11" cy="11" r="7" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.65 17.65l1.42 1.42M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.65 6.35l1.42-1.42" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20.5 15.5A8.5 8.5 0 0 1 8.5 3.5 7 7 0 1 0 20.5 15.5Z" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2.25a9.75 9.75 0 0 0-3.08 19c.49.09.66-.21.66-.47v-1.69c-2.7.59-3.27-1.16-3.27-1.16-.44-1.11-1.07-1.41-1.07-1.41-.88-.6.07-.59.07-.59.97.07 1.49 1 1.49 1 .86 1.47 2.25 1.04 2.8.8.09-.62.34-1.04.61-1.28-2.16-.25-4.43-1.08-4.43-4.8 0-1.06.38-1.93 1-2.61-.1-.25-.43-1.24.1-2.57 0 0 .82-.26 2.68 1a9.2 9.2 0 0 1 4.88 0c1.86-1.26 2.68-1 2.68-1 .53 1.33.2 2.32.1 2.57.62.68 1 1.55 1 2.61 0 3.73-2.28 4.55-4.45 4.79.35.3.66.9.66 1.81v2.68c0 .26.18.57.67.47A9.75 9.75 0 0 0 12 2.25Z" />
    </svg>
  );
}

function TopNavbar({
  theme,
  onToggleTheme,
  onToggleSidebar,
  onNavigate,
}: TopNavbarProps) {
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const shellRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return [];
    }

    const terms = normalizedQuery.split(/\s+/);

    return searchIndex
      .filter((entry) => {
        const haystack = [
          entry.pageTitle,
          entry.headingTitle,
          entry.excerpt,
          entry.keywords,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return terms.every((term) => haystack.includes(term));
      })
      .slice(0, 7);
  }, [query]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        inputRef.current?.focus();
        setSearchOpen(true);
      }

      if (event.key === "Escape") {
        setSearchOpen(false);
        inputRef.current?.blur();
      }
    };

    const handlePointerDown = (event: PointerEvent) => {
      if (!shellRef.current?.contains(event.target as Node)) {
        setSearchOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("pointerdown", handlePointerDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("pointerdown", handlePointerDown);
    };
  }, []);

  const handleResultClick = (pageId: PageId, sectionId?: string) => {
    onNavigate(pageId, sectionId);
    setQuery("");
    setSearchOpen(false);
    inputRef.current?.blur();
  };

  return (
    <header className="top-navbar">
      <div className="navbar-inner">
        <button
          className="icon-button mobile-menu-button"
          type="button"
          aria-label="Open navigation"
          onClick={onToggleSidebar}
        >
          <MenuIcon />
        </button>

        <div className="search-shell" ref={shellRef}>
          <label className="sr-only" htmlFor="global-search">
            Search Cyber-EV2X docs
          </label>
          <div className="navbar-search">
            <SearchIcon />
            <input
              ref={inputRef}
              id="global-search"
              type="search"
              value={query}
              placeholder="Search Cyber-EV2X docs..."
              onChange={(event) => {
                setQuery(event.target.value);
                setSearchOpen(true);
              }}
              onFocus={() => setSearchOpen(true)}
              autoComplete="off"
            />
            <span className="shortcut" aria-hidden="true">
              ⌘ K
            </span>
          </div>

          {searchOpen && query.trim() ? (
            <div className="search-results" role="listbox">
              {results.length > 0 ? (
                results.map((result) => (
                  <button
                    key={`${result.pageId}-${result.headingId ?? "page"}`}
                    className="search-result"
                    type="button"
                    role="option"
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() =>
                      handleResultClick(result.pageId, result.headingId)
                    }
                  >
                    <span className="search-result-title">
                      {result.headingTitle ?? result.pageTitle}
                    </span>
                    <span className="search-result-page">
                      {result.pageTitle}
                    </span>
                    <span className="search-result-excerpt">
                      {result.excerpt}
                    </span>
                  </button>
                ))
              ) : (
                <div className="search-empty" role="status">
                  No matching section found.
                </div>
              )}
            </div>
          ) : null}
        </div>

        <div className="navbar-actions">
          <button
            className="icon-button"
            type="button"
            aria-label={
              theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
            }
            aria-pressed={theme === "dark"}
            onClick={onToggleTheme}
          >
            {theme === "dark" ? <SunIcon /> : <MoonIcon />}
          </button>

          <a
            className="icon-button"
            href={datasetLinks.github}
            target="_blank"
            rel="noreferrer"
            aria-label="Open Cyber-EV2X GitHub repository"
          >
            <GitHubIcon />
          </a>
        </div>
      </div>
    </header>
  );
}

export default TopNavbar;
