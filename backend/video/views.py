from rest_framework import generics, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from .models import VideoRelation, Video, Tag, EndTag
from project.models import Project
from .serializers import *
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import get_object_or_404
from django.db.models import Q

import cv2
import os.path

class VideoRelationViewSet(viewsets.ModelViewSet):
    """
    VideoRelationViewSetクラス
    """
    queryset = VideoRelation.objects.all()
    serializer_class = VideoRelationSerializer

    @action(detail=True, methods=['get'])
    def get_from_project(self, request, pk=None):
        """
        プロジェクトIDからVideoRelation取得
        """
        print(pk)
        videorelation = VideoRelation.objects.filter(project=pk)
        serializers = VideoRelationSerializer(videorelation, many=True)
        return Response(serializers.data)

    @action(detail=True, methods=['get'])
    def get_story_video(self, request, pk=None):
        """
        VideoRelationIDからプロジェクトに紐づくVideoRelationID以外のVideoRelation取得
        """
        videorelation = VideoRelation.objects.get(pk=pk)
        story_video = VideoRelation.objects.filter(Q(project_id=videorelation.project_id) & ~Q(id=videorelation.id))
        serializers = VideoRelationSerializer(story_video, many=True)
        return Response(serializers.data)

    @action(detail=True, methods=['get'])
    def get_related_video(self, request, pk=None):
        """
        再生するビデオと紐づくストーリービデオ取得
        """
        idlist = [pk]
        videorelation_ids = self.get_videorelation_ids(pk, idlist)
        videorelation = VideoRelation.objects.filter(pk__in=videorelation_ids)
        serializers = VideoRelationSerializer(videorelation, many=True)
        return Response(serializers.data)

    def get_videorelation_ids(self, pk, idlist):
        videorelation = VideoRelation.objects.get(pk=pk)
        videos = Video.objects.filter(video_relation=videorelation)
        for video in videos:
            tags = Tag.objects.filter(Q(video=video) & Q(action_type="story"))
            if(tags.count() != 0):
                for tag in tags:
                    idlist.append(tag.story_next_video.pk)
                    self.get_videorelation_ids(tag.story_next_video.pk, idlist)
        return idlist

    def create(self, request):
        """
        VideoRelation登録時にVideo登録
        """
        videorelation_serializer = VideoRelationCreateSerializer(data=request.data)

        if videorelation_serializer.is_valid():
            videorelation_serializer.save()

            videos = request.data.getlist('video')
            three_dimensional_flags = request.data.getlist('three_dimensional_flg')
            thumb_flg = True

            # video登録数分ループ
            for index, video in enumerate(videos):

                video_serializer = VideoCreateSerializer(data={'video_relation': videorelation_serializer.instance.pk, 'video': video, 'three_dimensional_flg': three_dimensional_flags[index]})
                if video_serializer.is_valid():
                    video_serializer.save()

                    # サムネを作成し、サムネのパス取得(1つのVideoRelationでサムネは1つ)
                    if thumb_flg:
                        thumb_path = make_video_thumb(
                            video_serializer.data['video'],
                            videorelation_serializer.validated_data['project'].id,
                            videorelation_serializer.instance.pk
                        )
                        thumb_flg = False

                else:
                    return Response(video_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

            # Response用
            serializers = VideoRelationSerializer(videorelation_serializer.instance)
            return Response(serializers.data)
        else:
            print(videorelation_serializer.errors)
        
        return Response(videorelation_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, pk=None):
        videorelation = get_object_or_404(VideoRelation, pk=pk)
        if not 'title' in request.data:
            return Response({"title": "存在しません。再度お試しください"}, status=status.HTTP_400_BAD_REQUEST)

        serializer = VideoRelationSerializer(videorelation, data={"title": request.data['title'], "project": videorelation.project_id})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class VideoViewSet(viewsets.ModelViewSet):
    queryset = Video.objects.all()
    serializer_class = VideoSerializer

    @action(detail=True, methods=['get'])
    def get_from_videorelation(self, request, pk=None):
        """
        VideoRelationIDからVideoRelation取得
        """
        video = Video.objects.filter(video_relation=pk)
        serializers = VideoSerializer(video, many=True)
        return Response(serializers.data)

class TagViewSet(viewsets.ModelViewSet):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer

    def create(self, request):
        serializer = TagSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        else:
            print(request.data)
            print(serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

def make_video_thumb(filepath, projectId, videoRelationId):
    """
    Video登録時にサムネ作成
    """
    up_path = 'static/videos/{0}/{1}/thumb/'.format(projectId, videoRelationId)

    # ディレクトリ作成
    if not os.path.exists(up_path):
        os.mkdir(up_path)

    cap_file = cv2.VideoCapture('static/' + filepath)
    ret, frame = cap_file.read()
    if ret:
        thunmb_path = up_path + str(videoRelationId) + '.jpg'
        cv2.imwrite(thunmb_path, frame)
        cap_file.release()

        return thunmb_path
    
    return None