# Use the official MySQL image as the base image
FROM mysql:latest

# Set the root password for MySQL
ENV MYSQL_ROOT_PASSWORD=test123

# Create a database
ENV MYSQL_DATABASE=reservation

ADD /db/schema.sql /docker-entrypoint-initdb.d

# Expose the default MySQL port
EXPOSE 3306