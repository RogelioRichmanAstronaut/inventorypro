import os
from django.core.management.base import BaseCommand
from django.conf import settings
from django.db import connection

class Command(BaseCommand):
    help = 'Load SQL files into the PostgreSQL database'

    def handle(self, *args, **kwargs):
        sql_directory = os.path.join(settings.BASE_DIR, 'api', 'sql')
        sql_files = ['update_inventory.sql', 'generate_sales_report.sql']

        for sql_file in sql_files:
            file_path = os.path.join(sql_directory, sql_file)
            with open(file_path, 'r') as file:
                sql = file.read()
                with connection.cursor() as cursor:
                    cursor.execute(sql)
        
        self.stdout.write(self.style.SUCCESS('Successfully loaded SQL files'))