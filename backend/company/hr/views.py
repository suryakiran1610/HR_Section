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

    def get(self,request):
        leave_requests =LeaveRequest.objects.all().order_by('-requested_date')
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
        

