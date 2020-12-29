FROM python:3.7

ENV PYTHONUNBUFFERED 1
RUN mkdir /my_app_dir
WORKDIR /my_app_dir
ADD requirements_django.txt /my_app_dir/
RUN pip install --upgrade pip && pip install setuptools==45.2.0.post20200210 && pip install -r requirements_django.txt
RUN apt-get update && apt-get install -y clustalo
RUN pip install gunicorn
# Update the default application repository sources list
RUN apt-get update && apt-get install -y \
    python-dev \
    python-pip \
    python-setuptools \
    build-essential \
    git

# Set variables for project name, and where to place files in container.
ENV PROJECT=vfp_web_werver

RUN mkdir logs

ADD . /my_app_dir/

COPY ./entrypoint.sh /

EXPOSE 8000

# ENTRYPOINT ["python","manage.py","runserver"]

# ENTRYPOINT ["/entrypoint.sh"]

# define the default command to run when starting the container
CMD ["gunicorn", "--bind", ":8000", "vfp_web_server.wsgi:_application"]
