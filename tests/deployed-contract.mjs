import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

// Download the public schema first. Tests themselves never mutate the deployment.
const deployed = JSON.parse((await readFile("tests/generated/deployed-openapi.json", "utf8")).replace(/^\uFEFF/, ""));
const local = JSON.parse(await readFile("../Backend-Grad/docs/openapi.json", "utf8"));
const catalog = JSON.parse(await readFile("src/lib/generated/apiCatalog.json", "utf8"));
test("deployed backend operations and schemas match the integrated frontend contract", () => {
  const methods = new Set(["get", "post", "put", "patch", "delete"]);
  const deployedKeys = Object.entries(deployed.paths).flatMap(([path, entries]) => Object.keys(entries).filter(m => methods.has(m)).map(m => `${m.toUpperCase()} ${path}`));
  assert.deepEqual(new Set(catalog.map(o => o.key)), new Set(deployedKeys));
  assert.deepEqual(deployed.paths, local.paths);
  assert.deepEqual(deployed.components, local.components);
});
