# Generated by Django 5.0.6 on 2024-06-17 18:05

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0023_remove_booking_guest_count'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='booking',
            name='booking_group',
        ),
    ]
