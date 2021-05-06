from django.conf.urls import include, url
from django.urls import path
from rest_framework import routers

from . import views

app_name = "video"

router = routers.DefaultRouter()
router.register("useranalysis", views.UserAnalysisViewSet, basename="useranalysis")

urlpatterns = [path("", include(router.urls))]
