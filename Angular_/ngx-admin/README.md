All the Angular files are inserted within the directory "app" of its container. In order to define the URL for the API, one must update the file Angular_\ngx-admin\src\env.js.

----------------

Commands used to successufully build the application:

  sudo docker pull pedrodmmoreira/vfp_webserver:angular-httpd-build

  sudo docker run --rm --name angular_vfp -p 4201:4200 pedrodmmoreira/vfp_webserver:angular-httpd-build 
  
