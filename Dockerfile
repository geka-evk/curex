ARG NODE_VERSION="18.17-alpine"
ARG WORK_DIR="/curex-app"

FROM node:${NODE_VERSION} as dev
ARG NODE_VERSION
ARG WORK_DIR
WORKDIR ${WORK_DIR}

COPY package*.json ./
RUN npm ci
COPY . .

FROM dev as build
ENV NODE_ENV production

RUN npm run build
RUN npm ci --only=production && npm cache clean --force

FROM node:${NODE_VERSION} as prod
ARG WORK_DIR
USER node

COPY --from=build ${WORK_DIR}/node_modules ./node_modules
COPY --from=build ${WORK_DIR}/dist ./dist
COPY --from=build ${WORK_DIR}/imports ./imports

CMD [ "node", "./dist/main.js" ]
