from rest_framework import serializers
from .models import Employee
from .models import Notification
from .models import LeaveRequest 
from .models import Task
from .models import Task_Assign
from django.contrib.auth.hashers import make_password

class EmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = '__all__'

    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data['password'])
        employee = Employee.objects.create(**validated_data)
        return employee

class NotificationSerializer(serializers.ModelSerializer):
    employeeid = EmployeeSerializer()
    
    class Meta:
        model = Notification
        fields = '__all__'
        


class LeaveRequestSerializer(serializers.ModelSerializer):
    employeeid = serializers.PrimaryKeyRelatedField(queryset=Employee.objects.all())
    
    class Meta:
        model = LeaveRequest
        fields = '__all__'

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        employee = EmployeeSerializer(instance.employeeid).data
        representation['employee'] = employee
        return representation

class TaskSerializer(serializers.ModelSerializer):
    employeeid = serializers.PrimaryKeyRelatedField(queryset=Employee.objects.all())
    
    class Meta:
        model = Task
        fields = '__all__'

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        employee = EmployeeSerializer(instance.employeeid).data
        representation['employee'] = employee
        return representation    

class TaskAssignSerializer(serializers.ModelSerializer):
    employeeid = serializers.PrimaryKeyRelatedField(queryset=Employee.objects.all())
    
    class Meta:
        model = Task_Assign
        fields = '__all__'

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        task = TaskSerializer(instance.task_id).data
        employee = EmployeeSerializer(instance.employeeid).data
        representation['task'] = task
        representation['employee'] = employee
        return representation         
