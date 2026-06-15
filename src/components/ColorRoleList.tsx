import type { Palette } from "../types";

type RoleLabel = { label: string; use: string };

export function ColorRoleList({
  palette,
  roleLabels,
}: {
  palette: Palette;
  roleLabels: Record<string, RoleLabel>;
}) {
  const roles = Object.keys(palette.colors) as Array<keyof typeof palette.colors>;

  return (
    <div className="role-list">
      {roles.map((role) => (
        <div className="role-row" key={role}>
          <span
            className="swatch"
            style={{ background: palette.colors[role] }}
          />
          <div>
            <strong>{roleLabels[role]?.label ?? role}</strong>
            <small>{roleLabels[role]?.use ?? ""}</small>
          </div>
          <code>{palette.colors[role]}</code>
        </div>
      ))}
    </div>
  );
}
