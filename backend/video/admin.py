from django.contrib import admin
from .models import VideoRelation, Video, Tag, EndTag

admin.site.register(VideoRelation)
admin.site.register(Video)
admin.site.register(Tag)
admin.site.register(EndTag)