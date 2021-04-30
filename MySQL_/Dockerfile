FROM mysql:latest
ENV MYSQL_ROOT_PASSWORD admin
ENV MYSQL_DATABASE viral_fusion_protein
ENV MYSQL_USER root_docker
ENV MYSQL_PASSWORD admin
# ADD Dumps/Dump20200722.sql docker-entrypoint-initdb.d
# ADD Dumps/Dump20210213.sql docker-entrypoint-initdb.d
ADD Dumps/Dump20210430.sql docker-entrypoint-initdb.d

EXPOSE 3306

CMD ["mysqld", "--default-authentication-plugin", "mysql_native_password"]
# ENTRYPOINT ['/entrypoint.sh', '--default-authentication-plugin=mysql_native_password']