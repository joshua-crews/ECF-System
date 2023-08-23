from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status

from .jwt_manager import *
import json

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import *
from drf_yasg.utils import swagger_auto_schema


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
            refresh['registration_number'] = str(user.registration_number)
            refresh['username'] = user.username
            refresh['email'] = user.email
            refresh['first_name'] = user.first_name
            refresh['last_name'] = user.last_name
            refresh['date_of_birth'] = str(user.date_of_birth)
            refresh['is_staff'] = user.is_staff
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
        token['registration_number'] = str(user.registration_number)
        token['username'] = str(user.username)
        token['email'] = str(user.email)
        token['first_name'] = str(user.first_name)
        token['last_name'] = str(user.last_name)
        token['date_of_birth'] = str(user.date_of_birth)
        token['is_staff'] = user.is_staff
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


class NewFormView(APIView):
    """View for establishing a new form in the database along with validation."""

    @swagger_auto_schema(
        request_body=FormSerializer,
        responses={status.HTTP_200_OK: 'Form details'},
        operation_description="Create new extenuating form"
    )
    def post(self, request, *args, **kwargs) -> Response:
        """Creates a new user object and returns a status if successful as well as calls to activate email.
        :param request: The Http request header for the post
        :return: A response JSON type
        """
        data = request.data
        if not is_valid_uuid(data['jwt_token'], True):
            return Response(status=status.HTTP_403_FORBIDDEN)
        data['student'] = decode_jwt(data['jwt_token'], True)
        data.pop('jwt_token')
        data['date_seen_start'] = data['date_seen'][0]
        data['date_seen_end'] = data['date_seen'][1]
        data.pop('date_seen')

        user = User.objects.get(id=data['student'])
        if user is not None:
            try:
                user.registration_number = data['registration_number']
                user.first_name = data['first_name']
                user.last_name = data['last_name']
                user.date_of_birth = data['date_of_birth']
            except KeyError:
                return Response(status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        serializer = FormSerializer(data=data)
        if serializer.is_valid():
            if len(data['modules']) <= 0:
                return Response(status=status.HTTP_400_BAD_REQUEST)

            form = serializer.save()
            user.save()

            for module in data['modules']:
                module_data = json.loads(module)
                module_data['extenuating_form'] = form.id
                module_serializer = ModuleSerializer(data=module_data)
                if module_serializer.is_valid():
                    module_serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class MyFormsView(APIView):

    @classmethod
    def get(cls, request):
        jwt_token = request.GET.get('jwt')
        if jwt_token is not None and is_valid_uuid(jwt_token, True):
            forms = ExtenuatingForm.objects.filter(student__exact=decode_jwt(jwt_token, True)).values(
                    "id",
                    "date_submitted",
                    "review_progress",
                    "review_stage",
                    "details"
                )
            for form in forms:
                modules = ExtenuatingFormModule.objects.filter(extenuating_form__exact=form['id']).values(
                    "module_code",
                    "assignment_type"
                )
                form['modules'] = modules
            return Response(list(forms), status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)
