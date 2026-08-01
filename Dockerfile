FROM node:22-bookworm-slim
WORKDIR /app
COPY . .
RUN npm run check
RUN mkdir -p /app/data /app/.orchestrator/worktrees
EXPOSE 4317
CMD ["node", "src/cli.js", "serve"]
