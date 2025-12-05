from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from django.db.models import QuerySet
from .models import Cause
from .serializers import CauseSerializer


class CauseViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Cause.objects.filter(is_active=True).order_by("-updated_at")
    serializer_class = CauseSerializer
    permission_classes = [AllowAny]

    def get_queryset(self) -> QuerySet:
        qs = super().get_queryset()
        request = self.request
        is_featured = request.query_params.get("is_featured")
        category = request.query_params.get("category")
        search = request.query_params.get("search")
        ordering = request.query_params.get("ordering")

        if is_featured is not None:
            val = is_featured.lower() in ("1", "true", "yes", "y")
            qs = qs.filter(is_featured=val)
        if category:
            qs = qs.filter(category__iexact=category)
        if search:
            qs = qs.filter(title__icontains=search) | qs.filter(summary__icontains=search)
        if ordering:
            qs = qs.order_by(ordering)
        limit = request.query_params.get("limit")
        if limit and limit.isdigit():
            qs = qs[: int(limit)]
        return qs
