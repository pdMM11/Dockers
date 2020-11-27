The files regarding the settings of the Django app are inserted into /my-app-dir/vfp_webserver/settings.py within the container itself (Django_/vfp_webserver/settings.py within the Github repository).

----------------

Commands used to successufully build the application:

  sudo docker pull pedrodmmoreira/vfp_webserver:django-httpd-build

  sudo docker network create VFP_NETWORK  

  sudo docker run --rm  --name django__web_1 --network VFP_NETWORK -p 8000:8000 pedrodmmoreira/vfp_webserver:django-httpd-build 
  
