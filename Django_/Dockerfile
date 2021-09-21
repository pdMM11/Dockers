FROM python:3.7

ENV PYTHONUNBUFFERED 1
ENV PYTHONIOENCODING=UTF-8
RUN mkdir /my_app_dir
WORKDIR /my_app_dir
ADD requirements_django.txt /my_app_dir/
RUN pip install --upgrade pip && pip install setuptools==45.2.0 && pip install -r requirements_django.txt
RUN apt-get update && apt-get install -y clustalo
RUN pip install gunicorn
# Update the default application repository sources list
RUN apt-get update && apt-get install -y \
    python-dev \
    # python-pip \
    python-setuptools \
    build-essential \
    git \
    supervisor

# Set variables for project name, and where to place files in container.
ENV PROJECT=vfp_web_werver

RUN mkdir logs

ADD . /my_app_dir/

COPY ./entrypoint.sh /

EXPOSE 8000

# Define Supervisor to later run additional processes: Celery and Flower
RUN mkdir -p /var/log/supervisor

RUN mkdir -p /var/run/celery /var/run/beat /var/run/flower /var/log/gunicorn /var/log/supervisor

COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# ENTRYPOINT ["python","manage.py","runserver"]

# ENTRYPOINT ["/entrypoint.sh"]

# run gunicorn (the Django App) plus celery & celery
CMD ["/usr/bin/supervisord"]

# define the default command to run when starting the container
# CMD ["gunicorn", "--bind", ":8000", "vfp_web_server.wsgi:_application"]

# run celery
# CMD ["celery", "-A", "vfp_web_server", "worker", "-l", "info"]



