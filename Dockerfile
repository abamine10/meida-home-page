FROM node:22-alpine AS build
WORKDIR /src
COPY build.mjs ./
COPY i18n/ i18n/
COPY public/ public/
RUN node build.mjs

FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /src/dist/ /usr/share/nginx/html/
