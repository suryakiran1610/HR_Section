from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from rest_framework import status
from django.contrib.auth.hashers import check_password, make_password
from rest_framework.views import APIView
from .serializers import EmployeeSerializer
from .serializers import NotificationSerializer
from .serializers import LeaveRequestSerializer
from .models import Employee
from .models import LeaveRequest
from .models import Notification
from django.db.models import Count, Q
from datetime import date


class CreateEmployee(APIView):
    def post(self, request):
        serializer = EmployeeSerializer(data=request.data)
        print(request.data)

        if serializer.is_valid():
            user = serializer.save()
            response_serializer = EmployeeSerializer(user)
            return Response(response_serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def get(self,request):
        employee=Employee.objects.all()
        serializer=EmployeeSerializer(employee,many=True)
        return Response(serializer.data)
    
class EmployeeProfile(APIView):

    def get(self, request):
        user_id = int(request.query_params.get('user_id'))
        print("Logged-in user's id:", user_id)
        try:
            employee = Employee.objects.get(id=user_id)
            serializer = EmployeeSerializer(employee)
            data = serializer.data
            return Response(data)
        except Employee.DoesNotExist:
            return Response({"error": "Employee not found"}, status=status.HTTP_404_NOT_FOUND)  

    def put(self, request):
        user_id = request.query_params.get('user_id')
        if not user_id:
            return Response({'error': 'user_id is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        user_id = int(user_id)
        editprofile = get_object_or_404(Employee, id=user_id)

        data = request.data.copy()

        if 'password' in data:
            data['password'] = make_password(data['password'])
        
        serializer = EmployeeSerializer(editprofile, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    


class PasswordChange(APIView):

    def put(self, request):
        print(request.data)
        userid = int(request.query_params.get('userid'))
        
        try:
            usr = Employee.objects.get(id=userid)
        except Employee.DoesNotExist:
            return Response({'error': 'Employee not found'}, status=status.HTTP_404_NOT_FOUND)
        
        old_password = request.data.get('oldpassword')
        new_password = request.data.get('newpassword')
        confirm_password = request.data.get('confirmpassword')

        if not check_password(old_password, usr.password):
            return Response({'error': 'Old password is incorrect'}, status=status.HTTP_400_BAD_REQUEST)

        if new_password != confirm_password:
            return Response({'error': 'New password and confirm password do not match'}, status=status.HTTP_400_BAD_REQUEST)

        usr.password = make_password(new_password)
        usr.save()
        return Response({'message': 'Password updated successfully'}, status=status.HTTP_200_OK)


class LeaveRequests(APIView):
    def post(self, request):
        serializer = LeaveRequestSerializer(data=request.data)
        print(request.data)

        if serializer.is_valid():
            leave = serializer.save()
            response_serializer = LeaveRequestSerializer(leave)

            employee_id = request.data.get('employeeid')
            try:
                employee = Employee.objects.get(id=employee_id)
                employee_name = employee.name
            except Employee.DoesNotExist:
                return Response({"error": "Employee not found"}, status=status.HTTP_404_NOT_FOUND)

            Notification.objects.create(
                message="Leave Requested",
                employeeid=employee,
                notificationtype="leave request"
            )

            return Response(response_serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

    def get(self, request):
        limit = int(request.query_params.get('limit', 5))
        start_index = int(request.query_params.get('startIndex', 0))
        employee_info = request.query_params.get('employeeinfo', '').strip()
        start_date = request.query_params.get('start')
        end_date = request.query_params.get('end')

        if start_date and not end_date:
            end_date = date.today().isoformat()

        filters = Q()
        if employee_info:
            filters &= (Q(employeeid__id__icontains=employee_info) | Q(employeeid__name__icontains=employee_info))
        if start_date and end_date:
            filters &= (Q(startdate__range=[start_date, end_date]) | Q(enddate__range=[start_date, end_date]) | Q(startdate__lte=start_date, enddate__gte=end_date))
        elif start_date:
            filters &= Q(startdate__lte=start_date, enddate__gte=start_date)

        leave_requests = LeaveRequest.objects.filter(filters).order_by('-requested_date')
        leave_requests = leave_requests[start_index:start_index+limit]

        serializer = LeaveRequestSerializer(leave_requests, many=True)
        return Response(serializer.data)


class ApproveLeave(APIView):
    def put(self, request):
        print(request.data)
        leave_id = int(request.query_params.get('leave_id'))
        try:
            leave = LeaveRequest.objects.get(id=leave_id)
        except LeaveRequest.DoesNotExist:
            return Response({'error': 'Leave not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = LeaveRequestSerializer(leave, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        else:
            print(serializer.errors)  # Log the serializer errors
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)   

class RejectLeave(APIView):
    def put(self, request):
        print(request.data)
        leave_id = int(request.query_params.get('leave_id'))
        try:
            leave = LeaveRequest.objects.get(id=leave_id)
        except LeaveRequest.DoesNotExist:
            return Response({'error': 'Leave not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = LeaveRequestSerializer(leave, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        else:
            print(serializer.errors)  # Log the serializer errors
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)              
        

class EmployeeLeaveDetails(APIView):

    def get(self, request):
        employee_id = int(request.query_params.get('employee_id'))
        try:
            leave_requests = LeaveRequest.objects.filter(employeeid=employee_id)
            if not leave_requests.exists():
                return Response({"error": "No leave applications found for this employee"}, status=status.HTTP_404_NOT_FOUND)
            
            total_applied_leaves = leave_requests.count()
            approved_leaves = leave_requests.filter(status='approved').count()
            rejected_leaves = leave_requests.filter(status='rejected').count()

            leave_serializer = LeaveRequestSerializer(leave_requests, many=True)
            data = {
                'total_applied_leaves': total_applied_leaves,
                'approved_leaves': approved_leaves,
                'rejected_leaves': rejected_leaves,
                'leave_requests': leave_serializer.data
            }
            return Response(data)
        except Employee.DoesNotExist:
            return Response({"error": "Employee not found"}, status=status.HTTP_404_NOT_FOUND)

class Leave_Details(APIView):

    def get(self, request):
        leave_id = int(request.query_params.get('leave_id'))
        try:
            leave = LeaveRequest.objects.get(id=leave_id)
            serializer = LeaveRequestSerializer(leave)
            data = serializer.data
            return Response(data)
        except LeaveRequest.DoesNotExist:
            return Response({"error": "Leave not found"}, status=status.HTTP_404_NOT_FOUND)  
        

class GetallNotification(APIView):

    def get(self, request):
        notifications = Notification.objects.all().order_by('-date')
        serializer = NotificationSerializer(notifications, many=True)

        unreadnotifications = Notification.objects.filter(
            is_read=False,
        ).count()
        
        response_data = {
            'notification': serializer.data,
            'unreadnotificationcount': unreadnotifications,
        }
        
        return Response(response_data)
    

class DeleteNotification(APIView): 

    def delete(self, request):
        print(request.data)
        notificationid =request.query_params.get('notificationid')
        if notificationid:
            try:
                notifications = Notification.objects.get(id=notificationid)
                notifications.delete()
            except Notification.DoesNotExist:
                return Response(status=status.HTTP_404_NOT_FOUND) 
        return Response(status=status.HTTP_204_NO_CONTENT)    

class Notificationn_Readed(APIView): 
       
    def put(self,request):
        print(request.data)
        notificationid=int(request.query_params.get('notificationid'))
        notifications = Notification.objects.get(id=notificationid)
        notifications.is_read = 1
        notifications.save()
        return Response({'message': 'Notification Readed'}, status=status.HTTP_200_OK)

class Leaverequest_for_chart(APIView):
    def get(self, request):

        leave_requests = LeaveRequest.objects.all()
        serializer = LeaveRequestSerializer(leave_requests, many=True)
        return Response(serializer.data)
