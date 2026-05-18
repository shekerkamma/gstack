import esbuild from "esbuild";
import { existsSync, mkdirSync } from "fs";

const prod = process.argv[2] === "production";

if (!existsSync("./dist")) mkdirSync("./dist");

esbuild.build({
  entryPoints: ["src/main.ts"],
  bundle: true,
  external: ["obsidian", "electron", "@codemirror/*", "@lezer/*"],
  format: "cjs",
  platform: "node",
  target: "es2020",
  outfile: "dist/main.js",
  sourcemap: prod ? false : "inline",
  minify: prod,
  logLevel: "info",
}).catch(() => process.exit(1));
