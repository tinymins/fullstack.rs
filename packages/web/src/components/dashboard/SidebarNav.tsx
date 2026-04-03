import { NavLink, useParams } from "react-router";
import { NAV_SECTIONS } from "./nav-config";

export default function SidebarNav() {
  const { workspace } = useParams<{ workspace: string }>();

  return (
    <div className="space-y-1">
      {NAV_SECTIONS.map((section) => (
        <div key={section.title ?? section.items[0].path}>
          {section.title && (
            <div className="flex items-center gap-1 px-3 pt-4 pb-1">
              <div className="h-px flex-1 bg-[var(--ui-sidebar-border)] opacity-50" />
              <span className="text-[10px] font-semibold tracking-widest text-[var(--ui-sidebar-text-muted)] uppercase whitespace-nowrap px-1">
                {section.title}
              </span>
              <div className="h-px flex-1 bg-[var(--ui-sidebar-border)] opacity-50" />
            </div>
          )}
          {section.items.map((item) => (
            <NavLink
              key={item.path}
              to={`/dashboard/${workspace}/${item.path}`}
              className={({ isActive }) =>
                [
                  "flex items-center gap-2 rounded-md px-3 py-1.5 text-sm transition-colors",
                  isActive
                    ? "bg-[var(--ui-sidebar-item-active)] text-[var(--ui-sidebar-text-active)] font-medium"
                    : "text-[var(--ui-sidebar-text-muted)] hover:bg-[var(--ui-sidebar-item-hover)] hover:text-[var(--ui-sidebar-text)]",
                ].join(" ")
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      ))}
    </div>
  );
}
