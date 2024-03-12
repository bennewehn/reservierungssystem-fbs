# Use the official Node.js image from Docker Hub
FROM node:latest AS build

# Set the working directory
WORKDIR /app

COPY . .
RUN yarn install

RUN yarn run build

FROM nginx:alpine

# Nginx config
RUN rm -rf /etc/nginx/conf.d
COPY conf /etc/nginx

COPY --from=build /app/build /usr/share/nginx/html

# Expose the port
EXPOSE 80

# Copy .env file and shell script to container
WORKDIR /usr/share/nginx/html
COPY ./env.sh .
COPY .env .

# Add bash
RUN apk add --no-cache bash

# Make our shell script executable
RUN chmod +x env.sh

# Start Nginx server
CMD ["/bin/bash", "-c", "/usr/share/nginx/html/env.sh && nginx -g \"daemon off;\""]