from django.shortcuts import render
from rest_framework.generics import ListAPIView
from .models import Project
from view.models import UserAnalysis, ActionAnalysis
from .serializers import *

import json

class ProjectListAPIView(ListAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer