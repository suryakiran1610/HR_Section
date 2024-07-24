from django.db import models
from django.contrib.auth.models import AbstractUser

class user(AbstractUser):
    email = models.EmailField(unique=True,null=True,blank=True)
    username = models.CharField(unique=True,max_length=30,null=True,blank=True)
    user_type=models.CharField(max_length=30,null=True,blank=True)

