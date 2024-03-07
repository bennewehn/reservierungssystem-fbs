# Use the official MySQL image as the base image
FROM mysql:latest

# Set environment variables for MySQL
ENV MYSQL_DATABASE=reservation

# Copy initialization SQL scripts to the /docker-entrypoint-initdb.d directory
COPY ./schema.sql /docker-entrypoint-initdb.d/