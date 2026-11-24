/**
 * Build the web version and publish it to GitHub Pages (gh-pages branch).
 *   npm run deploy:web
 * Result: https://<user>.github.io/<repo>/  — open in iPhone Safari and use
 * Share -> Add to Home Screen to get an app-like icon.
 */
const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const dist = path.join(root, "dist");
const run = (cmd, cwd = root) => execSync(cmd, { cwd, stdio: "inherit" });
const out = (cmd, cwd = root) => execSync(cmd, { cwd }).toString().trim();

const remote = out("git remote get-url origin");
const repo = remote.replace(/\.git$/, "").split("/").pop();
const base = `/${repo}`;

fs.rmSync(dist, { recursive: true, force: true });
run("npx expo export -p web");

// 1) Pages serves from a sub-path, so make every asset URL absolute under it.
const indexPath = path.join(dist, "index.html");
let html = fs.readFileSync(indexPath, "utf8");
html = html
  .replace(/(href|src)="\/(?!\/)/g, `$1="${base}/`)
  // 2) iPhone "Add to Home Screen" polish.
  .replace(
    "</head>",
    [
      `<link rel="apple-touch-icon" href="${base}/apple-touch-icon.png" />`,
      `<meta name="apple-mobile-web-app-capable" content="yes" />`,
      `<meta name="mobile-web-app-capable" content="yes" />`,
      `<meta name="apple-mobile-web-app-title" content="Korean Together" />`,
      `<meta name="apple-mobile-web-app-status-bar-style" content="default" />`,
      `<meta name="theme-color" content="#2D3FE0" />`,
      "</head>",
    ].join("\n")
  )
  .replace('content="width=device-width, initial-scale=1, shrink-to-fit=no"', 'content="width=device-width, initial-scale=1, shrink-to-fit=no, viewport-fit=cover"');
fs.writeFileSync(indexPath, html);

fs.copyFileSync(path.join(root, "assets", "icon.png"), path.join(dist, "apple-touch-icon.png"));
fs.writeFileSync(path.join(dist, ".nojekyll"), ""); // let Pages serve the _expo/ folder

// 3) Publish dist/ as the gh-pages branch (a build-output-only branch).
run("git init -q", dist);
run("git checkout -q -b gh-pages", dist);
run("git add -A", dist);
run('git -c user.name="deploy" -c user.email="deploy@local" commit -q -m "Deploy web build"', dist);
run(`git push -f ${remote} gh-pages`, dist);
console.log(`\nPublished. Site URL: https://${remote.match(/github\.com[:/]([^/]+)\//)[1]}.github.io/${repo}/`);
