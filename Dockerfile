# Étape 1 : vérifier et construire le mini-site
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts
COPY . .
RUN npm run lint && npm test && npm run build

# Étape 2 : servir uniquement les fichiers construits avec Nginx
FROM nginx:1.27-alpine
COPY --from=build /app/dist/ /usr/share/nginx/html/
EXPOSE 80
