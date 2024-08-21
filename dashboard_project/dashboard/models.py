from django.db import models

# Create your models here.


class DataPoint(models.Model):
    end_year = models.CharField(max_length=4, blank=True, null=True)
    intensity = models.IntegerField()
    sector = models.CharField(max_length=100, blank=True, null=True)
    topic = models.CharField(max_length=100, blank=True, null=True)
    insight = models.TextField(blank=True, null=True)
    url = models.URLField(blank=True, null=True)
    region = models.CharField(max_length=100, blank=True, null=True)
    start_year = models.CharField(max_length=4, blank=True, null=True)
    impact = models.TextField(blank=True, null=True)
    added = models.DateTimeField(blank=True, null=True)
    published = models.DateTimeField(blank=True, null=True)  # Allow null
    country = models.CharField(max_length=100, blank=True, null=True)
    relevance = models.IntegerField()
    pestle = models.CharField(max_length=100, blank=True, null=True)
    source = models.CharField(max_length=100, blank=True, null=True)
    title = models.TextField()
    likelihood = models.IntegerField()
    city = models.CharField(max_length=100, blank=True, null=True)


