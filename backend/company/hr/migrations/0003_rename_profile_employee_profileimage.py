# Generated by Django 5.0.3 on 2024-07-26 09:38

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('hr', '0002_employee_leaverequest_notification'),
    ]

    operations = [
        migrations.RenameField(
            model_name='employee',
            old_name='profile',
            new_name='profileimage',
        ),
    ]
