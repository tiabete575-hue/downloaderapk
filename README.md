# Direct APK Download

Quero criar uma pagina que de acesso para os clientes baixarem o meu apk só clicando no botão de download  . Trabalho com iptv e sempre preciso enviar app para os clientes e que permita atualizações automáticas sempre que eu subir uma nova versão.  não vou hospedar os apks em lugar nehum vai ficar direto no projeto em uma pasta

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/84029f8f-45d1-4b74-8487-e88d3705a37f).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

## Publicação na Cloudflare

O comando de deploy é `npx wrangler deploy`. A configuração em `wrangler.jsonc`
executa o build e publica o site como um Cloudflare Worker com arquivos estáticos.
Para atualizar os aplicativos, substitua `apks/ultra.apk` ou `apks/musica.apk`
e envie o commit ao GitHub. O build cria automaticamente partes menores que o
limite de 25 MiB por arquivo da Cloudflare; os botões continuam baixando um
único APK completo pelos endereços `/apk/ultra.apk` e `/apk/musica.apk`.
