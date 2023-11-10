FROM nginx:1.12-alpine
LABEL maintainer="GauravSharma"
LABEL imagetype="RemoteTeamFrontend"
COPY  ./build /usr/share/nginx/html
COPY ./nginx/nginx.conf /etc/nginx/nginx.conf
EXPOSE 80 443
