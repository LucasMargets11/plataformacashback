from rest_framework.routers import DefaultRouter
from django.urls import path
from .views import MerchantViewSet, StoreViewSet, CategoryListView

router = DefaultRouter()
router.register(r"merchants", MerchantViewSet)
router.register(r"stores", StoreViewSet)

urlpatterns = [
	path("categories/", CategoryListView.as_view(), name="categories-list"),
]

urlpatterns += router.urls
