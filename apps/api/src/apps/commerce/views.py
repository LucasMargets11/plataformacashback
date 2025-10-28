from rest_framework import viewsets, permissions
from .models import Merchant, Store
from .serializers import MerchantSerializer, StoreSerializer
from apps.accounts.permissions import IsAdmin, IsMerchant, ReadOnly


class MerchantViewSet(viewsets.ModelViewSet):
    queryset = Merchant.objects.all()
    serializer_class = MerchantSerializer

    def get_permissions(self):
        if self.request.method in ("GET",):
            return [permissions.IsAuthenticated()]
        return [IsMerchant() | IsAdmin()]


class StoreViewSet(viewsets.ModelViewSet):
    queryset = Store.objects.all()
    serializer_class = StoreSerializer

    def get_permissions(self):
        if self.request.method in ("GET",):
            return [permissions.IsAuthenticated()]
        return [IsMerchant() | IsAdmin()]
