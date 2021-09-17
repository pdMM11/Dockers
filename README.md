In order to run the aplication locally, one must use the command docker pull for each of the three images, create a network, and run the three containers, with the caveat that both MySQL and Django must be in the same network and for each container must define the port (where the MySQL one is expected to be 3307:3306, the Django one 8000:8000 and the Angular one 4201:4200). Finally, the MySQL one must be called “django\_\_db\_1”, in order to match the settings of the Django container. All the commands used are listed bellow.

The files regarding the settings of the Django app are inserted into /my-app-dir/vfp_webserver/settings.py within the container itself (Django_/vfp_webserver/settings.py within the Github repository).

All the Angular files are inserted within the directory "app" of its container. In order to define the URL for the API, one must update the file Angular_\ngx-admin\src\env.js.

----------------

Commands used to successufully build the application:

  sudo docker pull pedrodmmoreira/vfp_webserver:mysql-httpd-build

  sudo docker pull pedrodmmoreira/vfp_webserver:django-httpd-build

  sudo docker pull pedrodmmoreira/vfp_webserver:angular-httpd-build

  sudo docker network create VFP_NETWORK  

  sudo docker run --rm --name django__db_1 --network VFP_NETWORK -p 3307:3306 pedrodmmoreira/vfp_webserver:mysql-httpd-build 

  sudo docker run --rm  --name django__web_1 --network VFP_NETWORK -p 8000:8000 pedrodmmoreira/vfp_webserver:django-httpd-build 

  sudo docker run --rm --name angular_vfp -p 4201:4200 pedrodmmoreira/vfp_webserver:angular-httpd-build

  sudo docker run -it --name redis_vfp --network VFP_NETWORK --rm redis redis-server
  
