FROM node:24.20.0-trixie-slim

RUN apt-get update && apt-get install -y \
    chromium \
    fonts-liberation \
    fonts-noto-color-emoji \
    fonts-freefont-ttf \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

ENV PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1
ENV PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN chmod +x bin/renderfolio.js

RUN useradd -m -u 1001 renderuser \
    && chown -R renderuser:renderuser /app
USER renderuser

ENTRYPOINT ["node", "/app/bin/renderfolio.js"]
CMD ["--help"]