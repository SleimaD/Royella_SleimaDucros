# Generated by Django 5.0.6 on 2024-06-11 07:17

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0010_amenity_room_booking'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='amenity',
            name='icon',
        ),
        migrations.AddField(
            model_name='amenity',
            name='icon_color',
            field=models.CharField(default='#000000', max_length=10),
        ),
        migrations.AddField(
            model_name='amenity',
            name='icon_name',
            field=models.CharField(max_length=100, null=True),
        ),
        migrations.AlterField(
            model_name='amenity',
            name='name',
            field=models.CharField(max_length=200),
        ),
    ]
