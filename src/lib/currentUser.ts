export type UserRole = "student" | "alumni" | "admin" | "super_admin" | "industry" | "academician" | "institution_admin";

export type CurrentUser = {
  id?: string | number;
  email?: string;
  full_name?: string;
  display_name?: string;
  role: UserRole;
  is_verified?: boolean;
  profile?: {
    display_name?: string | null;
    headline?: string | null;
    company?: string | null;
    location?: string | null;
    bio?: string | null;
    organization_name?: string | null;
    domain_id?: number | null;
    discipline_id?: number | null;
    institution_id?: number | null;
    verified?: boolean;
    interests?: string[];
  } | null;
  student_profile?: {
    full_name?: string | null;
    department?: string | null;
    year_of_study?: number | null;
    roll_number?: string | null;
    cgpa?: number | null;
    skills?: string | string[] | null;
    linkedin_url?: string | null;
    github_url?: string | null;
    career_goals?: string | null;
    verification_status?: string | null;
  } | null;
  alumni_profile?: {
    full_name?: string | null;
    department?: string | null;
    graduation_year?: number | null;
    current_company?: string | null;
    current_role?: string | null;
    years_of_experience?: number | null;
    mentorship_areas?: string | string[] | null;
    linkedin_url?: string | null;
    availability?: string | null;
  } | null;
};

export function userName(user: CurrentUser | null) {
  return [user?.profile?.display_name, user?.display_name, user?.full_name, user?.student_profile?.full_name,
    user?.alumni_profile?.full_name, user?.email].find(value => value?.trim())?.trim() || "Your account";
}

export function userSubtitle(user: CurrentUser | null) {
  if (user?.profile?.headline?.trim()) return user.profile.headline.trim();
  if (user?.role === "student") {
    return [user.student_profile?.department, user.student_profile?.year_of_study
      ? `Year ${user.student_profile.year_of_study}` : null].filter(Boolean).join(" · ") || "Student";
  }
  if (user?.role === "alumni") {
    return [user.alumni_profile?.current_role, user.profile?.company ?? user.alumni_profile?.current_company]
      .filter(Boolean).join(" · ") || "Alumni";
  }
  if (user?.role === "industry") return user.profile?.organization_name || "Industry partner";
  if (user?.role === "academician") return "Faculty / academician";
  if (user?.role === "institution_admin") return "Institution administrator";
  return user?.role === "admin" || user?.role === "super_admin" ? "Administrator" : "Your account";
}

export function profileSkills(value: string | string[] | null | undefined): string[] {
  return [...new Set((Array.isArray(value) ? value : (value || "").split(","))
    .map(skill => skill.trim()).filter(Boolean))];
}

export function safeProfileUrl(value?: string | null) {
  if (!value?.trim()) return null;
  try {
    const url = new URL(value.trim());
    return ["https:", "http:"].includes(url.protocol) ? url.href : null;
  } catch {
    return null;
  }
}
