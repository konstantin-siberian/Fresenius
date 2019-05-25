from django.views.generic.base import View
from django.shortcuts import render
from django.contrib.auth.mixins import LoginRequiredMixin
from django.http import HttpResponse
from django.conf import settings
from django.contrib.auth.views import LoginView
from .forms import MyAuthenticationForm 


class IndexView(LoginRequiredMixin, View):
    template_name = 'main.html'

    def get(self, request):
        return render(request, self.template_name)


class LoginFromFrontendView(View):
    template_name = 'login.html'

    def get(self, request):
        return render(request, self.template_name)


class MyLoginView(LoginView):
    form_class = MyAuthenticationForm