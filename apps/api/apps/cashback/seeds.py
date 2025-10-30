from django.utils import timezone
from datetime import timedelta
from django.contrib.auth import get_user_model
from apps.commerce.models import Store
from .models import Campaign

User = get_user_model()


def seed():
    store = Store.objects.first()
    if not store:
        return
    if not Campaign.objects.filter(store=store, active=True).exists():
        Campaign.objects.create(
            store=store,
            percentage=5.0,
            starts_at=timezone.now() - timedelta(days=1),
            ends_at=timezone.now() + timedelta(days=30),
            active=True,
        )
