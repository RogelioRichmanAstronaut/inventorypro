# Generated by Django 5.0.7 on 2024-07-31 19:17

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='inventory',
            name='warehouse',
        ),
        migrations.DeleteModel(
            name='Warehouse',
        ),
    ]