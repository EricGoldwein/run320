from main import app
from asgiref.wsgi import WsgiToAsgi

# This is the WSGI entry point PythonAnywhere will use
application = WsgiToAsgi(app) 