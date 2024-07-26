from rest_framework import serializers
from .models import Employee
from django.contrib.auth.hashers import make_password

class EmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = '__all__'

    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data['password'])
        employee = Employee.objects.create(**validated_data)
        return employee
