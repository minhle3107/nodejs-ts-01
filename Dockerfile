# Use the official Node.js image as the base image
FROM node:20

# Set the working directory
WORKDIR /var/www/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --force

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Expose the port the app runs on
EXPOSE 3030

# Start the application
CMD ["npm", "run", "start:prod"]

# docker-compose run --rm certbot certonly --webroot --webroot-path=/var/www/certbot -d api.minhle3107.site