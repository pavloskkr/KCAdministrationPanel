# Use the official Node.js image as the base image
FROM node:14 as builder

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Angular app
RUN npm run build -- --prod

# Use a lightweight Nginx image for serving the Angular app
FROM nginx:alpine

# Copy the built app from the previous stage to the Nginx image
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 3001
EXPOSE 3001

# Command to run the Nginx server
CMD ["nginx", "-g", "daemon off;"]
