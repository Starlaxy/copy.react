from rest_framework import serializers
from rest_framework.serializers import SerializerMethodField

from .models import ActionAnalysis, UserAnalysis


class UserAnalysisSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserAnalysis
        fields = [
            "user_agent",
            "video_relation",
            "user_cookie",
            "access_time",
            "leave_time",
            "start_time",
            "end_time",
            "action_analysis",
        ]

    def get_action_analysis(self, obj):
        try:
            action_analysis_abstruct_contents = ActionAnalysisSerializer(
                ActionAnalysis.objects.all().filter(user_analysis=UserAnalysis.objects.get(id=obj.id)), many=True
            ).data
            return action_analysis_abstruct_contents
        except:
            action_analysis_abstruct_contents = None
            return action_analysis_abstruct_contents


class ActionAnalysisSerializer(serializers.ModelSerializer):
    class Meta:
        model = ActionAnalysis
        fields = [
            "user_analysis",
            "tag",
            "action_type",
            "action_time",
            "switch_video",
            "story_end_time",
            "popup_btn_flg",
        ]
