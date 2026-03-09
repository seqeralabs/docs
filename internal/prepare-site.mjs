import {spawn} from "node:child_process";

const docsSiteMode = process.env.DOCS_SITE_MODE ?? "main";

if (docsSiteMode === "enterprise-archive") {
  console.log(
    "DOCS_SITE_MODE=enterprise-archive: skipping OSS docs fetch for local startup/build.",
  );
  process.exit(0);
}

const child = spawn("npm", ["run", "fetch-docs-oss"], {
  stdio: "inherit",
  shell: true,
  env: process.env,
});

child.on("exit", (code) => {
  process.exit(code ?? 1);
});
