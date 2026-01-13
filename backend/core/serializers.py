from rest_framework import serializers
from .models import Project, ProjectImage, Criteria, Vote, Rating, Comment

class ProjectImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectImage
        fields = ["id", "image", "caption", "order"]

class CriteriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Criteria
        fields = ["id", "name", "description", "weight"]

class RatingSerializer(serializers.ModelSerializer):
    # We simplify this to avoid circular import or context errors for now
    class Meta:
        model = Rating
        fields = ["id", "criteria", "score", "created_at"]
        read_only_fields = ["created_at"]

class CommentSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)
    
    class Meta:
        model = Comment
        fields = ["id", "user", "content", "created_at"]

class ProjectSerializer(serializers.ModelSerializer):
    # We rename this to 'ProjectSerializer' to match your Views
    creator = serializers.StringRelatedField()
    has_voted = serializers.SerializerMethodField()
    images = ProjectImageSerializer(many=True, read_only=True)

    class Meta:
        model = Project
        fields = [
            "id", "name", "description", "category",
            "creator", "status", "vote_count", 
            "has_voted", "images", "created_at"
        ]

    def get_has_voted(self, obj):
        # This safely checks if the user voted, handling anonymous users too
        request = self.context.get("request")
        if request and request.user.is_authenticated:
            return obj.votes.filter(user=request.user).exists()
        return False
