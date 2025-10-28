from django.contrib.auth import get_user_model
from rest_framework import serializers

User = get_user_model()


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    role = serializers.ChoiceField(choices=[("CONSUMER", "CONSUMER"), ("MERCHANT", "MERCHANT"), ("ADMIN", "ADMIN")], default="CONSUMER")

    class Meta:
        model = User
        fields = ("id", "username", "email", "password", "role")

    def create(self, validated_data):
        password = validated_data.pop("password")
        user = User(**validated_data)
        if not user.username:
            user.username = user.email
        user.set_password(password)
        user.save()
        return user
