from rest_framework.routers import DefaultRouter
from .views import MerchantViewSet, StoreViewSet

router = DefaultRouter()
router.register(r"merchants", MerchantViewSet)
router.register(r"stores", StoreViewSet)

urlpatterns = router.urls
