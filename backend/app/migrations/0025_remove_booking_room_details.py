# Generated by Django 5.0.6 on 2024-06-17 18:07

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0024_remove_booking_booking_group'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='booking',
            name='room_details',
        ),
    ]