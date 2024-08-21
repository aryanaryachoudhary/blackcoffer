from django.shortcuts import render
from rest_framework import generics
from .models import DataPoint
from .serializers import DataPointSerializer
from django.http import JsonResponse
# Create your views here.


class DataPointList(generics.ListAPIView):
    queryset = DataPoint.objects.all()
    serializer_class = DataPointSerializer


def index(request):
    data_points = DataPoint.objects.all()
    context = {
        'data_points': data_points
    }
    return render(request, 'index.html', context)


def get_data(request):
    data_points = DataPoint.objects.all().values()
    data_points_list = list(data_points)  # Convert queryset to list
    return JsonResponse(data_points_list, safe=False)