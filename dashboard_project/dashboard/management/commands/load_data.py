import json
from datetime import datetime
from django.core.management.base import BaseCommand
from dashboard.models import DataPoint
from django.utils import timezone  # Import Django's timezone module

class Command(BaseCommand):
    help = 'Load data from jsondata.json'

    def handle(self, *args, **kwargs):
        with open('jsondata.json', encoding='utf-8') as file:
            data = json.load(file)
            for entry in data:
                # Skip entries with empty required fields
                if not entry['published'] or not entry['intensity']:
                    continue

                # Parse dates, handle empty strings
                added = timezone.make_aware(datetime.strptime(entry['added'], '%B, %d %Y %H:%M:%S')) if entry['added'] else None
                published = timezone.make_aware(datetime.strptime(entry['published'], '%B, %d %Y %H:%M:%S'))

                DataPoint.objects.create(
                    end_year=entry['end_year'] if entry['end_year'] else None,
                    intensity=int(entry['intensity']) if entry['intensity'] else 0,
                    sector=entry['sector'],
                    topic=entry['topic'],
                    insight=entry['insight'],
                    url=entry['url'],
                    region=entry['region'],
                    start_year=entry['start_year'] if entry['start_year'] else None,
                    impact=entry['impact'] if entry['impact'] else None,
                    added=added,
                    published=published,
                    country=entry['country'],
                    relevance=int(entry['relevance']) if entry['relevance'] else 0,
                    pestle=entry['pestle'],
                    source=entry['source'],
                    title=entry['title'],
                    likelihood=int(entry['likelihood']) if entry['likelihood'] else 0,
                    city=entry.get('city', None)
                )
