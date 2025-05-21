title: "cert_on_frontend"
This example assumes deployment on an Amazon Linux 2 AMI.

1. Install NGINX and other required packages:

   ```yml
   sudo amazon-linux-extras install nginx1.12
   sudo wget -r --no-parent -A 'epel-release-*.rpm' https://dl.fedoraproject.org/pub/epel/7/x86_64/Packages/e/
   sudo rpm -Uvh dl.fedoraproject.org/pub/epel/7/x86_64/Packages/e/epel-release-*.rpm
   sudo yum-config-manager --enable epel*
   sudo yum repolist all
   sudo amazon-linux-extras install epel -y
   ```

2. Generate a [private certificate and key](https://www.digitalocean.com/community/tutorials/openssl-essentials-working-with-ssl-certificates-private-keys-and-csrs).

3. Create a `ssl.conf` file.

   ```ini

   server {
       server_name your.server.name; # replace with your server name
       root        /usr/share/nginx/html;

       location / {
       proxy_set_header          Host $host;
       proxy_set_header          X-Forwarded-For $proxy_add_x_forwarded_for;
       proxy_set_header          X-Real-IP $remote_addr;
       proxy_set_header          X-Forwarded-Proto $scheme;

       proxy_set_header          Authorization $http_authorization;
       proxy_pass_header         Authorization;

       proxy_pass                http://frontend/;
       proxy_read_timeout        90;
       proxy_redirect            http://frontend/ https://your.redirect.url/;
       }

           error_page 404 /404.html;
               location = /40x.html {
           }

           error_page 500 502 503 504 /50x.html;
               location = /50x.html {
           }
           listen [::]:443 ssl ipv6only=on;
           listen 443 ssl;

           ssl_certificate /etc/ssl/testcrt.crt;
           ssl_certificate_key /etc/ssl/testkey.key;
   }

   ```

4. Make a local copy of the `frontend` container's `/etc/nginx/nginx.conf` file.

5. Add the following to the `server` block of your local `nginx.conf` file:

   ```ini
   include /etc/nginx/ssl.conf;
   ```

6. Modify the `frontend` container definition in your `docker-compose.yml` file:

   ```yml
   frontend:
   image: cr.seqera.io/frontend:${TAG}
   networks:
     - frontend
   ports:
     - 8000:80
     - 443:443
   volumes:
     - $PWD/nginx.conf:/etc/nginx/nginx.conf
     - $PWD/ssl.conf:/etc/nginx/ssl.conf
     - $PWD/cert/testcrt.crt:/etc/ssl/testcrt.crt
     - $PWD/cert/testkey.key:/etc/ssl/testkey.key
   restart: always
   depends_on:
     - backend
   ```
