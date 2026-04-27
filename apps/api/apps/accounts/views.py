from django.contrib.auth import get_user_model
from django.db import transaction
from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers

from .serializers import RegisterSerializer, ProfileSerializer, DonationSerializer
from .permissions import IsAdmin

User = get_user_model()


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    # Allow login with email instead of username
    username = serializers.CharField(required=False, allow_blank=True)
    email = serializers.EmailField(required=False)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Make the username field not required so email-only login works
        self.fields[self.username_field].required = False
        self.fields[self.username_field].allow_blank = True

    def validate(self, attrs):
        # If username wasn't provided but email was, map it
        if not attrs.get(self.username_field):
            email = self.initial_data.get("email")
            if email:
                attrs[self.username_field] = email
        return super().validate(attrs)

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token["role"] = user.role
        token["username"] = user.username
        return token


class LoginView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


class RefreshView(TokenRefreshView):
    pass


@api_view(["POST"])
@permission_classes([permissions.AllowAny])
def register(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        return Response({"id": user.id, "email": user.email, "role": user.role}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = ProfileSerializer(request.user)
        return Response(serializer.data)

    def patch(self, request):
        serializer = ProfileSerializer(request.user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


class DonationsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        from apps.cashback.models import CashbackTransaction

        txs = (
            CashbackTransaction.objects
            .filter(user=request.user)
            .select_related("cause", "purchase__store")
            .order_by("-purchase__created_at")
        )
        data = [
            {
                "id": tx.id,
                "cause_title": tx.cause.title if tx.cause else "Sin causa asignada",
                "cause_slug": tx.cause.slug if tx.cause else None,
                "amount": tx.amount,
                "percentage": tx.percentage,
                "status": tx.status,
                "store_name": tx.purchase.store.display_name,
                "purchase_amount": tx.purchase.amount,
                "created_at": tx.purchase.created_at,
            }
            for tx in txs
        ]
        serializer = DonationSerializer(data, many=True)
        return Response(serializer.data)


class AdminUserView(APIView):
    """Admin-only endpoint: list users (GET) and create users (POST)."""
    permission_classes = [IsAdmin]

    def get(self, request):
        qs = User.objects.all().order_by('-date_joined')
        role = request.query_params.get('role')
        if role:
            qs = qs.filter(role=role)
        data = [
            {"id": u.id, "email": u.email, "username": u.username, "role": u.role}
            for u in qs
        ]
        return Response(data)

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        merchant_name = request.data.get("merchant_name")
        merchant_cuit = request.data.get("merchant_cuit")

        with transaction.atomic():
            user = serializer.save()

            merchant_data = None
            if merchant_name and merchant_cuit:
                from apps.commerce.models import Merchant
                merchant = Merchant.objects.create(
                    owner=user, name=merchant_name, cuit=merchant_cuit,
                )
                merchant_data = {"id": merchant.id, "name": merchant.name, "cuit": merchant.cuit}

        resp = {"id": user.id, "email": user.email, "username": user.username, "role": user.role}
        if merchant_data:
            resp["merchant"] = merchant_data
        return Response(resp, status=status.HTTP_201_CREATED)
