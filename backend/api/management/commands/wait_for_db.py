"""
Django management command to wait for the database to be available.
Save this as: backend/api/management/commands/wait_for_db.py
"""
import time
from django.core.management.base import BaseCommand
from django.db import connections
from django.db.utils import OperationalError


class Command(BaseCommand):
    """Django command to pause execution until database is available"""

    def handle(self, *args, **options):
        self.stdout.write('Waiting for database...')
        db_conn = None
        retries = 0
        max_retries = 30
        
        while not db_conn and retries < max_retries:
            try:
                db_conn = connections['default']
                db_conn.cursor()
            except OperationalError:
                retries += 1
                self.stdout.write(f'Database unavailable, waiting 1 second... (attempt {retries}/{max_retries})')
                time.sleep(1)

        if db_conn:
            self.stdout.write(self.style.SUCCESS('Database available!'))
        else:
            self.stdout.write(self.style.ERROR('Database connection failed after maximum retries'))
            raise Exception('Could not connect to database')
