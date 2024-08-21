from django.urls import path
from .views import DataPointList
from . import views

urlpatterns = [
    path('api/data/', DataPointList.as_view(), name='data-list'),
    path('', views.index, name='index'),
]
