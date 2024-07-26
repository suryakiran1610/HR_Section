from django.contrib import admin
from .models import Employee
from .models import LeaveRequest
from .models import Notification

admin.site.register(Employee)
admin.site.register(LeaveRequest)
admin.site.register(Notification)

