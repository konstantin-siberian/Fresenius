from django.core.management import setup_environ
from Fresenius.mysite import settings, views

setup_environ(settings)


#settings.configure()
'''
https://stackoverflow.com/questions/18081369/error-when-using-django-template


'''

views.index('')