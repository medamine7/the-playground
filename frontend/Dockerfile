FROM node:18-alpine as builder

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build

FROM node:18-alpine as production

WORKDIR /app

COPY --from=builder /app/dist ./dist

RUN yarn global add serve

CMD ["serve", "-p", "3000", "-d", "dist", "-s"]