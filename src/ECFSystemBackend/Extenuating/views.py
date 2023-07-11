from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status

from .jwt_manager import *

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken


class NewRefreshToken(APIView):
    """Returns a new JWT token if necessary for client actions when given a valid JWT."""

    @classmethod
    def get(cls, request) -> Response:
        """Provides new JWT token.
        :param request: The request header with JWT token.
        :return: A response JSON with the included new valid JWT token.
        """
        if is_valid_uuid(request):
            user = User.objects.get(id__exact=decode_jwt(request))
            refresh = RefreshToken.for_user(user)
            refresh['user_id'] = str(user.id)
            refresh['email'] = user.email
            refresh['full_name'] = user.full_name
            refresh['is_admin'] = user.is_admin
            refresh['is_business'] = user.is_business
            refresh['phone_number'] = str(user.phone_number)
            refresh['date_joined'] = str(user.date_joined)[:19]
            data = {
                'access': str(refresh.access_token),
                'refresh': str(refresh),
            }
            return Response(data, status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_403_FORBIDDEN)


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    """Generates a refresh and access token pair for a user and returns the encrypted values before salting."""

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['user_id'] = str(user.id)
        token['email'] = user.email
        token['full_name'] = user.full_name
        token['is_admin'] = user.is_admin
        token['is_business'] = user.is_business
        token['phone_number'] = str(user.phone_number)
        token['date_joined'] = str(user.date_joined)[:19]
        return token


class MyTokenObtainPairView(TokenObtainPairView):
    """Override for the default token pair types."""
    serializer_class = MyTokenObtainPairSerializer
