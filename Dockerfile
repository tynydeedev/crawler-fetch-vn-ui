FROM node:16-slim AS base
WORKDIR /app
COPY package.json .
COPY package-lock.json .
RUN npm ci

FROM base AS source
EXPOSE 8080
COPY . .

FROM source AS dev
CMD [ "npm", "run", "dev" ]

FROM source AS build
RUN npm run build

FROM build AS deploy
CMD [ "npx", "vite", "dist", "--config", "vite.config.ts"]