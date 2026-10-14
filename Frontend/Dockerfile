# ---- stage 1: build the site ----
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci --no-audit --no-fund
COPY . .
# Empty = the browser calls /api on the same address (nginx forwards it to the backend)
ENV VITE_API_URL=""
RUN npm run build

# ---- stage 2: serve the built files with nginx ----
FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
