from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status

from .jwt_manager import *

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import *


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
            refresh['username'] = user.username
            refresh['email'] = user.email
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
        token['username'] = str(user.username)
        token['email'] = user.email
        return token


class MyTokenObtainPairView(TokenObtainPairView):
    """Override for the default token pair types."""
    serializer_class = MyTokenObtainPairSerializer


class RegistrationView(APIView):
    """The registration endpoint for creating a new user"""

    @classmethod
    def post(cls, request) -> Response:
        """Creates a new user object and returns a status if successful as well as calls to activate email.
        :param request: The Http request header for the post
        :return: A response JSON type
        """
        serializer = RegistrationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
