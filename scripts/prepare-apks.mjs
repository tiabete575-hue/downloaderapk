import { createHash } from "node:crypto";
import { createReadStream } from "node:fs";
import { mkdir, open, readdir, rm, stat, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const sourceDir = join(root, "apks");
const partsDir = join(root, "public", "apk", "parts");
const manifestPath = join(root, "src", "apk-manifest.ts");
const partSize = 20 * 1024 * 1024;
const apps = ["ultra", "musica"];

await mkdir(partsDir, { recursive: true });
const previousParts = await readdir(partsDir);
for (const name of previousParts) {
  if (/^(ultra|musica)-\d{3}\.part$/.test(name)) {
    await rm(join(partsDir, name));
  }
}

const manifest = {};
for (const app of apps) {
  const filename = `${app}.apk`;
  const source = join(sourceDir, filename);
  const { size } = await stat(source);
  if (size === 0) throw new Error(`${filename} está vazio`);

  const hash = createHash("sha256");
  const parts = [];
  let currentPart;
  let currentSize = 0;
  let partNumber = 0;

  try {
    for await (const buffer of createReadStream(source, { highWaterMark: 1024 * 1024 })) {
      hash.update(buffer);
      if (!currentPart || currentSize === partSize) {
        if (currentPart) await currentPart.close();
        const partName = `${app}-${String(partNumber++).padStart(3, "0")}.part`;
        currentPart = await open(join(partsDir, partName), "w");
        currentSize = 0;
        parts.push({ path: `/apk/parts/${partName}`, size: 0 });
      }
      await currentPart.write(buffer);
      currentSize += buffer.length;
      parts.at(-1).size = currentSize;
    }
  } finally {
    if (currentPart) await currentPart.close();
  }

  manifest[app] = { filename, size, sha256: hash.digest("hex"), parts };
  console.log(`${filename}: ${parts.length} partes de até 20 MiB`);
}

await writeFile(manifestPath, `// Gerado por scripts/prepare-apks.mjs.\nexport const apkManifest = ${JSON.stringify(manifest, null, 2)} as const;\n`);
