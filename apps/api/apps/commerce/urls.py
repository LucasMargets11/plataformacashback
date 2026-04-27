from rest_framework.routers import DefaultRouter
from django.urls import path
from .views import MerchantViewSet, StoreViewSet, CategoryListView, StoreCausesView, StoreCauseDetailView

router = DefaultRouter()
router.register(r"merchants", MerchantViewSet)
router.register(r"stores", StoreViewSet)

urlpatterns = [
	path("categories/", CategoryListView.as_view(), name="categories-list"),
	path("stores/<int:store_pk>/causes/", StoreCausesView.as_view(), name="store-causes"),
	path("stores/<int:store_pk>/causes/<int:cause_pk>/", StoreCauseDetailView.as_view(), name="store-cause-detail"),
]

urlpatterns += router.urls
