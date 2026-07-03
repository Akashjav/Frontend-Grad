import { useEffect, useState } from "react";
import {
  Briefcase,
  Search,
  MapPin,
  Clock,
  Plus,
  Bookmark,
  RefreshCw,
  ExternalLink,
  DollarSign,
} from "lucide-react";
import { cn } from "../utils";
import Badge from "./Badge";
import Btn from "./Btn";
import Card from "./Card";
import { getJobs, getSavedJobs, getAppliedJobs, applyJob, saveJob } from "../../lib/jobsApi";

function listFromResponse(value: any): any[] {
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.jobs)) return value.jobs;
  if (Array.isArray(value?.saved_jobs)) return value.saved_jobs;
  if (Array.isArray(value?.applied_jobs)) return value.applied_jobs;
  if (Array.isArray(value?.data)) return value.data;
  if (Array.isArray(value?.items)) return value.items;
  if (Array.isArray(value?.results)) return value.results;
  return [];
}

function idFromJob(value: any): number {
  return Number(typeof value === "number" ? value : value?.id ?? value?.job_id);
}

function idsFromResponse(value: any): number[] {
  return listFromResponse(value)
    .map(idFromJob)
    .filter((id) => Number.isFinite(id));
}

function jobKind(job: any) {
  return String(job.type ?? job.job_type ?? "").toLowerCase();
}

export default function JobsPage() {
  const [tab, setTab] = useState<"all" | "internships" | "fulltime" | "saved">(
    "all",
  );
  const [applied, setApplied] = useState<number[]>([]);
  const [saved, setSaved] = useState<number[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadData() {
      try {
        setLoading(true);
        setError("");

        const [jobsData, savedData, appliedData] = await Promise.all([
          getJobs(),
          getSavedJobs(),
          getAppliedJobs().catch(() => []),
        ]);

        if (!mounted) return;

        setJobs(listFromResponse(jobsData));
        setSaved(idsFromResponse(savedData));
        setApplied(idsFromResponse(appliedData));
      } catch (error) {
        console.error(error);
        if (mounted) {
          setJobs([]);
          setSaved([]);
          setApplied([]);
          setError(error instanceof Error ? error.message : "Unable to load jobs");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadData();

    return () => {
      mounted = false;
    };
  }, []);

  async function handleApply(jobId: number) {
    if (!Number.isFinite(jobId)) return;

    try {
      await applyJob(jobId);
      const appliedData = await getAppliedJobs().catch(() => []);
      const appliedIds = idsFromResponse(appliedData);
      setApplied((current) => {
        const next = appliedIds.length > 0 ? appliedIds : current;
        return next.includes(jobId) ? next : [...next, jobId];
      });
    } catch (error: any) {
      alert(error.message);
    }
  }

  async function handleSave(jobId: number) {
    if (!Number.isFinite(jobId) || saved.includes(jobId)) return;

    const previous = saved;
    setSaved((current) => (current.includes(jobId) ? current : [...current, jobId]));

    try {
      await saveJob(jobId);
      const savedData = await getSavedJobs();
      setSaved(idsFromResponse(savedData));
    } catch (error: any) {
      setSaved(previous);
      alert(error.message);
    }
  }

  if (loading) {
    return <h2>Loading Jobs...</h2>;
  }

  if (error) {
    return (
      <div className="flex-1 overflow-y-auto bg-slate-50">
        <div className="p-6 max-w-6xl mx-auto">
          <Card className="p-6">
            <h2 className="font-bold text-gray-900 text-xl" style={{ fontFamily: "Poppins, sans-serif" }}>
              Jobs & Internships
            </h2>
            <p className="text-sm text-red-600 mt-2">{error}</p>
          </Card>
        </div>
      </div>
    );
  }

  const filtered = jobs.filter((job) => {
    const kind = jobKind(job);

    if (tab === "internships") return kind === "internship";
    if (tab === "fulltime") return kind === "full-time" || kind === "fulltime";
    if (tab === "saved") return saved.includes(idFromJob(job));
    return true;
  });

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50">
      <div className="p-6 max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2
              className="font-bold text-gray-900 text-xl"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Jobs & Internships
            </h2>
            <p className="text-gray-500 text-sm">
              Referral-backed opportunities from alumni in top companies
            </p>
          </div>
          <Btn size="sm" icon={<Plus size={14} />}>
            Post a Job
          </Btn>
        </div>

        {/* Search */}
        <Card className="p-4 flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-48">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              placeholder="Search jobs, companies, skills..."
              className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            />
          </div>
          {[
            {
              label: "Location",
              opts: [
                "All Locations",
                "Bengaluru",
                "Hyderabad",
                "Remote",
                "Mumbai",
                "Pune",
              ],
            },
            {
              label: "Company",
              opts: [
                "All Companies",
                "Google",
                "Microsoft",
                "Amazon",
                "Infosys",
                "TCS",
              ],
            },
          ].map((f) => (
            <select
              key={f.label}
              className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 bg-white focus:outline-none"
            >
              {f.opts.map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
          ))}
        </Card>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-gray-200">
          {(["all", "internships", "fulltime", "saved"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "px-4 py-3 text-sm font-medium capitalize border-b-2 transition-colors cursor-pointer",
                tab === t
                  ? "text-blue-600 border-blue-600"
                  : "text-gray-500 border-transparent hover:text-gray-700",
              )}
            >
              {t === "fulltime"
                ? "Full-time"
                : t === "saved"
                  ? `Saved (${saved.length})`
                  : t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {/* Job cards */}
        <div className="space-y-3">
          {filtered.map((j) => {
            const jobId = idFromJob(j);
            const company = j.company || j.company_name || "Company";
            const tags = Array.isArray(j.tags) ? j.tags : [];
            const type = j.type || j.job_type || "Job";

            return (
            <Card key={j.id} hover className="p-5">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0 text-blue-600 font-bold text-lg">
                  {company.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3
                        className="font-semibold text-gray-900"
                        style={{ fontFamily: "Poppins, sans-serif" }}
                      >
                          {j.title || j.job_title || j.role || "Untitled role"}
                      </h3>
                      <p className="text-sm text-gray-600 mt-0.5">
                        {company}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge color={jobKind(j) === "internship" ? "teal" : "blue"}>
                        {type}
                      </Badge>
                      <button
                        onClick={() => handleSave(jobId)}
                        className={cn(
                          "cursor-pointer transition-colors",
                          saved.includes(jobId)
                            ? "text-amber-500"
                            : "text-gray-300 hover:text-amber-400",
                        )}
                      >
                        <Bookmark
                          size={18}
                          fill={saved.includes(jobId) ? "currentColor" : "none"}
                        />
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-4 mt-2 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <MapPin size={12} />
                      {j.location || j.work_location || "Remote"}
                    </span>
                    <span className="flex items-center gap-1">
                      <DollarSign size={12} />
                      {j.stipend || j.salary || j.compensation || "Not listed"}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      Deadline: {j.deadline || j.application_deadline || "Rolling"}
                    </span>
                    <span className="flex items-center gap-1">
                      <RefreshCw size={12} />
                      {j.posted || j.created_at || "Recently posted"}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {tags.map((t) => (
                      <Badge key={t} color="gray">
                        {t}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-2 flex-shrink-0">
                  <Btn
                    size="sm"
                    onClick={() => handleApply(jobId)}
                    disabled={applied.includes(jobId)}
                  >
                    {applied.includes(jobId) ? "✓ Applied" : "Apply Now"}
                  </Btn>
                  <Btn
                    size="sm"
                    variant="outline"
                    icon={<ExternalLink size={12} />}
                  >
                    Details
                  </Btn>
                </div>
              </div>
            </Card>
            );
          })}
          {filtered.length === 0 && (
            <div className="text-center py-16">
              <Briefcase size={40} className="text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">
                No {tab === "saved" ? "saved" : ""} jobs found.
              </p>
            </div>
          )}
        </div>

        {/* Application Tracker */}
        {applied.length > 0 && (
          <Card className="p-5">
            <h3
              className="font-semibold text-gray-900 mb-4"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Application Tracker
            </h3>
            <div className="space-y-3">
              {jobs
                .filter((j) => applied.includes(idFromJob(j)))
                .map((j) => (
                  <div
                    key={j.id}
                    className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                  >
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {j.title || j.job_title || j.role || "Untitled role"}
                      </p>
                      <p className="text-xs text-gray-500">{j.company || j.company_name || "Company"}</p>
                    </div>
                    <Badge color="amber">Under Review</Badge>
                  </div>
                ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
