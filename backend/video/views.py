from django.shortcuts import render
from .models import VideoRelation, Video, Tag, EndTag
from .serializers import *

class VideoRelationAPIView(ListAPIView):
    queryset = VideoRelation.objects.filter()
    serializer_class = VideoRelationSerializer

    def get_queryset(self):
        relationId = VideoRelation.objects.get(pk=self.kwargs['pk']).pk
        return self.queryset.filter(id=relationId)