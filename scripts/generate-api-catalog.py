"""Generate the frontend contract and a reviewable endpoint-to-page inventory.

Run from Frontend-Grad with the backend Python interpreter. No server or secrets
are needed. The generated contract is checked in; runtime never needs Swagger.
"""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
spec = json.loads((ROOT.parent / "Backend-Grad/docs/openapi.json").read_text(encoding="utf-8"))
ALL = ["student", "alumni", "industry", "academician", "institution_admin", "admin", "super_admin"]
ADMIN = ["admin", "super_admin"]
PUBLISHERS = ["alumni", "industry", "academician", *ADMIN]
MENTORS = ["alumni", "industry", "academician"]

def resolve(value):
    if isinstance(value, list):
        return [resolve(x) for x in value]
    if not isinstance(value, dict):
        return value
    if "$ref" in value:
        return resolve(spec["components"]["schemas"][value["$ref"].split("/")[-1]])
    if value.get("contentMediaType") == "application/octet-stream":
        value = {**value, "format": "binary"}
    return {k: resolve(v) for k, v in value.items() if k not in {"examples", "example"}}

def module(path):
    p = re.sub(r"^/api(?:/v1)?/", "", path).strip("/")
    if p.startswith("certificates") or p.endswith("/certificate"): return "certificates"
    if "training-programs" in p: return "training"
    if p.startswith(("practical-assessments", "practical-submissions")): return "practical"
    if p.startswith("milestones"): return "collaborations"
    if p.startswith("auth/"): return "account"
    if p.startswith("admin/"): return "administration"
    if p.startswith("institutions"): return "institutions"
    if p.startswith(("domains", "disciplines", "skills", "competencies")): return "domains"
    if p.startswith(("assessments", "students/me/assessment")): return "assessments"
    if p.startswith(("learning", "students/me/learning")): return "learning"
    if p.startswith(("documents", "student/documents")): return "documents"
    if p.startswith(("students/me/education", "students/me/portfolio")): return "portfolio"
    if p.startswith(("students/me/skill-gaps", "students/me/career", "matching", "recommendations")) and "mentors" not in p: return "matching"
    if p.startswith("students/me/applications") or p.startswith("applications"): return "applications"
    if p.startswith(("students/me", "me")): return "competency"
    if p.startswith(("faculty/consultancy", "faculty/fdp", "projects", "research")): return "projects"
    if p.startswith("collaborations"): return "collaborations"
    if p.startswith("industry/me/") and "profile" not in p: return "recruitment"
    if p.startswith("opportunities"): return "opportunities"
    if p.startswith(("faculty", "alumni", "industry", "academicians")): return "directory"
    if "mentors" in p: return "mentorship"
    if p.startswith(("communities", "community-posts")): return "community"
    if p.startswith("conversations"): return "messages"
    if p.startswith("events"): return "events"
    if p.startswith("notifications"): return "notifications"
    if p.startswith("settings"): return "settings"
    if p.startswith("subscription"): return "subscriptions"
    if p.startswith("jobs"): return "classic-jobs"
    if p.startswith("ai"): return "assistant"
    if p.startswith("dashboard"): return "overview"
    return "system"

def roles(path, method):
    p = re.sub(r"^/api(?:/v1)?/", "", path).rstrip("/")
    mutate = method != "GET"
    if "training-programs" in p:
        return ["institution_admin"] if p.startswith("institutions/") else ["student"]
    if p.startswith("practical-assessments"):
        if p.endswith("/submit"): return ["student"]
        return PUBLISHERS if mutate else ALL
    if p.startswith("practical-submissions"):
        return PUBLISHERS if mutate else ["student", *PUBLISHERS]
    if p.endswith("/certificate") or (p.startswith("certificates/") and p.endswith("/revoke")): return PUBLISHERS
    if p == "certificates/me": return ["student"]
    if p.startswith("admin/"):
        return ADMIN
    if p.startswith("institutions/me"): return ["institution_admin", *ADMIN]
    if p == "institutions" and mutate: return ADMIN
    if p.startswith(("domains", "disciplines", "skills", "competencies")) and mutate: return ADMIN
    if p == "assessments" and mutate: return ADMIN
    if re.search(r"assessments/\{.*\}/(start|reassess|submit|result)", p): return ["student"]
    if p.startswith("students/me"):
        if any(x in p for x in ("/skills", "/education", "/portfolio")): return ["student", *MENTORS]
        return ["student"]
    if p.startswith("industry/me/"):
        return ["industry", "academician"] if "profile" not in p else ["industry"]
    if p == "industry/profile": return ["industry"]
    if p.startswith("faculty/me/"): return ["academician"]
    if p.startswith("alumni/me/"): return ["alumni"]
    if p.startswith(("opportunities", "projects", "research", "faculty/consultancy", "faculty/fdp")):
        if p.endswith("/apply"): return ["student"]
        if mutate or p.endswith("/applications"): return PUBLISHERS
    if p.startswith("applications") and p.endswith("/feedback"): return MENTORS
    if p == "recommendations/opportunities": return ["student", "alumni", "academician"]
    if p == "learning/resources" and mutate: return ADMIN
    if p.startswith("mentorship/"):
        if p.endswith("/incoming") or (mutate and ("requests/{" in p or p == "mentorship/sessions" or p.endswith("/complete"))): return MENTORS
        if (p == "mentorship/requests" and method == "POST") or p.endswith("/feedback") or p.endswith("/requests/my"): return ["student"]
        return ["student", *MENTORS]
    if p.startswith("events") and method == "POST" and not p.endswith("/rsvp"): return PUBLISHERS
    if p == "notifications" and method == "POST": return ADMIN
    if p.startswith("dashboard/"): return {"student": ["student"], "alumni": ["alumni"], "admin": ["admin"]}.get(p.split("/")[-1], ALL)
    if p.startswith("jobs"):
        if p.endswith(("/apply", "/save", "/saved", "/applied")): return ["student"]
        if mutate: return ["alumni", "admin"]
    if p.startswith("student/documents"): return ["student"]
    if p == "subscription-plans" and mutate: return ["admin"]
    if p.startswith("subscriptions/"): return ["student"]
    if p == "alumni" and mutate: return ["alumni"]
    return ALL

def label(path, method):
    custom = {
        ("GET", "/api/v1/certificates/me"): "View my certificates",
        ("GET", "/api/v1/certificates/verify/{code}"): "Verify a certificate",
        ("GET", "/api/v1/certificates/{certificate_id}/download"): "Download certificate PDF",
        ("POST", "/api/v1/applications/{application_id}/certificate"): "Issue completion certificate",
        ("GET", "/api/v1/auth/me"): "View my account",
        ("PATCH", "/api/v1/auth/me"): "Update my account and domain",
        ("DELETE", "/api/v1/auth/me"): "Deactivate my account",
        ("GET", "/api/v1/industry/me/opportunities"): "View my recruiting opportunities",
        ("GET", "/api/v1/industry/me/candidate-matches"): "Find matching students",
        ("GET", "/api/v1/industry/me/faculty-matches"): "Find matching faculty",
        ("GET", "/api/alumni/"): "View alumni career profiles",
        ("GET", "/api/alumni/{alumni_id}"): "View alumni career profile",
        ("POST", "/api/alumni/"): "Create alumni career profile",
        ("POST", "/api/v1/ai/career-assistant"): "Ask career assistant",
        ("POST", "/api/ai-chat/"): "Ask career assistant with history",
        ("POST", "/api/v1/documents/resume"): "Upload resume PDF",
        ("GET", "/api/v1/documents/resume/{document_id}"): "Download resume PDF",
        ("GET", "/api/v1/documents/resume"): "View my uploaded resumes",
        ("GET", "/api/v1/documents/verification/{document_id}"): "Download verification document",
        ("GET", "/api/v1/admin/review-queue"): "Review pending submissions",
    }
    if (method, path) in custom: return custom[method, path]
    p = re.sub(r"^/api(?:/v1)?/", "", path).strip("/")
    p = p.removeprefix("admin/").removeprefix("ai/")
    p = re.sub(r"/\{[^}]+\}", "", p).replace("students/me", "my").replace("/me", "/my")
    words = p.replace("/", " · ").replace("-", " ").replace("_", " ")
    verbs = {"GET": "View", "POST": "Create", "PATCH": "Update", "PUT": "Save", "DELETE": "Remove"}
    action = path.rstrip("/").split("/")[-1]
    action_verbs = {"apply": "Apply", "publish": "Publish", "approve": "Approve", "verify": "Verify", "suspend": "Suspend", "restore": "Restore", "join": "Join", "invite": "Invite", "complete": "Complete", "start": "Start", "reassess": "Reassess", "recalculate": "Recalculate", "extract": "Extract", "map-skills": "Map skills", "summarize": "Summarize", "score": "Calculate match", "read": "Mark as read", "read-all": "Mark all as read", "accept": "Accept", "reject": "Reject", "cancel": "Cancel", "mark-paid": "Mark as paid", "start-trial": "Start trial"}
    if method != "GET" and action in action_verbs:
        words = " · ".join(words.split(" · ")[:-1])
        return f"{action_verbs[action]} · {words}"
    if method == "POST" and action == "feedback": return f"Submit {words}"
    return f"{verbs[method]} {words}"

ops = []
for path, entry in sorted(spec["paths"].items()):
    for method, raw in entry.items():
        if method not in {"get", "post", "put", "patch", "delete"}: continue
        method = method.upper()
        content = raw.get("requestBody", {}).get("content", {})
        media = next(iter(content), "application/json")
        body = resolve(content.get(media, {}).get("schema", {})) if content else None
        params = [resolve(p) for p in raw.get("parameters", [])]
        if path == "/api/admin/users/{user_id}/role":
            for param in params:
                if param["name"] == "role": param["schema"]["enum"] = ["student", "alumni", "admin"]
        if path == "/api/admin/student-documents/{document_id}/verify":
            for param in params:
                if param["name"] == "status": param["schema"]["enum"] = ["approved", "rejected"]
        if path == "/api/student/documents/" and method == "POST":
            body["properties"]["document_type"]["enum"] = ["College ID", "Bonafide Certificate", "Student Proof", "Resume"]
        canonical = "/api/v1" + path.removeprefix("/api").rstrip("/")
        alias = None
        # Foundation routes are literal aliases; other old endpoints have
        # different semantics and remain separately available.
        if path.startswith("/api/") and not path.startswith("/api/v1/") and path.split("/")[2] in {"communities", "community-posts", "events", "conversations", "notifications", "settings", "mentorship", "dashboard"}:
            if method.lower() in spec["paths"].get(canonical, {}): alias = f"{method} {canonical}"
        group = module(path)
        handler = "module"
        if group == "system": handler = "diagnostic"
        if "/auth/" in path and not path.endswith("/me"): handler = "identity"
        if path.startswith("/api/auth/"): handler = "compatibility"
        if path == "/api/me": handler = "identity"
        if alias: handler = "alias"
        if re.search(r"/assessments/\{[^}]+\}/(start|reassess|submit)$", path): handler = "assessment"
        disabled = "Paid activation is unavailable until payment verification is configured." if path == "/api/subscriptions/activate" else None
        ops.append(dict(key=f"{method} {path}", path=path, method=method, title=label(path, method), module=group, roles=roles(path, method), parameters=params, body=body, media=media, handler=handler, alias=alias, disabled=disabled))

target = ROOT / "src/lib/generated"
target.mkdir(parents=True, exist_ok=True)
(target / "apiCatalog.json").write_text(json.dumps(ops, indent=2) + "\n", encoding="utf-8")
report = ["# Frontend API integration coverage", "", "Generated from the checked-in backend OpenAPI contract. This inventory records routing and form coverage, not a claim that every operation has been exercised against a live server.", "", "Shared module pages provide validated forms and record views. Assessments, identity and live messaging have dedicated workflows. Legacy foundation aliases use their versioned equivalent in the new workspace. The four older authentication endpoints are retained as compatibility interfaces; the active registration and login screens use versioned authentication. Diagnostics are service endpoints, not standalone user pages.", "", "| Operation | Page/module | Integration |", "| --- | --- | --- |"]
for op in ops:
    status = "Unavailable: backend payment activation disabled" if op["disabled"] else op["handler"]
    if op["alias"]: status += " → `" + op["alias"] + "`"
    report.append(f"| `{op['key']}` | {op['module']} | {status} |")
report += ["| `WS /api/v1/ws/conversations/{conversation_id}` | messages | Live conversation view; REST fallback |", "", f"Total: {len(ops)} HTTP operations plus one WebSocket route.", "", "Rebuild with `..\\Backend-Grad\\.venv\\Scripts\\python.exe scripts/generate-api-catalog.py` after exporting an updated backend contract."]
(ROOT / "API_INTEGRATION_COVERAGE.md").write_text("\n".join(report) + "\n", encoding="utf-8")
print(f"Generated {len(ops)} operations; {sum(o['handler'] == 'alias' for o in ops)} foundation aliases.")
for op in ops:
    if op["body"] and op["body"].get("type") == "object" and not op["body"].get("properties"):
        print("Unstructured input:", op["key"])
