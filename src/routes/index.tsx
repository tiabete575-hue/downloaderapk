import { createFileRoute } from "@tanstack/react-router";
import {
  CheckCircle2,
  Download,
  Headphones,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Tv,
} from "lucide-react";
import logo from "../assets/logo.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Tia Bete TV — Baixar App" },
      {
        name: "description",
        content:
          "Baixe o aplicativo oficial Tia Bete TV para Android. Instalação rápida, um clique e sempre a versão mais recente.",
      },
      { property: "og:title", content: "Tia Bete TV — Baixar App" },
      {
        property: "og:description",
        content:
          "Baixe o aplicativo oficial Tia Bete TV para Android. Instalação rápida, um clique e sempre a versão mais recente.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* brilhos de fundo */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-primary/25 blur-[140px] animate-glow-pulse" />
        <div className="absolute bottom-0 right-0 h-[300px] w-[400px] rounded-full bg-accent/10 blur-[120px]" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-6 py-16 text-center">
        <img
          src={logo}
          alt="Tia Bete TV"
          width={816}
          height={816}
          className="h-32 w-32 animate-float rounded-3xl object-cover shadow-2xl shadow-primary/40"
        />

        <h1 className="mt-8 text-4xl font-extrabold tracking-tight sm:text-5xl">
          Tia Bete <span className="text-primary">TV</span>
        </h1>
        <p className="mt-4 max-w-md text-lg text-muted-foreground">
          Baixe o aplicativo oficial e assista seus canais, filmes e séries no
          seu Android, TV Box ou Smart TV.
        </p>

        {/* aplicativos disponíveis */}
        <div className="mt-10 grid w-full max-w-2xl gap-5 sm:grid-cols-2">
          <article className="flex flex-col rounded-3xl border bg-card/80 p-6 text-left shadow-lg backdrop-blur-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15 text-primary">
              <Sparkles className="h-6 w-6" />
            </div>
            <h2 className="mt-5 text-2xl font-bold">Ultra</h2>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
              Baixe o aplicativo Ultra diretamente no seu dispositivo Android.
            </p>
            <a
              href="/apk/ultra.apk"
              download="ultra.apk"
              className="group mt-6 inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-primary px-5 py-4 text-base font-bold text-primary-foreground shadow-lg shadow-primary/30 transition-transform duration-200 hover:scale-[1.03] active:scale-[0.98]"
            >
              <Download className="h-5 w-5 transition-transform group-hover:translate-y-0.5" />
              Baixar Ultra
            </a>
          </article>

          <article className="flex flex-col rounded-3xl border bg-card/80 p-6 text-left shadow-lg backdrop-blur-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/15 text-accent">
              <Headphones className="h-6 w-6" />
            </div>
            <h2 className="mt-5 text-2xl font-bold">Música</h2>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
              Baixe o aplicativo de música diretamente no seu dispositivo Android.
            </p>
            <a
              href="/apk/musica.apk"
              download="musica.apk"
              className="group mt-6 inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-accent px-5 py-4 text-base font-bold text-accent-foreground shadow-lg shadow-accent/20 transition-transform duration-200 hover:scale-[1.03] active:scale-[0.98]"
            >
              <Download className="h-5 w-5 transition-transform group-hover:translate-y-0.5" />
              Baixar Música
            </a>
          </article>
        </div>

        {/* passos */}
        <div className="mt-12 grid w-full gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border bg-card p-5 text-left">
            <Download className="h-6 w-6 text-primary" />
            <h2 className="mt-3 font-semibold">1. Baixe</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Escolha um dos aplicativos acima e toque no botão para baixar.
            </p>
          </div>
          <div className="rounded-2xl border bg-card p-5 text-left">
            <ShieldCheck className="h-6 w-6 text-primary" />
            <h2 className="mt-3 font-semibold">2. Permita a instalação</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Se o celular pedir, ative "instalar apps de fontes desconhecidas".
            </p>
          </div>
          <div className="rounded-2xl border bg-card p-5 text-left">
            <Tv className="h-6 w-6 text-primary" />
            <h2 className="mt-3 font-semibold">3. Assista</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Abra o app, entre com seu usuário e aproveite.
            </p>
          </div>
        </div>

        {/* aviso de atualização */}
        <div className="mt-8 flex w-full max-w-md items-start gap-3 rounded-2xl border border-primary/30 bg-primary/10 p-4 text-left">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
          <p className="text-sm text-foreground/90">
            <span className="font-semibold">Atualizações automáticas:</span>{" "}
            sempre que sair uma versão nova, o aplicativo avisa você na tela
            inicial. É só voltar aqui e baixar de novo pelo botão.
          </p>
        </div>

        <p className="mt-10 flex items-center gap-2 text-xs text-muted-foreground">
          <Smartphone className="h-4 w-4" />
          Compatível com Android, TV Box e Smart TV Android
        </p>
      </div>
    </div>
  );
}
