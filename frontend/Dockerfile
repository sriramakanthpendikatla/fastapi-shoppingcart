# ---- Build stage ----
FROM node:18-alpine AS build

WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --silent

COPY public/ public/
COPY src/ src/

# Point API at the backend service (override at build time if needed)
ARG REACT_APP_API_URL=http://localhost:8000
ENV REACT_APP_API_URL=$REACT_APP_API_URL

RUN npm run build

# ---- Serve stage ----
FROM nginx:alpine

COPY --from=build /app/build /usr/share/nginx/html

# Nginx config to handle React Router & proxy /api to backend
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
