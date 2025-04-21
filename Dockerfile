# ------------------------
# Build Stage
# ------------------------
    FROM node:18-slim AS build

    WORKDIR /app
    
    # Copy package files and install dependencies
    COPY package*.json ./
    RUN npm ci --omit=dev
    
    # Copy source files and build the app
    COPY . .
    RUN npm run build
    
    # ------------------------
    # Production Stage
    # ------------------------
    FROM nginx:1.23.4-alpine
    
    # Set working directory (optional clarity)
    WORKDIR /usr/share/nginx/html
    
    # Remove default nginx static files
    RUN rm -rf ./*
    
    # Copy build output
    COPY --from=build /app/dist/skill-match-ai .
    
    # Copy custom nginx config to enable Angular routing
    COPY nginx.conf /etc/nginx/conf.d/default.conf
    
    # Expose HTTP port
    EXPOSE 80
    
    # Start Nginx
    CMD ["nginx", "-g", "daemon off;"]
    