# Generated by Django 5.2 on 2025-05-01 15:00

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('payments', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='payment',
            name='method',
            field=models.CharField(choices=[('credit_card', 'Credit Card'), ('truemoney', 'True Money'), ('bank_transfer', 'Bank Transfer')], max_length=20),
        ),
    ]
