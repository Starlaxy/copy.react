from django.urls import path
from . import views

app_name ='project'

urlpatterns =[
    path('project/get_all/', views.ProjectListAPIView.as_view(), name='project_get_all'),
    path('project/create/', views.ProjectCreateAPIView.as_view(), name='project_create'),
]