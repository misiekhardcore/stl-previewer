const esbuild = require("esbuild");
const { copyFile } = require("fs");

const production = process.argv.includes("--production");
const watch = process.argv.includes("--watch");

/**
 * @type {import('esbuild').Plugin}
 */
const esbuildProblemMatcherPlugin = {
  name: "esbuild-problem-matcher",

  setup(build) {
    build.onStart(() => {
      console.log("[watch] build started");
    });
    build.onEnd((result) => {
      result.errors.forEach(({ text, location }) => {
        console.error(`[ERROR] ${text}`);
        console.error(
          `    ${location.file}:${location.line}:${location.column}:`
        );
      });
      console.log("[watch] copying index.css");
      copyFile(
        `${__dirname}/src/media/index.css`,
        `${__dirname}/dist/media/index.css`,
        (err) => {
          if (err) {
            console.error("[ERROR] Failed to copy index.css:", err);
          } else {
            console.log("[watch] index.css copied");
          }
        }
      );
      console.log("[watch] build finished");
    });
  },
};

async function main() {
  // Build the extension (Node.js platform)
  const extensionCtx = await esbuild.context({
    entryPoints: ["src/extension.ts"],
    outdir: "dist",
    bundle: true,
    format: "cjs",
    minify: production,
    sourcemap: !production,
    sourcesContent: false,
    platform: "node",
    external: ["vscode"],
    logLevel: production ? "silent" : "info",
    plugins: [esbuildProblemMatcherPlugin],
  });

  // Build the webview (browser platform)
  const webviewCtx = await esbuild.context({
    entryPoints: ["src/media/index.tsx", "src/media/index.css"],
    outdir: "dist/media",
    bundle: true,
    format: "iife", // Use IIFE for browser
    minify: production,
    sourcemap: !production,
    sourcesContent: false,
    platform: "browser", // This is the key change
    logLevel: production ? "silent" : "info",
    plugins: [esbuildProblemMatcherPlugin],
  });

  // Build the CSG worker (browser platform)
  const workerCtx = await esbuild.context({
    entryPoints: ["src/csg-worker.ts"],
    outdir: "dist/media", // Change this from "dist" to "dist/media"
    bundle: true,
    format: "iife", // Use IIFE for browser
    minify: production,
    sourcemap: !production,
    sourcesContent: false,
    platform: "browser",
    logLevel: production ? "silent" : "info",
    plugins: [esbuildProblemMatcherPlugin],
  });

  if (watch) {
    await Promise.all([
      extensionCtx.watch(),
      webviewCtx.watch(),
      workerCtx.watch(),
    ]);
  } else {
    await Promise.all([
      extensionCtx.rebuild(),
      webviewCtx.rebuild(),
      workerCtx.rebuild(),
    ]);
    await Promise.all([
      extensionCtx.dispose(),
      webviewCtx.dispose(),
      workerCtx.dispose(),
    ]);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
