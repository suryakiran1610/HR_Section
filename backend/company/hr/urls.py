from django.urls import path
from . import views

urlpatterns = [
    path('createemployee/',views.CreateEmployee.as_view(),name="createemployee"),
    path('employeeprofile/',views.EmployeeProfile.as_view(),name="employeeprofile"),
    path('passwordchange/',views.PasswordChange.as_view(),name="passwordchange"),
    path('leaverequest/',views.LeaveRequests.as_view(),name="leaverequest"),
    path('approveleave/',views.ApproveLeave.as_view(),name="approveleave"),
    path('rejectleave/',views.RejectLeave.as_view(),name="rejectleave"),
    path('employeeleavedetails/',views.EmployeeLeaveDetails.as_view(),name="employeeleavedetails"),
    path('leave_details/',views.Leave_Details.as_view(),name="leave_details"),
    path('getallnotification/',views.GetallNotification.as_view(),name="getallnotification"),
    path('deletenotification/',views.DeleteNotification.as_view(),name="deletenotification"),
    path('notificationn_readed/',views.Notificationn_Readed.as_view(),name="notificationn_readed"),
    path('leaverequest_for_chart/',views.Leaverequest_for_chart.as_view(),name="leaverequest_for_chart"),
    path('dashboard_data/',views.Dashboard_Data.as_view(),name="dashboard_data"),


]