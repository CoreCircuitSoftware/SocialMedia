# Generated by Django 5.1.2 on 2024-10-09 04:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='message',
            name='editDate',
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='message',
            name='hasEdit',
            field=models.BooleanField(default=False),
        ),
    ]
