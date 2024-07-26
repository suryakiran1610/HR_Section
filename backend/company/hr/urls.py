from django.urls import path
from . import views

urlpatterns = [
    path('createemployee/',views.CreateEmployee.as_view(),name="createemployee"),
    path('employeeprofile/',views.EmployeeProfile.as_view(),name="employeeprofile"),
    path('passwordchange/',views.PasswordChange.as_view(),name="passwordchange"),

]