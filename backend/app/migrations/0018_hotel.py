# Generated by Django 5.0.6 on 2024-06-12 17:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0017_homebanner_pagebanner'),
    ]

    operations = [
        migrations.CreateModel(
            name='Hotel',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=255)),
                ('subtitle', models.CharField(max_length=255)),
                ('description', models.TextField()),
                ('image', models.ImageField(blank=True, null=True, upload_to='hotel/')),
                ('room_count', models.IntegerField()),
                ('customer_rating', models.DecimalField(decimal_places=2, max_digits=3)),
            ],
        ),
    ]