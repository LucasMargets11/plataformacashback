from rest_framework import serializers
from .models import Cause


class CauseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cause
        fields = [
            "id",
            "title",
            "slug",
            "category",
            "summary",
            "image_url",
            "cashback_percent",
            "is_featured",
            "is_active",
            "created_at",
            "updated_at",
        ]
