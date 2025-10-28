from django.contrib import admin
from .models import Merchant, Store


@admin.register(Merchant)
class MerchantAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "cuit", "owner", "status")


@admin.register(Store)
class StoreAdmin(admin.ModelAdmin):
    list_display = ("id", "display_name", "merchant", "qrcode_slug")
