from django.urls import path
from . import views

app_name ='project'

urlpatterns =[
    path('get_all/', views.ProjectListAPIView.as_view(), name='report'),
]