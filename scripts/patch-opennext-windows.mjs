/**
 * Patches @opennextjs packages for Windows compatibility.
 * 
 * Fixes various issues that occur on Windows:
 *  - ERR_UNSUPPORTED_ESM_URL_SCHEME: dynamic import() with raw Windows paths
 *  - ENOENT on .wasm?module: ? is invalid in Windows file paths
 *  - EPERM on symlinks: symlinks require admin privileges on Windows
 *
 * Affected files:
 *  1. @opennextjs/aws/dist/build/compileConfig.js
 *     - Uses `file://${configPath}` which produces invalid URLs on Windows
 *  2. @opennextjs/aws/dist/build/patch/patches/patchOriginalNextConfig.js  
 *     - Uses raw Windows path in import() without any file:// conversion
 *  3. next/dist/compiled/@vercel/og/index.edge.js
 *     - .wasm?module imports cause ENOENT on Windows (? is invalid in win paths)
 *  4. @opennextjs/cloudflare/dist/cli/build/patches/plugins/wrangler-external.js
 *     - .wasm?module path causes ENOENT on Windows (? is invalid in win paths)
 *  5. @opennextjs/aws/dist/build/copyTracedFiles.js
 *     - Symlink creation fails without admin privileges on Windows
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const fixes = [
  {
    // Fix 1: compileConfig.js - broken file:// URL construction
    file: join(
      'node_modules', '@opennextjs', 'cloudflare', 'node_modules',
      '@opennextjs', 'aws', 'dist', 'build', 'compileConfig.js'
    ),
    find: `    // On Windows, we need to use file:// protocol to load the config file using import()
    if (process.platform === "win32")
        configPath = \`file://\${configPath}\`;`,
    replace: `    // On Windows, we need to use file:// protocol to load the config file using import()
    if (process.platform === "win32") {
        const { pathToFileURL } = await import("node:url");
        configPath = pathToFileURL(configPath).href;
    }`,
  },
  {
    // Fix 2: patchOriginalNextConfig.js - missing file:// conversion entirely
    file: join(
      'node_modules', '@opennextjs', 'cloudflare', 'node_modules',
      '@opennextjs', 'aws', 'dist', 'build', 'patch', 'patches', 'patchOriginalNextConfig.js'
    ),
    find: `    return (await import(configToImport)).default;`,
    replace: `    // On Windows, convert absolute paths to file:// URLs for ESM import()
    if (process.platform === "win32") {
        const { pathToFileURL } = await import("node:url");
        configToImport = pathToFileURL(configToImport).href;
    }
    return (await import(configToImport)).default;`,
  },
  {
    // Fix 3: @vercel/og index.edge.js - .wasm?module imports cause ENOENT on Windows
    // The ?module suffix is invalid in Windows paths. In Cloudflare Workers, .wasm
    // imports already return a WebAssembly.Module, so the suffix is redundant.
    // See: https://github.com/opennextjs/opennextjs-cloudflare/issues/1089
    file: join(
      'node_modules', 'next', 'dist', 'compiled', '@vercel', 'og', 'index.edge.js'
    ),
    find: `import resvg_wasm from "./resvg.wasm?module";
import yoga_wasm from "./yoga.wasm?module";`,
    replace: `import resvg_wasm from "./resvg.wasm";
import yoga_wasm from "./yoga.wasm";`,
  },
  {
    // Fix 4: wrangler-external.js - .wasm?module causes ENOENT on Windows (? is invalid in win paths)
    // Strips ?module before resolving, then re-appends it so Wrangler still treats it as a WASM module.
    // See: https://github.com/opennextjs/opennextjs-cloudflare/issues/1089
    file: join(
      'node_modules', '@opennextjs', 'cloudflare', 'dist',
      'cli', 'build', 'patches', 'plugins', 'wrangler-external.js'
    ),
    find: `            build.onResolve({ filter: /(\\.bin|\\.wasm(\\?module)?)$/ }, ({ path, importer }) => {
                return {
                    path: normalizePath(resolve(dirname(importer), path)),
                    namespace,
                    external: true,
                };
            });`,
    replace: `            build.onResolve({ filter: /(\\.bin|\\.wasm(\\?module)?)$/ }, ({ path, importer }) => {
                // On Windows, strip ?module before resolving (? is invalid in Windows paths)
                // then re-append it so Wrangler still knows to handle it as a WASM module.
                let suffix = "";
                let cleanPath = path;
                const qIdx = path.indexOf("?");
                if (qIdx !== -1) {
                    suffix = path.slice(qIdx);
                    cleanPath = path.slice(0, qIdx);
                }
                return {
                    path: normalizePath(resolve(dirname(importer), cleanPath)) + suffix,
                    namespace,
                    external: true,
                };
            });`,
  },
  {
    // Fix 4: copyTracedFiles.js - symlink fails on Windows without admin, use junction/copy fallback
    file: join(
      'node_modules', '@opennextjs', 'cloudflare', 'node_modules',
      '@opennextjs', 'aws', 'dist', 'build', 'copyTracedFiles.js'
    ),
    find: `        if (symlink) {
            try {
                symlinkSync(symlink, to);
            }
            catch (e) {
                if (e.code !== "EEXIST") {
                    throw e;
                }
            }
        }`,
    replace: `        if (symlink) {
            try {
                symlinkSync(symlink, to);
            }
            catch (e) {
                if (e.code === "EEXIST") {
                    // Already exists, skip
                }
                else if (e.code === "EPERM" && process.platform === "win32") {
                    // Windows: symlinks require admin privileges, try junction or copy
                    try {
                        symlinkSync(symlink, to, "junction");
                    }
                    catch (e2) {
                        // Junction also failed, fall back to recursive copy
                        cpSync(from, to, { recursive: true });
                    }
                }
                else {
                    throw e;
                }
            }
        }`,
  },
];

let patchedCount = 0;

for (const { file, find, replace } of fixes) {
  if (!existsSync(file)) {
    console.log(`  SKIP  ${file} (not found)`);
    continue;
  }

  const content = readFileSync(file, 'utf-8');

  if (content.includes(replace)) {
    console.log(`  OK    ${file} (already patched)`);
    patchedCount++;
    continue;
  }

  if (!content.includes(find)) {
    console.log(`  WARN  ${file} (target string not found — version may have changed)`);
    continue;
  }

  writeFileSync(file, content.replace(find, replace), 'utf-8');
  console.log(`  PATCH ${file}`);
  patchedCount++;
}

console.log(`\nPatched ${patchedCount}/${fixes.length} files for Windows ESM compatibility.`);
