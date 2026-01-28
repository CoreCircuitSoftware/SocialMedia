FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy project files
COPY . .

# Expose Vite dev server port
EXPOSE 5173

# Start development server
# Note: --host flag allows access from outside the container
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
