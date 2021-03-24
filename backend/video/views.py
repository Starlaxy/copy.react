from rest_framework import generics, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from .models import VideoRelation, Video, Tag, EndTag
from .serializers import *
from django.views.decorators.csrf import csrf_exempt

class VideoRelationViewSet(viewsets.ModelViewSet):
    """
    VideoRelationViewSetクラス
    """

    @action(detail=True, methods=['get'])
    def get_from_project(self, request, pk=None):
        """
        プロジェクトIDからVideoRelation取得
        """
        videorelation = VideoRelation.objects.filter(project=pk)
        serializers = VideoRelationSerializer(videorelation, many=True)
        return Response(serializers.data)

    def create(self, request):
        """
        VideoRelation登録時にVideo登録
        """
        videorelation_serializer = VideoRelationCreateSerializer(data=request.data)

        if videorelation_serializer.is_valid():
            videorelation_serializer.save()

            video_serializer = VideoCreateSerializer(data={'video_relation': videorelation_serializer.instance.pk, 'video': request.data['video'], 'three_dimensional_flg': request.data['three_dimensional_flg']})
            if video_serializer.is_valid():
                video_serializer.save()
                # Response用
                videorelation = VideoRelation.objects.filter(pk=videorelation_serializer.instance.pk)
                serializers = VideoRelationSerializer(videorelation, many=True)
                return Response(serializers.data)
            else:
                return Response(video_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        return Response(videorelation_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class VideoViewSet(viewsets.ModelViewSet):
    @action(detail=True, methods=['get'])
    def get_from_videorelation(self, request, pk=None):
        """
        VideoRelationIDからVideoRelation取得
        """
        video = Video.objects.filter(video_relation=pk)
        serializers = VideoSerializer(video, many=True)
        return Response(serializers.data)