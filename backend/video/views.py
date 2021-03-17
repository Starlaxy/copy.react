from rest_framework.generics import ListAPIView
from .models import VideoRelation, Video, Tag, EndTag
from .serializers import *

class VideoRelationAPIView(ListAPIView):
    queryset = VideoRelation.objects.all()
    serializer_class = VideoRelationSerializer