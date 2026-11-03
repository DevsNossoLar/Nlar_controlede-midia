#!/usr/bin/env bash
set -euo pipefail

# Volumes de node_modules/.next sao criados como root.
for dir in node_modules apps/*/node_modules packages/*/node_modules apps/web/.next; do
  if [ -e "$dir" ]; then sudo chown -R node:node "$dir"; fi
done

# O drive do Windows é montado como root; sem isso o git recusa o repositório ("dubious ownership").
git config --global --add safe.directory "$PWD"

# Artefatos gerados fora do container (ex.: rodando no Windows) ficam como root no drive montado.
for dir in packages/*/dist .turbo apps/*/.turbo packages/*/.turbo; do
  if [ -e "$dir" ]; then sudo chown -R node:node "$dir"; fi
done

if ! getent hosts registry.npmjs.org >/dev/null; then
  echo "ERRO: o container está sem acesso à internet (não resolve registry.npmjs.org)." >&2
  echo "Verifique a rede do Docker Desktop/WSL no Windows e reconstrua o container." >&2
  exit 1
fi

# Flag de linha de comando tem precedência sobre o .npmrc do projeto.
TOKEN="${NPM_TOKEN:-${NODE_AUTH_TOKEN:-}}"
if [ -n "$TOKEN" ]; then
  npm ci --no-audit --no-fund "--//npm.pkg.github.com/:_authToken=${TOKEN}"
else
  echo "NPM_TOKEN/NODE_AUTH_TOKEN não definido no host: usando o token do .npmrc do projeto."
  npm ci --no-audit --no-fund
fi

# apps/web importa @repo/db, @repo/types e @repo/ui a partir de dist/.
npx turbo run build --filter=@repo/db --filter=@repo/types --filter=@repo/ui

# Aviso (não bloqueia): IPs 172.16-31.x podem colidir com as redes internas do Docker.
DB_HOST=""
if [ -n "${HOST_FILE:-}" ] && [ -f "$HOST_FILE" ]; then
  DB_HOST="$(sed 's/\r$//; s/^\xEF\xBB\xBF//; s/^[[:space:]]*HOST[[:space:]]*=[[:space:]]*//' "$HOST_FILE" | head -n 1 | tr -d '"'"'[:space:]")"
fi
for envfile in packages/db/.env apps/web/.env; do
  [ -n "$DB_HOST" ] && break
  if [ -f "$envfile" ]; then
    DB_HOST="$(sed -n 's/\r$//; s/^[[:space:]]*HOST[[:space:]]*=[[:space:]]*//p' "$envfile" | head -n 1 | tr -d '"'"'")"
  fi
done

if [ -n "$DB_HOST" ]; then
  if timeout 5 bash -c "</dev/tcp/${DB_HOST}/1433" 2>/dev/null; then
    echo "SQL Server acessível em ${DB_HOST}:1433."
  else
    echo "AVISO: não foi possível conectar ao SQL Server em ${DB_HOST}:1433 a partir do container." >&2
    echo "Se o IP estiver em 172.16-31.x, verifique conflito com as redes do Docker (docker network inspect)." >&2
  fi
fi
