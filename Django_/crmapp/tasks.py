from celery import Celery

app = Celery('vfp_web_server', broker='redis://redis_vfp:6379/0')


@app.task
def add(x, y):
    return x + y
