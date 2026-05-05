FROM node:20 as build

WORKDIR /app

# copy dependency
COPY package*.json ./

# clean install to matching with platform
RUN npm ci

# copy source
COPY . .

# build
RUN npm run build
#RUN npm run build -- --configuration production

# -------- NGINX --------
FROM nginx:alpine

COPY --from=build /app/dist/TaskTrackerFrontend/browser/ /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80