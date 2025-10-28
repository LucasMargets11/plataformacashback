from rest_framework import serializers
from .models import Campaign, Purchase, CashbackTransaction, ReceiptUpload


class CampaignSerializer(serializers.ModelSerializer):
    class Meta:
        model = Campaign
        fields = "__all__"


class PurchaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Purchase
        fields = "__all__"


class CashbackTransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = CashbackTransaction
        fields = "__all__"


class ReceiptUploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReceiptUpload
        fields = "__all__"
