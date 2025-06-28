# Dockerfile for building and serving both frontend and backend on Cloud Run

# ---- Build frontend ----
FROM node:22-slim AS frontend-build
WORKDIR /app/metabase-ui
COPY metabase-ui/package.json metabase-ui/yarn.lock ./
RUN apt-get update && apt-get install -y python3 make g++ && yarn install --frozen-lockfile
COPY metabase-ui/ ./
RUN yarn build

# ---- Build backend ----
FROM node:22-slim AS backend-build
WORKDIR /app/hybrid-bi-nodejs-server
COPY hybrid-bi-nodejs-server/package.json hybrid-bi-nodejs-server/yarn.lock ./
RUN yarn install --frozen-lockfile
COPY hybrid-bi-nodejs-server/ ./
RUN yarn build || true  # If you have a build step, otherwise remove this line

# ---- Final image ----
FROM node:22-slim
WORKDIR /app

# Copy backend
COPY --from=backend-build /app/hybrid-bi-nodejs-server ./hybrid-bi-nodejs-server
# Copy frontend build
COPY --from=frontend-build /app/metabase-ui/build ./metabase-ui/build

# Install production dependencies for backend
WORKDIR /app/hybrid-bi-nodejs-server
RUN yarn install --production --frozen-lockfile

# Expose port
ENV PORT=3000
EXPOSE 3000

# Start the server
CMD ["node", "dist/server.js"]
