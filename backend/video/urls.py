from django.urls import path
from . import views

app_name ='video'

urlpatterns =[
    path('get_videorelation/<int:pk>/', views.VideoRelationAPIView.as_view(), name='get_videorelation'),
]