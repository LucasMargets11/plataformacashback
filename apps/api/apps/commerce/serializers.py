from rest_framework import serializers
from .models import Merchant, Store, Category


class MerchantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Merchant
        fields = "__all__"


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ("id", "name", "slug", "participates_in_cashback")


class StoreSerializer(serializers.ModelSerializer):
    categories = CategorySerializer(many=True, read_only=True)
    has_excluded_categories = serializers.SerializerMethodField()
    excluded_categories = serializers.SerializerMethodField()

    class Meta:
        model = Store
        fields = (
            "id",
            "display_name",
            "address",
            "qrcode_slug",
            "description",
            "logo_url",
            "website_url",
            "instagram_url",
            "active",
            "categories",
            "has_excluded_categories",
            "excluded_categories",
        )

    def get_has_excluded_categories(self, obj: Store) -> bool:
        return any(not c.participates_in_cashback for c in getattr(obj, "_prefetched_objects_cache", {}).get("categories", obj.categories.all()))

    def get_excluded_categories(self, obj: Store):
        cats = getattr(obj, "_prefetched_objects_cache", {}).get("categories", obj.categories.all())
        return [c.name for c in cats if not c.participates_in_cashback]
