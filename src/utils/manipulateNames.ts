export function getUserInitials(name: string): string {
    if (!name) return "";
    const names = name.trim().split(" ");
    const first = names[0]?.charAt(0) || "";
    const last = names.length > 1 ? names[names.length - 1].charAt(0) : "";
    return `${first}${last}`.toUpperCase();
}

export function getFirstName(name: string): string {
  if (!name) return "";
  const names = name.trim().split(" ");
  return names[0];
}