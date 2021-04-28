from rest_framework import generics, viewsets
from .models import VideoRelation, Video, Tag, EndTag
from .serializers import *

class UserAnalysisViewSet(viewsets.ModelViewSet):
    """
    UserAnalysisViewSetクラス
    """
    queryset = UserAnalysis.objects.all()
    serializer_class = UserAnalysisSerializer