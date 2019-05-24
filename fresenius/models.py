from django.db import models
from django.contrib.auth.models import User


# class UserProfile(model.Model):
#     user = models.OneToOneField(User)
#     date_of_birth = models.DateField()
#     parameters = models.CharField()
#     height = models.FloatField()
#     weight = models.FloatField()
#     type_of_treatment = models.CharField()


# def create_profile(sender, **kwargs):
#     if kwargs['created']:
#         user_profile = UserProfile.objects.create(user=kwargs['instance'])


# post_save.connect(create_profile, sender=User)