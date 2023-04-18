# Install dependencies only when needed
FROM node:18.12.1-alpine AS transmit-samples
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
RUN corepack enable
COPY . .
RUN mv package.json package.json.bak
RUN cat package.json.bak | grep -v husky > package.json
RUN yarn

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 sample
RUN chown sample:nodejs ./ -R


USER sample

EXPOSE 8080

CMD ["yarn", "start"]