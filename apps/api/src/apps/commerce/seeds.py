from django.utils.text import slugify
from django.contrib.auth import get_user_model
from .models import Merchant, Store

User = get_user_model()


def seed():
    merchant_user = User.objects.filter(email="merchant@example.com").first()
    if not merchant_user:
        return
    merchant, _ = Merchant.objects.get_or_create(owner=merchant_user, name="Tienda Demo", cuit="20-12345678-9")
    Store.objects.get_or_create(merchant=merchant, display_name="Sucursal Centro", address="Calle Falsa 123", qrcode_slug=slugify("sucursal-centro"))
