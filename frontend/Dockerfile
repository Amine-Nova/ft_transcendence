FROM nginx:alpine

RUN apk add --no-cache openssl

RUN cd /etc/nginx && openssl genpkey -algorithm RSA -out abenmous.key

RUN cd /etc/nginx && openssl req -x509 -new -key abenmous.key -sha256 -days 365 -out abenmous.crt -subj "/C=MA/ST=Morocco/L=Tetouan/O=My Company/OU=IT/CN=www.aa.com/emailAddress=abenmous@example.com"

<<<<<<< HEAD
COPY nginx.conf /etc/nginx/conf.d/nginx.conf
=======
COPY nginx.conf /etc/nginx/nginx.conf
>>>>>>> 2d6c35f93f9e4eff9bc0180bb369d01ae5d2bfcd

COPY . /usr/share/nginx/html

EXPOSE 443

CMD ["nginx", "-g", "daemon off;"]