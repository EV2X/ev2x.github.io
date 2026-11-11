import { ReactNode } from "react";
import { PageId, ThemeMode, TocHeading } from "../data/pages";
import LeftSidebar from "./LeftSidebar";
import RightAside from "./RightAside";
import TopNavbar from "./TopNavbar";
import { datasetLinks } from "../data/cyberEv2xDataset";

interface LayoutProps {
  activePage: PageId;
  headings: TocHeading[];
  theme: ThemeMode;
  sidebarOpen: boolean;
  children: ReactNode;
  onNavigate: (pageId: PageId, sectionId?: string) => void;
  onToggleTheme: () => void;
  onToggleSidebar: () => void;
  onCloseSidebar: () => void;
}

function Layout({
  activePage,
  headings,
  theme,
  sidebarOpen,
  children,
  onNavigate,
  onToggleTheme,
  onToggleSidebar,
  onCloseSidebar,
}: LayoutProps) {
  return (
    <>
      <TopNavbar
        theme={theme}
        onToggleTheme={onToggleTheme}
        onToggleSidebar={onToggleSidebar}
        onNavigate={onNavigate}
      />

      <LeftSidebar
        activePage={activePage}
        isOpen={sidebarOpen}
        onNavigate={onNavigate}
        onClose={onCloseSidebar}
      />

      {sidebarOpen ? (
        <button
          className="sidebar-backdrop"
          type="button"
          aria-label="Close navigation"
          onClick={onCloseSidebar}
        />
      ) : null}

      <main className="main-layout">
        <article className="content-container">
          {children}
          <footer className="site-footer">
            <nav aria-label="Dataset resources">
              <a href={datasetLinks.github} target="_blank" rel="noreferrer">GitHub</a>
              <a href={datasetLinks.schema} target="_blank" rel="noreferrer">Data schema</a>
              <a href={datasetLinks.downloads} target="_blank" rel="noreferrer">Zenodo downloads</a>
              <a href={datasetLinks.license} target="_blank" rel="noreferrer">CC BY 4.0</a>
            </nav>
            <p>Copyright (C) 2026 GRETTIA Lab, UGE University</p>
          </footer>
        </article>
        <RightAside activePage={activePage} headings={headings} onNavigate={onNavigate} />
      </main>
    </>
  );
}

export default Layout;
