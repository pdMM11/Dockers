from celery import Celery

app = Celery('vfp_web_server', broker='pyamqp://guest@localhost//')

@app.task
def add(x, y):
    return x + y
