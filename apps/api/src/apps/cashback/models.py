from django.conf import settings
from django.db import models
from apps.commerce.models import Store


class Campaign(models.Model):
    store = models.ForeignKey(Store, on_delete=models.CASCADE, related_name="campaigns")
    percentage = models.DecimalField(max_digits=5, decimal_places=2)  # e.g. 5.00 means 5%
    starts_at = models.DateTimeField()
    ends_at = models.DateTimeField()
    active = models.BooleanField(default=True)


class Purchase(models.Model):
    class Source(models.TextChoices):
        QR = "QR", "QR"
        LINK = "LINK", "LINK"
        RECEIPT = "RECEIPT", "RECEIPT"

    class Status(models.TextChoices):
        PENDING = "PENDING", "PENDING"
        APPROVED = "APPROVED", "APPROVED"
        REJECTED = "REJECTED", "REJECTED"

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    store = models.ForeignKey(Store, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    source = models.CharField(max_length=10, choices=Source.choices)
    status = models.CharField(max_length=10, choices=Status.choices, default=Status.PENDING)
    created_at = models.DateTimeField(auto_now_add=True)


class CashbackTransaction(models.Model):
    class Status(models.TextChoices):
        PENDING = "PENDING", "PENDING"
        SETTLED = "SETTLED", "SETTLED"
        PAID = "PAID", "PAID"

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    purchase = models.ForeignKey(Purchase, on_delete=models.CASCADE)
    percentage = models.DecimalField(max_digits=5, decimal_places=2)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=10, choices=Status.choices, default=Status.PENDING)


class ReceiptUpload(models.Model):
    class OcrStatus(models.TextChoices):
        PENDING = "PENDING", "PENDING"
        OK = "OK", "OK"
        FAILED = "FAILED", "FAILED"

    purchase = models.ForeignKey(Purchase, on_delete=models.CASCADE)
    image_path = models.CharField(max_length=255)
    ocr_status = models.CharField(max_length=10, choices=OcrStatus.choices, default=OcrStatus.PENDING)
