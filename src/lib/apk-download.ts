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

  const FixedLengthStream = (globalThis as typeof globalThis & {
    FixedLengthStream?: FixedLengthStreamConstructor;
  }).FixedLengthStream;
  const stream = FixedLengthStream
    ? new FixedLengthStream(apk.size)
    : new TransformStream<Uint8Array, Uint8Array>();

  // pipeTo copia cada parte pelo runtime de Streams, sem processar cada bloco
  // em JavaScript. Isso evita esgotar o tempo de CPU durante downloads grandes.
  void (async () => {
    try {
      for (const part of apk.parts) {
        const response = await assets.fetch(new Request(new URL(part.path, request.url)));
        if (!response.ok || !response.body) {
          throw new Error(`Falha ao carregar ${part.path}: ${response.status}`);
        }
        await response.body.pipeTo(stream.writable, { preventClose: true, preventAbort: true });
      }
      await stream.writable.getWriter().close();
    } catch (error) {
      console.error(error);
      await stream.writable.abort(error);
    }
  })();

  if (!FixedLengthStream) headers.delete("Content-Length");
  return new Response(stream.readable, { headers });
}
