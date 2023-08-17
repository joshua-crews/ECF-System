from django.urls import path
from rest_framework.schemas import get_schema_view
from django.views.generic import TemplateView

from rest_framework_simplejwt.views import TokenRefreshView

from .views import *

url_patterns = [
    path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('token/new/', NewRefreshToken.as_view()),
    path('register/', RegistrationView.as_view()),
    path('form/new/', NewFormView.as_view()),
    path('form/', MyFormsView.as_view()),
]

if settings.DEBUG:
    url_patterns.insert(0,
                        path('schema', get_schema_view(title='API Schema', description='REST API endpoints'),
                             name='schema'))
    url_patterns.insert(0, path('docs',
                                TemplateView.as_view(template_name='docs.html', extra_context={'schema_url': 'schema'}),
                                name='swagger-ui'))
urlpatterns: list = url_patterns
