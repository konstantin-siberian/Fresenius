from django.urls import path
from . import views
from django.contrib.auth.views import (LoginView, LogoutView)

urlpatterns = [
    path('', views.IndexView.as_view()),
    path('login/', LoginView.as_view(redirect_authenticated_user=True), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('lo/', views.LoginFromFrontendView.as_view(), name='lo'), 
]



