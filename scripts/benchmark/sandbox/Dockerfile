FROM node:22-bookworm-slim
RUN apt-get update && apt-get install -y --no-install-recommends chromium ca-certificates fonts-liberation && rm -rf /var/lib/apt/lists/*
WORKDIR /opt/benchmark
COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts && npm rebuild esbuild
COPY scripts/benchmark/sandbox/ ./
COPY src/benchmark/protocol.json ./protocol.json
RUN mkdir -p /work /out && chown -R node:node /work /out /opt/benchmark
USER node
ENTRYPOINT ["node", "/opt/benchmark/render.mjs"]
