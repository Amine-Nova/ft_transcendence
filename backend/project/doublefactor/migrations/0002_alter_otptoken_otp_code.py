# Generated by Django 3.2.7 on 2024-10-27 14:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('doublefactor', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='otptoken',
            name='otp_code',
            field=models.CharField(default='ba4d01', max_length=6),
        ),
    ]
