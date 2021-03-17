from django.urls import path
from . import views

app_name ='video'

urlpatterns =[
    path('video/get_all/', views.VideoRelationAPIView.as_view(), name='video_get_all'),
]