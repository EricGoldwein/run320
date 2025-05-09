from main import application
from uvicorn.middleware.wsgi import WSGIMiddleware

# This is the WSGI entry point PythonAnywhere will use
app = application

# Create WSGI application
application = WSGIMiddleware(app) 