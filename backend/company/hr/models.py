from django.db import models
from django.contrib.auth.models import AbstractUser

class user(AbstractUser):
    email = models.EmailField(unique=True,null=True,blank=True)
    username = models.CharField(unique=True,max_length=30,null=True,blank=True)
    user_type=models.CharField(max_length=30,null=True,blank=True)

class login(models.Model):
    id=models.IntegerField(primary_key=True)
    email = models.CharField(unique=True,max_length=225,null=True,blank=True)
    first_name = models.CharField(max_length=225,null=True,blank=True)
    last_name = models.CharField(max_length=225,null=True,blank=True)
    is_active = models.BooleanField(null=True,blank=True)
    is_staff = models.BooleanField(null=True,blank=True)
    date_joined= models.DateTimeField(null=True,blank=True)
    status = models.CharField(max_length=225,null=True,blank=True)
    username = models.CharField(max_length=255,null=True,blank=True)
    password = models.CharField(max_length=255,null=True,blank=True)

class Employee(models.Model):
    employeeid=models.CharField(unique=True,max_length=255,null=True,blank=True)
    name = models.CharField(max_length=225,null=True,blank=True)
    username = models.CharField(max_length=255,null=True,blank=True)
    password = models.CharField(max_length=255,null=True,blank=True)
    status=models.CharField(max_length=255,null=True,blank=True)
    register_date = models.DateTimeField(auto_now_add=True)
    email = models.EmailField(max_length=225,null=True,blank=True)
    phone = models.CharField(max_length=15,null=True,blank=True)
    address = models.CharField(max_length=225,null=True,blank=True)
    position = models.CharField(max_length=50,null=True,blank=True)
    department = models.CharField(max_length=50,null=True,blank=True)
    login_id= models.ForeignKey(login, on_delete=models.CASCADE, blank=True, null=True)
    profileimage = models.ImageField(upload_to='employee_profile/',default='defaultprofileimage.png',null=True,blank=True)

class LeaveRequest(models.Model):
    employeeid= models.ForeignKey(Employee, on_delete=models.CASCADE, blank=True, null=True)
    requested_date=models.DateField(auto_now_add=True,null=True,blank=True)
    leavetype = models.CharField(max_length=255,null=True,blank=True)
    startdate = models.DateField(null=True,blank=True)
    enddate = models.DateField(null=True,blank=True)
    reason = models.CharField(max_length=2000,null=True,blank=True)
    status = models.CharField(max_length=50,default='pending',null=True,blank=True)
    rejectionreason = models.CharField(max_length=2000,null=True,blank=True)

class Notification(models.Model):
    employeeid= models.ForeignKey(Employee, on_delete=models.CASCADE, blank=True, null=True)
    notificationtype=models.CharField(max_length=255,null=True,blank=True)
    message=models.CharField(max_length=255,null=True,blank=True)
    date=models.DateField(auto_now_add=True)
    is_read = models.BooleanField(default=False,null=True,blank=True)

class Task(models.Model):
    task_id=models.CharField(max_length=255,null=True,blank=True)
    task_name=models.CharField(max_length=255,null=True,blank=True)
    task_description=models.TextField(max_length=255,null=True,blank=True)
    task_created_on=models.DateField(auto_now_add=True,null=True,blank=True)
    employeeid= models.ForeignKey(Employee, on_delete=models.CASCADE, blank=True, null=True)


class Task_Assign(models.Model):
    task_id=models.ForeignKey(Task,on_delete=models.CASCADE, blank=True, null=True)
    employeeid= models.ForeignKey(Employee, on_delete=models.CASCADE, blank=True, null=True)
    task_priority=models.CharField(max_length=255,null=True,blank=True)
    task_assign_date=models.DateField(auto_now_add=True,null=True,blank=True)
    task_status=models.CharField(max_length=255,null=True,blank=True)
    task_description=models.TextField(max_length=255,null=True,blank=True)



