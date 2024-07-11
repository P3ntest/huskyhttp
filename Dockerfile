FROM oven/bun:latest

WORKDIR /app

COPY . .
RUN bun install
RUN bun run compile.bun.ts

CMD ["bun", "server.ts"]