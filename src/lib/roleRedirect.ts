export function getDashboardPath(role: string) {
  if (role === "admin") return "/admin-dashboard";
  if (role === "alumni") return "/alumni-dashboard";
  return "/student-dashboard";
}
