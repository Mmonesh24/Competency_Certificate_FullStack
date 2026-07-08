FROM node:20 AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine
# Copy compiled static site output to Nginx directory. Supports both browser subdirectory and direct outputs.
COPY --from=build /app/dist/login-angular/browser /usr/share/nginx/html/
# Fallback if no browser folder exists
COPY --from=build /app/dist/login-angular /usr/share/nginx/html/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
