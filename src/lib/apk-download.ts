import { apkManifest } from "../apk-manifest";

type AssetsBinding = {
  fetch(request: Request): Promise<Response>;
};

type DownloadEnvironment = {
  ASSETS?: AssetsBinding;
};

type RequestWithCloudflareRuntime = Request & {
  runtime?: { cloudflare?: { env?: DownloadEnvironment } };
};

type FixedLengthStreamConstructor = new (length: number) => {
  readable: ReadableStream<Uint8Array>;
  writable: WritableStream<Uint8Array>;
};

export function handleApkDownload(request: Request, environment: unknown): Response | null {
  const pathname = new URL(request.url).pathname;
  const app = pathname === "/apk/ultra.apk" ? "ultra" : pathname === "/apk/musica.apk" ? "musica" : null;
  if (!app) return null;

  if (request.method !== "GET" && request.method !== "HEAD") {
    return new Response("Método não permitido", { status: 405, headers: { Allow: "GET, HEAD" } });
  }

  // Nitro encaminha a requisição ao serviço SSR sem repassar o argumento env.
  const assets = (environment as DownloadEnvironment | null)?.ASSETS
    ?? (request as RequestWithCloudflareRuntime).runtime?.cloudflare?.env?.ASSETS
    ?? (globalThis as typeof globalThis & { __env__?: DownloadEnvironment }).__env__?.ASSETS;
  if (!assets) return new Response("Arquivos indisponíveis", { status: 503 });

  const apk = apkManifest[app];
  const headers = new Headers({
    "Content-Type": "application/vnd.android.package-archive",
    "Content-Disposition": `attachment; filename="${apk.filename}"`,
    "Content-Length": String(apk.size),
    "Cache-Control": "public, max-age=300",
    ETag: `"${apk.sha256}"`,
  });

  if (request.method === "HEAD") return new Response(null, { headers });

  let partIndex = 0;
  let reader: ReadableStreamDefaultReader<Uint8Array> | null = null;
  const body = new ReadableStream<Uint8Array>({
    async pull(controller) {
      while (true) {
        if (!reader) {
          if (partIndex === apk.parts.length) {
            controller.close();
            return;
          }

          const part = apk.parts[partIndex];
          if (!part) throw new Error("Parte do APK ausente do manifesto");
          const partUrl = new URL(part.path, request.url);
          const response = await assets.fetch(new Request(partUrl));
          if (!response.ok || !response.body) {
            throw new Error(`Falha ao carregar ${part.path}: ${response.status}`);
          }
          reader = response.body.getReader();
        }

        const result = await reader.read();
        if (result.done) {
          reader = null;
          partIndex += 1;
          continue;
        }

        controller.enqueue(result.value);
        return;
      }
    },
    async cancel() {
      await reader?.cancel();
    },
  });

  const FixedLengthStream = (globalThis as typeof globalThis & {
    FixedLengthStream?: FixedLengthStreamConstructor;
  }).FixedLengthStream;
  if (FixedLengthStream) {
    const fixed = new FixedLengthStream(apk.size);
    void body.pipeTo(fixed.writable).catch((error) => console.error(error));
    return new Response(fixed.readable, { headers });
  }

  // Fora do runtime Cloudflare, a resposta usa transferência em blocos.
  headers.delete("Content-Length");
  return new Response(body, { headers });
}
