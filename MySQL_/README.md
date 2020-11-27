Commands used to successufully build the application:

  sudo docker pull pedrodmmoreira/vfp_webserver:mysql-httpd-build

  sudo docker network create VFP_NETWORK  

  sudo docker run --rm --name django__db_1 --network VFP_NETWORK -p 3307:3306 pedrodmmoreira/vfp_webserver:mysql-httpd-build

  
