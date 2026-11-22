# *****************************
# *** STAGE 1: Dependencies ***
# *****************************
FROM docker.io/library/node:24.21.0-alpine@sha256:be80f76cf40ec8e42b9bec49f60a55e0660f30af58d3e5a25530785b30ea67e2 AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat python3 make g++
RUN ln -sf /usr/bin/python3 /usr/bin/python
RUN corepack enable && corepack prepare pnpm@11.5.1 --activate

### Install all workspace dependencies in one place
WORKDIR /app
RUN apk add git
# Cryft: install from the manifests alone, scripts off, so this (slow) layer is reused until a dependency changes.
# The hooks need the source, so they run after the copy: the dependencies' allowed build scripts (pnpm rebuild;
# allowBuilds in pnpm-workspace.yaml) and, with them, the root postinstall (chakra typegen of the theme). The root `prepare`
# (husky) is skipped, as before: there is no .git in the build.
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY src/toolkit/package/package.json ./src/toolkit/package/
COPY deploy/tools/envs-validator/package.json ./deploy/tools/envs-validator/
COPY deploy/tools/feature-reporter/package.json ./deploy/tools/feature-reporter/
COPY deploy/tools/favicon-generator/package.json ./deploy/tools/favicon-generator/
COPY deploy/tools/sitemap-generator/package.json ./deploy/tools/sitemap-generator/
COPY deploy/tools/multichain-config-generator/package.json ./deploy/tools/multichain-config-generator/
COPY deploy/tools/essential-dapps-chains-config-generator/package.json ./deploy/tools/essential-dapps-chains-config-generator/
COPY deploy/tools/llms-txt-generator/package.json ./deploy/tools/llms-txt-generator/
COPY deploy/tools/affected-tests/package.json ./deploy/tools/affected-tests/
RUN pnpm install --frozen-lockfile --ignore-scripts
COPY . .
RUN pnpm rebuild


# *****************************
# ****** STAGE 2: Build *******
# *****************************
# Cryft: the build continues on the deps stage's own layers (node_modules and the source are already there), so no
# build copies the whole dependency tree into a new layer again (3 min a build before).
FROM deps AS builder
RUN apk add --no-cache --upgrade libc6-compat bash jq

# pass build args to env variables
ARG GIT_COMMIT_SHA
ENV NEXT_PUBLIC_GIT_COMMIT_SHA=$GIT_COMMIT_SHA
ARG GIT_TAG
ENV NEXT_PUBLIC_GIT_TAG=$GIT_TAG
ARG NEXT_OPEN_TELEMETRY_ENABLED
ENV NEXT_OPEN_TELEMETRY_ENABLED=$NEXT_OPEN_TELEMETRY_ENABLED

ENV NODE_ENV production

### APP
# Dependencies and source code: already here (FROM deps)
WORKDIR /app

# Build SVG sprite and generate .env.registry with ENVs list and save build args into .env file
RUN set -a && \
    source ./deploy/scripts/build_sprite.sh && \
    ./deploy/scripts/collect_envs.sh ./docs/ENVS.md && \
    set +a

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
ENV NEXT_TELEMETRY_DISABLED=1

# Build app for production
ENV NODE_OPTIONS="--max-old-space-size=8192"
RUN pnpm routes:generate
# Cryft: Next.js keeps its build cache between image builds (a cache mount, never in the image), so a small change
# rebuilds only what it touches.
RUN --mount=type=cache,id=cryft-explorer-next-cache,target=/app/.next/cache pnpm run build


### FEATURE REPORTER
RUN cd ./deploy/tools/feature-reporter && pnpm run build


### ENV VARIABLES CHECKER
RUN cd ./deploy/tools/envs-validator && pnpm run build


### FAVICON GENERATOR
# Portable bundle for the runtime image (self-contained node_modules)
RUN pnpm --filter favicon-generator deploy --prod /app/favicon-generator-bundle

### SITEMAP GENERATOR
RUN pnpm --filter sitemap-generator deploy --prod /app/sitemap-generator-bundle

### MULTICHAIN CONFIG GENERATOR
RUN cd ./deploy/tools/multichain-config-generator && pnpm run build

### ESSENTIAL DAPPS CHAINS CONFIG GENERATOR
RUN cd ./deploy/tools/essential-dapps-chains-config-generator && pnpm run build

### llms.txt GENERATOR
RUN cd ./deploy/tools/llms-txt-generator && pnpm run build


### DEV-SERVER ENV FETCHER
RUN pnpm exec tsc -p ./tools/dev-server/tsconfig.json


# *****************************
# ******* STAGE 3: Run ********
# *****************************
# Production image, copy all the files and run next
FROM docker.io/library/node:24.21.0-alpine@sha256:be80f76cf40ec8e42b9bec49f60a55e0660f30af58d3e5a25530785b30ea67e2 AS runner
RUN apk add --no-cache --upgrade bash curl jq unzip

### APP
WORKDIR /app

# Uncomment the following line in case you want to disable telemetry during runtime.
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

# Copy tools
COPY --from=builder /app/deploy/tools/envs-validator/dist/index.js ./envs-validator/index.js
COPY --from=builder /app/deploy/tools/feature-reporter/dist/index.js ./feature-reporter.js
COPY --from=builder /app/deploy/tools/multichain-config-generator/dist ./deploy/tools/multichain-config-generator/dist
COPY --from=builder /app/deploy/tools/llms-txt-generator/dist ./deploy/tools/llms-txt-generator/dist
COPY --from=builder /app/deploy/tools/essential-dapps-chains-config-generator/dist ./deploy/tools/essential-dapps-chains-config-generator/dist

# Copy scripts
## Entrypoint
COPY --chmod=755 ./deploy/scripts/entrypoint.sh .
## ENV validator and client script maker
COPY --chmod=755 ./deploy/scripts/validate_envs.sh .
COPY --chmod=755 ./deploy/scripts/make_envs_script.sh .
## Assets downloader
COPY --chmod=755 ./deploy/scripts/download_assets.sh .
## OG image generator
COPY ./deploy/scripts/og_image_generator.js .
## Pro API support flag
COPY --chmod=755 ./deploy/scripts/export_pro_api_flag.sh .
## Favicon generator
COPY --chmod=755 ./deploy/scripts/favicon_generator.sh .
COPY --from=builder /app/favicon-generator-bundle ./deploy/tools/favicon-generator
RUN chown -R nextjs:nodejs ./deploy/tools/favicon-generator && chmod -R u=rwX,go=rX ./deploy/tools/favicon-generator
RUN chown -R nextjs:nodejs ./public && chmod -R u=rwX,go=rX ./public
## Sitemap generator
COPY --chmod=755 ./deploy/scripts/sitemap_generator.sh .
COPY --from=builder /app/sitemap-generator-bundle ./deploy/tools/sitemap-generator

# Copy ENVs files
COPY --from=builder /app/.env.registry .
COPY --from=builder /app/.env .

# Dev-server env fetcher (compiled script + registry/rules data + committed overrides).
# The image is preset-agnostic: ENVS_PRESET is supplied at runtime (k8s env), and at startup
# the entrypoint runs fetch.js to pull that instance's public config over HTTP.
COPY --from=builder /app/tools/dev-server/fetch.js ./tools/dev-server/fetch.js
COPY ./tools/dev-server/registry.json ./tools/dev-server/registry.json
COPY ./tools/dev-server/envs-rules.json ./tools/dev-server/envs-rules.json
COPY ./.env.extra ./.env.extra

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

ENTRYPOINT ["./entrypoint.sh"]

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
