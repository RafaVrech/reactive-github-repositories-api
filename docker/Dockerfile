FROM node:12-alpine as dist
WORKDIR /tmp/
COPY package*.json ./
RUN npm install
COPY ./ ./
RUN npm run build

FROM node:12-alpine as node_modules
WORKDIR /tmp/
COPY package.json package-lock.json ./
RUN npm install --production

FROM node:12-alpine
WORKDIR /usr/app
COPY --from=node_modules /tmp/node_modules ./node_modules
COPY --from=dist /tmp/dist ./dist
EXPOSE 8080
COPY docker/entrypoint.sh /usr/app/
ENV NODE_ENV=production
RUN chmod +x entrypoint.sh
ENTRYPOINT [ "node", "dist/main.js" ]
