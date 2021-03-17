from rest_framework.generics import ListAPIView, CreateAPIView
from .models import Project
from view.models import UserAnalysis, ActionAnalysis
from .serializers import *

class ProjectListAPIView(ListAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer

class ProjectCreateAPIView(CreateAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectCreateSerializer