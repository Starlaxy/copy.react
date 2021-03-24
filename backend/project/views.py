from rest_framework import generics, viewsets
from rest_framework.response import Response
from .models import Project
from view.models import UserAnalysis, ActionAnalysis
from .serializers import *
from django.shortcuts import get_object_or_404
from rest_framework import status

class ProjectViewSet(viewsets.ModelViewSet):

    serializer_class = ProjectSerializer
    queryset = Project.objects.all()

    def create(self, request):
        serializer = ProjectCreateSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            projects = Project.objects.all()
            project_serializer = ProjectSerializer(projects, many=True)
            return Response(project_serializer.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, pk=None):
        project = get_object_or_404(Project, pk=pk)
        project.delete()
        projects = Project.objects.all()
        serializer = ProjectSerializer(projects, many=True)
        return Response(serializer.data)