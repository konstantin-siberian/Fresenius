from django.http import HttpResponse
from django.template import Context, loader
import os

def index(request):
    cwd=os.getcwd()
    os.chdir('..')

    template = loader.get_template("frontend/Christoph_routing.html")
    os.chdir(cwd)
    return HttpResponse(template.render())


