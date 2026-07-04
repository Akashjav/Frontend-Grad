import { createMentorshipRequest } from "../../lib/mentorshipApi";
import { useEffect, useState } from "react";
import { getAlumni } from "../../lib/alumniApi";
import { Users, Search, MapPin, Building, Award, Eye } from "lucide-react";
import type { Page } from "../types";
import Badge from "./Badge";
import Btn from "./Btn";
import Card from "./Card";
import Avatar from "./Avatar";

function asArray(value: any): any[] {
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.alumni)) return value.alumni;
  if (Array.isArray(value?.data)) return value.data;
  if (Array.isArray(value?.items)) return value.items;
  if (Array.isArray(value?.results)) return value.results;
  return [];
}

function alumniName(person: any) {
  return person.display_name || person.name || person.full_name || "Alumni";
}

function alumniRole(person: any) {
  return (
    person.headline || person.focus || person.role || person.title || "Mentor"
  );
}

function alumniSkills(person: any): string[] {
  if (Array.isArray(person.skills)) return person.skills;
  if (typeof person.skills === "string") {
    return person.skills
      .split(",")
      .map((skill: string) => skill.trim())
      .filter(Boolean);
  }
  if (typeof person.focus === "string") return [person.focus];
  return [];
}

export default function DirectoryPage({
  navigate,
}: {
  navigate: (p: Page) => void;
}) {
  const [alumniList, setAlumniList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [dept, setDept] = useState("All");
  const [industry, setIndustry] = useState("All");

  useEffect(() => {
    let mounted = true;

    async function loadAlumni() {
      try {
        setLoading(true);
        setError("");

        const data = await getAlumni();
        if (mounted) setAlumniList(asArray(data));
      } catch (err: any) {
        if (mounted) setError(err.message || "Failed to load alumni");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadAlumni();

    return () => {
      mounted = false;
    };
  }, []);

  async function handleConnect(person: any) {
    if (!person.user_id) {
      alert("Cannot send mentorship request because this alumni record is missing user_id.");
      return;
    }

    try {
      await createMentorshipRequest({
        alumni_id: person.user_id,
        topic: "Mentorship Request",
        message: "I would like to connect with you for guidance.",
      });

      alert("Mentorship request sent successfully");
      navigate("mentorship");
    } catch (err: any) {
      alert(err.message || "Failed to send mentorship request");
    }
  }

  const filtered = alumniList.filter((person) => {
    const name = alumniName(person).toLowerCase();
    const role = alumniRole(person).toLowerCase();
    const company = String(person.company || "").toLowerCase();
    const skills = alumniSkills(person).join(" ").toLowerCase();
    const department = person.dept || person.department || "";
    const personIndustry = person.industry || "";
    const query = search.toLowerCase();

    return (
      (query === "" ||
        name.includes(query) ||
        role.includes(query) ||
        company.includes(query) ||
        skills.includes(query)) &&
      (dept === "All" || department === dept) &&
      (industry === "All" || personIndustry === industry)
    );
  });

  if (loading) {
    return (
      <div className="flex-1 overflow-y-auto bg-slate-50">
        <div className="p-6 max-w-6xl mx-auto">Loading alumni...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 overflow-y-auto bg-slate-50">
        <div className="p-6 max-w-6xl mx-auto text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50">
      <div className="p-6 max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2
              className="font-bold text-gray-900 text-xl"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Alumni Directory
            </h2>
            <p className="text-gray-500 text-sm">
              {alumniList.length} alumni from your institution
            </p>
          </div>
        </div>

        <Card className="p-4">
          <div className="flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-56">
              <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, company, or skill..."
                className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              />
            </div>
            {[
              {
                label: "Department",
                value: dept,
                set: setDept,
                opts: ["All", "CSE", "IT", "ECE", "ME", "Design"],
              },
              {
                label: "Industry",
                value: industry,
                set: setIndustry,
                opts: ["All", "Tech", "E-Commerce", "Startup", "Design", "AI"],
              },
            ].map((filter) => (
              <select
                key={filter.label}
                value={filter.value}
                onChange={(e) => filter.set(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {filter.opts.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            ))}
          </div>
        </Card>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((person) => {
            const name = alumniName(person);
            const role = alumniRole(person);
            const company = person.company || "Company not added";
            const location = person.location || "Location not added";
            const skills = alumniSkills(person);

            return (
              <Card
                key={person.id ?? person.email ?? name}
                hover
                className="p-5"
              >
                <div className="flex items-start gap-4 mb-4">
                  <Avatar src={person.avatar} name={name} size="lg" />
                  <div className="min-w-0">
                    <p
                      className="font-bold text-gray-900 truncate"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      {name}
                    </p>
                    <p className="text-xs text-gray-600 mt-0.5">{role}</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <Building size={11} className="text-gray-400" />
                      <span className="text-xs text-blue-600 font-medium">
                        {company}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mb-3">
                  <div className="flex items-center gap-1">
                    <MapPin size={11} className="text-gray-400" />
                    <span className="text-xs text-gray-600">{location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Award size={11} className="text-gray-400" />
                    <span className="text-xs text-gray-600">
                      {person.experience ||
                        person.years_of_experience ||
                        "Experience not added"}
                    </span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {skills.slice(0, 4).map((skill) => (
                    <Badge key={skill} color="blue">
                      {skill}
                    </Badge>
                  ))}
                  {(person.batch || person.graduation_year) && (
                    <Badge color="gray">
                      Batch {person.batch || person.graduation_year}
                    </Badge>
                  )}
                </div>
                <div className="flex gap-2">
                  <Btn
                    size="sm"
                    fullWidth
                    onClick={() => handleConnect(person)}
                  >
                    Connect
                  </Btn>
                  <Btn
                    size="sm"
                    variant="outline"
                    onClick={() => navigate("profile")}
                    icon={<Eye size={13} />}
                  >
                    Profile
                  </Btn>
                </div>
              </Card>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <Users size={40} className="text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">
              No alumni match your search. Try different filters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
