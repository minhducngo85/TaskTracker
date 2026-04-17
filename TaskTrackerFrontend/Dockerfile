FROM node:20 as build

WORKDIR /app

# 🔥 chỉ copy dependency
COPY package*.json ./

# 🔥 dùng ci để clean install đúng platform
RUN npm ci

# copy source
COPY . .

# build
RUN npm run build

# -------- NGINX --------
FROM nginx:alpine

COPY --from=build /app/dist/TaskTrackerFrontend/browser/ /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf