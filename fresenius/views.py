from django.views.generic.base import View
from django.shortcuts import render
from django.contrib.auth.mixins import LoginRequiredMixin


class IndexView(View):
    template_name = 'fresenius/Christoph_routing.html'

    def get(self, request):
        return render(request, self.template_name)