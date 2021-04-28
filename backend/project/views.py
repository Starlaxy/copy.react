from rest_framework import generics, viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from view.models import UserAnalysis, ActionAnalysis
from .models import Project
from .serializers import *
from django.shortcuts import get_object_or_404
from rest_framework import status

import shutil
import os

class ProjectViewSet(viewsets.ModelViewSet):

    serializer_class = ProjectSerializer
    queryset = Project.objects.all()

    def create(self, request):
        serializer = ProjectCreateSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            create_project = ProjectSerializer(serializer.instance)
            return Response(create_project.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, pk=None):
        project = get_object_or_404(Project, pk=pk)
        if(os.path.isdir('static/videos/{0}'.format(pk))):
            shutil.rmtree('static/videos/{0}'.format(pk))
        project.delete()
        return Response()

    @action(detail=True, methods=['post'])
    def update_title(self, request, pk=None):
        """
        タイトル変更メソッド
        """
        project = get_object_or_404(Project, pk=pk)
        if not 'title' in request.data:
            return Response({"title": "存在しません。再度お試しください"}, status=status.HTTP_400_BAD_REQUEST)
        
        serializer = ProjectSerializer(project, data={
            "title": request.data['title'],
            "description": project.description
        })
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def update_description(self, request, pk=None):
        """
        詳細変更メソッド
        """
        project = get_object_or_404(Project, pk=pk)
        if not 'description' in request.data:
            return Response({"description": "存在しません。再度お試しください"}, status=status.HTTP_400_BAD_REQUEST)
        
        serializer = ProjectSerializer(project, data={
            "title": project.title,
            "description": request.data['description']
        })
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
