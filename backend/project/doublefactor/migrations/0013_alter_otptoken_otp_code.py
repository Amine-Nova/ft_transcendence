# Generated by Django 3.2.7 on 2024-10-28 16:08

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('doublefactor', '0012_alter_otptoken_otp_code'),
    ]

    operations = [
        migrations.AlterField(
            model_name='otptoken',
            name='otp_code',
            field=models.CharField(default='1f1dc8', max_length=6),
        ),
    ]
