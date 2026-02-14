FROM mcr.microsoft.com/playwright:v1.40.0-jammy

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

CMD ["sh", "-c", "npm test; echo 'Standalone report file: /app/playwright-report/index.html'"]
