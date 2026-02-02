# Playwright official image includes all browser deps
FROM mcr.microsoft.com/playwright:v1.58.1-jammy

WORKDIR /app
ENV HEADLESS=true

# Copy only package files first for better layer caching
COPY package*.json tsconfig.json ./


# Install dependencies
RUN npm ci

# Copy the rest of the project
COPY . .

# (Optional) Ensure Playwright browsers are installed (usually already present in the image)
RUN npx playwright install --with-deps

# Default command: run tests
CMD ["npm", "run", "test"]
