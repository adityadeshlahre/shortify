FROM oven/bun:latest AS builder
WORKDIR /app
COPY ../../package.json ../../bun.lock ../../bunfig.toml ./
COPY ../../packages/types ./packages/types
COPY . .
RUN bun install
RUN cd apps/server && bun run build

FROM oven/bun:latest
WORKDIR /app
COPY --from=builder /app/apps/server/dist ./dist
COPY --from=builder /app/apps/server/package.json ./
RUN sed -i '/"@shortify\/types": "workspace:\*"/d' package.json
RUN bun install --production
CMD ["bun", "run", "start"]