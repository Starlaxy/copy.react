from django.urls import path
from django.conf.urls import url, include
from rest_framework import routers
from . import views

app_name ='video'

router = routers.DefaultRouter()
router.register('videorelation', views.VideoRelationViewSet, basename='videorelation')
router.register('video', views.VideoViewSet, basename='video')

urlpatterns =[
    path('', include(router.urls))
]