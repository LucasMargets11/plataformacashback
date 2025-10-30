from rest_framework import viewsets, permissions, generics
from rest_framework.response import Response
from django.db.models import Prefetch, Q
from .models import Merchant, Store, Category
from .serializers import MerchantSerializer, StoreSerializer, CategorySerializer
from apps.accounts.permissions import IsAdmin, IsMerchant


class MerchantViewSet(viewsets.ModelViewSet):
    queryset = Merchant.objects.all()
    serializer_class = MerchantSerializer

    def get_permissions(self):
        if self.request.method in ("GET",):
            return [permissions.IsAuthenticated()]
        return [IsMerchant() | IsAdmin()]


class StoreViewSet(viewsets.ModelViewSet):
    queryset = Store.objects.all().prefetch_related("categories")
    serializer_class = StoreSerializer

    def get_permissions(self):
        if self.request.method in ("GET",):
            return [permissions.IsAuthenticated()]
        return [IsMerchant() | IsAdmin()]

    def get_queryset(self):
        qs = super().get_queryset().filter(active=True)
        # Filters: search, category (id or slug), participates (true/false)
        search = self.request.query_params.get("search")
        if search:
            qs = qs.filter(Q(display_name__icontains=search) | Q(description__icontains=search))

        category = self.request.query_params.get("category")
        if category:
            if category.isdigit():
                qs = qs.filter(categories__id=int(category))
            else:
                qs = qs.filter(categories__slug=category)

        participates = self.request.query_params.get("participates")
        if participates in {"true", "false"}:
            want_true = participates == "true"
            qs = qs.filter(categories__participates_in_cashback=want_true).distinct()

        return qs.distinct()


class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.all().order_by("name")
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticated]
