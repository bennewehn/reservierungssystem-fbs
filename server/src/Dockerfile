# Use the official Node.js image as base
FROM node:21-alpine3.19

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose port
EXPOSE 3001

# Start the Express server
CMD ["npm", "start"]