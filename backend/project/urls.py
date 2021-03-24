from django.urls import path
from django.conf.urls import url, include
from rest_framework import routers
from . import views

app_name ='project'

router = routers.DefaultRouter()
router.register('project', views.ProjectViewSet, basename='project')

urlpatterns =[
    path('', include(router.urls))
]