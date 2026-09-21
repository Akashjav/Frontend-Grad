import assert from "node:assert/strict";
import { test } from "node:test";
import { build } from "esbuild";
import { createRequire } from "node:module";
import vm from "node:vm";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

const require = createRequire(import.meta.url);

async function loadModule(entry, globals = {}, plugins = []) {
  const result = await build({
    entryPoints: [entry], bundle: true, write: false, platform: "node", format: "cjs",
    packages: "external", jsx: "automatic", loader: { ".css": "empty" },
    define: { "import.meta.env.VITE_API_URL": '"https://api.example.test"' }, plugins,
  });
  const module = { exports: {} };
  vm.runInNewContext(result.outputFiles[0].text, {
    module, exports: module.exports, require, console, URL, URLSearchParams, FormData, Event, Headers,
    ...globals,
  }, { filename: entry });
  return module.exports;
}

const identity = await loadModule("src/lib/currentUser.ts");

test("role routing isolates industry pages and uses the authenticated role", async () => {
  const routing = await loadModule("src/lib/roleRedirect.ts");
  assert.equal(routing.dashboardPageForRole("industry"), "industry-dashboard");
  assert.equal(routing.allowedPage("student-dashboard", "industry"), "industry-dashboard");
  assert.equal(routing.allowedPage("industry-applications", "student"), "student-dashboard");
  assert.equal(routing.allowedPage("industry-matches", "alumni"), "alumni-dashboard");
  assert.equal(routing.allowedPage("jobs", "industry"), "industry-opportunities");
  assert.equal(routing.allowedPage("profile", "industry"), "industry-profile");
  assert.equal(routing.dashboardPageForRole("super_admin"), "workspace");
  assert.equal(routing.dashboardPageForRole("academician"), "workspace");
  assert.equal(routing.dashboardPageForRole("institution_admin"), "workspace");
});

test("industry signin, session restore and logout use the versioned API", async () => {
  const environment = apiEnvironment();
  const requests = [];
  const auth = await loadModule("src/lib/authApi.ts", { ...environment, fetch: async (url, options) => {
    requests.push({ url, ...options });
    return { ok: true, json: async () => url.endsWith("/signin") ? { access_token: "industry-token" } : {
      id: "company-user", role: "industry", display_name: "Company Contact", profile: { domain_id: 3, organization_name: "Ayush Labs" },
    } };
  } });
  await auth.login("partner@example.test", "StrongPassword!", "industry");
  assert.equal(requests[0].url, "https://api.example.test/api/v1/auth/signin");
  assert.equal(JSON.parse(requests[0].body).email, "partner@example.test");
  assert.equal(environment.localStorage.getItem("auth_api"), "v1");
  const user = await auth.getMe();
  assert.equal(user.profile.display_name, "Company Contact");
  assert.equal(user.profile.domain_id, 3);
  assert.equal(requests[1].headers.Authorization, "Bearer industry-token");
  await auth.revokeSession("industry-token");
  assert.equal(requests.at(-1).url, "https://api.example.test/api/v1/auth/signout");
  await auth.logout();
  assert.equal(environment.localStorage.getItem("access_token"), null);
  assert.equal(environment.localStorage.getItem("auth_api"), null);
});

test("industry navigation and login render dedicated content without fabricated metrics", async () => {
  const user = { id: "industry-account", role: "industry", email: "partner@example.test", profile: { display_name: "Partner Contact", organization_name: "Ayush Labs", domain_id: 3 } };
  const fixture = authFixture(user);
  const sidebar = await loadModule("src/app/components/Sidebar.tsx", {}, [fixture]);
  const nav = await loadModule("src/app/components/Navbar.tsx", {}, [fixture]);
  for (const Component of [sidebar.default, nav.default]) {
    const markup = renderToStaticMarkup(React.createElement(Component, { role: "industry", current: "industry-dashboard", navigate() {} }));
    assert.match(markup, /Applications/);
    assert.match(markup, /Opportunities/);
    assert.doesNotMatch(markup, /Alumni Directory/);
  }
  const login = await loadModule("src/app/components/LoginPage.tsx", {}, [fixture]);
  assert.match(renderToStaticMarkup(React.createElement(login.default, { navigate() {} })), />Industry</);
  const portal = await loadModule("src/app/components/industry/IndustryPortal.tsx", {}, [fixture]);
  const markup = renderToStaticMarkup(React.createElement(portal.default, { page: "industry-dashboard", navigate() {} }));
  assert.match(markup, /Industry dashboard/);
  assert.match(markup, /Ayush Labs/);
  assert.match(markup, /Loading industry workspace/);
});

test("identity uses each account's display name and falls back to real account fields", () => {
  assert.equal(identity.userName({ role: "student", email: "brajin@example.test", profile: { display_name: "Brajin" } }), "Brajin");
  assert.equal(identity.userName({ role: "alumni", full_name: "Nisha Rao", profile: { display_name: "  " } }), "Nisha Rao");
  assert.equal(identity.userName({ role: "student", student_profile: { full_name: "Sam Lee" } }), "Sam Lee");
  assert.equal(identity.userName({ role: "admin", email: "admin@example.test" }), "admin@example.test");
  assert.equal(identity.userName(null), "Your account");
});

test("subtitles and skills handle incomplete student and alumni records", () => {
  assert.equal(identity.userSubtitle({ role: "student", student_profile: { department: "ECE", year_of_study: 2 } }), "ECE · Year 2");
  assert.equal(identity.userSubtitle({ role: "alumni", alumni_profile: { current_role: "Designer", current_company: "Studio" } }), "Designer · Studio");
  assert.equal(identity.userSubtitle({ role: "admin" }), "Administrator");
  assert.deepEqual(Array.from(identity.profileSkills(" React, Python, React, ")), ["React", "Python"]);
  assert.deepEqual(Array.from(identity.profileSkills(["React", " TypeScript "])), ["React", "TypeScript"]);
  assert.deepEqual(Array.from(identity.profileSkills(null)), []);
});

test("profile links accept web URLs and reject executable or invalid URLs", () => {
  assert.equal(identity.safeProfileUrl("https://linkedin.com/in/example"), "https://linkedin.com/in/example");
  for (const value of ["javascript:alert(1)", "data:text/html,bad", "not a url", "", null]) {
    assert.equal(identity.safeProfileUrl(value), null);
  }
});

function apiEnvironment(initialToken) {
  const values = new Map(initialToken ? [["access_token", initialToken]] : []);
  const events = [];
  return {
    localStorage: { getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, value), removeItem: key => values.delete(key) },
    window: { dispatchEvent: event => events.push(event.type) }, events,
  };
}

test("API reads the current token for every account and clears it on logout", async () => {
  const environment = apiEnvironment("first-account");
  const requests = [];
  const api = await loadModule("src/lib/api.ts", { ...environment, fetch: async (url, options) => {
    requests.push({ url, ...options }); return { ok: true, json: async () => ({}) };
  } });
  await api.api.get("/api/me");
  api.setToken("second-account");
  await api.api.get("/api/me");
  api.removeToken();
  await api.api.get("/api/me");
  assert.equal(requests[0].headers.Authorization, "Bearer first-account");
  assert.equal(requests[1].headers.Authorization, "Bearer second-account");
  assert.equal(requests[2].headers.Authorization, undefined);
  assert.equal(api.getToken(), null);
});

test("an expired session is cleared, but an old request cannot sign out a new account", async () => {
  const environment = apiEnvironment("expired-account");
  let finishRequest;
  const api = await loadModule("src/lib/api.ts", { ...environment, fetch: () => new Promise(resolve => { finishRequest = resolve; }) });
  const unauthorized = { ok: false, status: 401, json: async () => ({ detail: "Session expired" }) };
  const expired = api.api.get("/api/me");
  finishRequest(unauthorized);
  await assert.rejects(expired, /Session expired/);
  assert.equal(api.getToken(), null);
  assert.deepEqual(environment.events, ["auth:expired"]);

  api.setToken("old-account");
  const stale = api.api.get("/api/me");
  api.setToken("new-account");
  finishRequest(unauthorized);
  await assert.rejects(stale, /Session expired/);
  assert.equal(api.getToken(), "new-account");
  assert.deepEqual(environment.events, ["auth:expired"]);
});

function authFixture(user) {
  return {
    name: "account-fixture",
    setup(builder) {
      builder.onResolve({ filter: /AuthContext$/ }, () => ({ path: "auth-fixture", namespace: "test" }));
      builder.onLoad({ filter: /.*/, namespace: "test" }, () => ({
        contents: `export function useAuth() { return { user: ${JSON.stringify(user)}, updateProfile() {}, refreshUser() {}, signOut() {} }; }`,
      }));
    },
  };
}

test("header, sidebar and profile render each signed-in user without sample identity", async () => {
  for (const user of [
    { id: "one", role: "student", email: "brajin@example.test", profile: { display_name: "Brajin" }, student_profile: { department: "ECE", year_of_study: 2, skills: ["React", "Python"] } },
    { id: "two", role: "alumni", email: "nisha@example.test", profile: { display_name: "Nisha Rao", bio: "Building useful software." }, alumni_profile: { current_role: "Engineer", current_company: "Studio", mentorship_areas: "Design, React" } },
    { id: "three", role: "student", email: "new@example.test", profile: null, student_profile: null },
  ]) {
    const name = identity.userName(user);
    for (const component of ["Navbar", "Sidebar", "ProfilePage"]) {
      const { default: Component } = await loadModule(`src/app/components/${component}.tsx`, {}, [authFixture(user)]);
      const html = renderToStaticMarkup(React.createElement(Component, { current: "profile", role: user.role, navigate() {} }));
      assert.ok(html.includes(name), `${component} should show ${name}`);
      assert.ok(!/Aryan Kapoor|Priya Sharma|priyasharma|National Institute of Technology|4\.9|6 yrs/.test(html), `${component} must not show sample personal data`);
      if (component === "ProfilePage") {
        assert.ok(html.includes("My profile"));
        assert.ok(html.includes("Edit profile"));
        assert.equal(html.includes("Student verification"), user.role === "student");
        assert.ok(!html.includes("href=\"javascript:"));
      }
      if (component === "Sidebar") assert.ok(html.includes(user.role === "alumni" ? "Post Jobs" : "Jobs &amp; Internships"));
    }
  }
});
