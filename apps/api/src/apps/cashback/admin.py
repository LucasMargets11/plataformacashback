from django.contrib import admin
from .models import Campaign, Purchase, CashbackTransaction, ReceiptUpload


@admin.register(Campaign)
class CampaignAdmin(admin.ModelAdmin):
    list_display = ("id", "store", "percentage", "active")


@admin.register(Purchase)
class PurchaseAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "store", "amount", "status", "created_at")


@admin.register(CashbackTransaction)
class CashbackTransactionAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "purchase", "amount", "status")


@admin.register(ReceiptUpload)
class ReceiptUploadAdmin(admin.ModelAdmin):
    list_display = ("id", "purchase", "ocr_status")
