import { createHash } from "node:crypto";
import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { Readable } from "node:stream";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const worker = (await import("../.output/server/index.mjs")).default;
const context = { waitUntil() {} };
const assets = {
  async fetch(request) {
    const name = new URL(request.url).pathname.split("/").at(-1);
    if (!/^(ultra|musica)-\d{3}\.part$/.test(name ?? "")) {
      return new Response("Arquivo não encontrado", { status: 404 });
    }
    const path = join(root, "public", "apk", "parts", name);
    return new Response(Readable.toWeb(createReadStream(path)));
  },
};

for (const app of ["ultra", "musica"]) {
  const url = `https://example.test/apk/${app}.apk`;
  const response = await worker.fetch(new Request(url), { ASSETS: assets }, context);
  if (response.status !== 200) throw new Error(`${app}: status ${response.status}`);
  const source = join(root, "apks", `${app}.apk`);
  const expectedSize = (await stat(source)).size;
  const digest = createHash("sha256");
  let receivedSize = 0;
  for await (const chunk of Readable.fromWeb(response.body)) {
    digest.update(chunk);
    receivedSize += chunk.length;
  }
  const sourceDigest = createHash("sha256");
  for await (const chunk of createReadStream(source)) sourceDigest.update(chunk);
  if (receivedSize !== expectedSize || digest.digest("hex") !== sourceDigest.digest("hex")) {
    throw new Error(`${app}: conteúdo diferente do APK original`);
  }

  const head = await worker.fetch(new Request(url, { method: "HEAD" }), { ASSETS: assets }, context);
  if (head.status !== 200 || head.headers.get("content-length") !== String(expectedSize)) {
    throw new Error(`${app}: resposta HEAD incorreta`);
  }
  console.log(`${app}.apk: download íntegro (${expectedSize} bytes)`);
}
