# ---------- build stage ----------
FROM node:20-alpine AS build
WORKDIR /app

ARG BUILD_PROFILE=dev

COPY package*.json ./
RUN npm ci

COPY . .

RUN if [ "$BUILD_PROFILE" = "prod" ]; then \
      npm run build:prod ; \
    elif [ "$BUILD_PROFILE" = "docker" ]; then \
      npm run build:prod ; \
    else \
      npm run build:dev ; \
    fi

# ---------- run stage ----------
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
