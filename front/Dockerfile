# ============================================================
# Stage 1 : Build Angular
# ============================================================

FROM node:20-alpine AS builder

WORKDIR /app

# Copie des fichiers de dépendances
COPY package*.json ./

# Installation des dépendances
RUN npm ci

# Copie du reste du projet
COPY . .

# Build de production
RUN npm run build

# ============================================================
# Stage 2 : Serveur Web Nginx
# ============================================================

FROM nginx:1.27-alpine

# Suppression du site par défaut
RUN rm -rf /usr/share/nginx/html/*

# Copie des fichiers Angular compilés
COPY --from=builder /app/dist/microcrm/browser /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
