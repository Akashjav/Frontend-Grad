import type { Page } from "../app/types";

export function dashboardPageForRole(role: string): Page {
  if (["super_admin", "academician", "institution_admin"].includes(role)) return "workspace";
  if (role === "admin") return "admin-dashboard";
  if (role === "alumni") return "alumni-dashboard";
  if (role === "industry") return "industry-dashboard";
  return "student-dashboard";
}

export function getDashboardPath(role: string) {
  return `/${dashboardPageForRole(role)}`;
}

export function allowedPage(page: Page, role: string): Page {
  if (page.startsWith("industry-") && page !== "industry-register" && role !== "industry") return dashboardPageForRole(role);
  if (role === "industry" && ["profile", "jobs", "directory", "mentorship", "ai-assistant"].includes(page)) {
    return page === "profile" ? "industry-profile" : page === "jobs" ? "industry-opportunities" : "industry-dashboard";
  }
  if (page.endsWith("-dashboard")) return dashboardPageForRole(role);
  return page;
}
