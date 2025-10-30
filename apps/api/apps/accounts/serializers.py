from django.contrib.auth import get_user_model
from rest_framework import serializers

User = get_user_model()


class RegisterSerializer(serializers.ModelSerializer):
    # Ensure email is required and username is optional; we'll default username=email
    email = serializers.EmailField(required=True)
    username = serializers.CharField(required=False, allow_blank=True, write_only=True)
    password = serializers.CharField(write_only=True, min_length=8)
    role = serializers.ChoiceField(
        choices=[("CONSUMER", "CONSUMER"), ("MERCHANT", "MERCHANT"), ("ADMIN", "ADMIN")],
        default="CONSUMER",
    )

    class Meta:
        model = User
        fields = ("id", "email", "username", "password", "role")
        extra_kwargs = {
            "username": {"required": False},
        }

    def validate(self, attrs):
        # Default username to email if not provided
        if not attrs.get("username") and attrs.get("email"):
            attrs["username"] = attrs["email"]
        return super().validate(attrs)

    def create(self, validated_data):
        password = validated_data.pop("password")
        user = User(**validated_data)
        if not user.username:
            user.username = user.email
        user.set_password(password)
        user.save()
        return user
