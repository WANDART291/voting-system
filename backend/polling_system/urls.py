from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.routers import DefaultRouter
from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView, SpectacularSwaggerView

# --- IMPORT FROM VIEWSETS NOW ---
from core.viewsets import (
    ProjectViewSet, ProjectImageViewSet,
    RatingViewSet, CommentViewSet, CriteriaViewSet
)

# --- ROUTER SETUP ---
router = DefaultRouter()
router.register(r"projects", ProjectViewSet)
# These allow nested URLs (e.g., /api/projects/1/comments/)
router.register(r"projects/(?P<project_pk>\d+)/images", ProjectImageViewSet, basename="project-images")
router.register(r"projects/(?P<project_pk>\d+)/ratings", RatingViewSet, basename="project-ratings")
router.register(r"projects/(?P<project_pk>\d+)/comments", CommentViewSet, basename="project-comments")
router.register(r"criteria", CriteriaViewSet)

urlpatterns = [
    path("admin/", admin.site.urls),

    # Authentication
    path('api/auth/', include('djoser.urls')),
    path('api/auth/', include('djoser.urls.jwt')),

    # --- THE API ENDPOINT ---
    # This automatically creates 'api/projects/' for you
    path("api/", include(router.urls)),

    # Documentation
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path("api/docs/", SpectacularSwaggerView.as_view(url_name="schema"), name="swagger-ui"),
    path("api/redoc/", SpectacularRedocView.as_view(url_name="schema"), name="redoc"),

] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)