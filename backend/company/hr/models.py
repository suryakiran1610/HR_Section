from django.db import models
from django.contrib.auth.models import AbstractUser

class user(AbstractUser):
    email = models.EmailField(unique=True,null=True,blank=True)
    username = models.CharField(unique=True,max_length=30,null=True,blank=True)
    user_type=models.CharField(max_length=30,null=True,blank=True)

class Employee(models.Model):
    name = models.CharField(max_length=225,null=True,blank=True)
    username = models.CharField(max_length=255,null=True,blank=True)
    password = models.CharField(max_length=255,null=True,blank=True)
    register_date = models.DateTimeField(auto_now_add=True)
    email = models.EmailField(max_length=225,null=True,blank=True)
    phone = models.CharField(max_length=15,null=True,blank=True)
    address = models.CharField(max_length=225,null=True,blank=True)
    position = models.CharField(max_length=50,null=True,blank=True)
    profileimage = models.ImageField(upload_to='employee_profile/',default='defaultprofileimage.png',null=True,blank=True)

class LeaveRequest(models.Model):
    employeeid=models.IntegerField(null=True,blank=True)
    leavetype = models.CharField(max_length=255,null=True,blank=True)
    startdate = models.DateField(null=True,blank=True)
    enddate = models.DateField(null=True,blank=True)
    reason = models.CharField(max_length=255,null=True,blank=True)
    status = models.CharField(max_length=50,default='pending',null=True,blank=True)
    rejectionreason = models.CharField(max_length=255,null=True,blank=True)

class Notification(models.Model):
    employeeid=models.IntegerField(null=True,blank=True)
    notificationtype=models.CharField(max_length=255,null=True,blank=True)
    message=models.CharField(max_length=255,null=True,blank=True)
    date=models.DateField(auto_now_add=True)
