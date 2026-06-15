import { requiredRoles, roleLabels } from "../data/starterPalettes";
import type { Palette } from "../types";

export function ColorRoleList({ palette }: { palette: Palette }) {
  return (
    <div className="role-list">
      {requiredRoles.map((role) => (
        <div className="role-row" key={role}>
          <span className="swatch" style={{ background: palette.colors[role] }} />
          <div>
            <strong>{roleLabels[role].label}</strong>
            <small>{roleLabels[role].use}</small>
          </div>
          <code>{palette.colors[role]}</code>
        </div>
      ))}
    </div>
  );
}
