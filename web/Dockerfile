# Use the official Node.js image from Docker Hub
FROM node:latest AS build

# Set the working directory
WORKDIR /app

COPY . .
RUN npm install

RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html

# Expose the port
EXPOSE 80

# Default command to start NGINX
CMD ["nginx", "-g", "daemon off;"]