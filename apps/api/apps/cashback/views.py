from rest_framework import viewsets, permissions
from .models import Campaign, Purchase, CashbackTransaction
from .serializers import CampaignSerializer, PurchaseSerializer, CashbackTransactionSerializer
from apps.accounts.permissions import IsAdmin, IsMerchant, IsConsumer


class CampaignViewSet(viewsets.ModelViewSet):
    queryset = Campaign.objects.all()
    serializer_class = CampaignSerializer

    def get_permissions(self):
        if self.request.method == "GET":
            return [permissions.IsAuthenticated()]
        return [IsMerchant() | IsAdmin()]


class PurchaseViewSet(viewsets.ModelViewSet):
    queryset = Purchase.objects.all()
    serializer_class = PurchaseSerializer

    def get_permissions(self):
        if self.request.method == "POST":
            return [IsConsumer()]
        return [permissions.IsAuthenticated()]


class CashbackTransactionViewSet(viewsets.ModelViewSet):
    queryset = CashbackTransaction.objects.all()
    serializer_class = CashbackTransactionSerializer

    def get_permissions(self):
        if self.request.method == "GET":
            return [permissions.IsAuthenticated()]
        return [IsMerchant() | IsAdmin()]
