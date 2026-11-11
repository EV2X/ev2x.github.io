import {
  useEffect,
  useState,
  type ComponentType,
} from "react";

import Layout from "./components/Layout";
import CyberEV2X2026 from "./pages/CyberEV2X2026";
import Imprint from "./pages/Imprint";

import {
  pages,
  type PageId,
  type ThemeMode,
} from "./data/pages";

const GRETTIA_URL =
  "https://grettia.univ-gustave-eiffel.fr/accueil";

const themeKey = "cyber-ev2x-theme";

/**
 * This empty component is used because GRETTIA is an external page.
 * Its website will be opened in a new browser tab.
 */
function GrettiaRedirect() {
  return null;
}

const pageComponents: Record<PageId, ComponentType> = {
  "cyber-ev2x-2026": CyberEV2X2026,
  grettia: GrettiaRedirect,
  imprint: Imprint,
};

const sectionAliases: Record<string, string> = {
  "data-schema": "schema",
  download: "downloads",
  "cite-this-work": "citation-license",
  acknowledgement: "citation-license",
  "interactive-attack-map": "overview",
};

interface LocationState {
  pageId: PageId;
  sectionId?: string;
}

/**
 * Read the current page and section from the URL hash.
 */
function readLocation(): LocationState {
  const [first, second] = window.location.hash
    .replace(/^#\/?/, "")
    .split("/");

  const isPage = Object.prototype.hasOwnProperty.call(
    pages,
    first,
  );

  const pageId: PageId = isPage
    ? (first as PageId)
    : "cyber-ev2x-2026";

  const rawSection = isPage ? second : first;
  const sectionId = sectionAliases[rawSection] ?? rawSection;

  const isValidSection = pages[pageId].headings.some(
    (heading) => heading.id === sectionId,
  );

  return {
    pageId,
    sectionId: isValidSection ? sectionId : undefined,
  };
}

/**
 * Read the stored theme or use the operating-system preference.
 */
function getInitialTheme(): ThemeMode {
  const storedTheme = window.localStorage.getItem(themeKey);

  if (storedTheme === "light" || storedTheme === "dark") {
    return storedTheme;
  }

  return window.matchMedia(
    "(prefers-color-scheme: dark)",
  ).matches
    ? "dark"
    : "light";
}

export default function App() {
  const [location, setLocation] =
    useState<LocationState>(readLocation);

  const [theme, setTheme] =
    useState<ThemeMode>(getInitialTheme);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const PageComponent = pageComponents[location.pageId];

  /**
   * Apply and save the selected theme.
   */
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem(themeKey, theme);
  }, [theme]);

  /**
   * Handle direct access to #/grettia.
   *
   * The GRETTIA website is opened in a new tab, while the current
   * Cyber-EV2X tab returns to its main page.
   */
  useEffect(() => {
    if (location.pageId !== "grettia") {
      return;
    }

    window.open(
      GRETTIA_URL,
      "_blank",
      "noopener,noreferrer",
    );

    const defaultPageId: PageId = "cyber-ev2x-2026";

    window.history.replaceState(
      null,
      "",
      `#/${defaultPageId}`,
    );

    setLocation({
      pageId: defaultPageId,
    });
  }, [location.pageId]);

  /**
   * Update the application when the browser URL changes.
   */
  useEffect(() => {
    const handleLocationChange = () => {
      setLocation(readLocation());
      setSidebarOpen(false);
    };

    window.addEventListener(
      "hashchange",
      handleLocationChange,
    );

    window.addEventListener(
      "popstate",
      handleLocationChange,
    );

    return () => {
      window.removeEventListener(
        "hashchange",
        handleLocationChange,
      );

      window.removeEventListener(
        "popstate",
        handleLocationChange,
      );
    };
  }, []);

  /**
   * Update the page title and scroll to the selected section.
   */
  useEffect(() => {
    if (location.pageId === "grettia") {
      return;
    }

    document.title =
      `${pages[location.pageId].title} | Cyber-EV2X`;

    const timeout = window.setTimeout(() => {
      const behavior = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches
        ? "auto"
        : "smooth";

      if (location.sectionId) {
        document
          .getElementById(location.sectionId)
          ?.scrollIntoView({
            behavior,
            block: "start",
          });
      } else {
        window.scrollTo({
          top: 0,
          behavior,
        });
      }
    }, 40);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [location]);

  /**
   * Navigate to an internal page or open GRETTIA in a new tab.
   */
  const navigateToPage = (
    pageId: PageId,
    sectionId?: string,
  ) => {
    if (pageId === "grettia") {
      setSidebarOpen(false);

      window.open(
        GRETTIA_URL,
        "_blank",
        "noopener,noreferrer",
      );

      return;
    }

    const nextHash =
      `#/${pageId}${sectionId ? `/${sectionId}` : ""}`;

    if (window.location.hash !== nextHash) {
      window.history.pushState(null, "", nextHash);
    }

    setLocation({
      pageId,
      sectionId,
    });

    setSidebarOpen(false);
  };

  return (
    <Layout
      activePage={location.pageId}
      headings={pages[location.pageId].headings}
      theme={theme}
      sidebarOpen={sidebarOpen}
      onNavigate={navigateToPage}
      onToggleTheme={() =>
        setTheme((currentTheme) =>
          currentTheme === "dark" ? "light" : "dark",
        )
      }
      onToggleSidebar={() =>
        setSidebarOpen((isOpen) => !isOpen)
      }
      onCloseSidebar={() => setSidebarOpen(false)}
    >
      <div
        className="page-content"
        key={location.pageId}
      >
        <PageComponent />
      </div>
    </Layout>
  );
}
