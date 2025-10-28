from rest_framework.routers import DefaultRouter
from .views import CampaignViewSet, PurchaseViewSet, CashbackTransactionViewSet

router = DefaultRouter()
router.register(r"campaigns", CampaignViewSet)
router.register(r"purchases", PurchaseViewSet)
router.register(r"transactions", CashbackTransactionViewSet)

urlpatterns = router.urls
