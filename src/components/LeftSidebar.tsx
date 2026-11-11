import { PageId, navGroups } from "../data/pages";

interface LeftSidebarProps {
  activePage: PageId;
  isOpen: boolean;
  onNavigate: (pageId: PageId) => void;
  onClose: () => void;
}

function LeftSidebar({
  activePage,
  isOpen,
  onNavigate,
  onClose,
}: LeftSidebarProps) {
  return (
    <aside
      className={`left-sidebar${isOpen ? " open" : ""}`}
      aria-label="Primary navigation"
    >
      <button
        className="sidebar-close"
        type="button"
        aria-label="Close navigation"
        onClick={onClose}
      >
        ×
      </button>

      <div className="sidebar-logo" aria-label="Cyber-EV2X">
        <img width={46} height={46} src={`${import.meta.env.BASE_URL}assets/avt.png`} alt="" />
        <span>Cyber-EV2X</span>
      </div>

      <nav className="sidebar-nav">
        {navGroups.map((group) => (
          <section className="nav-group" key={group.title}>
            <p className="nav-group-title">{group.title}</p>
            {group.items.map((item) => (
              <a
                key={item.id}
                className={`nav-item${activePage === item.id ? " active" : ""}`}
                href={`#/${item.id}`}
                aria-current={activePage === item.id ? "page" : undefined}
                onClick={(event) => {
                  event.preventDefault();
                  onNavigate(item.id);
                }}
              >
                {item.label}
              </a>
            ))}
          </section>
        ))}
      </nav>
    </aside>
  );
}

export default LeftSidebar;
