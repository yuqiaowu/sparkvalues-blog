ARG NODE_VERSION=22.16.0
FROM node:${NODE_VERSION}-slim AS builder
WORKDIR /usr/src/app
COPY package.json .
COPY package-lock.json* .
RUN npm ci

FROM node:${NODE_VERSION}-slim
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/ /usr/src/app/
COPY . .
CMD ["npx", "quartz", "build", "--serve"]
