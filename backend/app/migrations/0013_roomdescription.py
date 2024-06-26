# Generated by Django 5.0.6 on 2024-06-11 08:32

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0012_remove_amenity_icon_color'),
    ]

    operations = [
        migrations.CreateModel(
            name='RoomDescription',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=255)),
                ('content', models.TextField()),
                ('room', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='descriptions', to='app.room')),
            ],
        ),
    ]
