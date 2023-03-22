FROM node:18-alpine AS builder

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build

FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app/dist /app/cloudinary.config.js /app/encacap.config.js ./

RUN yarn install --frozen-lockfile --production

EXPOSE 3002

CMD ["yarn", "start"]
