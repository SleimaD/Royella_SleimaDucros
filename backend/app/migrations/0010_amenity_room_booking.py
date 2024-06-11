# Generated by Django 5.0.6 on 2024-06-11 06:16

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0009_alter_blogdescription_content_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='Amenity',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('icon', models.ImageField(blank=True, upload_to='amenities/')),
            ],
        ),
        migrations.CreateModel(
            name='Room',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('description', models.TextField()),
                ('price', models.DecimalField(decimal_places=2, max_digits=6)),
                ('image', models.ImageField(upload_to='rooms/')),
                ('available', models.BooleanField(default=True)),
                ('max_guests', models.IntegerField(default=2)),
                ('stars', models.IntegerField(default=1)),
                ('beds', models.CharField(max_length=255)),
                ('dimensions', models.CharField(max_length=255)),
                ('amenities', models.ManyToManyField(related_name='rooms', to='app.amenity')),
            ],
        ),
        migrations.CreateModel(
            name='Booking',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('room_nbr', models.IntegerField()),
                ('start_date', models.DateField()),
                ('end_date', models.DateField()),
                ('guest_count', models.IntegerField()),
                ('status', models.CharField(choices=[('PENDING', 'Pending'), ('CONFIRMED', 'Confirmed'), ('CANCELLED', 'Cancelled')], max_length=10)),
                ('room_details', models.JSONField(default=dict)),
                ('booking_group', models.CharField(blank=True, max_length=100, null=True)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('room', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='app.room')),
            ],
        ),
    ]
