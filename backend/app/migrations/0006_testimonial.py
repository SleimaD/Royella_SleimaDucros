# Generated by Django 5.0.6 on 2024-06-07 10:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0005_servicedetail'),
    ]

    operations = [
        migrations.CreateModel(
            name='Testimonial',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('role', models.CharField(max_length=100)),
                ('feedback', models.TextField()),
                ('rating', models.IntegerField()),
                ('image', models.ImageField(upload_to='testimonials/')),
                ('location', models.CharField(blank=True, max_length=100, null=True)),
            ],
        ),
    ]