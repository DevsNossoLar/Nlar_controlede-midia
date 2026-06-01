# syntax=docker/dockerfile:1
FROM node:20-alpine AS build
WORKDIR /repo

COPY package.json package-lock.json turbo.json ./
COPY packages ./packages
COPY apps/web ./apps/web

RUN --mount=type=secret,id=npmrc,target=/root/.npmrc npm ci

# Compila @repo/types, @repo/ui, @repo/db e apps/web (dependsOn do turbo)
RUN npx turbo run build --filter=web

RUN npm prune --omit=dev

FROM node:20-alpine AS production
WORKDIR /repo

RUN apk add --no-cache dumb-init curl
ENV NODE_ENV=production \
    HOSTNAME=0.0.0.0 

COPY --chown=node:node --from=build /repo /repo

USER node
WORKDIR /repo/apps/web

ENTRYPOINT ["dumb-init", "--"]

CMD ["npm", "run", "start", "--", "-p", "3010", "-H", "0.0.0.0"]
