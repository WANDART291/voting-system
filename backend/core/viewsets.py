from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly, AllowAny, IsAuthenticated
from rest_framework.exceptions import ValidationError
from django.db import transaction, IntegrityError
from django.db.models import Avg
from django.core.cache import cache

from .models import Project, ProjectImage, Criteria, Vote, Rating, Comment

# We use the single serializer we created to avoid ImportErrors
from .serializers import (
    ProjectSerializer, ProjectImageSerializer, 
    RatingSerializer, CommentSerializer, CriteriaSerializer
)

# Standard Django filters
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import OrderingFilter


class ProjectViewSet(viewsets.ModelViewSet):
    # We only show 'published' projects
    queryset = Project.objects.filter(status="published").select_related("creator").prefetch_related("images")
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_fields = ["category"]
    ordering_fields = ["created_at", "vote_count"]
    ordering = ["-created_at"]

    # Use the serializer we created in Step 1
    serializer_class = ProjectSerializer

    def perform_create(self, serializer):
        serializer.save(creator=self.request.user, status="published")

    # --- LEADERBOARD FEATURE ---
    @action(detail=False, methods=['get'])
    def top(self, request):
        cached_data = cache.get("leaderboard")
        if cached_data:
            return Response(cached_data)

        top_projects = self.get_queryset().order_by('-vote_count')[:5]
        serializer = self.get_serializer(top_projects, many=True)
        data = serializer.data

        cache.set("leaderboard", data, 300)
        return Response(data)

    # --- VOTING FEATURE ---
    @action(detail=True, methods=["post"], permission_classes=[IsAuthenticated])
    def vote(self, request, pk=None):
        project = self.get_object()
        user = request.user
        
        # Simple Vote Logic
        vote, created = Vote.objects.get_or_create(user=user, project=project)
        if not created:
            return Response({"detail": "Already voted"}, status=status.HTTP_400_BAD_REQUEST)
        
        # Update Count
        project.vote_count = Vote.objects.filter(project=project).count()
        project.save(update_fields=["vote_count"])
        return Response({"detail": "Voted successfully"}, status=status.HTTP_201_CREATED)


# --- OTHER VIEWSETS (Standard) ---
class ProjectImageViewSet(viewsets.ModelViewSet):
    serializer_class = ProjectImageSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    def get_queryset(self):
        return ProjectImage.objects.filter(project_id=self.kwargs["project_pk"])

class RatingViewSet(viewsets.ModelViewSet):
    serializer_class = RatingSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    def get_queryset(self):
        return Rating.objects.filter(project_id=self.kwargs["project_pk"])

class CommentViewSet(viewsets.ModelViewSet):
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    def get_queryset(self):
        return Comment.objects.filter(project_id=self.kwargs["project_pk"])

class CriteriaViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Criteria.objects.all()
    serializer_class = CriteriaSerializer
    permission_classes = [AllowAny]